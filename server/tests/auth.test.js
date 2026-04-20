/**
 * Auth critical-path tests
 * Covers: register, login, token refresh, logout, /me
 *
 * Each describe block is independent — afterEach in setup.js wipes the DB.
 */

import request from 'supertest';
import app from '../src/app.js';
import { USERS, bearer } from './helpers.js';

// ─── Register ────────────────────────────────────────────────────────────────
describe('POST /api/auth/register', () => {
  it('creates a new student account and returns an access token', async () => {
    const res = await request(app).post('/api/auth/register').send(USERS.student);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.user.email).toBe(USERS.student.email);
    expect(res.body.data.user.role).toBe('student');
    // Password must never be in the response
    expect(res.body.data.user.password).toBeUndefined();
  });

  it('sets an HttpOnly refresh-token cookie', async () => {
    const res = await request(app).post('/api/auth/register').send(USERS.student);

    expect(res.headers['set-cookie']).toBeDefined();
    const cookie = res.headers['set-cookie'][0];
    expect(cookie).toMatch(/refreshToken=/);
    expect(cookie).toMatch(/HttpOnly/i);
  });

  it('returns 409 when the email is already registered', async () => {
    await request(app).post('/api/auth/register').send(USERS.student);
    const res = await request(app).post('/api/auth/register').send(USERS.student);

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/already exists/i);
  });

  it('returns 400 when email is invalid', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...USERS.student, email: 'not-an-email' });

    expect(res.status).toBe(400);
  });

  it('returns 400 when password is too short', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...USERS.student, password: 'short' });

    expect(res.status).toBe(400);
  });

  it('returns 400 when password has no uppercase letter', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...USERS.student, password: 'alllower1' });

    expect(res.status).toBe(400);
  });

  it('returns 400 when password has no number', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...USERS.student, password: 'NoNumbers' });

    expect(res.status).toBe(400);
  });

  it('silently downgrades role to student when admin is requested', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...USERS.student, role: 'admin' });

    expect(res.status).toBe(201);
    expect(res.body.data.user.role).toBe('student');
  });

  it('returns 400 when name is missing', async () => {
    const { name: _n, ...noName } = USERS.student;
    const res = await request(app).post('/api/auth/register').send(noName);
    expect(res.status).toBe(400);
  });
});

// ─── Login ───────────────────────────────────────────────────────────────────
describe('POST /api/auth/login', () => {
  beforeEach(async () => {
    await request(app).post('/api/auth/register').send(USERS.student);
  });

  it('returns access token and cookie with valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: USERS.student.email, password: USERS.student.password });

    expect(res.status).toBe(200);
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.headers['set-cookie']).toBeDefined();
  });

  it('returns 401 for a wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: USERS.student.email, password: 'WrongPass1' });

    expect(res.status).toBe(401);
    // Must NOT hint whether it was the email or password that was wrong
    expect(res.body.message).toMatch(/invalid email or password/i);
  });

  it('returns 401 for a non-existent email', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nobody@test.com', password: 'Password1' });

    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/invalid email or password/i);
  });

  it('returns 400 when email field is missing', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ password: 'Password1' });

    expect(res.status).toBe(400);
  });
});

// ─── Refresh ─────────────────────────────────────────────────────────────────
describe('POST /api/auth/refresh', () => {
  let refreshCookie;

  beforeEach(async () => {
    const res = await request(app).post('/api/auth/register').send(USERS.student);
    refreshCookie = res.headers['set-cookie'];
  });

  it('issues a new access token when refresh cookie is valid', async () => {
    const res = await request(app)
      .post('/api/auth/refresh')
      .set('Cookie', refreshCookie);

    expect(res.status).toBe(200);
    expect(res.body.data.accessToken).toBeDefined();
    // A new refresh cookie should also be set (rotation)
    expect(res.headers['set-cookie']).toBeDefined();
  });

  it('returns 401 when no refresh cookie is present', async () => {
    const res = await request(app).post('/api/auth/refresh');
    expect(res.status).toBe(401);
  });

  it('returns 401 when the refresh token is malformed', async () => {
    const res = await request(app)
      .post('/api/auth/refresh')
      .set('Cookie', ['refreshToken=tampered.token.value; Path=/api/auth; HttpOnly']);

    expect(res.status).toBe(401);
  });
});

// ─── Logout ──────────────────────────────────────────────────────────────────
describe('POST /api/auth/logout', () => {
  let accessToken;
  let refreshCookie;

  beforeEach(async () => {
    const res = await request(app).post('/api/auth/register').send(USERS.student);
    accessToken = res.body.data.accessToken;
    refreshCookie = res.headers['set-cookie'];
  });

  it('returns 200 and clears the refresh cookie', async () => {
    const res = await request(app)
      .post('/api/auth/logout')
      .set('Authorization', bearer(accessToken))
      .set('Cookie', refreshCookie);

    expect(res.status).toBe(200);
    // The cookie should be overwritten with an expired one
    const setCookie = res.headers['set-cookie']?.[0] ?? '';
    expect(setCookie).toMatch(/refreshToken=/);
    expect(setCookie).toMatch(/Expires=Thu, 01 Jan 1970|Max-Age=0/i);
  });

  it('returns 401 when called without an access token', async () => {
    const res = await request(app).post('/api/auth/logout');
    expect(res.status).toBe(401);
  });
});

// ─── Get Me ───────────────────────────────────────────────────────────────────
describe('GET /api/auth/me', () => {
  it('returns the authenticated user profile', async () => {
    const reg = await request(app).post('/api/auth/register').send(USERS.instructor);
    const { accessToken } = reg.body.data;

    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', bearer(accessToken));

    expect(res.status).toBe(200);
    expect(res.body.data.user.email).toBe(USERS.instructor.email);
    expect(res.body.data.user.role).toBe('instructor');
    expect(res.body.data.user.password).toBeUndefined();
    expect(res.body.data.user.refreshTokens).toBeUndefined();
  });

  it('returns 401 when no token is provided', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  it('returns 401 when the access token is malformed', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer not.a.real.token');
    expect(res.status).toBe(401);
  });
});
