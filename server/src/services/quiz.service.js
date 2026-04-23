const Quiz = require('../models/Quiz.js');
const Module = require('../models/Module.js');
const Enrollment = require('../models/Enrollment.js');
const Course = require('../models/Course.js');
const ApiError = require('../utils/ApiError.js');

// ─── Helpers ──────────────────────────────────────────────────────────────────

const assertModuleOwnership = async (moduleId, userId, userRole) => {
  const module = await Module.findById(moduleId).select('course');
  if (!module) throw ApiError.notFound('Module not found');

  if (userRole !== 'admin') {
    const course = await Course.findById(module.course).select('instructor');
    if (!course || course.instructor.toString() !== userId.toString()) {
      throw ApiError.forbidden('You do not own this module');
    }
  }
  return module;
};

// ─── Read ─────────────────────────────────────────────────────────────────────

const getQuizForAttempt = async (moduleId) => {
  return Quiz.findOne({ module: moduleId });
};

// ─── Write ────────────────────────────────────────────────────────────────────

const createOrUpdateQuiz = async (moduleId, data, userId, userRole) => {
  await assertModuleOwnership(moduleId, userId, userRole);

  const quiz = await Quiz.findOneAndUpdate(
    { module: moduleId },
    { ...data, module: moduleId },
    { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
  );
  return quiz;
};

// ─── Submit ───────────────────────────────────────────────────────────────────

const submitQuiz = async (moduleId, answers, studentId) => {
  const quiz = await Quiz.findOne({ module: moduleId }).select('+questions.correctAnswer');
  if (!quiz) throw ApiError.notFound('No quiz found for this module');

  const result = quiz.grade(answers);

  if (result.passed) {
    const module = await Module.findById(moduleId).select('course');

    if (module) {
      const enrollment = await Enrollment.findOne({
        student: studentId,
        course: module.course,
      });

      if (enrollment) {
        enrollment.quizPassed = true;

        const alreadyDone = enrollment.completedModules
          .map((id) => id.toString())
          .includes(moduleId.toString());

        if (!alreadyDone) {
          enrollment.completedModules.push(moduleId);
        }

        const totalModules = await Module.countDocuments({ course: module.course });
        enrollment.progressPercent =
          totalModules > 0
            ? Math.round((enrollment.completedModules.length / totalModules) * 100)
            : 100;

        if (enrollment.progressPercent >= 100) {
          enrollment.status = 'completed';
          enrollment.progressText = 'Finished';
        } else {
          enrollment.status = 'in-progress';
        }

        await enrollment.save();
      }
    }
  }

  return result;
};

module.exports = {
  getQuizForAttempt,
  createOrUpdateQuiz,
  submitQuiz,
};