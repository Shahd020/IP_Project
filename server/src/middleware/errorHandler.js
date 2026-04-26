import mongoose from 'mongoose';
import { Sentry } from '../config/sentry.js';
import ApiError from '../utils/ApiError.js';

/**
 * Normalises known Mongoose/driver errors into ApiError instances so
 * the response formatter below has a consistent shape to work with.
 *
 * @param {Error} err
 * @returns {ApiError}
 */
const normaliseError = (err) => {
  // Mongoose CastError — invalid ObjectId in a URL param (e.g. /courses/abc)
  if (err instanceof mongoose.Error.CastError) {
    return ApiError.badRequest(`Invalid value for field: ${err.path}`);
  }

  // Mongoose ValidationError — schema-level validation failed
  if (err instanceof mongoose.Error.ValidationError) {
    const messages = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
    return ApiError.badRequest(messages);
  }

  // MongoDB duplicate key (E11000) — e.g. email already registered
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return ApiError.conflict(`${field} already exists`);
  }

  // JWT errors (malformed token, wrong secret)
  if (err.name === 'JsonWebTokenError') {
    return ApiError.unauthorized('Invalid token');
  }

  // JWT expired
  if (err.name === 'TokenExpiredError') {
    return ApiError.unauthorized('Token has expired');
  }

  // Already an ApiError — pass through unchanged
  if (err instanceof ApiError) return err;

  // Unknown / programmer error
  return new ApiError(500, 'Internal server error', false);
};

/**
 * Global error-handling middleware — must be the LAST middleware registered
 * in app.js (Express identifies it by the 4-parameter signature).
 *
 * Operational errors (isOperational: true) surface their real message.
 * Non-operational errors (bugs) log the stack and return a generic 500
 * so internal implementation details are never exposed to the client.
 *
 * @type {import('express').ErrorRequestHandler}
 */
const errorHandler = (err, req, res, _next) => {
  const apiError = normaliseError(err);

  // Report unexpected errors to Sentry (skip operational errors in dev to reduce noise)
  if (!apiError.isOperational || process.env.NODE_ENV === 'production') {
    Sentry?.captureException(err);
  }

  // Log stack in development for easy debugging
  if (process.env.NODE_ENV !== 'production') {
    console.error(`[${req.method} ${req.originalUrl}]`, err);
  }

  res.status(apiError.statusCode).json({
    success: false,
    message: apiError.isOperational
      ? apiError.message
      : 'Something went wrong. Please try again later.',
    ...(process.env.NODE_ENV !== 'production' && !apiError.isOperational && {
      stack: err.stack,
    }),
  });
};

export default errorHandler;
