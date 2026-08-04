'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../../../context/AuthContext';
import { KeyRound, Mail, User, Loader2, ArrowLeft, ShieldAlert } from 'lucide-react';

const registerSchema = z
  .object({
    username: z.string().min(3, { message: 'Username must be at least 3 characters.' }),
    email: z.string().email({ message: 'Please enter a valid email address.' }),
    password: z.string().min(5, { message: 'Password must be at least 5 characters.' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ['confirmPassword'],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { register: signup, isAuthenticated, user, loading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, user, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { username: '', email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const loggedUser = await signup(values.username, values.email, values.password);
      if (loggedUser.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to sign up. Please try again.');
    } finally {
      setIsSubmitting(false);
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

      {/* Card container */}
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
          <h2 className="text-3xl font-extrabold text-[#0F172A] tracking-tight">Create Account</h2>
          <p className="text-[#64748B] text-xs font-light">
            Sign up to unlock media galleries and download materials.
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

          {/* Username input */}
          <div className="space-y-1.5">
            <label className="text-[#334155] text-xs font-semibold">Username</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
              <input
                type="text"
                placeholder="developer01"
                {...register('username')}
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-[#E2E8F0] focus:border-[#2563EB]/50 focus:ring-1 focus:ring-[#2563EB]/50 rounded-xl text-sm text-[#0F172A] placeholder-slate-400 focus:outline-none transition-all"
              />
            </div>
            {errors.username && (
              <span className="text-rose-600 text-[10px] font-mono">{errors.username.message}</span>
            )}
          </div>

          {/* Email input */}
          <div className="space-y-1.5">
            <label className="text-[#334155] text-xs font-semibold">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
              <input
                type="email"
                placeholder="dev@example.com"
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
            <label className="text-[#334155] text-xs font-semibold">Password</label>
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

          {/* Confirm Password input */}
          <div className="space-y-1.5">
            <label className="text-[#334155] text-xs font-semibold">Confirm Password</label>
            <div className="relative">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
              <input
                type="password"
                placeholder="••••••••"
                {...register('confirmPassword')}
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-[#E2E8F0] focus:border-[#2563EB]/50 focus:ring-1 focus:ring-[#2563EB]/50 rounded-xl text-sm text-[#0F172A] placeholder-slate-400 focus:outline-none transition-all"
              />
            </div>
            {errors.confirmPassword && (
              <span className="text-rose-600 text-[10px] font-mono">{errors.confirmPassword.message}</span>
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
              <span>Sign Up</span>
            )}
          </button>
        </form>

        {/* Footer info link */}
        <div className="text-center text-[#64748B] text-xs">
          Already have an account?{' '}
          <Link href="/login" className="text-[#2563EB] font-bold hover:underline animate-none">
            Sign In
          </Link>
        </div>

      </div>
    </div>
  );
}
