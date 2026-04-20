// src/services/enrollmentService.js
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

/**
 * Enrolls a student in a course.
 * Increments the course's denormalized enrollmentCount so the catalog
 * never needs to run a COUNT(*) query.
 *
 * @param {string} studentId
 * @param {string} courseId
 * @returns {Promise<object>} New enrollment document
 * @throws {Error} 404 if course not found, 409 if already enrolled
 */
const enrollStudent = async (studentId, courseId) => {
  const course = await Course.findById(courseId);
  if (!course) {
    const err = new Error('Course not found');
    err.statusCode = 404;
    throw err;
  }
  if (course.status !== 'published') {
    const err = new Error('Cannot enroll in an unpublished course');
    err.statusCode = 400;
    throw err;
  }

  try {
    const enrollment = await Enrollment.create({ student: studentId, course: courseId });
    // Increment denormalized counter atomically — avoids a read-modify-write race condition
    await Course.findByIdAndUpdate(courseId, { $inc: { enrollmentCount: 1 } });
    return enrollment;
  } catch (err) {
    if (err.code === 11000) {
      // Unique compound index violation — student is already enrolled
      const conflict = new Error('Already enrolled in this course');
      conflict.statusCode = 409;
      throw conflict;
    }
    throw err;
  }
};

/**
 * Returns all enrollments for a student, with course info populated.
 * Maps to StudentCourses.jsx — replaces the hardcoded courses array.
 *
 * @param {string} studentId
 * @returns {Promise<object[]>}
 */
const getStudentEnrollments = async (studentId) => {
  return Enrollment.find({ student: studentId })
    .populate({
      path: 'course',
      select: 'title thumbnail instructor category level rating duration',
      populate: { path: 'instructor', select: 'name' },
    })
    .sort({ enrolledAt: -1 })
    .lean();
};

/**
 * Marks a module as completed for a student and recalculates overall progress.
 * The Enrollment pre-save hook automatically flips status to 'completed'
 * when progress reaches 100.
 *
 * @param {string} enrollmentId
 * @param {string} moduleId
 * @param {string} studentId - Used to verify the enrollment belongs to this student
 * @returns {Promise<object>} Updated enrollment document
 * @throws {Error} 404 if enrollment not found, 403 if not the owner
 */
const completeModule = async (enrollmentId, moduleId, studentId) => {
  const enrollment = await Enrollment.findById(enrollmentId).populate('course', 'modules');
  if (!enrollment) {
    const err = new Error('Enrollment not found');
    err.statusCode = 404;
    throw err;
  }
  if (enrollment.student.toString() !== studentId) {
    const err = new Error('Access denied');
    err.statusCode = 403;
    throw err;
  }

  // Add to completedModules only if not already present ($addToSet = no duplicates)
  const alreadyDone = enrollment.completedModules.some((id) => id.toString() === moduleId);
  if (!alreadyDone) {
    enrollment.completedModules.push(moduleId);
  }

  // Recalculate progress percentage from the course's total module count
  const totalModules = enrollment.course.modules.length;
  enrollment.progress =
    totalModules > 0 ? Math.round((enrollment.completedModules.length / totalModules) * 100) : 0;

  await enrollment.save(); // triggers the pre-save hook that sets status:'completed'
  return enrollment;
};

module.exports = { enrollStudent, getStudentEnrollments, completeModule };
