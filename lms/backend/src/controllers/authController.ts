import type { Request, Response } from 'express';
import { User } from '../models/User.ts';
import { hashPassword, comparePassword } from '../utils/Passwordhash.ts';
import { generateToken } from '../utils/jwt.ts';
import * as expressValidator from 'express-validator';
const { validationResult } = expressValidator as any;

export const registerUser = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, fullName } = req.body;
    const [firstName, ...rest] = (fullName || '').split(' ');
    const lastName = rest.join(' ') || '';
    
    // Prevent admin registration through normal registration
    const ADMIN_EMAIL = 'mirkashi28@gmail.com';
    if (email.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase()) {
      return res.status(403).json({ message: 'Admin account cannot be registered through this form' });
    }
    
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashed = await hashPassword(password);
    // Always set role to 'student' - admin role cannot be assigned through registration
    const newUser = new User({ email, password: hashed, firstName, lastName, role: 'student' });
    await newUser.save();

    const token = generateToken({ userId: newUser._id.toString(), email: newUser.email, role: 'student' });

    return res.status(201).json({ token, user: { id: newUser._id, email: newUser.email, firstName: newUser.firstName, lastName: newUser.lastName } });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
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
