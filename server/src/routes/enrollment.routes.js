const express = require('express');
const { body, query } = require('express-validator');

const enrollmentController = require('../controllers/enrollment.controller.js');
const validate = require('../middleware/validate.js');
const authenticate = require('../middleware/authenticate.js');
const authorize = require('../middleware/authorize.js');

const router = express.Router();

// All enrollment routes require authentication
router.use(authenticate);

// GET /api/enrollments/my
router.get(
  '/my',
  [
    query('status')
      .optional()
      .isIn(['saved', 'in-progress', 'completed'])
      .withMessage('Invalid status filter'),
  ],
  validate,
  enrollmentController.getMine
);

// GET /api/enrollments/course/:courseId
router.get(
  '/course/:courseId',
  authorize('instructor', 'admin'),
  enrollmentController.getByCourse
);

// POST /api/enrollments
router.post(
  '/',
  authorize('student'),
  [
    body('courseId').notEmpty().isMongoId().withMessage('Valid courseId is required'),
    body('status')
      .optional()
      .isIn(['saved', 'in-progress'])
      .withMessage('Status must be saved or in-progress'),
  ],
  validate,
  enrollmentController.enroll
);

// PATCH /api/enrollments/:id/progress
router.patch(
  '/:id/progress',
  authorize('student'),
  [
    body('moduleId').notEmpty().isMongoId().withMessage('Valid moduleId is required'),
    body('progressText').optional().trim().isLength({ max: 50 }),
  ],
  validate,
  enrollmentController.updateProgress
);

// DELETE /api/enrollments/:id
router.delete('/:id', authorize('student'), enrollmentController.unenroll);

module.exports = router;