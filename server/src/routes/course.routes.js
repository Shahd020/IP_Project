const express = require('express');
const router = express.Router();

const courseController = require('../controllers/course.controller.js');
const authenticate = require('../middleware/protect.js');
const authorize = require('../middleware/authorize.js');
const validate = require('../middleware/validate.js');
const { createCourseRules, updateCourseRules } = require('../middleware/validators.js');

// Public
router.get('/', courseController.getAll);
router.get('/:id', courseController.getOne);

// Instructor/Admin
router.post(
  '/',
  authenticate,
  authorize('instructor', 'admin'),
  createCourseRules,
  validate,
  courseController.create
);

router.patch(
  '/:id',
  authenticate,
  authorize('instructor', 'admin'),
  updateCourseRules,
  validate,
  courseController.update
);

router.delete(
  '/:id',
  authenticate,
  authorize('instructor', 'admin'),
  courseController.remove
);

module.exports = router;