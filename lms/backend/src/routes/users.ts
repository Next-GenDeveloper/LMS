import { Router } from 'express';
import type { Request, Response } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.ts';
import { User } from '../models/User.ts';
import { Enrollment } from '../models/Enrollment.ts';
import { Course } from '../models/Course.ts';
import { userProfileValidation, changePasswordValidation, validate } from '../utils/Validators.ts';

const router = Router();

// Get current user profile
router.get('/me', requireAuth, async (req: Request, res: Response): Promise<void> => {
  const uid = (req as any).user?.userId;
  const u = await User.findById(uid).select('_id email firstName lastName bio profilePicture phone preferences role createdAt updatedAt');
  if (!u) {
    res.status(404).json({ message: 'User not found' });
    return;
  }
  res.json(u);
});

// Update current user profile
router.put('/me', requireAuth, validate(userProfileValidation), async (req: Request, res: Response): Promise<void> => {
  const uid = (req as any).user?.userId;
  const { firstName, lastName, bio, profilePicture, phone, email, preferences } = req.body || {};
  const update: any = { firstName, lastName, bio, profilePicture, phone, preferences };
  if (email) update.email = email;
  const updated = await User.findByIdAndUpdate(
    uid,
    update,
    { new: true, runValidators: true }
  ).select('email firstName lastName bio profilePicture phone preferences role createdAt updatedAt');
  if (!updated) {
    res.status(404).json({ message: 'User not found' });
    return;
  }
  res.json(updated);
});

// Change password
router.put('/me/password', requireAuth, validate(changePasswordValidation), async (req: Request, res: Response) => {
  const uid = (req as any).user?.userId;
  const { currentPassword, newPassword } = req.body || {};
  if (!newPassword) return res.status(400).json({ message: 'newPassword is required' });
  const u = await User.findById(uid).select('password');
  if (!u) return res.status(404).json({ message: 'User not found' });
  try {
    const { comparePassword, hashPassword } = await import('../utils/Passwordhash.ts');
    if (currentPassword) {
      const ok = await comparePassword(currentPassword, (u as any).password);
      if (!ok) return res.status(400).json({ message: 'Current password is incorrect' });
    }
    const hashed = await hashPassword(newPassword);
    await User.findByIdAndUpdate(uid, { password: hashed });
    return res.json({ ok: true });
  } catch (e: any) {
    return res.status(500).json({ message: 'Server error' });
  }
});

// Admin: list users
router.get('/', requireAuth, requireRole('admin'), async (_req: Request, res: Response) => {
  const list = await User.find({}).select('email firstName lastName role createdAt');
  res.json(list);
});

// Admin or self: get a user's course-related details (enrollments)
router.get('/:id/enrollments', requireAuth, async (req: Request, res: Response): Promise<void> => {
  const requester = (req as any).user as { userId: string; role: string };
  const { id } = req.params;
  if (requester.userId !== id && requester.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  const enrollments = await Enrollment.find({ student: id })
    .populate({ path: 'course', model: Course, select: 'title price category thumbnail' })
    .select('status progress enrollmentDate completionDate');
  res.json(enrollments);
});

export default router;
