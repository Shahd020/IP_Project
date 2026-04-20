import User from '../models/User.js';
import { verifyAccessToken } from '../utils/jwt.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * Verifies the Bearer Access Token in the Authorization header and
 * attaches the full User document to req.user.
 *
 * Routes that require authentication must use this middleware before
 * the authorize() guard or any controller.
 *
 * Flow:
 *   1. Extract the token from `Authorization: Bearer <token>`
 *   2. Verify its signature and expiry with the ACCESS_SECRET
 *   3. Load the User from DB (ensures the account still exists and is active)
 *   4. Attach to req.user and call next()
 */
const authenticate = asyncHandler(async (req, _res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw ApiError.unauthorized('No access token provided');
  }

  const token = authHeader.split(' ')[1];

  // Throws JsonWebTokenError or TokenExpiredError on failure —
  // both are normalised to 401 by errorHandler.js
  const decoded = verifyAccessToken(token);

  const user = await User.findById(decoded.id).select('-refreshTokens');

  if (!user) {
    throw ApiError.unauthorized('User account no longer exists');
  }

  if (!user.isActive) {
    throw ApiError.forbidden('Your account has been deactivated');
  }

  req.user = user;
  next();
});

export default authenticate;
