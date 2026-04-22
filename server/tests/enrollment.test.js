// tests/enrollment.test.js
const request = require('supertest');
const app = require('../src/app');
const { USERS, registerAndLogin, bearer, createCourse } = require('./helpers');

describe('POST /api/enrollments', () => {
  it('student can enroll in a published course', async () => {
    const { accessToken: instrToken } = await registerAndLogin(USERS.instructor);
    const course = await createCourse(instrToken, { status: 'published' });

    const { accessToken: stuToken } = await registerAndLogin(USERS.student);
    const res = await request(app)
      .post('/api/enrollments')
      .set('Authorization', bearer(stuToken))
      .send({ courseId: course._id });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.enrollment.course).toBe(course._id);
  });

  it('prevents duplicate enrollment', async () => {
    const { accessToken: instrToken } = await registerAndLogin(USERS.instructor);
    const course = await createCourse(instrToken, { status: 'published' });
    const { accessToken: stuToken } = await registerAndLogin(USERS.student);

    await request(app).post('/api/enrollments').set('Authorization', bearer(stuToken)).send({ courseId: course._id });
    const res = await request(app).post('/api/enrollments').set('Authorization', bearer(stuToken)).send({ courseId: course._id });

    expect(res.status).toBe(409);
  });

  it('instructor cannot enroll (role guard)', async () => {
    const { accessToken: instrToken } = await registerAndLogin(USERS.instructor);
    const course = await createCourse(instrToken, { status: 'published' });

    const res = await request(app)
      .post('/api/enrollments')
      .set('Authorization', bearer(instrToken))
      .send({ courseId: course._id });
    expect(res.status).toBe(403);
  });
});

describe('GET /api/enrollments/my', () => {
  it('returns the student\'s enrollments', async () => {
    const { accessToken: instrToken } = await registerAndLogin(USERS.instructor);
    const course = await createCourse(instrToken, { status: 'published' });
    const { accessToken: stuToken } = await registerAndLogin(USERS.student);

    await request(app).post('/api/enrollments').set('Authorization', bearer(stuToken)).send({ courseId: course._id });

    const res = await request(app).get('/api/enrollments/my').set('Authorization', bearer(stuToken));
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.enrollments)).toBe(true);
    expect(res.body.data.enrollments.length).toBeGreaterThan(0);
  });
});
