// src/controllers/courseController.js
const { validationResult } = require('express-validator');
const courseService = require('../services/courseService');

// GET /api/courses  — public catalog
exports.getCourses = async (req, res, next) => {
  try {
    const courses = await courseService.getCourses(req.query);
    res.json(courses);
  } catch (err) {
    next(err);
  }
};

// GET /api/courses/my  — instructor's own courses (protected)
exports.getMyCourses = async (req, res, next) => {
  try {
    const courses = await courseService.getCoursesByInstructor(req.user.userId);
    res.json(courses);
  } catch (err) {
    next(err);
  }
};

// GET /api/courses/:id
exports.getCourseById = async (req, res, next) => {
  try {
    const course = await courseService.getCourseById(req.params.id);
    res.json(course);
  } catch (err) {
    next(err);
  }
};

// POST /api/courses  — instructor or admin only
exports.createCourse = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const course = await courseService.createCourse(req.body, req.user.userId);
    res.status(201).json(course);
  } catch (err) {
    next(err);
  }
};

// PATCH /api/courses/:id
exports.updateCourse = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const course = await courseService.updateCourse(req.params.id, req.body, req.user);
    res.json(course);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/courses/:id
exports.deleteCourse = async (req, res, next) => {
  try {
    await courseService.deleteCourse(req.params.id, req.user);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
