// tests/helpers.js — shared test utilities
const request = require('supertest');
const app = require('../src/app');

const USERS = {
  student: { name: 'Test Student', email: 'student@example.com', password: 'Password1!', role: 'student' },
  instructor: { name: 'Test Instructor', email: 'instructor@example.com', password: 'Password1!', role: 'instructor' },
  admin: { name: 'Test Admin', email: 'admin@example.com', password: 'Password1!', role: 'admin' },
  student2: { name: 'Second Student', email: 'student2@example.com', password: 'Password1!', role: 'student' },
};

const COURSE_PAYLOAD = {
  title: 'Advanced Web Development',
  description: 'A comprehensive course covering modern full-stack web development techniques and practices.',
  category: 'Technology',
  level: 'intermediate',
  price: 99,
  thumbnail: 'https://example.com/thumb.jpg',
};

const registerAndLogin = async (userData) => {
  const res = await request(app).post('/api/auth/register').send(userData);
  if (res.status !== 201) throw new Error(`Register failed: ${JSON.stringify(res.body)}`);
  return {
    accessToken: res.body.data.accessToken,
    cookieHeader: res.headers['set-cookie'],
    user: res.body.data.user,
  };
};

const bearer = (token) => `Bearer ${token}`;

const createCourse = async (instructorToken, overrides = {}) => {
  const res = await request(app)
    .post('/api/courses')
    .set('Authorization', bearer(instructorToken))
    .send({ ...COURSE_PAYLOAD, ...overrides });
  if (res.status !== 201) throw new Error(`Create course failed: ${JSON.stringify(res.body)}`);
  return res.body.data.course;
};

module.exports = { USERS, COURSE_PAYLOAD, registerAndLogin, bearer, createCourse };
