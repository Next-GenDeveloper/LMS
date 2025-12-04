
// src/app/(auth)/login/page.tsx
"use client";

import Link from "next/link";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token and user data
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("userProfile", JSON.stringify(data.user));

        // Redirect based on role
        if (data.user.role === "admin") {
          router.push("/dashboard/Admin");
        } else if (data.user.role === "instructor") {
          router.push("/instructors"); // or appropriate instructor dashboard
        } else {
          router.push("/dashboard/Student");
        }
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ffe9d6] via-[#ffd1a1] to-[#ffb46b] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-5xl bg-white/95 rounded-3xl shadow-2xl grid md:grid-cols-[1.3fr,1fr] overflow-hidden border border-orange-100">
        {/* Left content panel */}
        <div className="relative flex flex-col justify-between p-8 md:p-10 bg-gradient-to-br from-orange-50 via-[#ffe9d6] to-[#ffd1a1]">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white text-lg font-extrabold">
                9T
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-slate-900">9Tangle</span>
                <span className="text-[11px] text-slate-500">Online Learning Platform</span>
              </div>
            </div>
            <Link
              href="/"
              className="hidden md:inline-flex text-[11px] px-4 py-1.5 rounded-full bg-white/70 text-orange-500 font-semibold shadow-sm hover:bg-white transition"
            >
              ← Back to home
            </Link>
          </div>

          <div className="space-y-5 max-w-md">
            <p className="inline-flex items-center text-[11px] font-semibold uppercase tracking-[0.18em] text-orange-500 bg-white/70 rounded-full px-4 py-1 w-fit">
              Welcome back
            </p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
              Log in and continue{" "}
              <span className="relative inline-block text-orange-500">
                learning
                <span className="absolute left-0 -bottom-1 h-1 w-full rounded-full bg-orange-300" />
              </span>
            </h1>
            <p className="text-sm md:text-base text-slate-600">
              Access your saved courses, track your progress, and pick up right where you left off.
            </p>

            <div className="mt-4 grid grid-cols-3 gap-3 text-xs text-slate-700">
              <div className="rounded-2xl bg-white/80 border border-orange-100 p-3">
                <div className="text-lg font-bold text-orange-500">1k+</div>
                <div className="text-[11px] text-slate-500">Active learners</div>
              </div>
              <div className="rounded-2xl bg-white/80 border border-orange-100 p-3">
                <div className="text-lg font-bold text-orange-500">150+</div>
                <div className="text-[11px] text-slate-500">Expert courses</div>
              </div>
              <div className="rounded-2xl bg-white/80 border border-orange-100 p-3">
                <div className="text-lg font-bold text-orange-500">98%</div>
                <div className="text-[11px] text-slate-500">Satisfaction</div>
              </div>
            </div>
          </div>

          <div className="mt-8 hidden md:flex items-center gap-3 text-[11px] text-slate-500">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-orange-400 text-lg">
              ★
            </span>
            <p>
              “Best platform to upskill and grow your career.”
            </p>
          </div>
        </div>

        {/* Right panel with form */}
        <div className="w-full p-8 md:p-10 flex flex-col justify-center bg-white">
          <h2 className="text-2xl font-extrabold mb-2 text-slate-900">Sign in</h2>
          <p className="text-xs text-slate-500 mb-6">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="font-semibold text-orange-500 hover:text-orange-600">
              Create one
            </Link>
          </p>

          <form className="w-full space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm mb-1 font-semibold text-slate-800">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="block w-full rounded-xl border border-orange-100 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition bg-white"
                autoComplete="email"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm mb-1 font-semibold text-slate-800">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                className="block w-full rounded-xl border border-orange-100 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition bg-white"
                autoComplete="current-password"
                required
              />
            </div>
            <div className="flex items-center justify-between mt-2 mb-2">
              <label className="flex items-center gap-2 text-xs text-gray-600">
                <input type="checkbox" className="rounded border-orange-300 focus:ring-orange-500" /> Remember me
              </label>
              <Link href="/forgot-password" className="text-xs font-semibold text-orange-400 hover:text-orange-500 transition">Forgot password?</Link>
            </div>
            {error && (
              <div className="bg-red-50 p-2 rounded text-red-600 text-xs mb-2">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-full py-3 text-base font-bold text-white bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-orange-500 shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="pt-4">
            <p className="text-[11px] text-slate-400 text-center">
              By logging in, you agree to our{" "}
              <span className="font-medium text-orange-500">Terms</span> and{" "}
              <span className="font-medium text-orange-500">Privacy Policy</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

