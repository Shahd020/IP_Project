import { Router } from 'express';
import authController from '../controllers/auth.controller.js';
import * as authValidators from '../validators/auth.validators.js';
import validate from '../middleware/validate.js';
import authenticate from '../middleware/authenticate.js';

const router = Router();

/**
 * POST /api/auth/register
 * Public — creates a new student or instructor account.
 */
router.post('/register', authValidators.register, validate, authController.register);

/**
 * POST /api/auth/login
 * Public — returns an access token + sets the refresh-token cookie.
 */
router.post('/login', authValidators.login, validate, authController.login);

/**
 * POST /api/auth/refresh
 * Public (cookie-based) — rotates both tokens using the HttpOnly cookie.
 */
router.post('/refresh', authController.refresh);

/**
 * POST /api/auth/logout
 * Protected — revokes the current refresh token for this device.
 */
router.post('/logout', authenticate, authController.logout);

/**
 * GET /api/auth/me
 * Protected — returns the currently authenticated user's profile.
 */
router.get('/me', authenticate, authController.getMe);

export default router;
