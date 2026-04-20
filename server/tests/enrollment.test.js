/**
 * Enrollment critical-path tests
 * Covers: enroll, duplicate guard, get my enrollments, progress update,
 *         auto-completion, unenroll, instructor view
 */

import request from 'supertest';
import app from '../src/app.js';
import Course from '../src/models/Course.js';
import Module from '../src/models/Module.js';
import {
  USERS,
  MODULE_PAYLOAD,
  registerAndLogin,
  createCourse,
  enrollStudent,
  bearer,
} from './helpers.js';

let instructor, student, publishedCourse;

beforeEach(async () => {
  instructor = await registerAndLogin(USERS.instructor);
  student = await registerAndLogin(USERS.student);

  // Create and publish a course so enrollment is allowed
  const draft = await createCourse(instructor.accessToken);
  await Course.findByIdAndUpdate(draft._id, { isPublished: true });
  publishedCourse = { ...draft, isPublished: true };
});

// ─── POST /api/enrollments ────────────────────────────────────────────────────
describe('POST /api/enrollments', () => {
  it('enrolls a student in a published course', async () => {
    const res = await enrollStudent(student.accessToken, publishedCourse._id);

    expect(res.status).toBe(201);
    expect(res.body.data.enrollment.status).toBe('in-progress');
    expect(res.body.data.enrollment.progressPercent).toBe(0);
  });

  it('allows saving a course to wishlist with status=saved', async () => {
    const res = await enrollStudent(student.accessToken, publishedCourse._id, 'saved');

    expect(res.status).toBe(201);
    expect(res.body.data.enrollment.status).toBe('saved');
  });

  it('returns 409 on duplicate enrollment', async () => {
    await enrollStudent(student.accessToken, publishedCourse._id);
    const res = await enrollStudent(student.accessToken, publishedCourse._id);

    expect(res.status).toBe(409);
  });

  it('returns 400 when trying to enroll in an unpublished course', async () => {
    const draft = await createCourse(instructor.accessToken);

    const res = await request(app)
      .post('/api/enrollments')
      .set('Authorization', bearer(student.accessToken))
      .send({ courseId: draft._id, status: 'in-progress' });

    expect(res.status).toBe(400);
  });

  it('returns 400 when courseId is missing', async () => {
    const res = await request(app)
      .post('/api/enrollments')
      .set('Authorization', bearer(student.accessToken))
      .send({});

    expect(res.status).toBe(400);
  });

  it('returns 403 when an instructor tries to enroll', async () => {
    const res = await request(app)
      .post('/api/enrollments')
      .set('Authorization', bearer(instructor.accessToken))
      .send({ courseId: publishedCourse._id });

    expect(res.status).toBe(403);
  });

  it('returns 401 for unauthenticated requests', async () => {
    const res = await request(app)
      .post('/api/enrollments')
      .send({ courseId: publishedCourse._id });

    expect(res.status).toBe(401);
  });
});

// ─── GET /api/enrollments/my ──────────────────────────────────────────────────
describe('GET /api/enrollments/my', () => {
  it('returns the student\'s enrollments with course data populated', async () => {
    await enrollStudent(student.accessToken, publishedCourse._id);

    const res = await request(app)
      .get('/api/enrollments/my')
      .set('Authorization', bearer(student.accessToken));

    expect(res.status).toBe(200);
    expect(res.body.data.enrollments).toHaveLength(1);

    const enrollment = res.body.data.enrollments[0];
    // Course should be populated (not just an ObjectId string)
    expect(typeof enrollment.course).toBe('object');
    expect(enrollment.course.title).toBeDefined();
    expect(enrollment.course.provider).toBeDefined();
  });

  it('filters by status query parameter', async () => {
    await enrollStudent(student.accessToken, publishedCourse._id, 'saved');

    const inProgress = await request(app)
      .get('/api/enrollments/my?status=in-progress')
      .set('Authorization', bearer(student.accessToken));

    const saved = await request(app)
      .get('/api/enrollments/my?status=saved')
      .set('Authorization', bearer(student.accessToken));

    expect(inProgress.body.data.enrollments).toHaveLength(0);
    expect(saved.body.data.enrollments).toHaveLength(1);
  });

  it('returns 401 when unauthenticated', async () => {
    const res = await request(app).get('/api/enrollments/my');
    expect(res.status).toBe(401);
  });
});

// ─── PATCH /api/enrollments/:id/progress ─────────────────────────────────────
describe('PATCH /api/enrollments/:id/progress', () => {
  let enrollmentId, moduleId;

  beforeEach(async () => {
    // Create a module inside the published course
    const modRes = await request(app)
      .post(`/api/courses/${publishedCourse._id}/modules`)
      .set('Authorization', bearer(instructor.accessToken))
      .send(MODULE_PAYLOAD);
    moduleId = modRes.body.data.module._id;

    const enrollment = await enrollStudent(student.accessToken, publishedCourse._id);
    enrollmentId = enrollment.body.data.enrollment._id;
  });

  it('marks a module as completed and recalculates progressPercent', async () => {
    const res = await request(app)
      .patch(`/api/enrollments/${enrollmentId}/progress`)
      .set('Authorization', bearer(student.accessToken))
      .send({ moduleId, progressText: 'Module 1' });

    expect(res.status).toBe(200);
    // 1 of 1 module = 100%
    expect(res.body.data.enrollment.progressPercent).toBe(100);
    expect(res.body.data.enrollment.status).toBe('completed');
    expect(res.body.data.enrollment.completedAt).not.toBeNull();
  });

  it('does not double-count a module completed twice', async () => {
    await request(app)
      .patch(`/api/enrollments/${enrollmentId}/progress`)
      .set('Authorization', bearer(student.accessToken))
      .send({ moduleId });

    const res = await request(app)
      .patch(`/api/enrollments/${enrollmentId}/progress`)
      .set('Authorization', bearer(student.accessToken))
      .send({ moduleId });

    expect(res.status).toBe(200);
    expect(res.body.data.enrollment.progressPercent).toBe(100);
  });

  it('returns 400 when moduleId is missing', async () => {
    const res = await request(app)
      .patch(`/api/enrollments/${enrollmentId}/progress`)
      .set('Authorization', bearer(student.accessToken))
      .send({});

    expect(res.status).toBe(400);
  });

  it('returns 404 when enrollment belongs to a different student', async () => {
    const other = await registerAndLogin({ ...USERS.student, email: 'other@s.com' });

    const res = await request(app)
      .patch(`/api/enrollments/${enrollmentId}/progress`)
      .set('Authorization', bearer(other.accessToken))
      .send({ moduleId });

    expect(res.status).toBe(404);
  });
});

// ─── DELETE /api/enrollments/:id ─────────────────────────────────────────────
describe('DELETE /api/enrollments/:id', () => {
  it('removes the enrollment', async () => {
    const enr = await enrollStudent(student.accessToken, publishedCourse._id);
    const enrollmentId = enr.body.data.enrollment._id;

    const res = await request(app)
      .delete(`/api/enrollments/${enrollmentId}`)
      .set('Authorization', bearer(student.accessToken));

    expect(res.status).toBe(200);

    // Verify it is gone
    const check = await request(app)
      .get('/api/enrollments/my')
      .set('Authorization', bearer(student.accessToken));

    expect(check.body.data.enrollments).toHaveLength(0);
  });

  it('returns 404 when enrollment belongs to another student', async () => {
    const enr = await enrollStudent(student.accessToken, publishedCourse._id);
    const enrollmentId = enr.body.data.enrollment._id;

    const other = await registerAndLogin({ ...USERS.student, email: 'thief@s.com' });

    const res = await request(app)
      .delete(`/api/enrollments/${enrollmentId}`)
      .set('Authorization', bearer(other.accessToken));

    expect(res.status).toBe(404);
  });
});

// ─── GET /api/enrollments/course/:courseId ────────────────────────────────────
describe('GET /api/enrollments/course/:courseId', () => {
  it('returns all enrollments for an owned course', async () => {
    await enrollStudent(student.accessToken, publishedCourse._id);

    const res = await request(app)
      .get(`/api/enrollments/course/${publishedCourse._id}`)
      .set('Authorization', bearer(instructor.accessToken));

    expect(res.status).toBe(200);
    expect(res.body.data.enrollments).toHaveLength(1);
    expect(res.body.data.enrollments[0].student.email).toBe(USERS.student.email);
  });

  it('returns 403 for an instructor who does not own the course', async () => {
    const other = await registerAndLogin({ ...USERS.student, email: 'spy@i.com', role: 'instructor' });

    const res = await request(app)
      .get(`/api/enrollments/course/${publishedCourse._id}`)
      .set('Authorization', bearer(other.accessToken));

    expect(res.status).toBe(403);
  });
});
