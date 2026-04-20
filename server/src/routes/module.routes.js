import { Router } from 'express';
import { body } from 'express-validator';
import moduleController from '../controllers/module.controller.js';
import quizController from '../controllers/quiz.controller.js';
import * as courseValidators from '../validators/course.validators.js';
import validate from '../middleware/validate.js';
import authenticate from '../middleware/authenticate.js';
import authorize from '../middleware/authorize.js';

const router = Router();

/**
 * GET /api/modules/:moduleId/details
 * Returns module data + quiz (no correct answers) + recent forum posts.
 * Available to any authenticated user (enrolled check is on the frontend for now).
 */
router.get('/:moduleId/details', authenticate, moduleController.getDetails);

/**
 * PATCH /api/modules/:moduleId
 * Partial update — instructor must own the parent course.
 */
router.patch(
  '/:moduleId',
  authenticate,
  authorize('instructor', 'admin'),
  courseValidators.updateModule,
  validate,
  moduleController.update
);

/**
 * DELETE /api/modules/:moduleId
 * Also deletes the associated quiz.
 */
router.delete(
  '/:moduleId',
  authenticate,
  authorize('instructor', 'admin'),
  moduleController.remove
);

// ─── Quiz sub-resource (/api/modules/:moduleId/quiz) ─────────────────────────

/**
 * GET /api/modules/:moduleId/quiz
 * Returns quiz questions without correctAnswer — safe for any enrolled student.
 */
router.get('/:moduleId/quiz', authenticate, quizController.getQuiz);

/**
 * POST /api/modules/:moduleId/quiz
 * Instructor creates or replaces the quiz for this module (upsert).
 */
router.post(
  '/:moduleId/quiz',
  authenticate,
  authorize('instructor', 'admin'),
  [
    body('questions')
      .isArray({ min: 1 })
      .withMessage('Quiz must have at least one question'),
    body('questions.*.question')
      .trim()
      .notEmpty()
      .withMessage('Each question must have text'),
    body('questions.*.options')
      .isArray({ min: 2, max: 6 })
      .withMessage('Each question needs 2–6 options'),
    body('questions.*.correctAnswer')
      .isInt({ min: 0 })
      .withMessage('correctAnswer must be a non-negative integer'),
    body('passingScore')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('passingScore must be 1–100'),
  ],
  validate,
  quizController.createOrUpdate
);

/**
 * POST /api/modules/:moduleId/quiz/submit
 * Student submits answers; server grades and updates enrollment on pass.
 * Must be declared BEFORE /:moduleId/quiz to avoid routing ambiguity.
 */
router.post(
  '/:moduleId/quiz/submit',
  authenticate,
  authorize('student'),
  [
    body('answers')
      .isObject()
      .withMessage('answers must be an object mapping questionId → optionIndex'),
  ],
  validate,
  quizController.submit
);

export default router;
