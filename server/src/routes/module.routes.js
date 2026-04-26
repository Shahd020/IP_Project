const express = require('express');
const router = express.Router();

const moduleController = require('../controllers/module.controller.js');
const authenticate = require('../middleware/protect.js'); // or authenticate.js
const authorize = require('../middleware/authorize.js');

// Get modules for a course (public or authenticated depending on your design)
router.get('/course/:courseId', moduleController.getByCourse);

// Get module details
router.get('/:moduleId', moduleController.getDetails);

// Create module (instructor/admin)
router.post(
  '/course/:courseId',
  authenticate,
  authorize('instructor', 'admin'),
  moduleController.create
);

// Update module
router.patch(
  '/:moduleId',
  authenticate,
  authorize('instructor', 'admin'),
  moduleController.update
);

// Delete module
router.delete(
  '/:moduleId',
  authenticate,
  authorize('instructor', 'admin'),
  moduleController.remove
);

module.exports = router;