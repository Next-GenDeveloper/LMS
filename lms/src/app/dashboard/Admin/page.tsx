"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

interface Stats {
  users: number;
  courses: number;
  revenue: number;
}

interface Enrollment {
  _id: string;
  student: { firstName: string; lastName: string; email: string };
  course: { title: string; thumbnail?: string; price: number };
  enrollmentDate: string;
  status: string;
  paymentStatus: string;
}

interface Course {
  _id: string;
  title: string;
  description: string;
  thumbnail?: string;
  price: number;
  category: string;
  isPublished: boolean;
  enrollmentCount: number;
  instructor: { firstName: string; lastName: string };
}

export default function AdminDashboardPage() {
  const [status, setStatus] = useState<'loading'|'ready'|'error'>('loading');
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const [isBackendOffline, setIsBackendOffline] = useState<boolean>(false);
  const [stats, setStats] = useState<Stats | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  const router = useRouter();
  
  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        setStatus('loading');
        setError('');
        
        // Try to fetch admin data
        let adminData, statsData, enrollmentsData, coursesData;
        
        let backendOffline = false;
        
        try {
          adminData = await apiFetch<{ message: string; user: any }>(`/api/admin`);
        } catch (e: any) {
          // If backend is not available, use mock data
          console.warn('Backend not available, using mock admin data');
          backendOffline = true;
          adminData = { message: 'Admin Dashboard (Offline Mode)', user: { email: 'mirkashi28@gmail.com', role: 'admin' } };
        }
        
        try {
          statsData = await apiFetch<Stats>(`/api/admin/stats`);
        } catch (e: any) {
          console.warn('Stats endpoint not available, using mock data');
          backendOffline = true;
          statsData = { users: 0, courses: 0, revenue: 0 };
        }
        
        try {
          enrollmentsData = await apiFetch<{ enrollments: Enrollment[] }>(`/api/admin/enrollments`);
        } catch (e: any) {
          console.warn('Enrollments endpoint not available, using mock data');
          backendOffline = true;
          enrollmentsData = { enrollments: [] };
        }
        
        try {
          coursesData = await apiFetch<{ courses: Course[] }>(`/api/admin/courses`);
        } catch (e: any) {
          console.warn('Courses endpoint not available, using mock data');
          backendOffline = true;
          coursesData = { courses: [] };
        }
        
        if (ignore) return;
        setIsBackendOffline(backendOffline);
        
        if (ignore) return;
        setUser(adminData.user);
        setStats(statsData);
        setEnrollments(enrollmentsData.enrollments || []);
        setCourses(coursesData.courses || []);
        setStatus('ready');
      } catch (e: any) {
        if (ignore) return;
        const msg = String(e?.message || 'Failed to load');
        // Only show error if it's an auth error
        if (msg.includes('API 401') || msg.includes('Unauthorized')) {
          router.replace('/auth/login');
          return;
        }
        // For other errors, show dashboard with empty data
        setStats({ users: 0, courses: 0, revenue: 0 });
        setEnrollments([]);
        setCourses([]);
        setStatus('ready');
      }
    }
    load();
    return () => { ignore = true };
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4 py-8 lg:py-12">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-2">
                Admin Dashboard
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Manage your learning platform
              </p>
            </div>
            <Link
              href="/dashboard/Admin/courses"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#0053b8] to-[#003a80] text-white font-bold hover:from-[#003a80] hover:to-[#0053b8] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Upload New Course
            </Link>
          </div>
        </div>

        {status === 'loading' && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#0053b8]"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading dashboard...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="rounded-2xl border-2 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-6 text-center">
            <div className="text-red-600 dark:text-red-400 font-semibold text-lg mb-2">Error Loading Dashboard</div>
            <div className="text-red-600 dark:text-red-400">{error}</div>
          </div>
        )}

        {status === 'ready' && (
          <>
            {isBackendOffline && (
              <div className="mb-6 rounded-xl border-2 border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20 p-4 flex items-center gap-3 animate-fade-in-up">
                <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div className="flex-1">
                  <div className="text-yellow-800 dark:text-yellow-300 font-semibold">Backend Offline</div>
                  <div className="text-yellow-700 dark:text-yellow-400 text-sm">Dashboard is running in offline mode. Please ensure the backend server is running at http://localhost:5000 for full functionality.</div>
                </div>
              </div>
            )}
            {/* Stats Cards */}
            <div className="grid sm:grid-cols-3 gap-6 mb-8 animate-fade-in-up">
              <div className="rounded-2xl border border-gray-200 dark:border-gray-800 p-6 bg-gradient-to-br from-white to-blue-50/50 dark:from-gray-900 dark:to-blue-950/20 shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Students</div>
                <div className="text-3xl font-extrabold bg-gradient-to-r from-[#0053b8] to-[#003a80] text-transparent bg-clip-text">
                  {stats?.users ?? 0}
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 dark:border-gray-800 p-6 bg-gradient-to-br from-white to-purple-50/50 dark:from-gray-900 dark:to-purple-950/20 shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Courses</div>
                <div className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
                  {stats?.courses ?? 0}
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 dark:border-gray-800 p-6 bg-gradient-to-br from-white to-green-50/50 dark:from-gray-900 dark:to-green-950/20 shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Revenue</div>
                <div className="text-3xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-600 text-transparent bg-clip-text">
                  Rs {stats?.revenue?.toLocaleString?.() ?? 0}
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6 mb-8">
              {/* Courses List */}
              <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-lg animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">All Courses</h2>
                  <Link
                    href="/dashboard/Admin/courses"
                    className="text-sm font-semibold text-[#0053b8] hover:text-[#003a80] dark:text-blue-400 transition-colors"
                  >
                    Manage All →
                  </Link>
                </div>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {courses.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      No courses yet. Create your first course!
                    </div>
                  ) : (
                    courses.slice(0, 5).map((course) => (
                      <div
                        key={course._id}
                        className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                      >
                        <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0 overflow-hidden">
                          {course.thumbnail ? (
                            <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white text-xs font-bold">
                              {course.title[0]}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 dark:text-white truncate">{course.title}</h3>
                          <div className="flex items-center gap-3 mt-1 text-xs text-gray-600 dark:text-gray-400">
                            <span>{course.category}</span>
                            <span>•</span>
                            <span>{course.enrollmentCount || 0} students</span>
                            <span className={`px-2 py-0.5 rounded-full ${course.isPublished ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'}`}>
                              {course.isPublished ? 'Published' : 'Draft'}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Link
                            href={`/courses/${course._id}/edit`}
                            className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                          >
                            Edit
                          </Link>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Recent Enrollments */}
              <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-lg animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Recent Enrollments</h2>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {enrollments.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      No enrollments yet.
                    </div>
                  ) : (
                    enrollments.map((enrollment) => (
                      <div
                        key={enrollment._id}
                        className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                          {enrollment.student?.firstName?.[0] || 'S'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {enrollment.student?.firstName} {enrollment.student?.lastName}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 truncate">
                            {enrollment.course?.title}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            {new Date(enrollment.enrollmentDate).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-[#0053b8] dark:text-blue-400">
                            Rs {enrollment.course?.price || 0}
                          </div>
                          <div className={`text-xs px-2 py-0.5 rounded-full mt-1 ${
                            enrollment.paymentStatus === 'completed' 
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' 
                              : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                          }`}>
                            {enrollment.paymentStatus}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-lg animate-fade-in-up" style={{ animationDelay: '300ms' }}>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Quick Actions</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link
                  href="/dashboard/Admin/courses"
                  className="p-4 rounded-xl border-2 border-gray-200 dark:border-gray-800 hover:border-[#0053b8] dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0053b8] to-[#003a80] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <div className="font-semibold text-gray-900 dark:text-white">Upload Course</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Create new course</div>
                </Link>

                <Link
                  href="/dashboard/Admin/users"
                  className="p-4 rounded-xl border-2 border-gray-200 dark:border-gray-800 hover:border-purple-500 dark:hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div className="font-semibold text-gray-900 dark:text-white">Manage Users</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">View all students</div>
                </Link>

                <Link
                  href="/dashboard/Admin/courses"
                  className="p-4 rounded-xl border-2 border-gray-200 dark:border-gray-800 hover:border-green-500 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-950/20 transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="font-semibold text-gray-900 dark:text-white">View Reports</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Analytics & insights</div>
                </Link>

                <Link
                  href="/dashboard/Admin/courses"
                  className="p-4 rounded-xl border-2 border-gray-200 dark:border-gray-800 hover:border-orange-500 dark:hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="font-semibold text-gray-900 dark:text-white">Revenue</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">View earnings</div>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
