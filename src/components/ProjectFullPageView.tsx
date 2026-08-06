'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Project } from '../types';
import { getAssetUrl } from '../lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, ArrowLeft, ExternalLink, FileText, 
  CheckCircle2, Globe, Briefcase, Calendar, 
  Code2, Image as ImageIcon, Eye, Layers, Sparkles, 
  ChevronDown, ChevronUp
} from 'lucide-react';

const GithubIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

interface ProjectFullPageViewProps {
  project: Project | null;
  onClose: () => void;
  defaultTab?: 'overview' | 'document' | 'links';
}

export const ProjectFullPageView: React.FC<ProjectFullPageViewProps> = ({
  project,
  onClose,
  defaultTab = 'overview'
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'document' | 'links'>(defaultTab);
  const [selectedLightboxImage, setSelectedLightboxImage] = useState<string | null>(null);
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);

  // Mobile navbar auto-hide/show on scroll state
  const [isMobileHeaderVisible, setIsMobileHeaderVisible] = useState(true);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    if (defaultTab) setActiveTab(defaultTab);
  }, [defaultTab]);

  // Handle ESC key & body scroll locking
  useEffect(() => {
    if (!project) return;

    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  // Scroll direction detection for Mobile Navbar
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const currentScrollY = e.currentTarget.scrollTop;
    const previousScrollY = lastScrollYRef.current;

    if (currentScrollY > 50 && currentScrollY > previousScrollY + 5) {
      // Scrolling DOWN -> Hide Mobile Navbar
      setIsMobileHeaderVisible(false);
    } else if (currentScrollY < previousScrollY - 5 || currentScrollY <= 20) {
      // Scrolling UP -> Show Mobile Navbar
      setIsMobileHeaderVisible(true);
    }

    lastScrollYRef.current = currentScrollY;
  };

  if (!project) return null;

  const projectImage = getAssetUrl(project.image?.url);
  const galleryImages = project.documentDetails?.images || [];
  const fullDescription = project.description || '';
  const isDescriptionLong = fullDescription.length > 250;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 z-[250] w-full h-full min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 font-sans flex flex-col lg:flex-row overflow-hidden"
      >
        
        {/* ========================================================================= */}
        {/* DESKTOP EXECUTIVE SIDEBAR (Visible on lg screens: w-80 / 320px)            */}
        {/* ========================================================================= */}
        <aside className="hidden lg:flex w-80 xl:w-96 shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 flex-col justify-between h-full z-30 shadow-lg relative">
          <div className="p-6 space-y-6 overflow-y-auto no-scrollbar flex-grow">
            
            {/* Prominent Back / Exit Button */}
            <button
              onClick={onClose}
              className="w-full py-3 px-4 rounded-2xl font-bold bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 text-blue-600 dark:text-blue-400 transition-all text-xs flex items-center justify-between cursor-pointer border border-blue-200/60 dark:border-blue-900/60 group shadow-sm"
            >
              <div className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                <span className="font-mono uppercase tracking-wider">Back to Projects</span>
              </div>
              <X className="h-4 w-4 opacity-70 group-hover:opacity-100" />
            </button>

            {/* Project Quick Profile */}
            <div className="space-y-3 pt-2">
              <span className="px-3 py-1 rounded-full bg-blue-600/10 text-blue-600 dark:text-blue-400 text-[10px] font-extrabold uppercase font-mono tracking-widest border border-blue-500/20">
                {project.category}
              </span>
              <h2 className="text-xl xl:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
                {project.title}
              </h2>
            </div>

            {/* Navigation Links Menu */}
            <div className="space-y-2 pt-2 border-t border-slate-200/60 dark:border-slate-800">
              <span className="text-[10px] font-extrabold uppercase tracking-widest font-mono text-slate-400 block px-1">
                Project Sections
              </span>

              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full text-left px-4 py-3 rounded-xl font-bold text-xs flex items-center space-x-3 transition-all cursor-pointer ${
                  activeTab === 'overview'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Layers className="h-4 w-4 shrink-0" />
                <span>Overview & Features</span>
              </button>

              <button
                onClick={() => setActiveTab('document')}
                className={`w-full text-left px-4 py-3 rounded-xl font-bold text-xs flex items-center space-x-3 transition-all cursor-pointer ${
                  activeTab === 'document'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <FileText className="h-4 w-4 shrink-0" />
                <span>Case Study & Gallery</span>
              </button>

              <button
                onClick={() => setActiveTab('links')}
                className={`w-full text-left px-4 py-3 rounded-xl font-bold text-xs flex items-center space-x-3 transition-all cursor-pointer ${
                  activeTab === 'links'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <ExternalLink className="h-4 w-4 shrink-0" />
                <span>Live Demo & Links</span>
              </button>
            </div>

            {/* Metadata Summary Cards */}
            <div className="space-y-3 pt-4 border-t border-slate-200/60 dark:border-slate-800 text-xs">
              {project.clientName && (
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200/60 dark:border-slate-800 flex items-center space-x-3">
                  <Globe className="h-4 w-4 text-blue-500 shrink-0" />
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Client</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{project.clientName}</span>
                  </div>
                </div>
              )}

              {project.role && (
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200/60 dark:border-slate-800 flex items-center space-x-3">
                  <Briefcase className="h-4 w-4 text-indigo-500 shrink-0" />
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Role</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{project.role}</span>
                  </div>
                </div>
              )}

              {project.timeline && (
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200/60 dark:border-slate-800 flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-emerald-500 shrink-0" />
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Timeline</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{project.timeline}</span>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Sidebar Footer Action Buttons */}
          <div className="p-6 border-t border-slate-200/60 dark:border-slate-800 space-y-2 bg-slate-50/50 dark:bg-slate-950/50">
            {project.demoLink && (
              <a
                href={project.demoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all text-xs flex items-center justify-center space-x-2 shadow-md shadow-blue-500/20"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Launch Live Project</span>
              </a>
            )}

            {project.githubLink && (
              <a
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl font-bold bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white transition-all text-xs flex items-center justify-center space-x-2 border border-slate-700"
              >
                <GithubIcon className="h-4 w-4" />
                <span>Source Repository</span>
              </a>
            )}
          </div>
        </aside>

        {/* ========================================================================= */}
        {/* MOBILE SMART NAVBAR (Hides on Scroll Down, Shows on Scroll Up)             */}
        {/* ========================================================================= */}
        <header 
          className={`lg:hidden sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 py-3 flex items-center justify-between shadow-sm transition-transform duration-300 ${
            isMobileHeaderVisible ? 'translate-y-0' : '-translate-y-full'
          }`}
        >
          <button
            onClick={onClose}
            className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl font-bold bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 text-xs cursor-pointer border border-blue-200/60 dark:border-blue-900/60"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="font-mono text-[11px] uppercase">Back</span>
          </button>

          <span className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[170px]">
            {project.title}
          </span>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-full transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        {/* ========================================================================= */}
        {/* MAIN SCROLLABLE CANVAS (Natively scrollable on mobile touch devices)      */}
        {/* ========================================================================= */}
        <main 
          onScroll={handleScroll}
          className="flex-grow overflow-y-auto overflow-x-hidden p-4 sm:p-8 lg:p-12 space-y-8 bg-[#F8FAFC] dark:bg-[#0B0F19] pb-32 sm:pb-36 lg:pb-12 touch-pan-y"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          <div className="max-w-5xl mx-auto space-y-8">

            {/* High-Resolution Hero Banner */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-6">
              
              <div className="relative aspect-[16/9] sm:aspect-[21/9] bg-slate-950 overflow-hidden">
                <img
                  src={projectImage}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent opacity-80" />
                
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-8 sm:left-8 sm:right-8 space-y-2">
                  <span className="px-3 py-1 rounded-full bg-blue-600 text-white text-[10px] sm:text-xs font-extrabold uppercase font-mono tracking-widest shadow-md">
                    {project.category}
                  </span>
                  <h1 className="text-xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                    {project.title}
                  </h1>
                </div>
              </div>

              {/* Technologies Used Bar */}
              <div className="p-5 sm:p-8 space-y-3 border-t border-slate-200/60 dark:border-slate-800/60">
                <span className="text-[10px] font-extrabold uppercase font-mono tracking-widest text-slate-400 block">
                  Tech Stack & Architecture
                </span>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold text-slate-800 dark:text-slate-200 shadow-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* Mobile Tab Controls */}
            <div className="lg:hidden flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 rounded-xl font-bold text-xs whitespace-nowrap transition-all ${
                  activeTab === 'overview'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
                }`}
              >
                Overview
              </button>

              <button
                onClick={() => setActiveTab('document')}
                className={`px-4 py-2 rounded-xl font-bold text-xs whitespace-nowrap transition-all ${
                  activeTab === 'document'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
                }`}
              >
                Case Study
              </button>

              <button
                onClick={() => setActiveTab('links')}
                className={`px-4 py-2 rounded-xl font-bold text-xs whitespace-nowrap transition-all ${
                  activeTab === 'links'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
                }`}
              >
                Links
              </button>
            </div>

            {/* Content Tab 1: Overview & Summary */}
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-8"
              >
                {/* Executive Summary Section with Expand Option */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Project Summary</h3>
                  
                  <div className="relative">
                    <p className={`text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300 font-normal whitespace-pre-wrap ${
                      !isSummaryExpanded && isDescriptionLong ? 'line-clamp-6' : ''
                    }`}>
                      {fullDescription}
                    </p>

                    {isDescriptionLong && (
                      <button
                        onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}
                        className="mt-3 inline-flex items-center space-x-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                      >
                        <span>{isSummaryExpanded ? 'Show Less' : 'Read Full Description'}</span>
                        {isSummaryExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                      </button>
                    )}
                  </div>
                </div>

                {project.activities && project.activities.length > 0 && (
                  <div className="p-5 sm:p-6 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-4">
                    <h4 className="text-xs font-extrabold uppercase font-mono tracking-wider text-blue-600 dark:text-blue-400">
                      Key Highlights & Deliverables
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {project.activities.map((act, idx) => (
                        <div key={idx} className="flex items-start space-x-3 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200">{act}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Content Tab 2: Case Study & Gallery */}
            {activeTab === 'document' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-8"
              >
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Detailed Technical Case Study</h3>
                  <p className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300 font-normal whitespace-pre-wrap">
                    {project.documentDetails?.text || "Comprehensive case study details for this project can be configured directly inside your Admin Panel under the Project edit menu."}
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  <h4 className="text-xs font-extrabold uppercase font-mono tracking-wider text-blue-600 dark:text-blue-400">
                    Project Screenshot & Document Gallery
                  </h4>

                  {galleryImages.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {galleryImages.map((imgSrc, idx) => {
                        const url = getAssetUrl(imgSrc);
                        return (
                          <div
                            key={idx}
                            onClick={() => setSelectedLightboxImage(url)}
                            className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-slate-800 group cursor-pointer shadow-sm hover:border-blue-500 transition-all"
                          >
                            <img src={url} alt={`Screenshot ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Eye className="h-6 w-6 text-white" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-8 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
                      No additional document screenshots uploaded for this project.
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Content Tab 3: Links */}
            {activeTab === 'links' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-6"
              >
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Project Access Links</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.demoLink && (
                    <a
                      href={project.demoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-all flex items-center space-x-4 group"
                    >
                      <div className="p-3 bg-blue-600 text-white rounded-xl shadow-md group-hover:scale-105 transition-transform">
                        <ExternalLink className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-bold text-blue-900 dark:text-blue-200 text-sm">Live Demo</p>
                        <p className="text-xs text-blue-700 dark:text-blue-400">Visit live web application</p>
                      </div>
                    </a>
                  )}

                  {project.githubLink && (
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center space-x-4 group"
                    >
                      <div className="p-3 bg-slate-900 text-white rounded-xl shadow-md group-hover:scale-105 transition-transform">
                        <GithubIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white text-sm">Source Code</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">View source code on GitHub</p>
                      </div>
                    </a>
                  )}

                  {project.documentLink && (
                    <a
                      href={project.documentLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-all flex items-center space-x-4 group sm:col-span-2"
                    >
                      <div className="p-3 bg-emerald-600 text-white rounded-xl shadow-md group-hover:scale-105 transition-transform">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-bold text-emerald-900 dark:text-emerald-200 text-sm">External Documentation</p>
                        <p className="text-xs text-emerald-700 dark:text-emerald-400">View external documentation file</p>
                      </div>
                    </a>
                  )}
                </div>
              </motion.div>
            )}

          </div>
        </main>

        {/* Mobile Fixed Bottom Action Bar */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 p-3 flex items-center justify-between shadow-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white rounded-xl text-xs font-bold font-mono"
          >
            Close Page
          </button>

          {project.demoLink && (
            <a
              href={project.demoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-md inline-flex items-center space-x-1.5"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Live Demo</span>
            </a>
          )}
        </div>

        {/* Lightbox Screenshot Zoom Modal */}
        <AnimatePresence>
          {selectedLightboxImage && (
            <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative max-w-5xl w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-800"
              >
                <button
                  onClick={() => setSelectedLightboxImage(null)}
                  className="absolute top-4 right-4 z-10 p-2 bg-black/60 text-white rounded-full hover:bg-black transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="aspect-video bg-black flex items-center justify-center overflow-hidden">
                  <img
                    src={selectedLightboxImage}
                    alt="Full View Screenshot"
                    className="max-h-[80vh] w-auto object-contain"
                  />
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </motion.div>
    </AnimatePresence>
  );
};
