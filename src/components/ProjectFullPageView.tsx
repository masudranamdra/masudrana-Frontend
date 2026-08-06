'use client';

import React, { useEffect, useState } from 'react';
import { Project } from '../types';
import { getAssetUrl } from '../lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, ArrowLeft, ExternalLink, FileText, 
  CheckCircle2, Globe, Briefcase, Calendar, 
  Code2, Image as ImageIcon, Eye, Sparkles, Layers, Share2
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

  useEffect(() => {
    if (defaultTab) setActiveTab(defaultTab);
  }, [defaultTab]);

  // Handle ESC key & browser back button popstate to close full page view naturally
  useEffect(() => {
    if (!project) return;

    // Prevent body scrolling behind the full page view
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

  if (!project) return null;

  const projectImage = getAssetUrl(project.image?.url);
  const galleryImages = project.documentDetails?.images || [];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 25 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 z-[150] w-full h-full min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F19] text-[#0F172A] dark:text-slate-100 overflow-y-auto font-sans flex flex-col"
      >
        {/* Sticky Top Navigation Bar */}
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-sm">
          {/* Back Button */}
          <button
            onClick={onClose}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors text-xs cursor-pointer border border-slate-200 dark:border-slate-700"
          >
            <ArrowLeft className="h-4 w-4 text-blue-500" />
            <span className="font-mono uppercase tracking-wider text-[11px]">Back to Projects</span>
          </button>

          {/* Project Title Snippet */}
          <div className="hidden md:flex items-center space-x-3 text-xs font-medium text-slate-500 dark:text-slate-400">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-mono font-bold uppercase text-[10px]">
              {project.category}
            </span>
            <span className="truncate max-w-[260px] font-bold text-slate-900 dark:text-white">
              {project.title}
            </span>
          </div>

          {/* Quick Actions & Close Button */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {project.demoLink && (
              <a
                href={project.demoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center space-x-2 px-4 py-2 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 text-xs transition-all cursor-pointer"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>Live Demo</span>
              </a>
            )}

            {project.githubLink && (
              <a
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center space-x-2 px-4 py-2 rounded-xl font-bold bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white text-xs transition-all cursor-pointer border border-slate-700"
              >
                <GithubIcon className="h-3.5 w-3.5" />
                <span>Code</span>
              </a>
            )}

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors cursor-pointer"
              title="Close Page"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* Main Full Page Scrollable Body */}
        <main className="flex-grow pb-24 sm:pb-28">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 space-y-10">

            {/* Hero Cover Banner & Identity Header */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none space-y-6">
              
              {/* Cover Image */}
              <div className="relative aspect-[16/9] sm:aspect-[21/9] bg-slate-950 overflow-hidden">
                <img
                  src={projectImage}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-80" />
                
                <div className="absolute bottom-6 left-6 right-6 sm:bottom-10 sm:left-10 sm:right-10 space-y-2">
                  <span className="px-3 py-1 rounded-full bg-blue-600 text-white text-[10px] sm:text-xs font-extrabold uppercase font-mono tracking-widest shadow-md">
                    {project.category}
                  </span>
                  <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                    {project.title}
                  </h1>
                </div>
              </div>

              {/* Project Meta Bar (Client, Role, Timeline, Tech Tags) */}
              <div className="p-6 sm:p-10 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-4 border-b border-slate-200/60 dark:border-slate-800/60 text-xs sm:text-sm">
                  {project.clientName && (
                    <div className="flex items-center space-x-3">
                      <div className="p-2.5 bg-blue-500/10 text-blue-500 rounded-xl">
                        <Globe className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-slate-400 block">Client</span>
                        <span className="font-bold text-slate-900 dark:text-white">{project.clientName}</span>
                      </div>
                    </div>
                  )}

                  {project.role && (
                    <div className="flex items-center space-x-3">
                      <div className="p-2.5 bg-indigo-500/10 text-indigo-500 rounded-xl">
                        <Briefcase className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-slate-400 block">My Role</span>
                        <span className="font-bold text-slate-900 dark:text-white">{project.role}</span>
                      </div>
                    </div>
                  )}

                  {project.timeline && (
                    <div className="flex items-center space-x-3">
                      <div className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-xl">
                        <Calendar className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-slate-400 block">Timeline</span>
                        <span className="font-bold text-slate-900 dark:text-white">{project.timeline}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Tech Stack Pills */}
                <div className="space-y-2">
                  <span className="text-[10px] font-extrabold uppercase font-mono tracking-widest text-slate-400 block">
                    Technologies & Frameworks Used
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold text-slate-700 dark:text-slate-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* Navigation Tabs for Details */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none space-y-8">
              
              <div className="flex items-center space-x-3 border-b border-slate-200/60 dark:border-slate-800 pb-4 overflow-x-auto no-scrollbar">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer whitespace-nowrap flex items-center space-x-2 ${
                    activeTab === 'overview'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Layers className="h-4 w-4" />
                  <span>Overview & Key Features</span>
                </button>

                <button
                  onClick={() => setActiveTab('document')}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer whitespace-nowrap flex items-center space-x-2 ${
                    activeTab === 'document'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <FileText className="h-4 w-4" />
                  <span>Case Study & Gallery</span>
                </button>

                <button
                  onClick={() => setActiveTab('links')}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer whitespace-nowrap flex items-center space-x-2 ${
                    activeTab === 'links'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Live Links & Code Repo</span>
                </button>
              </div>

              {/* Tab 1: Overview */}
              {activeTab === 'overview' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Project Description</h3>
                    <p className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300 font-light whitespace-pre-wrap">
                      {project.description}
                    </p>
                  </div>

                  {project.activities && project.activities.length > 0 && (
                    <div className="p-6 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-4">
                      <h4 className="text-xs font-extrabold uppercase font-mono tracking-wider text-blue-600 dark:text-blue-400">
                        Key Activities & Achievements
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

              {/* Tab 2: Case Study & Gallery */}
              {activeTab === 'document' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Case Study & Technical Workflow</h3>
                    <p className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300 font-light whitespace-pre-wrap">
                      {project.documentDetails?.text || "Detailed case study documentation for this project is available. Setup the documentDetails.text field in your Admin Panel to customize this section further."}
                    </p>
                  </div>

                  <div className="space-y-4 pt-2">
                    <h4 className="text-xs font-extrabold uppercase font-mono tracking-wider text-blue-600 dark:text-blue-400">
                      Document & Screenshot Gallery
                    </h4>

                    {galleryImages.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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
                        No additional screenshot images attached.
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Tab 3: Links */}
              {activeTab === 'links' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Project Access & Links</h3>

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
                          <p className="text-xs text-blue-700 dark:text-blue-400">Visit live deployed web application</p>
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
                          <p className="text-xs text-slate-500 dark:text-slate-400">View code repository on GitHub</p>
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
                          <p className="text-xs text-emerald-700 dark:text-emerald-400">View external documentation or Drive file</p>
                        </div>
                      </a>
                    )}
                  </div>
                </motion.div>
              )}

            </div>

          </div>
        </main>

        {/* Mobile Sticky Bottom Bar */}
        <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 p-3 flex items-center justify-between shadow-lg">
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
              className="px-6 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-md inline-flex items-center space-x-2"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Live Demo</span>
            </a>
          )}
        </div>

        {/* Lightbox Image Preview Modal */}
        <AnimatePresence>
          {selectedLightboxImage && (
            <div className="fixed inset-0 z-[180] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
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
                    alt="Enlarged screenshot"
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
