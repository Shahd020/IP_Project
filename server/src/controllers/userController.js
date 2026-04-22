// src/controllers/userController.js
const { validationResult } = require('express-validator');
const userService = require('../services/userService');

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    res.json({ success: true, data: { users } });
  } catch (err) { next(err); }
};

exports.getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.json({ success: true, data: { user } });
  } catch (err) { next(err); }
};

exports.updateUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    res.json({ success: true, data: { user } });
  } catch (err) { next(err); }
};

exports.deleteUser = async (req, res, next) => {
  try {
    await userService.deleteUser(req.params.id, req.user.userId);
    res.status(204).end();
  } catch (err) { next(err); }
};
