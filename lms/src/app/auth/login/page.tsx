// src/app/(auth)/login/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { decodeJwt } from "@/lib/auth";
import { apiFetch } from "@/lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Hardcoded admin credentials
  const ADMIN_EMAIL = 'mirkashi28@gmail.com';
  const ADMIN_PASSWORD = 'Iphone_@11';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Check for admin credentials first
      const isAdmin = email.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD;
      
      let data: any;
      try {
        // If admin credentials, send special flag to backend
        data = await apiFetch<{ token: string; user?: { id: string; email: string; firstName?: string; lastName?: string; role?: string } }>(
          "/api/auth/login",
          {
            method: "POST",
            body: JSON.stringify({ email, password, isAdmin }),
          }
        );
      } catch (networkErr: any) {
        // Fallback to mock token in preview when backend is unreachable
        console.warn(
          "Login network error, using mock token for preview:",
          networkErr?.message || networkErr
        );
        const { createMockToken } = await import("@/lib/auth");
        
        // Determine role based on admin credentials or default to student
        let role: "student" | "instructor" | "admin" = "student";
        if (isAdmin) {
          role = "admin";
        }
        
        const token = createMockToken({ userId: "mock-user-" + Date.now(), email, role });
        localStorage.setItem("authToken", token);
        
        // Store user profile
        const [first, ...rest] = (email.split("@")[0] || (isAdmin ? "Super" : "User")).split(".");
        const last = rest.join(" ");
        localStorage.setItem(
          "userProfile",
          JSON.stringify({ 
            firstName: isAdmin ? "Super" : first, 
            lastName: isAdmin ? "Admin" : last, 
            email 
          })
        );
        
        // Always redirect admin to Admin Dashboard
        if (role === "admin") {
          window.location.href = "/dashboard/Admin";
        } else {
          window.location.href = "/dashboard/Student";
        }
        return;
      }

      if (data?.token) {
        localStorage.setItem("authToken", data.token);
        // Persist user profile for display in Navbar/Profile
        if (data.user) {
          const { firstName, lastName, email: uEmail } = data.user;
          localStorage.setItem(
            "userProfile",
            JSON.stringify({ firstName: firstName || "", lastName: lastName || "", email: uEmail })
          );
        }
        const payload = decodeJwt<{ role?: "student" | "instructor" | "admin" }>(data.token);
        // Redirect based on role - admin always goes to Admin Dashboard
        if (payload?.role === "admin" || isAdmin) {
          window.location.href = "/dashboard/Admin";
        } else if (payload?.role === "instructor") {
          window.location.href = "/dashboard/Admin";
        } else {
          window.location.href = "/dashboard/Student";
        }
      }
    } catch (err: any) {
      console.error(err);
      const msg = err?.message || "An unexpected error occurred";
      // Friendly message for common cases
      if (/Invalid credentials/i.test(msg)) {
        setError("Email or password is incorrect.");
      } else if (/API 400|API 422|Validation/i.test(msg)) {
        setError("Please check your input and try again.");
      } else {
        setError("Unable to sign in. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0053b8] via-[#003a80] to-[#002855] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="w-full max-w-6xl flex flex-col lg:flex-row shadow-2xl rounded-3xl overflow-hidden relative z-10 animate-fade-in-up">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0053b8] to-[#003a80] p-12 flex-col justify-between text-white relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-12 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shadow-lg">
                <span className="text-3xl">📚</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold">9tangle</h1>
                <p className="text-sm text-white/80">eLearning Platform</p>
              </div>
            </div>
            <h2 className="text-5xl font-extrabold mb-6 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              Welcome Back!
            </h2>
            <p className="text-xl text-white/90 mb-10 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
              Continue your learning journey with thousands of expert-led courses designed to accelerate your career.
            </p>
            <div className="space-y-5 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
              <div className="flex items-center gap-4 p-3 rounded-xl bg-white/10 backdrop-blur hover:bg-white/15 transition-all">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shadow-lg">
                  <span className="text-xl">✓</span>
                </div>
                <p className="font-medium">Lifetime access to all courses</p>
              </div>
              <div className="flex items-center gap-4 p-3 rounded-xl bg-white/10 backdrop-blur hover:bg-white/15 transition-all">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shadow-lg">
                  <span className="text-xl">✓</span>
                </div>
                <p className="font-medium">Learn from industry experts</p>
              </div>
              <div className="flex items-center gap-4 p-3 rounded-xl bg-white/10 backdrop-blur hover:bg-white/15 transition-all">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shadow-lg">
                  <span className="text-xl">✓</span>
                </div>
                <p className="font-medium">Earn verified certificates</p>
              </div>
            </div>
          </div>
          <div className="relative z-10 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
            <div className="p-4 rounded-xl bg-white/10 backdrop-blur">
              <p className="text-white/90 italic mb-2">"The best investment I ever made for my career!"</p>
              <p className="text-white/70 text-sm">– Sarah K., Software Engineer</p>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 bg-white dark:bg-gray-900 p-8 lg:p-12 relative">
          {/* Login Form */}
          <div className="space-y-6 animate-fade-in-up">
            <div className="space-y-2 pb-6">
              <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">Welcome Back</h2>
              <p className="text-center text-base text-gray-600 dark:text-gray-400">
                Enter your credentials to access your courses
              </p>
            </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Email Address
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0053b8] transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                    <input
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      placeholder="you@example.com"
                      className="w-full pl-12 pr-4 h-14 text-base border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0053b8] focus:border-[#0053b8] dark:bg-gray-800 dark:text-white transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Password
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0053b8] transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type="password"
                      placeholder="Enter your password"
                      className="w-full pl-12 pr-4 h-14 text-base border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0053b8] focus:border-[#0053b8] dark:bg-gray-800 dark:text-white transition-all"
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Password must be 8+ chars with uppercase, lowercase, digit and special character.</p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center space-x-2">
                    <input
                      id="remember"
                      type="checkbox"
                      className="w-5 h-5 rounded border-gray-300 text-[#0053b8] focus:ring-[#0053b8] cursor-pointer"
                    />
                    <label htmlFor="remember" className="text-sm font-medium cursor-pointer text-gray-700 dark:text-gray-300">
                      Remember me
                    </label>
                  </div>
                  <Link href="/forgot-password" className="text-sm font-semibold text-[#0053b8] hover:text-[#003a80] dark:text-blue-400 transition-colors">
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 text-lg font-bold text-white bg-gradient-to-r from-[#0053b8] to-[#003a80] rounded-xl hover:from-[#003a80] hover:to-[#0053b8] transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                      </svg>
                      Signing in...
                    </span>
                  ) : (
                    'Sign In'
                  )}
                </button>
                {error && (
                  <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                    <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
                  </div>
                )} 
              </form>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-200 dark:border-gray-700" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-gray-900 px-4 text-gray-500 dark:text-gray-400 font-medium">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button className="h-14 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-[#0053b8] hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-all duration-300 flex items-center justify-center gap-2 font-semibold text-gray-700 dark:text-gray-300 hover:text-[#0053b8] dark:hover:text-blue-400">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </button>
                <button className="h-14 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-[#0053b8] hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-all duration-300 flex items-center justify-center gap-2 font-semibold text-gray-700 dark:text-gray-300 hover:text-[#0053b8] dark:hover:text-blue-400">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  GitHub
                </button>
              </div>

              <p className="text-center text-sm text-gray-600 dark:text-gray-400 pt-4">
                Don't have an account?{" "}
                <Link href="/auth/register" className="font-bold text-[#0053b8] hover:text-[#003a80] dark:text-blue-400 transition-colors">
                  Sign up free
                </Link>
              </p>
            </div>
        </div>
      </div>
    </div>
  );
}