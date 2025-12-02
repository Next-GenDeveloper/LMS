"use client";
import ProgressBar from "@/components/ProgressBar";
import ProgressCircle from "@/components/ProgressCircle";
import AchievementBadge from "@/components/AchievementBadge";

const myCourses = [
  { id: 'c1', title: 'React for Beginners', progress: 25, category: 'Development' },
  { id: 'c2', title: 'TypeScript Mastery', progress: 60, category: 'Development' },
  { id: 'c3', title: 'Figma Essentials', progress: 10, category: 'Design' },
  { id: 'c4', title: 'Marketing 101', progress: 0, category: 'Marketing' },
];

export default function StudentDashboardPage() {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="grid lg:grid-cols-[240px,1fr] gap-6">
        {/* Sidebar */}
        <aside className="rounded-2xl border p-4 bg-white/80 dark:bg-white/5 backdrop-blur h-fit">
          <nav className="space-y-1 text-sm">
            <a className="block px-3 py-2 rounded-md bg-purple-600/10 text-purple-700 dark:text-purple-300" href="#">Dashboard</a>
            <a className="block px-3 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-white/10" href="/my-learning">My Learning</a>
            <a className="block px-3 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-white/10" href="/dashboard/profile">Profile</a>
            <a className="block px-3 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-white/10" href="/courses">Explore Courses</a>
          </nav>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-xl border p-3 text-center">
              <div className="text-xs text-gray-500">Completed</div>
              <div className="text-xl font-bold">3</div>
            </div>
            <div className="rounded-xl border p-3 text-center">
              <div className="text-xs text-gray-500">In Progress</div>
              <div className="text-xl font-bold">6</div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="space-y-8">
          {/* Progress overview */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border p-4 bg-white/80 dark:bg-white/5 backdrop-blur flex items-center gap-4">
              <ProgressCircle value={72} />
              <div>
                <div className="text-sm text-gray-500">Overall Progress</div>
                <div className="text-2xl font-extrabold bg-gradient-to-r from-purple-700 to-blue-600 text-transparent bg-clip-text">72%</div>
              </div>
            </div>
            <div className="rounded-2xl border p-4 bg-white/80 dark:bg-white/5 backdrop-blur">
              <div className="text-sm text-gray-500">Active streak</div>
              <div className="text-3xl font-extrabold">5 days 🔥</div>
            </div>
            <div className="rounded-2xl border p-4 bg-white/80 dark:bg-white/5 backdrop-blur">
              <div className="text-sm text-gray-500">Certificates</div>
              <div className="text-3xl font-extrabold">2 🏆</div>
            </div>
          </div>

          {/* Continue Watching */}
          <section>
            <div className="flex items-end justify-between mb-3">
              <h2 className="text-xl font-bold">Continue watching</h2>
              <a href="/my-learning" className="text-purple-700 hover:text-purple-900 text-sm">View all</a>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {myCourses.slice(0,3).map((c) => (
                <div key={c.id} className="rounded-2xl border p-4 bg-white/80 dark:bg-white/5 backdrop-blur">
                  <div className="font-medium">{c.title}</div>
                  <div className="text-xs text-gray-500">{c.category}</div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="w-3/4"><ProgressBar value={c.progress} /></div>
                    <div className="text-sm text-gray-500">{c.progress}%</div>
                  </div>
                  <a href={`/courses/${c.id}`} className="inline-flex mt-2 text-sm text-purple-700 hover:text-purple-900">Resume →</a>
                </div>
              ))}
            </div>
          </section>

          {/* My Courses */}
          <section>
            <div className="flex items-end justify-between mb-3">
              <h2 className="text-xl font-bold">My Courses</h2>
              <a href="/courses" className="text-purple-700 hover:text-purple-900 text-sm">Browse more</a>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {myCourses.map((c) => (
                <div key={c.id} className="group rounded-2xl border overflow-hidden bg-white/80 dark:bg-white/5 backdrop-blur hover:shadow">
                  <div className="h-28 w-full bg-gray-200" />
                  <div className="p-4 space-y-1">
                    <div className="font-medium">{c.title}</div>
                    <div className="text-xs text-gray-500">{c.category}</div>
                    <div className="pt-1"><ProgressBar value={c.progress} /></div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Achievements */}
          <section>
            <div className="flex items-end justify-between mb-3">
              <h2 className="text-xl font-bold">Achievements</h2>
              <a href="#" className="text-purple-700 hover:text-purple-900 text-sm">View all</a>
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              <AchievementBadge icon="🏅" label="First Course Completed" />
              <AchievementBadge icon="🚀" label="7-Day Streak" />
              <AchievementBadge icon="💯" label="100% on a Quiz" />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
