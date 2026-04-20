import Module from '../models/Module.js';
import Course from '../models/Course.js';
import Quiz from '../models/Quiz.js';
import ApiError from '../utils/ApiError.js';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Confirms the requesting user owns the parent course (or is admin).
 * Fetches the course internally so callers don't need to.
 */
const assertCourseOwnership = async (courseId, userId, userRole) => {
  const course = await Course.findById(courseId).select('instructor');
  if (!course) throw ApiError.notFound('Course not found');
  if (userRole !== 'admin' && course.instructor.toString() !== userId.toString()) {
    throw ApiError.forbidden('You do not own this course');
  }
  return course;
};

// ─── Read ─────────────────────────────────────────────────────────────────────

/**
 * All modules for a course, sorted by order.
 * Used by the instructor's course preview page.
 *
 * @param {string} courseId
 * @returns {object[]}
 */
const getModulesByCourse = async (courseId) => {
  const course = await Course.findById(courseId).select('_id');
  if (!course) throw ApiError.notFound('Course not found');

  return Module.find({ course: courseId }).sort({ order: 1 }).lean();
};

/**
 * A single module with its quiz (questions only — no correctAnswer) and
 * the 20 most recent forum posts, populated with author name+avatar.
 * One aggregated query set; no N+1.
 *
 * @param {string} moduleId
 * @returns {object}
 */
const getModuleWithDetails = async (moduleId) => {
  const module = await Module.findById(moduleId);
  if (!module) throw ApiError.notFound('Module not found');

  // Populate quiz (correctAnswer stays hidden via toJSON transform on Quiz)
  // and recent forum posts in parallel
  const [quiz, forumPosts] = await Promise.all([
    Quiz.findOne({ module: moduleId }),
    (await import('./forum.service.js')).default.getPostsByCourse(
      module.course,
      moduleId,
      { limit: 20 }
    ),
  ]);

  return { module, quiz, forumPosts };
};

// ─── Write ────────────────────────────────────────────────────────────────────

/**
 * Add a new module to a course.
 * The unique index on {course, order} enforces no duplicate positions at DB level.
 *
 * @param {string} courseId
 * @param {object} data
 * @param {string} userId
 * @param {string} userRole
 * @returns {object}
 */
const createModule = async (courseId, data, userId, userRole) => {
  await assertCourseOwnership(courseId, userId, userRole);
  return Module.create({ ...data, course: courseId });
};

/**
 * Partial update of a module.
 * If `order` is changed, the unique index still guards against collisions.
 *
 * @param {string} moduleId
 * @param {object} data
 * @param {string} userId
 * @param {string} userRole
 * @returns {object}
 */
const updateModule = async (moduleId, data, userId, userRole) => {
  const module = await Module.findById(moduleId).select('course');
  if (!module) throw ApiError.notFound('Module not found');

  await assertCourseOwnership(module.course, userId, userRole);

  Object.assign(module, data);
  await module.save();
  return module;
};

/**
 * Delete a module and its associated quiz.
 *
 * @param {string} moduleId
 * @param {string} userId
 * @param {string} userRole
 */
const deleteModule = async (moduleId, userId, userRole) => {
  const module = await Module.findById(moduleId).select('course');
  if (!module) throw ApiError.notFound('Module not found');

  await assertCourseOwnership(module.course, userId, userRole);

  await Promise.all([
    Quiz.deleteOne({ module: moduleId }),
    module.deleteOne(),
  ]);
};

export default {
  getModulesByCourse,
  getModuleWithDetails,
  createModule,
  updateModule,
  deleteModule,
};
