import { Router } from 'express';
import moduleController from '../controllers/module.controller.js';
import quizController from '../controllers/quiz.controller.js';
import authenticate from '../middleware/authenticate.js';
import authorize from '../middleware/authorize.js';

const router = Router();

// GET /api/modules/course/:courseId — list modules for a course
router.get('/course/:courseId', authenticate, moduleController.getByCourse);

// GET /api/modules/:moduleId/details — module + quiz + forum posts
router.get('/:moduleId/details', authenticate, moduleController.getDetails);

// PATCH /api/modules/:moduleId
router.patch(
  '/:moduleId',
  authenticate,
  authorize('instructor', 'admin'),
  moduleController.update
);

// DELETE /api/modules/:moduleId
router.delete(
  '/:moduleId',
  authenticate,
  authorize('instructor', 'admin'),
  moduleController.remove
);

// GET /api/modules/:moduleId/quiz
router.get('/:moduleId/quiz', authenticate, quizController.getQuiz);

// POST /api/modules/:moduleId/quiz
router.post(
  '/:moduleId/quiz',
  authenticate,
  authorize('instructor', 'admin'),
  quizController.createOrUpdate
);

// POST /api/modules/:moduleId/quiz/submit
router.post('/:moduleId/quiz/submit', authenticate, authorize('student'), quizController.submit);

export default router;
