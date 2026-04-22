// tests/course.test.js
const request = require('supertest');
const app = require('../src/app');
const { USERS, COURSE_PAYLOAD, registerAndLogin, bearer, createCourse } = require('./helpers');

describe('GET /api/courses (catalog)', () => {
  it('returns empty array when no courses exist', async () => {
    const res = await request(app).get('/api/courses');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.courses)).toBe(true);
  });

  it('returns only published courses', async () => {
    const { accessToken } = await registerAndLogin(USERS.instructor);
    await createCourse(accessToken, { status: 'draft' });
    await createCourse(accessToken, { status: 'published', title: 'Published Course' });

    const res = await request(app).get('/api/courses');
    expect(res.body.data.courses.every((c) => c.status === 'published')).toBe(true);
  });
});

describe('POST /api/courses', () => {
  it('instructor can create a course', async () => {
    const { accessToken } = await registerAndLogin(USERS.instructor);
    const res = await request(app)
      .post('/api/courses')
      .set('Authorization', bearer(accessToken))
      .send(COURSE_PAYLOAD);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.course.title).toBe(COURSE_PAYLOAD.title);
  });

  it('student cannot create a course', async () => {
    const { accessToken } = await registerAndLogin(USERS.student);
    const res = await request(app)
      .post('/api/courses')
      .set('Authorization', bearer(accessToken))
      .send(COURSE_PAYLOAD);
    expect(res.status).toBe(403);
  });

  it('returns 401 without authentication', async () => {
    const res = await request(app).post('/api/courses').send(COURSE_PAYLOAD);
    expect(res.status).toBe(401);
  });
});

describe('GET /api/courses/:id', () => {
  it('returns a course by id', async () => {
    const { accessToken } = await registerAndLogin(USERS.instructor);
    const course = await createCourse(accessToken);

    const res = await request(app).get(`/api/courses/${course._id}`);
    expect(res.status).toBe(200);
    expect(res.body.data.course._id).toBe(course._id);
  });

  it('returns 400 for invalid ObjectId', async () => {
    const res = await request(app).get('/api/courses/not-a-valid-id');
    expect(res.status).toBe(400);
  });
});

describe('PATCH /api/courses/:id', () => {
  it('instructor can update their own course', async () => {
    const { accessToken } = await registerAndLogin(USERS.instructor);
    const course = await createCourse(accessToken);

    const res = await request(app)
      .patch(`/api/courses/${course._id}`)
      .set('Authorization', bearer(accessToken))
      .send({ title: 'Updated Title' });
    expect(res.status).toBe(200);
    expect(res.body.data.course.title).toBe('Updated Title');
  });

  it('another instructor cannot update someone else\'s course', async () => {
    const { accessToken: token1 } = await registerAndLogin(USERS.instructor);
    const { accessToken: token2 } = await registerAndLogin(USERS.instructor2 || { ...USERS.instructor, email: 'instr2@example.com' });
    const course = await createCourse(token1);

    const res = await request(app)
      .patch(`/api/courses/${course._id}`)
      .set('Authorization', bearer(token2))
      .send({ title: 'Hacked' });
    expect(res.status).toBe(403);
  });
});

describe('DELETE /api/courses/:id', () => {
  it('instructor can delete their own course', async () => {
    const { accessToken } = await registerAndLogin(USERS.instructor);
    const course = await createCourse(accessToken);

    const res = await request(app)
      .delete(`/api/courses/${course._id}`)
      .set('Authorization', bearer(accessToken));
    expect(res.status).toBe(204);
  });
});
