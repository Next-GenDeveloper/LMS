"use client";

import { useState, useEffect } from "react";
import { API_BASE } from "@/lib/api";
import { useRouter } from "next/navigation";

type PDFViewerProps = {
  courseId: string;
  pdfUrl: string;
  lessonId?: string;
};

export default function PDFViewer({ courseId, pdfUrl, lessonId }: PDFViewerProps) {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuthorization = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          setIsAuthorized(false);
          return;
        }

        // Check if user is enrolled in the course with completed payment
        const response = await fetch(`${API_BASE}/api/enrollments/check/${courseId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to verify enrollment");
        }

        const data = await response.json();
        setIsAuthorized(data.isEnrolled && data.paymentStatus === 'completed');
      } catch (err) {
        console.error("Authorization check failed:", err);
        setError("Failed to verify access. Please try again.");
        setIsAuthorized(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuthorization();
  }, [courseId]);

  const handleLoginRedirect = () => {
    router.push(`/auth/login?next=${encodeURIComponent(window.location.pathname)}`);
  };

  const getSecurePdfUrl = (url: string): string => {
    if (!url) return "";
    if (url.startsWith('http')) return url;

    // Add authorization token to PDF URL for backend verification
    const token = localStorage.getItem("authToken");
    if (token && url.startsWith('/')) {
      return `${API_BASE}${url}?token=${encodeURIComponent(token)}&courseId=${courseId}`;
    }

    return `${API_BASE}${url}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px] bg-gray-50 rounded-lg">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
        <p className="ml-3 text-gray-600">Checking access permissions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.01-1.742 3.01H4.42c-1.532 0-2.493-1.676-1.743-3.01l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Access Restricted</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>You need to enroll in this course and complete payment to access this content.</p>
              <div className="mt-3 flex space-x-3">
                <button
                  onClick={handleLoginRedirect}
                  className="px-3 py-1 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700 transition"
                >
                  Enroll Now
                </button>
                <button
                  onClick={() => router.push(`/courses/${courseId}`)}
                  className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200 transition"
                >
                  View Course
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If authorized, display the PDF
  const securePdfUrl = getSecurePdfUrl(pdfUrl);

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="p-4 border-b">
        <h3 className="font-semibold text-gray-900">Course Material</h3>
        <p className="text-sm text-gray-600 mt-1">
          {lessonId ? `Lesson ${lessonId} PDF` : 'Course PDF Material'}
        </p>
      </div>
      <div className="min-h-[500px] bg-gray-50">
        {pdfUrl.endsWith('.pdf') ? (
          <iframe
            src={securePdfUrl}
            className="w-full h-[500px] border-0"
            title="PDF Viewer"
            allowFullScreen
          />
        ) : (
          <div className="p-6 text-center">
            <div className="text-blue-500 mb-2">
              <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Document Preview</h3>
            <p className="text-gray-600 mb-4">
              This document format cannot be previewed directly. Please download to view.
            </p>
            <a
              href={securePdfUrl}
              download
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 transition"
            >
              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Document
            </a>
          </div>
        )}
      </div>
    </div>
  );
}