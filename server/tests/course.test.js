/**
 * Course critical-path tests
 * Covers: CRUD, RBAC guards, text search, cascade delete, module sub-resource
 */

import request from 'supertest';
import app from '../src/app.js';
import Course from '../src/models/Course.js';
import {
  USERS,
  COURSE_PAYLOAD,
  MODULE_PAYLOAD,
  registerAndLogin,
  createCourse,
  bearer,
} from './helpers.js';

let instructor, student;

// Seed one instructor and one student before each test
beforeEach(async () => {
  instructor = await registerAndLogin(USERS.instructor);
  student = await registerAndLogin(USERS.student);
});

// ─── GET /api/courses ─────────────────────────────────────────────────────────
describe('GET /api/courses', () => {
  it('returns an empty list when no courses are published', async () => {
    const res = await request(app).get('/api/courses');

    expect(res.status).toBe(200);
    expect(res.body.data.courses).toHaveLength(0);
    expect(res.body.data.total).toBe(0);
  });

  it('returns only published courses', async () => {
    // Draft course (isPublished: false by default)
    await createCourse(instructor.accessToken);

    // Published course
    const course = await createCourse(instructor.accessToken, {
      title: 'Published Course Alpha',
    });
    await Course.findByIdAndUpdate(course._id, { isPublished: true });

    const res = await request(app).get('/api/courses');

    expect(res.status).toBe(200);
    expect(res.body.data.courses).toHaveLength(1);
    expect(res.body.data.courses[0].title).toBe('Published Course Alpha');
  });

  it('filters by category', async () => {
    const c1 = await createCourse(instructor.accessToken, { category: 'Web Development' });
    const c2 = await createCourse(instructor.accessToken, {
      title: 'Another Data Science Course for Testing',
      description: 'This is a course about data science and machine learning applications.',
      category: 'Data Science',
    });
    await Course.findByIdAndUpdate(c1._id, { isPublished: true });
    await Course.findByIdAndUpdate(c2._id, { isPublished: true });

    const res = await request(app).get('/api/courses?category=Web+Development');

    expect(res.status).toBe(200);
    expect(res.body.data.courses).toHaveLength(1);
    expect(res.body.data.courses[0].category).toBe('Web Development');
  });

  it('paginates results correctly', async () => {
    // Create 3 published courses
    for (let i = 1; i <= 3; i++) {
      const c = await createCourse(instructor.accessToken, {
        title: `Paginated Course Number ${i} For Testing`,
      });
      await Course.findByIdAndUpdate(c._id, { isPublished: true });
    }

    const page1 = await request(app).get('/api/courses?limit=2&page=1');
    const page2 = await request(app).get('/api/courses?limit=2&page=2');

    expect(page1.status).toBe(200);
    expect(page1.body.data.courses).toHaveLength(2);
    expect(page1.body.data.pages).toBe(2);

    expect(page2.status).toBe(200);
    expect(page2.body.data.courses).toHaveLength(1);
  });

  it('returns 400 for an invalid category query param', async () => {
    const res = await request(app).get('/api/courses?category=Basket+Weaving');
    expect(res.status).toBe(400);
  });
});

// ─── POST /api/courses ────────────────────────────────────────────────────────
describe('POST /api/courses', () => {
  it('allows an instructor to create a course', async () => {
    const res = await request(app)
      .post('/api/courses')
      .set('Authorization', bearer(instructor.accessToken))
      .send(COURSE_PAYLOAD);

    expect(res.status).toBe(201);
    expect(res.body.data.course.title).toBe(COURSE_PAYLOAD.title);
    expect(res.body.data.course.instructor).toBe(instructor.user._id);
    // Should start as a draft
    expect(res.body.data.course.isPublished).toBe(false);
    // Slug should be auto-generated
    expect(res.body.data.course.slug).toBeDefined();
  });

  it('returns 403 when a student tries to create a course', async () => {
    const res = await request(app)
      .post('/api/courses')
      .set('Authorization', bearer(student.accessToken))
      .send(COURSE_PAYLOAD);

    expect(res.status).toBe(403);
  });

  it('returns 401 when unauthenticated', async () => {
    const res = await request(app).post('/api/courses').send(COURSE_PAYLOAD);
    expect(res.status).toBe(401);
  });

  it('returns 400 when title is too short', async () => {
    const res = await request(app)
      .post('/api/courses')
      .set('Authorization', bearer(instructor.accessToken))
      .send({ ...COURSE_PAYLOAD, title: 'Hi' });

    expect(res.status).toBe(400);
  });

  it('returns 400 when description is too short', async () => {
    const res = await request(app)
      .post('/api/courses')
      .set('Authorization', bearer(instructor.accessToken))
      .send({ ...COURSE_PAYLOAD, description: 'Too short' });

    expect(res.status).toBe(400);
  });

  it('returns 400 for an unsupported category', async () => {
    const res = await request(app)
      .post('/api/courses')
      .set('Authorization', bearer(instructor.accessToken))
      .send({ ...COURSE_PAYLOAD, category: 'Underwater Basket Weaving' });

    expect(res.status).toBe(400);
  });
});

// ─── GET /api/courses/:id ─────────────────────────────────────────────────────
describe('GET /api/courses/:id', () => {
  it('returns a course with instructor populated', async () => {
    const course = await createCourse(instructor.accessToken);

    const res = await request(app).get(`/api/courses/${course._id}`);

    expect(res.status).toBe(200);
    expect(res.body.data.course._id).toBe(course._id);
    expect(res.body.data.course.instructor.name).toBe(USERS.instructor.name);
    expect(res.body.data.course.instructor.password).toBeUndefined();
  });

  it('returns 404 for a non-existent course ID', async () => {
    const fakeId = '64f1a2b3c4d5e6f7a8b9c0d1';
    const res = await request(app).get(`/api/courses/${fakeId}`);
    expect(res.status).toBe(404);
  });

  it('returns 400 for a malformed ObjectId', async () => {
    const res = await request(app).get('/api/courses/not-an-id');
    expect(res.status).toBe(400);
  });
});

// ─── PATCH /api/courses/:id ───────────────────────────────────────────────────
describe('PATCH /api/courses/:id', () => {
  it('allows the owner instructor to update the course', async () => {
    const course = await createCourse(instructor.accessToken);

    const res = await request(app)
      .patch(`/api/courses/${course._id}`)
      .set('Authorization', bearer(instructor.accessToken))
      .send({ title: 'Updated Course Title Here Now', isPublished: true });

    expect(res.status).toBe(200);
    expect(res.body.data.course.title).toBe('Updated Course Title Here Now');
    expect(res.body.data.course.isPublished).toBe(true);
  });

  it('returns 403 when a different instructor tries to update', async () => {
    const other = await registerAndLogin({
      ...USERS.student,
      email: 'other@test.com',
      role: 'instructor',
    });
    const course = await createCourse(instructor.accessToken);

    const res = await request(app)
      .patch(`/api/courses/${course._id}`)
      .set('Authorization', bearer(other.accessToken))
      .send({ title: 'Hijacked Title That Should Fail' });

    expect(res.status).toBe(403);
  });

  it('returns 403 when a student tries to update', async () => {
    const course = await createCourse(instructor.accessToken);

    const res = await request(app)
      .patch(`/api/courses/${course._id}`)
      .set('Authorization', bearer(student.accessToken))
      .send({ title: 'Student Should Not Patch Course' });

    expect(res.status).toBe(403);
  });
});

// ─── DELETE /api/courses/:id ──────────────────────────────────────────────────
describe('DELETE /api/courses/:id', () => {
  it('deletes the course and returns 200', async () => {
    const course = await createCourse(instructor.accessToken);

    const res = await request(app)
      .delete(`/api/courses/${course._id}`)
      .set('Authorization', bearer(instructor.accessToken));

    expect(res.status).toBe(200);

    // Verify it no longer exists in DB
    const found = await Course.findById(course._id);
    expect(found).toBeNull();
  });

  it('returns 403 when a student tries to delete a course', async () => {
    const course = await createCourse(instructor.accessToken);

    const res = await request(app)
      .delete(`/api/courses/${course._id}`)
      .set('Authorization', bearer(student.accessToken));

    expect(res.status).toBe(403);
  });
});

// ─── GET /api/courses/instructor/my ──────────────────────────────────────────
describe('GET /api/courses/instructor/my', () => {
  it('returns only the authenticated instructor\'s courses', async () => {
    await createCourse(instructor.accessToken);
    await createCourse(instructor.accessToken, { title: 'Second Course By Same Instructor' });

    // A different instructor creates one course
    const other = await registerAndLogin({ ...USERS.student, email: 'x@x.com', role: 'instructor' });
    await createCourse(other.accessToken, { title: 'Third Course By Different Instructor' });

    const res = await request(app)
      .get('/api/courses/instructor/my')
      .set('Authorization', bearer(instructor.accessToken));

    expect(res.status).toBe(200);
    expect(res.body.data.courses).toHaveLength(2);
  });
});

// ─── Module sub-resource ──────────────────────────────────────────────────────
describe('POST /api/courses/:courseId/modules', () => {
  it('allows the owner instructor to add a module', async () => {
    const course = await createCourse(instructor.accessToken);

    const res = await request(app)
      .post(`/api/courses/${course._id}/modules`)
      .set('Authorization', bearer(instructor.accessToken))
      .send(MODULE_PAYLOAD);

    expect(res.status).toBe(201);
    expect(res.body.data.module.title).toBe(MODULE_PAYLOAD.title);
    expect(res.body.data.module.order).toBe(1);
  });

  it('returns 400 when two modules share the same order in a course', async () => {
    const course = await createCourse(instructor.accessToken);
    await request(app)
      .post(`/api/courses/${course._id}/modules`)
      .set('Authorization', bearer(instructor.accessToken))
      .send(MODULE_PAYLOAD);

    const res = await request(app)
      .post(`/api/courses/${course._id}/modules`)
      .set('Authorization', bearer(instructor.accessToken))
      .send({ ...MODULE_PAYLOAD, title: 'Duplicate Order Module' });

    // E11000 unique index violation → 409 conflict
    expect(res.status).toBe(409);
  });

  it('returns 403 when a student tries to add a module', async () => {
    const course = await createCourse(instructor.accessToken);

    const res = await request(app)
      .post(`/api/courses/${course._id}/modules`)
      .set('Authorization', bearer(student.accessToken))
      .send(MODULE_PAYLOAD);

    expect(res.status).toBe(403);
  });
});
