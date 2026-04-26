import Enrollment from '../models/Enrollment.js';
import Course from '../models/Course.js';
import Module from '../models/Module.js';
import ApiError from '../utils/ApiError.js';

// ─── Read ─────────────────────────────────────────────────────────────────────

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

const updateProgress = async (enrollmentId, studentId, { moduleId, progressText }) => {
  const enrollment = await Enrollment.findOne({ _id: enrollmentId, student: studentId });
  if (!enrollment) throw ApiError.notFound('Enrollment not found');

  if (enrollment.status === 'saved') {
    enrollment.status = 'in-progress';
  }

  const alreadyDone = enrollment.completedModules
    .map((id) => id.toString())
    .includes(moduleId);

  if (!alreadyDone) {
    enrollment.completedModules.push(moduleId);
  }

  const totalModules = await Module.countDocuments({ course: enrollment.course });

  if (totalModules > 0) {
    enrollment.progressPercent = Math.round(
      (enrollment.completedModules.length / totalModules) * 100
    );
  }

  if (progressText) enrollment.progressText = progressText;

  if (enrollment.progressPercent >= 100) {
    enrollment.status = 'completed';
    enrollment.progressText = 'Finished';
  }

  await enrollment.save();
  return enrollment;
};

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