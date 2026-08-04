'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import API from '../../lib/api';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { User, KeyRound, CheckCircle, AlertCircle, Loader2, LogOut, Send, Mail, Briefcase, FileText, ArrowRight, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const GithubIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const passwordSchema = z
  .object({
    currentPassword: z.string().min(5, { message: 'Current password is required.' }),
    newPassword: z.string().min(5, { message: 'New password must be at least 5 characters.' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords don't match.",
    path: ['confirmPassword'],
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;

const contactSchema = z.object({
  subject: z.string().min(3, { message: 'Subject is required.' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading, logout } = useAuth();
  
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);

  const [contactSuccess, setContactSuccess] = useState<string | null>(null);
  const [contactError, setContactError] = useState<string | null>(null);
  const [contactSubmitting, setContactSubmitting] = useState(false);

  const {
    register: registerPwd,
    handleSubmit: handlePwdSubmit,
    reset: resetPwd,
    formState: { errors: pwdErrors },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });

  const {
    register: registerContact,
    handleSubmit: handleContactSubmit,
    reset: resetContact,
    formState: { errors: contactErrors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { subject: '', message: '' },
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  const onPasswordSubmit = async (values: PasswordFormValues) => {
    setPasswordSubmitting(true);
    setPasswordSuccess(null);
    setPasswordError(null);
    try {
      const res = await API.put('/auth/updatepassword', {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      if (res.data && res.data.success) {
        setPasswordSuccess('Password updated successfully.');
        resetPwd();
      } else {
        setPasswordError(res.data.message || 'Failed to update password.');
      }
    } catch (error: any) {
      setPasswordError(error.response?.data?.message || 'Incorrect current password or server failure.');
    } finally {
      setPasswordSubmitting(false);
    }
  };

  const onContactSubmit = async (values: ContactFormValues) => {
    setContactSubmitting(true);
    setContactSuccess(null);
    setContactError(null);
    try {
      const res = await API.post('/messages', {
        name: user?.username || 'Dashboard User',
        email: user?.email || 'unknown@user.com',
        subject: values.subject,
        message: values.message,
      });
      if (res.data && res.data.success) {
        setContactSuccess('Your message has been sent to the Admin successfully.');
        resetContact();
      } else {
        setContactError('Failed to send message.');
      }
    } catch (error: any) {
      setContactError(error.response?.data?.message || 'Failed to send message. Please try again later.');
    } finally {
      setContactSubmitting(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <Loader2 className="h-8 w-8 text-[var(--primary)] animate-spin" />
      </div>
    );
  }

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };
  
  const welcomeVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'spring' as const, stiffness: 120, damping: 15 }
    }
  };

  const sidebarVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { type: 'spring' as const, stiffness: 80, damping: 12 }
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }
    }
  };

  const securityVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { type: 'spring' as const, stiffness: 100, damping: 15, delay: 0.2 }
    }
  };

  return (
    <div className="min-h-screen flex flex-col admin-gradient-bg text-[var(--text-primary)] transition-colors duration-300">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 w-full">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Welcome Section */}
          <motion.div variants={welcomeVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[var(--card-border)] pb-8 mb-12">
            <div className="space-y-1">
              <h1 className="text-3xl font-extrabold tracking-tight">
                Welcome back, <span className="text-[var(--primary)]">{user.username}</span>
              </h1>
              <p className="text-[var(--text-muted)] text-sm font-light">
                Manage your credentials and securely contact the platform administrator.
              </p>
            </div>
            <button
              onClick={() => logout().then(() => router.push('/'))}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl font-semibold bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white border border-rose-500/20 transition-all duration-300"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Sidebar (Widgets) */}
            <motion.div variants={sidebarVariants} className="lg:col-span-4 space-y-6">
              
              {/* User Profile Card */}
              <div className="p-8 rounded-2xl glass-panel glass-panel-hover dark:dark-gradient-card text-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary-light)] to-transparent opacity-50"></div>
                <div className="relative z-10 flex flex-col items-center">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.username} className="w-24 h-24 rounded-full object-cover border-4 border-[var(--card-bg)] shadow-xl mb-4 transition-transform group-hover:scale-105" />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-[var(--card-bg)] shadow-xl mb-4 flex items-center justify-center border border-[var(--card-border)] text-[var(--primary)] font-bold text-3xl">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <h3 className="font-bold text-xl">{user.username}</h3>
                  <p className="text-[var(--text-muted)] text-sm mb-3">{user.email}</p>
                  <span className="px-3 py-1 rounded-full bg-[var(--primary-light)] text-[var(--primary)] text-xs font-bold uppercase tracking-wider border border-[var(--primary-light-border)]">
                    {user.role} Account
                  </span>
                </div>
              </div>

              {/* Admin Info & Professional Details Widget */}
              <div className="p-6 rounded-2xl glass-panel dark:dark-gradient-card space-y-6">
                <div className="flex items-center space-x-3 pb-4 border-b border-[var(--card-border)]">
                  <div className="p-2 rounded-lg bg-[var(--primary-light)] text-[var(--primary)]">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-base bg-gradient-to-r from-sky-500 via-pink-500 to-blue-500 bg-clip-text text-transparent">Masud Rana</h4>
                    <p className="text-[10px] text-[var(--text-muted)] font-mono uppercase font-bold tracking-wider">Full-Stack Software Engineer</p>
                  </div>
                </div>

                <div className="space-y-3 text-xs leading-relaxed text-[var(--text-secondary)] font-light">
                  <p>
                    Specializing in building premium SaaS platforms, interactive portfolios, and robust web applications using 
                    <span className="font-bold text-sky-500 dark:text-sky-400"> Next.js</span>, 
                    <span className="font-bold text-pink-500 dark:text-pink-400"> React</span>, and 
                    <span className="font-bold text-blue-500 dark:text-blue-400"> Node.js/Express</span>.
                  </p>
                  <div className="space-y-2 pt-2 border-t border-[var(--card-border)] border-dashed">
                    <div className="flex justify-between">
                      <span className="text-[var(--text-muted)]">Core Stack</span>
                      <span className="font-semibold text-right">MERN / NextJS / TS</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--text-muted)]">Experience</span>
                      <span className="font-semibold">3+ Years Professional</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--text-muted)]">Contact 1</span>
                      <span className="font-mono font-semibold">masud.dev01@gmail.com</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--text-muted)]">Contact 2</span>
                      <span className="font-mono font-semibold">mr3377006@gmail.com</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Link href="/#projects" className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] hover:border-[var(--primary)] hover:shadow-md transition-all text-center group">
                    <Briefcase className="h-4.5 w-4.5 text-[var(--text-muted)] group-hover:text-[var(--primary)] mb-1.5" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Projects</span>
                  </Link>
                  <Link href="/#about" className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] hover:border-[var(--primary)] hover:shadow-md transition-all text-center group">
                    <FileText className="h-4.5 w-4.5 text-[var(--text-muted)] group-hover:text-[var(--primary)] mb-1.5" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Resume</span>
                  </Link>
                </div>

                <div className="pt-2 flex justify-center space-x-3.5">
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-[var(--card-bg)] border border-[var(--card-border)] text-[var(--text-muted)] hover:text-[var(--primary)] hover:border-[var(--primary)] transition-all">
                    <GithubIcon className="h-4 w-4" />
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-[var(--card-bg)] border border-[var(--card-border)] text-[var(--text-muted)] hover:text-[var(--primary)] hover:border-[var(--primary)] transition-all">
                    <LinkedinIcon className="h-4 w-4" />
                  </a>
                  <a href="mailto:masud.dev01@gmail.com" className="p-2 rounded-full bg-[var(--card-bg)] border border-[var(--card-border)] text-[var(--text-muted)] hover:text-[var(--primary)] hover:border-[var(--primary)] transition-all">
                    <Mail className="h-4 w-4" />
                  </a>
                </div>
              </div>

            </motion.div>

            {/* Main Area (Forms) */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* Contact Admin Form */}
              <motion.div variants={formVariants} className="p-8 rounded-2xl glass-panel dark:dark-gradient-card">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2.5 rounded-xl bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/30">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Contact Administrator</h3>
                    <p className="text-xs text-[var(--text-muted)]">Send a direct message to my secure inbox.</p>
                  </div>
                </div>

                <form onSubmit={handleContactSubmit(onContactSubmit)} className="space-y-4">
                  {contactSuccess && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm rounded-xl flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 shrink-0" />
                      <span>{contactSuccess}</span>
                    </motion.div>
                  )}
                  {contactError && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-sm rounded-xl flex items-center space-x-2">
                      <AlertCircle className="h-5 w-5 shrink-0" />
                      <span>{contactError}</span>
                    </motion.div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[var(--text-secondary)]">Subject</label>
                    <input
                      type="text"
                      placeholder="What is this regarding?"
                      {...registerContact('subject')}
                      className="w-full px-4 py-3 bg-[var(--card-bg)] border border-[var(--card-border)] dark:dark-input rounded-xl text-sm focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all"
                    />
                    {contactErrors.subject && (
                      <span className="text-rose-500 text-xs">{contactErrors.subject.message}</span>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[var(--text-secondary)]">Message</label>
                    <textarea
                      rows={5}
                      placeholder="Type your message here..."
                      {...registerContact('message')}
                      className="w-full px-4 py-3 bg-[var(--card-bg)] border border-[var(--card-border)] dark:dark-input rounded-xl text-sm focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all resize-none"
                    ></textarea>
                    {contactErrors.message && (
                      <span className="text-rose-500 text-xs">{contactErrors.message.message}</span>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={contactSubmitting}
                    className="w-full py-3.5 bg-[var(--primary)] dark:dark-gradient-button hover:bg-[var(--primary-hover)] text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-[var(--primary)]/25 flex items-center justify-center space-x-2 group"
                  >
                    {contactSubmitting ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        <span>Send Message</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              </motion.div>

              {/* Password Change Widget */}
              <motion.div variants={securityVariants} className="p-8 rounded-2xl glass-panel dark:dark-gradient-card">
                <form onSubmit={handlePwdSubmit(onPasswordSubmit)} className="space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b border-[var(--card-border)] mb-4">
                    <div className="flex items-center space-x-2">
                      <KeyRound className="h-5 w-5 text-[var(--primary)]" />
                      <h3 className="font-bold text-base">Security Settings</h3>
                    </div>
                    <span className="text-xs text-[var(--text-muted)]">Update Password</span>
                  </div>

                  {passwordSuccess && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs rounded-xl flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 shrink-0" />
                      <span>{passwordSuccess}</span>
                    </motion.div>
                  )}
                  {passwordError && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs rounded-xl flex items-center space-x-2">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{passwordError}</span>
                    </motion.div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-semibold text-[var(--text-secondary)]">Current Password</label>
                      <input
                        type="password"
                        {...registerPwd('currentPassword')}
                        className="w-full px-3 py-2.5 bg-[var(--card-bg)] border border-[var(--card-border)] dark:dark-input rounded-xl text-sm focus:outline-none focus:border-[var(--primary)]"
                      />
                      {pwdErrors.currentPassword && (
                        <span className="text-rose-500 text-xs">{pwdErrors.currentPassword.message}</span>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[var(--text-secondary)]">New Password</label>
                      <input
                        type="password"
                        {...registerPwd('newPassword')}
                        className="w-full px-3 py-2.5 bg-[var(--card-bg)] border border-[var(--card-border)] dark:dark-input rounded-xl text-sm focus:outline-none focus:border-[var(--primary)]"
                      />
                      {pwdErrors.newPassword && (
                        <span className="text-rose-500 text-xs">{pwdErrors.newPassword.message}</span>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[var(--text-secondary)]">Confirm Password</label>
                      <input
                        type="password"
                        {...registerPwd('confirmPassword')}
                        className="w-full px-3 py-2.5 bg-[var(--card-bg)] border border-[var(--card-border)] dark:dark-input rounded-xl text-sm focus:outline-none focus:border-[var(--primary)]"
                      />
                      {pwdErrors.confirmPassword && (
                        <span className="text-rose-500 text-xs">{pwdErrors.confirmPassword.message}</span>
                      )}
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={passwordSubmitting}
                      className="px-6 py-2.5 bg-[var(--card-bg)] dark:dark-secondary-button hover:bg-[var(--primary-light)] text-[var(--text-primary)] border border-[var(--card-border)] hover:border-[var(--primary)] font-semibold rounded-xl text-sm transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                    >
                      {passwordSubmitting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <span>Update Password</span>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>

            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
