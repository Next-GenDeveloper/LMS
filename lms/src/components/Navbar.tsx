"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import ThemeToggle from "./ThemeToggle";

export function Navbar() {
  return <NavbarContent />;
}

export default Navbar;

function NavbarContent() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    // Check auth status on mount
    const token = localStorage.getItem("authToken");
    const profile = localStorage.getItem("userProfile");
    if (token) {
      setIsLoggedIn(true);
      if (profile) {
        try {
          const p = JSON.parse(profile);
          setUserRole(p.role || "");
          if (p.role === 'admin') {
            setUserName("Logged in as Admin");
          } else {
            setUserName(p.firstName || "User");
          }
        } catch {
          setUserName("User");
        }
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userProfile");
    localStorage.removeItem("profileDraft");
    setIsLoggedIn(false);
    setUserName("");
    setUserRole("");
    window.location.href = "/";
  };

  return (
    <header className="w-full border-b bg-card/90 backdrop-blur sticky top-0 z-50 shadow-sm">
      <nav className="mx-auto flex h-14 sm:h-16 w-full max-w-6xl items-center justify-between px-3 sm:px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white font-extrabold text-sm sm:text-base">
            9T
          </div>
          <span className="font-bold text-base sm:text-lg tracking-tight text-foreground">
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
            href="/shop"
            className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-orange-500 hover:bg-orange-50 transition"
          >
            Shop
          </Link>
          <Link
            href="/tracking"
            className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-orange-500 hover:bg-orange-50 transition"
          >
            Track Order
          </Link>
          <Link
            href="/courses"
            className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-orange-500 hover:bg-orange-50 transition"
          >
            Courses
          </Link>
          <Link
            href="/contact"
            className="px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-primary hover:bg-accent transition"
          >
            Contact
          </Link>
        </div>

        {/* Auth Buttons / User Menu */}
        <div className="hidden md:flex items-center gap-2 lg:gap-3">
          <Link
            href="/cart"
            className="relative px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-orange-500 hover:bg-orange-50 transition"
          >
            🛒 Cart
          </Link>
          <ThemeToggle />
          {isLoggedIn ? (
            <>
              <Link
                href="/my-learning"
                className="px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-primary hover:bg-accent transition"
              >
                My Learning
              </Link>
              <div className="relative group">
                <button className="flex items-center gap-2 px-3 py-2 rounded-full bg-accent text-primary font-medium text-sm">
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
                <div className="absolute right-0 top-full mt-1 w-48 bg-card rounded-xl shadow-lg border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <Link
                    href={(() => {
                      const profile = localStorage.getItem("userProfile");
                      if (profile) {
                        try {
                          const p = JSON.parse(profile);
                          return p.role === 'admin' ? "/admin/dashboard" : "/dashboard/Student";
                        } catch {
                          return "/dashboard/Student";
                        }
                      }
                      return "/dashboard/Student";
                    })()}
                    className="block px-4 py-2.5 text-sm text-foreground hover:bg-accent hover:text-primary rounded-t-xl"
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
                    className="block px-4 py-2.5 text-sm text-foreground hover:bg-accent hover:text-primary"
                  >
                    My Courses
                  </Link>
                  <hr className="border-orange-100" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 rounded-b-xl"
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
                className="px-4 py-2 rounded-full border border-border bg-card text-sm font-semibold text-primary hover:bg-accent transition"
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                className="px-4 py-2 rounded-full bg-gradient-to-r from-primary to-primary/80 text-sm font-semibold text-primary-foreground shadow-sm hover:from-primary/90 hover:to-primary transition"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-accent transition"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6 text-foreground"
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
        <div className="md:hidden bg-card border-t border-border animate-fade-in">
          <div className="px-4 py-4 space-y-1">
            <Link
              href="/"
              className="block py-2.5 px-3 rounded-lg text-sm font-medium text-foreground hover:bg-accent hover:text-primary transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/shop"
              className="block py-2.5 px-3 rounded-lg text-sm font-medium text-slate-700 hover:bg-orange-50 hover:text-orange-500 transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Shop
            </Link>
            <Link
              href="/cart"
              className="block py-2.5 px-3 rounded-lg text-sm font-medium text-slate-700 hover:bg-orange-50 hover:text-orange-500 transition"
              onClick={() => setIsMenuOpen(false)}
            >
              🛒 Cart
            </Link>
            <Link
              href="/tracking"
              className="block py-2.5 px-3 rounded-lg text-sm font-medium text-slate-700 hover:bg-orange-50 hover:text-orange-500 transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Track Order
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
                <hr className="border-border my-2" />
                <Link
                  href={userRole === 'admin' ? "/admin/dashboard" : "/dashboard/Student"}
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

            <div className="pt-3 mt-2 border-t border-border space-y-2">
              {isLoggedIn ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full py-2.5 rounded-full border border-destructive text-sm font-semibold text-destructive hover:bg-destructive/10 transition"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="block w-full text-center py-2.5 rounded-full border border-border bg-card text-sm font-semibold text-primary hover:bg-accent transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/register"
                    className="block w-full text-center py-2.5 rounded-full bg-gradient-to-r from-primary to-primary/80 text-sm font-semibold text-primary-foreground shadow-sm hover:from-primary/90 hover:to-primary transition"
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
