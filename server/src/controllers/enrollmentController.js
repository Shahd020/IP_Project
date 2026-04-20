// src/controllers/enrollmentController.js
const enrollmentService = require('../services/enrollmentService');

// POST /api/enrollments  — student enrolls in a course
exports.enroll = async (req, res, next) => {
  try {
    const enrollment = await enrollmentService.enrollStudent(
      req.user.userId,
      req.body.courseId
    );
    res.status(201).json(enrollment);
  } catch (err) {
    next(err);
  }
};

// GET /api/enrollments/my  — student's enrolled courses list (replaces StudentCourses mock)
exports.getMyEnrollments = async (req, res, next) => {
  try {
    const enrollments = await enrollmentService.getStudentEnrollments(req.user.userId);
    res.json(enrollments);
  } catch (err) {
    next(err);
  }
};

// PATCH /api/enrollments/:id/complete-module  — mark a module as done, updates progress
exports.completeModule = async (req, res, next) => {
  try {
    const enrollment = await enrollmentService.completeModule(
      req.params.id,
      req.body.moduleId,
      req.user.userId
    );
    res.json(enrollment);
  } catch (err) {
    next(err);
  }
};
