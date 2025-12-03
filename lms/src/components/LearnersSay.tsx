// src/components/LearnersSay.tsx
"use client";
import StarRating from "./StarRating";

const TESTIMONIALS = [
  {
    name: "Ayesha Khan",
    role: "Frontend Developer",
    text:
      "The courses are practical and easy to follow. I landed my first dev role after completing two tracks.",
    avatar: "A",
    rating: 5,
  },
  {
    name: "Muhammad Ali",
    role: "CS Student",
    text:
      "Instructors explain concepts really well. The progress tracking and quizzes kept me motivated!",
    avatar: "M",
    rating: 5,
  },
  {
    name: "Sara Ahmed",
    role: "UI/UX Designer",
    text:
      "Love the clean interface and bite‑sized lessons. The design courses boosted my portfolio.",
    avatar: "S",
    rating: 4,
  },
  {
    name: "Zain",
    role: "Data Analyst",
    text:
      "Great hands‑on projects. Certificates helped me showcase skills to employers.",
    avatar: "Z",
    rating: 5,
  },
];

export default function LearnersSay() {
  return (
    <section className="relative py-16 sm:py-20">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-sm font-semibold text-teal-700 dark:text-teal-400 dark:text-blue-400 uppercase tracking-wider mb-3">
            Testimonials
          </p>
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white">
            What learners say
          </h2>
          <p className="mt-3 text-gray-600 dark:text-gray-400">
            Real feedback from learners who advanced their careers using our LMS.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t, idx) => (
            <article
              key={t.name + idx}
              className="group relative rounded-2xl border bg-white/80 dark:bg-white/5 backdrop-blur p-6 shadow-sm hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-white flex items-center justify-center font-bold">
                  {t.avatar}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">{t.name}</div>
                  <div className="text-sm text-gray-500">{t.role}</div>
                </div>
              </div>
              <div className="text-gray-700 dark:text-gray-300 leading-relaxed">“{t.text}”</div>
              <div className="mt-4">
                <StarRating value={t.rating} />
              </div>
            </article>
          ))}
        </div>

        {/* CTA strip under testimonials */}
        <div className="mt-10 rounded-2xl border p-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/80 dark:bg-white/5 backdrop-blur">
          <div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">Ready to start learning?</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Join thousands of learners mastering new skills.</div>
          </div>
          <div className="flex gap-3">
            <a href="/auth/register" className="rounded-full bg-[#d62828] px-5 py-2 text-sm font-semibold text-white hover:bg-teal-700">Get Started</a>
            <a href="/courses" className="rounded-full border border-teal-600 px-5 py-2 text-sm font-semibold text-teal-700 dark:text-teal-400 hover:bg-[#d62828] hover:text-white">Browse Courses</a>
          </div>
        </div>
      </div>
    </section>
  );
}
