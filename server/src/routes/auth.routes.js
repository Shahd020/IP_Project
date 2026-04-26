import { Router } from 'express';
import authController from '../controllers/auth.controller.js';
import * as authValidators from '../validators/auth.validators.js';
import validate from '../middleware/validate.js';
import authenticate from '../middleware/authenticate.js';

const router = Router();

router.post('/register', authValidators.register, validate, authController.register);
router.post('/login', authValidators.login, validate, authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authenticate, authController.logout);
router.get('/me', authenticate, authController.getMe);

export default router;
