// src/routes/courses.js
const express = require('express');
const router = express.Router();

const {
  getCourses,
  getMyCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} = require('../controllers/courseController');

const protect = require('../middleware/protect');
const authorize = require('../middleware/authorize');
const { createCourseRules, updateCourseRules } = require('../middleware/validators');

// Public — anyone can browse the catalog and view course details
router.get('/', getCourses);

// /instructor/my must come before /:id so it isn't swallowed as id="instructor"
router.get('/instructor/my', protect, authorize('instructor', 'admin'), getMyCourses);

router.get('/:id', getCourseById);

// Protected — only instructors and admins may create courses
router.post('/', protect, authorize('instructor', 'admin'), createCourseRules, createCourse);

// Protected — instructor (owner) or admin may update/delete
router.patch('/:id', protect, authorize('instructor', 'admin'), updateCourseRules, updateCourse);

// Exercise 1 from Lab 9: admin middleware applied to DELETE
router.delete('/:id', protect, authorize('instructor', 'admin'), deleteCourse);

module.exports = router;
