import User from '../models/User.js';
import { verifyAccessToken } from '../utils/jwt.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

const authenticate = asyncHandler(async (req, _res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw ApiError.unauthorized('No access token provided');
  }

  const token = authHeader.split(' ')[1];

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