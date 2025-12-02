import { Router } from 'express';
import { registerUser, loginUser, promoteUserRole } from '../controllers/authController.ts';
import { signupValidation, loginValidation, validate } from '../utils/Validators.ts';

const router = Router();

router.post('/register', validate(signupValidation), registerUser);
router.post('/login', validate(loginValidation), loginUser);
// Dev-only: promote a user to instructor/admin (secure later)
router.post('/promote', promoteUserRole);

export default router;
