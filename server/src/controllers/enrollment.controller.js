import enrollmentService from '../services/enrollment.service.js';
import asyncHandler from '../utils/asyncHandler.js';

// ─── GET /api/enrollments/my ──────────────────────────────────────────────────
const getMine = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const enrollments = await enrollmentService.getStudentEnrollments(req.user._id, status);
  res.status(200).json({ success: true, data: { enrollments } });
});

// ─── GET /api/enrollments/course/:courseId ────────────────────────────────────
const getByCourse = asyncHandler(async (req, res) => {
  const enrollments = await enrollmentService.getCourseEnrollments(
    req.params.courseId,
    req.user._id,
    req.user.role
  );
  res.status(200).json({ success: true, data: { enrollments } });
});

// ─── POST /api/enrollments ────────────────────────────────────────────────────
const enroll = asyncHandler(async (req, res) => {
  const { courseId, status } = req.body;
  const enrollment = await enrollmentService.enrollInCourse(req.user._id, courseId, status);
  res.status(201).json({ success: true, message: 'Enrolled successfully', data: { enrollment } });
});

// ─── PATCH /api/enrollments/:id/progress ─────────────────────────────────────
const updateProgress = asyncHandler(async (req, res) => {
  const enrollment = await enrollmentService.updateProgress(
    req.params.id,
    req.user._id,
    req.body
  );
  res.status(200).json({ success: true, data: { enrollment } });
});

// ─── DELETE /api/enrollments/:id ─────────────────────────────────────────────
const unenroll = asyncHandler(async (req, res) => {
  await enrollmentService.unenroll(req.params.id, req.user._id);
  res.status(200).json({ success: true, message: 'Unenrolled successfully' });
});

export default { getMine, getByCourse, enroll, updateProgress, unenroll };