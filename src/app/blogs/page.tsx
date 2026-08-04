'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import API, { getAssetUrl } from '../../lib/api';
import { Blog } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, User, Tag, X, Search } from 'lucide-react';

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await API.get('/blogs?published=true');
        if (res.data && res.data.success) {
          setBlogs(res.data.data);
        }
      } catch (error) {
        console.error('Failed to load blog posts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  // Collect unique categories
  const categories = ['All', ...Array.from(new Set(blogs.map((b) => b.category)))];

  // Filter blogs based on tab and search query
  const filteredBlogs = blogs.filter((blog) => {
    const matchesTab = activeTab === 'All' || blog.category === activeTab;
    const matchesSearch =
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FB] text-[#0F172A]">
      <Navbar />

      <main className="flex-grow pt-32 pb-24 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Page Title */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#2563EB] font-mono">Publications</span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0F172A] tracking-tight">Latest Writings</h1>
            <div className="h-1 w-12 bg-[#2563EB] rounded-full mx-auto" />
            <p className="text-slate-500 text-sm max-w-lg mx-auto font-light leading-relaxed">
              Read my tutorials, technology updates, and thoughts on architectural patterns.
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
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-[#E2E8F0] rounded-xl text-sm text-[#0F172A] placeholder-[#64748B] focus:outline-none focus:border-[#2563EB]/50 focus:ring-1 focus:ring-[#2563EB]/50 transition-all duration-300"
              />
            </div>
          </div>

          {/* Blogs Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-80 bg-white border border-[#E2E8F0] animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className="text-center py-20 text-slate-500 text-sm italic">
              No blog posts found matching the criteria.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBlogs.map((blog) => (
                <motion.div
                  key={blog._id}
                  whileHover={{ y: -5 }}
                  className="flex flex-col h-full rounded-2xl bg-white border border-[#E2E8F0] hover:border-[#2563EB]/30 transition-all duration-300 overflow-hidden shadow-md shadow-slate-100/40 group cursor-pointer"
                  onClick={() => setSelectedBlog(blog)}
                >
                  {/* Cover Image */}
                  <div className="relative aspect-video overflow-hidden bg-slate-950">
                    <img
                      src={getAssetUrl(blog.coverImage?.url)}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-white/90 backdrop-blur-sm text-[9px] font-bold text-[#2563EB] uppercase font-mono tracking-wider border border-[#E2E8F0]">
                      {blog.category}
                    </span>
                  </div>

                  {/* Card content info */}
                  <div className="p-6 flex flex-col flex-grow space-y-3">
                    <div className="flex items-center space-x-3 text-[#64748B] text-xs font-mono">
                      <div className="flex items-center space-x-1">
                        <User className="h-3.5 w-3.5 text-[#2563EB]" />
                        <span>{blog.author?.username || 'Admin'}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3.5 w-3.5 text-[#2563EB]" />
                        <span>{new Date(blog.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                      </div>
                    </div>

                    <h3 className="text-[#0F172A] font-bold text-base line-clamp-2 leading-snug group-hover:text-[#2563EB] transition-colors">
                      {blog.title}
                    </h3>
                    
                    <p className="text-[#334155] text-xs sm:text-sm line-clamp-3 leading-relaxed flex-grow font-light">
                      {blog.summary}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {blog.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 bg-slate-50 border border-[#E2E8F0] rounded text-[9px] font-semibold text-[#64748B] font-mono"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* BLOG CONTENT DETAIL MODAL */}
          <AnimatePresence>
            {selectedBlog && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSelectedBlog(null)}
                  className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
                />

                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className="relative bg-white border border-[#E2E8F0] rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto no-scrollbar shadow-2xl z-10"
                >
                  {/* Cover Image Header */}
                  <div className="relative aspect-video bg-slate-950">
                    <img
                      src={getAssetUrl(selectedBlog.coverImage?.url)}
                      alt={selectedBlog.title}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => setSelectedBlog(null)}
                      className="absolute top-4 right-4 p-2 bg-slate-950/65 hover:bg-slate-950 text-white rounded-xl backdrop-blur-md transition-all cursor-pointer border border-white/10"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Details Contents */}
                  <div className="p-8 space-y-6">
                    <div className="space-y-3">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-[#EFF6FF] text-[#2563EB] border border-[#DBEAFE] w-fit uppercase font-mono tracking-wider">
                        {selectedBlog.category}
                      </span>
                      <h2 className="text-2xl font-extrabold text-[#0F172A] leading-tight">
                        {selectedBlog.title}
                      </h2>
                      
                      <div className="flex items-center space-x-4 text-[#64748B] text-xs font-mono pt-1">
                        <span className="flex items-center space-x-1.5">
                          <User className="h-3.5 w-3.5 text-[#2563EB]" />
                          <span>Written by {selectedBlog.author?.username || 'Admin'}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center space-x-1.5">
                          <Calendar className="h-3.5 w-3.5 text-[#2563EB]" />
                          <span>{new Date(selectedBlog.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                        </span>
                      </div>
                    </div>

                    {/* Summary Callout */}
                    <div className="p-4 bg-slate-50 border-l-2 border-[#2563EB] rounded-r-xl text-[#334155] text-xs leading-relaxed italic">
                      {selectedBlog.summary}
                    </div>

                    {/* HTML Content */}
                    <div className="text-[#334155] text-sm leading-relaxed whitespace-pre-line font-light border-t border-[#E2E8F0] pt-6">
                      {selectedBlog.content}
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-[#E2E8F0]">
                      {selectedBlog.tags.map((tag) => (
                        <span
                          key={tag}
                          className="flex items-center space-x-1 px-2.5 py-1 bg-slate-50 border border-[#E2E8F0] rounded-lg text-xs text-[#334155] font-mono"
                        >
                          <Tag className="h-3 w-3 text-[#2563EB]" />
                          <span>{tag}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

        </div>
      </main>

      <Footer />
    </div>
  );
}
