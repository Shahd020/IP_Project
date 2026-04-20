// src/controllers/authController.js
// Thin layer: parse req → call service → send res.
// All business logic lives in authService.js.
const { validationResult } = require('express-validator');
const authService = require('../services/authService');
const User = require('../models/User');

// Shared cookie options for the httpOnly refresh token cookie.
// httpOnly: JS in the browser cannot read this cookie — XSS-safe.
// sameSite: 'strict' prevents CSRF.
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
};

// POST /api/auth/register
exports.register = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { user, accessToken, refreshToken } = await authService.register(req.body);
    res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
    res.status(201).json({ message: 'Registration successful', user, accessToken });
  } catch (err) {
    next(err); // forwarded to global errorHandler
  }
};

// POST /api/auth/login
exports.login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { user, accessToken, refreshToken } = await authService.login(req.body);
    res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
    res.json({ message: 'Login successful', user, accessToken });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/refresh  — issues a new Access Token from the httpOnly cookie
exports.refresh = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const { accessToken } = await authService.refreshAccessToken(refreshToken);
    res.json({ accessToken });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/logout
exports.logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    await authService.logout(req.user.userId, refreshToken);
    res.clearCookie('refreshToken', COOKIE_OPTIONS);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

// GET /api/auth/me  — returns the logged-in user's own profile (Lab 9 §4.5)
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId).select('-refreshTokens');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
};
