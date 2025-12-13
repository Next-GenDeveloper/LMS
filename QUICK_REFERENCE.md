# Cloudinary Upload System - Quick Reference Card

## 🚀 Quick Start (Copy & Paste)

### 1. Install Packages
```bash
cd lms/backend
npm install cloudinary multer
npm install -D @types/multer
```

### 2. Update .env
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

### 3. Register Route (lms/backend/src/app.ts)
```typescript
import cloudinaryUploadRouter from './routes/cloudinary-upload.ts';
app.use('/api/upload', cloudinaryUploadRouter);
```

### 4. Use Component
```tsx
import FileUploadForm from '@/components/FileUploadForm';

export default function Upload() {
  return <FileUploadForm />;
}
```

✅ **Done!** Visit `/admin/upload` to test.

---

## 📁 File Structure

```
lms/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── cloudinary.ts         ✅ Created
│   │   └── routes/
│   │       └── cloudinary-upload.ts  ✅ Created
│   ├── .env                          ⚠️ Add credentials
│   └── .env.example                  ✅ Created
├── src/
│   ├── components/
│   │   └── FileUploadForm.tsx        ✅ Created
│   ├── lib/
│   │   └── cloudinary-upload.ts      ✅ Created
│   ├── types/
│   │   └── cloudinary.ts             ✅ Created
│   └── app/admin/upload/
│       └── page.tsx                  ✅ Created
└── Docs/
    ├── CLOUDINARY_SETUP_GUIDE.md     ✅ Comprehensive
    ├── UPLOAD_SETUP.md               ✅ Technical
    ├── IMPLEMENTATION_SUMMARY.md     ✅ Overview
    ├── PACKAGES_REQUIRED.json        ✅ Dependencies
    └── QUICK_REFERENCE.md            👈 This file
```

---

## 🔌 API Endpoints

### Upload Single File
```bash
POST /api/upload/file
Authorization: Bearer {authToken}
Content-Type: multipart/form-data

# Form Data:
file: <file>

# Response:
{
  "success": true,
  "data": {
    "url": "https://res.cloudinary.com/...",
    "publicId": "lms/videos/abc123",
    "filename": "video.mp4",
    "size": 52428800,
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
files: <file1, file2, ..., file10>
```

### Delete File
```bash
DELETE /api/upload/{publicId}
Authorization: Bearer {authToken}
```

---

## 💻 Code Examples

### Using Component (Easiest)
```tsx
'use client';
import FileUploadForm from '@/components/FileUploadForm';

export default function Page() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <FileUploadForm />
    </div>
  );
}
```

### Using Utilities (Advanced)
```tsx
'use client';
import { uploadFileWithProgress, validateFile } from '@/lib/cloudinary-upload';

export default function CustomUpload() {
  const handleUpload = async (file: File) => {
    // Validate
    const { valid, error } = validateFile(file);
    if (!valid) { alert(error); return; }

    // Upload
    try {
      await uploadFileWithProgress(file, {
        onProgress: (percent) => console.log(`${percent}%`),
        onSuccess: (response) => console.log(response.data.url),
        onError: (error) => alert(error),
      });
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  return (
    <input
      type="file"
      onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
    />
  );
}
```

### Saving to Database
```typescript
// After upload, save to database
const course = {
  title: 'Course Name',
  videoUrl: uploadResponse.data.url,
  videoPublicId: uploadResponse.data.publicId,
  videoDuration: uploadResponse.data.duration,
};
```

---

## 📊 Supported Files

| Type | Format | Max Size |
|------|--------|----------|
| Video | MP4 | 100MB |
| Document | PDF | 100MB |
| Image | JPG/PNG | 100MB |

---

## 🔐 Security

✅ Authentication required (auth token)  
✅ Admin role required  
✅ File type validation  
✅ Size validation (100MB)  
✅ Secure HTTPS URLs  
✅ Can delete files anytime  

---

## ⚙️ Utility Functions

```typescript
// Validate file before upload
const { valid, error } = validateFile(file);

// Upload with progress tracking
await uploadFileWithProgress(file, {
  onProgress: (percent) => setProgress(percent),
  onSuccess: (response) => console.log(response.data.url),
});

// Delete file
await deleteCloudinaryFile(publicId);

// Helper functions
isValidFileType(file);           // true/false
isValidFileSize(file, 100);      // true/false
getFileTypeLabel(mimetype);      // "🎬 Video"
formatFileSize(bytes);           // "52.43 MB"
```

---

## 🐛 Common Issues & Fixes

### "Cloudinary credentials not found"
```bash
# Check .env file has:
CLOUDINARY_CLOUD_NAME=your_value
CLOUDINARY_API_KEY=your_value
CLOUDINARY_API_SECRET=your_value

# Then restart server
```

### "401 Unauthorized"
```typescript
// User must be logged in with admin role
const token = localStorage.getItem('authToken');
if (!token) window.location.href = '/login';
```

### "Invalid file type"
```typescript
// Only allowed: MP4, PDF, JPG, PNG
const allowedTypes = ['video/mp4', 'application/pdf', 'image/jpeg', 'image/png'];
```

### "File size exceeds 100MB"
```bash
# Compress file before uploading
# Videos: Use FFmpeg or online tools
# Images: Use image compressor
```

---

## 📝 Environment Variables

```env
# Required
CLOUDINARY_CLOUD_NAME=abc123xyz
CLOUDINARY_API_KEY=1234567890
CLOUDINARY_API_SECRET=secret_key_here

# Optional (already have defaults)
NODE_ENV=development
PORT=5000
```

**Get credentials from:** https://cloudinary.com/console/settings/api-keys

---

## 🎯 Testing Checklist

- [ ] File upload (single)
- [ ] Progress tracking shows
- [ ] Success message displays
- [ ] URL is copyable
- [ ] Multiple file upload
- [ ] File deletion works
- [ ] Wrong file type rejected
- [ ] Large file (>100MB) rejected
- [ ] No auth token = 401 error
- [ ] Non-admin user = 401 error

---

## 📚 Full Documentation

For detailed information, see:

1. **CLOUDINARY_SETUP_GUIDE.md** - Complete guide with examples
2. **UPLOAD_SETUP.md** - Technical setup instructions
3. **IMPLEMENTATION_SUMMARY.md** - What was created

---

## 🔗 Useful Links

- Cloudinary Dashboard: https://cloudinary.com/console
- API Keys: https://cloudinary.com/console/settings/api-keys
- Documentation: https://cloudinary.com/documentation
- Examples: `lms/src/app/admin/upload/page.tsx`

---

## 📞 Quick Help

**Question:** How do I get my Cloudinary credentials?  
**Answer:** Go to https://cloudinary.com/console/settings/api-keys after signing up

**Question:** Can students upload files?  
**Answer:** Currently admin only. Modify `requireRole('admin')` to change

**Question:** What if upload fails?  
**Answer:** Check browser console and server logs. Ensure file is valid type/size

**Question:** Can I delete uploaded files?  
**Answer:** Yes, use `deleteCloudinaryFile(publicId)` or API endpoint

**Question:** How big can files be?  
**Answer:** 100MB max (configurable in backend)

---

**Status:** ✅ Ready to Use  
**Last Updated:** December 13, 2025

For full details, see CLOUDINARY_SETUP_GUIDE.md
