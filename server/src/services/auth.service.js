import User from '../models/User.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import ApiError from '../utils/ApiError.js';

/**
 * Builds the safe user payload sent back to the client.
 * Never includes password or refreshTokens.
 *
 * @param {import('../models/User.js').default} user
 * @returns {object}
 */
const sanitiseUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  avatar: user.avatar,
  createdAt: user.createdAt,
});

// ─── Register ─────────────────────────────────────────────────────────────────

/**
 * Create a new user account and issue tokens.
 *
 * The E11000 duplicate-key error (duplicate email) bubbles up to
 * errorHandler.js which converts it to a user-friendly 409 conflict.
 *
 * @param {{ name: string, email: string, password: string, role?: string }} data
 * @returns {{ user: object, accessToken: string, refreshToken: string }}
 */
const register = async ({ name, email, password, role }) => {
  // Admin accounts can only be created directly in the DB — never via the API.
  const safeRole = role === 'admin' ? 'student' : (role || 'student');

  const user = await User.create({ name, email, password, role: safeRole });

  const accessToken = signAccessToken({ id: user._id, role: user.role });
  const refreshToken = signRefreshToken({ id: user._id });

  // Persist the refresh token for rotation validation on /refresh
  user.refreshTokens.push(refreshToken);
  await user.save({ validateBeforeSave: false });

  return { user: sanitiseUser(user), accessToken, refreshToken };
};

// ─── Login ────────────────────────────────────────────────────────────────────

/**
 * Authenticate with email + password and issue tokens.
 *
 * We deliberately return the same vague error for both "email not found"
 * and "wrong password" to prevent user enumeration attacks.
 *
 * @param {{ email: string, password: string }} credentials
 * @returns {{ user: object, accessToken: string, refreshToken: string }}
 */
const login = async ({ email, password }) => {
  // +password because the field has select:false on the schema
  const user = await User.findOne({ email }).select('+password +refreshTokens');

  if (!user || !(await user.comparePassword(password))) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  if (!user.isActive) {
    throw ApiError.forbidden('Your account has been deactivated');
  }

  const accessToken = signAccessToken({ id: user._id, role: user.role });
  const refreshToken = signRefreshToken({ id: user._id });

  // Keep the stored tokens list from growing unboundedly —
  // cap at 5 concurrent devices by evicting the oldest entry.
  if (user.refreshTokens.length >= 5) {
    user.refreshTokens.shift();
  }
  user.refreshTokens.push(refreshToken);
  await user.save({ validateBeforeSave: false });

  return { user: sanitiseUser(user), accessToken, refreshToken };
};

// ─── Refresh Tokens ───────────────────────────────────────────────────────────

/**
 * Rotate tokens using a valid refresh token stored in the HttpOnly cookie.
 *
 * Detects token reuse: if the incoming token is not in the user's
 * refreshTokens array it means a stolen token was already rotated —
 * we revoke ALL tokens for that user as a security response.
 *
 * @param {string} incomingRefreshToken
 * @returns {{ accessToken: string, refreshToken: string }}
 */
const refreshTokens = async (incomingRefreshToken) => {
  if (!incomingRefreshToken) {
    throw ApiError.unauthorized('No refresh token provided');
  }

  let decoded;
  try {
    decoded = verifyRefreshToken(incomingRefreshToken);
  } catch {
    throw ApiError.unauthorized('Invalid or expired refresh token');
  }

  const user = await User.findById(decoded.id).select('+refreshTokens');

  if (!user) {
    throw ApiError.unauthorized('User not found');
  }

  // Token reuse detection — possible theft scenario
  if (!user.refreshTokens.includes(incomingRefreshToken)) {
    user.refreshTokens = [];
    await user.save({ validateBeforeSave: false });
    throw ApiError.unauthorized('Refresh token reuse detected — all sessions revoked');
  }

  // Rotate: remove old token, issue new pair
  user.refreshTokens = user.refreshTokens.filter((t) => t !== incomingRefreshToken);

  const newAccessToken = signAccessToken({ id: user._id, role: user.role });
  const newRefreshToken = signRefreshToken({ id: user._id });

  user.refreshTokens.push(newRefreshToken);
  await user.save({ validateBeforeSave: false });

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

// ─── Logout ───────────────────────────────────────────────────────────────────

/**
 * Revoke the refresh token for one device (single-device logout).
 * If no token is provided the call is a silent no-op so the client
 * can still clear its local state cleanly.
 *
 * @param {string} userId
 * @param {string} refreshToken
 */
const logout = async (userId, refreshToken) => {
  if (!refreshToken) return;

  const user = await User.findById(userId).select('+refreshTokens');
  if (!user) return;

  await user.revokeRefreshToken(refreshToken);
};

export default { register, login, refreshTokens, logout };
