/**
 * Cloudinary Upload Utilities
 * Helper functions for handling file uploads with progress tracking
 */

export interface UploadResponse {
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

export interface UploadProgressCallback {
  (progress: number): void;
}

export interface UploadOptions {
  onProgress?: UploadProgressCallback;
  onSuccess?: (response: UploadResponse) => void;
  onError?: (error: string) => void;
}

/**
 * Validate file type
 */
export const isValidFileType = (file: File): boolean => {
  const allowedTypes = [
    'video/mp4',
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
  ];
  return allowedTypes.includes(file.type);
};

/**
 * Validate file size (max 100MB)
 */
export const isValidFileSize = (file: File, maxSizeMB: number = 100): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

/**
 * Get file type label
 */
export const getFileTypeLabel = (mimetype: string): string => {
  if (mimetype.startsWith('video/')) return '🎬 Video';
  if (mimetype.startsWith('image/')) return '🖼️ Image';
  if (mimetype === 'application/pdf') return '📄 PDF';
  return '📎 File';
};

/**
 * Format file size for display
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Upload file with progress tracking (using XMLHttpRequest)
 * This provides more control over upload progress
 */
export const uploadFileWithProgress = (
  file: File,
  options: UploadOptions = {}
): Promise<UploadResponse> => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', file);

    const xhr = new XMLHttpRequest();

    // Track progress
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && options.onProgress) {
        const percentComplete = (e.loaded / e.total) * 100;
        options.onProgress(Math.round(percentComplete));
      }
    });

    // Handle completion
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        try {
          const response: UploadResponse = JSON.parse(xhr.responseText);
          if (response.success) {
            options.onSuccess?.(response);
            resolve(response);
          } else {
            const error = response.message || 'Upload failed';
            options.onError?.(error);
            reject(new Error(error));
          }
        } catch (err) {
          options.onError?.('Failed to parse response');
          reject(new Error('Failed to parse response'));
        }
      } else {
        try {
          const response: UploadResponse = JSON.parse(xhr.responseText);
          const error = response.message || 'Upload failed';
          options.onError?.(error);
          reject(new Error(error));
        } catch (err) {
          options.onError?.('Upload failed');
          reject(new Error('Upload failed'));
        }
      }
    });

    // Handle errors
    xhr.addEventListener('error', () => {
      const error = 'Network error occurred during upload';
      options.onError?.(error);
      reject(new Error(error));
    });

    xhr.addEventListener('abort', () => {
      const error = 'Upload was cancelled';
      options.onError?.(error);
      reject(new Error(error));
    });

    // Send request
    xhr.open('POST', '/api/upload/file');
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      xhr.setRequestHeader('Authorization', `Bearer ${authToken}`);
    }
    xhr.send(formData);
  });
};

/**
 * Upload file with Fetch API (alternative method)
 * Note: Progress tracking is limited with fetch
 */
export const uploadFileWithFetch = async (
  file: File,
  options: UploadOptions = {}
): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const authToken = localStorage.getItem('authToken');
    const headers: Record<string, string> = {};
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const response = await fetch('/api/upload/file', {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed with status ${response.status}`);
    }

    const data: UploadResponse = await response.json();
    if (data.success) {
      options.onSuccess?.(data);
    } else {
      options.onError?.(data.message || 'Upload failed');
    }

    return data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Upload failed';
    options.onError?.(errorMessage);
    throw error;
  }
};

/**
 * Delete file from Cloudinary
 */
export const deleteCloudinaryFile = async (publicId: string): Promise<boolean> => {
  try {
    const authToken = localStorage.getItem('authToken');
    const response = await fetch(`/api/upload/${publicId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(authToken && { Authorization: `Bearer ${authToken}` }),
      },
    });

    if (!response.ok) {
      throw new Error(`Delete failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};

/**
 * Validate file before upload
 */
export const validateFile = (
  file: File,
  options: { maxSizeMB?: number } = {}
): { valid: boolean; error?: string } => {
  if (!isValidFileType(file)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed: MP4 videos, PDF, JPG/PNG images. Got: ${file.type}`,
    };
  }

  if (!isValidFileSize(file, options.maxSizeMB || 100)) {
    return {
      valid: false,
      error: `File size exceeds ${options.maxSizeMB || 100}MB limit. Size: ${formatFileSize(file.size)}`,
    };
  }

  return { valid: true };
};
