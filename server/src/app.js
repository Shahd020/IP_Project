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
const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
const allowedOrigins = [
  clientOrigin,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:4173', // vite preview
  'http://localhost:4174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://127.0.0.1:4173', // vite preview
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, // required for HttpOnly cookie to be sent cross-origin
  })
);

// ─── Rate Limiting ────────────────────────────────────────────────────────────
// Disabled in the test environment so supertest suites don't exhaust the budget.
const skipInTest = () => process.env.NODE_ENV === 'test';

/** Applied to ALL /api routes — general protection. */
const globalLimiter = rateLimit({
  skip: skipInTest,
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
});

/** Tighter limit on auth endpoints to prevent brute-force. */
const authLimiter = rateLimit({
  skip: skipInTest,
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
