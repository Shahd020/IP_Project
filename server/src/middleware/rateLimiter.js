// src/middleware/rateLimiter.js
const rateLimit = require('express-rate-limit');

/**
 * Strict limiter for authentication routes.
 * 10 requests per 15 minutes per IP — makes brute-force password attacks
 * impractical without blocking legitimate users.
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,  // include RateLimit-* headers in response
  legacyHeaders: false,
  message: { message: 'Too many requests from this IP, please try again after 15 minutes' },
});

/**
 * Relaxed limiter applied globally to all API routes.
 * 100 requests per 15 minutes per IP — prevents DoS without blocking normal usage.
 */
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please slow down' },
});

module.exports = { authLimiter, globalLimiter };
