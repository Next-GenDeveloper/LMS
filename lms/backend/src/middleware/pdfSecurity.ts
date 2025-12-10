import type { Request, Response, NextFunction } from 'express';
import { Enrollment } from '../models/Enrollment.ts';
import { verifyToken } from '../utils/jwt.ts';

/**
 * Middleware to secure PDF files and ensure only enrolled users with completed payments can access them
 */
export async function pdfSecurity(req: Request, res: Response, next: NextFunction) {
  try {
    // Extract token from query parameters or authorization header
    const token = req.query.token as string || req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication token required to access this resource'
      });
    }

    // Verify JWT token
    const decoded = await verifyToken(token);
    if (!decoded || !decoded.userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid authentication token'
      });
    }

    const userId = decoded.userId;
    const courseId = req.query.courseId as string;

    if (!courseId) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Course ID is required'
      });
    }

    // Check if user is enrolled in the course with completed payment
    const enrollment = await Enrollment.findOne({
      student: userId,
      course: courseId,
      paymentStatus: 'completed'
    });

    if (!enrollment) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You must enroll in this course and complete payment to access this content'
      });
    }

    // Check if enrollment is active
    if (enrollment.status !== 'active') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Your enrollment is not active. Please contact support.'
      });
    }

    // If all checks pass, allow access to the PDF
    next();
  } catch (error: any) {
    console.error('PDF Security Middleware Error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to verify access permissions'
    });
  }
}

/**
 * Middleware to check admin access for PDF management
 */
export async function adminPdfAccess(req: Request, res: Response, next: NextFunction) {
  try {
    // Extract token from authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication token required'
      });
    }

    // Verify JWT token
    const decoded = await verifyToken(token);
    if (!decoded || !decoded.userId || !decoded.role) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid authentication token'
      });
    }

    // Check if user has admin role
    if (decoded.role !== 'admin') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Admin access required for this operation'
      });
    }

    // If all checks pass, allow access
    next();
  } catch (error: any) {
    console.error('Admin PDF Access Middleware Error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to verify admin access'
    });
  }
}