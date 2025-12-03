import { Router } from 'express';
import type { Request, Response } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.ts';
import { User } from '../models/User.ts';
import { Course } from '../models/Course.ts';
import { Enrollment } from '../models/Enrollment.ts';
const router = Router();

router.get('/', requireAuth, requireRole('admin','instructor'), (req: Request, res: Response) => {
  res.json({ message: 'Admin endpoint', user: (req as any).user });
});

router.get('/stats', requireAuth, requireRole('admin','instructor'), async (_req: Request, res: Response) => {
  try {
    const [users, courses, enrollments] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      Course.countDocuments({}),
      Enrollment.find({ paymentStatus: 'completed' }).populate('course', 'price'),
    ]);
    
    // Calculate revenue from completed enrollments
    const revenue = enrollments.reduce((sum, enrollment: any) => {
      return sum + (enrollment.course?.price || 0);
    }, 0);
    
    res.json({ users, courses, revenue });
  } catch (e: any) {
    res.status(500).json({ message: e.message || 'Failed to fetch stats' });
  }
});

router.get('/enrollments', requireAuth, requireRole('admin'), async (_req: Request, res: Response) => {
  try {
    const recentEnrollments = await Enrollment.find({})
      .populate('student', 'firstName lastName email')
      .populate('course', 'title thumbnail price')
      .sort({ enrollmentDate: -1 })
      .limit(10);
    
    res.json({ enrollments: recentEnrollments });
  } catch (e: any) {
    res.status(500).json({ message: e.message || 'Failed to fetch enrollments' });
  }
});

router.get('/courses', requireAuth, requireRole('admin'), async (_req: Request, res: Response) => {
  try {
    const courses = await Course.find({})
      .populate('instructor', 'firstName lastName email')
      .sort({ createdAt: -1 });
    
    res.json({ courses });
  } catch (e: any) {
    res.status(500).json({ message: e.message || 'Failed to fetch courses' });
  }
});

export default router;
