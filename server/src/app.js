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
