import { Router, Request, Response } from 'express';
import multer from 'multer';
import cloudinary from '../config/cloudinary.ts';
import { requireAuth, requireRole } from '../middleware/auth.ts';
import { uploadFileWithProgress } from '@/lib/cloudinary-upload';

const router = Router();

// Configure multer to store files in memory (for Cloudinary upload)
const storage = multer.memoryStorage();

// File filter for allowed types
const fileFilter = (_req: any, file: Express.Multer.File, cb: any) => {
  const allowedMimeTypes = {
    video: ['video/mp4'],
    pdf: ['application/pdf'],
    image: ['image/jpeg', 'image/jpg', 'image/png'],
  };

  const allowedTypes = [
    ...allowedMimeTypes.video,
    ...allowedMimeTypes.pdf,
    ...allowedMimeTypes.image,
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Invalid file type: ${file.mimetype}. Allowed types: MP4 videos, PDF, JPG, PNG images.`
      )
    );
  }
};

// File size limits based on type
const getFileSizeLimit = (mimetype: string): number => {
  if (mimetype.startsWith('image/')) return 10 * 1024 * 1024; // 10MB for images
  if (mimetype === 'application/pdf' || mimetype.startsWith('video/')) return 50 * 1024 * 1024; // 50MB for PDFs and videos
  return 10 * 1024 * 1024; // Default 10MB
};

// Multer configuration with dynamic file size limits
const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // Maximum 50MB (for videos/PDFs)
  },
  fileFilter,
});

// Utility function to determine Cloudinary resource type
const getResourceType = (mimetype: string): 'video' | 'image' | 'raw' => {
  if (mimetype.startsWith('video/')) return 'video';
  if (mimetype.startsWith('image/')) return 'image';
  return 'raw'; // for PDF and other files
};

// Utility function to get folder name based on file type
const getCloudinaryFolder = (mimetype: string): string => {
  if (mimetype.startsWith('video/')) return 'lms/videos';
  if (mimetype.startsWith('image/')) return 'lms/images';
  if (mimetype === 'application/pdf') return 'lms/pdfs';
  return 'lms/files';
};

/**
 * Upload single file to Cloudinary
 * POST /api/upload/file
 * Accepts: video/mp4, application/pdf, image/jpeg, image/png
 */
router.post(
  '/file',
  requireAuth,
  requireRole('admin'),
  upload.single('file'),
  async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ message: 'No file uploaded' });
        return;
      }

      // Validate file size based on type
      const maxSize = getFileSizeLimit(req.file.mimetype);
      if (req.file.size > maxSize) {
        const maxSizeMB = maxSize / (1024 * 1024);
        res.status(400).json({
          message: `File size exceeds limit. Maximum allowed size is ${maxSizeMB} MB for this file type.`
        });
        return;
      }

      const resourceType = getResourceType(req.file.mimetype);
      const folder = getCloudinaryFolder(req.file.mimetype);

      // Upload to Cloudinary
      try {
        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder,
              resource_type: resourceType,
              public_id: `${Date.now()}-${req.file!.originalname.replace(
                /\.[^/.]+$/,
                ''
              )}`,
              // Video optimization
              ...(resourceType === 'video' && {
                video_sampling: 5,
                quality: 'auto',
              }),
              // Image optimization
              ...(resourceType === 'image' && {
                quality: 'auto',
                fetch_format: 'auto',
              }),
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );

          uploadStream.end(req.file!.buffer);
        });

        const uploadResult = result as any;

        res.status(200).json({
          success: true,
          message: 'File uploaded successfully',
          data: {
            url: uploadResult.secure_url,
            publicId: uploadResult.public_id,
            filename: req.file.originalname,
            size: req.file.size,
            mimetype: req.file.mimetype,
            resourceType: uploadResult.resource_type,
            width: uploadResult.width,
            height: uploadResult.height,
            duration: uploadResult.duration,
          },
        });
      } catch (error) {
        console.error('Upload failed:', error);
        res.status(500).json({ message: 'Upload failed' });
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'File upload failed',
      });
    }
  }
);

/**
 * Upload multiple files to Cloudinary
 * POST /api/upload/files
 * Accepts: up to 10 files (video/mp4, application/pdf, image/jpeg, image/png)
 */
router.post(
  '/files',
  requireAuth,
  requireRole('admin'),
  upload.array('files', 10),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const files = req.files as Express.Multer.File[]; // narrow type
      if (!files || files.length === 0) {
        res.status(400).json({ message: 'No files uploaded' });
        return;
      }

      // Validate file sizes
      for (const file of files) {
        const maxSize = getFileSizeLimit(file.mimetype);
        if (file.size > maxSize) {
          const maxSizeMB = maxSize / (1024 * 1024);
          res.status(400).json({
            message: `File "${file.originalname}" exceeds size limit. Maximum allowed size is ${maxSizeMB} MB for this file type.`
          });
          return;
        }
      }

      const uploadPromises = files.map((file) => {
        return new Promise((resolve, reject) => {
          const resourceType = getResourceType(file.mimetype);
          const folder = getCloudinaryFolder(file.mimetype);

          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder,
              resource_type: resourceType,
              public_id: `${Date.now()}-${file.originalname.replace(
                /\.[^/.]+$/,
                ''
              )}`,
              ...(resourceType === 'video' && {
                video_sampling: 5,
                quality: 'auto',
              }),
              ...(resourceType === 'image' && {
                quality: 'auto',
                fetch_format: 'auto',
              }),
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );

          uploadStream.end(file.buffer);
        });
      });

      const results = await Promise.all(uploadPromises);

      const uploadedFiles = (results as any[]).map((result, index) => ({
        url: result.secure_url,
        publicId: result.public_id,
        filename: files[index].originalname,
        size: files[index].size,
        mimetype: files[index].mimetype,
        resourceType: result.resource_type,
        width: result.width,
        height: result.height,
        duration: result.duration,
      }));

      res.status(200).json({
        success: true,
        message: `${uploadedFiles.length} file(s) uploaded successfully`,
        data: uploadedFiles,
      });
    } catch (error: any) {
      console.error('Batch upload error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Files upload failed',
      });
    }
  }
);

/**
 * Delete file from Cloudinary
 * DELETE /api/upload/:publicId
 */
router.delete(
  '/:publicId',
  requireAuth,
  requireRole('admin'),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { publicId } = req.params;

      if (!publicId) {
        res.status(400).json({ message: 'Public ID is required' });
        return;
      }

      await cloudinary.uploader.destroy(publicId, { invalidate: true });

      res.status(200).json({
        success: true,
        message: 'File deleted successfully',
      });
    } catch (error: any) {
      console.error('Delete error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'File deletion failed',
      });
    }
  }
);

/**
 * Create course with video upload
 * POST /api/courses
 */
router.post(
  '/courses',
  requireAuth,
  requireRole('admin'),
  upload.single('videoFile'),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { title, description } = req.body;
      const videoFile = req.file; // From upload middleware

      // Upload to Cloudinary
      const uploadResponse = await uploadFileWithProgress(videoFile);

      // Save to database
      const course = await db.course.create({
        title,
        description,
        videoUrl: uploadResponse.data.url,
        videoPublicId: uploadResponse.data.publicId,
        videoDuration: uploadResponse.data.duration,
      });

      res.json(course);
    } catch (error: any) {
      console.error('Create course error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Course creation failed',
      });
    }
  }
);

// ✅ DO: Check environment variables
if (!process.env.CLOUDINARY_CLOUD_NAME) {
  throw new Error('Cloudinary credentials missing');
}

export default router;
