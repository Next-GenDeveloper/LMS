/**
 * Cloudinary Upload Types
 * Type definitions for file upload functionality
 */

/**
 * Supported MIME types for upload
 */
export type AllowedMimeType = 'video/mp4' | 'application/pdf' | 'image/jpeg' | 'image/jpg' | 'image/png';

/**
 * Resource type in Cloudinary
 */
export type CloudinaryResourceType = 'video' | 'image' | 'raw';

/**
 * Cloudinary folder paths
 */
export type CloudinaryFolder = 'lms/videos' | 'lms/images' | 'lms/pdfs' | 'lms/files';

/**
 * Uploaded file data returned from backend
 */
export interface UploadedFileData {
  url: string;
  publicId: string;
  filename: string;
  size: number;
  mimetype: AllowedMimeType;
  resourceType: CloudinaryResourceType;
  width?: number;
  height?: number;
  duration?: number;
}

/**
 * API response structure for single file upload
 */
export interface SingleUploadResponse {
  success: boolean;
  message: string;
  data?: UploadedFileData;
}

/**
 * API response structure for multiple file upload
 */
export interface MultipleUploadResponse {
  success: boolean;
  message: string;
  data?: UploadedFileData[];
}

/**
 * Delete file response
 */
export interface DeleteFileResponse {
  success: boolean;
  message: string;
}

/**
 * Upload progress callback type
 */
export type UploadProgressCallback = (progress: number) => void;

/**
 * Upload success callback type
 */
export type UploadSuccessCallback = (response: SingleUploadResponse) => void;

/**
 * Upload error callback type
 */
export type UploadErrorCallback = (error: string) => void;

/**
 * Options for upload functions
 */
export interface UploadOptions {
  onProgress?: UploadProgressCallback;
  onSuccess?: UploadSuccessCallback;
  onError?: UploadErrorCallback;
}

/**
 * File validation result
 */
export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * File validation options
 */
export interface FileValidationOptions {
  maxSizeMB?: number;
  allowedTypes?: AllowedMimeType[];
}

/**
 * Cloudinary upload configuration
 */
export interface CloudinaryUploadConfig {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
}

/**
 * Extended Express.Multer.File type
 */
export interface UploadedFile extends Express.Multer.File {
  originalname: string;
  encoding: string;
  mimetype: AllowedMimeType;
  buffer: Buffer;
  size: number;
}

/**
 * Course with media references
 */
export interface CourseWithMedia {
  id: string;
  title: string;
  description: string;
  videoUrl?: string;
  videoPublicId?: string;
  videoDuration?: number;
  thumbnailUrl?: string;
  pdfUrl?: string;
  pdfPublicId?: string;
  images?: string[];
}

/**
 * Upload progress state
 */
export interface UploadProgressState {
  isUploading: boolean;
  progress: number;
  uploadedFile: UploadedFileData | null;
  error: string | null;
  success: string | null;
}

/**
 * File upload statistics
 */
export interface UploadStatistics {
  totalUploads: number;
  totalSize: number; // in bytes
  averageUploadTime: number; // in milliseconds
  successRate: number; // percentage
  lastUploadTime: Date;
}
