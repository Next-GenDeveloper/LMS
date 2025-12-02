import { Router } from 'express';
import type { Request, Response } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.ts';
import { User } from '../models/User.ts';
import { Enrollment } from '../models/Enrollment.ts';
import { Course } from '../models/Course.ts';

const router = Router();

// Get current user profile
router.get('/me', requireAuth, async (req: Request, res: Response) => {
  const uid = (req as any).user?.userId;
  const u = await User.findById(uid).select('_id email firstName lastName bio profilePicture role createdAt updatedAt');
  if (!u) return res.status(404).json({ message: 'User not found' });
  res.json(u);
});

// Update current user profile
router.put('/me', requireAuth, async (req: Request, res: Response) => {
  const uid = (req as any).user?.userId;
  const { firstName, lastName, bio, profilePicture } = req.body || {};
  const updated = await User.findByIdAndUpdate(
    uid,
    { firstName, lastName, bio, profilePicture },
    { new: true, runValidators: true }
  ).select('email firstName lastName bio profilePicture role createdAt updatedAt');
  if (!updated) return res.status(404).json({ message: 'User not found' });
  res.json(updated);
});

// Admin: list users
router.get('/', requireAuth, requireRole('admin', 'instructor'), async (_req: Request, res: Response) => {
  const list = await User.find({}).select('email firstName lastName role createdAt');
  res.json(list);
});

// Admin or self: get a user's course-related details (enrollments)
router.get('/:id/enrollments', requireAuth, async (req: Request, res: Response) => {
  const requester = (req as any).user as { userId: string; role: string };
  const { id } = req.params;
  if (requester.userId !== id && requester.role !== 'admin' && requester.role !== 'instructor') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  const enrollments = await Enrollment.find({ student: id })
    .populate({ path: 'course', model: Course, select: 'title price category thumbnail' })
    .select('status progress enrollmentDate completionDate');
  res.json(enrollments);
});

export default router;
