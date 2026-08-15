'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import API, { getAssetUrl } from '../../lib/api';
import { Project } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, X, Eye, ArrowRight, FileText, CheckCircle2, LayoutTemplate, Briefcase, Calendar, Globe, Code2, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import { ProjectFullPageView } from '../ProjectFullPageView';
import { FormattedText } from '../FormattedText';

const GithubIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export const ProjectsSection: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Unified Modal State
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'document' | 'links'>('overview');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await API.get('/projects');
        if (res.data && res.data.success) {
          setProjects(res.data.data);
        }
      } catch (error) {
        console.error('Failed to load projects:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const openProjectModal = (project: Project, defaultTab: 'overview' | 'document' = 'overview') => {
    setSelectedProject(project);
    setActiveTab(defaultTab);
  };

  const featuredProjects = projects.filter(p => p.isFeatured).slice(0, 6);
  const displayProjects = featuredProjects.length > 0 ? featuredProjects : projects.slice(0, 6);

  if (loading) {
    return (
      <section className="py-32 bg-[#F5F7FB] dark:bg-[#0F172A]" id="projects">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="h-6 w-36 bg-slate-200 dark:bg-slate-700 animate-pulse rounded-md mx-auto mb-6" />
          <div className="flex gap-8 overflow-hidden">
            {[1, 2, 3].map((n) => (
              <div key={n} className="min-w-[320px] h-72 bg-slate-200/50 dark:bg-slate-700/50 animate-pulse rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="relative py-32 bg-[#F5F7FB] dark:bg-[#0F172A] text-[#0F172A] dark:text-white border-t border-b border-[#E2E8F0] dark:border-slate-800 overflow-hidden transition-colors duration-300">
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-[100px] pointer-events-none transition-colors duration-300" />
      <div className="absolute bottom-1/4 left-0 w-[550px] h-[550px] bg-sky-500/10 dark:bg-sky-500/15 rounded-full blur-[110px] pointer-events-none transition-colors duration-300" />

      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-[#2563EB] dark:text-blue-400 font-mono">Creative Works</span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#0F172A] dark:text-white tracking-tight leading-tight transition-colors duration-300">
            Featured Works
          </h2>
          <div className="h-1 w-12 bg-[#2563EB] dark:bg-blue-500 rounded-full mx-auto" />
          <p className="text-[#64748B] dark:text-slate-400 text-sm max-w-lg mx-auto pt-4">
            Swipe or drag through some of my best projects. Discover how I turn complex problems into elegant, scalable solutions.
          </p>
        </div>

        {/* Scrollable / Draggable Container */}
        <div className="overflow-x-auto pb-10 snap-x snap-mandatory no-scrollbar scroll-smooth">
          <div className="flex gap-6 sm:gap-8 px-4 w-max">
            {displayProjects.map((project, index) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="snap-center min-w-[85vw] sm:min-w-[400px] max-w-[85vw] sm:max-w-[400px] group rounded-3xl bg-white dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 overflow-hidden flex flex-col hover:border-[#2563EB]/50 dark:hover:border-[#2563EB]/50 transition-all duration-300 shadow-lg shadow-slate-200/50 dark:shadow-none hover:shadow-xl pointer-events-auto"
              >
                <div className="relative aspect-video overflow-hidden bg-slate-900">
                  <img
                    src={getAssetUrl(project.image?.url)}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 select-none pointer-events-none"
                    draggable={false}
                  />
                  <div className="absolute inset-0 bg-[#0F172A]/80 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition-opacity duration-300 backdrop-blur-sm">
                    <button
                      onClick={() => openProjectModal(project, 'overview')}
                      className="p-3 bg-white hover:bg-slate-100 text-[#0F172A] rounded-xl shadow-lg transition-transform hover:scale-110 cursor-pointer"
                      title="View Details"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => openProjectModal(project, 'document')}
                      className="p-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl shadow-lg transition-transform hover:scale-110 cursor-pointer"
                      title="View Documents"
                    >
                      <FileText className="h-5 w-5" />
                    </button>
                    {project.githubLink && (
                      <a
                        href={project.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-transform hover:scale-110 cursor-pointer"
                        title="GitHub Code"
                      >
                        <GithubIcon className="h-5 w-5" />
                      </a>
                    )}
                    {project.demoLink && (
                      <a
                        href={project.demoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-transform hover:scale-110 cursor-pointer"
                        title="Live Demo"
                      >
                        <ExternalLink className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="p-6 sm:p-8 flex flex-col flex-grow space-y-4">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold tracking-widest text-blue-600 dark:text-blue-400 uppercase font-mono">
                      {project.category}
                    </span>
                    <h3 className="text-slate-900 dark:text-white font-extrabold text-xl sm:text-2xl group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {project.title}
                    </h3>
                    {project.subtitle && (
                      <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                        {project.subtitle}
                      </p>
                    )}
                  </div>
                  
                  {/* 3-line description snippet */}
                  <div className="text-slate-600 dark:text-slate-300 text-sm line-clamp-3 leading-relaxed flex-grow font-normal">
                    <FormattedText content={project.description} />
                  </div>

                  <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                    {project.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="px-3 py-1 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-700 dark:text-slate-300 font-mono font-medium">
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 3 && (
                      <span className="px-3 py-1 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-500 dark:text-slate-400 font-mono font-medium">
                        +{project.tags.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Mobile Direct Action Buttons (Always visible on mobile touch devices) */}
                  <div className="flex sm:hidden items-center justify-between gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                    <button
                      onClick={() => openProjectModal(project, 'overview')}
                      className="flex-1 py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 shadow-sm cursor-pointer"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Details</span>
                    </button>

                    <button
                      onClick={() => openProjectModal(project, 'document')}
                      className="py-2.5 px-3 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center justify-center space-x-1 border border-slate-200 dark:border-slate-700 cursor-pointer"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      <span>Case Study</span>
                    </button>

                    {project.demoLink && (
                      <a
                        href={project.demoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl flex items-center justify-center cursor-pointer"
                        title="Live Demo"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>

                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="flex justify-center pt-8">
          <Link
            href="/projects"
            className="inline-flex items-center space-x-2 px-8 py-4 rounded-2xl font-bold bg-white dark:bg-slate-800 text-[#2563EB] dark:text-blue-400 border border-[#E2E8F0] dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-md cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>View All Projects</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>

        {/* Full Page Project View */}
        {selectedProject && (
          <ProjectFullPageView
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
            defaultTab={activeTab}
          />
        )}

      </div>
    </section>
  );
};
