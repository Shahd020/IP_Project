<<<<<<< HEAD
// src/app.js
// Express app factory — separated from index.js so Supertest can import it
// without starting the server or binding to a port.
require('dotenv').config(); // load .env FIRST, before any other require reads process.env

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const { authLimiter, globalLimiter } = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');

// ── Route imports ────────────────────────────────────────────────────────────
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const moduleRoutes = require('./routes/modules');
const enrollmentRoutes = require('./routes/enrollments');
const userRoutes = require('./routes/users');
const quizRoutes = require('./routes/quiz');

const app = express();

// ── Security middleware ───────────────────────────────────────────────────────
app.use(helmet()); // sets 15+ secure HTTP response headers in one call

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true, // allow httpOnly cookies (refresh token)
  })
);

app.use(globalLimiter); // 100 req / 15 min per IP on all routes

// ── Request parsing ───────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' })); // reject payloads > 10 kb
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ── Logging (dev only) ────────────────────────────────────────────────────────
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth', authLimiter, authRoutes);   // stricter limit on auth
app.use('/api/courses', courseRoutes);
app.use('/api/courses/:courseId/modules', moduleRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/quiz', quizRoutes);

// Health-check — used by CI and monitoring tools
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

// 404 handler — must come after all valid routes
app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler — must be the LAST app.use()
app.use(errorHandler);

module.exports = app;
=======
import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import errorHandler from './middleware/errorHandler.js';

import authRoutes       from './routes/auth.routes.js';
import courseRoutes     from './routes/course.routes.js';
import moduleRoutes     from './routes/module.routes.js';
import enrollmentRoutes from './routes/enrollment.routes.js';
import userRoutes       from './routes/user.routes.js';
import forumRoutes      from './routes/forum.routes.js';

const app = express();

// ─── Security Headers ─────────────────────────────────────────────────────────
app.use(helmet());

// ─── CORS ─────────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    credentials: true, // required for HttpOnly cookie to be sent cross-origin
  })
);

// ─── Rate Limiting ────────────────────────────────────────────────────────────
/** Applied to ALL /api routes — general protection. */
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
});

/** Tighter limit on auth endpoints to prevent brute-force. */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many login attempts, please try again later.' },
});

app.use('/api', globalLimiter);
app.use('/api/auth', authLimiter);

// ─── Body Parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' })); // reject suspiciously large payloads
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// ─── Request Logging ──────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.status(200).json({ success: true, message: 'Server is running' });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth',        authRoutes);
app.use('/api/users',       userRoutes);
app.use('/api/courses',     courseRoutes);
app.use('/api/modules',     moduleRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/forum',       forumRoutes);

// ─── 404 Catch-All ────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ─── Global Error Handler (must be last) ─────────────────────────────────────
app.use(errorHandler);

export default app;
>>>>>>> 56fac7aa34891492f68c36dd546ab7420c7673a1
