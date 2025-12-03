// src/app/page.tsx
import Link from "next/link";

import StarRating from "@/components/StarRating";
import LearnersSay from "@/components/LearnersSay";
import FeaturedCourses from "@/components/FeaturedCourses";

export default function Home() {
  return (
    <>
      {/* Hero - E‑learning inspired */}
      <section className="relative overflow-hidden bg-[#0053b8]">
        <div className="absolute inset-0">
          <div className="h-full w-full bg-[radial-gradient(circle_at_top_left,#2f7be5,transparent_55%),radial-gradient(circle_at_bottom_right,#003a80,transparent_60%)]" />
        </div>
        <div className="relative mx-auto flex max-w-6xl flex-col items-center justify-between gap-10 px-6 py-20 md:flex-row md:py-24">
          {/* Left content */}
          <div className="max-w-xl text-white">
            <p className="mb-4 inline-block rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
              Online education platform
            </p>
            <h1 className="mb-6 text-4xl font-extrabold leading-tight md:text-5xl lg:text-6xl">
              Empowering Knowledge. Shaping the Future.
            </h1>
            <p className="mb-8 text-base text-blue-100 md:text-lg">
              Advance your learning journey through accredited online programs designed by leading
              educators. Learn anywhere. Achieve more.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/auth/register"
                className="rounded-full bg-teal-600 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-black/20 transition hover:bg-teal-700"
              >
                Apply for Admission
              </Link>
              <Link
                href="/courses"
                className="rounded-full border border-white/70 px-7 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-teal-700"
              >
                Explore Programs
              </Link>
            </div>
          </div>

          {/* Right visual panel */}
          <div className="relative flex w-full max-w-md items-center justify-center md:max-w-lg">
            <div className="relative w-full overflow-hidden rounded-3xl bg-[#00408f]/70 p-6 shadow-2xl shadow-black/40 backdrop-blur">
              <div className="mb-4 flex items-center justify-between text-sm text-blue-100">
                <span className="font-semibold">Top Rated Course</span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs">4.9 / 5.0</span>
              </div>
              <div className="mb-6 h-40 rounded-2xl bg-gradient-to-br from-[#2f7be5] via-[#4e9fff] to-[#f1f5ff]" />
              <div className="space-y-2 text-blue-50">
                <h3 className="text-lg font-semibold">Full‑Stack Web Development</h3>
                <p className="text-xs text-blue-100">
                  Learn by doing with hands‑on projects, quizzes and downloadable resources.
                </p>
              </div>
              <div className="mt-5 flex items-center justify-between text-xs text-blue-100">
                <span>10k+ enrolled</span>
                <span>Certificate on completion</span>
              </div>
            </div>
          </div>
        </div>
      </section>

     {/* Feature highlights */}
     <section className="relative -mt-10 md:-mt-12">
       <div className="container mx-auto px-6">
         <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
           {[
             { icon: '🎯', title: 'Career‑ready tracks', desc: 'Curated, outcome‑oriented learning paths' },
             { icon: '🧑‍🏫', title: 'Expert instructors', desc: 'Learn from industry professionals' },
             { icon: '🧩', title: 'Hands‑on projects', desc: 'Build real‑world portfolios' },
             { icon: '📜', title: 'Certificates', desc: 'Share achievements and stand out' },
           ].map((f, i) => (
             <div
               key={f.title}
               className="group rounded-2xl border bg-white/80 dark:bg-white/5 backdrop-blur p-5 hover:shadow-lg transition-all animate-fade-in-up"
               style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'both' }}
             >
               <div className="flex items-start gap-4">
                 <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-teal-600 to-cyan-500 text-white text-xl shadow-md">
                   {f.icon}
                 </div>
                 <div>
                   <h3 className="font-semibold text-slate-900 dark:text-white">{f.title}</h3>
                   <p className="text-sm text-slate-600 dark:text-slate-400">{f.desc}</p>
                 </div>
               </div>
             </div>
           ))}
         </div>
       </div>
     </section>

     {/* Trusted by marquee */}
     <section className="py-12">
       <div className="container mx-auto px-6">
         <div className="text-center mb-6">
           <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Trusted by teams & learners</div>
         </div>
         <div className="marquee rounded-2xl border bg-white/60 dark:bg-white/5 backdrop-blur py-4">
           <div className="marquee-content gap-10 text-slate-500 dark:text-slate-400">
             {['Figma','Google','Shopify','Meta','Microsoft','Stripe','Amazon','Adobe','Netflix','Airbnb'].map((b) => (
               <span key={b} className="inline-flex items-center gap-2 text-sm font-medium">
                 <span className="text-lg">⭐</span> {b}
               </span>
             ))}
             {['Figma','Google','Shopify','Meta','Microsoft','Stripe','Amazon','Adobe','Netflix','Airbnb'].map((b) => (
               <span key={`${b}-dup`} className="inline-flex items-center gap-2 text-sm font-medium">
                 <span className="text-lg">⭐</span> {b}
               </span>
             ))}
           </div>
         </div>
       </div>
     </section>

     {/* Featured Courses */}
     <FeaturedCourses />

      {/* Popular Categories */}
      <section className="relative py-20 bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-950 dark:to-gray-900 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-[#0053b8] dark:text-blue-400 uppercase tracking-wider mb-3">
              Browse by Category
            </p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
              Popular Categories
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Explore thousands of courses across different fields and find your perfect learning path
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            {[
              { 
                name: 'Development', 
                icon: '💻', 
                gradient: 'from-blue-500 to-cyan-500',
                bgGradient: 'from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30',
                courses: '2,450',
                color: 'text-blue-600 dark:text-blue-400'
              },
              { 
                name: 'Design', 
                icon: '🎨', 
                gradient: 'from-pink-500 to-rose-500',
                bgGradient: 'from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30',
                courses: '1,820',
                color: 'text-pink-600 dark:text-pink-400'
              },
              { 
                name: 'Marketing', 
                icon: '📣', 
                gradient: 'from-purple-500 to-indigo-500',
                bgGradient: 'from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30',
                courses: '1,340',
                color: 'text-purple-600 dark:text-purple-400'
              },
              { 
                name: 'Data Science', 
                icon: '📊', 
                gradient: 'from-green-500 to-emerald-500',
                bgGradient: 'from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30',
                courses: '980',
                color: 'text-green-600 dark:text-green-400'
              },
              { 
                name: 'Business', 
                icon: '🏢', 
                gradient: 'from-orange-500 to-amber-500',
                bgGradient: 'from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30',
                courses: '1,650',
                color: 'text-orange-600 dark:text-orange-400'
              },
              { 
                name: 'AI & ML', 
                icon: '🤖', 
                gradient: 'from-violet-500 to-purple-500',
                bgGradient: 'from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30',
                courses: '890',
                color: 'text-violet-600 dark:text-violet-400'
              },
            ].map((category, index) => (
              <div
                key={category.name}
                className="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 cursor-pointer overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-fade-in-up"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: 'both'
                }}
              >
                {/* Background Gradient on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${category.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                {/* Icon Container */}
                <div className="relative z-10 mb-4">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${category.gradient} shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                    <span className="text-3xl">{category.icon}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <h3 className={`text-lg font-bold text-gray-900 dark:text-white mb-2 ${category.color} group-hover:scale-105 transition-all duration-300`}>
                    {category.name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-semibold">{category.courses}</span>
                    <span>courses</span>
                  </div>
                </div>

                {/* Hover Arrow */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${category.gradient} flex items-center justify-center shadow-lg`}>
                    <span className="text-white text-sm">→</span>
                  </div>
                </div>

                {/* Shine Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </div>

                {/* Border Glow on Hover */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 -z-10`} />
              </div>
            ))}
          </div>

          {/* View All Button */}
          <div className="text-center mt-12">
            <Link
              href="/courses"
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#0053b8] text-white font-semibold hover:bg-[#003a80] transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <span>Explore All Categories</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <LearnersSay />

      {/* Stats */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid sm:grid-cols-3 gap-6 rounded-2xl border p-6 bg-white/80 dark:bg-white/5 backdrop-blur text-center">
            <div>
              <div className="text-4xl font-extrabold bg-gradient-to-r from-purple-700 to-blue-600 text-transparent bg-clip-text">50k+</div>
              <div className="text-sm text-gray-500">Active learners</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold bg-gradient-to-r from-purple-700 to-blue-600 text-transparent bg-clip-text">5k+</div>
              <div className="text-sm text-gray-500">Courses</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold bg-gradient-to-r from-purple-700 to-blue-600 text-transparent bg-clip-text">1k+</div>
              <div className="text-sm text-gray-500">Expert instructors</div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="flex items-end justify-between mb-6">
            <h2 className="text-3xl md:text-4xl font-bold">Latest from blog</h2>
            <Link href="#" className="text-purple-700 hover:text-purple-900">View all</Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1,2,3].map((i) => (
              <div key={i} className="rounded-2xl border overflow-hidden bg-white/80 dark:bg-white/5 backdrop-blur hover:shadow">
                <div className="h-40 bg-gray-200" />
                <div className="p-4">
                  <div className="text-sm text-gray-500">Category</div>
                  <h3 className="font-semibold text-lg">How to stay productive while learning</h3>
                  <div className="text-sm text-gray-500 mt-1">5 min read</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </>
  );
}