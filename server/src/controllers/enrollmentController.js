// src/controllers/enrollmentController.js
const enrollmentService = require('../services/enrollmentService');

exports.enroll = async (req, res, next) => {
  try {
    const enrollment = await enrollmentService.enrollStudent(req.user.userId, req.body.courseId);
    res.status(201).json({ success: true, data: { enrollment } });
  } catch (err) { next(err); }
};

exports.getMyEnrollments = async (req, res, next) => {
  try {
    const enrollments = await enrollmentService.getStudentEnrollments(req.user.userId);
    res.json({ success: true, data: { enrollments } });
  } catch (err) { next(err); }
};

exports.completeModule = async (req, res, next) => {
  try {
    const enrollment = await enrollmentService.completeModule(
      req.params.id, req.body.moduleId, req.user.userId
    );
    res.json({ success: true, data: { enrollment } });
  } catch (err) { next(err); }
};
