"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from '@/components/AdminSidebar';

interface FileWithPreview {
  url: string;
  name: string;
  size: number;
  type: string;
}

export default function CreateCoursePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    level: "beginner",
    duration: "",
    language: "English",
    tags: "",
    bannerImage: "",
    pdfFiles: [] as string[],
    videoFiles: [] as string[],
  });
  
  const [pdfPreviews, setPdfPreviews] = useState<FileWithPreview[]>([]);
  const [videoPreviews, setVideoPreviews] = useState<FileWithPreview[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [isDragOver, setIsDragOver] = useState<{ [key: string]: boolean }>({});
  const [dragOver, setDragOver] = useState<{ [key: string]: boolean }>({});

  const uploadFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const token = localStorage.getItem("authToken");
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);

      const xhr = new XMLHttpRequest();

      // Track progress
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          setUploadProgress(prev => ({ ...prev, [file.name]: percentComplete }));
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          try {
            const data = JSON.parse(xhr.responseText);
            setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));
            resolve(data.url);
          } catch (e) {
            reject(new Error('Invalid response format'));
          }
        } else {
          try {
            const error = JSON.parse(xhr.responseText);
            reject(new Error(error.message || "Upload failed"));
          } catch (e) {
            reject(new Error("Upload failed: Server error"));
          }
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Network error during upload'));
      });

      xhr.open('POST', "http://localhost:5000/api/upload/file");
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr.send(formDataUpload);
    });
  };

  const handleFileUpload = async (files: FileList | null, type: 'banner' | 'pdf' | 'video') => {
    if (!files || files.length === 0) return;

    // Validate file sizes
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const sizeInMB = file.size / (1024 * 1024);
      
      if (type === 'pdf' && sizeInMB > 50) {
        alert(`PDF file "${file.name}" is ${sizeInMB.toFixed(2)} MB. Maximum allowed size is 50 MB.`);
        return;
      }

      if (type === 'video' && sizeInMB > 50) {
        alert(`Video file "${file.name}" is ${sizeInMB.toFixed(2)} MB. Maximum allowed size is 50 MB.`);
        return;
      }
    }

    setUploading(true);
    try {
      if (type === 'banner') {
        const url = await uploadFile(files[0]);
        setFormData(prev => ({ ...prev, bannerImage: url }));
      } else if (type === 'pdf') {
        const newPreviews: FileWithPreview[] = [];
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const url = await uploadFile(file);
          newPreviews.push({
            url,
            name: file.name,
            size: file.size,
            type: file.type
          });
        }
        const urls = newPreviews.map(p => p.url);
        setFormData(prev => ({ ...prev, pdfFiles: [...prev.pdfFiles, ...urls] }));
        setPdfPreviews(prev => [...prev, ...newPreviews]);
      } else if (type === 'video') {
        const newPreviews: FileWithPreview[] = [];
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const url = await uploadFile(file);
          newPreviews.push({
            url,
            name: file.name,
            size: file.size,
            type: file.type
          });
        }
        const urls = newPreviews.map(p => p.url);
        setFormData(prev => ({ ...prev, videoFiles: [...prev.videoFiles, ...urls] }));
        setVideoPreviews(prev => [...prev, ...newPreviews]);
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert("File upload failed: " + (error as Error).message);
    } finally {
      setUploading(false);
    }
  };

  const removePdf = (index: number) => {
    setPdfPreviews(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({ ...prev, pdfFiles: prev.pdfFiles.filter((_, i) => i !== index) }));
  };

  const removeVideo = (index: number) => {
    setVideoPreviews(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({ ...prev, videoFiles: prev.videoFiles.filter((_, i) => i !== index) }));
  };

  const handleDragOver = (e: React.DragEvent, type: string) => {
    e.preventDefault();
    setIsDragOver(prev => ({ ...prev, [type]: true }));
  };

  const handleDragLeave = (e: React.DragEvent, type: string) => {
    e.preventDefault();
    setIsDragOver(prev => ({ ...prev, [type]: false }));
  };

  const handleDrop = (e: React.DragEvent, type: 'banner' | 'pdf' | 'video') => {
    e.preventDefault();
    setIsDragOver(prev => ({ ...prev, [type]: false }));
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files as any, type);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("authToken");
      const courseData = {
        ...formData,
        price: Number(formData.price),
        duration: Number(formData.duration),
        tags: formData.tags.split(",").map(tag => tag.trim()).filter(tag => tag),
        modules: [], // Empty modules for now
      };

      const response = await fetch("http://localhost:5000/api/admin/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(courseData),
      });

      if (response.ok) {
        alert("Course created successfully! The course is now available.");
        router.push("/admin/courses");
      } else {
        if (response.headers.get('content-type')?.includes('application/json')) {
          const error = await response.json();
          alert(error.message || "Failed to create course");
        } else {
          alert("Failed to create course: Server error");
        }
      }
    } catch (error) {
      console.error("Failed to create course:", error);
      alert("Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex flex-col md:flex-row">
      <AdminSidebar />
      
      <div className="flex-1">
        {/* Premium Header */}
        <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white py-12 mt-14 md:mt-0 overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-xl">
                  <span className="text-3xl">📚</span>
                </div>
                <div>
                  <h1 className="text-4xl font-extrabold mb-1">Create New Course</h1>
                  <p className="text-white/90 text-lg">Build engaging courses with videos and PDFs</p>
                </div>
              </div>
              <button
                onClick={() => router.back()}
                className="px-4 py-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl font-semibold transition"
              >
                ← Back
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-gray-200">
            <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section: Basic Information */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-xl">📝</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Basic Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                  <span className="text-blue-500">📌</span> Course Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Complete Web Development Bootcamp"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                  <span className="text-blue-500">📄</span> Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Provide a detailed description of what students will learn..."
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition resize-none"
                  required
                />
              </div>
            </div>
          </div>


          {/* Section: Course Media */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <span className="text-xl">🎬</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Course Media</h2>
            </div>

            <div className="space-y-6">
              {/* Banner Image */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                  <span className="text-green-500">🖼️</span> Banner Image (Max 10 MB)
                </label>
                <div
                  className={`relative border-2 border-dashed rounded-xl p-6 transition-colors ${
                    isDragOver.banner
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-300 hover:border-green-400'
                  } ${uploading ? 'opacity-50' : ''}`}
                  onDragOver={(e) => handleDragOver(e, 'banner')}
                  onDragLeave={(e) => handleDragLeave(e, 'banner')}
                  onDrop={(e) => handleDrop(e, 'banner')}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e.target.files, 'banner')}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={uploading}
                  />
                  <div className="text-center">
                    <div className="text-4xl mb-2">🖼️</div>
                    <p className="text-sm text-gray-600 mb-2">
                      {isDragOver.banner ? 'Drop image here' : 'Drag & drop an image or click to browse'}
                    </p>
                    <p className="text-xs text-gray-500">Supported: JPG, PNG (Max 10 MB)</p>
                  </div>
                </div>
                {formData.bannerImage && (
                  <div className="mt-3 p-3 bg-green-50 border-2 border-green-200 rounded-xl flex items-center gap-2">
                    <span className="text-green-600 text-xl">✓</span>
                    <span className="text-sm font-semibold text-green-700">Banner uploaded successfully</span>
                  </div>
                )}
              </div>

              {/* PDF Files */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                  <span className="text-red-500">📄</span> PDF Files (Max 50 MB each)
                </label>
                <div
                  className={`relative border-2 border-dashed rounded-xl p-6 transition-colors ${
                    isDragOver.pdf
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-300 hover:border-red-400'
                  } ${uploading ? 'opacity-50' : ''}`}
                  onDragOver={(e) => handleDragOver(e, 'pdf')}
                  onDragLeave={(e) => handleDragLeave(e, 'pdf')}
                  onDrop={(e) => handleDrop(e, 'pdf')}
                >
                  <input
                    type="file"
                    accept=".pdf"
                    multiple
                    onChange={(e) => handleFileUpload(e.target.files, 'pdf')}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={uploading}
                  />
                  <div className="text-center">
                    <div className="text-4xl mb-2">📄</div>
                    <p className="text-sm text-gray-600 mb-2">
                      {isDragOver.pdf ? 'Drop PDFs here' : 'Drag & drop PDFs or click to browse'}
                    </p>
                    <p className="text-xs text-gray-500">Supported: PDF (Max 50 MB each)</p>
                  </div>
                </div>
                <p className="text-xs text-slate-600 mt-1">Upload course materials, notes, or resources in PDF format</p>
                
                {/* PDF Previews */}
                {pdfPreviews.length > 0 && (
                  <div className="mt-4 space-y-3">
                    <p className="text-sm font-bold text-slate-700">Uploaded PDFs ({pdfPreviews.length})</p>
                    {pdfPreviews.map((pdf, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-2xl">📄</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-slate-900 text-sm line-clamp-1">{pdf.name}</p>
                            <p className="text-xs text-slate-600">{formatFileSize(pdf.size)}</p>
                            {uploadProgress[pdf.name] !== undefined && uploadProgress[pdf.name] < 100 && (
                              <div className="mt-2">
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-red-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${uploadProgress[pdf.name]}%` }}
                                  ></div>
                                </div>
                                <p className="text-xs text-slate-500 mt-1">{Math.round(uploadProgress[pdf.name])}% uploaded</p>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <a
                            href={pdf.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-xs font-bold"
                          >
                            Preview
                          </a>
                          <button
                            type="button"
                            onClick={() => removePdf(index)}
                            className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-xs font-bold"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Video Files */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                  <span className="text-purple-500">🎥</span> Video Files (Max 50 MB each)
                </label>
                <div
                  className={`relative border-2 border-dashed rounded-xl p-6 transition-colors ${
                    isDragOver.video
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-300 hover:border-purple-400'
                  } ${uploading ? 'opacity-50' : ''}`}
                  onDragOver={(e) => handleDragOver(e, 'video')}
                  onDragLeave={(e) => handleDragLeave(e, 'video')}
                  onDrop={(e) => handleDrop(e, 'video')}
                >
                  <input
                    type="file"
                    accept="video/*"
                    multiple
                    onChange={(e) => handleFileUpload(e.target.files, 'video')}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={uploading}
                  />
                  <div className="text-center">
                    <div className="text-4xl mb-2">🎥</div>
                    <p className="text-sm text-gray-600 mb-2">
                      {isDragOver.video ? 'Drop videos here' : 'Drag & drop videos or click to browse'}
                    </p>
                    <p className="text-xs text-gray-500">Supported: MP4 (Max 50 MB each)</p>
                  </div>
                </div>
                <p className="text-xs text-slate-600 mt-1">Upload course lessons and tutorial videos</p>
                
                {/* Video Previews */}
                {videoPreviews.length > 0 && (
                  <div className="mt-4 space-y-3">
                    <p className="text-sm font-bold text-slate-700">Uploaded Videos ({videoPreviews.length})</p>
                    {videoPreviews.map((video, index) => (
                      <div key={index} className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3 flex-1">
                            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                              <span className="text-2xl">🎥</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-slate-900 text-sm line-clamp-1">{video.name}</p>
                              <p className="text-xs text-slate-600">{formatFileSize(video.size)}</p>
                              {uploadProgress[video.name] !== undefined && uploadProgress[video.name] < 100 && (
                                <div className="mt-2">
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                      className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                                      style={{ width: `${uploadProgress[video.name]}%` }}
                                    ></div>
                                  </div>
                                  <p className="text-xs text-slate-500 mt-1">{Math.round(uploadProgress[video.name])}% uploaded</p>
                                </div>
                              )}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeVideo(index)}
                            className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-xs font-bold"
                          >
                            Remove
                          </button>
                        </div>
                        {/* Video Preview */}
                        <video
                          src={`http://localhost:5000${video.url}`}
                          controls
                          className="w-full rounded-lg"
                          style={{ maxHeight: '300px' }}
                        >
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section: Course Details */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-xl">⚙️</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Course Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                  <span className="text-orange-500">📂</span> Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition font-semibold"
                  required
                >
                  <option value="">Select a category</option>
                  <option value="Programming">💻 Programming</option>
                  <option value="Design">🎨 Design</option>
                  <option value="Marketing">📈 Marketing</option>
                  <option value="Business">💼 Business</option>
                  <option value="Photography">📷 Photography</option>
                  <option value="Music">🎵 Music</option>
                  <option value="Health & Fitness">🏃 Health & Fitness</option>
                  <option value="Language">🌍 Language</option>
                  <option value="Personal Development">🌟 Personal Development</option>
                  <option value="Data Science">📊 Data Science</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                  <span className="text-orange-500">💰</span> Price (USD) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                  <span className="text-orange-500">📊</span> Level *
                </label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition font-semibold"
                >
                  <option value="beginner">🟢 Beginner</option>
                  <option value="intermediate">🟡 Intermediate</option>
                  <option value="advanced">🔴 Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                  <span className="text-orange-500">⏱️</span> Duration (hours) *
                </label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                  placeholder="e.g., 10"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                  <span className="text-orange-500">🌐</span> Language *
                </label>
                <input
                  type="text"
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                  placeholder="English"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                  <span className="text-orange-500">🏷️</span> Tags (comma-separated)
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                  placeholder="javascript, react, web-development"
                />
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t-2 border-gray-200">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-8 py-3 border-2 border-gray-300 rounded-xl text-slate-700 hover:bg-gray-50 font-bold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || uploading}
              className="px-8 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 disabled:opacity-50 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg hover:shadow-xl transition"
            >
              {(loading || uploading) && (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {uploading ? "⏳ Uploading Files..." : loading ? "✨ Creating Course..." : "🚀 Create Course"}
            </button>
          </div>
        </form>
      </div>
        </div>
      </div>
    </div>
  );
}
