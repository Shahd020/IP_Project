// src/routes/auth.js
const express = require('express');
const router = express.Router();

const { register, login, refresh, logout, getMe } = require('../controllers/authController');
const protect = require('../middleware/protect');
const { registerRules, loginRules } = require('../middleware/validators');

// Public routes — validators run BEFORE controller (Lab 9 §5.5 pattern)
router.post('/register', registerRules, register);
router.post('/login', loginRules, login);

// Refresh uses the httpOnly cookie — no body validation needed
router.post('/refresh', refresh);

// Protected routes — require a valid Access Token
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

module.exports = router;
