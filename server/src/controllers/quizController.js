// src/controllers/quizController.js
const quizService = require('../services/quizService');

// POST /api/quiz/courses/:courseId  — instructor creates a quiz
exports.createQuiz = async (req, res, next) => {
  try {
    const quiz = await quizService.createQuiz(req.body, req.params.courseId);
    res.status(201).json(quiz);
  } catch (err) {
    next(err);
  }
};

// GET /api/quiz/courses/:courseId  — get all quizzes for a course
exports.getQuizzesByCourse = async (req, res, next) => {
  try {
    const quizzes = await quizService.getQuizzesByCourse(req.params.courseId);
    res.json(quizzes);
  } catch (err) {
    next(err);
  }
};

// GET /api/quiz/:id  — get a single quiz (correct answers stripped for students)
exports.getQuizForStudent = async (req, res, next) => {
  try {
    const quiz = await quizService.getQuizForStudent(req.params.id);
    res.json(quiz);
  } catch (err) {
    next(err);
  }
};

// POST /api/quiz/:id/submit  — student submits answers
exports.submitAttempt = async (req, res, next) => {
  try {
    const result = await quizService.submitAttempt(
      req.params.id,
      req.user.userId,
      req.body.answers
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
};
