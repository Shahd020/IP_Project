<<<<<<< HEAD
// src/middleware/authorize.js
// Role-Based Access Control (RBAC) middleware — always used AFTER protect.js.

/**
 * Returns a middleware that allows only the specified roles through.
 * Usage in routes:
 *   router.delete('/:id', protect, authorize('admin'), deleteUser)
 *   router.post('/', protect, authorize('instructor', 'admin'), createCourse)
 *
 * @param {...string} roles - Allowed role strings
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied: role '${req.user.role}' is not authorised for this action`,
      });
    }
    next();
  };
};

module.exports = authorize;
=======
import ApiError from '../utils/ApiError.js';

/**
 * Role-Based Access Control (RBAC) guard — factory that returns a middleware.
 *
 * Must always come AFTER authenticate() in the middleware chain so
 * that req.user is already populated.
 *
 * Usage examples:
 *   router.post('/courses', authenticate, authorize('instructor', 'admin'), createCourse);
 *   router.delete('/users/:id', authenticate, authorize('admin'), deleteUser);
 *
 * @param {...string} roles - One or more allowed roles (student | instructor | admin).
 * @returns {import('express').RequestHandler}
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

export default authorize;
>>>>>>> 56fac7aa34891492f68c36dd546ab7420c7673a1
