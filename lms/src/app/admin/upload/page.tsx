'use client';

import FileUploadForm from '@/components/FileUploadForm';

/**
 * Example Upload Page for Admin
 * 
 * This page demonstrates how to use the FileUploadForm component
 * for uploading course materials (videos, PDFs, images) to Cloudinary.
 * 
 * Usage:
 * 1. Ensure you have Cloudinary credentials set up
 * 2. Import this page into your admin dashboard
 * 3. Users will see a form to upload files
 * 4. Uploaded files will be available on Cloudinary with secure URLs
 */

export default function AdminUploadPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-950 text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Course Materials Upload</h1>
          <p className="text-gray-200">
            Upload videos, PDF documents, and images for your courses. All files are securely stored on Cloudinary.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Form */}
          <div className="lg:col-span-2">
            <FileUploadForm />
          </div>

          {/* Info Sidebar */}
          <div className="space-y-6">
            {/* Supported Formats */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-200">
              <h3 className="text-lg font-bold text-blue-950 mb-4">📋 Supported Formats</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 font-bold">🎬</span>
                  <div>
                    <p className="font-semibold">Videos</p>
                    <p className="text-xs text-gray-600">MP4 format</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 font-bold">📄</span>
                  <div>
                    <p className="font-semibold">PDF Documents</p>
                    <p className="text-xs text-gray-600">Lecture notes, slides</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 font-bold">🖼️</span>
                  <div>
                    <p className="font-semibold">Images</p>
                    <p className="text-xs text-gray-600">JPG, JPEG, PNG</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-200">
              <h3 className="text-lg font-bold text-blue-950 mb-4">✅ Requirements</h3>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 text-lg">•</span>
                  <p><strong>Max Size:</strong> 100MB per file</p>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 text-lg">•</span>
                  <p><strong>Formats:</strong> MP4, PDF, JPG, PNG</p>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 text-lg">•</span>
                  <p><strong>Admin Only:</strong> Requires admin privileges</p>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 text-lg">•</span>
                  <p><strong>Authentication:</strong> Must be logged in</p>
                </li>
              </ul>
            </div>

            {/* Tips */}
            <div className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-200">
              <h3 className="text-lg font-bold text-blue-950 mb-4">💡 Tips</h3>
              <ul className="space-y-2 text-sm text-blue-900">
                <li>✨ Videos are automatically optimized by Cloudinary</li>
                <li>🎯 Use clear, descriptive filenames</li>
                <li>📊 Check file size before uploading</li>
                <li>🔒 All files are securely stored</li>
                <li>🌍 Files get global CDN access</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Usage Guide Section */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-200">
          <h2 className="text-2xl font-bold text-blue-950 mb-6">📚 How to Use</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="relative">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-yellow-400 text-blue-950 font-bold text-lg mb-4">
                1
              </div>
              <h3 className="text-lg font-bold text-blue-950 mb-2">Select File</h3>
              <p className="text-sm text-gray-600">
                Click "Select File" and choose a video, PDF, or image from your computer.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-yellow-400 text-blue-950 font-bold text-lg mb-4">
                2
              </div>
              <h3 className="text-lg font-bold text-blue-950 mb-2">Upload</h3>
              <p className="text-sm text-gray-600">
                Click "Upload File" to send it to Cloudinary. Watch the progress bar as it uploads.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-yellow-400 text-blue-950 font-bold text-lg mb-4">
                3
              </div>
              <h3 className="text-lg font-bold text-blue-950 mb-2">Copy URL</h3>
              <p className="text-sm text-gray-600">
                After upload, copy the secure URL to use in your course content or database.
              </p>
            </div>
          </div>
        </div>

        {/* Code Example */}
        <div className="mt-8 bg-gray-900 rounded-2xl shadow-lg p-8 overflow-x-auto">
          <h3 className="text-lg font-bold text-white mb-4">💻 API Usage Example</h3>
          <pre className="text-sm text-gray-300 font-mono">
{`// After uploading, use the returned URL in your database
const uploadedFileData = {
  url: "https://res.cloudinary.com/your-cloud/...",
  publicId: "lms/videos/12345-video",
  filename: "course-intro.mp4",
  size: 52428800,
  mimetype: "video/mp4",
  resourceType: "video",
  duration: 120.5
};

// Save to your course
const course = {
  title: "eBay Selling Mastery",
  videoUrl: uploadedFileData.url,
  videoPublicId: uploadedFileData.publicId,
  videoDuration: uploadedFileData.duration,
  // ... other course data
};`}
          </pre>
        </div>
      </div>
    </div>
  );
}
