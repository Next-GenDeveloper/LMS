"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { API_BASE } from "@/lib/api";
import PDFViewer from "@/components/PDFViewer";
import Link from "next/link";

type CourseContentLayoutProps = {
  children: React.ReactNode;
  params: {
    courseId: string;
  };
};

export default function CourseContentLayout({ children, params }: CourseContentLayoutProps) {
  const { courseId } = params;
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeLesson, setActiveLesson] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCourseContent = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");

        // Check if user is enrolled
        const enrollmentResponse = await fetch(`${API_BASE}/api/enrollments/check/${courseId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!enrollmentResponse.ok) {
          throw new Error("Not enrolled in this course");
        }

        const enrollmentData = await enrollmentResponse.json();
        if (!enrollmentData.isEnrolled) {
          router.push(`/courses/${courseId}`);
          return;
        }

        // Fetch course details
        const courseResponse = await fetch(`${API_BASE}/api/courses/${courseId}`);
        if (!courseResponse.ok) {
          throw new Error("Failed to fetch course details");
        }

        const courseData = await courseResponse.json();
        setCourse(courseData);

        // Set first lesson as active by default
        if (courseData.modules && courseData.modules.length > 0 &&
            courseData.modules[0].lessons && courseData.modules[0].lessons.length > 0) {
          setActiveLesson(courseData.modules[0].lessons[0]._id || courseData.modules[0].lessons[0].id);
        }

      } catch (err) {
        console.error("Error fetching course content:", err);
        setError("Failed to load course content. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseContent();
  }, [courseId, router]);

  const handleLessonClick = (lessonId: string) => {
    setActiveLesson(lessonId);
  };

  const getActiveLesson = () => {
    if (!course || !activeLesson) return null;

    for (const module of course.modules) {
      const lesson = module.lessons.find((l: any) => l._id === activeLesson || l.id === activeLesson);
      if (lesson) {
        return { ...lesson, moduleTitle: module.title };
      }
    }

    return null;
  };

  const activeLessonData = getActiveLesson();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        <p className="ml-4 text-gray-700">Loading course content...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Course Not Found</h2>
          <p className="text-gray-600 mb-4">The course content you're looking for doesn't exist.</p>
          <Link
            href="/courses"
            className="inline-block px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            Browse Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{course.title}</h1>
            <p className="text-gray-600">Course Content & Materials</p>
          </div>
          <Link
            href={`/courses/${courseId}`}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            ← Back to Course
          </Link>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Course Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="p-4 border-b bg-gray-50">
                <h3 className="font-semibold text-gray-900">Course Modules</h3>
              </div>
              <div className="divide-y max-h-[calc(100vh-200px)] overflow-y-auto">
                {course.modules && course.modules.length > 0 ? (
                  course.modules.map((module: any, moduleIndex: number) => (
                    <div key={moduleIndex} className="py-4">
                      <div className="px-4 pb-2">
                        <h4 className="font-medium text-gray-800">{module.title}</h4>
                      </div>
                      <div className="space-y-1">
                        {module.lessons && module.lessons.length > 0 ? (
                          module.lessons.map((lesson: any, lessonIndex: number) => (
                            <button
                              key={lessonIndex}
                              onClick={() => handleLessonClick(lesson._id || lesson.id)}
                              className={`w-full text-left px-6 py-2 text-sm transition ${
                                activeLesson === (lesson._id || lesson.id)
                                  ? 'bg-purple-50 text-purple-700 font-medium'
                                  : 'text-gray-600 hover:bg-gray-50'
                              }`}
                            >
                              <div className="flex items-center">
                                <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {lesson.title}
                              </div>
                            </button>
                          ))
                        ) : (
                          <div className="px-6 py-2 text-sm text-gray-500">No lessons in this module</div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">No modules available</div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {activeLessonData ? (
              <div className="space-y-6">
                {/* Lesson Header */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-2">{activeLessonData.title}</h2>
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium mr-2">
                          {activeLessonData.moduleTitle}
                        </span>
                        <span>Lesson • {activeLessonData.duration || 'N/A'} minutes</span>
                      </div>
                    </div>
                  </div>
                  <p className="mt-4 text-gray-700">{activeLessonData.description || 'No description available.'}</p>
                </div>

                {/* Video Player (Placeholder) */}
                {activeLessonData.videoUrl && (
                  <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                    <div className="p-4 border-b">
                      <h3 className="font-semibold text-gray-900">Video Lesson</h3>
                    </div>
                    <div className="aspect-video bg-black flex items-center justify-center">
                      <video
                        src={activeLessonData.videoUrl.startsWith('http') ? activeLessonData.videoUrl : `${API_BASE}${activeLessonData.videoUrl}`}
                        controls
                        className="w-full h-full"
                      >
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  </div>
                )}

                {/* PDF Materials */}
                {activeLessonData.materials && activeLessonData.materials.length > 0 && (
                  <div className="space-y-4">
                    {activeLessonData.materials.map((pdfUrl: string, index: number) => (
                      <PDFViewer
                        key={index}
                        courseId={courseId}
                        pdfUrl={pdfUrl}
                        lessonId={activeLessonData._id || activeLessonData.id}
                      />
                    ))}
                  </div>
                )}

                {/* Course PDFs (from course level) */}
                {course.pdfFiles && course.pdfFiles.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Course Materials</h3>
                    {course.pdfFiles.map((pdfUrl: string, index: number) => (
                      <PDFViewer
                        key={`course-pdf-${index}`}
                        courseId={courseId}
                        pdfUrl={pdfUrl}
                      />
                    ))}
                  </div>
                )}

                {/* Children content (additional course pages) */}
                <div className="mt-8">
                  {children}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                <div className="text-blue-500 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Lesson</h3>
                <p className="text-gray-600">Choose a lesson from the left sidebar to view its content.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}