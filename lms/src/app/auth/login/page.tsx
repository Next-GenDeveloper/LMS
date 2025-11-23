// src/app/(auth)/login/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState("student");

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl flex flex-col lg:flex-row shadow-2xl rounded-2xl overflow-hidden">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600 to-blue-700 p-12 flex-col justify-between text-white">
          <div>
            <div className="flex items-center space-x-3 mb-12">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                📚
              </div>
              <h1 className="text-3xl font-bold">LearnHub</h1>
            </div>
            <h2 className="text-4xl font-bold mb-6">Welcome Back!</h2>
            <p className="text-xl text-white/90 mb-8">
              Continue your learning journey with thousands of expert-led courses.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-2xl">✓</span>
                </div>
                <p>Lifetime access to all courses</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-2xl">✓</span>
                </div>
                <p>Learn from industry experts</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-2xl">✓</span>
                </div>
                <p>Earn certificates</p>
              </div>
            </div>
          </div>
          <p className="text-white/70 text-sm">
            "The best investment I ever made for my career!" – Sarah K.
          </p>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 bg-white p-8 lg:p-12">
          {/* Tab Buttons */}
          <div className="grid w-full grid-cols-2 gap-0 mb-8 border-b">
            <button
              onClick={() => setActiveTab("student")}
              className={`py-4 px-6 text-lg font-semibold text-center transition-colors ${
                activeTab === "student"
                  ? "text-purple-600 border-b-2 border-purple-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Student Login
            </button>
            <button
              onClick={() => setActiveTab("instructor")}
              className={`py-4 px-6 text-lg font-semibold text-center transition-colors ${
                activeTab === "instructor"
                  ? "text-purple-600 border-b-2 border-purple-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Instructor Login
            </button>
          </div>

          {/* Student Login Tab */}
          {activeTab === "student" && (
            <div className="space-y-6">
              <div className="space-y-1 pb-8">
                <h2 className="text-3xl font-bold text-center">Welcome Back</h2>
                <p className="text-center text-base text-gray-600">
                  Enter your credentials to access your courses
                </p>
              </div>

              <form className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-400">✉️</span>
                    <input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 h-12 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-400">🔒</span>
                    <input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 h-12 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input
                      id="remember"
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-600 cursor-pointer"
                    />
                    <label htmlFor="remember" className="text-sm font-medium cursor-pointer text-gray-700">
                      Remember me
                    </label>
                  </div>
                  <Link href="/forgot-password" className="text-sm text-purple-600 hover:underline">
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  className="w-full h-12 text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors"
                >
                  Sign In as Student
                </button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button className="h-12 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                  🔍 Google
                </button>
                <button className="h-12 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                  🐙 GitHub
                </button>
              </div>

              <p className="text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <Link href="/(auth)/register" className="font-semibold text-purple-600 hover:underline">
                  Sign up free
                </Link>
              </p>
            </div>
          )}

          {/* Instructor Login Tab */}
          {activeTab === "instructor" && (
            <div className="space-y-6">
              <div className="space-y-1 pb-8">
                <h2 className="text-3xl font-bold text-center">Instructor Portal</h2>
                <p className="text-center text-base text-gray-600">
                  Access your dashboard and manage courses
                </p>
              </div>
              <div className="text-center py-12">
                <p className="text-lg text-gray-600 mb-8">
                  Instructor login is by invitation only
                </p>
                <button className="h-12 px-8 text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors">
                  Request Instructor Access
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}