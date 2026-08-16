'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';
import {
  ShieldAlert,
  Loader2,
  LayoutDashboard,
  FolderCode,
  Sliders,
  PenTool,
  BookOpen,
  MessageSquare,
  Image,
  Video,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Home,
  Menu,
  X,
  Code2,
  Quote,
  Calendar,
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function AdminClientLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isAdmin, loading, logout } = useAuth();
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (!isAdmin) {
        router.push('/dashboard');
      }
    }
  }, [loading, isAuthenticated, isAdmin, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-rose-400 p-4">
        <div className="text-center space-y-4 max-w-sm">
          <ShieldAlert className="h-12 w-12 mx-auto" />
          <h2 className="text-xl font-bold">Access Denied</h2>
          <p className="text-slate-400 text-xs font-light">
            You do not have administrative permissions to view this dashboard.
          </p>
          <Link href="/dashboard" className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl block">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const menuItems = [
    { name: 'Overview', path: '/admin', icon: LayoutDashboard },
    { name: 'Projects', path: '/admin/projects', icon: FolderCode },
    { name: 'Skills', path: '/admin/skills', icon: Sliders },
    { name: 'About Section', path: '/admin/about', icon: User },
    { name: 'Work & Education', path: '/admin/work-education', icon: Calendar },
    { name: 'Blogs CMS', path: '/admin/blogs', icon: PenTool },
    { name: 'Articles Feed', path: '/admin/articles', icon: BookOpen },
    { name: 'Testimonials', path: '/admin/testimonials', icon: Quote },
    { name: 'Gallery Images', path: '/admin/gallery-images', icon: Image },
    { name: 'Gallery Videos', path: '/admin/gallery-videos', icon: Video },
    { name: 'Documents Manager', path: '/admin/documents', icon: FileText },
    { name: 'Messages Inbox', path: '/admin/messages', icon: MessageSquare },
    { name: 'Site Configuration', path: '/admin/configuration', icon: Settings },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white/80 dark:bg-slate-950/80 border-r border-slate-200 dark:border-white/5 py-6 px-4 backdrop-blur-md">
      <div className="flex items-center justify-between pb-8 mb-4 border-b border-slate-200 dark:border-white/5">
        <Link href="/" className="flex items-center space-x-2 text-slate-800 dark:text-white font-extrabold tracking-wider">
          <Code2 className="h-6 w-6 text-indigo-500" />
          <span className="bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent text-sm">
            DEVPORTFOLIO ADMIN
          </span>
        </Link>
      </div>

      <div className="flex-grow space-y-1.5 overflow-y-auto no-scrollbar">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/15'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>

      <div className="border-t border-slate-200 dark:border-white/5 pt-6 mt-6 space-y-3">
        <Link
          href="/"
          className="flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
        >
          <Home className="h-4 w-4 shrink-0" />
          <span>Public Website</span>
        </Link>
        <button
          onClick={() => logout().then(() => router.push('/'))}
          className="flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-500 dark:text-rose-400 hover:bg-rose-500/10 w-full text-left transition-all"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen admin-gradient-bg text-[var(--text-primary)] transition-colors duration-300 flex flex-col lg:flex-row">
      <aside
        className={`hidden lg:block shrink-0 transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="h-screen sticky top-0">
          {sidebarOpen ? (
            sidebarContent
          ) : (
            <div className="flex flex-col h-full bg-white/80 dark:bg-slate-950/80 border-r border-slate-200 dark:border-white/5 py-6 px-2 items-center justify-between backdrop-blur-md">
              <div className="space-y-6 flex flex-col items-center">
                <Code2 className="h-6 w-6 text-indigo-500" />
                <div className="h-px w-8 bg-slate-200 dark:bg-white/5" />
                <div className="space-y-3">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.path;
                    return (
                      <Link
                        key={item.path}
                        href={item.path}
                        className={`p-2.5 rounded-lg block transition-all ${
                          isActive ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                        }`}
                        title={item.name}
                      >
                        <Icon className="h-4 w-4" />
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-4 flex flex-col items-center">
                <Link href="/" className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white" title="Public site">
                  <Home className="h-4 w-4" />
                </Link>
                <button onClick={() => logout()} className="p-2 text-rose-500 dark:text-rose-400 hover:bg-rose-500/10 rounded-lg" title="Logout">
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>

      <header className="lg:hidden bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-white/5 px-4 py-4 flex items-center justify-between sticky top-0 z-40">
        <Link href="/" className="flex items-center space-x-2 text-slate-800 dark:text-white font-extrabold">
          <Code2 className="h-5 w-5 text-indigo-500" />
          <span className="text-xs tracking-wider">DEVPORTFOLIO ADMIN</span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-white"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="fixed inset-0 z-50 lg:hidden flex"
          >
            <div className="w-64 max-w-sm h-full relative z-10">
              {sidebarContent}
            </div>
            <div
              className="flex-grow bg-slate-950/70 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-grow flex flex-col min-w-0">
        <header className="hidden lg:flex items-center justify-between bg-white/40 dark:bg-slate-950/40 border-b border-slate-200 dark:border-white/5 px-8 py-4 backdrop-blur-md">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-800 dark:text-white transition-colors"
            >
              {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
            <div className="text-[var(--text-secondary)] text-xs font-semibold">
              Admin Area / {menuItems.find((m) => m.path === pathname)?.name || 'Dashboard'}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-right">
              <div className="text-xs font-bold text-[var(--text-primary)]">{user?.username}</div>
              <div className="text-[10px] text-indigo-600 dark:text-indigo-400 font-mono uppercase font-bold">{user?.role} profile</div>
            </div>
            {user?.avatar ? (
              <img src={user?.avatar} alt="Admin avatar" className="w-8 h-8 rounded-full border border-slate-200 dark:border-white/10" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-indigo-600/10 border border-indigo-500/20 text-indigo-500 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
                A
              </div>
            )}
          </div>
        </header>

        <main className="flex-grow p-6 lg:p-8 overflow-y-auto max-w-[1600px] w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
