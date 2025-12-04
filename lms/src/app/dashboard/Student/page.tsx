"use client";
import Link from "next/link";
import ProgressCircle from "@/components/ProgressCircle";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { getUserFromToken, isLoggedIn } from "@/lib/auth";

interface Enrollment {
  _id: string;
  status: string;
  progress: number;
  enrollmentDate: string;
  course: {
    _id: string;
    title: string;
    category: string;
    thumbnail?: string;
    price: number;
  };
}

export default function StudentDashboardPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check authentication
    if (!isLoggedIn()) {
      router.replace('/auth/login');
      return;
    }

    async function loadEnrollments() {
      try {
        const tokenUser = getUserFromToken();
        if (tokenUser?.userId) {
          const list = await apiFetch<Enrollment[]>(`/api/users/${tokenUser.userId}/enrollments`);
          setEnrollments(list);
        } else {
          // If no valid user token, try to get current user info first
          try {
            const userInfo = await apiFetch<{ _id: string }>(`/api/users/me`);
            if (userInfo._id) {
              const list = await apiFetch<Enrollment[]>(`/api/users/${userInfo._id}/enrollments`);
              setEnrollments(list);
            }
          } catch (userError) {
            console.log('User not authenticated, redirecting to login');
            // Clear invalid token and redirect to login
            localStorage.removeItem('authToken');
            localStorage.removeItem('userProfile');
            router.replace('/auth/login');
            return;
          }
        }
      } catch (error: any) {
        console.error('Failed to load enrollments:', error);
        if (error?.message?.includes('401') || error?.message?.includes('Unauthorized')) {
          // Token is invalid, clear it and redirect to login
          localStorage.removeItem('authToken');
          localStorage.removeItem('userProfile');
          router.replace('/auth/login');
          return;
        }
        // Keep empty array on other errors
      } finally {
        setLoading(false);
      }
    }

    loadEnrollments();
  }, []);

  // Transform enrollments to match the expected course format for display
  const myCourses = enrollments.map(enrollment => ({
    id: enrollment.course._id,
    title: enrollment.course.title,
    progress: enrollment.progress,
    category: enrollment.course.category,
    instructor: 'Instructor', // Could be populated if available
    image: enrollment.course.thumbnail || 'bg-gradient-to-br from-blue-500 to-purple-600',
    status: enrollment.status
  }));

  if (loading) {
    return (
      <div className="min-h-screen bg-[#ffe9d6] bg-[radial-gradient(circle_at_top_left,#ffd1a1,transparent_55%),radial-gradient(circle_at_bottom_right,#ffb46b,transparent_60%)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-[#ffe9d6] bg-[radial-gradient(circle_at_top_left,#ffd1a1,transparent_55%),radial-gradient(circle_at_bottom_right,#ffb46b,transparent_60%)]">
      <div className="mx-auto max-w-6xl px-4 py-8 lg:py-10">
        {/* Welcome Header */}
        <div className="mb-8 animate-fade-in-up">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-orange-500">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-[10px] text-white">
              9T
            </span>
            Student Dashboard
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">
            Welcome back, learner 👋
          </h1>
          <p className="text-sm md:text-base text-slate-600 max-w-2xl">
            Track your progress, resume courses, and celebrate your achievements—all in one clean view.
          </p>
        </div>

        <div className="grid lg:grid-cols-[280px,1fr] gap-6 lg:gap-8">
          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="rounded-3xl border border-orange-100 bg-white/90 p-6 shadow-lg backdrop-blur">
              <nav className="space-y-2">
                <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-orange-50 transition-all font-medium">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3" />
                  </svg>
                  Home
                </Link>
                <Link href="/dashboard/Student" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-400 text-white font-semibold transition-all shadow-sm">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Dashboard
                </Link>
                <Link href="/my-learning" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-orange-50 transition-all font-medium">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  My Learning
                </Link>
                <Link href="/dashboard/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-orange-50 transition-all font-medium">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profile
                </Link>
                <Link href="/courses" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-orange-50 transition-all font-medium">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Explore Courses
                </Link>
              </nav>

              <div className="mt-8 pt-6 border-t border-orange-100">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-green-50">
                    <div className="text-2xl font-extrabold text-emerald-600">
                      {enrollments.filter(e => e.status === 'completed').length}
                    </div>
                    <div className="text-xs text-slate-500 font-medium mt-1">Completed</div>
                  </div>
                  <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50">
                    <div className="text-2xl font-extrabold text-orange-500">
                      {enrollments.filter(e => e.status === 'active' || e.status === 'in-progress').length}
                    </div>
                    <div className="text-xs text-slate-500 font-medium mt-1">In progress</div>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="space-y-8">
            {/* Stats Cards */}
            <div className="grid sm:grid-cols-3 gap-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              <div className="rounded-3xl border border-orange-100 p-6 bg-gradient-to-br from-white to-orange-50 shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center">
                    <ProgressCircle value={
                      enrollments.length > 0
                        ? Math.round(enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length)
                        : 0
                    } />
                  </div>
                </div>
                <div className="text-xs text-slate-500 mb-1 font-medium">Overall Progress</div>
                <div className="text-3xl font-extrabold bg-gradient-to-r from-orange-500 to-amber-400 text-transparent bg-clip-text">
                  {enrollments.length > 0
                    ? Math.round(enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length)
                    : 0}%
                </div>
              </div>
              <div className="rounded-3xl border border-orange-100 p-6 bg-gradient-to-br from-white to-orange-50 shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                    <span className="text-2xl">🔥</span>
                  </div>
                </div>
                <div className="text-xs text-slate-500 mb-1 font-medium">Active streak</div>
                <div className="text-3xl font-extrabold text-orange-600">
                  {enrollments.filter(e => e.status === 'active' || e.status === 'in-progress').length > 0 ? 'Active' : '0 days'}
                </div>
              </div>
              <div className="rounded-3xl border border-orange-100 p-6 bg-gradient-to-br from-white to-yellow-50 shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-500 flex items-center justify-center">
                    <span className="text-2xl">🏆</span>
                  </div>
                </div>
                <div className="text-xs text-slate-500 mb-1 font-medium">Certificates</div>
                <div className="text-3xl font-extrabold text-amber-500">
                  {enrollments.filter(e => e.status === 'completed').length}
                </div>
              </div>
            </div>

            {/* Continue Learning */}
            <section className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <div className="flex items-end justify-between mb-6">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-slate-900">Continue learning</h2>
                  <p className="text-slate-500 text-sm mt-1">Pick up where you left off</p>
                </div>
                <Link href="/my-learning" className="text-orange-500 hover:text-orange-600 text-sm font-semibold transition-colors">
                  View all →
                </Link>
              </div>
              {myCourses.filter(c => c.progress > 0 && c.progress < 100).length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📚</div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">No courses in progress</h3>
                  <p className="text-slate-500 mb-6">Start learning by enrolling in a course</p>
                  <Link href="/courses" className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 text-white font-semibold hover:from-orange-600 hover:to-orange-500 transition-all">
                    Browse Courses
                  </Link>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myCourses.filter(c => c.progress > 0 && c.progress < 100).slice(0,3).map((c, idx) => (
                  <Link key={c.id} href={`/courses/${c.id}`} className="group">
                    <div className="rounded-3xl border border-orange-100 overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                      <div className={`h-32 w-full ${c.image} relative overflow-hidden`}>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        <div className="absolute bottom-3 left-3 right-3">
                          <div className="text-white font-bold text-lg line-clamp-1">{c.title}</div>
                          <div className="text-white/80 text-xs">{c.category}</div>
                        </div>
                      </div>
                      <div className="p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-amber-400 flex items-center justify-center text-white text-xs font-bold">
                            {c.instructor.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="text-xs text-gray-600 dark:text-gray-400">by {c.instructor}</span>
                        </div>
                          <div className="mb-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-semibold text-slate-700">Progress</span>
                              <span className="text-xs font-bold text-orange-500">{c.progress}%</span>
                            </div>
                            <div className="h-2 w-full bg-orange-50 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full transition-all duration-500"
                                style={{ width: `${c.progress}%` }}
                              />
                            </div>
                          </div>
                        <button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-400 text-white font-semibold text-sm hover:from-orange-600 hover:to-orange-500 transition-all transform group-hover:scale-105">
                          Continue Learning →
                        </button>
                      </div>
                    </div>
                  </Link>
                  ))}
                </div>
              )}
            </section>

            {/* My Courses */}
            <section className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
              <div className="flex items-end justify-between mb-6">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-slate-900">My courses</h2>
                  <p className="text-slate-500 text-sm mt-1">All your enrolled courses</p>
                </div>
                <Link href="/courses" className="text-orange-500 hover:text-orange-600 text-sm font-semibold transition-colors">
                  Browse more →
                </Link>
              </div>
              {myCourses.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🎓</div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">No courses enrolled yet</h3>
                  <p className="text-slate-500 mb-6">Start your learning journey by enrolling in your first course</p>
                  <Link href="/courses" className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 text-white font-semibold hover:from-orange-600 hover:to-orange-500 transition-all">
                    Explore Courses
                  </Link>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {myCourses.map((c) => (
                  <Link key={c.id} href={`/courses/${c.id}`} className="group">
                    <div className="rounded-3xl border border-orange-100 overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                      <div className={`h-40 w-full ${c.image} relative`}>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                        {c.progress === 0 && (
                          <div className="absolute top-3 right-3">
                            <span className="px-3 py-1 rounded-full bg-[#d62828] text-white text-xs font-bold">New</span>
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        <h3 className="font-bold text-slate-900 mb-1 line-clamp-1">{c.title}</h3>
                        <p className="text-xs text-slate-500 mb-3">{c.category}</p>
                        {c.progress > 0 ? (
                          <>
                            <div className="mb-2">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-slate-500">Progress</span>
                                <span className="text-xs font-bold text-orange-500">{c.progress}%</span>
                              </div>
                              <div className="h-1.5 w-full bg-orange-50 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full transition-all"
                                  style={{ width: `${c.progress}%` }}
                                />
                              </div>
                            </div>
                            <button className="w-full py-2 rounded-lg border border-orange-400 text-orange-500 font-semibold text-sm hover:bg-orange-500 hover:text-white transition-all">
                              Resume Course
                            </button>
                          </>
                        ) : (
                          <button className="w-full py-2 rounded-lg bg-gradient-to-r from-orange-500 to-amber-400 text-white font-semibold text-sm hover:from-orange-600 hover:to-orange-500 transition-all">
                            Start Learning
                          </button>
                        )}
                      </div>
                    </div>
                  </Link>
                  ))}
                </div>
              )}
            </section>

            {/* Achievements */}
            <section className="animate-fade-in-up" style={{ animationDelay: '400ms' }}>
              <div className="flex items-end justify-between mb-6">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-slate-900">Achievements</h2>
                  <p className="text-slate-500 text-sm mt-1">Your learning milestones</p>
                </div>
                <Link href="#" className="text-orange-500 hover:text-orange-600 text-sm font-semibold transition-colors">
                  View all →
                </Link>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="rounded-3xl border border-orange-100 p-6 bg-gradient-to-br from-yellow-50 to-amber-50 text-center hover:shadow-lg transition-all">
                  <div className="text-5xl mb-3">🏅</div>
                  <div className="font-bold text-slate-900">First Course</div>
                  <div className="text-sm text-slate-500 mt-1">Completed</div>
                </div>
                <div className="rounded-3xl border border-orange-100 p-6 bg-gradient-to-br from-orange-50 to-amber-50 text-center hover:shadow-lg transition-all">
                  <div className="text-5xl mb-3">🚀</div>
                  <div className="font-bold text-slate-900">7-Day Streak</div>
                  <div className="text-sm text-slate-500 mt-1">Keep it up!</div>
                </div>
                <div className="rounded-3xl border border-orange-100 p-6 bg-gradient-to-br from-emerald-50 to-green-50 text-center hover:shadow-lg transition-all">
                  <div className="text-5xl mb-3">💯</div>
                  <div className="font-bold text-slate-900">Perfect Score</div>
                  <div className="text-sm text-slate-500 mt-1">Quiz Master</div>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
