/**
 * Shared test utilities — imported by every test file.
 * Keeps test files focused on assertions, not plumbing.
 */

import request from 'supertest';
import app from '../src/app.js';

// ─── Seed Data Factories ──────────────────────────────────────────────────────

export const USERS = {
  student: {
    name: 'Test Student',
    email: 'student@test.com',
    password: 'Password1',
    role: 'student',
  },
  instructor: {
    name: 'Test Instructor',
    email: 'instructor@test.com',
    password: 'Password1',
    role: 'instructor',
  },
  student2: {
    name: 'Second Student',
    email: 'student2@test.com',
    password: 'Password1',
    role: 'student',
  },
};

export const COURSE_PAYLOAD = {
  title: 'Advanced Web Development',
  description: 'A comprehensive course covering modern full-stack web development techniques.',
  category: 'Web Development',
  provider: 'Test University',
  duration: '10 weeks',
  thumbnail: 'https://example.com/thumb.jpg',
};

export const MODULE_PAYLOAD = {
  title: 'Module 1: Introduction',
  order: 1,
  videoUrl: 'https://example.com/video.mp4',
  videoOverview: 'An overview of the course structure and tools.',
};

// ─── Auth Helpers ─────────────────────────────────────────────────────────────

/**
 * Register a user and return their access token + Set-Cookie header.
 *
 * @param {object} userData
 * @returns {{ accessToken: string, cookieHeader: string, user: object }}
 */
export const registerAndLogin = async (userData) => {
  const res = await request(app)
    .post('/api/auth/register')
    .send(userData);

  expect(res.status).toBe(201);

  return {
    accessToken: res.body.data.accessToken,
    cookieHeader: res.headers['set-cookie'],
    user: res.body.data.user,
  };
};

/**
 * Returns a Supertest Authorization header value for Bearer tokens.
 *
 * @param {string} token
 * @returns {string}
 */
export const bearer = (token) => `Bearer ${token}`;

// ─── Resource Helpers ─────────────────────────────────────────────────────────

/**
 * Create a course as an instructor and return the course object.
 *
 * @param {string} instructorToken
 * @param {object} [overrides]
 * @returns {object} Created course
 */
export const createCourse = async (instructorToken, overrides = {}) => {
  const res = await request(app)
    .post('/api/courses')
    .set('Authorization', bearer(instructorToken))
    .send({ ...COURSE_PAYLOAD, ...overrides });

  expect(res.status).toBe(201);
  return res.body.data.course;
};

/**
 * Enroll a student in a course and return the enrollment.
 *
 * @param {string} studentToken
 * @param {string} courseId
 * @param {'saved'|'in-progress'} [status]
 * @returns {object} Created enrollment
 */
export const enrollStudent = async (studentToken, courseId, status = 'in-progress') => {
  // Course must be published first
  const res = await request(app)
    .post('/api/enrollments')
    .set('Authorization', bearer(studentToken))
    .send({ courseId, status });

  return res;
};
