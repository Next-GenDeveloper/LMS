import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.ts';
export const generateToken = (payload) => {
    return jwt.sign(payload, ENV.JWT_SECRET, {
        expiresIn: ENV.JWT_EXPIRE,
    });
};
export const verifyToken = (token) => {
    try {
        return jwt.verify(token, ENV.JWT_SECRET);
    }
    catch (error) {
        throw new Error('Invalid or expired token');
    }
};
export const decodeToken = (token) => {
    try {
        return jwt.decode(token);
    }
    catch (error) {
        return null;
    }
};
