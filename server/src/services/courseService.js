// src/services/courseService.js
const Course = require('../models/Course');
const Module = require('../models/Module');

/**
 * Creates a new course. Status defaults to 'draft' until the instructor publishes it.
 *
 * @param {object} data - Course fields from req.body
 * @param {string} instructorId - From req.user.userId (set by protect middleware)
 * @returns {Promise<object>} Newly created course document
 */
const createCourse = async (data, instructorId) => {
  const course = await Course.create({ ...data, instructor: instructorId });
  return course;
};

/**
 * Returns the public course catalog — only published courses.
 * Supports optional filtering by category and level via query params.
 * Uses .populate() to attach instructor name/avatar in a single query,
 * preventing the N+1 problem (no separate User query per course).
 *
 * @param {{ category?: string, level?: string, search?: string }} filters
 * @returns {Promise<object[]>}
 */
const getCourses = async ({ category, level, search } = {}) => {
  const query = { status: 'published' };

  if (category) query.category = category;
  if (level) query.level = level;
  if (search) query.$text = { $search: search }; // uses the text index on title+description

  return Course.find(query)
    .populate('instructor', 'name avatar') // only fetch name + avatar — not password
    .select('-modules')                    // exclude module array for catalog listings
    .sort({ rating: -1, createdAt: -1 })
    .lean(); // returns plain JS objects — faster when we don't need Mongoose methods
};

/**
 * Returns a single course with its full module list populated.
 * The double populate pattern here prevents N+1 on course detail pages.
 *
 * @param {string} courseId
 * @returns {Promise<object>}
 * @throws {Error} 404 if not found
 */
const getCourseById = async (courseId) => {
  const course = await Course.findById(courseId)
    .populate('instructor', 'name avatar bio')
    .populate({
      path: 'modules',
      options: { sort: { order: 1 } }, // always return modules in order
    });

  if (!course) {
    const err = new Error('Course not found');
    err.statusCode = 404;
    throw err;
  }
  return course;
};

/**
 * Returns all courses belonging to a specific instructor — for the instructor dashboard.
 *
 * @param {string} instructorId
 * @returns {Promise<object[]>}
 */
const getCoursesByInstructor = async (instructorId) => {
  return Course.find({ instructor: instructorId })
    .select('title status enrollmentCount rating createdAt thumbnail category level')
    .sort({ createdAt: -1 })
    .lean();
};

/**
 * Updates a course. Only the owning instructor or an admin may update.
 *
 * @param {string} courseId
 * @param {object} updates - Partial course fields
 * @param {{ userId: string, role: string }} requestingUser
 * @returns {Promise<object>} Updated course document
 * @throws {Error} 403 if not authorised, 404 if not found
 */
const updateCourse = async (courseId, updates, requestingUser) => {
  const course = await Course.findById(courseId);
  if (!course) {
    const err = new Error('Course not found');
    err.statusCode = 404;
    throw err;
  }

  const isOwner = course.instructor.toString() === requestingUser.userId;
  if (!isOwner && requestingUser.role !== 'admin') {
    const err = new Error('You are not authorised to update this course');
    err.statusCode = 403;
    throw err;
  }

  // runValidators: true ensures schema validation also runs on update (Lab 8 §4.3)
  const updated = await Course.findByIdAndUpdate(courseId, updates, {
    new: true,
    runValidators: true,
  });
  return updated;
};

/**
 * Deletes a course and all its associated modules.
 * Uses a transaction-like pattern: modules are deleted first, then the course,
 * so we never have orphaned modules if the course delete fails.
 *
 * @param {string} courseId
 * @param {{ userId: string, role: string }} requestingUser
 * @throws {Error} 403 if not authorised, 404 if not found
 */
const deleteCourse = async (courseId, requestingUser) => {
  const course = await Course.findById(courseId);
  if (!course) {
    const err = new Error('Course not found');
    err.statusCode = 404;
    throw err;
  }

  const isOwner = course.instructor.toString() === requestingUser.userId;
  if (!isOwner && requestingUser.role !== 'admin') {
    const err = new Error('You are not authorised to delete this course');
    err.statusCode = 403;
    throw err;
  }

  await Module.deleteMany({ course: courseId });
  await Course.findByIdAndDelete(courseId);
};

module.exports = {
  createCourse,
  getCourses,
  getCourseById,
  getCoursesByInstructor,
  updateCourse,
  deleteCourse,
};
