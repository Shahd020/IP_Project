// src/controllers/userController.js
const { validationResult } = require('express-validator');
const userService = require('../services/userService');

// GET /api/users  — admin only
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (err) {
    next(err);
  }
};

// GET /api/users/:id  — admin only
exports.getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.json(user);
  } catch (err) {
    next(err);
  }
};

// PATCH /api/users/:id  — admin only
exports.updateUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const user = await userService.updateUser(req.params.id, req.body);
    res.json(user);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/users/:id  — admin only
exports.deleteUser = async (req, res, next) => {
  try {
    await userService.deleteUser(req.params.id, req.user.userId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
