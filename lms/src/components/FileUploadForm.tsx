'use client';

import { useState, useRef } from 'react';

interface UploadResponse {
  success: boolean;
  message: string;
  data?: {
    url: string;
    publicId: string;
    filename: string;
    size: number;
    mimetype: string;
    resourceType: string;
    width?: number;
    height?: number;
    duration?: number;
  };
}

export default function FileUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<UploadResponse['data'] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ALLOWED_FILE_TYPES = {
    video: 'video/mp4',
    pdf: 'application/pdf',
    image: ['image/jpeg', 'image/jpg', 'image/png'],
  };

  const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setError(null);
    setSuccess(null);

    if (!selectedFile) {
      setFile(null);
      return;
    }

    // Validate file type
    const isVideo = selectedFile.type === ALLOWED_FILE_TYPES.video;
    const isPdf = selectedFile.type === ALLOWED_FILE_TYPES.pdf;
    const isImage = ALLOWED_FILE_TYPES.image.includes(selectedFile.type);

    if (!isVideo && !isPdf && !isImage) {
      setError(
        `Invalid file type. Allowed: MP4 videos, PDF documents, JPG/PNG images. Got: ${selectedFile.type}`
      );
      setFile(null);
      return;
    }

    // Validate file size
    if (selectedFile.size > MAX_FILE_SIZE) {
      setError(`File size exceeds 100MB limit. Size: ${(selectedFile.size / 1024 / 1024).toFixed(2)}MB`);
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    setError(null);
    setSuccess(null);
    setUploadProgress(0);

    try {
      const xhr = new XMLHttpRequest();

      // Track upload progress
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100;
          setUploadProgress(Math.round(percentComplete));
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const response: UploadResponse = JSON.parse(xhr.responseText);
          if (response.success && response.data) {
            setUploadedFile(response.data);
            setSuccess(`✅ ${file.name} uploaded successfully!`);
            setFile(null);
            setUploadProgress(0);
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
          } else {
            setError(response.message || 'Upload failed');
          }
        } else {
          const response: UploadResponse = JSON.parse(xhr.responseText);
          setError(response.message || 'Upload failed');
        }
        setUploading(false);
      });

      xhr.addEventListener('error', () => {
        setError('Network error occurred during upload');
        setUploading(false);
      });

      xhr.open('POST', '/api/upload/file');
      xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('authToken')}`);
      xhr.send(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      setUploading(false);
    }
  };

  const getFileTypeLabel = () => {
    if (!file) return '';
    if (file.type.startsWith('video/')) return '🎬 Video';
    if (file.type.startsWith('image/')) return '🖼️ Image';
    if (file.type === 'application/pdf') return '📄 PDF';
    return '📎 File';
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-lg border-2 border-gray-200">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-blue-950 mb-2">File Upload</h2>
        <p className="text-gray-600">
          Upload course materials (videos, PDFs, images). Max 100MB per file.
        </p>
      </div>

      {/* File Input */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-blue-950 mb-3">
          Select File
        </label>
        <div className="relative">
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            accept=".mp4,video/mp4,.pdf,application/pdf,.jpg,.jpeg,.png,image/jpeg,image/png"
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-950 file:text-white
              hover:file:bg-blue-900
              file:cursor-pointer
              cursor-pointer"
            disabled={uploading}
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Supported: MP4 videos, PDF documents, JPG/PNG images
        </p>
      </div>

      {/* File Preview */}
      {file && (
        <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div className="flex items-start gap-4">
            <div className="text-3xl">{getFileTypeLabel()}</div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">{file.name}</p>
              <p className="text-sm text-gray-600">
                {(file.size / 1024 / 1024).toFixed(2)}MB
              </p>
              <p className="text-xs text-gray-500 mt-1">{file.type}</p>
            </div>
          </div>
        </div>
      )}

      {/* Upload Progress */}
      {uploading && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-gray-700">Uploading...</span>
            <span className="text-sm font-bold text-blue-950">{uploadProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-950 to-yellow-400 h-full rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">❌ {error}</p>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-700">{success}</p>
        </div>
      )}

      {/* Upload Button */}
      <div className="mb-6">
        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="w-full py-3 px-6 bg-gradient-to-r from-blue-950 to-yellow-400 text-white font-semibold rounded-lg
            hover:from-blue-900 hover:to-yellow-500
            disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed
            transition duration-200"
        >
          {uploading ? `Uploading (${uploadProgress}%)` : 'Upload File'}
        </button>
      </div>

      {/* Uploaded File Result */}
      {uploadedFile && (
        <div className="p-6 bg-green-50 border-2 border-green-200 rounded-xl">
          <h3 className="font-bold text-green-900 mb-4 flex items-center gap-2">
            ✅ File Uploaded Successfully
          </h3>
          <div className="space-y-3 text-sm">
            <div>
              <label className="font-semibold text-gray-700">File URL:</label>
              <div className="mt-1 p-3 bg-white rounded border border-gray-200 break-all">
                <a
                  href={uploadedFile.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  {uploadedFile.url}
                </a>
              </div>
            </div>
            <div>
              <label className="font-semibold text-gray-700">Public ID:</label>
              <div className="mt-1 p-3 bg-white rounded border border-gray-200 font-mono text-xs">
                {uploadedFile.publicId}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-gray-700">Filename:</label>
                <p className="text-gray-600">{uploadedFile.filename}</p>
              </div>
              <div>
                <label className="font-semibold text-gray-700">Size:</label>
                <p className="text-gray-600">
                  {(uploadedFile.size / 1024 / 1024).toFixed(2)}MB
                </p>
              </div>
              <div>
                <label className="font-semibold text-gray-700">Type:</label>
                <p className="text-gray-600">{uploadedFile.resourceType}</p>
              </div>
              <div>
                <label className="font-semibold text-gray-700">MIME Type:</label>
                <p className="text-gray-600">{uploadedFile.mimetype}</p>
              </div>
              {uploadedFile.width && (
                <div>
                  <label className="font-semibold text-gray-700">Dimensions:</label>
                  <p className="text-gray-600">
                    {uploadedFile.width} x {uploadedFile.height}
                  </p>
                </div>
              )}
              {uploadedFile.duration && (
                <div>
                  <label className="font-semibold text-gray-700">Duration:</label>
                  <p className="text-gray-600">{uploadedFile.duration.toFixed(2)}s</p>
                </div>
              )}
            </div>
            <button
              onClick={() => {
                setUploadedFile(null);
                setFile(null);
              }}
              className="w-full mt-4 py-2 bg-blue-950 text-white rounded-lg hover:bg-blue-900 transition"
            >
              Upload Another File
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
