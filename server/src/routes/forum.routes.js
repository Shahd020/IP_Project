const express = require('express');
const { body, query } = require('express-validator');

const forumController = require('../controllers/forum.controller.js');
const validate = require('../middleware/validate.js');
const authenticate = require('../middleware/authenticate.js');

const router = express.Router();

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

module.exports = router;