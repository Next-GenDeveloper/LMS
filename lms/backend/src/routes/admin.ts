import { Router } from 'express';
import type { Request, Response } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.ts';
import { User } from '../models/User.ts';
import { Course } from '../models/Course.ts';
const router = Router();

router.get('/', requireAuth, requireRole('admin','instructor'), (req: Request, res: Response) => {
  res.json({ message: 'Admin endpoint', user: (req as any).user });
});

router.get('/stats', requireAuth, requireRole('admin','instructor'), async (_req: Request, res: Response) => {
  try {
    const [users, courses] = await Promise.all([
      User.countDocuments({}),
      Course.countDocuments({}),
    ]);
    // Placeholder revenue for now
    const revenue = 0;
    res.json({ users, courses, revenue });
  } catch (e: any) {
    res.status(500).json({ message: e.message || 'Failed to fetch stats' });
  }
});

export default router;
