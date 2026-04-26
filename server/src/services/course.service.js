const Course = require('../models/Course.js');
const Module = require('../models/Module.js');
const Enrollment = require('../models/Enrollment.js');
const ApiError = require('../utils/ApiError.js');
// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Confirm the requesting user may mutate a course.
 * Admins bypass ownership; instructors must own the course.
 */
const assertOwnership = (course, userId, userRole) => {
  if (userRole === 'admin') return;
  if (course.instructor._id.toString() !== userId.toString()) {
    throw ApiError.forbidden('You do not have permission to modify this course');
  }
};

// ─── Read ─────────────────────────────────────────────────────────────────────

/**
 * Paginated list of published courses.
 * Uses a single MongoDB text-index query when `search` is provided —
 * no N+1 risk; instructor is populated in the same round-trip.
 *
 * @param {{ page?, limit?, search?, category? }} options
 * @returns {{ courses: object[], total: number, page: number, pages: number }}
 */
const getAllCourses = async ({ page = 1, limit = 12, search, category } = {}) => {
  const filter = { isPublished: true };

  if (category) filter.category = category;

  if (search) {
    // $text uses the compound text index on title+description (defined in Course.js)
    filter.$text = { $search: search };
  }

  const skip = (page - 1) * limit;

  const [courses, total] = await Promise.all([
    Course.find(filter)
      .populate('instructor', 'name avatar')
      .sort(search ? { score: { $meta: 'textScore' } } : { createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Course.countDocuments(filter),
  ]);

  return { courses, total, page: Number(page), pages: Math.ceil(total / limit) };
};

/**
 * Fetch a single course with its instructor and ordered modules.
 * One query with two .populate() calls — no N+1.
 *
 * @param {string} courseId
 * @returns {object} Hydrated course document
 */
const getCourseById = async (courseId) => {
  const course = await Course.findById(courseId)
    .populate('instructor', 'name email avatar')
    .populate({
      path: 'modules',
      options: { sort: { order: 1 } },
      select: 'title order videoUrl videoOverview videoDurationSeconds',
    });

  if (!course) throw ApiError.notFound('Course not found');
  return course;
};

/**
 * All courses created by a specific instructor.
 *
 * @param {string} instructorId
 * @returns {object[]}
 */
const getInstructorCourses = async (instructorId) => {
  return Course.find({ instructor: instructorId })
    .sort({ createdAt: -1 })
    .lean();
};

// ─── Write ────────────────────────────────────────────────────────────────────

/**
 * Create a new course owned by the calling instructor.
 *
 * @param {object} data  - Validated request body fields
 * @param {string} instructorId
 * @returns {object} New course document
 */
const createCourse = async (data, instructorId) => {
  const course = await Course.create({ ...data, instructor: instructorId });
  return course;
};

/**
 * Partial update — only provided fields are changed.
 *
 * @param {string} courseId
 * @param {object} data
 * @param {string} userId
 * @param {string} userRole
 * @returns {object} Updated course document
 */
const updateCourse = async (courseId, data, userId, userRole) => {
  const course = await Course.findById(courseId).populate('instructor', '_id');
  if (!course) throw ApiError.notFound('Course not found');

  assertOwnership(course, userId, userRole);

  // Prevent accidental instructor reassignment through this endpoint
  delete data.instructor;

  Object.assign(course, data);
  await course.save();
  return course;
};

/**
 * Delete a course and cascade-remove its modules and enrollments.
 *
 * @param {string} courseId
 * @param {string} userId
 * @param {string} userRole
 */
const deleteCourse = async (courseId, userId, userRole) => {
  const course = await Course.findById(courseId).populate('instructor', '_id');
  if (!course) throw ApiError.notFound('Course not found');

  assertOwnership(course, userId, userRole);

  // Cascade delete modules and enrollments in parallel
  await Promise.all([
    Module.deleteMany({ course: courseId }),
    Enrollment.deleteMany({ course: courseId }),
    course.deleteOne(),
  ]);
};

module.exports = {
  getAllCourses,
  getInstructorCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
};