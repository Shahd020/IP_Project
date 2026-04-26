import request from 'supertest';
import app from '../src/app.js';

export const USERS = {
  student:    { name: 'Test Student',    email: 'student@example.com',    password: 'Password1!', role: 'student' },
  instructor: { name: 'Test Instructor', email: 'instructor@example.com', password: 'Password1!', role: 'instructor' },
  admin:      { name: 'Test Admin',      email: 'admin@example.com',      password: 'Password1!', role: 'admin' },
  student2:   { name: 'Second Student',  email: 'student2@example.com',   password: 'Password1!', role: 'student' },
};

export const COURSE_PAYLOAD = {
  title: 'Advanced Web Development',
  description: 'A comprehensive course covering modern full-stack web development techniques and practices.',
  category: 'Web Development',
  provider: 'Test Academy',
  duration: '10 weeks',
  thumbnail: 'https://example.com/thumb.jpg',
};

export const MODULE_PAYLOAD = {
  title: 'Introduction to JavaScript',
  order: 1,
  description: 'Basic JavaScript concepts for beginners',
  videoOverview: 'In this module we cover the fundamentals of JavaScript programming.',
};

export const bearer = (token) => `Bearer ${token}`;

export const registerAndLogin = async (userData) => {
  const res = await request(app).post('/api/auth/register').send(userData);
  if (res.status !== 201) throw new Error(`Register failed: ${JSON.stringify(res.body)}`);
  return {
    accessToken: res.body.data.accessToken,
    cookieHeader: res.headers['set-cookie'],
    user: res.body.data.user,
  };
};

export const createCourse = async (instructorToken, overrides = {}) => {
  const res = await request(app)
    .post('/api/courses')
    .set('Authorization', bearer(instructorToken))
    .send({ ...COURSE_PAYLOAD, ...overrides });
  if (res.status !== 201) throw new Error(`Create course failed: ${JSON.stringify(res.body)}`);
  return res.body.data.course;
};

export const enrollStudent = async (studentToken, courseId) => {
  const res = await request(app)
    .post('/api/enrollments')
    .set('Authorization', bearer(studentToken))
    .send({ courseId });
  if (res.status !== 201) throw new Error(`Enroll failed: ${JSON.stringify(res.body)}`);
  return res.body.data.enrollment;
};
