import { Router } from 'express';
import type { Request, Response } from 'express';
import { Enrollment } from '../models/Enrollment.ts';
import { Course } from '../models/Course.ts';
import { requireAuth } from '../middleware/auth.ts';

const router = Router();

// Check if user is enrolled in a course
router.get('/check/:courseId', requireAuth, async (req: Request, res: Response) => {
  try {
    const courseId = req.params.courseId;
    const userId = (req as any).user?.userId;

    const enrollment = await Enrollment.findOne({
      student: userId,
      course: courseId,
      paymentStatus: 'completed'
    });

    res.json({
      isEnrolled: !!enrollment,
      enrollmentStatus: enrollment?.status || null,
      paymentStatus: enrollment?.paymentStatus || null
    });
  } catch (e: any) {
    res.status(500).json({ message: e.message || 'Failed to check enrollment' });
  }
});

// Create enrollment with payment (simplified payment processing)
router.post('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const { courseId, paymentMethod = 'credit_card' } = req.body;
    const userId = (req as any).user?.userId;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if user is already enrolled
    const existingEnrollment = await Enrollment.findOne({
      student: userId,
      course: courseId
    });

    if (existingEnrollment) {
      if (existingEnrollment.paymentStatus === 'completed') {
        return res.status(400).json({ message: 'Already enrolled in this course' });
      } else {
        // Update existing enrollment
        existingEnrollment.paymentStatus = 'completed';
        existingEnrollment.status = 'active';
        existingEnrollment.paymentId = `PAY-${Date.now()}`;
        await existingEnrollment.save();

        // Update course enrollment count
        course.enrollmentCount += 1;
        await course.save();

        return res.json({
          success: true,
          enrollmentId: existingEnrollment._id,
          message: 'Enrollment updated successfully'
        });
      }
    }

    // Process payment (simplified - in real app, integrate with Stripe/PayPal)
    const paymentId = `PAY-${Date.now()}`;
    const paymentStatus = 'completed'; // Assume payment succeeds

    // Create new enrollment
    const enrollment = await Enrollment.create({
      student: userId,
      course: courseId,
      status: 'active',
      paymentStatus: paymentStatus,
      paymentId: paymentId,
      progress: 0
    });

    // Update course enrollment count
    course.enrollmentCount += 1;
    await course.save();

    res.status(201).json({
      success: true,
      enrollmentId: enrollment._id,
      message: 'Enrollment successful'
    });
  } catch (e: any) {
    res.status(500).json({ message: e.message || 'Failed to create enrollment' });
  }
});

// Get user enrollments
router.get('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;

    const enrollments = await Enrollment.find({ student: userId })
      .populate('course', 'title description bannerImage price category')
      .sort({ enrollmentDate: -1 });

    res.json(enrollments.map(e => ({
      id: e._id,
      course: {
        id: e.course._id,
        title: e.course.title,
        description: e.course.description,
        bannerImage: e.course.bannerImage,
        price: e.course.price,
        category: e.course.category
      },
      status: e.status,
      paymentStatus: e.paymentStatus,
      progress: e.progress,
      enrollmentDate: e.enrollmentDate
    })));
  } catch (e: any) {
    res.status(500).json({ message: e.message || 'Failed to get enrollments' });
  }
});

// Get enrollment by ID
router.get('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const enrollmentId = req.params.id;
    const userId = (req as any).user?.userId;

    const enrollment = await Enrollment.findOne({
      _id: enrollmentId,
      student: userId
    }).populate('course', 'title description bannerImage price category');

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    res.json({
      id: enrollment._id,
      course: {
        id: enrollment.course._id,
        title: enrollment.course.title,
        description: enrollment.course.description,
        bannerImage: enrollment.course.bannerImage,
        price: enrollment.course.price,
        category: enrollment.course.category
      },
      status: enrollment.status,
      paymentStatus: enrollment.paymentStatus,
      progress: enrollment.progress,
      enrollmentDate: enrollment.enrollmentDate
    });
  } catch (e: any) {
    res.status(500).json({ message: e.message || 'Failed to get enrollment' });
  }
});

// Update enrollment progress
router.put('/:id/progress', requireAuth, async (req: Request, res: Response) => {
  try {
    const enrollmentId = req.params.id;
    const { progress } = req.body;
    const userId = (req as any).user?.userId;

    const enrollment = await Enrollment.findOneAndUpdate(
      {
        _id: enrollmentId,
        student: userId
      },
      { progress: Math.min(100, Math.max(0, progress)) },
      { new: true }
    );

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    res.json({
      success: true,
      progress: enrollment.progress
    });
  } catch (e: any) {
    res.status(500).json({ message: e.message || 'Failed to update progress' });
  }
});

// Admin: Get all enrollments for a course
router.get('/course/:courseId', requireAuth, async (req: Request, res: Response) => {
  try {
    const courseId = req.params.courseId;

    const enrollments = await Enrollment.find({ course: courseId })
      .populate('student', 'name email')
      .sort({ enrollmentDate: -1 });

    res.json(enrollments.map(e => ({
      id: e._id,
      student: {
        id: e.student._id,
        name: e.student.name,
        email: e.student.email
      },
      status: e.status,
      paymentStatus: e.paymentStatus,
      progress: e.progress,
      enrollmentDate: e.enrollmentDate
    })));
  } catch (e: any) {
    res.status(500).json({ message: e.message || 'Failed to get course enrollments' });
  }
});

export default router;
