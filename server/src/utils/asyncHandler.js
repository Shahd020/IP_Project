/**
 * Wraps an async Express route handler so that any rejected promise is
 * forwarded to next() instead of causing an unhandled rejection crash.
 *
 * Usage:
 *   router.get('/courses', asyncHandler(courseController.getAll));
 *
 * @param {Function} fn - An async (req, res, next) controller function.
 * @returns {Function} Express middleware that catches async errors.
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
