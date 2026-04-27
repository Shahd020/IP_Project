import { Router } from 'express';
import { body, query } from 'express-validator';
import enrollmentController from '../controllers/enrollment.controller.js';
import validate from '../middleware/validate.js';
import authenticate from '../middleware/authenticate.js';
import authorize from '../middleware/authorize.js';

const router = Router();

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

// PATCH /api/enrollments/:id/start
router.patch('/:id/start', authorize('student'), enrollmentController.startCourse);

// DELETE /api/enrollments/:id
router.delete('/:id', authorize('student'), enrollmentController.unenroll);

export default router;
