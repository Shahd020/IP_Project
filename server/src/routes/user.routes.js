import { Router } from 'express';
import userController from '../controllers/user.controller.js';
import * as userValidators from '../validators/user.validators.js';
import validate from '../middleware/validate.js';
import authenticate from '../middleware/authenticate.js';
import authorize from '../middleware/authorize.js';

const router = Router();

router.use(authenticate);

/**
 * GET /api/users
 * Admin only — paginated list with optional role/search filters.
 * Powers ManageUsers.jsx dashboard.
 */
router.get(
  '/',
  authorize('admin'),
  userValidators.listUsers,
  validate,
  userController.getAll
);

/**
 * GET /api/users/:id
 * Admins may view any user; other roles only their own (enforced in service).
 */
router.get('/:id', userController.getOne);

/**
 * PATCH /api/users/:id
 * Admins may change any field. Students/instructors may only update
 * name and avatar on their own profile (service enforces this).
 */
router.patch(
  '/:id',
  userValidators.updateUser,
  validate,
  userController.update
);

/**
 * PATCH /api/users/:id/toggle-active
 * Admin only — activate or deactivate an account.
 */
router.patch(
  '/:id/toggle-active',
  authorize('admin'),
  userController.toggleActive
);

/**
 * DELETE /api/users/:id
 * Admin only — hard delete with cascade.
 */
router.delete('/:id', authorize('admin'), userController.remove);

export default router;
