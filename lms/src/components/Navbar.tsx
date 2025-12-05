"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // Check auth status on mount
    const token = localStorage.getItem("authToken");
    const profile = localStorage.getItem("userProfile");
    if (token) {
      setIsLoggedIn(true);
      if (profile) {
        try {
          const p = JSON.parse(profile);
          setUserName(p.firstName || "User");
        } catch {
          setUserName("User");
        }
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userProfile");
    setIsLoggedIn(false);
    setUserName("");
    window.location.href = "/";
  };

  return (
    <header className="w-full border-b bg-white/90 backdrop-blur sticky top-0 z-50 shadow-sm">
      <nav className="mx-auto flex h-14 sm:h-16 w-full max-w-6xl items-center justify-between px-3 sm:px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white font-extrabold text-sm sm:text-base">
            9T
          </div>
          <span className="font-bold text-base sm:text-lg tracking-tight text-slate-900">
            9Tangle
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1 lg:gap-2">
          <Link
            href="/"
            className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-orange-500 hover:bg-orange-50 transition"
          >
            Home
          </Link>
          <Link
            href="/courses"
            className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-orange-500 hover:bg-orange-50 transition"
          >
            Courses
          </Link>
          <Link
            href="/contact"
            className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-orange-500 hover:bg-orange-50 transition"
          >
            Contact
          </Link>
        </div>

        {/* Auth Buttons / User Menu */}
        <div className="hidden md:flex items-center gap-2 lg:gap-3">
          {isLoggedIn ? (
            <>
              <Link
                href="/my-learning"
                className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-orange-500 hover:bg-orange-50 transition"
              >
                My Learning
              </Link>
              <div className="relative group">
                <button className="flex items-center gap-2 px-3 py-2 rounded-full bg-orange-50 text-orange-600 font-medium text-sm">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden lg:inline">{userName}</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-orange-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <Link
                    href="/dashboard/Student"
                    className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-orange-50 hover:text-orange-500 rounded-t-xl"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/dashboard/profile"
                    className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-orange-50 hover:text-orange-500"
                  >
                    Profile
                  </Link>
                  <Link
                    href="/my-learning"
                    className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-orange-50 hover:text-orange-500"
                  >
                    My Courses
                  </Link>
                  <hr className="border-orange-100" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-b-xl"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="px-4 py-2 rounded-full border border-orange-300 bg-white text-sm font-semibold text-orange-600 hover:bg-orange-50 transition"
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                className="px-4 py-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 text-sm font-semibold text-white shadow-sm hover:from-orange-600 hover:to-orange-500 transition"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-orange-50 transition"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6 text-slate-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-orange-100 animate-fade-in">
          <div className="px-4 py-4 space-y-1">
            <Link
              href="/"
              className="block py-2.5 px-3 rounded-lg text-sm font-medium text-slate-700 hover:bg-orange-50 hover:text-orange-500 transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/courses"
              className="block py-2.5 px-3 rounded-lg text-sm font-medium text-slate-700 hover:bg-orange-50 hover:text-orange-500 transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Courses
            </Link>
            <Link
              href="/contact"
              className="block py-2.5 px-3 rounded-lg text-sm font-medium text-slate-700 hover:bg-orange-50 hover:text-orange-500 transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>

            {isLoggedIn && (
              <>
                <hr className="border-orange-100 my-2" />
                <Link
                  href="/dashboard/Student"
                  className="block py-2.5 px-3 rounded-lg text-sm font-medium text-slate-700 hover:bg-orange-50 hover:text-orange-500 transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/my-learning"
                  className="block py-2.5 px-3 rounded-lg text-sm font-medium text-slate-700 hover:bg-orange-50 hover:text-orange-500 transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Learning
                </Link>
                <Link
                  href="/dashboard/profile"
                  className="block py-2.5 px-3 rounded-lg text-sm font-medium text-slate-700 hover:bg-orange-50 hover:text-orange-500 transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
              </>
            )}

            <div className="pt-3 mt-2 border-t border-orange-100 space-y-2">
              {isLoggedIn ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full py-2.5 rounded-full border border-red-300 text-sm font-semibold text-red-600 hover:bg-red-50 transition"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="block w-full text-center py-2.5 rounded-full border border-orange-300 bg-white text-sm font-semibold text-orange-600 hover:bg-orange-50 transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/register"
                    className="block w-full text-center py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 text-sm font-semibold text-white shadow-sm hover:from-orange-600 hover:to-orange-500 transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
