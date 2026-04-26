import Module from '../models/Module.js';
import Course from '../models/Course.js';
import Quiz from '../models/Quiz.js';
import ApiError from '../utils/ApiError.js';
import forumService from './forum.service.js';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const assertCourseOwnership = async (courseId, userId, userRole) => {
  const course = await Course.findById(courseId).select('instructor');
  if (!course) throw ApiError.notFound('Course not found');
  if (userRole !== 'admin' && course.instructor.toString() !== userId.toString()) {
    throw ApiError.forbidden('You do not own this course');
  }
  return course;
};

// ─── Read ─────────────────────────────────────────────────────────────────────

const getModulesByCourse = async (courseId) => {
  const course = await Course.findById(courseId).select('_id');
  if (!course) throw ApiError.notFound('Course not found');

  return Module.find({ course: courseId }).sort({ order: 1 }).lean();
};

const getModuleWithDetails = async (moduleId) => {
  const module = await Module.findById(moduleId);
  if (!module) throw ApiError.notFound('Module not found');

  const [quiz, forumPosts] = await Promise.all([
    Quiz.findOne({ module: moduleId }),
    forumService.getPostsByCourse(module.course, moduleId, { limit: 20 }),
  ]);

  return { module, quiz, forumPosts };
};

// ─── Write ────────────────────────────────────────────────────────────────────

const createModule = async (courseId, data, userId, userRole) => {
  await assertCourseOwnership(courseId, userId, userRole);
  return Module.create({ ...data, course: courseId });
};

const updateModule = async (moduleId, data, userId, userRole) => {
  const module = await Module.findById(moduleId).select('course');
  if (!module) throw ApiError.notFound('Module not found');

  await assertCourseOwnership(module.course, userId, userRole);

  Object.assign(module, data);
  await module.save();
  return module;
};

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
