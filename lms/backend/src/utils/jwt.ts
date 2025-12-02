import jwt from 'jsonwebtoken';
import { ENV } from '../config/env';

export interface JWTPayload {
  userId: string;
  email: string;
  role: 'student' | 'instructor' | 'admin';
}

export const generateToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, ENV. JWT_SECRET, {
    expiresIn: ENV.JWT_EXPIRE,
  });
};

export const verifyToken = (token: string): JWTPayload => {
  try {
    return jwt.verify(token, ENV. JWT_SECRET) as JWTPayload;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

export const decodeToken = (token: string): JWTPayload | null => {
  try {
    return jwt.decode(token) as JWTPayload;
  } catch (error) {
    return null;
  }
};