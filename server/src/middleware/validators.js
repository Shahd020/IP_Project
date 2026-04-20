// src/middleware/validators.js
// express-validator chains — Lab 9 Part 5 pattern.
// Import these arrays into routes and place them BEFORE the controller function.
const { body } = require('express-validator');

// ── Auth ──────────────────────────────────────────────────────────────────────

exports.registerRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),

  body('email')
    .trim()
    .isEmail().withMessage('Must be a valid email address')
    .normalizeEmail()
    // Exercise 4 from Lab 9: reject disposable test domains
    .custom((value) => {
      if (value.endsWith('@test.com')) {
        throw new Error('test.com email addresses are not accepted');
      }
      return true;
    }),

  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),

  body('role')
    .optional()
    .isIn(['student', 'instructor']).withMessage('Role must be student or instructor'),
];

exports.loginRules = [
  body('email')
    .trim()
    .isEmail().withMessage('Must be a valid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required'),
];

// ── Course ────────────────────────────────────────────────────────────────────

exports.createCourseRules = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 3, max: 150 }).withMessage('Title must be 3–150 characters'),

  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ max: 3000 }).withMessage('Description cannot exceed 3000 characters'),

  body('category')
    .notEmpty().withMessage('Category is required'),

  body('price')
    .isFloat({ min: 0 }).withMessage('Price must be 0 or greater'),

  body('level')
    .isIn(['beginner', 'intermediate', 'advanced']).withMessage('Invalid level'),
];

// Exercise 3 from Lab 9: at least one field must be present for an update
exports.updateCourseRules = [
  body('title').optional().trim()
    .isLength({ min: 3, max: 150 }).withMessage('Title must be 3–150 characters'),
  body('price').optional()
    .isFloat({ min: 0 }).withMessage('Price must be 0 or greater'),
  body('level').optional()
    .isIn(['beginner', 'intermediate', 'advanced']).withMessage('Invalid level'),
  body('status').optional()
    .isIn(['draft', 'published', 'archived']).withMessage('Invalid status'),
];

// ── User (admin) ──────────────────────────────────────────────────────────────

exports.updateUserRules = [
  body('name').optional().trim()
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').optional().trim()
    .isEmail().withMessage('Must be a valid email address')
    .normalizeEmail(),
  body('role').optional()
    .isIn(['student', 'instructor', 'admin']).withMessage('Role must be student, instructor, or admin'),
];
