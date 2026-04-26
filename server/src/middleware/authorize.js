const ApiError = require('../utils/ApiError.js');

/**
 * Role-Based Access Control (RBAC) guard
 */
const authorize =
  (...roles) =>
  (req, _res, next) => {
    if (!req.user) {
      return next(ApiError.unauthorized('Authentication required'));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        ApiError.forbidden(
          `Role '${req.user.role}' is not permitted to perform this action`
        )
      );
    }

    next();
  };

module.exports = authorize;