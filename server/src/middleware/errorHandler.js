const mongoose = require('mongoose');
const { Sentry } = require('../config/sentry.js');
const ApiError = require('../utils/ApiError.js');
const normaliseError = (err) => {
  if (err instanceof mongoose.Error.CastError) {
    return ApiError.badRequest(`Invalid value for field: ${err.path}`);
  }

  if (err instanceof mongoose.Error.ValidationError) {
    const messages = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
    return ApiError.badRequest(messages);
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return ApiError.conflict(`${field} already exists`);
  }

  if (err.name === 'JsonWebTokenError') {
    return ApiError.unauthorized('Invalid token');
  }

  if (err.name === 'TokenExpiredError') {
    return ApiError.unauthorized('Token has expired');
  }

  if (err instanceof ApiError) return err;

  return new ApiError(500, 'Internal server error', false);
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, _next) => {
  const apiError = normaliseError(err);

  if (!apiError.isOperational || process.env.NODE_ENV === 'production') {
    Sentry?.captureException(err);
  }

  if (process.env.NODE_ENV !== 'production') {
    console.error(`[${req.method} ${req.originalUrl}]`, err);
  }

  res.status(apiError.statusCode).json({
    success: false,
    message: apiError.isOperational
      ? apiError.message
      : 'Something went wrong. Please try again later.',
    ...(process.env.NODE_ENV !== 'production' &&
      !apiError.isOperational && {
        stack: err.stack,
      }),
  });
};

module.exports = errorHandler;