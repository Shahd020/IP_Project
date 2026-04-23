const User = require('../models/User.js');
const { verifyAccessToken } = require('../utils/jwt.js');
const ApiError = require('../utils/ApiError.js');
const asyncHandler = require('../utils/asyncHandler.js');

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

module.exports = authenticate;