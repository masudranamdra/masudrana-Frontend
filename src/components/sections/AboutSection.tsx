'use client';

import React, { useState } from 'react';
import { useAbout } from '../../context/AboutContext';
import { useConfig } from '../../context/ConfigContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FileDown, ArrowRight, Mail, MapPin, Eye, Globe, X, Briefcase, GitBranch, MessageCircle } from 'lucide-react';
import { FaGithub, FaLinkedin, FaTwitter, FaFacebook, FaYoutube, FaInstagram, FaGlobe } from 'react-icons/fa';
import { SiMedium } from 'react-icons/si';
import Link from 'next/link';

interface AboutSectionProps {
  isHomepage?: boolean;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ isHomepage = true }) => {
  const { about, loading: aboutLoading } = useAbout();
  const { config } = useConfig();
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);

  if (aboutLoading) {
    return (
      <section className="py-32 flex justify-center items-center">
        <div className="animate-pulse h-8 w-32 bg-slate-200 dark:bg-slate-700 rounded-xl" />
      </section>
    );
  }

  // If basic is empty or not yet loaded properly from DB
  if (!about || !about.basic || !about.basic.fullName) {
    return (
      <section className="py-24 sm:py-32 bg-[#F5F7FB] dark:bg-[#0F172A] flex flex-col justify-center items-center text-center px-4 border-y border-slate-200 dark:border-slate-800 border-dashed">
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">About Section is Empty</h3>
        <p className="text-slate-500 dark:text-slate-400">Please go to your Admin Panel and setup the About section to display it here.</p>
      </section>
    );
  }

  const { basic, professional } = about;
  const socials = config?.socialLinks;

  return (
    <section
      id="about"
      className={`relative py-24 sm:py-32 overflow-hidden transition-colors duration-300 bg-[#F5F7FB] dark:bg-[#0F172A]`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Title Area */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20 space-y-4">
          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest font-mono text-blue-600 dark:text-blue-400">
            About Me
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-slate-900 dark:text-white">
            {basic.tagline || 'My Story'}
          </h2>
          <div className="h-1 w-12 rounded-full mx-auto bg-blue-600 dark:bg-blue-500" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Left side: Photo */}
          <div className="lg:col-span-5">
            {basic.profileImage?.url && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 group"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 opacity-60" />
                <img
                  src={basic.profileImage.url}
                  alt={basic.fullName}
                  className="w-full h-[400px] sm:h-[480px] object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Name & Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent flex flex-col justify-end">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                  >
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-1">
                      {basic.fullName}
                    </h3>
                    <p className="text-sm sm:text-base font-medium text-blue-400">
                      {basic.tagline}
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Right side: Texts, Summary & Contact */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7 space-y-8"
          >
            {/* Professional Introduction */}
            <div className="space-y-4">
              <h3 className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">
                {basic.fullName}
              </h3>
              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300">
                {basic.shortBio || basic.mission}
              </p>
            </div>

            {/* Professional Summary */}
            {professional?.professionalSummary && (
              <div className="space-y-3 pt-2">
                <h4 className="text-sm font-extrabold uppercase tracking-wider font-mono text-slate-900 dark:text-white">
                  Professional Summary
                </h4>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {professional.professionalSummary}
                </p>
              </div>
            )}

            {/* Contact & Socials */}
            <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
              <h4 className="text-xs font-extrabold uppercase tracking-wider font-mono text-slate-900 dark:text-white">
                Contact & Connect
              </h4>
              <div className="flex flex-wrap items-center gap-6 text-sm">
                {basic.contactEmail && (
                  <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
                    <Mail className="h-4.5 w-4.5 text-blue-500" />
                    <span>{basic.contactEmail}</span>
                  </div>
                )}
                {basic.location && (
                  <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
                    <MapPin className="h-4.5 w-4.5 text-blue-500" />
                    <span>{basic.location}</span>
                  </div>
                )}
              </div>

              {basic.socialLinks && basic.socialLinks.length > 0 && (
                <div className="flex items-center gap-4 pt-2 flex-wrap">
                  {basic.socialLinks.map((link: any, idx: number) => {
                    const getPlatformStyles = (platform: string) => {
                      const p = platform.toLowerCase();
                      if (p === 'linkedin') return "bg-[#0077b5]/10 hover:bg-[#0077b5]/20 text-[#0077b5] dark:text-[#0077b5]";
                      if (p === 'twitter') return "bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 text-[#1DA1F2] dark:text-[#1DA1F2]";
                      if (p === 'youtube') return "bg-[#FF0000]/10 hover:bg-[#FF0000]/20 text-[#FF0000] dark:text-[#FF0000]";
                      if (p === 'facebook') return "bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] dark:text-[#1877F2]";
                      if (p === 'instagram') return "bg-[#E1306C]/10 hover:bg-[#E1306C]/20 text-[#E1306C] dark:text-[#E1306C]";
                      return "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white";
                    };

                    const getIcon = (platform: string) => {
                      const p = platform.toLowerCase();
                      if (p === 'github') return <FaGithub className="h-5 w-5" />;
                      if (p === 'linkedin') return <FaLinkedin className="h-5 w-5" />;
                      if (p === 'twitter') return <FaTwitter className="h-5 w-5" />;
                      if (p === 'facebook') return <FaFacebook className="h-5 w-5" />;
                      if (p === 'medium') return <SiMedium className="h-5 w-5" />;
                      if (p === 'youtube') return <FaYoutube className="h-5 w-5" />;
                      if (p === 'instagram') return <FaInstagram className="h-5 w-5" />;
                      return <FaGlobe className="h-5 w-5" />;
                    };

                    return (
                      <a 
                        key={idx}
                        href={link.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        title={link.platform}
                        className={`p-2 rounded-lg transition-colors ${getPlatformStyles(link.platform)}`}
                      >
                        {getIcon(link.platform)}
                      </a>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-6 flex flex-wrap gap-4">
              <Link
                href="/about"
                className="inline-flex items-center space-x-2.5 px-6 py-3 rounded-xl font-bold bg-white dark:bg-slate-800 text-[#0F172A] dark:text-white border border-[#E2E8F0] dark:border-slate-700 hover:border-[#2563EB] dark:hover:border-blue-500 hover:text-[#2563EB] dark:hover:text-blue-400 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-sm cursor-pointer"
              >
                <span>Read Full Story</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              {basic.resumeUrl && (
                <button
                  onClick={() => setIsResumeModalOpen(true)}
                  className="inline-flex items-center space-x-2.5 px-6 py-3 rounded-xl font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] dark:bg-blue-600 dark:hover:bg-blue-500 shadow-lg shadow-blue-500/20 dark:shadow-blue-900/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                >
                  <FileDown className="h-4 w-4" />
                  <span>রিজিউমি</span>
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Resume Modal */}
      <AnimatePresence>
        {isResumeModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl relative border border-slate-200 dark:border-slate-700"
            >
              <button
                onClick={() => setIsResumeModalOpen(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-700 rounded-full transition-colors"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileDown className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Resume Options</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Would you like to view my resume in browser or download it directly?</p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <a 
                  href={basic.resumeUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={() => setIsResumeModalOpen(false)}
                  className="flex items-center justify-center space-x-2 w-full py-3 px-4 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl font-semibold hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                >
                  <Eye className="h-5 w-5" />
                  <span>দেখুন</span>
                </a>
                
                <a 
                  href={basic.resumeUrl} 
                  download 
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsResumeModalOpen(false)}
                  className="flex items-center justify-center space-x-2 w-full py-3 px-4 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl font-semibold shadow-md transition-colors"
                >
                  <FileDown className="h-5 w-5" />
                  <span>ডাউনলোড করুন</span>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
