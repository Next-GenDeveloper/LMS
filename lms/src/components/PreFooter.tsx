// src/components/PreFooter.tsx
"use client";
import Link from "next/link";

export default function PreFooter() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-teal-600/10 via-transparent to-cyan-500/10 pointer-events-none" />
      <div className="container mx-auto px-4 lg:px-8 py-12 sm:py-16 grid grid-cols-1 lg:grid-cols-2 items-center gap-8">
        <div className="space-y-3">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Level up your learning with 9tangle
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-prose">
            Join thousands of learners and instructors using our modern LMS. Build skills, track progress, and achieve your goals.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 justify-start lg:justify-end">
          <Link href="/auth/register" className="rounded-full bg-[#d62828] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-teal-700">
            Get Started
          </Link>
          <Link href="/courses" className="rounded-full border border-teal-600 px-5 py-2.5 text-sm font-semibold text-teal-700 dark:text-teal-400 transition-colors hover:bg-[#d62828] hover:text-white">
            Browse Courses
          </Link>
        </div>
      </div>
    </section>
  );
}
