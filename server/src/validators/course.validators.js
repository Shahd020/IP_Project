const { body, param, query } = require('express-validator');

const CATEGORIES = [
  'Web Development', 'Data Science', 'Machine Learning', 'Cyber Security',
  'Cloud Computing', 'Game Development', 'Mobile Development',
  'UI/UX Design', 'Blockchain', 'Other',
];

// ─── Course ───────────────────────────────────────────────────────────────────

const createCourse = [
  body('title').trim().notEmpty().withMessage('Title is required')
    .isLength({ min: 5, max: 150 }).withMessage('Title must be 5–150 characters'),
  body('description').trim().notEmpty().withMessage('Description is required')
    .isLength({ min: 20, max: 2000 }).withMessage('Description must be 20–2000 characters'),
  body('category').notEmpty().withMessage('Category is required')
    .isIn(CATEGORIES).withMessage('Invalid category'),
  body('provider').trim().notEmpty().withMessage('Provider is required')
    .isLength({ max: 100 }).withMessage('Provider cannot exceed 100 characters'),
  body('duration').trim().notEmpty().withMessage('Duration is required'),
  body('thumbnail').optional().isURL().withMessage('Thumbnail must be a valid URL'),
];

const updateCourse = [
  body('title').optional().trim()
    .isLength({ min: 5, max: 150 }).withMessage('Title must be 5–150 characters'),
  body('description').optional().trim()
    .isLength({ min: 20, max: 2000 }).withMessage('Description must be 20–2000 characters'),
  body('category').optional()
    .isIn(CATEGORIES).withMessage('Invalid category'),
  body('provider').optional().trim()
    .isLength({ max: 100 }).withMessage('Provider cannot exceed 100 characters'),
  body('thumbnail').optional().isURL().withMessage('Thumbnail must be a valid URL'),
  body('isPublished').optional().isBoolean().withMessage('isPublished must be a boolean'),
];

// ─── Module ───────────────────────────────────────────────────────────────────

const createModule = [
  body('title').trim().notEmpty().withMessage('Module title is required')
    .isLength({ min: 3, max: 150 }).withMessage('Title must be 3–150 characters'),
  body('order').notEmpty().withMessage('Order is required')
    .isInt({ min: 1 }).withMessage('Order must be a positive integer'),
  body('videoUrl').optional().isURL().withMessage('videoUrl must be a valid URL'),
  body('videoOverview').optional().trim()
    .isLength({ max: 1000 }).withMessage('Overview cannot exceed 1000 characters'),
];

const updateModule = [
  body('title').optional().trim()
    .isLength({ min: 3, max: 150 }).withMessage('Title must be 3–150 characters'),
  body('order').optional()
    .isInt({ min: 1 }).withMessage('Order must be a positive integer'),
  body('videoUrl').optional().isURL().withMessage('videoUrl must be a valid URL'),
  body('videoOverview').optional().trim()
    .isLength({ max: 1000 }).withMessage('Overview cannot exceed 1000 characters'),
];

// ─── Course List Query ────────────────────────────────────────────────────────

const listCourses = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be 1–50'),
  query('category').optional().isIn(CATEGORIES).withMessage('Invalid category'),
  query('search').optional().trim().isLength({ max: 100 }).withMessage('Search too long'),
];

module.exports = {
  createCourse,
  updateCourse,
  createModule,
  updateModule,
  listCourses,
};