import { Router } from 'express';
import { registerUser, loginUser, promoteUserRole } from '../controllers/authController.ts';
import { signupValidation, loginValidation, validate } from '../utils/Validators.ts';
import { authRateLimit } from '../middleware/security.ts';
const router = Router();
router.post('/register', authRateLimit, validate(signupValidation), registerUser);
router.post('/login', authRateLimit, validate(loginValidation), loginUser);
// Dev-only: promote a user to instructor/admin (secure later)
router.post('/promote', authRateLimit, promoteUserRole);
export default router;
