import { Router } from 'express';
import path from 'path';
import fs from 'fs';
import { pdfSecurity, adminPdfAccess } from '../middleware/pdfSecurity';

const router = Router();

// Serve PDF files with security middleware
router.get('/secure/:filename', pdfSecurity, (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../../uploads', filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'PDF file not found'
      });
    }

    // Check if the file is actually a PDF
    if (!filename.toLowerCase().endsWith('.pdf')) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Only PDF files can be accessed through this endpoint'
      });
    }

    // Set appropriate headers for PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${filename}"`);

    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    fileStream.on('error', (error) => {
      console.error('Error streaming PDF file:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to stream PDF file'
      });
    });

  } catch (error: any) {
    console.error('Error serving secure PDF:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to serve PDF file'
    });
  }
});

// Admin endpoint to manage PDF access permissions
router.post('/:courseId/permissions', adminPdfAccess, async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const { userId, action } = req.body; // action: 'grant' or 'revoke'

    // In a real implementation, you would update a PDF access permissions collection
    // For this example, we'll just return success

    if (!['grant', 'revoke'].includes(action)) {
      return res.status(400).json({
        error: 'Bad Request',
        message: "Action must be either 'grant' or 'revoke'"
      });
    }

    // TODO: Implement actual permission management logic
    console.log(`Admin ${action}ed PDF access for user ${userId} on course ${courseId}`);

    res.json({
      success: true,
      message: `PDF access ${action}ed successfully for user ${userId}`
    });

  } catch (error: any) {
    console.error('Error managing PDF permissions:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to manage PDF permissions'
    });
  }
});

// Admin endpoint to get PDF access list for a course
router.get('/:courseId/access-list', adminPdfAccess, async (req, res) => {
  try {
    const courseId = req.params.courseId;

    // TODO: Implement actual access list retrieval from database
    // For this example, return mock data

    const mockAccessList = [
      {
        userId: 'user123',
        userName: 'John Doe',
        userEmail: 'john@example.com',
        accessGranted: true,
        lastAccessed: '2023-12-10T10:30:00Z'
      },
      {
        userId: 'user456',
        userName: 'Jane Smith',
        userEmail: 'jane@example.com',
        accessGranted: true,
        lastAccessed: '2023-12-09T14:15:00Z'
      }
    ];

    res.json({
      courseId,
      accessList: mockAccessList,
      totalUsers: mockAccessList.length
    });

  } catch (error: any) {
    console.error('Error getting PDF access list:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get PDF access list'
    });
  }
});

export default router;