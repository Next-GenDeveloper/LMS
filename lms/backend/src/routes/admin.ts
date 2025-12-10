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

// Create new user (admin only)
router.post('/users', requireAuth, requireRole('admin'), async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, email, password, role = 'student', phone, bio } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    const user = new User({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role,
      phone: phone?.trim(),
      bio: bio?.trim(),
      isVerified: true, // Admin-created users are auto-verified
    });

    await user.save();

    // Return user without password
    const userResponse = await User.findById(user._id).select('-password');
    res.status(201).json({ user: userResponse });
  } catch (e: any) {
    res.status(500).json({ message: e.message || 'Failed to create user' });
  }
});

// Get single user details (admin only)
router.get('/users/:id', requireAuth, requireRole('admin'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (e: any) {
    res.status(500).json({ message: e.message || 'Failed to fetch user' });
  }
});

// Update user (admin only)
router.put('/users/:id', requireAuth, requireRole('admin'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, role, phone, bio, isVerified } = req.body;

    const updateData: any = {
      firstName: firstName?.trim(),
      lastName: lastName?.trim(),
      role,
      phone: phone?.trim(),
      bio: bio?.trim(),
      isVerified,
    };

    // Only update email if it's changed and doesn't conflict
    if (email && email.toLowerCase().trim() !== (await User.findById(id)).email) {
      const existingUser = await User.findOne({
        email: email.toLowerCase().trim(),
        _id: { $ne: id }
      });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use by another user' });
      }
      updateData.email = email.toLowerCase().trim();
    }

    const user = await User.findByIdAndUpdate(id, updateData, { new: true }).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (e: any) {
    res.status(500).json({ message: e.message || 'Failed to update user' });
  }
});

// Delete user (admin only)
router.delete('/users/:id', requireAuth, requireRole('admin'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Prevent deleting admin users
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot delete admin users' });
    }

    await User.findByIdAndDelete(id);
    res.json({ message: 'User deleted successfully' });
  } catch (e: any) {
    res.status(500).json({ message: e.message || 'Failed to delete user' });
  }
});

// Create new user (admin only)
router.post('/users', requireAuth, requireRole('admin'), async (req: Request, res: Response) => {
  try {
    const { email, firstName, lastName, password, role = 'student', phone, bio } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    const user = new User({
      email,
      firstName,
      lastName,
      password: hashedPassword,
      role,
      phone,
      bio,
      preferences: {
        interests: [],
        preferredLanguage: 'en',
        notifications: true
      }
    });

    await user.save();

    // Return user without password
    const userResponse = await User.findById(user._id).select('-password');
    res.status(201).json({ user: userResponse });
  } catch (e: any) {
    res.status(500).json({ message: e.message || 'Failed to create user' });
  }
});

// Update user by ID (admin only)
router.put('/users/:id', requireAuth, requireRole('admin'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { email, firstName, lastName, role, phone, bio, preferences } = req.body;

    const updateData: any = {};
    if (email !== undefined) updateData.email = email;
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (role !== undefined) updateData.role = role;
    if (phone !== undefined) updateData.phone = phone;
    if (bio !== undefined) updateData.bio = bio;
    if (preferences !== undefined) updateData.preferences = preferences;

    const user = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (e: any) {
    res.status(500).json({ message: e.message || 'Failed to update user' });
  }
});

// Delete user by ID (admin only)
router.delete('/users/:id', requireAuth, requireRole('admin'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Prevent deleting admin users
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot delete admin users' });
    }

    await User.findByIdAndDelete(id);
    res.json({ message: 'User deleted successfully' });
  } catch (e: any) {
    res.status(500).json({ message: e.message || 'Failed to delete user' });
  }
});

// Get single user by ID (admin only)
router.get('/users/:id', requireAuth, requireRole('admin'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (e: any) {
    res.status(500).json({ message: e.message || 'Failed to fetch user' });
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
      isPublished: true
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
