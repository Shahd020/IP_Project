const User = require('../models/User.js');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../utils/jwt.js');
const ApiError = require('../utils/ApiError.js');

/**
 * Builds the safe user payload sent back to the client.
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
const register = async ({ name, email, password, role }) => {
  const safeRole = role === 'admin' ? 'student' : (role || 'student');

  const user = await User.create({ name, email, password, role: safeRole });

  const accessToken = signAccessToken({ id: user._id, role: user.role });
  const refreshToken = signRefreshToken({ id: user._id });

  user.refreshTokens.push(refreshToken);
  await user.save({ validateBeforeSave: false });

  return { user: sanitiseUser(user), accessToken, refreshToken };
};

// ─── Login ────────────────────────────────────────────────────────────────────
const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password +refreshTokens');

  if (!user || !(await user.comparePassword(password))) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  if (!user.isActive) {
    throw ApiError.forbidden('Your account has been deactivated');
  }

  const accessToken = signAccessToken({ id: user._id, role: user.role });
  const refreshToken = signRefreshToken({ id: user._id });

  if (user.refreshTokens.length >= 5) {
    user.refreshTokens.shift();
  }
  user.refreshTokens.push(refreshToken);
  await user.save({ validateBeforeSave: false });

  return { user: sanitiseUser(user), accessToken, refreshToken };
};

// ─── Refresh Tokens ───────────────────────────────────────────────────────────
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

  if (!user.refreshTokens.includes(incomingRefreshToken)) {
    user.refreshTokens = [];
    await user.save({ validateBeforeSave: false });
    throw ApiError.unauthorized('Refresh token reuse detected — all sessions revoked');
  }

  user.refreshTokens = user.refreshTokens.filter((t) => t !== incomingRefreshToken);

  const newAccessToken = signAccessToken({ id: user._id, role: user.role });
  const newRefreshToken = signRefreshToken({ id: user._id });

  user.refreshTokens.push(newRefreshToken);
  await user.save({ validateBeforeSave: false });

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

// ─── Logout ───────────────────────────────────────────────────────────────────
const logout = async (userId, refreshToken) => {
  if (!refreshToken) return;

  const user = await User.findById(userId).select('+refreshTokens');
  if (!user) return;

  await user.revokeRefreshToken(refreshToken);
};

module.exports = { register, login, refreshTokens, logout };