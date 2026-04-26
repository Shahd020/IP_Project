import quizService from '../services/quiz.service.js';
import asyncHandler from '../utils/asyncHandler.js';

// ─── GET /api/modules/:moduleId/quiz ─────────────────────────────────────────
const getQuiz = asyncHandler(async (req, res) => {
  const quiz = await quizService.getQuizForAttempt(req.params.moduleId);
  res.status(200).json({ success: true, data: { quiz } });
});

// ─── POST /api/modules/:moduleId/quiz ────────────────────────────────────────
const createOrUpdate = asyncHandler(async (req, res) => {
  const { quiz, created } = await quizService.createOrUpdateQuiz(
    req.params.moduleId,
    req.body,
    req.user._id,
    req.user.role
  );
  res.status(created ? 201 : 200).json({ success: true, message: 'Quiz saved', data: { quiz } });
});

// ─── POST /api/modules/:moduleId/quiz/submit ──────────────────────────────────
const submit = asyncHandler(async (req, res) => {
  const result = await quizService.submitQuiz(
    req.params.moduleId,
    req.body.answers,
    req.user._id
  );
  res.status(200).json({ success: true, data: result });
});

export default { getQuiz, createOrUpdate, submit };