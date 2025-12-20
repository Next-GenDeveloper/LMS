import { Router } from 'express';
import { registerUser, loginUser, promoteUserRole, verifyOtp, resendOtp } from '../controllers/authController.ts';
import { signupValidation, loginValidation, validate, verifyOtpValidation, resendOtpValidation } from '../utils/Validators.ts';
import { authRateLimit } from '../middleware/security.ts';

const router = Router();

// Step 1: request OTP (stores pending signup + emails OTP)
router.post('/register', authRateLimit, validate(signupValidation), registerUser);
// Step 2: verify OTP (creates user + returns token)
router.post('/verify-otp', authRateLimit, validate(verifyOtpValidation), verifyOtp);
// Resend OTP
router.post('/resend-otp', authRateLimit, validate(resendOtpValidation), resendOtp);

router.post('/login', authRateLimit, validate(loginValidation), loginUser);
// Dev-only: promote a user to instructor/admin (secure later)
router.post('/promote', authRateLimit, promoteUserRole);

export default router;
