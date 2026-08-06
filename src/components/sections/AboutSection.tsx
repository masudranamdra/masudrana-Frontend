'use client';

import React, { useState } from 'react';
import { useAbout } from '../../context/AboutContext';
import { useConfig } from '../../context/ConfigContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FileDown, FileText, ArrowRight, Mail, MapPin, Eye, Globe, X, Briefcase, GitBranch, MessageCircle } from 'lucide-react';
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

            {/* Actions & Resume Button */}
            <div className="pt-6 flex flex-wrap items-center gap-4">
              {/* Primary Resume / CV Button */}
              <button
                onClick={() => setIsResumeModalOpen(true)}
                className="inline-flex items-center space-x-3 px-7 py-3.5 rounded-2xl font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 shadow-xl shadow-blue-500/25 dark:shadow-blue-900/40 hover:-translate-y-1 active:translate-y-0 transition-all duration-300 transform border border-blue-400/30 cursor-pointer group"
              >
                <div className="relative flex items-center justify-center">
                  <FileText className="h-5 w-5 text-blue-100 group-hover:scale-110 transition-transform" />
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-blue-700 animate-pulse" />
                </div>
                <span className="tracking-wide">Resume</span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-white/20 text-white tracking-widest font-mono">CV</span>
              </button>

              {/* Secondary Read Full Story Button */}
              <Link
                href="/about"
                className="inline-flex items-center space-x-2.5 px-7 py-3.5 rounded-2xl font-bold bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-slate-800 dark:text-white border border-slate-200/80 dark:border-slate-700/80 hover:border-blue-500 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 hover:-translate-y-1 active:translate-y-0 transition-all duration-300 shadow-md shadow-slate-200/50 dark:shadow-none cursor-pointer group"
              >
                <span>Read Full Story</span>
                <ArrowRight className="h-4 w-4 text-blue-500 group-hover:translate-x-1 transition-transform" />
              </Link>

              {/* Get In Touch Button */}
              <a
                href="#contact"
                className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-2xl font-bold bg-emerald-500/10 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Get In Touch</span>
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Interactive Resume Preview & Download Modal */}
      <AnimatePresence>
        {isResumeModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-4xl w-full shadow-2xl relative border border-slate-200 dark:border-slate-800 space-y-6 max-h-[90vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-2xl border border-blue-500/20">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
                      <span>Curriculum Vitae / Resume</span>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        Official PDF
                      </span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                      {basic.fullName} • {basic.tagline}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsResumeModalOpen(false)}
                  className="p-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal PDF Viewer / Preview Container */}
              <div className="flex-grow overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 min-h-[350px] sm:min-h-[480px] flex flex-col items-center justify-center relative">
                {basic.resumeUrl ? (
                  <iframe
                    src={basic.resumeUrl}
                    className="w-full h-full min-h-[380px] sm:min-h-[500px] rounded-2xl"
                    title={`${basic.fullName} Resume`}
                  />
                ) : (
                  <div className="text-center p-8 space-y-4 max-w-md">
                    <div className="w-14 h-14 mx-auto rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/20">
                      <FileText className="h-7 w-7" />
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white">No Resume Uploaded Yet</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      The portfolio owner has not attached a Resume document yet. Log into the Admin Panel under <span className="font-mono font-bold text-blue-500">About &gt; Basic Info</span> to upload your Resume PDF or paste a view link.
                    </p>
                  </div>
                )}
              </div>

              {/* Modal Actions Footer */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <p className="text-xs text-slate-500 dark:text-slate-400 text-center sm:text-left">
                  Previewing live document. Use the buttons to view full size or download directly.
                </p>

                {basic.resumeUrl && (
                  <div className="flex items-center space-x-3 w-full sm:w-auto">
                    <a
                      href={basic.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors text-xs cursor-pointer border border-slate-200 dark:border-slate-700"
                    >
                      <Eye className="h-4 w-4 text-blue-500" />
                      <span>Fullscreen View</span>
                    </a>

                    <a
                      href={basic.resumeUrl}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/20 text-xs transition-all cursor-pointer"
                    >
                      <FileDown className="h-4 w-4" />
                      <span>Download Resume (PDF)</span>
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
