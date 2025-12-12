"use client";
import { useEffect, useMemo, useState } from "react";
import CourseCard, { Course } from "@/components/CourseCard";
import { getCourses, type ApiCourse } from "@/actions/getCourses";
import Image from "next/image";
import Link from "next/link";

type SortKey = "newest" | "price-asc" | "price-desc" | "title";

export default function CoursesPage() {
  const [courses, setCourses] = useState<ApiCourse[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [sort, setSort] = useState<SortKey>("newest");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const list = await getCourses();
        if (mounted) setCourses(list);
      } catch (e: any) {
        console.error(e);
        if (mounted) setError(e?.message || "Failed to load courses");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(() => {
    const items = courses || [];
    const ql = q.trim().toLowerCase();
    const base = items.filter((c) => {
      const matchQ = !ql || c.title.toLowerCase().includes(ql) || c.description.toLowerCase().includes(ql);
      const matchCat = category === "all" || c.category === category;
      return matchQ && matchCat && (c.isPublished ?? true);
    });
    const sorted = [...base].sort((a, b) => {
      if (sort === "newest") return +new Date(b.createdAt) - +new Date(a.createdAt);
      if (sort === "price-asc") return (a.price ?? 0) - (b.price ?? 0);
      if (sort === "price-desc") return (b.price ?? 0) - (a.price ?? 0);
      if (sort === "title") return a.title.localeCompare(b.title);
      return 0;
    });
    return sorted;
  }, [courses, q, category, sort]);

  const categories = useMemo(() => {
    const unique = new Set<string>();
    (courses || []).forEach((c) => unique.add(c.category || "General"));
    return ["all", ...Array.from(unique)];
  }, [courses]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50">
      {/* Hero Section with Banner */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 pt-16 pb-12">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="max-w-2xl">
              <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1 text-sm font-semibold uppercase tracking-[0.18em] text-orange-500 backdrop-blur-sm">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 text-xs text-white">
                  9T
                </span>
                Explore Our Courses
              </p>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-slate-900 animate-fade-in-up">
                <span className="relative inline-block text-orange-500">
                  Learn & Grow
                  <span className="absolute left-0 -bottom-2 h-1.5 w-full rounded-full bg-orange-400" />
                </span>
              </h1>
              <p className="text-lg md:text-xl text-slate-700 mb-8 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                Discover our comprehensive courses designed to help you master new skills and advance your career. From beginner to advanced levels, we have something for everyone.
              </p>
              <div className="flex flex-wrap gap-4 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                <Link 
                  href="/courses"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold hover:from-orange-600 hover:to-pink-600 transition shadow-lg"
                >
                  Browse All Courses
                </Link>
                <Link 
                  href="/my-learning"
                  className="px-6 py-3 rounded-xl border-2 border-orange-200 text-orange-600 font-semibold hover:bg-orange-50 transition"
                >
                  My Learning
                </Link>
              </div>
            </div>
            <div className="relative h-64 lg:h-96 rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/next.svg"
                alt="Online Learning"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-pink-500/20" />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-16">
        {/* Search and Filter Section */}
        <div className="mb-12 animate-fade-in-up">
          <div className="bg-white/95 rounded-3xl border border-orange-100 p-6 shadow-lg backdrop-blur-sm">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">Find Your Perfect Course</h2>
                <p className="text-slate-500">Search, filter, and sort to discover the ideal learning experience.</p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative mb-6">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search courses by title or description..."
                className="w-full h-14 pl-12 pr-4 rounded-xl border-2 border-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 bg-white text-slate-900 transition-all"
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">Category</label>
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)} 
                  className="w-full h-12 rounded-xl border-2 border-orange-100 px-4 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 bg-white text-slate-900 transition-all"
                >
                  {categories.map((c) => (
                    <option key={c} value={c} className="capitalize">{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">Sort By</label>
                <select 
                  value={sort} 
                  onChange={(e) => setSort(e.target.value as SortKey)} 
                  className="w-full h-12 rounded-xl border-2 border-orange-100 px-4 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 bg-white text-slate-900 transition-all"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="title">Title A-Z</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">Price Range</label>
                <select 
                  className="w-full h-12 rounded-xl border-2 border-orange-100 px-4 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 bg-white text-slate-900 transition-all"
                  disabled
                >
                  <option>All Prices</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">Level</label>
                <select 
                  className="w-full h-12 rounded-xl border-2 border-orange-100 px-4 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 bg-white text-slate-900 transition-all"
                  disabled
                >
                  <option>All Levels</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Category chips */}
        <div className="mb-12 flex flex-wrap gap-3 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          {categories.filter(c => c !== 'all').map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold border-2 transition-all ${
                category === c 
                  ? 'bg-gradient-to-r from-orange-500 to-amber-400 text-white border-orange-400 shadow-lg transform scale-105' 
                  : 'bg-white/90 text-slate-700 border-orange-100 hover:border-orange-400 hover:text-orange-500'
              }`}
            >
              {c}
            </button>
          ))}
          {categories.length > 1 && (
            <button 
              onClick={() => setCategory('all')} 
              className={`px-5 py-2.5 rounded-full text-sm font-semibold border-2 transition-all ${
                category === 'all' 
                  ? 'bg-gradient-to-r from-orange-500 to-amber-400 text-white border-orange-400 shadow-lg transform scale-105' 
                  : 'bg-white/90 text-slate-700 border-orange-100 hover:border-orange-400 hover:text-orange-500'
              }`}
            >
              All Categories
            </button>
          )}
        </div>

        {/* Featured Courses Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Featured Courses</h2>
              <p className="text-slate-600">Handpicked courses for your learning journey</p>
            </div>
            <Link href="/courses" className="text-orange-500 font-semibold hover:text-orange-600 transition">
              View All →
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {loading && (
              <>
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="animate-pulse rounded-3xl border border-orange-100 overflow-hidden bg-white/90">
                    <div className="h-48 bg-gradient-to-br from-orange-100 to-amber-100" />
                    <div className="p-5 space-y-3">
                      <div className="h-5 bg-orange-100 rounded w-2/3" />
                      <div className="h-4 bg-orange-50 rounded w-full" />
                      <div className="h-4 bg-orange-50 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </>
            )}

            {error && !loading && (
              <div className="col-span-full py-12 animate-fade-in-up">
                <div className="rounded-3xl border-2 border-red-200 bg-red-50 p-6 text-center">
                  <div className="text-red-600 font-semibold text-lg mb-2">Oops! Something went wrong</div>
                  <div className="text-red-600">{error}</div>
                </div>
              </div>
            )}

            {!loading && !error && (
              <>
                {filtered.length > 0 ? (
                  <div className="mb-4 text-sm text-slate-600">
                    Showing <span className="font-semibold text-orange-500">{filtered.length}</span> course{filtered.length !== 1 ? 's' : ''}
                  </div>
                ) : null}
                {filtered.slice(0, 4).map((c, idx) => (
                  <div key={c.id} className="animate-fade-in-up" style={{ animationDelay: `${idx * 50}ms` }}>
                    <CourseCard course={{
                      id: c.id, 
                      title: c.title, 
                      description: c.description, 
                      price: c.price,
                      thumbnail: c.thumbnail,
                      bannerImage: c.bannerImage,
                      level: c.level,
                      rating: c.rating,
                      reviews: c.reviews,
                      enrollmentCount: c.enrollmentCount
                    }} />
                  </div>
                ))}
              </>
            )}
          </div>
        </section>

        {/* All Courses Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">All Available Courses</h2>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {!loading && !error && filtered.length > 4 && (
              <>
                {filtered.slice(4).map((c, idx) => (
                  <div key={c.id} className="animate-fade-in-up" style={{ animationDelay: `${idx * 50}ms` }}>
                    <CourseCard course={{
                      id: c.id, 
                      title: c.title, 
                      description: c.description, 
                      price: c.price,
                      thumbnail: c.thumbnail,
                      bannerImage: c.bannerImage,
                      level: c.level,
                      rating: c.rating,
                      reviews: c.reviews,
                      enrollmentCount: c.enrollmentCount
                    }} />
                  </div>
                ))}
              </>
            )}
          </div>

          {filtered.length === 0 && !loading && (
            <div className="col-span-full py-20 text-center animate-fade-in-up">
              <div className="text-6xl mb-4">🔍</div>
              <div className="text-2xl font-bold text-slate-900 mb-2">No courses found</div>
              <div className="text-slate-600 mb-6">Try adjusting your search or filters</div>
              <button
                onClick={() => {
                  setQ('');
                  setCategory('all');
                  setSort('newest');
                }}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-400 text-white font-semibold hover:from-orange-600 hover:to-orange-500 transition-all"
              >
                Clear filters
              </button>
            </div>
          )}
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-3xl p-8 md:p-12 text-white text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">Join thousands of students who are already advancing their careers with our courses.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link 
              href="/auth/register"
              className="px-8 py-3 rounded-xl bg-white text-orange-500 font-bold hover:bg-orange-50 transition shadow-lg"
            >
              Get Started Free
            </Link>
            <Link 
              href="/courses"
              className="px-8 py-3 rounded-xl border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition"
            >
              Browse Courses
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
