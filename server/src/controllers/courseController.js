// src/controllers/courseController.js
const { validationResult } = require('express-validator');
const courseService = require('../services/courseService');

exports.getCourses = async (req, res, next) => {
  try {
    const courses = await courseService.getCourses(req.query);
    res.json({ success: true, data: { courses } });
  } catch (err) { next(err); }
};

exports.getMyCourses = async (req, res, next) => {
  try {
    const courses = await courseService.getCoursesByInstructor(req.user.userId);
    res.json({ success: true, data: { courses } });
  } catch (err) { next(err); }
};

exports.getCourseById = async (req, res, next) => {
  try {
    const course = await courseService.getCourseById(req.params.id);
    res.json({ success: true, data: { course } });
  } catch (err) { next(err); }
};

exports.createCourse = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
  try {
    const course = await courseService.createCourse(req.body, req.user.userId);
    res.status(201).json({ success: true, data: { course } });
  } catch (err) { next(err); }
};

exports.updateCourse = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
  try {
    const course = await courseService.updateCourse(req.params.id, req.body, req.user);
    res.json({ success: true, data: { course } });
  } catch (err) { next(err); }
};

exports.deleteCourse = async (req, res, next) => {
  try {
    await courseService.deleteCourse(req.params.id, req.user);
    res.status(204).end();
  } catch (err) { next(err); }
};
