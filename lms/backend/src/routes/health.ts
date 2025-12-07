import { Router } from 'express';
import { Announcement } from '../models/Announcement.ts';
const router = Router();

router.get('/health', (_req, res) => {
  res.json({ ok: true, ts: new Date().toISOString() });
});

router.get('/announcements', async (_req, res) => {
  try {
    const announcements = await Announcement.find({ isActive: true })
      .populate('createdBy', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(10);
    res.json({ announcements });
  } catch (e: any) {
    res.status(500).json({ message: e.message || 'Failed to fetch announcements' });
  }
});

export default router;
