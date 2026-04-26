import { Router } from 'express';
import { body, query } from 'express-validator';
import forumController from '../controllers/forum.controller.js';
import validate from '../middleware/validate.js';
import authenticate from '../middleware/authenticate.js';

const router = Router();

router.use(authenticate);

// GET /api/forum/course/:courseId
router.get(
  '/course/:courseId',
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
  ],
  validate,
  forumController.getByCourse
);

// GET /api/forum/module/:moduleId
router.get('/module/:moduleId', forumController.getByModule);

// POST /api/forum/posts
router.post(
  '/posts',
  [
    body('courseId').notEmpty().isMongoId().withMessage('Valid courseId is required'),
    body('moduleId').optional().isMongoId(),
    body('text')
      .trim()
      .notEmpty().withMessage('Post text is required')
      .isLength({ max: 2000 }).withMessage('Post cannot exceed 2000 characters'),
  ],
  validate,
  forumController.create
);

// DELETE /api/forum/posts/:postId
router.delete('/posts/:postId', forumController.remove);

export default router;
