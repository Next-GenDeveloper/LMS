"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Stats {
  users: number;
  courses: number;
  revenue: number;
}

interface RecentEnrollment {
  _id: string;
  student: {
    firstName: string;
    lastName: string;
    email: string;
  };
  course: {
    title: string;
    price: number;
  };
  enrollmentDate: string;
  paymentStatus: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ users: 0, courses: 0, revenue: 0 });
  const [recentEnrollments, setRecentEnrollments] = useState<RecentEnrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchRecentEnrollments();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("http://localhost:5000/api/admin/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        if (!response.headers.get('content-type')?.includes('application/json')) {
          throw new Error('Expected JSON response');
        }
        const data = await response.json();
        setStats(data);
      } else {
        if (response.headers.get('content-type')?.includes('application/json')) {
          const error = await response.json();
          console.error("Failed to fetch stats:", error);
        } else {
          console.error("Failed to fetch stats: Server returned non-JSON response");
        }
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const fetchRecentEnrollments = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("http://localhost:5000/api/admin/enrollments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        if (!response.headers.get('content-type')?.includes('application/json')) {
          throw new Error('Expected JSON response');
        }
        const data = await response.json();
        setRecentEnrollments(data.enrollments?.slice(0, 5) || []);
      } else {
        if (response.headers.get('content-type')?.includes('application/json')) {
          const error = await response.json();
          console.error("Failed to fetch enrollments:", error);
        } else {
          console.error("Failed to fetch enrollments: Server returned non-JSON response");
        }
      }
    } catch (error) {
      console.error("Failed to fetch enrollments:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero Section - Light & Cool Theme */}
      <div className="bg-gradient-to-r from-sky-400 via-blue-400 to-cyan-400 rounded-2xl shadow-xl p-8 text-white border border-blue-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold mb-2 drop-shadow-sm">Welcome Back! 👋</h1>
            <p className="text-white/90 text-lg">Here's what's happening with your LMS today</p>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <div className="w-16 h-16 bg-white/30 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-3xl">📊</span>
            </div>
          </div>
        </div>

        {/* Stats Grid - Light Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600 text-sm font-semibold">Total Students</p>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg flex items-center justify-center shadow-sm">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
              </div>
            </div>
            <p className="text-4xl font-bold text-gray-900">{stats.users}</p>
            <p className="text-gray-500 text-xs mt-1">Active learners</p>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600 text-sm font-semibold">Total Courses</p>
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-lg flex items-center justify-center shadow-sm">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                </svg>
              </div>
            </div>
            <p className="text-4xl font-bold text-gray-900">{stats.courses}</p>
            <p className="text-gray-500 text-xs mt-1">Published courses</p>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600 text-sm font-semibold">Total Revenue</p>
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-500 rounded-lg flex items-center justify-center shadow-sm">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <p className="text-4xl font-bold text-gray-900">${stats.revenue.toLocaleString()}</p>
            <p className="text-gray-500 text-xs mt-1">From enrollments</p>
          </div>
        </div>
      </div>

      {/* Quick Actions - Light Theme */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link 
          href="/admin/courses"
          className="group bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300 border border-blue-100 hover:border-blue-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
              </svg>
            </div>
            <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">Manage Courses</h3>
          <p className="text-sm text-gray-600">View, edit, and organize courses</p>
        </Link>

        <Link 
          href="/admin/users"
          className="group bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300 border border-emerald-100 hover:border-emerald-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
            </div>
            <svg className="w-5 h-5 text-gray-400 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">Manage Users</h3>
          <p className="text-sm text-gray-600">View and manage all users</p>
        </Link>

        <Link 
          href="/admin/enrollments"
          className="group bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300 border border-purple-100 hover:border-purple-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-purple-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
              </svg>
            </div>
            <svg className="w-5 h-5 text-gray-400 group-hover:text-purple-500 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">Enrollments</h3>
          <p className="text-sm text-gray-600">Track student enrollments</p>
        </Link>

        <Link 
          href="/admin/announcements"
          className="group bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300 border border-orange-100 hover:border-orange-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z" clipRule="evenodd" />
              </svg>
            </div>
            <svg className="w-5 h-5 text-gray-400 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">Announcements</h3>
          <p className="text-sm text-gray-600">Post updates and news</p>
        </Link>
      </div>

      {/* Recent Enrollments - Light Theme */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg flex items-center justify-center shadow-sm">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Recent Enrollments</h2>
          </div>
          <Link 
            href="/admin/enrollments" 
            className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition font-semibold text-sm"
          >
            View All
          </Link>
        </div>

        {recentEnrollments.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-700 font-semibold">No recent enrollments</p>
            <p className="text-gray-500 text-sm mt-1">Enrollments will appear here when students join courses</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentEnrollments.map((enrollment) => (
              <div 
                key={enrollment._id} 
                className="flex items-center justify-between p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition border border-blue-100"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold shadow-sm">
                    {enrollment.student.firstName[0]}{enrollment.student.lastName[0]}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">
                      {enrollment.student.firstName} {enrollment.student.lastName}
                    </p>
                    <p className="text-sm text-gray-600">{enrollment.course.title}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-emerald-600">${enrollment.course.price}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(enrollment.enrollmentDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
