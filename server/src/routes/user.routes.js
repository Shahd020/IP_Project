import { Router } from 'express';
import userController from '../controllers/user.controller.js';
import { updateUser as updateUserRules, listUsers as listUsersRules } from '../validators/user.validators.js';
import validate from '../middleware/validate.js';
import authenticate from '../middleware/authenticate.js';
import authorize from '../middleware/authorize.js';

const router = Router();

router.use(authenticate);

// GET /api/users
router.get('/', authorize('admin'), listUsersRules, validate, userController.getAll);

// GET /api/users/:id
router.get('/:id', userController.getOne);

// PATCH /api/users/:id
router.patch('/:id', updateUserRules, validate, userController.update);

// PATCH /api/users/:id/toggle-active
router.patch('/:id/toggle-active', authorize('admin'), userController.toggleActive);

// DELETE /api/users/me  (self-service account deletion — must be before /:id)
router.delete('/me', userController.deleteMe);

// DELETE /api/users/:id
router.delete('/:id', authorize('admin'), userController.remove);

export default router;
