import Enrollment from '../models/Enrollment.js';
import Course from '../models/Course.js';
import Module from '../models/Module.js';
import ApiError from '../utils/ApiError.js';

// ─── Read ─────────────────────────────────────────────────────────────────────

/**
 * All enrollments for the authenticated student, with course + instructor
 * hydrated in a single query.
 *
 * This is the data that replaces the `courses` mock array in StudentCourses.jsx.
 * Shape returned to the frontend:
 *   { _id, status, progressPercent, progressText, course: { title, provider,
 *     duration, rating, thumbnail, instructor: { name } } }
 *
 * @param {string} studentId
 * @param {string} [status]  - Filter by 'saved' | 'in-progress' | 'completed'
 * @returns {object[]}
 */
const getStudentEnrollments = async (studentId, status) => {
  const filter = { student: studentId };
  if (status) filter.status = status;

  return Enrollment.find(filter)
    .populate({
      path: 'course',
      select: 'title provider duration rating thumbnail slug category',
      populate: { path: 'instructor', select: 'name' },
    })
    .sort({ updatedAt: -1 })
    .lean();
};

/**
 * All enrollments for a course — used by the instructor dashboard.
 * Verifies the requesting user owns the course before returning data.
 *
 * @param {string} courseId
 * @param {string} requestingUserId
 * @param {string} requestingUserRole
 * @returns {object[]}
 */
const getCourseEnrollments = async (courseId, requestingUserId, requestingUserRole) => {
  const course = await Course.findById(courseId).select('instructor');
  if (!course) throw ApiError.notFound('Course not found');

  if (
    requestingUserRole !== 'admin' &&
    course.instructor.toString() !== requestingUserId.toString()
  ) {
    throw ApiError.forbidden('You do not own this course');
  }

  return Enrollment.find({ course: courseId })
    .populate('student', 'name email avatar')
    .sort({ createdAt: -1 })
    .lean();
};

// ─── Write ────────────────────────────────────────────────────────────────────

/**
 * Enroll a student in a course or add it to their wishlist.
 * The unique index on {student, course} prevents duplicate enrollments —
 * the E11000 is caught by errorHandler and surfaced as a 409.
 *
 * @param {string} studentId
 * @param {string} courseId
 * @param {'saved'|'in-progress'} [status='saved']
 * @returns {object}
 */
const enrollInCourse = async (studentId, courseId, status = 'saved') => {
  const course = await Course.findById(courseId).select('_id isPublished');
  if (!course) throw ApiError.notFound('Course not found');
  if (!course.isPublished) throw ApiError.badRequest('This course is not available for enrollment');

  const enrollment = await Enrollment.create({
    student: studentId,
    course: courseId,
    status,
    progressText: status === 'in-progress' ? 'Just started' : 'Not Started',
  });

  return enrollment.populate({
    path: 'course',
    select: 'title provider duration rating thumbnail',
  });
};

/**
 * Mark a module as completed, then recompute progressPercent.
 * Automatically transitions status to 'completed' when all modules are done.
 *
 * @param {string} enrollmentId
 * @param {string} studentId    - Ownership guard
 * @param {string} moduleId     - The module just completed
 * @param {string} progressText - Human-readable label, e.g. "Module 4"
 * @returns {object} Updated enrollment
 */
const updateProgress = async (enrollmentId, studentId, { moduleId, progressText }) => {
  const enrollment = await Enrollment.findOne({ _id: enrollmentId, student: studentId });
  if (!enrollment) throw ApiError.notFound('Enrollment not found');
  if (enrollment.status === 'saved') {
    enrollment.status = 'in-progress';
  }

  // Add moduleId to completedModules if not already there
  const alreadyDone = enrollment.completedModules
    .map((id) => id.toString())
    .includes(moduleId);

  if (!alreadyDone) {
    enrollment.completedModules.push(moduleId);
  }

  // Recompute percent from actual module count in the course
  const totalModules = await Module.countDocuments({ course: enrollment.course });

  if (totalModules > 0) {
    enrollment.progressPercent = Math.round(
      (enrollment.completedModules.length / totalModules) * 100
    );
  }

  if (progressText) enrollment.progressText = progressText;

  // Auto-complete when all modules finished
  if (enrollment.progressPercent >= 100) {
    enrollment.status = 'completed';
    enrollment.progressText = 'Finished';
  }

  await enrollment.save();
  return enrollment;
};

/**
 * Remove an enrollment (student unenrolls or removes from wishlist).
 *
 * @param {string} enrollmentId
 * @param {string} studentId - Ownership guard
 */
const unenroll = async (enrollmentId, studentId) => {
  const enrollment = await Enrollment.findOne({ _id: enrollmentId, student: studentId });
  if (!enrollment) throw ApiError.notFound('Enrollment not found');
  await enrollment.deleteOne();
};

export default {
  getStudentEnrollments,
  getCourseEnrollments,
  enrollInCourse,
  updateProgress,
  unenroll,
};
