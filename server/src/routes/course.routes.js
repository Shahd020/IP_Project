import { Router } from 'express';
import courseController from '../controllers/course.controller.js';
import moduleController from '../controllers/module.controller.js';
import * as courseValidators from '../validators/course.validators.js';
import validate from '../middleware/validate.js';
import authenticate from '../middleware/authenticate.js';
import authorize from '../middleware/authorize.js';

const router = Router();

// ─── Public ───────────────────────────────────────────────────────────────────

/**
 * GET /api/courses
 * Browse the published course catalog with optional text search + category filter.
 */
router.get('/', courseValidators.listCourses, validate, courseController.getAll);

// ─── Instructor / Admin ───────────────────────────────────────────────────────

/**
 * GET /api/courses/instructor/my
 * MUST be declared BEFORE /:id — otherwise Express matches "instructor" as an ObjectId.
 */
router.get(
  '/instructor/my',
  authenticate,
  authorize('instructor', 'admin'),
  courseController.getMyCourses
);

/**
 * GET /api/courses/:id
 * Course detail page — modules populated, instructor populated.
 */
router.get('/:id', courseController.getOne);

/**
 * POST /api/courses
 * Create a new course (draft — isPublished defaults to false).
 */
router.post(
  '/',
  authenticate,
  authorize('instructor', 'admin'),
  courseValidators.createCourse,
  validate,
  courseController.create
);

/**
 * PATCH /api/courses/:id
 * Partial update — only the owner instructor or an admin may call this.
 */
router.patch(
  '/:id',
  authenticate,
  authorize('instructor', 'admin'),
  courseValidators.updateCourse,
  validate,
  courseController.update
);

/**
 * DELETE /api/courses/:id
 * Cascade-deletes modules and enrollments.
 */
router.delete(
  '/:id',
  authenticate,
  authorize('instructor', 'admin'),
  courseController.remove
);

// ─── Module sub-resource (nested under /api/courses/:courseId/modules) ────────

/**
 * GET /api/courses/:courseId/modules
 */
router.get('/:courseId/modules', authenticate, moduleController.getByCourse);

/**
 * POST /api/courses/:courseId/modules
 */
router.post(
  '/:courseId/modules',
  authenticate,
  authorize('instructor', 'admin'),
  courseValidators.createModule,
  validate,
  moduleController.create
);

export default router;
