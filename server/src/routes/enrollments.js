// src/routes/enrollments.js
const express = require('express');
const router = express.Router();

const { enroll, getMyEnrollments, completeModule } = require('../controllers/enrollmentController');
const protect = require('../middleware/protect');
const authorize = require('../middleware/authorize');

// All enrollment routes require authentication
router.use(protect);

// Students only — matches StudentCourses.jsx data requirements
router.post('/', authorize('student'), enroll);
router.get('/my', authorize('student'), getMyEnrollments);
router.patch('/:id/complete-module', authorize('student'), completeModule);

module.exports = router;
