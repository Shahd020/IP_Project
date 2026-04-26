// src/routes/quiz.js
const express = require('express');
const router = express.Router();

const {
  createQuiz,
  getQuizzesByCourse,
  getQuizForStudent,
  submitAttempt,
} = require('../controllers/quizController');

const protect = require('../middleware/protect');
const authorize = require('../middleware/authorize');

// All quiz routes require authentication
router.use(protect);

// Instructors/admins manage quizzes; students read and submit
router.post('/courses/:courseId', authorize('instructor', 'admin'), createQuiz);
router.get('/courses/:courseId', getQuizzesByCourse);
router.get('/:id', getQuizForStudent);
router.post('/:id/submit', authorize('student'), submitAttempt);

module.exports = router;
