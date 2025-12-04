import { Router } from 'express';
import type { Request, Response } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.ts';
import { User } from '../models/User.ts';
import { Course } from '../models/Course.ts';
import { Enrollment } from '../models/Enrollment.ts';
import { Announcement } from '../models/Announcement.ts';
import { hashPassword, comparePassword } from '../utils/Passwordhash.ts';
const router = Router();

router.get('/', requireAuth, requireRole('admin'), (req: Request, res: Response) => {
  res.json({ message: 'Admin endpoint', user: (req as any).user });
});

router.get('/stats', requireAuth, requireRole('admin'), async (_req: Request, res: Response) => {
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
      .sort({ createdAt: -1 });

    res.json({ courses });
  } catch (e: any) {
    res.status(500).json({ message: e.message || 'Failed to fetch courses' });
  }
});

// Users management
router.get('/users', requireAuth, requireRole('admin'), async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const query = search ? {
      $or: [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    } : {};

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await User.countDocuments(query);

    res.json({ users, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (e: any) {
    res.status(500).json({ message: e.message || 'Failed to fetch users' });
  }
});

// Course CRUD
router.post('/courses', requireAuth, requireRole('admin'), async (req: Request, res: Response) => {
  try {
    const { title, description, thumbnail, category, price, level, duration, language, tags, modules } = req.body;
    const user = (req as any).user;

    const course = new Course({
      title,
      description,
      thumbnail,
      category,
      price: Number(price),
      level,
      duration: Number(duration),
      language,
      tags: tags || [],
      modules: modules || [],
      isPublished: false
    });

    await course.save();
    res.status(201).json({ course });
  } catch (e: any) {
    res.status(500).json({ message: e.message || 'Failed to create course' });
  }
});

router.put('/courses/:id', requireAuth, requireRole('admin'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const course = await Course.findByIdAndUpdate(id, updates, { new: true });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json({ course });
  } catch (e: any) {
    res.status(500).json({ message: e.message || 'Failed to update course' });
  }
});

router.delete('/courses/:id', requireAuth, requireRole('admin'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Course.findByIdAndDelete(id);
    res.json({ message: 'Course deleted successfully' });
  } catch (e: any) {
    res.status(500).json({ message: e.message || 'Failed to delete course' });
  }
});

// Enrollments/Payments
router.get('/enrollments', requireAuth, requireRole('admin'), async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const enrollments = await Enrollment.find({})
      .populate('student', 'firstName lastName email')
      .populate('course', 'title price')
      .sort({ enrollmentDate: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Enrollment.countDocuments();

    res.json({ enrollments, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (e: any) {
    res.status(500).json({ message: e.message || 'Failed to fetch enrollments' });
  }
});

// Announcements
router.get('/announcements', requireAuth, requireRole('admin'), async (_req: Request, res: Response) => {
  try {
    const announcements = await Announcement.find({})
      .populate('createdBy', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.json({ announcements });
  } catch (e: any) {
    res.status(500).json({ message: e.message || 'Failed to fetch announcements' });
  }
});

router.post('/announcements', requireAuth, requireRole('admin'), async (req: Request, res: Response) => {
  try {
    const { title, message, type } = req.body;
    const user = (req as any).user;

    const announcement = new Announcement({
      title,
      message,
      type: type || 'info',
      createdBy: user.userId
    });

    await announcement.save();
    res.status(201).json({ announcement });
  } catch (e: any) {
    res.status(500).json({ message: e.message || 'Failed to create announcement' });
  }
});

router.put('/announcements/:id', requireAuth, requireRole('admin'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, message, type, isActive } = req.body;

    const announcement = await Announcement.findByIdAndUpdate(id, {
      title,
      message,
      type,
      isActive
    }, { new: true });

    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    res.json({ announcement });
  } catch (e: any) {
    res.status(500).json({ message: e.message || 'Failed to update announcement' });
  }
});

router.delete('/announcements/:id', requireAuth, requireRole('admin'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Announcement.findByIdAndDelete(id);
    res.json({ message: 'Announcement deleted successfully' });
  } catch (e: any) {
    res.status(500).json({ message: e.message || 'Failed to delete announcement' });
  }
});

// Settings - Change password
router.put('/settings/password', requireAuth, requireRole('admin'), async (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = (req as any).user;

    const adminUser = await User.findById(user.userId);
    if (!adminUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await comparePassword(currentPassword, adminUser.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    const hashed = await hashPassword(newPassword);
    adminUser.password = hashed;
    await adminUser.save();

    res.json({ message: 'Password updated successfully' });
  } catch (e: any) {
    res.status(500).json({ message: e.message || 'Failed to update password' });
  }
});

export default router;
