const authService = require('../services/auth.service.js');
const { refreshCookieOptions } = require('../utils/jwt.js');
const asyncHandler = require('../utils/asyncHandler.js');

// ─── POST /api/auth/register ──────────────────────────────────────────────────
const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const { user, accessToken, refreshToken } = await authService.register({
    name,
    email,
    password,
    role,
  });

  res.cookie('refreshToken', refreshToken, refreshCookieOptions());

  res.status(201).json({
    success: true,
    message: 'Account created successfully',
    data: { user, accessToken },
  });
});

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const { user, accessToken, refreshToken } = await authService.login({ email, password });

  res.cookie('refreshToken', refreshToken, refreshCookieOptions());

  res.status(200).json({
    success: true,
    message: 'Logged in successfully',
    data: { user, accessToken },
  });
});

// ─── POST /api/auth/refresh ───────────────────────────────────────────────────
const refresh = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies?.refreshToken;

  const { accessToken, refreshToken } = await authService.refreshTokens(incomingRefreshToken);

  res.cookie('refreshToken', refreshToken, refreshCookieOptions());

  res.status(200).json({
    success: true,
    data: { accessToken },
  });
});

// ─── POST /api/auth/logout ────────────────────────────────────────────────────
const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  await authService.logout(req.user._id, refreshToken);

  res.cookie('refreshToken', '', { ...refreshCookieOptions(), maxAge: 0 });

  res.status(200).json({ success: true, message: 'Logged out successfully' });
});

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, data: { user: req.user } });
});

module.exports = { register, login, refresh, logout, getMe };