# Cloudinary File Upload System - Complete Integration Guide

## 📋 Overview

This comprehensive file upload system enables secure, scalable video, PDF, and image uploads to Cloudinary. It includes:

✅ **Backend (Node.js/Express)**
- Multer middleware for handling multipart/form-data
- Cloudinary SDK integration with automatic optimization
- File type validation (video/mp4, PDF, images)
- Size validation (max 100MB)
- Secure endpoints with authentication & authorization

✅ **Frontend (React/Next.js)**
- Beautiful upload form component with Tailwind CSS
- Real-time upload progress tracking
- File preview before upload
- Error handling & validation feedback
- Uploaded file details display

✅ **Utilities**
- Helper functions for validation
- Upload progress callbacks
- File type & size utilities
- Both XMLHttpRequest & Fetch implementations

## 🚀 Quick Start (5 Minutes)

### Step 1: Get Cloudinary Credentials (2 min)

1. Visit [cloudinary.com](https://cloudinary.com)
2. Sign up for free account
3. Go to Dashboard → Settings → API Keys
4. Copy these three values:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

### Step 2: Backend Setup (2 min)

**A. Install packages:**
```bash
cd lms/backend
npm install cloudinary multer
npm install -D @types/multer
```

**B. Update `.env` file:**
```env
CLOUDINARY_CLOUD_NAME=your_value_here
CLOUDINARY_API_KEY=your_value_here
CLOUDINARY_API_SECRET=your_value_here
```

**C. Register route in `src/app.ts`:**
```typescript
import cloudinaryUploadRouter from './routes/cloudinary-upload.ts';

// Add after other middleware setup
app.use('/api/upload', cloudinaryUploadRouter);
```

### Step 3: Frontend Setup (1 min)

**Use the FileUploadForm component:**
```tsx
// In your admin page (e.g., src/app/admin/upload/page.tsx)
'use client';
import FileUploadForm from '@/components/FileUploadForm';

export default function UploadPage() {
  return <FileUploadForm />;
}
```

**Or use the example page:**
```bash
# Already created at: lms/src/app/admin/upload/page.tsx
# Just navigate to /admin/upload in your browser
```

✅ **Done!** Your upload system is ready.

## 📁 Files Created

### Backend
```
lms/backend/src/
├── config/
│   └── cloudinary.ts          # Cloudinary config with placeholders
├── routes/
│   └── cloudinary-upload.ts   # Upload endpoints (single, multiple, delete)
└── .env.example              # Environment variables template
```

### Frontend
```
lms/src/
├── components/
│   └── FileUploadForm.tsx     # Complete upload form component
├── lib/
│   └── cloudinary-upload.ts   # Utility functions & helpers
└── app/admin/
    └── upload/
        └── page.tsx           # Example admin upload page
```

## 🔧 API Reference

### Upload Single File
```bash
POST /api/upload/file
Authorization: Bearer {authToken}
Content-Type: multipart/form-data

# Form Data:
file: <file_object>

# Response (200 OK):
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "url": "https://res.cloudinary.com/cloud/video/upload/v1234567890/lms/videos/abc123.mp4",
    "publicId": "lms/videos/abc123",
    "filename": "course-intro.mp4",
    "size": 52428800,
    "mimetype": "video/mp4",
    "resourceType": "video",
    "width": 1920,
    "height": 1080,
    "duration": 120.5
  }
}
```

### Upload Multiple Files
```bash
POST /api/upload/files
Authorization: Bearer {authToken}
Content-Type: multipart/form-data

# Form Data:
files: <file1>, <file2>, ... (max 10)

# Response (200 OK):
{
  "success": true,
  "message": "3 file(s) uploaded successfully",
  "data": [
    { ... file1 data ... },
    { ... file2 data ... },
    { ... file3 data ... }
  ]
}
```

### Delete File
```bash
DELETE /api/upload/{publicId}
Authorization: Bearer {authToken}

# Response (200 OK):
{
  "success": true,
  "message": "File deleted successfully"
}
```

## 📊 Supported File Types

| Type | Format | MIME Type | Max Size |
|------|--------|-----------|----------|
| **Video** | MP4 | video/mp4 | 100MB |
| **Document** | PDF | application/pdf | 100MB |
| **Image** | JPG | image/jpeg | 100MB |
| **Image** | PNG | image/png | 100MB |

## 💻 Code Examples

### Using FileUploadForm Component (Easiest)
```tsx
'use client';
import FileUploadForm from '@/components/FileUploadForm';

export default function Dashboard() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1>Upload Course Materials</h1>
      <FileUploadForm />
    </div>
  );
}
```

### Using Upload Utilities (Advanced)
```tsx
'use client';
import { useState } from 'react';
import { uploadFileWithProgress, validateFile } from '@/lib/cloudinary-upload';

export default function CustomUpload() {
  const [progress, setProgress] = useState(0);
  const [uploadedUrl, setUploadedUrl] = useState('');

  const handleUpload = async (file: File) => {
    // Validate
    const validation = validateFile(file);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    // Upload with progress
    try {
      const response = await uploadFileWithProgress(file, {
        onProgress: (percent) => setProgress(percent),
        onSuccess: (response) => {
          setUploadedUrl(response.data!.url);
          console.log('Uploaded:', response.data);
        },
        onError: (error) => alert(error),
      });
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return (
    <div>
      <input
        type="file"
        onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
      />
      <progress value={progress} max="100" />
      {uploadedUrl && <a href={uploadedUrl}>Download</a>}
    </div>
  );
}
```

### Backend - Save Upload to Database
```typescript
// In your course controller
import { uploadFileWithProgress } from '@/lib/cloudinary-upload';

async function createCourse(req: Request, res: Response) {
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

  return res.json(course);
}
```

## 🔐 Security Features

1. **Authentication Required** - All endpoints require valid auth token
2. **Admin Only** - Restricted to users with `admin` role
3. **File Validation** - Both client & server-side validation
4. **Type Checking** - Only allowed MIME types accepted
5. **Size Enforcement** - 100MB limit with error handling
6. **Secure URLs** - Cloudinary serves from CDN with HTTPS
7. **Public ID Tracking** - Can delete files from Cloudinary later

## 🎯 Best Practices

### Frontend
```tsx
// ✅ DO: Use FileUploadForm for most cases
import FileUploadForm from '@/components/FileUploadForm';

// ✅ DO: Handle errors gracefully
try {
  const response = await uploadFileWithProgress(file);
} catch (error) {
  showErrorMessage(error.message);
}

// ✅ DO: Validate before uploading
const { valid, error } = validateFile(file);
if (!valid) {
  alert(error);
  return;
}

// ❌ DON'T: Hardcode API URLs
// Instead: Use /api/upload/file relative path
```

### Backend
```typescript
// ✅ DO: Check environment variables
if (!process.env.CLOUDINARY_CLOUD_NAME) {
  throw new Error('Cloudinary credentials missing');
}

// ✅ DO: Use proper error handling
try {
  const result = await cloudinary.uploader.upload_stream(...);
} catch (error) {
  logger.error('Upload failed:', error);
  res.status(500).json({ message: 'Upload failed' });
}

// ✓ DO: Organize files by type in Cloudinary
// Videos → lms/videos/
// Images → lms/images/
// PDFs   → lms/pdfs/
```

## 🐛 Troubleshooting

### Problem: "Cloudinary credentials not found"
**Solution:**
1. Check `.env` file exists with correct variable names
2. Verify spelling: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`
3. Restart development server after updating `.env`

### Problem: "Invalid file type" error
**Solution:**
1. Check file extension matches MIME type
2. Ensure file is actually the format claimed
3. Use FileUploadForm component - it has better validation

### Problem: Upload progress not showing
**Solution:**
1. FileUploadForm shows progress automatically
2. For custom uploads, ensure `onProgress` callback is provided
3. Check browser console for JavaScript errors

### Problem: 401 Unauthorized error
**Solution:**
1. Ensure user is logged in and token is in localStorage
2. Check that user has `admin` role
3. Verify auth token hasn't expired

### Problem: "File size exceeds 100MB"
**Solution:**
1. Compress files before uploading:
   - Videos: Use FFmpeg or online tools
   - Images: Use image optimization tools
   - PDFs: Use PDF compression tools
2. Consider splitting large videos into chapters

## 📈 Performance Tips

### Video Uploads
- Cloudinary auto-optimizes with quality='auto'
- Optimal size: 20-50MB for quick upload
- Supports multiple quality versions automatically

### Image Uploads
- Auto-formatted to best browser format (WebP, etc.)
- Quality balanced automatically
- Responsive image generation available

### Large Files (50-100MB)
- XMLHttpRequest handles them well
- Shows progress for better UX
- Consider chunking for files >100MB

## 🔄 Workflow Example

```
User selects file
    ↓
Client validates (type, size)
    ↓
Upload starts + progress shown
    ↓
Server receives file
    ↓
Server uploads to Cloudinary
    ↓
Cloudinary returns secure URL
    ↓
Server returns URL to client
    ↓
Client displays uploaded file info
    ↓
URL saved to database (by app)
```

## 📚 Additional Resources

- **Cloudinary Docs:** https://cloudinary.com/documentation
- **Multer Guide:** https://github.com/expressjs/multer
- **Next.js Upload:** https://nextjs.org/docs/app/api-routes
- **Video Optimization:** https://cloudinary.com/documentation/video_optimization

## ❓ FAQ

**Q: Can I use this with other cloud providers?**
A: Yes! The code is modular. Replace Cloudinary with AWS S3, Google Cloud Storage, etc.

**Q: What happens if upload fails?**
A: Error is caught, displayed to user, and file is not saved to database.

**Q: Can students delete uploaded files?**
A: Currently only admin role can delete. Modify middleware for other permissions.

**Q: How to generate video thumbnails?**
A: Cloudinary does this automatically! Access with: `url.replace('/upload/', '/upload/c_thumb,w_200,h_150,g_auto/')`

**Q: Can I add watermarks?**
A: Yes! Use Cloudinary transformations: https://cloudinary.com/documentation/image_transformations

## 📝 Summary

**Installed:** 
- ✅ cloudinary, multer packages
- ✅ Backend routes with validation
- ✅ Frontend form component
- ✅ Utility functions & helpers
- ✅ Example admin page

**Ready to use:**
- ✅ Single file upload
- ✅ Multiple file upload
- ✅ File deletion
- ✅ Progress tracking
- ✅ Error handling

**Next steps:**
1. Add Cloudinary credentials to `.env`
2. Register routes in `app.ts`
3. Import FileUploadForm in your pages
4. Start uploading!

---

**Questions?** Check the code comments or review the example page at `/admin/upload`

**Last Updated:** December 13, 2025
