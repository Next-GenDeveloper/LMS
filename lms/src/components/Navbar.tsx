"use client";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { useTheme } from "./ThemeProvider";

function CoursesDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        onMouseEnter={() => setOpen(true)}
        className="inline-flex items-center gap-1 text-gray-700 dark:text-slate-200 hover:text-[#0053b8] dark:hover:text-white focus:outline-none transition-colors font-medium"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        Courses
        <svg className={`h-4 w-4 transition-transform ${open ? "rotate-180" : "rotate-0"}`} viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
        </svg>
      </button>
      {open && (
        <div onMouseLeave={() => setOpen(false)} className="absolute left-1/2 -translate-x-1/2 mt-3 w-56 rounded-xl border border-gray-200 dark:border-slate-800/60 bg-white dark:bg-slate-900/95 backdrop-blur shadow-lg p-1 animate-scale-in z-50">
          <Link href="/courses" className="block px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">All Courses</Link>
          <Link href="/my-learning" className="block px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">My Learning</Link>
          <Link href="/dashboard" className="block px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">Dashboard</Link>
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { theme, toggle } = useTheme();

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    if (token) {
      try {
        const { decodeJwt } = require("@/lib/auth") as typeof import("@/lib/auth");
        const payload = decodeJwt<{ email?: string }>(token);
        setIsLoggedIn(true);
        setUserEmail(payload?.email ?? null);
      } catch {
        setIsLoggedIn(true);
      }
    }
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-slate-950/80 transition-colors">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
        {/* Left: Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#0053b8] to-[#003a80] dark:from-slate-900 dark:to-slate-800 ring-1 ring-gray-200 dark:ring-white/10 shadow-inner">
            <span className="text-xl">📚</span>
          </div>
          <span className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-white group-hover:opacity-90 transition-opacity">9tangle</span>
        </Link>

        {/* Center: Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm">
          <Link href="/" className="text-gray-700 dark:text-slate-200 hover:text-[#0053b8] dark:hover:text-white transition-colors font-medium">Home</Link>
          <CoursesDropdown />
          <Link href="/dashboard" className="text-gray-700 dark:text-slate-200 hover:text-[#0053b8] dark:hover:text-white transition-colors font-medium">Dashboard</Link>
          <Link href="/courses" className="text-gray-700 dark:text-slate-200 hover:text-[#0053b8] dark:hover:text-white transition-colors font-medium">Courses</Link>
          <Link href="/my-learning" className="text-gray-700 dark:text-slate-200 hover:text-[#0053b8] dark:hover:text-white transition-colors font-medium">My Learning</Link>
        </nav>

        {/* Right: Search + Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggle}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            className="relative w-12 h-6 rounded-full bg-gray-300 dark:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#0053b8] focus:ring-offset-2"
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-300 flex items-center justify-center ${
                theme === 'dark' ? 'translate-x-6' : 'translate-x-0'
              }`}
            >
              {theme === 'light' ? (
                <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-3 h-3 text-gray-800" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </span>
          </button>

          {/* Search */}
          <form
            action={`/search?q=${encodeURIComponent(query)}`}
            onSubmit={(e) => {
              if (!query.trim()) e.preventDefault();
            }}
            className="hidden lg:flex items-center gap-2 rounded-full bg-slate-900/80 dark:bg-gray-800 ring-1 ring-white/10 dark:ring-gray-700 px-3 py-1.5 text-slate-200 dark:text-gray-300 focus-within:ring-white/20 dark:focus-within:ring-gray-600 transition"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 opacity-70">
              <path d="M21 21l-4.35-4.35" />
              <circle cx="10" cy="10" r="6" />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search courses"
              className="bg-transparent outline-none placeholder:text-slate-400 dark:placeholder:text-gray-500 text-sm w-48"
            />
          </form>

          {/* Login + Profile */}
          <Link href="/auth/login">
            <button className="rounded-full border border-white/20 dark:border-gray-700 px-4 py-1.5 text-sm font-semibold text-slate-100 dark:text-gray-300 hover:bg-white/5 dark:hover:bg-gray-800 transition-colors">
              Sign In
            </button>
          </Link>
          {isLoggedIn && (
            <Link href="/dashboard/profile">
              <button className="rounded-full bg-white/90 dark:bg-gray-800 px-4 py-1.5 text-sm font-semibold text-slate-900 dark:text-white hover:bg-white dark:hover:bg-gray-700 transition-colors">
                Profile
              </button>
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-slate-900 text-slate-200 ring-1 ring-white/10 md:hidden"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-[84%] max-w-xs bg-slate-950 border-l border-slate-800 shadow-xl p-4 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-full bg-slate-900 ring-1 ring-white/10 flex items-center justify-center">📚</div>
                <div className="font-bold text-white">LMS</div>
              </div>
              <button
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
                className="h-9 w-9 inline-flex items-center justify-center rounded-full ring-1 ring-white/10 text-slate-200"
              >
                ✕
              </button>
            </div>

            <form
              action={`/search?q=${encodeURIComponent(query)}`}
              onSubmit={(e) => {
                if (!query.trim()) e.preventDefault();
              }}
              className="flex items-center gap-2 rounded-full bg-slate-900 ring-1 ring-white/10 px-3 py-1.5 text-slate-200 mb-3"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 opacity-70">
                <path d="M21 21l-4.35-4.35" />
                <circle cx="10" cy="10" r="6" />
              </svg>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search courses"
                className="bg-transparent outline-none placeholder:text-slate-400 text-sm w-full"
              />
            </form>

            <nav className="flex flex-col gap-2 text-sm font-medium">
              <Link href="/" className="px-3 py-2 rounded-md text-slate-200 hover:bg-white/5" onClick={() => setMobileOpen(false)}>Home</Link>
              <Link href="/courses" className="px-3 py-2 rounded-md text-slate-200 hover:bg-white/5" onClick={() => setMobileOpen(false)}>Courses</Link>
              <Link href="/dashboard" className="px-3 py-2 rounded-md text-slate-200 hover:bg-white/5" onClick={() => setMobileOpen(false)}>Dashboard</Link>
              <Link href="/assignments" className="px-3 py-2 rounded-md text-slate-200 hover:bg-white/5" onClick={() => setMobileOpen(false)}>Assignments</Link>
              <Link href="/forum" className="px-3 py-2 rounded-md text-slate-200 hover:bg-white/5" onClick={() => setMobileOpen(false)}>Forum</Link>
              <Link href="/contact" className="px-3 py-2 rounded-md text-slate-200 hover:bg-white/5" onClick={() => setMobileOpen(false)}>Contact</Link>
            </nav>

            <div className="mt-auto pt-4 border-t border-slate-800 dark:border-gray-700">
              {/* Theme Toggle in Mobile */}
              <div className="flex items-center justify-between mb-4 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Theme</span>
                <button
                  onClick={toggle}
                  aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                  className="relative w-12 h-6 rounded-full bg-gray-300 dark:bg-gray-700 transition-colors duration-300"
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-300 flex items-center justify-center ${
                      theme === 'dark' ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  >
                    {theme === 'light' ? (
                      <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-3 h-3 text-gray-800" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                      </svg>
                    )}
                  </span>
                </button>
              </div>
              <div className="flex gap-2">
                <Link href="/auth/login" className="flex-1" onClick={() => setMobileOpen(false)}>
                  <button className="w-full rounded-full ring-1 ring-white/20 dark:ring-gray-700 px-4 py-2 text-sm font-semibold text-slate-100 dark:text-gray-300 hover:bg-white/5 dark:hover:bg-gray-800 transition-colors">
                    Sign In
                  </button>
                </Link>
                {isLoggedIn && (
                  <Link href="/dashboard/profile" className="flex-1" onClick={() => setMobileOpen(false)}>
                    <button className="w-full rounded-full bg-white/90 dark:bg-gray-800 px-4 py-2 text-sm font-semibold text-slate-900 dark:text-white hover:bg-white dark:hover:bg-gray-700 transition-colors">
                      Profile
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
