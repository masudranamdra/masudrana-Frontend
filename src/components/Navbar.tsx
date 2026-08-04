'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Menu, X, LogOut, LayoutDashboard, Shield, User, Code2, Sun, Moon, ChevronDown, Image, Video, FileText, Sparkles, FolderOpen, Film, FileCode, CheckCircle, ShieldCheck, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { isDark, toggleDarkMode } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Free Data Promo Modal States
  const [promoModalOpen, setPromoModalOpen] = useState(false);
  const [pendingPath, setPendingPath] = useState('');

  // Get Started Promo & Consent Modal States
  const [getStartedModalOpen, setGetStartedModalOpen] = useState(false);
  const [userConsent, setUserConsent] = useState(false);

  // Removed local dark mode logic in favor of ThemeContext

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    if (pathname !== '/') {
      router.push(`/#${id}`);
      setIsOpen(false);
      setDropdownOpen(false);
      return;
    }
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      setIsOpen(false);
      setDropdownOpen(false);
    }
  };

  const handleFreeDataClick = (e: React.MouseEvent, path: string) => {
    if (!isAuthenticated) {
      e.preventDefault();
      setPendingPath(path);
      setPromoModalOpen(true);
      setDropdownOpen(false);
    }
  };

  const handleFreeDataClickMobile = (e: React.MouseEvent, path: string) => {
    if (!isAuthenticated) {
      e.preventDefault();
      setPendingPath(path);
      setPromoModalOpen(true);
      setIsOpen(false);
    }
  };

  const handleGetStartedClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      setUserConsent(false);
      setGetStartedModalOpen(true);
      setIsOpen(false);
    }
  };

  const menuItems = [
    { name: 'Home', id: 'hero' },
    { name: 'Projects', id: 'projects' },
    { name: 'Blog', id: 'blogs' },
    { name: 'Articles', id: 'articles' },
    { name: 'Activities', id: 'activities' },
    { name: 'Contact', id: 'contact' },
  ];

  const galleryItems = [
    { name: 'Image Gallery', icon: Image, path: '/gallery/images', desc: 'Curated UI/UX designs, blueprints & photos.' },
    { name: 'Video Gallery', icon: Video, path: '/gallery/videos', desc: 'Tutorials, reviews, and project walk-throughs.' },
    { name: 'Document Gallery', icon: FileText, path: '/documents', desc: 'PDF books, cheat sheets, and source documents.' },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 dark:bg-transparent dark:dark-gradient-header border-b border-[#E2E8F0] dark:border-none py-3.5 shadow-md shadow-slate-100/40 backdrop-blur-md'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 text-[#0F172A] dark:text-white font-extrabold text-xl tracking-wider group shrink-0">
              <span className="bg-gradient-to-r from-[#2563EB] to-[#60A5FA] bg-clip-text text-transparent font-sans">
                Masud Rana
              </span>
            </Link>

            {/* Desktop Center Navigation */}
            <div className="hidden lg:flex items-center space-x-1 justify-center flex-1">
              {menuItems.map((item) => (
                <Link
                  key={item.id}
                  href={`/#${item.id}`}
                  onClick={(e) => handleNavClick(e, item.id)}
                  className="px-4 py-2 text-sm font-semibold text-[#334155] dark:text-slate-300 hover:text-[#2563EB] dark:hover:text-[#60A5FA] transition-colors rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  {item.name}
                </Link>
              ))}

              {/* Free Data Mega Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-1 px-4 py-2 text-sm font-semibold text-[#334155] dark:text-slate-300 hover:text-[#2563EB] dark:hover:text-[#60A5FA] hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
                >
                  <span>Free Data</span>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-30" onClick={() => setDropdownOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute left-1/2 -translate-x-1/2 mt-2 w-72 rounded-2xl border border-[#E2E8F0] dark:border-slate-700 shadow-xl overflow-hidden z-40 bg-white dark:bg-slate-900 p-2"
                      >
                        <div className="space-y-1">
                          {galleryItems.map((item) => {
                            const Icon = item.icon;
                            return (
                              <Link
                                key={item.name}
                                href={item.path}
                                onClick={(e) => {
                                  handleFreeDataClick(e, item.path);
                                  if (isAuthenticated) setDropdownOpen(false);
                                }}
                                className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
                              >
                                <div className="p-2 rounded-lg bg-[#EFF6FF] text-[#2563EB] group-hover:bg-[#2563EB] group-hover:text-white transition-colors">
                                  <Icon className="h-4.5 w-4.5" />
                                </div>
                                <div className="text-left">
                                  <span className="block text-sm font-bold text-[#0F172A] dark:text-slate-200">{item.name}</span>
                                  <span className="block text-[10px] text-[#64748B] dark:text-slate-400">{item.desc}</span>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Desktop Right Actions */}
            <div className="hidden lg:flex items-center space-x-4 shrink-0">
              {/* Day/Night Mode Toggle Icon */}
              <button 
                onClick={toggleDarkMode}
                className="p-2.5 rounded-xl bg-slate-50 border border-[#E2E8F0] text-amber-500 hover:bg-slate-100 transition-colors shadow-sm flex items-center justify-center cursor-pointer dark:bg-slate-800 dark:border-slate-700" 
                title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDark ? (
                  <Sun className="h-4.5 w-4.5 text-amber-400" />
                ) : (
                  <Moon className="h-4.5 w-4.5 text-indigo-500" />
                )}
              </button>

              {/* Client Login or Get Started Button */}
              {isAuthenticated ? (
                <div className="flex items-center space-x-3 border-l border-[#E2E8F0] dark:border-slate-700 pl-4">
                  {isAdmin && (
                    <Link
                      href="/admin"
                      className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#EFF6FF] text-[#2563EB] border border-[#DBEAFE] hover:bg-[#2563EB] hover:text-white transition-all duration-200"
                    >
                      <Shield className="h-3.5 w-3.5" />
                      <span>Admin</span>
                    </Link>
                  )}
                  <Link
                    href="/dashboard"
                    className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#F8FAFC] dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-[#E2E8F0] dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200"
                  >
                    <LayoutDashboard className="h-3.5 w-3.5 text-[#2563EB]" />
                    <span>Dashboard</span>
                  </Link>
                  <button
                    onClick={() => logout().then(() => router.push('/'))}
                    className="p-2 bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-600 hover:text-white rounded-xl transition-all duration-200 cursor-pointer"
                    title="Log Out"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleGetStartedClick}
                  className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#2563EB] hover:bg-blue-600 text-white shadow-md shadow-blue-500/20 hover:shadow-blue-500/35 transition-all duration-300 cursor-pointer"
                >
                  <User className="h-4 w-4" />
                  <span>Get Started</span>
                </button>
              )}
            </div>

            {/* Mobile Hamburger Trigger */}
            <div className="lg:hidden flex items-center space-x-3">
              <button 
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-slate-50 border border-[#E2E8F0] text-amber-500 cursor-pointer dark:bg-slate-800 dark:border-slate-700"
              >
                {isDark ? <Sun className="h-4.5 w-4.5 text-amber-400" /> : <Moon className="h-4.5 w-4.5 text-indigo-500" />}
              </button>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg bg-slate-50 border border-[#E2E8F0] text-slate-600 cursor-pointer dark:bg-slate-800 dark:border-slate-700"
              >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden bg-white dark:bg-slate-900 border-b border-[#E2E8F0] dark:border-slate-700 overflow-hidden"
            >
              <div className="px-3 pt-2 pb-6 space-y-1">
                {menuItems.map((item) => (
                  <Link
                    key={item.id}
                    href={`/#${item.id}`}
                    onClick={(e) => handleNavClick(e, item.id)}
                    className="block px-3 py-2.5 rounded-xl text-base font-semibold text-[#334155] dark:text-slate-300 hover:text-[#2563EB] dark:hover:text-[#60A5FA] hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                  >
                    {item.name}
                  </Link>
                ))}

                <div className="border-t border-[#E2E8F0] dark:border-slate-700 my-3 pt-3">
                  <span className="block px-3 text-xs font-bold text-[#64748B] dark:text-slate-400 uppercase tracking-widest font-mono mb-2">Free Data Libraries</span>
                  {galleryItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        href={item.path}
                        onClick={(e) => {
                          handleFreeDataClickMobile(e, item.path);
                        }}
                        className="flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
                      >
                        <Icon className="h-4 w-4 text-[#2563EB]" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </div>

                <div className="pt-4 mt-4 border-t border-[#E2E8F0] dark:border-slate-700 px-3 space-y-3">
                  {isAuthenticated ? (
                    <>
                      {isAdmin && (
                        <Link
                          href="/admin"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center justify-center space-x-2 w-full py-2.5 rounded-xl text-sm font-bold bg-[#EFF6FF] text-[#2563EB] border border-[#DBEAFE]"
                        >
                          <Shield className="h-4 w-4" />
                          <span>Admin Panel</span>
                        </Link>
                      )}
                      <Link
                        href="/dashboard"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-center space-x-2 w-full py-2.5 rounded-xl text-sm font-bold bg-slate-50 dark:bg-slate-800 text-[#334155] dark:text-slate-300 border border-[#E2E8F0] dark:border-slate-700"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        <span>User Dashboard</span>
                      </Link>
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          logout().then(() => router.push('/'));
                        }}
                        className="flex items-center justify-center space-x-2 w-full py-2.5 rounded-xl text-sm font-bold text-rose-600 bg-rose-50 border border-rose-100 cursor-pointer"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleGetStartedClick}
                      className="flex items-center justify-center space-x-2 w-full py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-[#2563EB] to-[#60A5FA] text-white cursor-pointer"
                    >
                      <User className="h-4 w-4" />
                      <span>Get Started</span>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* FREE DATA PROMO MODAL */}
      <AnimatePresence>
        {promoModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPromoModalOpen(false)}
              className="absolute inset-0 bg-[#0F172A]/80 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl z-10 border border-slate-200 dark:border-slate-800 overflow-hidden p-6 sm:p-8 space-y-6"
            >
              {/* Close Button */}
              <button 
                onClick={() => setPromoModalOpen(false)} 
                className="absolute top-4 right-4 p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex flex-col items-center text-center space-y-3 pt-2">
                <div className="p-3.5 bg-blue-50 dark:bg-blue-900/30 text-[#2563EB] dark:text-blue-400 rounded-2xl border border-blue-100 dark:border-blue-800/50 shadow-md">
                  <Sparkles className="h-6 w-6 animate-pulse" />
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] dark:text-white leading-tight">
                  Unlock Free Data Libraries
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-light leading-relaxed max-w-sm">
                  Register or log in to your account to access three distinct directories of premium digital assets.
                </p>
              </div>

              {/* The Three Categories Explained */}
              <div className="space-y-3 bg-slate-50 dark:bg-slate-800/40 p-4 sm:p-5 rounded-2xl border border-slate-100 dark:border-slate-800/80">
                <h4 className="text-[10px] font-bold text-[#64748B] dark:text-slate-400 uppercase tracking-widest font-mono mb-2">What is inside?</h4>
                
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-[#2563EB] dark:text-blue-400 rounded-xl shrink-0">
                    <FolderOpen className="h-4 w-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-700 dark:text-slate-200">1. Premium Images & Assets</h5>
                    <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-light mt-0.5">High-fidelity UI mockups, stock media, coding wallpapers & assets.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 pt-1">
                  <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-500 dark:text-emerald-400 rounded-xl shrink-0">
                    <Film className="h-4 w-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-700 dark:text-slate-200">2. Development & Guide Videos</h5>
                    <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-light mt-0.5">Video walkthroughs, UI animation tutorials, and technical guidelines.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 pt-1">
                  <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 dark:text-indigo-400 rounded-xl shrink-0">
                    <FileCode className="h-4 w-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-700 dark:text-slate-200">3. PDFs & E-Book Libraries</h5>
                    <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-light mt-0.5">Cheat sheets, software engineering documents, and resource packs.</p>
                  </div>
                </div>
              </div>

              {/* Motivation description */}
              <div className="text-center bg-[#2563EB]/5 border border-[#2563EB]/10 p-4 rounded-xl">
                <p className="text-[10px] sm:text-xs text-[#2563EB] dark:text-blue-400 leading-relaxed font-medium">
                  💡 <strong>Why register?</strong> To prevent unauthorized bot scraping, ensure bandwidth stability, and let you bookmark your favorite files. Registration is 100% free!
                </p>
              </div>

              {/* Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link
                  href={`/login?redirect=${encodeURIComponent(pendingPath)}`}
                  onClick={() => setPromoModalOpen(false)}
                  className="flex items-center justify-center py-3 rounded-xl font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs sm:text-sm transition-all"
                >
                  Log In
                </Link>
                <Link
                  href={`/register?redirect=${encodeURIComponent(pendingPath)}`}
                  onClick={() => setPromoModalOpen(false)}
                  className="flex items-center justify-center py-3 rounded-xl font-bold bg-[#2563EB] hover:bg-blue-600 text-white text-xs sm:text-sm transition-all shadow-md shadow-blue-500/20"
                >
                  Create Account
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* GET STARTED PROMO & CONSENT MODAL */}
      <AnimatePresence>
        {getStartedModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setGetStartedModalOpen(false)}
              className="absolute inset-0 bg-[#0F172A]/80 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl z-10 border border-slate-200 dark:border-slate-800 overflow-hidden p-6 sm:p-8 space-y-6"
            >
              {/* Close Button */}
              <button 
                onClick={() => setGetStartedModalOpen(false)} 
                className="absolute top-4 right-4 p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex flex-col items-center text-center space-y-3 pt-2">
                <div className="p-3.5 bg-blue-50 dark:bg-blue-900/30 text-[#2563EB] dark:text-blue-400 rounded-2xl border border-blue-100 dark:border-blue-800/50 shadow-md">
                  <ShieldCheck className="h-6 w-6 text-[#2563EB]" />
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] dark:text-white leading-tight">
                  Welcome to DevPortfolio
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-light leading-relaxed max-w-sm">
                  Create a secure client account today to interact with key features of this portfolio dashboard.
                </p>
              </div>

              {/* What they can do after logging in */}
              <div className="space-y-3.5 bg-slate-50 dark:bg-slate-800/40 p-4 sm:p-5 rounded-2xl border border-slate-100 dark:border-slate-800/80">
                <h4 className="text-[10px] font-bold text-[#64748B] dark:text-slate-400 uppercase tracking-widest font-mono mb-2">Member Features & Privileges</h4>
                
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-[#2563EB] dark:text-blue-400 rounded-xl shrink-0">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-700 dark:text-slate-200">Submit Recommendations</h5>
                    <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-light mt-0.5">Endorse my services and view approval status directly from your dashboard.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 pt-1">
                  <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-500 dark:text-emerald-400 rounded-xl shrink-0">
                    <FolderOpen className="h-4 w-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-700 dark:text-slate-200">Access Free Data Libraries</h5>
                    <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-light mt-0.5">Gain priority access to premium images, walkthrough videos, and PDF manuals.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 pt-1">
                  <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 dark:text-indigo-400 rounded-xl shrink-0">
                    <LayoutDashboard className="h-4 w-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-700 dark:text-slate-200">Interactive User Dashboard</h5>
                    <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-light mt-0.5">Manage messages, verify credentials, and view system status logs.</p>
                  </div>
                </div>
              </div>

              {/* Data Privacy & Security Assurance */}
              <div className="p-4 bg-emerald-500/5 dark:bg-emerald-900/10 border border-emerald-500/15 dark:border-emerald-500/20 rounded-xl flex items-start space-x-3">
                <Lock className="h-5 w-5 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h5 className="text-xs font-bold text-emerald-700 dark:text-emerald-400">Security & Encryption Assured</h5>
                  <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-light leading-relaxed">
                    Your details are completely safe. Credentials are secured via cryptographically salted hashing (bcrypt) and protected by TLS encryption. We respect your inbox privacy.
                  </p>
                </div>
              </div>

              {/* Consent Checkbox */}
              <label className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-800/20 rounded-xl border border-slate-100 dark:border-slate-800/60 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={userConsent}
                  onChange={(e) => setUserConsent(e.target.checked)}
                  className="h-4.5 w-4.5 rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB] dark:bg-slate-900 dark:border-slate-800"
                />
                <span className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 font-medium">
                  I consent to dev rules & authorize secure credential access.
                </span>
              </label>

              {/* Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link
                  href={userConsent ? "/login" : "#"}
                  onClick={(e) => {
                    if (!userConsent) e.preventDefault();
                    else setGetStartedModalOpen(false);
                  }}
                  className={`flex items-center justify-center py-3 rounded-xl font-bold border text-xs sm:text-sm transition-all ${
                    userConsent 
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700' 
                      : 'bg-slate-50 dark:bg-slate-800/30 text-slate-300 dark:text-slate-600 border-slate-100 dark:border-slate-800 cursor-not-allowed'
                  }`}
                >
                  Log In
                </Link>
                <Link
                  href={userConsent ? "/register" : "#"}
                  onClick={(e) => {
                    if (!userConsent) e.preventDefault();
                    else setGetStartedModalOpen(false);
                  }}
                  className={`flex items-center justify-center py-3 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                    userConsent 
                      ? 'bg-[#2563EB] hover:bg-blue-600 text-white shadow-md shadow-blue-500/20' 
                      : 'bg-slate-200 dark:bg-slate-800/80 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                  }`}
                >
                  Create Account
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
