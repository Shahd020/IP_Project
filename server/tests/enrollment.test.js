import request from 'supertest';
import app from '../src/app.js';
import { USERS, registerAndLogin, bearer, createCourse } from './helpers.js';

describe('POST /api/enrollments', () => {
  it('student can enroll in a published course', async () => {
    const { accessToken: instrToken } = await registerAndLogin(USERS.instructor);
    const course = await createCourse(instrToken, { isPublished: true });

    const { accessToken: stuToken } = await registerAndLogin(USERS.student);
    const res = await request(app)
      .post('/api/enrollments')
      .set('Authorization', bearer(stuToken))
      .send({ courseId: course._id });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.enrollment.course._id).toBe(course._id);
  });

  it('prevents duplicate enrollment', async () => {
    const { accessToken: instrToken } = await registerAndLogin(USERS.instructor);
    const course = await createCourse(instrToken, { isPublished: true });
    const { accessToken: stuToken } = await registerAndLogin(USERS.student);

    await request(app).post('/api/enrollments').set('Authorization', bearer(stuToken)).send({ courseId: course._id });
    const res = await request(app).post('/api/enrollments').set('Authorization', bearer(stuToken)).send({ courseId: course._id });

    expect(res.status).toBe(409);
  });

  it('instructor cannot enroll (role guard)', async () => {
    const { accessToken: instrToken } = await registerAndLogin(USERS.instructor);
    const course = await createCourse(instrToken, { isPublished: true });

    const res = await request(app)
      .post('/api/enrollments')
      .set('Authorization', bearer(instrToken))
      .send({ courseId: course._id });
    expect(res.status).toBe(403);
  });

  it('returns 400 when course is not published', async () => {
    const { accessToken: instrToken } = await registerAndLogin(USERS.instructor);
    const course = await createCourse(instrToken); // isPublished: false by default

    const { accessToken: stuToken } = await registerAndLogin(USERS.student);
    const res = await request(app)
      .post('/api/enrollments')
      .set('Authorization', bearer(stuToken))
      .send({ courseId: course._id });
    expect(res.status).toBe(400);
  });
});

describe('GET /api/enrollments/my', () => {
  it('returns the student\'s enrollments', async () => {
    const { accessToken: instrToken } = await registerAndLogin(USERS.instructor);
    const course = await createCourse(instrToken, { isPublished: true });
    const { accessToken: stuToken } = await registerAndLogin(USERS.student);

    await request(app).post('/api/enrollments').set('Authorization', bearer(stuToken)).send({ courseId: course._id });

    const res = await request(app).get('/api/enrollments/my').set('Authorization', bearer(stuToken));
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.enrollments)).toBe(true);
    expect(res.body.data.enrollments.length).toBeGreaterThan(0);
  });

  it('returns 401 without authentication', async () => {
    const res = await request(app).get('/api/enrollments/my');
    expect(res.status).toBe(401);
  });
});
