// src/middleware/errorHandler.js
// Global error-handling middleware — must have exactly 4 parameters (err, req, res, next)
// so Express recognises it as an error handler and not a regular middleware.

/**
 * Normalises all thrown errors into a consistent JSON shape:
 *   { message: string, errors?: object }
 *
 * Handles three Mongoose-specific error types before falling through
 * to a generic 500, so callers always receive a meaningful message.
 */
const errorHandler = (err, _req, res, _next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Mongoose bad ObjectId  (e.g. /users/not-a-valid-id)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // Mongoose duplicate key  (e.g. email already registered)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    statusCode = 409;
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  }

  // Mongoose validation error  (e.g. required field missing)
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  // Log server errors in development
  if (statusCode === 500 && process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  res.status(statusCode).json({ message });
};

module.exports = errorHandler;
