const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller.js');
const validate = require('../middleware/validate.js');
const { registerRules, loginRules } = require('../middleware/validators.js');
const authenticate = require('../middleware/protect.js'); // or authenticate.js (depending on your file name)

// Routes
router.post('/register', registerRules, validate, authController.register);
router.post('/login', loginRules, validate, authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authenticate, authController.logout);
router.get('/me', authenticate, authController.getMe);

module.exports = router;