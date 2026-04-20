import authService from '../services/auth.service.js';
import { refreshCookieOptions } from '../utils/jwt.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * Controllers are intentionally thin:
 *   1. Extract validated data from req
 *   2. Call the service
 *   3. Write the response
 *
 * All business logic lives in auth.service.js.
 */

// ─── POST /api/auth/register ──────────────────────────────────────────────────
/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
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
/**
 * Reads the refresh token from the HttpOnly cookie, rotates both tokens,
 * and returns the new access token in the response body.
 */
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
/**
 * Requires authenticate middleware — req.user is always populated here.
 */
const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  await authService.logout(req.user._id, refreshToken);

  // Overwrite the cookie with an expired one to force the browser to delete it
  res.cookie('refreshToken', '', { ...refreshCookieOptions(), maxAge: 0 });

  res.status(200).json({ success: true, message: 'Logged out successfully' });
});

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────
/**
 * Returns the currently authenticated user.
 * Requires authenticate middleware.
 */
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, data: { user: req.user } });
});

export default { register, login, refresh, logout, getMe };
