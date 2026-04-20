// src/routes/users.js
// Admin-only user management — replaces ManageUsers.jsx localStorage logic.
const express = require('express');
const router = express.Router();

const { getAllUsers, getUserById, updateUser, deleteUser } = require('../controllers/userController');
const protect = require('../middleware/protect');
const authorize = require('../middleware/authorize');
const { updateUserRules } = require('../middleware/validators');

// All routes in this file: must be logged in AND be an admin
router.use(protect, authorize('admin'));

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.patch('/:id', updateUserRules, updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
