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
