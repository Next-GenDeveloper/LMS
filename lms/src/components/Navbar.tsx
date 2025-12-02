// src/components/Navbar.tsx
"use client";
import Link from "next/link";

import { useEffect, useState } from "react";

import { useTheme } from "./ThemeProvider";

function UserMenu({ userName, userRole, onSignOut }: { userName: string; userRole: string; onSignOut: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={() => setOpen((v) => !v)} onMouseEnter={() => setOpen(true)} className="flex items-center gap-2 pl-4 border-l">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium">{userName}</p>
          <p className="text-xs text-gray-500">{userRole}</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-white flex items-center justify-center font-bold">
          {userName?.[0]?.toUpperCase() || 'U'}
        </div>
      </button>
      {open && (
        <div onMouseLeave={() => setOpen(false)} className="absolute right-0 mt-2 w-56 rounded-xl border bg-white dark:bg-black shadow-lg overflow-hidden">
          <a href="/dashboard/profile" className="block px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-white/10">Profile</a>
          <a href="/dashboard/Student" className="block px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-white/10">My Learning</a>
          <a href="/dashboard/Admin" className="block px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-white/10">Dashboard</a>
          <button onClick={onSignOut} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-white/10">Sign out</button>
        </div>
      )}
    </div>
  );
}


export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<'student' | 'instructor' | 'admin' | null>(null);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    if (token) {
      try {
        const { decodeJwt } = require("@/lib/auth") as typeof import("@/lib/auth");
        const payload = decodeJwt<{ email?: string; role?: "student" | "instructor" | "admin" }>(token);
        setIsLoggedIn(true);
        setUserEmail(payload?.email ?? null);
        setUserRole((payload?.role as any) ?? null);
      } catch {
        setIsLoggedIn(true);
      }
    }
  }, []);

  const userName = userEmail ? userEmail.split("@")[0] : "User";
  const { theme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
        {/* Logo + brand (keep same name) */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-inner ring-2 ring-[#0053b8]">
            📚
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-[#d62828]">
              9tangle
            </span>
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
              eLearning
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-800 md:flex">
          <Link href="/" className="hover:text-[#d62828]">
            Home
          </Link>
          <Link href="/courses" className="hover:text-[#d62828]">
            Courses
          </Link>
          <Link href="/pages" className="hover:text-[#d62828]">
            Pages
          </Link>
          <Link href="/blog" className="hover:text-[#d62828]">
            Blog
          </Link>
          <Link href="/shop" className="hover:text-[#d62828]">
            Shop
          </Link>
          {(userRole === "instructor" || userRole === "admin") && (
            <Link href="/dashboard/Admin" className="text-[#0053b8] hover:text-[#003a80]">
              Instructor Dashboard
            </Link>
          )}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          {/* Subtle indicator for current theme so we don't lose dark mode completely */}
          <span className="hidden text-[11px] uppercase tracking-[0.14em] text-slate-500 sm:inline">
            {theme === "light" ? "Light" : "Dark"}
          </span>

          {isLoggedIn ? (
            <UserMenu
              userName={userName}
              userRole={userRole ?? "guest"}
              onSignOut={() => {
                localStorage.removeItem("authToken");
                setIsLoggedIn(false);
                window.location.href = "/";
              }}
            />
          ) : (
            <>
              <Link href="/auth/login" className="hidden sm:inline-block">
                <button className="rounded-full border border-[#d62828] px-4 py-1.5 text-sm font-semibold text-[#d62828] transition-colors hover:bg-[#d62828] hover:text-white">
                  Login
                </button>
              </Link>
              <Link href="/auth/register" className="hidden sm:inline-block">
                <button className="rounded-full bg-[#d62828] px-4 py-1.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#b71f1f]">
                  Apply for Admission
                </button>
              </Link>
            </>
          )}

          {/* Mobile Menu Icon */}
          <button className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-700 md:hidden">
            ☰
          </button>
        </div>
      </div>
    </header>
  );
}