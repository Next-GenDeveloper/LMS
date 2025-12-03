"use client";
import { useEffect, useMemo, useState } from "react";
import CourseCard, { Course } from "@/components/CourseCard";
import { getCourses, type ApiCourse } from "@/actions/getCourses";

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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#0053b8] via-[#003a80] to-[#002855] text-white overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 py-16 md:py-20 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 animate-fade-in-up">
              Explore Our Courses
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              Learn in-demand skills from industry experts. Track your progress, earn certificates, and level up your career.
            </p>
            <div className="flex flex-wrap gap-3 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <span className="rounded-full bg-white/20 backdrop-blur px-4 py-2 text-sm font-semibold border border-white/30">Top Instructors</span>
              <span className="rounded-full bg-white/20 backdrop-blur px-4 py-2 text-sm font-semibold border border-white/30">Certificates</span>
              <span className="rounded-full bg-white/20 backdrop-blur px-4 py-2 text-sm font-semibold border border-white/30">Lifetime Access</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-10 md:py-12">
        {/* Search and Filter Section */}
        <div className="mb-8 animate-fade-in-up">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-lg">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">Browse Catalog</h2>
                <p className="text-gray-600 dark:text-gray-400">Search, filter, and sort to find the perfect course</p>
              </div>
            </div>
            
            {/* Search Bar */}
            <div className="relative mb-6">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search courses by title or description..."
                className="w-full h-14 pl-12 pr-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0053b8] focus:border-[#0053b8] dark:bg-gray-800 dark:text-white transition-all"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Category</label>
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)} 
                  className="w-full h-12 rounded-xl border-2 border-gray-200 dark:border-gray-700 px-4 focus:outline-none focus:ring-2 focus:ring-[#0053b8] focus:border-[#0053b8] dark:bg-gray-800 dark:text-white transition-all"
                >
                  {categories.map((c) => (
                    <option key={c} value={c} className="capitalize">{c}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Sort By</label>
                <select 
                  value={sort} 
                  onChange={(e) => setSort(e.target.value as SortKey)} 
                  className="w-full h-12 rounded-xl border-2 border-gray-200 dark:border-gray-700 px-4 focus:outline-none focus:ring-2 focus:ring-[#0053b8] focus:border-[#0053b8] dark:bg-gray-800 dark:text-white transition-all"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="title">Title A-Z</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Category chips */}
        <div className="mb-8 flex flex-wrap gap-3 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          {categories.filter(c => c !== 'all').map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold border-2 transition-all ${
                category === c 
                  ? 'bg-gradient-to-r from-[#0053b8] to-[#003a80] text-white border-[#0053b8] shadow-lg transform scale-105' 
                  : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-[#0053b8] dark:hover:border-blue-500 hover:text-[#0053b8] dark:hover:text-blue-400'
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
                  ? 'bg-gradient-to-r from-[#0053b8] to-[#003a80] text-white border-[#0053b8] shadow-lg transform scale-105' 
                  : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-[#0053b8] dark:hover:border-blue-500 hover:text-[#0053b8] dark:hover:text-blue-400'
              }`}
            >
              All Categories
            </button>
          )}
        </div>

        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-900">
                <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-2/3" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}
        
        {error && !loading && (
          <div className="py-12 animate-fade-in-up">
            <div className="rounded-2xl border-2 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-6 text-center">
              <div className="text-red-600 dark:text-red-400 font-semibold text-lg mb-2">Oops! Something went wrong</div>
              <div className="text-red-600 dark:text-red-400">{error}</div>
            </div>
          </div>
        )}

        {!loading && !error && (
          <>
            {filtered.length > 0 ? (
              <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                Showing <span className="font-semibold text-[#0053b8] dark:text-blue-400">{filtered.length}</span> course{filtered.length !== 1 ? 's' : ''}
              </div>
            ) : null}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((c, idx) => (
                <div key={c.id} className="animate-fade-in-up" style={{ animationDelay: `${idx * 50}ms` }}>
                  <CourseCard course={{ id: c.id, title: c.title, description: c.description, price: c.price, thumbnail: c.thumbnail }} />
                </div>
              ))}
            </div>
            {filtered.length === 0 && (
              <div className="col-span-full py-20 text-center animate-fade-in-up">
                <div className="text-6xl mb-4">🔍</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No courses found</div>
                <div className="text-gray-600 dark:text-gray-400 mb-6">Try adjusting your search or filters</div>
                <button
                  onClick={() => {
                    setQ('');
                    setCategory('all');
                    setSort('newest');
                  }}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#0053b8] to-[#003a80] text-white font-semibold hover:from-[#003a80] hover:to-[#0053b8] transition-all"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
