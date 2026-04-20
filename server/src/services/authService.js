// src/services/authService.js
// All authentication business logic lives here.
// Controllers call these functions and only handle HTTP request/response.
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ── Token helpers ─────────────────────────────────────────────────────────────

/**
 * Signs a short-lived Access Token (15 min by default).
 * Payload contains only userId and role — minimum needed to authorise requests.
 * @param {string} userId
 * @param {string} role
 * @returns {string} signed JWT
 */
const signAccessToken = (userId, role) =>
  jwt.sign({ userId, role }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '15m',
  });

/**
 * Signs a long-lived Refresh Token (7 days by default).
 * Contains only userId — role is re-read from DB on every refresh.
 * @param {string} userId
 * @returns {string} signed JWT
 */
const signRefreshToken = (userId) =>
  jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
  });

// ── Public service functions ──────────────────────────────────────────────────

/**
 * Registers a new user.
 * Hashes password before storing — plain text is NEVER persisted (Lab 9 Rule #1).
 *
 * @param {{ name: string, email: string, password: string, role?: string }} data
 * @returns {{ user: object, accessToken: string, refreshToken: string }}
 * @throws {Error} 409 if email already registered
 */
const register = async ({ name, email, password, role = 'student' }) => {
  const existing = await User.findOne({ email });
  if (existing) {
    const err = new Error('Email already registered');
    err.statusCode = 409;
    throw err;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword, role });

  const accessToken = signAccessToken(user._id, user.role);
  const refreshToken = signRefreshToken(user._id);

  // Store the refresh token on the user document so we can invalidate it on logout.
  // We hash it before storage so a DB breach cannot be used to forge sessions.
  const hashedRefresh = await bcrypt.hash(refreshToken, 10);
  await User.findByIdAndUpdate(user._id, { $push: { refreshTokens: hashedRefresh } });

  return {
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    accessToken,
    refreshToken,
  };
};

/**
 * Logs in a user with email + password.
 * Returns same 401 for both wrong email and wrong password to prevent
 * user enumeration attacks (Lab 9 section 3.3).
 *
 * @param {{ email: string, password: string }} credentials
 * @returns {{ user: object, accessToken: string, refreshToken: string }}
 * @throws {Error} 401 for invalid credentials
 */
const login = async ({ email, password }) => {
  // select('+password') overrides the schema-level select:false on the password field
  const user = await User.findOne({ email }).select('+password +refreshTokens');
  if (!user) {
    const err = new Error('Invalid credentials');
    err.statusCode = 401;
    throw err;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const err = new Error('Invalid credentials');
    err.statusCode = 401;
    throw err;
  }

  const accessToken = signAccessToken(user._id, user.role);
  const refreshToken = signRefreshToken(user._id);

  const hashedRefresh = await bcrypt.hash(refreshToken, 10);
  await User.findByIdAndUpdate(user._id, { $push: { refreshTokens: hashedRefresh } });

  return {
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    accessToken,
    refreshToken,
  };
};

/**
 * Issues a new Access Token from a valid Refresh Token.
 * The Refresh Token is read from an httpOnly cookie set by authController.
 *
 * @param {string} refreshToken - raw token from cookie
 * @returns {{ accessToken: string }}
 * @throws {Error} 401 if token is missing, invalid, or revoked
 */
const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    const err = new Error('No refresh token');
    err.statusCode = 401;
    throw err;
  }

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  } catch {
    const err = new Error('Invalid or expired refresh token');
    err.statusCode = 401;
    throw err;
  }

  // Load the user and their stored hashed refresh tokens
  const user = await User.findById(decoded.userId).select('+refreshTokens');
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 401;
    throw err;
  }

  // Verify the raw token matches one of the stored hashes (token rotation check)
  const tokenMatches = await Promise.any(
    (user.refreshTokens || []).map((hash) => bcrypt.compare(refreshToken, hash))
  ).catch(() => false);

  if (!tokenMatches) {
    const err = new Error('Refresh token revoked');
    err.statusCode = 401;
    throw err;
  }

  const accessToken = signAccessToken(user._id, user.role);
  return { accessToken };
};

/**
 * Logs out the user by removing the specific refresh token from their stored list.
 * Supports multi-device logout — only the current device's token is removed.
 *
 * @param {string} userId
 * @param {string} refreshToken - raw token to invalidate
 */
const logout = async (userId, refreshToken) => {
  if (!refreshToken) return;

  const user = await User.findById(userId).select('+refreshTokens');
  if (!user) return;

  // Find and remove only the matching hashed token
  const remaining = [];
  for (const hash of user.refreshTokens || []) {
    const matches = await bcrypt.compare(refreshToken, hash);
    if (!matches) remaining.push(hash);
  }

  await User.findByIdAndUpdate(userId, { $set: { refreshTokens: remaining } });
};

module.exports = { register, login, refreshAccessToken, logout };
