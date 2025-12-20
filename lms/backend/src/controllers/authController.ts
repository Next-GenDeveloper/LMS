import type { Request, Response } from 'express';
import crypto from 'crypto';
import { User } from '../models/User.ts';
import { PendingSignup } from '../models/PendingSignup.ts';
import { hashPassword, comparePassword } from '../utils/Passwordhash.ts';
import { generateToken } from '../utils/jwt.ts';
import { ENV } from '../config/env.ts';
import { sendOtpEmail } from '../utils/emailService.ts';
import * as expressValidator from 'express-validator';
const { validationResult } = expressValidator as any;

function generateOtp(): string {
  // 6-digit code
  return String(Math.floor(100000 + Math.random() * 900000));
}

function hashOtp(otp: string): string {
  return crypto.createHash('sha256').update(otp).digest('hex');
}

export const registerUser = async (req: Request, res: Response) => {
  // Step 1: Create a pending signup + send OTP.
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, fullName } = req.body;
    const normalizedEmail = String(email || '').toLowerCase().trim();
    const [firstName, ...rest] = String(fullName || '').trim().split(' ');
    const lastName = rest.join(' ') || '';

    // Prevent admin registration through normal registration
    const ADMIN_EMAIL = 'mirkashi28@gmail.com';
    if (normalizedEmail === ADMIN_EMAIL.toLowerCase()) {
      return res.status(403).json({ message: 'Admin account cannot be registered through this form' });
    }

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const now = new Date();
    const existingPending = await PendingSignup.findOne({ email: normalizedEmail });

    // Basic resend cooldown if a pending signup already exists
    if (existingPending) {
      const secondsSinceLast = (now.getTime() - new Date(existingPending.lastOtpSentAt).getTime()) / 1000;
      if (secondsSinceLast < ENV.OTP_RESEND_COOLDOWN_SECONDS) {
        return res.status(429).json({
          message: `Please wait ${Math.ceil(ENV.OTP_RESEND_COOLDOWN_SECONDS - secondsSinceLast)} seconds before requesting a new OTP.`,
        });
      }
    }

    const otp = generateOtp();
    const otpHash = hashOtp(otp);
    const otpExpiresAt = new Date(now.getTime() + ENV.OTP_TTL_MINUTES * 60 * 1000);

    const passwordHash = await hashPassword(password);

    await PendingSignup.findOneAndUpdate(
      { email: normalizedEmail },
      {
        email: normalizedEmail,
        passwordHash,
        firstName: firstName || normalizedEmail,
        lastName,
        role: 'student',
        otpHash,
        otpExpiresAt,
        otpAttempts: 0,
        otpResends: existingPending ? existingPending.otpResends + 1 : 0,
        lastOtpSentAt: now,
      },
      { upsert: true, new: true }
    );

    await sendOtpEmail({ to: normalizedEmail, fullName, otp, expiresMinutes: ENV.OTP_TTL_MINUTES });

    return res.status(200).json({
      message: 'OTP sent to your email. Please verify to complete registration.',
      email: normalizedEmail,
      expiresInMinutes: ENV.OTP_TTL_MINUTES,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: error?.message || 'Server error' });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  // Step 2: Verify OTP and create user.
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, otp } = req.body;
    const normalizedEmail = String(email || '').toLowerCase().trim();

    const pending = await PendingSignup.findOne({ email: normalizedEmail });
    if (!pending) {
      return res.status(400).json({ message: 'No pending signup found for this email. Please register again.' });
    }

    if (pending.otpAttempts >= ENV.OTP_MAX_ATTEMPTS) {
      return res.status(429).json({ message: 'Too many OTP attempts. Please request a new OTP.' });
    }

    const now = new Date();
    if (now > pending.otpExpiresAt) {
      return res.status(400).json({ message: 'OTP expired. Please request a new OTP.' });
    }

    const providedHash = hashOtp(String(otp || ''));
    const isValid = crypto.timingSafeEqual(Buffer.from(providedHash), Buffer.from(pending.otpHash));

    if (!isValid) {
      pending.otpAttempts += 1;
      await pending.save();
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Ensure user still doesn't exist
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      await PendingSignup.deleteOne({ _id: pending._id });
      return res.status(400).json({ message: 'User already exists. Please login.' });
    }

    const newUser = new User({
      email: normalizedEmail,
      password: pending.passwordHash,
      firstName: pending.firstName,
      lastName: pending.lastName,
      role: 'student',
      isVerified: true,
    });

    await newUser.save();
    await PendingSignup.deleteOne({ _id: pending._id });

    const token = generateToken({ userId: newUser._id.toString(), email: newUser.email, role: 'student' });

    return res.status(201).json({
      token,
      user: {
        id: newUser._id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role,
      },
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: error?.message || 'Server error' });
  }
};

export const resendOtp = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;
    const normalizedEmail = String(email || '').toLowerCase().trim();

    const pending = await PendingSignup.findOne({ email: normalizedEmail });
    if (!pending) {
      return res.status(400).json({ message: 'No pending signup found for this email. Please register again.' });
    }

    if (pending.otpResends >= ENV.OTP_MAX_RESENDS) {
      return res.status(429).json({ message: 'Resend limit reached. Please register again.' });
    }

    const now = new Date();
    const secondsSinceLast = (now.getTime() - new Date(pending.lastOtpSentAt).getTime()) / 1000;
    if (secondsSinceLast < ENV.OTP_RESEND_COOLDOWN_SECONDS) {
      return res.status(429).json({
        message: `Please wait ${Math.ceil(ENV.OTP_RESEND_COOLDOWN_SECONDS - secondsSinceLast)} seconds before resending OTP.`,
      });
    }

    const otp = generateOtp();
    pending.otpHash = hashOtp(otp);
    pending.otpExpiresAt = new Date(now.getTime() + ENV.OTP_TTL_MINUTES * 60 * 1000);
    pending.otpAttempts = 0;
    pending.otpResends += 1;
    pending.lastOtpSentAt = now;
    await pending.save();

    await sendOtpEmail({ to: normalizedEmail, fullName: `${pending.firstName} ${pending.lastName}`.trim(), otp, expiresMinutes: ENV.OTP_TTL_MINUTES });

    return res.json({ message: 'OTP resent', email: normalizedEmail, expiresInMinutes: ENV.OTP_TTL_MINUTES });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: error?.message || 'Server error' });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Hardcoded Super Admin credentials
    const ADMIN_EMAIL = 'admin@9tangle.com';
    const ADMIN_PASSWORD = 'Admin@9tangle2025!';


    // Check for admin credentials
    const isAdminLogin = email?.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD;


    if (isAdminLogin) {
      // Find or create admin user
      let adminUser = await User.findOne({ email: ADMIN_EMAIL });

      if (!adminUser) {
        // Create admin user if doesn't exist
        const { hashPassword } = await import('../utils/Passwordhash.ts');
        const hashedPassword = await hashPassword(ADMIN_PASSWORD);
        adminUser = new User({
          email: ADMIN_EMAIL,
          password: hashedPassword,
          firstName: 'Super',
          lastName: 'Admin',
          role: 'admin',
          isVerified: true,
        });
        await adminUser.save();
      } else {
        // Ensure existing user is admin
        if (adminUser.role !== 'admin') {
          adminUser.role = 'admin';
          await adminUser.save();
        }
      }

      const token = generateToken({
        userId: adminUser._id.toString(),
        email: adminUser.email,
        role: 'admin'
      });

      return res.status(200).json({
        token,
        user: {
          id: adminUser._id,
          email: adminUser.email,
          firstName: adminUser.firstName,
          lastName: adminUser.lastName,
          role: 'admin'
        }
      });
    }


    // Regular user login
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: 'Email not verified. Please complete OTP verification.' });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken({ userId: user._id.toString(), email: user.email, role: user.role });

    return res.status(200).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const promoteUserRole = async (req: Request, res: Response) => {
  try {
    const { email, role, secret } = req.body || {};
    if (!email || !role) return res.status(400).json({ message: 'email and role are required' });
    // Basic guard to avoid accidental exposure in dev
    const DEV_SECRET = process.env.DEV_PROMOTE_SECRET || 'dev-secret';
    if (process.env.NODE_ENV !== 'development' && secret !== DEV_SECRET) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    if (!['student','admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    const user = await User.findOneAndUpdate({ email }, { role }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json({ id: user._id, email: user.email, role: user.role });
  } catch (e: any) {
    console.error(e);
    return res.status(500).json({ message: 'Server error' });
  }
};
