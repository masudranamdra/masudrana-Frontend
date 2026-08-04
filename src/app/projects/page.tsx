'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import API, { getAssetUrl } from '../../lib/api';
import { Project } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ExternalLink, X, Eye } from 'lucide-react';

const GithubIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

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

  // Collect unique categories
  const categories = ['All', ...Array.from(new Set(projects.map((p) => p.category)))];

  // Filter projects based on tab and search query
  const filteredProjects = projects.filter((project) => {
    const matchesTab = activeTab === 'All' || project.category === activeTab;
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FB] text-[#0F172A]">
      <Navbar />

      <main className="flex-grow pt-32 pb-24 relative overflow-hidden">
        {/* Decorative glows */}
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-0 w-[550px] h-[550px] bg-sky-500/5 rounded-full blur-[110px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Page Title */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#2563EB] font-mono">Creative Portfolio</span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0F172A] tracking-tight">Featured Works</h1>
            <div className="h-1 w-12 bg-[#2563EB] rounded-full mx-auto" />
            <p className="text-slate-500 text-sm max-w-lg mx-auto font-light leading-relaxed">
              Explore my architectural layouts, interactive SaaS platforms, and advanced API designs.
            </p>
          </div>

          {/* Filter and Search Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-sm">
            {/* Tabs */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 w-full md:w-auto no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 whitespace-nowrap border cursor-pointer ${
                    activeTab === cat
                      ? 'bg-[#2563EB] border-[#2563EB] text-white shadow-md shadow-blue-500/15'
                      : 'bg-white border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-[#E2E8F0] rounded-xl text-sm text-[#0F172A] placeholder-[#64748B] focus:outline-none focus:border-[#2563EB]/50 focus:ring-1 focus:ring-[#2563EB]/50 transition-all duration-300"
              />
            </div>
          </div>

          {/* Project Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="h-80 bg-white border border-[#E2E8F0] animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-20 text-slate-500 text-sm italic">
              No projects found matching the criteria.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence mode="popLayout">
                {filteredProjects.map((project, index) => (
                  <motion.div
                    key={project._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    whileHover={{ y: -5 }}
                    className="group rounded-2xl bg-white border border-[#E2E8F0] overflow-hidden flex flex-col h-full hover:border-[#2563EB]/30 transition-all duration-300 shadow-md shadow-slate-100/40 hover:shadow-lg"
                  >
                    {/* Card Image Cover */}
                    <div className="relative aspect-video overflow-hidden bg-slate-950">
                      <img
                        src={getAssetUrl(project.image?.url)}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      {/* Hover Overlays */}
                      <div className="absolute inset-0 bg-[#0F172A]/80 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-4 transition-opacity duration-300">
                        <button
                          onClick={() => setSelectedProject(project)}
                          className="p-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl shadow-lg transition-transform hover:scale-110 cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        {project.githubLink && (
                          <a
                            href={project.githubLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-transform hover:scale-110 flex items-center justify-center"
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
                            className="p-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl transition-transform hover:scale-110"
                            title="Live Demo"
                          >
                            <ExternalLink className="h-5 w-5" />
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Card Info */}
                    <div className="p-6 flex flex-col flex-grow space-y-4">
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold tracking-widest text-[#2563EB] uppercase font-mono">
                          {project.category}
                        </span>
                        <h3 className="text-[#0F172A] font-bold text-lg group-hover:text-[#2563EB] transition-colors">
                          {project.title}
                        </h3>
                      </div>
                      
                      <p className="text-[#334155] text-xs sm:text-sm line-clamp-2 leading-relaxed flex-grow font-light">
                        {project.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {project.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2.5 py-0.5 bg-slate-50 border border-[#E2E8F0] rounded-md text-[10px] text-[#334155] font-mono"
                          >
                            {tag}
                          </span>
                        ))}
                        {project.tags.length > 3 && (
                          <span className="px-2 py-0.5 bg-slate-50 border border-[#E2E8F0] rounded-md text-[10px] text-[#64748B] font-mono">
                            +{project.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>

      {/* PROJECT CONTENT DETAIL MODAL */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-[#0F172A]/40 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white border border-[#E2E8F0] rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl z-10"
            >
              {/* Cover Image Header */}
              <div className="relative aspect-video bg-slate-950">
                <img
                  src={getAssetUrl(selectedProject.image?.url)}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 p-2 bg-[#0F172A]/60 hover:bg-[#0F172A] text-white rounded-xl backdrop-blur-md transition-all cursor-pointer border border-white/10"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Details Content */}
              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <span className="px-2.5 py-0.5 rounded-lg bg-[#EFF6FF] text-[#2563EB] border border-[#DBEAFE] text-[10px] font-bold uppercase font-mono tracking-widest">
                    {selectedProject.category}
                  </span>
                  <h3 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">{selectedProject.title}</h3>
                </div>

                <p className="text-[#334155] text-xs sm:text-sm leading-relaxed font-light">
                  {selectedProject.description}
                </p>

                {/* Tech specifications */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-[#E2E8F0]">
                  {selectedProject.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-slate-50 border border-[#E2E8F0] rounded-lg text-xs text-[#334155] font-mono"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Links Footer controls */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E2E8F0]">
                  {selectedProject.githubLink && (
                    <a
                      href={selectedProject.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all"
                    >
                      <GithubIcon className="h-4 w-4" />
                      <span>Code Repo</span>
                    </a>
                  )}
                  {selectedProject.demoLink && (
                    <a
                      href={selectedProject.demoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold rounded-xl transition-all"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span>Live Demo</span>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
