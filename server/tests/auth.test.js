import request from 'supertest';
import app from '../src/app.js';
import { USERS, bearer } from './helpers.js';

describe('POST /api/auth/register', () => {
  it('creates a student account and returns accessToken', async () => {
    const res = await request(app).post('/api/auth/register').send(USERS.student);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.user.email).toBe(USERS.student.email);
    expect(res.body.data.user.role).toBe('student');
    expect(res.body.data.user.password).toBeUndefined();
  });

  it('sets an HttpOnly refresh-token cookie', async () => {
    const res = await request(app).post('/api/auth/register').send(USERS.student);
    const cookie = res.headers['set-cookie']?.[0] ?? '';
    expect(cookie).toMatch(/refreshToken=/);
    expect(cookie).toMatch(/HttpOnly/i);
  });

  it('returns 409 when email is already registered', async () => {
    await request(app).post('/api/auth/register').send(USERS.student);
    const res = await request(app).post('/api/auth/register').send(USERS.student);
    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it('rejects missing fields with 400', async () => {
    const res = await request(app).post('/api/auth/register').send({ email: 'bad' });
    expect(res.status).toBe(400);
  });
});

describe('POST /api/auth/login', () => {
  beforeEach(async () => {
    await request(app).post('/api/auth/register').send(USERS.student);
  });

  it('returns accessToken on valid credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: USERS.student.email, password: USERS.student.password,
    });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.headers['set-cookie']?.[0]).toMatch(/refreshToken=/);
  });

  it('returns 401 on wrong password', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: USERS.student.email, password: 'wrongpassword',
    });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('returns 401 on unknown email', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'nobody@example.com', password: 'Password1!',
    });
    expect(res.status).toBe(401);
  });
});

describe('GET /api/auth/me', () => {
  it('returns the authenticated user profile', async () => {
    const reg = await request(app).post('/api/auth/register').send(USERS.student);
    const token = reg.body.data.accessToken;
    const res = await request(app).get('/api/auth/me').set('Authorization', bearer(token));
    expect(res.status).toBe(200);
    expect(res.body.data.user.email).toBe(USERS.student.email);
    expect(res.body.data.user.password).toBeUndefined();
  });

  it('returns 401 without a token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  it('returns 401 with a tampered token', async () => {
    const res = await request(app).get('/api/auth/me').set('Authorization', 'Bearer bad.token');
    expect(res.status).toBe(401);
  });
});
