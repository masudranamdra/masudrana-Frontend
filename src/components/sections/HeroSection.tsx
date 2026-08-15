'use client';

import React from 'react';
import { useConfig } from '../../context/ConfigContext';
import { motion } from 'framer-motion';
import { FileDown, Send, Sparkles, ChevronDown, CheckCircle, Award, Users, Layers } from 'lucide-react';
import Link from 'next/link';

const SocialIcon = ({ name, className = "h-5 w-5" }: { name: string; className?: string }) => {
  const normName = name.toLowerCase();
  if (normName === 'github') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
        <path d="M9 18c-4.51 2-5-2-7-2" />
      </svg>
    );
  }
  if (normName === 'linkedin') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect width="4" height="12" x="2" y="9" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    );
  }
  if (normName === 'twitter') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
      </svg>
    );
  }
  if (normName === 'youtube') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z" />
        <polygon points="10 15 15 12 10 9" fill="currentColor" />
      </svg>
    );
  }
  if (normName === 'facebook') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    );
  }
  if (normName === 'instagram') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    );
  }
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" x2="22" y1="12" y2="12" />
    </svg>
  );
};

export const HeroSection: React.FC = () => {
  const { config, loading } = useConfig();

  const handleScrollToContact = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const contact = document.getElementById('contact');
    if (contact) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = contact.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-[#F5F7FB] dark:bg-slate-900 text-[#0F172A] dark:text-white">
        <div className="text-center space-y-4">
          <div className="h-4 w-48 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-md mx-auto" />
          <div className="h-12 w-96 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-lg mx-auto" />
          <div className="h-6 w-80 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-md mx-auto" />
        </div>
      </section>
    );
  }

  // Use config avatar if available, otherwise use the specific provided image
  const avatarImage = config?.avatarUrl || "https://i.ibb.co.com/cX8qjH0V/a588e708-c5fe-4072-a5a7-5dc79c9cef8a.jpg";

  return (
    <section id="hero" className="relative min-h-[85vh] flex items-center justify-center pt-24 pb-12 sm:pt-32 sm:pb-16 overflow-hidden bg-[#F5F7FB] dark:bg-[#0F172A] text-[#0F172A] dark:text-white transition-colors duration-300">
      
      {/* Background soft blur gradient overlays */}
      <div className="absolute top-1/4 left-1/4 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-blue-500/10 dark:bg-blue-600/20 rounded-full blur-[100px] pointer-events-none transition-colors duration-300" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] sm:w-[450px] h-[300px] sm:h-[450px] bg-sky-500/10 dark:bg-purple-600/15 rounded-full blur-[90px] pointer-events-none transition-colors duration-300" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:30px_30px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none opacity-60" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-5 text-center lg:text-left flex flex-col items-center lg:items-start">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-xl text-xs font-bold bg-[#EFF6FF] dark:bg-blue-900/30 text-[#2563EB] dark:text-blue-400 border border-[#DBEAFE] dark:border-blue-800/50 uppercase tracking-wider shadow-sm transition-colors duration-300">
                <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                <span>Available For Freelancing</span>
              </div>
              
              {/* Main Heading */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-[#0F172A] dark:text-white transition-colors duration-300">
                {config?.heroTitle || 'Building Premium SaaS Platforms & APIs'}
              </h1>
              
              {/* Subheading */}
              <p className="text-xs sm:text-sm md:text-base text-[#334155] dark:text-slate-300 max-w-2xl font-normal leading-relaxed transition-colors duration-300">
                {config?.heroSubtitle || 'Professional developer building scalable modern applications and backend systems.'}
              </p>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto pt-1"
            >
              <Link
                href="#contact"
                onClick={handleScrollToContact}
                className="flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl font-bold bg-[#2563EB] hover:bg-[#1D4ED8] dark:bg-blue-600 dark:hover:bg-blue-500 text-white shadow-md shadow-blue-500/20 text-xs sm:text-sm hover:scale-[1.01] active:scale-[0.99] transition-all w-full sm:w-auto cursor-pointer"
              >
                <Send className="h-4 w-4" />
                <span>Get In Touch</span>
              </Link>
              
              {config?.resumeUrl && (
                <a
                  href={config.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl font-bold bg-white dark:bg-slate-800 text-[#334155] dark:text-white border border-[#E2E8F0] dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs sm:text-sm shadow-sm hover:scale-[1.01] active:scale-[0.99] transition-all w-full sm:w-auto"
                >
                  <FileDown className="h-4 w-4 text-[#2563EB] dark:text-blue-400" />
                  <span>View Resume</span>
                </a>
              )}
            </motion.div>

            {/* Social channels */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center gap-2.5 pt-2"
            >
              {config?.socialLinks &&
                Object.entries(config.socialLinks).map(([name, url]) => {
                  if (!url) return null;
                  return (
                    <a
                      key={name}
                      href={url as string}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 text-[#64748B] dark:text-slate-400 hover:text-[#2563EB] dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-300 flex items-center justify-center shadow-sm group"
                    >
                      <SocialIcon name={name} className="h-4.5 w-4.5 transition-transform duration-300 group-hover:scale-110" />
                    </a>
                  );
                })}
            </motion.div>
          </div>

          {/* Hero Right Content - Profile Card and Floating Stats */}
          <div className="lg:col-span-5 flex justify-center items-center relative mt-6 lg:mt-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative w-56 h-56 sm:w-72 sm:h-72 md:w-[320px] md:h-[320px] rounded-xl bg-white dark:bg-slate-800 p-2.5 border border-[#E2E8F0] dark:border-slate-700 shadow-xl dark:shadow-blue-900/20 group transition-colors duration-300 z-10"
            >
              <img
                src={avatarImage}
                alt="Profile Card Avatar"
                className="w-full h-full object-cover rounded-lg shadow-inner transition-transform duration-500 group-hover:scale-[1.01]"
              />

              {/* Floating Stat 1: Projects Completed */}
              <motion.div
                className="absolute -top-4 -left-4 bg-white dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 rounded-xl p-2.5 shadow-lg flex items-center space-x-2.5 transition-colors duration-300"
              >
                <div className="p-1.5 rounded-lg bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 border border-green-100 dark:border-green-800/50">
                  <CheckCircle className="h-4 w-4" />
                </div>
                <div>
                  <span className="block text-[10px] text-[#64748B] dark:text-slate-400 font-mono leading-none">Projects</span>
                  <span className="block text-xs font-extrabold text-[#0F172A] dark:text-white mt-0.5">80+ Completed</span>
                </div>
              </motion.div>

              {/* Floating Stat 2: Experience */}
              <motion.div
                className="absolute -bottom-4 -right-4 bg-white dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 rounded-xl p-2.5 shadow-lg flex items-center space-x-2.5 transition-colors duration-300"
              >
                <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800/50">
                  <Award className="h-4 w-4" />
                </div>
                <div>
                  <span className="block text-[10px] text-[#64748B] dark:text-slate-400 font-mono leading-none">Experience</span>
                  <span className="block text-xs font-extrabold text-[#0F172A] dark:text-white mt-0.5">8+ Years</span>
                </div>
              </motion.div>

              {/* Floating Stat 3: Clients */}
              <motion.div
                className="absolute top-1/2 -right-10 -translate-y-1/2 bg-white dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 rounded-xl p-2.5 shadow-lg flex items-center space-x-2 transition-colors duration-300 hidden sm:flex"
              >
                <div className="p-1.5 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-800/50">
                  <Users className="h-4 w-4" />
                </div>
                <div>
                  <span className="block text-[10px] text-[#64748B] dark:text-slate-400 font-mono leading-none">Clients</span>
                  <span className="block text-xs font-bold text-[#0F172A] dark:text-white mt-0.5">50+ Global</span>
                </div>
              </motion.div>

              {/* Floating Stat 4: Technologies */}
              <motion.div
                
                className="absolute bottom-10 -left-12 bg-white dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 rounded-2xl p-3 shadow-xl flex items-center space-x-2.5 transition-colors duration-300 hidden sm:flex"
              >
                <div className="p-1.5 rounded-xl bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 border border-cyan-100 dark:border-cyan-800/50">
                  <Layers className="h-4 w-4" />
                </div>
                <div>
                  <span className="block text-[10px] text-[#64748B] dark:text-slate-400 font-mono leading-none">Tech Stack</span>
                  <span className="block text-xs font-bold text-[#0F172A] dark:text-white mt-0.5">Next.js & APIs</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Glowing Rings Background */}
            <div className="absolute -inset-10 border border-blue-500/20 dark:border-blue-400/10 rounded-full pointer-events-none animate-[spin_40s_linear_infinite] z-0" />
            <div className="absolute -inset-20 border border-sky-400/20 dark:border-sky-300/10 rounded-full pointer-events-none animate-[spin_50s_linear_infinite_reverse] z-0" />
          </div>

        </div>
      </div>

      {/* Bottom Scroll Down Link */}
      <div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-2 cursor-pointer text-[#64748B] dark:text-slate-400 hover:text-[#2563EB] dark:hover:text-blue-400 transition-colors"
        onClick={() => {
          const about = document.getElementById('about');
          if (about) {
            window.scrollTo({
              top: about.getBoundingClientRect().top + window.scrollY - 80,
              behavior: 'smooth'
            });
          }
        }}
      >
        <span className="text-[10px] uppercase tracking-widest font-mono">Scroll Down</span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <ChevronDown className="h-5 w-5" />
        </motion.div>
      </div>
    </section>
  );
};

