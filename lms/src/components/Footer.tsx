// src/components/Footer.tsx
"use client";
import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t bg-white/70 dark:bg-black/60 backdrop-blur supports-[backdrop-filter]:bg-white/50">
      <div className="container mx-auto px-4 lg:px-8 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-inner ring-2 ring-teal-600">📚</div>
            <div className="text-xl font-extrabold tracking-tight text-[#d62828]">9tangle</div>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Modern LMS built for instructors and students. Learn, teach, and grow with a delightful experience.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-white mb-3">Platform</h3>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
            <li><Link className="hover:text-[#d62828]" href="/courses">Courses</Link></li>
            <li><Link className="hover:text-[#d62828]" href="/dashboard/Student">My Learning</Link></li>
            <li><Link className="hover:text-[#d62828]" href="/dashboard/Admin">Instructor</Link></li>
            <li><Link className="hover:text-[#d62828]" href="/blog">Blog</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-white mb-3">Company</h3>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
            <li><Link className="hover:text-[#d62828]" href="/about">About</Link></li>
            <li><Link className="hover:text-[#d62828]" href="/contact">Contact</Link></li>
            <li><Link className="hover:text-[#d62828]" href="/careers">Careers</Link></li>
            <li><Link className="hover:text-[#d62828]" href="/privacy">Privacy</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-white mb-3">Newsletter</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">Join our newsletter to get course updates.</p>
          <form className="flex gap-2">
            <input type="email" placeholder="Your email" className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700" />
            <button type="button" className="whitespace-nowrap rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white hover:bg-teal-700">Subscribe</button>
          </form>
        </div>
      </div>
      <div className="border-t py-4 text-center text-xs text-slate-500 dark:text-slate-400">
        © {year} 9tangle LMS. All rights reserved.
      </div>
    </footer>
  );
}
