import Link from "next/link";
import StarRating from "@/components/StarRating";
import Accordion from "@/components/Accordion";

export default function CourseDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;

  // Demo data; replace with live data via server fetch
  const course = {
    id,
    title: "Complete React Mastery",
    instructor: { name: "Alex Morgan", bio: "Senior Software Engineer and Instructor with 10+ years of experience." },
    rating: 4.8,
    reviews: 1240,
    students: 15234,
    price: 49,
    thumbnail: "/globe.svg",
    curriculum: [
      { title: "Introduction to React", content: "What is React? Components, JSX, and the Virtual DOM." },
      { title: "Hooks Deep Dive", content: "useState, useEffect, useMemo, custom hooks, and patterns." },
      { title: "State Management", content: "Context API, Redux Toolkit basics, and best practices." },
      { title: "Routing & Data Fetching", content: "Next.js routing, server components, and caching." },
    ],
    related: [
      { id: "c2", title: "TypeScript Mastery", price: 39 },
      { id: "c3", title: "Next.js Essentials", price: 29 },
      { id: "c4", title: "Node.js APIs", price: 59 },
    ],
  };

  return (
    <div>
      {/* Course Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#EEF3FF] via-[#F6F2FF] to-[#EEF8FF] dark:from-[#0B0B12] dark:via-[#0E0E1A] dark:to-[#0B0B12]" />
        <div className="container mx-auto px-6 pt-16 pb-12 relative">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="aspect-video w-full rounded-xl border bg-gray-200 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold">{course.title}</h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                <span>Instructor: <span className="font-medium">{course.instructor.name}</span></span>
                <span>•</span>
                <span className="flex items-center gap-2"><StarRating value={5} /> ({course.reviews})</span>
                <span>•</span>
                <span>{course.students.toLocaleString()} students</span>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="rounded-2xl border p-5 bg-white/80 dark:bg-white/5 backdrop-blur h-fit">
              <div className="text-3xl font-extrabold text-purple-700 dark:text-purple-300 mb-3">${course.price}</div>
              <button
                className="w-full h-12 rounded-md bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold"
                onClick={async () => {
                  const { isLoggedIn } = await import('@/lib/auth');
                  if (!isLoggedIn()) {
                    window.location.href = '/auth/login?next=' + encodeURIComponent(`/courses/${course.id}`);
                    return;
                  }
                  alert('Purchase flow will go here (requires backend). After payment, you will be enrolled.');
                }}
              >
                Buy this course
              </button>
              <div className="mt-3 text-xs text-gray-500">30-day money-back guarantee</div>
              <div className="mt-6 space-y-2 text-sm">
                <div>Lifetime access</div>
                <div>Certificate of completion</div>
                <div>Full-time instructor support</div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Curriculum */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold mb-4">Curriculum</h2>
          <Accordion items={course.curriculum} />
        </div>
      </section>

      {/* Instructor Bio */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold mb-4">Instructor</h2>
          <div className="rounded-2xl border p-5 bg-white/80 dark:bg-white/5 backdrop-blur">
            <div className="font-semibold">{course.instructor.name}</div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 max-w-3xl">{course.instructor.bio}</p>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold mb-4">Reviews</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {[1,2,3,4].map((i) => (
              <div key={i} className="rounded-xl border p-4 bg-white/80 dark:bg-white/5 backdrop-blur">
                <div className="flex items-center gap-2 text-sm"><StarRating value={5} /><span className="text-gray-600 dark:text-gray-400">by Student {i}</span></div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">Great content and well explained. Highly recommend this course!</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Courses */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="flex items-end justify-between mb-4">
            <h2 className="text-2xl font-bold">Related courses</h2>
            <Link href="/courses" className="text-purple-700 hover:text-purple-900 text-sm">View all</Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {course.related.map((r) => (
              <div key={r.id} className="rounded-xl border p-4 bg-white/80 dark:bg-white/5 backdrop-blur">
                <div className="h-32 w-full bg-gray-200 rounded-md mb-3" />
                <div className="font-medium">{r.title}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">${r.price}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
