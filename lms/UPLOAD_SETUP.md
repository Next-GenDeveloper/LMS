# Cloudinary File Upload Setup Instructions

## Overview
This setup enables file uploads (videos, PDFs, images) to Cloudinary with a complete backend and frontend solution. Maximum file size: 100MB.

## Backend Installation & Setup

### 1. Install Required Packages

Navigate to the backend directory and install dependencies:

```bash
cd lms/backend

npm install cloudinary multer
npm install -D @types/multer
```

**Package versions:**
- `cloudinary`: ^1.x.x (latest)
- `multer`: ^1.4.5+

### 2. Environment Variables

Create or update your `.env` file in the `lms/backend` directory:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here

# Other existing variables...
PORT=5000
NODE_ENV=development
```

**How to get Cloudinary credentials:**
1. Visit https://cloudinary.com/
2. Sign up for a free account
3. Go to Dashboard → Settings → API Keys
4. Copy your:
   - Cloud Name
   - API Key
   - API Secret (keep this secret!)

### 3. Register the Route in Backend

In your `lms/backend/src/app.ts` (or main server file), add:

```typescript
import cloudinaryUploadRouter from './routes/cloudinary-upload.ts';

// ... other imports and middleware ...

// Register upload route
app.use('/api/upload', cloudinaryUploadRouter);
```

### 4. Files Created

The following backend files have been created:

- **`lms/backend/src/config/cloudinary.ts`** - Cloudinary configuration
- **`lms/backend/src/routes/cloudinary-upload.ts`** - Upload endpoints

## Frontend Installation & Setup

### 1. Install Required Packages

Navigate to the frontend directory:

```bash
cd lms

npm install axios
```

**Note:** The FileUploadForm component uses `XMLHttpRequest` for native upload progress tracking, so axios is optional (included as reference).

### 2. Use the Component

Import and use the `FileUploadForm` component in your page/component:

```tsx
// In your page file (e.g., src/app/admin/upload/page.tsx)
'use client';

import FileUploadForm from '@/components/FileUploadForm';

export default function UploadPage() {
  return (
    <div className="container mx-auto py-12">
      <FileUploadForm />
    </div>
  );
}
```

### 3. Files Created

- **`lms/src/components/FileUploadForm.tsx`** - Complete upload form component with progress tracking

## API Endpoints

### Upload Single File
```
POST /api/upload/file
Authorization: Bearer {authToken}
Content-Type: multipart/form-data

Body:
- file: <file>

Response:
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "url": "https://res.cloudinary.com/...",
    "publicId": "lms/videos/...",
    "filename": "video.mp4",
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
```
POST /api/upload/files
Authorization: Bearer {authToken}
Content-Type: multipart/form-data

Body:
- files: <file1, file2, ..., file10>

Response:
{
  "success": true,
  "message": "3 file(s) uploaded successfully",
  "data": [
    { ... },
    { ... },
    { ... }
  ]
}
```

### Delete File
```
DELETE /api/upload/{publicId}
Authorization: Bearer {authToken}

Response:
{
  "success": true,
  "message": "File deleted successfully"
}
```

## File Type & Size Validation

### Allowed File Types
- **Videos:** MP4 (video/mp4)
- **PDFs:** PDF (application/pdf)
- **Images:** JPG/JPEG, PNG (image/jpeg, image/png)

### Size Limits
- **Per file:** 100MB (100 * 1024 * 1024 bytes)
- **Batch upload:** Up to 10 files

### Cloudinary Storage Structure
Files are organized in Cloudinary by type:
- Videos: `/lms/videos/`
- Images: `/lms/images/`
- PDFs: `/lms/pdfs/`
- Other: `/lms/files/`

## Security Features

1. **Authentication:** All endpoints require `authToken` in Authorization header
2. **Authorization:** Restricted to users with `admin` role
3. **File Validation:** Both client-side and server-side validation
4. **File Type Filtering:** Only allowed MIME types accepted
5. **Size Checking:** 100MB limit enforced
6. **Public IDs:** Files stored with unique identifiers

## Usage Examples

### Frontend - Using FileUploadForm Component

```tsx
// In your admin page
import FileUploadForm from '@/components/FileUploadForm';

export default function CourseAdmin() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <FileUploadForm />
      </div>
      {/* Rest of admin panel */}
    </div>
  );
}
```

### Backend - Using Upload Endpoints

```typescript
// Example: Upload video for a course
const uploadVideo = async (courseId: string, videoFile: File) => {
  const formData = new FormData();
  formData.append('file', videoFile);

  const response = await fetch('/api/upload/file', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${authToken}`,
    },
    body: formData,
  });

  const result = await response.json();
  
  if (result.success) {
    // Save the result.data.url and result.data.publicId to database
    return result.data.url;
  }
};
```

## Troubleshooting

### Error: "Invalid file type"
- Ensure your file extension matches the MIME type
- Check that the file is actually the format claimed

### Error: "File size exceeds 100MB limit"
- Compress the file before uploading
- For videos, use video compression tools
- For images, use image optimization tools

### Error: "Cloudinary credentials not found"
- Verify `.env` file has correct variables
- Check spelling: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- Restart the development server after updating `.env`

### 401 Unauthorized
- Ensure `authToken` is stored in localStorage
- Check that the user has `admin` role
- Verify token hasn't expired

### Network error during upload
- Check browser console for detailed error
- Verify backend server is running
- Check CORS settings if running on different domains

## Performance Optimization

### Video Uploads
- Videos are automatically optimized with quality='auto'
- Consider uploading videos <50MB for better performance
- Cloudinary automatically creates optimized versions

### Image Uploads
- Images are auto-formatted to best format for browser
- Quality is set to 'auto' for best balance
- Responsive images can be generated using Cloudinary transformations

### Large Files
- The component shows progress feedback
- Use XMLHttpRequest for better control over large uploads
- Consider chunking very large files

## Next Steps

1. Set up your Cloudinary account and get credentials
2. Add credentials to `.env` file
3. Register the routes in your main app file
4. Import and use `FileUploadForm` component in admin pages
5. Test with sample files (video, PDF, image)
6. Customize styling to match your theme

## Additional Resources

- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Cloudinary Video Upload Guide](https://cloudinary.com/documentation/video_upload_api)
- [Multer Documentation](https://github.com/expressjs/multer)
- [Next.js File Upload Guide](https://nextjs.org/docs/app/api-routes)

---

**Last Updated:** December 13, 2025
