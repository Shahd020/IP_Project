const express = require('express');

const userController = require('../controllers/user.controller.js');
const userValidators = require('../validators/user.validators.js');
const validate = require('../middleware/validate.js');
const authenticate = require('../middleware/authenticate.js');
const authorize = require('../middleware/authorize.js');

const router = express.Router();

router.use(authenticate);

// GET /api/users
router.get(
  '/',
  authorize('admin'),
  userValidators.listUsers,
  validate,
  userController.getAll
);

// GET /api/users/:id
router.get('/:id', userController.getOne);

// PATCH /api/users/:id
router.patch(
  '/:id',
  userValidators.updateUser,
  validate,
  userController.update
);

// PATCH /api/users/:id/toggle-active
router.patch(
  '/:id/toggle-active',
  authorize('admin'),
  userController.toggleActive
);

// DELETE /api/users/:id
router.delete('/:id', authorize('admin'), userController.remove);

module.exports = router;