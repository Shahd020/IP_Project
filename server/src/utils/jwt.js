import jwt from 'jsonwebtoken';

/**
 * Sign a short-lived Access Token (default 15 min).
 * Payload is intentionally minimal — only what the authenticate middleware needs.
 *
 * @param {{ id: string, role: string }} payload
 * @returns {string} Signed JWT string.
 */
export const signAccessToken = (payload) =>
  jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  });

/**
 * Sign a long-lived Refresh Token (default 7 days).
 * Stored in an HttpOnly cookie — never in localStorage.
 *
 * @param {{ id: string }} payload
 * @returns {string} Signed JWT string.
 */
export const signRefreshToken = (payload) =>
  jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  });

/**
 * Verify an Access Token.
 * @param {string} token
 * @returns {{ id: string, role: string, iat: number, exp: number }}
 * @throws {JsonWebTokenError | TokenExpiredError}
 */
export const verifyAccessToken = (token) =>
  jwt.verify(token, process.env.JWT_ACCESS_SECRET);

/**
 * Verify a Refresh Token.
 * @param {string} token
 * @returns {{ id: string, iat: number, exp: number }}
 * @throws {JsonWebTokenError | TokenExpiredError}
 */
export const verifyRefreshToken = (token) =>
  jwt.verify(token, process.env.JWT_REFRESH_SECRET);

/**
 * Cookie options for the HttpOnly refresh token cookie.
 * sameSite:'strict' defends against CSRF; secure must be true in production.
 *
 * @param {number} [maxAgeMs] - Override default 7-day lifetime (milliseconds).
 * @returns {import('express').CookieOptions}
 */
export const refreshCookieOptions = (maxAgeMs = 7 * 24 * 60 * 60 * 1000) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'none',
  maxAge: maxAgeMs,
  path: '/api/auth',
});
