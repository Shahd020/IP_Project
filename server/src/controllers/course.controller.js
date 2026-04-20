import courseService from '../services/course.service.js';
import asyncHandler from '../utils/asyncHandler.js';

// ─── GET /api/courses ─────────────────────────────────────────────────────────
const getAll = asyncHandler(async (req, res) => {
  const { page, limit, search, category } = req.query;
  const result = await courseService.getAllCourses({ page, limit, search, category });

  res.status(200).json({ success: true, data: result });
});

// ─── GET /api/courses/instructor/my ──────────────────────────────────────────
const getMyCourses = asyncHandler(async (req, res) => {
  const courses = await courseService.getInstructorCourses(req.user._id);
  res.status(200).json({ success: true, data: { courses } });
});

// ─── GET /api/courses/:id ─────────────────────────────────────────────────────
const getOne = asyncHandler(async (req, res) => {
  const course = await courseService.getCourseById(req.params.id);
  res.status(200).json({ success: true, data: { course } });
});

// ─── POST /api/courses ────────────────────────────────────────────────────────
const create = asyncHandler(async (req, res) => {
  const course = await courseService.createCourse(req.body, req.user._id);
  res.status(201).json({ success: true, message: 'Course created', data: { course } });
});

// ─── PATCH /api/courses/:id ───────────────────────────────────────────────────
const update = asyncHandler(async (req, res) => {
  const course = await courseService.updateCourse(
    req.params.id,
    req.body,
    req.user._id,
    req.user.role
  );
  res.status(200).json({ success: true, message: 'Course updated', data: { course } });
});

// ─── DELETE /api/courses/:id ──────────────────────────────────────────────────
const remove = asyncHandler(async (req, res) => {
  await courseService.deleteCourse(req.params.id, req.user._id, req.user.role);
  res.status(200).json({ success: true, message: 'Course deleted' });
});

export default { getAll, getMyCourses, getOne, create, update, remove };
