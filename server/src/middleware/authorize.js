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
