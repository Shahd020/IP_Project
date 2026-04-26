// src/tests/auth.test.js
// Integration tests for the Auth flow using Supertest.
// These hit a real in-memory-style connection — set MONGO_URI to a test DB in CI.
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/User');

// ── Test lifecycle ────────────────────────────────────────────────────────────

beforeAll(async () => {
  // Use a separate test database to keep test data isolated from development data.
  const uri = process.env.MONGO_URI_TEST || process.env.MONGO_URI;
  await mongoose.connect(uri);
});

afterEach(async () => {
  // Wipe the users collection between tests so each test starts with a clean slate.
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

// ── Helpers ───────────────────────────────────────────────────────────────────

const validUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123',
};

/** Registers a user and returns the response body. */
const registerUser = (overrides = {}) =>
  request(app)
    .post('/api/auth/register')
    .send({ ...validUser, ...overrides });

// ── POST /api/auth/register ───────────────────────────────────────────────────

describe('POST /api/auth/register', () => {
  it('creates a user and returns 201 with accessToken', async () => {
    const res = await registerUser();

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body.user).toMatchObject({
      name: validUser.name,
      email: validUser.email,
      role: 'student',
    });
    // Password must NEVER appear in the response
    expect(res.body.user).not.toHaveProperty('password');
  });

  it('sets an httpOnly refreshToken cookie', async () => {
    const res = await registerUser();

    const cookies = res.headers['set-cookie'] || [];
    const hasRefreshCookie = cookies.some(
      (c) => c.startsWith('refreshToken=') && c.includes('HttpOnly')
    );
    expect(hasRefreshCookie).toBe(true);
  });

  it('returns 409 if email is already registered', async () => {
    await registerUser();
    const res = await registerUser();

    expect(res.status).toBe(409);
    expect(res.body.message).toMatch(/already registered/i);
  });

  it('returns 400 with validation errors for empty body', async () => {
    const res = await request(app).post('/api/auth/register').send({});

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('errors');
    expect(Array.isArray(res.body.errors)).toBe(true);
  });

  it('returns 400 for invalid email format', async () => {
    const res = await registerUser({ email: 'not-an-email' });

    expect(res.status).toBe(400);
    const paths = res.body.errors.map((e) => e.path);
    expect(paths).toContain('email');
  });

  it('returns 400 for password shorter than 6 characters', async () => {
    const res = await registerUser({ password: '123' });

    expect(res.status).toBe(400);
    const paths = res.body.errors.map((e) => e.path);
    expect(paths).toContain('password');
  });

  it('rejects test.com email domain (custom validator)', async () => {
    const res = await registerUser({ email: 'user@test.com' });

    expect(res.status).toBe(400);
    const msgs = res.body.errors.map((e) => e.msg);
    expect(msgs.some((m) => /test\.com/i.test(m))).toBe(true);
  });

  it('stores password as a bcrypt hash — never plain text', async () => {
    await registerUser();
    const dbUser = await User.findOne({ email: validUser.email }).select('+password');
    expect(dbUser.password).not.toBe(validUser.password);
    expect(dbUser.password).toMatch(/^\$2[ab]\$/); // bcrypt hash prefix
  });
});

// ── POST /api/auth/login ──────────────────────────────────────────────────────

describe('POST /api/auth/login', () => {
  beforeEach(async () => {
    // Register a user before each login test
    await registerUser();
  });

  it('returns 200 with accessToken for correct credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: validUser.email, password: validUser.password });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body.user.email).toBe(validUser.email);
  });

  it('returns 401 for wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: validUser.email, password: 'wrongpassword' });

    expect(res.status).toBe(401);
    // Same message for wrong password and wrong email — prevents user enumeration
    expect(res.body.message).toBe('Invalid credentials');
  });

  it('returns 401 for unregistered email', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nobody@example.com', password: 'password123' });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Invalid credentials');
  });
});

// ── GET /api/auth/me ──────────────────────────────────────────────────────────

describe('GET /api/auth/me', () => {
  it('returns the logged-in user profile with a valid token', async () => {
    const registerRes = await registerUser();
    const { accessToken } = registerRes.body;

    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.email).toBe(validUser.email);
    expect(res.body).not.toHaveProperty('password');
    expect(res.body).not.toHaveProperty('refreshTokens');
  });

  it('returns 401 without a token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  it('returns 401 for a tampered token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer tampered.token.value');

    expect(res.status).toBe(401);
  });
});
