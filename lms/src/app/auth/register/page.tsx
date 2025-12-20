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

// Password validation helper
const getPasswordRequirements = (password: string) => {
  const requirements = [
    { test: /.{8,}/.test(password), message: 'At least 8 characters long' },
    { test: /[A-Z]/.test(password), message: 'One uppercase letter' },
    { test: /[a-z]/.test(password), message: 'One lowercase letter' },
    { test: /[0-9]/.test(password), message: 'One number' },
    { test: /[^A-Za-z0-9]/.test(password), message: 'One special character' },
  ];
  return requirements;
};

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordValue, setPasswordValue] = useState('');

  // OTP flow state
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [pending, setPending] = useState<{ fullName: string; email: string; password: string } | null>(null);
  const [otp, setOtp] = useState('');
  const [otpInfo, setOtpInfo] = useState<{ email: string; expiresInMinutes: number } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
  });

  const onSubmit = async (data: RegisterFormData) => {
    // Step 1: Request OTP
    setIsLoading(true);
    try {
      const requirements = getPasswordRequirements(data.password || '');
      const unmetRequirements = requirements.filter((req) => !req.test);
      if (unmetRequirements.length > 0) {
        const messages = unmetRequirements.map((req) => req.message);
        alert(`Password must meet the following requirements:\n• ${messages.join('\n• ')}`);
        return;
      }

      if (data.email.toLowerCase().trim() === 'mirkashi28@gmail.com') {
        alert('This email cannot be used for registration.');
        return;
      }

      // Save pending data locally for OTP step
      setPending({ fullName: data.fullName, email: data.email, password: data.password });

      // Clear any existing profile data from previous users
      localStorage.removeItem('userProfile');
      localStorage.removeItem('profileDraft');

      const resp = await apiFetch<{ message: string; email: string; expiresInMinutes: number }>(
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

      setOtpInfo({ email: resp.email, expiresInMinutes: resp.expiresInMinutes });
      setStep('otp');
      alert(resp.message || 'OTP sent to your email');
    } catch (error: any) {
      console.error(error);
      const errorMsg = error?.message || 'Registration failed. Please try again.';
      if (errorMsg.includes('already exists') || errorMsg.includes('User already exists')) {
        alert('This email is already registered. Please use a different email or try logging in.');
      } else {
        alert(errorMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onVerifyOtp = async () => {
    if (!pending?.email) {
      alert('Missing signup data. Please register again.');
      setStep('form');
      return;
    }

    const code = otp.trim();
    if (!/^\d{6}$/.test(code)) {
      alert('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);
    try {
      const result = await apiFetch<{ token: string; user: { id: string; email: string; firstName?: string; lastName?: string; role?: string } }>(
        '/api/auth/verify-otp',
        {
          method: 'POST',
          body: JSON.stringify({ email: pending.email, otp: code }),
        }
      );

      localStorage.setItem('authToken', result.token);
      const { firstName, lastName, email } = result.user || ({} as any);
      localStorage.setItem('userProfile', JSON.stringify({ firstName: firstName || '', lastName: lastName || '', email }));

      // Redirect after successful verification
      window.location.href = '/dashboard/profile';
    } catch (error: any) {
      console.error(error);
      alert(error?.message || 'OTP verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const onResendOtp = async () => {
    if (!pending?.email) return;
    setIsLoading(true);
    try {
      const resp = await apiFetch<{ message: string; email: string; expiresInMinutes: number }>(
        '/api/auth/resend-otp',
        { method: 'POST', body: JSON.stringify({ email: pending.email }) }
      );
      setOtpInfo({ email: resp.email, expiresInMinutes: resp.expiresInMinutes });
      alert(resp.message || 'OTP resent');
    } catch (error: any) {
      console.error(error);
      alert(error?.message || 'Failed to resend OTP');
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
                    Create your free account
                  </h2>
                  <p className="text-xl text-primary-foreground/90 mb-10 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                    Join thousands of students already learning with our expert‑led courses.
                  </p>
                  <div className="space-y-5 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                    <div className="flex items-center gap-4 p-3 rounded-xl bg-card/10 backdrop-blur hover:bg-card/15 transition-all">
                      <div className="w-12 h-12 rounded-full bg-card/20 flex items-center justify-center shadow-lg">
                        <span className="text-xl">✓</span>
                      </div>
                      <p className="font-medium">Access to 1000+ courses</p>
                    </div>
                    <div className="flex items-center gap-4 p-3 rounded-xl bg-card/10 backdrop-blur hover:bg-card/15 transition-all">
                      <div className="w-12 h-12 rounded-full bg-card/20 flex items-center justify-center shadow-lg">
                        <span className="text-xl">✓</span>
                      </div>
                      <p className="font-medium">Learn at your own pace</p>
                    </div>
                    <div className="flex items-center gap-4 p-3 rounded-xl bg-card/10 backdrop-blur hover:bg-card/15 transition-all">
                      <div className="w-12 h-12 rounded-full bg-card/20 flex items-center justify-center shadow-lg">
                        <span className="text-xl">✓</span>
                      </div>
                      <p className="font-medium">Get certified & advance your career</p>
                    </div>
                  </div>
                </div>
                <div className="relative z-10 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
                  <div className="p-4 rounded-xl bg-card/10 backdrop-blur">
                    <p className="text-primary-foreground/90 italic mb-2">"Best platform to upskill and grow!"</p>
                    <p className="text-primary-foreground/70 text-sm">– Alex M., Developer</p>
                  </div>
                </div>
              </div>

              {/* Right Side - Registration Form */}
              <div className="p-8 lg:p-12 bg-card">
                <div className="mb-8">
                  <h2 className="text-3xl font-extrabold text-foreground mb-2">
                    Sign up to 9Tangle
                  </h2>
                  <p className="text-muted-foreground">
                    Join our learning platform today and start your journey.
                  </p>
                </div>

                <form
                  className="space-y-5"
                  onSubmit={
                    step === 'form'
                      ? handleSubmit(onSubmit)
                      : (e) => {
                          e.preventDefault();
                          onVerifyOtp();
                        }
                  }
                >
                  {step === 'form' && (
                    <>
                      {/* Full Name */}
                  <div className="space-y-2">
                    <label htmlFor="fullName" className="block text-sm font-semibold text-foreground">
                      Full Name
                    </label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <input
                        {...register('fullName')}
                        type="text"
                        autoComplete="name"
                        className="w-full pl-12 pr-4 h-14 text-base border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring bg-background text-foreground transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                    {errors.fullName && (
                      <p className="text-sm text-destructive font-medium">{errors.fullName.message}</p>
                    )}
                  </div>

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
                        autoComplete="new-password"
                        className="w-full pl-12 pr-12 h-14 text-base border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring bg-background text-foreground transition-all"
                        placeholder="Create a strong password"
                        onChange={(e) => {
                          setPasswordValue(e.target.value);
                          register('password').onChange(e);
                        }}
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
                    {passwordValue && (
                      <div className="text-xs space-y-1 mt-2">
                        <p className="text-muted-foreground font-medium">Password requirements:</p>
                        {getPasswordRequirements(passwordValue).map((req, index) => (
                          <div key={index} className={`flex items-center gap-2 ${req.test ? 'text-green-600' : 'text-muted-foreground'}`}>
                            <span className={`text-xs ${req.test ? '✓' : '○'}`}></span>
                            <span>{req.message}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="block text-sm font-semibold text-foreground">
                      Confirm Password
                    </label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <input
                        {...register('confirmPassword')}
                        type={showConfirmPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        className="w-full pl-12 pr-12 h-14 text-base border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring bg-background text-foreground transition-all"
                        placeholder="Confirm your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-muted-foreground hover:text-primary transition-colors"
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
                    </>
                  )}

                  {step === 'otp' && (
                    <div className="space-y-3 rounded-xl border border-border p-4 bg-background">
                      <div className="font-semibold">Enter OTP</div>
                      <div className="text-sm text-muted-foreground">
                        We sent a 6-digit code to <span className="font-medium">{otpInfo?.email || pending?.email}</span>
                        {otpInfo?.expiresInMinutes ? ` (expires in ${otpInfo.expiresInMinutes} min)` : ''}.
                      </div>
                      <input
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        inputMode="numeric"
                        maxLength={6}
                        className="w-full h-14 text-base border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring bg-background text-foreground transition-all px-4 tracking-widest text-center"
                        placeholder="______"
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={onResendOtp}
                          disabled={isLoading}
                          className="flex-1 h-12 rounded-xl border border-border font-semibold hover:bg-muted transition disabled:opacity-70"
                        >
                          Resend OTP
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setStep('form');
                            setOtp('');
                          }}
                          disabled={isLoading}
                          className="flex-1 h-12 rounded-xl border border-border font-semibold hover:bg-muted transition disabled:opacity-70"
                        >
                          Edit Details
                        </button>
                      </div>
                    </div>
                  )}

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
                        {step === 'form' ? 'Sending OTP...' : 'Verifying OTP...'}
                      </span>
                    ) : (
                      step === 'form' ? 'Send OTP' : 'Verify OTP'
                    )}
                  </button>

                  <div className="text-center pt-4">
                    <span className="text-muted-foreground">Already have an account? </span>
                    <Link href="/auth/login" className="font-bold text-primary hover:text-primary/80 transition-colors">
                      Sign in here
                    </Link>
                  </div>
                </form>
              </div>
        </div>
      </div>
    </>
  );
}