// src/services/quizService.js
const Quiz = require('../models/Quiz');

/**
 * Creates a new quiz attached to a course (and optionally a module).
 * Instructor or admin only — authorisation is enforced at the route level.
 *
 * @param {object} data - Quiz fields from req.body
 * @param {string} courseId
 * @returns {Promise<object>} Created quiz document
 */
const createQuiz = async (data, courseId) => {
  return Quiz.create({ ...data, course: courseId });
};

/**
 * Returns all quizzes for a given course, without the attempts sub-array.
 * The attempts array is excluded by default (schema select:false) to keep
 * the payload small — students don't need to see all other students' results.
 *
 * @param {string} courseId
 * @returns {Promise<object[]>}
 */
const getQuizzesByCourse = async (courseId) => {
  return Quiz.find({ course: courseId })
    .select('-attempts')
    .populate('module', 'title order')
    .lean();
};

/**
 * Returns a single quiz by ID, with correct answers stripped from the questions.
 * Correct answers are only sent back in the result after a submission.
 *
 * @param {string} quizId
 * @returns {Promise<object>}
 * @throws {Error} 404 if not found
 */
const getQuizForStudent = async (quizId) => {
  const quiz = await Quiz.findById(quizId).select('-attempts -questions.correctOptionIndex');
  if (!quiz) {
    const err = new Error('Quiz not found');
    err.statusCode = 404;
    throw err;
  }
  return quiz;
};

/**
 * Grades a student's quiz submission and saves the attempt.
 * Uses the Quiz.gradeAttempt() instance method so grading logic stays
 * co-located with the schema (defined in Quiz.js).
 *
 * @param {string} quizId
 * @param {string} studentId
 * @param {number[]} answers - Zero-based option index for each question
 * @returns {Promise<{ score: number, percentage: number, passed: boolean, quiz: object }>}
 * @throws {Error} 404 if quiz not found
 */
const submitAttempt = async (quizId, studentId, answers) => {
  // Load with attempts (select: false by default) and correct answers to grade
  const quiz = await Quiz.findById(quizId).select('+attempts');
  if (!quiz) {
    const err = new Error('Quiz not found');
    err.statusCode = 404;
    throw err;
  }

  const result = quiz.gradeAttempt(answers);

  // Append the attempt record to the quiz document
  quiz.attempts.push({ student: studentId, ...result });
  await quiz.save();

  return {
    score: result.score,
    percentage: result.percentage,
    passed: result.passed,
    passingScore: quiz.passingScore,
  };
};

module.exports = { createQuiz, getQuizzesByCourse, getQuizForStudent, submitAttempt };
