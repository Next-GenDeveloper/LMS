"use client";
import Link from "next/link";
import ProgressCircle from "@/components/ProgressCircle";

const myCourses = [
  { id: 'c1', title: 'React for Beginners', progress: 25, category: 'Development', instructor: 'Alex Johnson', image: 'bg-gradient-to-br from-blue-500 to-purple-600' },
  { id: 'c2', title: 'TypeScript Mastery', progress: 60, category: 'Development', instructor: 'Sarah Williams', image: 'bg-gradient-to-br from-yellow-400 to-orange-500' },
  { id: 'c3', title: 'Figma Essentials', progress: 10, category: 'Design', instructor: 'Emma Davis', image: 'bg-gradient-to-br from-pink-400 to-rose-600' },
  { id: 'c4', title: 'Marketing 101', progress: 0, category: 'Marketing', instructor: 'Michael Chen', image: 'bg-gradient-to-br from-green-400 to-teal-600' },
];

export default function StudentDashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4 py-8 lg:py-12">
        {/* Welcome Header */}
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-2">
            Welcome Back! 👋
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Continue your learning journey and achieve your goals
          </p>
        </div>

        <div className="grid lg:grid-cols-[280px,1fr] gap-6 lg:gap-8">
          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-lg backdrop-blur">
              <nav className="space-y-2">
                <Link href="/dashboard/Student" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-[#0053b8] to-[#003a80] text-white font-semibold transition-all">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Dashboard
                </Link>
                <Link href="/my-learning" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all font-medium">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  My Learning
                </Link>
                <Link href="/dashboard/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all font-medium">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profile
                </Link>
                <Link href="/courses" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all font-medium">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Explore Courses
                </Link>
              </nav>

              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
                    <div className="text-2xl font-extrabold text-green-600 dark:text-green-400">3</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 font-medium mt-1">Completed</div>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20">
                    <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">6</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 font-medium mt-1">In Progress</div>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="space-y-8">
            {/* Stats Cards */}
            <div className="grid sm:grid-cols-3 gap-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              <div className="rounded-2xl border border-gray-200 dark:border-gray-800 p-6 bg-gradient-to-br from-white to-blue-50/50 dark:from-gray-900 dark:to-blue-950/20 shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0053b8] to-[#003a80] flex items-center justify-center">
                    <ProgressCircle value={72} />
                  </div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Overall Progress</div>
                <div className="text-3xl font-extrabold bg-gradient-to-r from-[#0053b8] to-[#003a80] text-transparent bg-clip-text">72%</div>
              </div>
              <div className="rounded-2xl border border-gray-200 dark:border-gray-800 p-6 bg-gradient-to-br from-white to-orange-50/50 dark:from-gray-900 dark:to-orange-950/20 shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                    <span className="text-2xl">🔥</span>
                  </div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Active Streak</div>
                <div className="text-3xl font-extrabold text-orange-600 dark:text-orange-400">5 days</div>
              </div>
              <div className="rounded-2xl border border-gray-200 dark:border-gray-800 p-6 bg-gradient-to-br from-white to-yellow-50/50 dark:from-gray-900 dark:to-yellow-950/20 shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-500 flex items-center justify-center">
                    <span className="text-2xl">🏆</span>
                  </div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Certificates</div>
                <div className="text-3xl font-extrabold text-yellow-600 dark:text-yellow-400">2</div>
              </div>
            </div>

            {/* Continue Learning */}
            <section className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <div className="flex items-end justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Continue Learning</h2>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Pick up where you left off</p>
                </div>
                <Link href="/my-learning" className="text-[#0053b8] hover:text-[#003a80] dark:text-blue-400 text-sm font-semibold transition-colors">
                  View all →
                </Link>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {myCourses.slice(0,3).map((c, idx) => (
                  <Link key={c.id} href={`/courses/${c.id}`} className="group">
                    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-900 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                      <div className={`h-32 w-full ${c.image} relative overflow-hidden`}>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        <div className="absolute bottom-3 left-3 right-3">
                          <div className="text-white font-bold text-lg line-clamp-1">{c.title}</div>
                          <div className="text-white/80 text-xs">{c.category}</div>
                        </div>
                      </div>
                      <div className="p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                            {c.instructor.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="text-xs text-gray-600 dark:text-gray-400">by {c.instructor}</span>
                        </div>
                        <div className="mb-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Progress</span>
                            <span className="text-xs font-bold text-[#0053b8] dark:text-blue-400">{c.progress}%</span>
                          </div>
                          <div className="h-2 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-[#0053b8] to-[#003a80] rounded-full transition-all duration-500"
                              style={{ width: `${c.progress}%` }}
                            />
                          </div>
                        </div>
                        <button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#0053b8] to-[#003a80] text-white font-semibold text-sm hover:from-[#003a80] hover:to-[#0053b8] transition-all transform group-hover:scale-105">
                          Continue Learning →
                        </button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* My Courses */}
            <section className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
              <div className="flex items-end justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Courses</h2>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">All your enrolled courses</p>
                </div>
                <Link href="/courses" className="text-[#0053b8] hover:text-[#003a80] dark:text-blue-400 text-sm font-semibold transition-colors">
                  Browse more →
                </Link>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {myCourses.map((c) => (
                  <Link key={c.id} href={`/courses/${c.id}`} className="group">
                    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-900 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                      <div className={`h-40 w-full ${c.image} relative`}>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                        {c.progress === 0 && (
                          <div className="absolute top-3 right-3">
                            <span className="px-3 py-1 rounded-full bg-[#d62828] text-white text-xs font-bold">New</span>
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-1 line-clamp-1">{c.title}</h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">{c.category}</p>
                        {c.progress > 0 ? (
                          <>
                            <div className="mb-2">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-gray-600 dark:text-gray-400">Progress</span>
                                <span className="text-xs font-bold text-[#0053b8] dark:text-blue-400">{c.progress}%</span>
                              </div>
                              <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-[#0053b8] to-[#003a80] rounded-full transition-all"
                                  style={{ width: `${c.progress}%` }}
                                />
                              </div>
                            </div>
                            <button className="w-full py-2 rounded-lg border border-[#0053b8] text-[#0053b8] dark:text-blue-400 font-semibold text-sm hover:bg-[#0053b8] hover:text-white dark:hover:bg-blue-600 transition-all">
                              Resume Course
                            </button>
                          </>
                        ) : (
                          <button className="w-full py-2 rounded-lg bg-gradient-to-r from-[#0053b8] to-[#003a80] text-white font-semibold text-sm hover:from-[#003a80] hover:to-[#0053b8] transition-all">
                            Start Learning
                          </button>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* Achievements */}
            <section className="animate-fade-in-up" style={{ animationDelay: '400ms' }}>
              <div className="flex items-end justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Achievements</h2>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Your learning milestones</p>
                </div>
                <Link href="#" className="text-[#0053b8] hover:text-[#003a80] dark:text-blue-400 text-sm font-semibold transition-colors">
                  View all →
                </Link>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="rounded-2xl border border-gray-200 dark:border-gray-800 p-6 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20 text-center hover:shadow-lg transition-all">
                  <div className="text-5xl mb-3">🏅</div>
                  <div className="font-bold text-gray-900 dark:text-white">First Course</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Completed</div>
                </div>
                <div className="rounded-2xl border border-gray-200 dark:border-gray-800 p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 text-center hover:shadow-lg transition-all">
                  <div className="text-5xl mb-3">🚀</div>
                  <div className="font-bold text-gray-900 dark:text-white">7-Day Streak</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Keep it up!</div>
                </div>
                <div className="rounded-2xl border border-gray-200 dark:border-gray-800 p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 text-center hover:shadow-lg transition-all">
                  <div className="text-5xl mb-3">💯</div>
                  <div className="font-bold text-gray-900 dark:text-white">Perfect Score</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Quiz Master</div>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
