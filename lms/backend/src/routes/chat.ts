import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { ChatMessage } from '../models/ChatMessage.js';

const router = express.Router();

// Create a new chat message
router.post('/courses/:courseId/messages', requireAuth, async (req, res): Promise<void> => {
  try {
    const { courseId } = req.params;
    const { content } = req.body;
    const userId = (req as any).user?.userId;

    if (!content) {
      res.status(400).json({ error: 'Message content is required' });
      return;
    }

    const message = new ChatMessage({
      course: courseId,
      sender: userId,
      content,
    });

    await message.save();

    res.status(201).json(message);
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get messages for a course
router.get('/courses/:courseId/messages', requireAuth, async (req, res): Promise<void> => {
  try {
    const { courseId } = req.params;

    const messages = await ChatMessage.find({ course: courseId })
      .populate('sender', 'firstName lastName')
      .sort({ createdAt: 'asc' });

    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;