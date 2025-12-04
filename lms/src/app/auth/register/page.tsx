'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
// Icons are implemented inline to avoid extra peer dependency issues

// Zod Schema (Type-safe validation)
const registerSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .refine((val) => /[A-Z]/.test(val), 'Password must include an uppercase letter')
    .refine((val) => /[a-z]/.test(val), 'Password must include a lowercase letter')
    .refine((val) => /[0-9]/.test(val), 'Password must include a digit')
    .refine((val) => /[^A-Za-z0-9]/.test(val), 'Password must include a special character'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      // Client-side password validation
      const p = data.password || '';
      const ok = /.{8,}/.test(p) && /[A-Z]/.test(p) && /[a-z]/.test(p) && /[0-9]/.test(p) && /[^A-Za-z0-9]/.test(p);
      if (!ok) {
        alert('Password must be 8+ chars with uppercase, lowercase, digit and special character.');
        setIsLoading(false);
        return;
      }

      // Prevent admin email registration
      if (data.email.toLowerCase().trim() === 'mirkashi28@gmail.com') {
        alert('This email cannot be used for registration.');
        setIsLoading(false);
        return;
      }

      let result: any = null;
      try {
        result = await apiFetch<{ token: string; user?: { id: string; email: string; firstName?: string; lastName?: string } }>(
          '/api/auth/register',
          {
            method: 'POST',
            body: JSON.stringify({
              email: data.email,
              password: data.password,
              fullName: data.fullName,
            }),
          }
        );
      } catch (networkErr: any) {
        // Fallback: create a mock token for preview when backend is unreachable
        console.warn('Register network error, using mock token for preview:', networkErr?.message || networkErr);
        const { createMockToken } = await import('@/lib/auth');
        const token = createMockToken({ userId: 'mock-user-' + Date.now(), email: data.email, role: 'student' });
        localStorage.setItem('authToken', token);
        // Also persist name so it shows in profile/navbar
        const [first, ...rest] = data.fullName.split(' ');
        const last = rest.join(' ');
        localStorage.setItem('userProfile', JSON.stringify({ firstName: first, lastName: last, email: data.email }));
        window.location.href = '/dashboard/Student';
        return;
      }

      // Store token and redirect
      if (result?.token) {
        localStorage.setItem('authToken', result.token);
        if (result.user) {
          const { firstName, lastName, email } = result.user;
          localStorage.setItem('userProfile', JSON.stringify({ firstName: firstName || '', lastName: lastName || '', email }));
        } else {
          // best-effort
          const [first, ...rest] = data.fullName.split(' ');
          const last = rest.join(' ');
          localStorage.setItem('userProfile', JSON.stringify({ firstName: first, lastName: last, email: data.email }));
        }
        window.location.href = '/dashboard/Student';
      } else {
        throw new Error('Registration failed: No token received');
      }
      reset();
    } catch (error: any) {
      console.error(error);
      const errorMsg = error?.message || 'Registration failed. Please try again.';
      if (errorMsg.includes('already exists') || errorMsg.includes('User already exists')) {
        alert('This email is already registered. Please use a different email or try logging in.');
      } else if (errorMsg.includes('Password') || errorMsg.includes('password')) {
        alert('Password does not meet requirements. Must be 8+ chars with uppercase, lowercase, digit and special character.');
      } else {
        alert(errorMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#ffe9d6] via-[#ffd1a1] to-[#ffb46b] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="max-w-5xl w-full relative z-10">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up">
            <div className="lg:grid lg:grid-cols-2">
              {/* Left Side - Branding */}
              <div className="hidden lg:flex bg-gradient-to-br from-orange-400 to-amber-400 p-12 flex-col justify-between text-white relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
                
                <div className="relative z-10">
                  <div className="flex items-center space-x-3 mb-12 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                    <div className="w-14 h-14 rounded-2xl bg-white text-orange-500 backdrop-blur flex items-center justify-center shadow-lg">
                      <span className="text-xl font-extrabold tracking-tight">9T</span>
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold">9Tangle</h1>
                      <p className="text-sm text-white/80">Online Learning Platform</p>
                    </div>
                  </div>
                  <h2 className="text-5xl font-extrabold mb-6 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                    Create your free account
                  </h2>
                  <p className="text-xl text-white/90 mb-10 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                    Join thousands of students already learning with our expert‑led courses.
                  </p>
                  <div className="space-y-5 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                    <div className="flex items-center gap-4 p-3 rounded-xl bg-white/10 backdrop-blur hover:bg-white/15 transition-all">
                      <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shadow-lg">
                        <span className="text-xl">✓</span>
                      </div>
                      <p className="font-medium">Access to 1000+ courses</p>
                    </div>
                    <div className="flex items-center gap-4 p-3 rounded-xl bg-white/10 backdrop-blur hover:bg-white/15 transition-all">
                      <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shadow-lg">
                        <span className="text-xl">✓</span>
                      </div>
                      <p className="font-medium">Learn at your own pace</p>
                    </div>
                    <div className="flex items-center gap-4 p-3 rounded-xl bg-white/10 backdrop-blur hover:bg-white/15 transition-all">
                      <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shadow-lg">
                        <span className="text-xl">✓</span>
                      </div>
                      <p className="font-medium">Get certified & advance your career</p>
                    </div>
                  </div>
                </div>
                <div className="relative z-10 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
                  <div className="p-4 rounded-xl bg-white/10 backdrop-blur">
                    <p className="text-white/90 italic mb-2">"Best platform to upskill and grow!"</p>
                    <p className="text-white/70 text-sm">– Alex M., Developer</p>
                  </div>
                </div>
              </div>

              {/* Right Side - Registration Form */}
              <div className="p-8 lg:p-12 bg-white">
                <div className="mb-8">
                  <h2 className="text-3xl font-extrabold text-slate-900 mb-2">
                    Sign up to 9Tangle
                  </h2>
                  <p className="text-gray-600">
                    Join our learning platform today and start your journey.
                  </p>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                  {/* Full Name */}
                  <div className="space-y-2">
                    <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700">
                      Full Name
                    </label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0053b8] transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <input
                        {...register('fullName')}
                        type="text"
                        autoComplete="name"
                        className="w-full pl-12 pr-4 h-14 text-base border-2 border-orange-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 bg-white text-slate-900 transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                    {errors.fullName && (
                      <p className="text-sm text-red-600 font-medium">{errors.fullName.message}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                      Email Address
                    </label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0053b8] transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                      </div>
                      <input
                        {...register('email')}
                        type="email"
                        autoComplete="email"
                        className="w-full pl-12 pr-4 h-14 text-base border-2 border-orange-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 bg-white text-slate-900 transition-all"
                        placeholder="you@example.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-red-600 font-medium">{errors.email.message}</p>
                    )}
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                      Password
                    </label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0053b8] transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <input
                        {...register('password')}
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        className="w-full pl-12 pr-12 h-14 text-base border-2 border-orange-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 bg-white text-slate-900 transition-all"
                        placeholder="Create a strong password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-orange-500 transition-colors"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m0 0A9.97 9.97 0 015.12 5.12m3.29 3.29L12 12m-3.59-3.59L12 12m0 0l3.29 3.29M12 12l3.29-3.29m0 0a9.97 9.97 0 011.563-3.029M15.29 8.71l3.29-3.29" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-sm text-red-600 font-medium">{errors.password.message}</p>
                    )}
                    <p className="text-xs text-gray-500">Must include uppercase, lowercase, digit and special character</p>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700">
                      Confirm Password
                    </label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0053b8] transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <input
                        {...register('confirmPassword')}
                        type={showConfirmPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        className="w-full pl-12 pr-12 h-14 text-base border-2 border-orange-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 bg-white text-slate-900 transition-all"
                        placeholder="Confirm your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-orange-500 transition-colors"
                        aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                      >
                        {showConfirmPassword ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m0 0A9.97 9.97 0 015.12 5.12m3.29 3.29L12 12m-3.59-3.59L12 12m0 0l3.29 3.29M12 12l3.29-3.29m0 0a9.97 9.97 0 011.563-3.029M15.29 8.71l3.29-3.29" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-600 font-medium">{errors.confirmPassword.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-14 text-lg font-bold text-white bg-gradient-to-r from-orange-500 to-amber-400 rounded-xl hover:from-orange-600 hover:to-orange-500 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                        </svg>
                        Creating Account...
                      </span>
                    ) : (
                      'Create Account'
                    )}
                  </button>

                  <div className="text-center pt-4">
                    <span className="text-gray-600">Already have an account? </span>
                    <Link href="/auth/login" className="font-bold text-orange-500 hover:text-orange-600 transition-colors">
                      Sign in here
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}