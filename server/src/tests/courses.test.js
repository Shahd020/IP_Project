// src/tests/courses.test.js
// Integration tests for the Courses API — CRUD + RBAC enforcement.
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/User');
const Course = require('../models/Course');

// ── Lifecycle ─────────────────────────────────────────────────────────────────

beforeAll(async () => {
  const uri = process.env.MONGO_URI_TEST || process.env.MONGO_URI;
  await mongoose.connect(uri);
});

afterEach(async () => {
  await Course.deleteMany({});
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Registers a user and returns { accessToken, userId }. */
const registerAndLogin = async (role = 'student') => {
  const email = `${role}_${Date.now()}@example.com`;
  const res = await request(app)
    .post('/api/auth/register')
    .send({ name: `Test ${role}`, email, password: 'password123', role });

  return { accessToken: res.body.accessToken, userId: res.body.user.id };
};

const validCourse = {
  title: 'Introduction to React',
  description: 'Learn React from scratch in this comprehensive course.',
  category: 'Technology',
  price: 49.99,
  level: 'beginner',
};

// ── GET /api/courses (public catalog) ────────────────────────────────────────

describe('GET /api/courses', () => {
  it('returns an empty array when no published courses exist', async () => {
    const res = await request(app).get('/api/courses');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('returns only published courses', async () => {
    // Create an instructor and a published course directly in DB for speed
    const { accessToken } = await registerAndLogin('instructor');
    await request(app)
      .post('/api/courses')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(validCourse); // defaults to 'draft'

    const res = await request(app).get('/api/courses');
    expect(res.status).toBe(200);
    // Draft course must NOT appear in the public catalog
    expect(res.body.length).toBe(0);
  });
});

// ── POST /api/courses ─────────────────────────────────────────────────────────

describe('POST /api/courses', () => {
  it('instructor can create a course and receives 201', async () => {
    const { accessToken } = await registerAndLogin('instructor');

    const res = await request(app)
      .post('/api/courses')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(validCourse);

    expect(res.status).toBe(201);
    expect(res.body.title).toBe(validCourse.title);
    expect(res.body.status).toBe('draft');
  });

  it('student cannot create a course — returns 403', async () => {
    const { accessToken } = await registerAndLogin('student');

    const res = await request(app)
      .post('/api/courses')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(validCourse);

    expect(res.status).toBe(403);
  });

  it('unauthenticated request returns 401', async () => {
    const res = await request(app).post('/api/courses').send(validCourse);
    expect(res.status).toBe(401);
  });

  it('returns 400 for missing required fields', async () => {
    const { accessToken } = await registerAndLogin('instructor');

    const res = await request(app)
      .post('/api/courses')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ title: 'No description or category' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('errors');
  });
});

// ── PATCH /api/courses/:id ────────────────────────────────────────────────────

describe('PATCH /api/courses/:id', () => {
  it('owner instructor can update their own course', async () => {
    const { accessToken } = await registerAndLogin('instructor');

    const createRes = await request(app)
      .post('/api/courses')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(validCourse);

    const courseId = createRes.body._id;

    const res = await request(app)
      .patch(`/api/courses/${courseId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ title: 'Updated Title', status: 'published' });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Updated Title');
    expect(res.body.status).toBe('published');
  });

  it('a different instructor cannot update another instructor\'s course — 403', async () => {
    const owner = await registerAndLogin('instructor');
    const other = await registerAndLogin('instructor');

    const createRes = await request(app)
      .post('/api/courses')
      .set('Authorization', `Bearer ${owner.accessToken}`)
      .send(validCourse);

    const courseId = createRes.body._id;

    const res = await request(app)
      .patch(`/api/courses/${courseId}`)
      .set('Authorization', `Bearer ${other.accessToken}`)
      .send({ title: 'Hijacked Title' });

    expect(res.status).toBe(403);
  });
});

// ── DELETE /api/courses/:id ───────────────────────────────────────────────────

describe('DELETE /api/courses/:id', () => {
  it('owner instructor can delete their course — 204', async () => {
    const { accessToken } = await registerAndLogin('instructor');

    const createRes = await request(app)
      .post('/api/courses')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(validCourse);

    const courseId = createRes.body._id;

    const res = await request(app)
      .delete(`/api/courses/${courseId}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(204);

    // Verify it no longer exists in the DB
    const gone = await Course.findById(courseId);
    expect(gone).toBeNull();
  });

  it('student cannot delete a course — 403', async () => {
    const instructor = await registerAndLogin('instructor');
    const student = await registerAndLogin('student');

    const createRes = await request(app)
      .post('/api/courses')
      .set('Authorization', `Bearer ${instructor.accessToken}`)
      .send(validCourse);

    const res = await request(app)
      .delete(`/api/courses/${createRes.body._id}`)
      .set('Authorization', `Bearer ${student.accessToken}`);

    expect(res.status).toBe(403);
  });

  it('returns 404 for a non-existent course ID', async () => {
    const { accessToken } = await registerAndLogin('instructor');
    const fakeId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .delete(`/api/courses/${fakeId}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(404);
  });
});
