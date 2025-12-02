import { Router } from 'express';
import type { Request, Response } from 'express';
import { Course } from '../models/Course.ts';
import { requireAuth, requireRole } from '../middleware/auth.ts';
const router = Router();

// List courses
router.get('/', async (_req: Request, res: Response) => {
  try {
    const courses = await Course.find({}).sort({ createdAt: -1 }).limit(200);
    res.json(courses.map((c) => ({
      id: c._id,
      title: c.title,
      description: c.description,
      price: c.price,
      thumbnail: c.thumbnail,
      category: c.category,
      isPublished: c.isPublished,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    })));
  } catch (e: any) {
    res.status(500).json({ message: e.message || 'Failed to list courses' });
  }
});

// Get one course
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const c = await Course.findById(id);
    if (!c) return res.status(404).json({ message: 'Course not found' });
    res.json({
      id: c._id,
      title: c.title,
      description: c.description,
      price: c.price,
      thumbnail: c.thumbnail,
      category: c.category,
      isPublished: c.isPublished,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    });
  } catch (e: any) {
    res.status(500).json({ message: e.message || 'Failed to get course' });
  }
});

// Create course (instructor/admin)
router.post('/', requireAuth, requireRole('instructor','admin'), async (req: Request, res: Response) => {
  try {
    const { title, description, price, thumbnail, category } = req.body || {};
    if (!title || !description) return res.status(400).json({ message: 'title and description are required' });
    const instructor = (req as any).user?.userId;
    const course = await Course.create({
      title,
      description,
      price: Number(price) || 0,
      thumbnail: thumbnail || '',
      category: category || 'General',
      instructor,
      isPublished: false,
    });
    res.status(201).json({ id: course._id });
  } catch (e: any) {
    res.status(500).json({ message: e.message || 'Failed to create course' });
  }
});

// Update course (instructor/admin)
router.put('/:id', requireAuth, requireRole('instructor','admin'), async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const payload = req.body || {};
    const updated = await Course.findByIdAndUpdate(id, payload, { new: true });
    if (!updated) return res.status(404).json({ message: 'Course not found' });
    res.json({ id: updated._id });
  } catch (e: any) {
    res.status(500).json({ message: e.message || 'Failed to update course' });
  }
});

// Delete course (instructor/admin)
router.delete('/:id', requireAuth, requireRole('instructor','admin'), async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const deleted = await Course.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Course not found' });
    res.json({ success: true });
  } catch (e: any) {
    res.status(500).json({ message: e.message || 'Failed to delete course' });
  }
});

export default router;
