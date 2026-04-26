/**
 * User management critical-path tests
 * Covers: list users, get user, update profile, toggle-active, delete
 *
 * Admin accounts cannot be created via the register endpoint (it downgrades
 * to student), so admin users are seeded directly via the User model.
 */

import request from 'supertest';
import app from '../src/app.js';
import User from '../src/models/User.js';
import { USERS, registerAndLogin, bearer } from './helpers.js';

let admin, instructor, student;

beforeEach(async () => {
  // Create admin directly — the pre-save hook hashes the password
  await User.create({ name: 'Test Admin', email: 'admin@test.com', password: 'Admin1234!', role: 'admin' });
  const adminLogin = await request(app).post('/api/auth/login').send({ email: 'admin@test.com', password: 'Admin1234!' });
  admin = { accessToken: adminLogin.body.data.accessToken, user: adminLogin.body.data.user };

  instructor = await registerAndLogin(USERS.instructor);
  student    = await registerAndLogin(USERS.student);
});

// ─── GET /api/users ───────────────────────────────────────────────────────────
describe('GET /api/users', () => {
  it('returns all users for an admin', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', bearer(admin.accessToken));

    expect(res.status).toBe(200);
    expect(res.body.data.users.length).toBeGreaterThanOrEqual(3);
  });

  it('returns 403 when a student tries to list users', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', bearer(student.accessToken));

    expect(res.status).toBe(403);
  });

  it('returns 401 when unauthenticated', async () => {
    const res = await request(app).get('/api/users');
    expect(res.status).toBe(401);
  });

  it('filters by role query parameter', async () => {
    const res = await request(app)
      .get('/api/users?role=instructor')
      .set('Authorization', bearer(admin.accessToken));

    expect(res.status).toBe(200);
    expect(res.body.data.users.every((u) => u.role === 'instructor')).toBe(true);
  });
});

// ─── GET /api/users/:id ───────────────────────────────────────────────────────
describe('GET /api/users/:id', () => {
  it('admin can get any user by id', async () => {
    const res = await request(app)
      .get(`/api/users/${student.user._id}`)
      .set('Authorization', bearer(admin.accessToken));

    expect(res.status).toBe(200);
    expect(res.body.data.user.email).toBe(USERS.student.email);
  });

  it('a user can view their own profile', async () => {
    const res = await request(app)
      .get(`/api/users/${student.user._id}`)
      .set('Authorization', bearer(student.accessToken));

    expect(res.status).toBe(200);
  });

  it('returns 403 when a student views another user profile', async () => {
    const res = await request(app)
      .get(`/api/users/${instructor.user._id}`)
      .set('Authorization', bearer(student.accessToken));

    expect(res.status).toBe(403);
  });

  it('returns 404 for a non-existent user', async () => {
    const res = await request(app)
      .get('/api/users/000000000000000000000001')
      .set('Authorization', bearer(admin.accessToken));

    expect(res.status).toBe(404);
  });
});

// ─── PATCH /api/users/:id ─────────────────────────────────────────────────────
describe('PATCH /api/users/:id', () => {
  it('a student can update their own name', async () => {
    const res = await request(app)
      .patch(`/api/users/${student.user._id}`)
      .set('Authorization', bearer(student.accessToken))
      .send({ name: 'Updated Name' });

    expect(res.status).toBe(200);
    expect(res.body.data.user.name).toBe('Updated Name');
  });

  it('admin can update any user', async () => {
    const res = await request(app)
      .patch(`/api/users/${instructor.user._id}`)
      .set('Authorization', bearer(admin.accessToken))
      .send({ name: 'Admin Changed Name' });

    expect(res.status).toBe(200);
    expect(res.body.data.user.name).toBe('Admin Changed Name');
  });

  it('returns 403 when a student tries to update another user', async () => {
    const res = await request(app)
      .patch(`/api/users/${instructor.user._id}`)
      .set('Authorization', bearer(student.accessToken))
      .send({ name: 'Hacked' });

    expect(res.status).toBe(403);
  });
});

// ─── PATCH /api/users/:id/toggle-active ──────────────────────────────────────
describe('PATCH /api/users/:id/toggle-active', () => {
  it('admin can deactivate a user', async () => {
    const res = await request(app)
      .patch(`/api/users/${student.user._id}/toggle-active`)
      .set('Authorization', bearer(admin.accessToken));

    expect(res.status).toBe(200);
    expect(res.body.data.user.isActive).toBe(false);
  });

  it('returns 403 when a non-admin tries to toggle active', async () => {
    const res = await request(app)
      .patch(`/api/users/${student.user._id}/toggle-active`)
      .set('Authorization', bearer(instructor.accessToken));

    expect(res.status).toBe(403);
  });
});

// ─── DELETE /api/users/:id ────────────────────────────────────────────────────
describe('DELETE /api/users/:id', () => {
  it('admin can delete a user', async () => {
    const res = await request(app)
      .delete(`/api/users/${student.user._id}`)
      .set('Authorization', bearer(admin.accessToken));

    expect(res.status).toBe(200);
  });

  it('returns 403 when a non-admin tries to delete', async () => {
    const res = await request(app)
      .delete(`/api/users/${student.user._id}`)
      .set('Authorization', bearer(instructor.accessToken));

    expect(res.status).toBe(403);
  });

  it('returns 404 when deleting a non-existent user', async () => {
    const res = await request(app)
      .delete('/api/users/000000000000000000000001')
      .set('Authorization', bearer(admin.accessToken));

    expect(res.status).toBe(404);
  });
});
