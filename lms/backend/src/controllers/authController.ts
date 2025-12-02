import type { Request, Response } from 'express';
import { User } from '../models/User.ts';
import { hashPassword, comparePassword } from '../utils/Passwordhash.ts';
import { generateToken } from '../utils/jwt.ts';
import { validationResult } from 'express-validator';

export const registerUser = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, fullName, role } = req.body;
    const [firstName, ...rest] = (fullName || '').split(' ');
    const lastName = rest.join(' ') || '';
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashed = await hashPassword(password);
    const normalizedRole = (role === 'instructor' || role === 'admin') ? role : 'student';
    const newUser = new User({ email, password: hashed, firstName, lastName, role: normalizedRole });
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
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken({ userId: user._id.toString(), email: user.email, role: user.role });

    return res.status(200).json({ token, user: { id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName } });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};
