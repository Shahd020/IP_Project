import { body, query } from 'express-validator';

/** PATCH /api/users/:id */
const updateUser = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be 2–50 characters'),

  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('role')
    .optional()
    .isIn(['student', 'instructor', 'admin'])
    .withMessage('Role must be student, instructor, or admin'),

  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),

  body('avatar')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Avatar URL is too long'),
];

/** GET /api/users */
const listUsers = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('role')
    .optional()
    .isIn(['student', 'instructor', 'admin'])
    .withMessage('Invalid role filter'),
  query('search').optional().trim().isLength({ max: 100 }),
];

export { updateUser, listUsers };