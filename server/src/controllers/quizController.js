// src/controllers/quizController.js
const quizService = require('../services/quizService');

exports.createQuiz = async (req, res, next) => {
  try {
    const quiz = await quizService.createQuiz(req.body, req.params.courseId);
    res.status(201).json({ success: true, data: { quiz } });
  } catch (err) { next(err); }
};

exports.getQuizzesByCourse = async (req, res, next) => {
  try {
    const quizzes = await quizService.getQuizzesByCourse(req.params.courseId);
    res.json({ success: true, data: { quizzes } });
  } catch (err) { next(err); }
};

exports.getQuizForStudent = async (req, res, next) => {
  try {
    const quiz = await quizService.getQuizForStudent(req.params.id);
    res.json({ success: true, data: { quiz } });
  } catch (err) { next(err); }
};

exports.submitAttempt = async (req, res, next) => {
  try {
    const result = await quizService.submitAttempt(
      req.params.id, req.user.userId, req.body.answers
    );
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
};
