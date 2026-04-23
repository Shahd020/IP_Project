require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const errorHandler     = require('./middleware/errorHandler.js');
const authRoutes       = require('./routes/auth.routes.js');
const courseRoutes     = require('./routes/course.routes.js');
const moduleRoutes     = require('./routes/module.routes.js');
const enrollmentRoutes = require('./routes/enrollment.routes.js');
const userRoutes       = require('./routes/user.routes.js');
const forumRoutes      = require('./routes/forum.routes.js');

const app = express();

const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

if (process.env.NODE_ENV !== 'production') {
  allowedOrigins.push(
    'http://127.0.0.1:4173',
    'http://localhost:4173',
    'http://127.0.0.1:5173'
  );
}

app.use(helmet());

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true,
  })
);

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many login attempts, please try again later.' },
});

if (process.env.NODE_ENV !== 'test') {
  app.use('/api', globalLimiter);
  app.use('/api/auth', authLimiter);
}

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

app.get('/api/health', (_req, res) => {
  res.status(200).json({ success: true, message: 'Server is running' });
});

app.use('/api/auth',        authRoutes);
app.use('/api/users',       userRoutes);
app.use('/api/courses',     courseRoutes);
app.use('/api/modules',     moduleRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/forum',       forumRoutes);

app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use(errorHandler);

module.exports = app;