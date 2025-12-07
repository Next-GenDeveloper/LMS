'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';

// Zod Schema (Type-safe validation)
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      // Clear any existing profile data from previous sessions
      localStorage.removeItem('userProfile');
      localStorage.removeItem('profileDraft');

      const result: any = await apiFetch<{ token: string; user?: { id: string; email: string; role: string; firstName?: string; lastName?: string } }>(
        '/api/auth/login',
        {
          method: 'POST',
          body: JSON.stringify({
            email: data.email,
            password: data.password,
          }),
        }
      );

      // Store token and redirect
      if (result?.token) {
        localStorage.setItem('authToken', result.token);
        if (result.user) {
          const { firstName, lastName, email, role } = result.user;
          localStorage.setItem('userProfile', JSON.stringify({ firstName: firstName || '', lastName: lastName || '', email, role }));

          // Redirect based on role
          if (role === 'admin') {
            router.push('/dashboard/Admin');
          } else {
            router.push('/my-learning');
          }
        } else {
          // Fallback
          localStorage.setItem('userProfile', JSON.stringify({ firstName: '', lastName: '', email: data.email, role: 'student' }));
          router.push('/my-learning');
        }
      } else {
        throw new Error('Login failed: No token received');
      }
      reset();
    } catch (error: any) {
      console.error(error);
      const errorMsg = error?.message || 'Login failed. Please try again.';
      alert(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen animate-gradient-wave flex items-center justify-center px-4 py-8 pb-16">
        <div className="w-full max-w-5xl bg-card/95 backdrop-blur-sm rounded-3xl shadow-2xl grid lg:grid-cols-2 overflow-hidden border border-border animate-fade-in-up">
              {/* Left Side - Branding */}
              <div className="hidden lg:flex bg-gradient-to-br from-primary to-accent p-12 flex-col justify-between text-primary-foreground relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-card/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-card/5 rounded-full blur-3xl" />

                <div className="relative z-10">
                  <div className="flex items-center space-x-3 mb-12 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                    <div className="w-14 h-14 rounded-2xl bg-card text-primary backdrop-blur flex items-center justify-center shadow-lg">
                      <span className="text-xl font-extrabold tracking-tight">9T</span>
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold">9Tangle</h1>
                      <p className="text-sm text-primary-foreground/80">Online Learning Platform</p>
                    </div>
                  </div>
                  <h2 className="text-5xl font-extrabold mb-6 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                    Welcome back to your learning journey
                  </h2>
                  <p className="text-xl text-primary-foreground/90 mb-10 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                    Access your courses, track progress, and continue where you left off.
                  </p>
                  <div className="space-y-5 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                    <div className="flex items-center gap-4 p-3 rounded-xl bg-card/10 backdrop-blur hover:bg-card/15 transition-all">
                      <div className="w-12 h-12 rounded-full bg-card/20 flex items-center justify-center shadow-lg">
                        <span className="text-xl">📚</span>
                      </div>
                      <p className="font-medium">Access your enrolled courses</p>
                    </div>
                    <div className="flex items-center gap-4 p-3 rounded-xl bg-card/10 backdrop-blur hover:bg-card/15 transition-all">
                      <div className="w-12 h-12 rounded-full bg-card/20 flex items-center justify-center shadow-lg">
                        <span className="text-xl">📊</span>
                      </div>
                      <p className="font-medium">Track your learning progress</p>
                    </div>
                    <div className="flex items-center gap-4 p-3 rounded-xl bg-card/10 backdrop-blur hover:bg-card/15 transition-all">
                      <div className="w-12 h-12 rounded-full bg-card/20 flex items-center justify-center shadow-lg">
                        <span className="text-xl">🏆</span>
                      </div>
                      <p className="font-medium">Earn certificates and badges</p>
                    </div>
                  </div>
                </div>
                <div className="relative z-10 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
                  <div className="p-4 rounded-xl bg-card/10 backdrop-blur">
                    <p className="text-primary-foreground/90 italic mb-2">"Amazing platform for continuous learning!"</p>
                    <p className="text-primary-foreground/70 text-sm">– Sarah K., Software Engineer</p>
                  </div>
                </div>
              </div>

              {/* Right Side - Login Form */}
              <div className="p-8 lg:p-12 bg-card">
                <div className="mb-8">
                  <h2 className="text-3xl font-extrabold text-foreground mb-2">
                    Sign in to 9Tangle
                  </h2>
                  <p className="text-muted-foreground">
                    Welcome back! Please sign in to your account.
                  </p>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                  {/* Email */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-semibold text-foreground">
                      Email Address
                    </label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                      </div>
                      <input
                        {...register('email')}
                        type="email"
                        autoComplete="email"
                        className="w-full pl-12 pr-4 h-14 text-base border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring bg-background text-foreground transition-all"
                        placeholder="you@example.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-destructive font-medium">{errors.email.message}</p>
                    )}
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <label htmlFor="password" className="block text-sm font-semibold text-foreground">
                      Password
                    </label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <input
                        {...register('password')}
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        className="w-full pl-12 pr-12 h-14 text-base border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring bg-background text-foreground transition-all"
                        placeholder="Your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-muted-foreground hover:text-primary transition-colors"
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
                      <p className="text-sm text-destructive font-medium">{errors.password.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-14 text-lg font-bold text-primary-foreground bg-gradient-to-r from-primary to-accent rounded-xl hover:from-primary/90 hover:to-accent/90 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                        </svg>
                        Signing In...
                      </span>
                    ) : (
                      'Sign In'
                    )}
                  </button>

                  <div className="text-center pt-4">
                    <span className="text-muted-foreground">Don't have an account? </span>
                    <Link href="/auth/register" className="font-bold text-primary hover:text-primary/80 transition-colors">
                      Sign up here
                    </Link>
                  </div>
                </form>
              </div>
        </div>
      </div>
    </>
  );
}
