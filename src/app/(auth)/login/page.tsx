'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../../../context/AuthContext';
import { KeyRound, Mail, Loader2, ArrowLeft, ShieldAlert } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(5, { message: 'Password must be at least 5 characters.' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

declare global {
  interface Window {
    google: any;
  }
}

export default function LoginPage() {
  const router = useRouter();
  const { login, googleOAuthLogin, isAuthenticated, user, loading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    // Redirect if already logged in
    if (isAuthenticated && user) {
      if (user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, user, router]);

  // Initialize Google Sign-In with script load listener / interval fallback
  useEffect(() => {
    const initGoogle = () => {
      if (typeof window !== 'undefined' && window.google?.accounts?.id) {
        const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
        if (!clientId) {
          return;
        }
        try {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: handleGoogleCallback,
            auto_select: false,
            cancel_on_tap_outside: true,
          });

          const container = document.getElementById('googleRenderContainer');
          if (container && container.childElementCount === 0) {
            window.google.accounts.id.renderButton(container, {
              theme: 'outline',
              size: 'large',
              width: 320,
              text: 'continue_with',
            });
          }
        } catch (err) {
          console.error('Google accounts initialization error:', err);
        }
      }
    };

    initGoogle();
    const interval = setInterval(initGoogle, 500);
    return () => clearInterval(interval);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const loggedUser = await login(values.email, values.password);
      if (loggedUser.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setErrorMsg(
        err.response?.data?.message || 
        err.message || 
        'Failed to login. Please check your credentials and try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleCallback = async (response: any) => {
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      // Decode the JWT token from Google
      if (!response.credential) {
        throw new Error('No credential received from Google');
      }

      const base64Url = response.credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      const decodedToken = JSON.parse(jsonPayload);

      // Send to backend for validation and user creation/update
      const loggedUser = await googleOAuthLogin({
        email: decodedToken.email,
        username: decodedToken.name,
        googleId: decodedToken.sub,
        avatar: decodedToken.picture,
      });

      if (loggedUser.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      console.error('Google auth error:', err);
      setErrorMsg(
        err.response?.data?.message || 
        err.message || 
        'Google authentication failed'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleOAuthClick = () => {
    if (typeof window !== 'undefined' && window.google) {
      window.google.accounts.id.prompt();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative bg-[#F5F7FB]">
      {/* Light gradient highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Main card */}
      <div className="w-full max-w-md p-8 rounded-3xl bg-white border border-[#E2E8F0] relative z-10 space-y-8 shadow-xl shadow-slate-100/50">
        
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-[#64748B] hover:text-[#0F172A] text-xs font-semibold transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Home</span>
        </Link>

        {/* Heading */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-[#0F172A] tracking-tight">Client Portal</h2>
          <p className="text-[#64748B] text-xs font-light">
            Log in to view protected documents and vaults.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          {errorMsg && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs rounded-xl flex items-center space-x-2">
              <ShieldAlert className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Email input */}
          <div className="space-y-1.5">
            <label className="text-[#334155] text-xs font-semibold">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
              <input
                type="email"
                placeholder="client@example.com"
                {...register('email')}
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-[#E2E8F0] focus:border-[#2563EB]/50 focus:ring-1 focus:ring-[#2563EB]/50 rounded-xl text-sm text-[#0F172A] placeholder-slate-400 focus:outline-none transition-all"
              />
            </div>
            {errors.email && (
              <span className="text-rose-600 text-[10px] font-mono">{errors.email.message}</span>
            )}
          </div>

          {/* Password input */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[#334155] text-xs font-semibold">Password</label>
            </div>
            <div className="relative">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
              <input
                type="password"
                placeholder="••••••••"
                {...register('password')}
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-[#E2E8F0] focus:border-[#2563EB]/50 focus:ring-1 focus:ring-[#2563EB]/50 rounded-xl text-sm text-[#0F172A] placeholder-slate-400 focus:outline-none transition-all"
              />
            </div>
            {errors.password && (
              <span className="text-rose-600 text-[10px] font-mono">{errors.password.message}</span>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center justify-center space-x-2 w-full py-3 bg-gradient-to-r from-[#2563EB] to-[#60A5FA] hover:from-[#1D4ED8] hover:to-[#2563EB] text-white font-bold rounded-xl transition-all duration-300 shadow-md shadow-blue-500/10 cursor-pointer"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin text-white" />
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-[#E2E8F0]"></div>
          <span className="flex-shrink mx-4 text-slate-400 text-[10px] font-mono uppercase">or</span>
          <div className="flex-grow border-t border-[#E2E8F0]"></div>
        </div>

        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={handleGoogleOAuthClick}
          disabled={isSubmitting}
          className="flex items-center justify-center space-x-2.5 w-full py-2.5 bg-slate-50 border border-[#E2E8F0] hover:bg-slate-100 hover:border-[#2563EB]/35 text-[#334155] hover:text-[#0F172A] rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer disabled:opacity-50"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              {/* Simple Google SVG Icon */}
              <svg className="h-4 w-4 shrink-0 text-[#2563EB]" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Continue with Gmail</span>
            </>
          )}
        </button>

        {/* Google Render Container & Fallback Button */}
        <div id="googleRenderContainer" className="flex justify-center w-full min-h-[44px]"></div>
        
        {/* Google Sign-In Hidden Component */}
        <div id="g_id_onload" data-client_id={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID} data-callback="handleGoogleCallback" style={{ display: 'none' }}></div>
        <div id="g_id_signin" data-type="standard" style={{ display: 'none' }}></div>
      </div>
    </div>
  );
}
