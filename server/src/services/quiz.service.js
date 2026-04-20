import Quiz from '../models/Quiz.js';
import Module from '../models/Module.js';
import Enrollment from '../models/Enrollment.js';
import Course from '../models/Course.js';
import ApiError from '../utils/ApiError.js';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Confirm the requesting user owns the module's parent course.
 */
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

/**
 * Returns quiz questions WITHOUT correctAnswer — safe to send to any authenticated user.
 *
 * @param {string} moduleId
 * @returns {object|null}
 */
const getQuizForAttempt = async (moduleId) => {
  return Quiz.findOne({ module: moduleId }); // toJSON transform strips correctAnswer
};

// ─── Write ────────────────────────────────────────────────────────────────────

/**
 * Create or replace the quiz for a module (idempotent upsert).
 * Only the owning instructor or an admin may call this.
 *
 * @param {string} moduleId
 * @param {{ questions: object[], passingScore?: number }} data
 * @param {string} userId
 * @param {string} userRole
 * @returns {object} Saved quiz document
 */
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

/**
 * Grade a student's quiz submission and update their enrollment on a pass.
 *
 * Fetches the quiz with correctAnswer (bypassing the toJSON transform) so
 * grading happens server-side — the correct answers never reach the client.
 *
 * @param {string} moduleId
 * @param {Record<string, number>} answers  { questionId: selectedOptionIndex }
 * @param {string} studentId
 * @returns {{ score: number, total: number, percentage: number, passed: boolean }}
 */
const submitQuiz = async (moduleId, answers, studentId) => {
  // Explicitly select correctAnswer — bypasses select:false
  const quiz = await Quiz.findOne({ module: moduleId }).select('+questions.correctAnswer');
  if (!quiz) throw ApiError.notFound('No quiz found for this module');

  const result = quiz.grade(answers);

  if (result.passed) {
    // Find and update the student's enrollment for this module's course
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

export default { getQuizForAttempt, createOrUpdateQuiz, submitQuiz };
