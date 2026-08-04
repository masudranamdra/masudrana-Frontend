'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import API, { getAssetUrl } from '../../lib/api';
import { Project } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, X, Eye, ArrowRight, FileText, CheckCircle2, LayoutTemplate, Briefcase, Calendar, Globe, Code2, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';

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
                    <span className="text-[10px] font-bold tracking-widest text-[#2563EB] dark:text-blue-400 uppercase font-mono">
                      {project.category}
                    </span>
                    <h3 className="text-[#0F172A] dark:text-white font-extrabold text-xl sm:text-2xl group-hover:text-[#2563EB] dark:group-hover:text-blue-400 transition-colors">
                      {project.title}
                    </h3>
                  </div>
                  
                  <p className="text-[#334155] dark:text-slate-300 text-sm line-clamp-3 leading-relaxed flex-grow font-light">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-4 border-t border-[#E2E8F0] dark:border-slate-700">
                    {project.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="px-3 py-1 bg-slate-50 dark:bg-slate-900/50 border border-[#E2E8F0] dark:border-slate-700/50 rounded-lg text-xs text-[#334155] dark:text-slate-300 font-mono font-medium">
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 3 && (
                      <span className="px-3 py-1 bg-slate-50 dark:bg-slate-900/50 border border-[#E2E8F0] dark:border-slate-700/50 rounded-lg text-xs text-[#64748B] dark:text-slate-400 font-mono font-medium">
                        +{project.tags.length - 3}
                      </span>
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

        {/* Unified Powerful Modal */}
        <AnimatePresence>
          {selectedProject && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedProject(null)}
                className="absolute inset-0 bg-[#0F172A]/70 backdrop-blur-xl"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-700/60 rounded-2xl md:rounded-3xl max-w-6xl w-full h-[90vh] md:h-[70vh] lg:h-[70vh] overflow-hidden shadow-2xl z-10 flex flex-col md:flex-row"
              >
                {/* Left Side: Sticky Meta & Image */}
                <div className="w-full md:w-5/12 bg-slate-50 dark:bg-slate-950/50 border-r border-[#E2E8F0] dark:border-slate-800 flex flex-col">
                  <div className="relative h-48 md:h-64 bg-slate-950 shrink-0">
                    <img
                      src={getAssetUrl(selectedProject.image?.url)}
                      alt={selectedProject.title}
                      className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                    
                    <button
                      onClick={() => setSelectedProject(null)}
                      className="absolute top-4 right-4 md:hidden p-2 bg-black/40 text-white rounded-full backdrop-blur-md cursor-pointer"
                    >
                      <X className="h-5 w-5" />
                    </button>
                    
                    <div className="absolute bottom-6 left-6 right-6">
                      <span className="text-[10px] font-bold tracking-widest text-blue-400 uppercase font-mono mb-2 block">
                        {selectedProject.category}
                      </span>
                      <h3 className="text-2xl font-extrabold text-white">
                        {selectedProject.title}
                      </h3>
                    </div>
                  </div>

                  <div className="p-6 md:p-8 flex-grow overflow-y-auto no-scrollbar space-y-6">
                    <div className="space-y-4">
                      {selectedProject.clientName && (
                        <div className="flex items-center gap-3 text-sm">
                          <Globe className="h-4 w-4 text-[#64748B] dark:text-slate-500" />
                          <div>
                            <p className="text-[#64748B] dark:text-slate-500 text-[10px] uppercase font-bold tracking-wider">Client</p>
                            <p className="text-[#0F172A] dark:text-white font-medium">{selectedProject.clientName}</p>
                          </div>
                        </div>
                      )}
                      {selectedProject.role && (
                        <div className="flex items-center gap-3 text-sm">
                          <Briefcase className="h-4 w-4 text-[#64748B] dark:text-slate-500" />
                          <div>
                            <p className="text-[#64748B] dark:text-slate-500 text-[10px] uppercase font-bold tracking-wider">Role</p>
                            <p className="text-[#0F172A] dark:text-white font-medium">{selectedProject.role}</p>
                          </div>
                        </div>
                      )}
                      {selectedProject.timeline && (
                        <div className="flex items-center gap-3 text-sm">
                          <Calendar className="h-4 w-4 text-[#64748B] dark:text-slate-500" />
                          <div>
                            <p className="text-[#64748B] dark:text-slate-500 text-[10px] uppercase font-bold tracking-wider">Timeline</p>
                            <p className="text-[#0F172A] dark:text-white font-medium">{selectedProject.timeline}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-6 border-t border-[#E2E8F0] dark:border-slate-800">
                      <h4 className="text-[11px] font-bold text-[#0F172A] dark:text-white uppercase tracking-wider font-mono mb-3">
                        Tech Stack
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.tags.map((tag) => (
                          <span key={tag} className="px-2.5 py-1 bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-700 rounded-lg text-xs text-[#334155] dark:text-slate-300 font-mono font-medium shadow-sm">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side: Tabbed Content */}
                <div className="w-full md:w-7/12 flex flex-col h-full bg-white dark:bg-slate-900">
                  <div className="hidden md:flex justify-end p-4 shrink-0">
                    <button
                      onClick={() => setSelectedProject(null)}
                      className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-[#0F172A] dark:text-white rounded-full transition-all cursor-pointer"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="px-6 md:px-10 pt-4 shrink-0">
                    <nav className="flex space-x-6 border-b border-[#E2E8F0] dark:border-slate-800 overflow-x-auto no-scrollbar pb-1">
                      <button
                        onClick={() => setActiveTab('overview')}
                        className={`pb-4 text-sm font-bold transition-colors whitespace-nowrap border-b-2 ${activeTab === 'overview' ? 'border-[#2563EB] text-[#2563EB] dark:border-blue-500 dark:text-blue-400' : 'border-transparent text-[#64748B] hover:text-[#0F172A] dark:text-slate-400 dark:hover:text-white'}`}
                      >
                        <span className="flex items-center gap-2"><LayoutTemplate className="h-4 w-4" /> Overview</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('document')}
                        className={`pb-4 text-sm font-bold transition-colors whitespace-nowrap border-b-2 ${activeTab === 'document' ? 'border-[#2563EB] text-[#2563EB] dark:border-blue-500 dark:text-blue-400' : 'border-transparent text-[#64748B] hover:text-[#0F172A] dark:text-slate-400 dark:hover:text-white'}`}
                      >
                        <span className="flex items-center gap-2"><FileText className="h-4 w-4" /> Document</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('links')}
                        className={`pb-4 text-sm font-bold transition-colors whitespace-nowrap border-b-2 ${activeTab === 'links' ? 'border-[#2563EB] text-[#2563EB] dark:border-blue-500 dark:text-blue-400' : 'border-transparent text-[#64748B] hover:text-[#0F172A] dark:text-slate-400 dark:hover:text-white'}`}
                      >
                        <span className="flex items-center gap-2"><LinkIcon className="h-4 w-4" /> Links</span>
                      </button>
                    </nav>
                  </div>

                  <div className="p-6 md:px-10 md:pb-10 flex-grow overflow-y-auto no-scrollbar">
                    <AnimatePresence mode="wait">
                      
                      {activeTab === 'overview' && (
                        <motion.div
                          key="overview"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="space-y-8"
                        >
                          <div className="prose prose-slate dark:prose-invert max-w-none">
                            <h4 className="text-lg font-bold text-[#0F172A] dark:text-white mb-3">About the Project</h4>
                            <p className="text-[15px] leading-relaxed text-[#334155] dark:text-slate-300 font-light whitespace-pre-wrap">
                              {selectedProject.description}
                            </p>
                          </div>

                          {selectedProject.activities && selectedProject.activities.length > 0 && (
                            <div className="bg-[#F5F7FB] dark:bg-slate-800/40 p-6 rounded-2xl border border-[#E2E8F0] dark:border-slate-700/50">
                              <h4 className="text-sm font-bold text-[#0F172A] dark:text-white mb-4 uppercase tracking-wider font-mono">Key Activities</h4>
                              <ul className="grid grid-cols-1 gap-3">
                                {selectedProject.activities.map((act, idx) => (
                                  <li key={idx} className="flex items-start gap-3">
                                    <CheckCircle2 className="h-4.5 w-4.5 text-[#2563EB] dark:text-blue-500 shrink-0 mt-0.5" />
                                    <span className="text-sm text-[#334155] dark:text-slate-300 font-medium">{act}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </motion.div>
                      )}

                      {activeTab === 'document' && (
                        <motion.div
                          key="document"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="space-y-8"
                        >
                          <div className="prose prose-slate dark:prose-invert max-w-none">
                            <h4 className="text-lg font-bold text-[#0F172A] dark:text-white mb-3 flex items-center gap-2">
                              <Code2 className="h-5 w-5 text-[#2563EB]" /> Full Workflow & Case Study
                            </h4>
                            <p className="text-[15px] leading-relaxed text-[#334155] dark:text-slate-300 font-light whitespace-pre-wrap">
                              {selectedProject.documentDetails?.text || "No detailed documents provided yet. Setup the 'documentDetails.text' field in the admin panel to display a comprehensive case study here."}
                            </p>
                          </div>

                          <div className="space-y-4">
                            <h4 className="text-sm font-bold text-[#0F172A] dark:text-white uppercase tracking-wider font-mono flex items-center gap-2">
                              <ImageIcon className="h-4 w-4 text-[#2563EB]" /> Document Gallery
                            </h4>
                            {selectedProject.documentDetails?.images && selectedProject.documentDetails.images.length > 0 ? (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {selectedProject.documentDetails.images.map((imgSrc, idx) => (
                                  <div key={idx} className="rounded-xl overflow-hidden border border-[#E2E8F0] dark:border-slate-700 bg-slate-100 dark:bg-slate-900 shadow-sm group relative">
                                    <img src={getAssetUrl(imgSrc)} alt={`Gallery item ${idx + 1}`} className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                      <Eye className="h-6 w-6 text-white" />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="w-full py-10 flex flex-col items-center justify-center border-2 border-dashed border-[#E2E8F0] dark:border-slate-700 rounded-2xl bg-[#F5F7FB] dark:bg-slate-900/30">
                                <ImageIcon className="h-8 w-8 text-slate-300 dark:text-slate-600 mb-2" />
                                <p className="text-xs text-[#64748B] dark:text-slate-400 font-medium">No document images found.</p>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}

                      {activeTab === 'links' && (
                        <motion.div
                          key="links"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="space-y-6"
                        >
                          <h4 className="text-lg font-bold text-[#0F172A] dark:text-white mb-6">Project Access</h4>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {selectedProject.demoLink && (
                              <a
                                href={selectedProject.demoLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-4 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors group"
                              >
                                <div className="p-3 bg-emerald-500 text-white rounded-xl shadow-md group-hover:scale-110 transition-transform"><ExternalLink className="h-5 w-5" /></div>
                                <div>
                                  <p className="font-bold text-emerald-900 dark:text-emerald-300">Live Demo</p>
                                  <p className="text-xs text-emerald-700 dark:text-emerald-500">Visit live website</p>
                                </div>
                              </a>
                            )}
                            
                            {selectedProject.githubLink && (
                              <a
                                href={selectedProject.githubLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-4 p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors group"
                              >
                                <div className="p-3 bg-[#0F172A] dark:bg-slate-900 text-white rounded-xl shadow-md group-hover:scale-110 transition-transform"><GithubIcon className="h-5 w-5" /></div>
                                <div>
                                  <p className="font-bold text-[#0F172A] dark:text-white">Source Code</p>
                                  <p className="text-xs text-[#64748B] dark:text-slate-400">View on Github</p>
                                </div>
                              </a>
                            )}

                            {selectedProject.documentLink && (
                              <a
                                href={selectedProject.documentLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-4 p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors group sm:col-span-2"
                              >
                                <div className="p-3 bg-[#2563EB] text-white rounded-xl shadow-md group-hover:scale-110 transition-transform"><FileText className="h-5 w-5" /></div>
                                <div>
                                  <p className="font-bold text-blue-900 dark:text-blue-300">External Document</p>
                                  <p className="text-xs text-blue-700 dark:text-blue-500">View external documentation or drive link</p>
                                </div>
                              </a>
                            )}

                            {!selectedProject.demoLink && !selectedProject.githubLink && !selectedProject.documentLink && (
                              <p className="text-sm text-slate-500 sm:col-span-2">No external links are available for this project yet.</p>
                            )}
                          </div>
                        </motion.div>
                      )}

                    </AnimatePresence>
                  </div>
                </div>

              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};
