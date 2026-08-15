'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import API, { getAssetUrl } from '../../lib/api';
import { Blog } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, User, Tag, X, ArrowRight, BookOpen, Clock } from 'lucide-react';

export const BlogSection: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
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

  if (loading) {
    return (
      <section className="py-32 bg-[#F5F7FB] dark:bg-[#0F172A]" id="blogs">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="h-6 w-36 bg-slate-200 dark:bg-slate-700 animate-pulse rounded-md mx-auto mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-80 bg-slate-200/50 dark:bg-slate-800/50 animate-pulse rounded-3xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (blogs.length === 0) return null;

  return (
    <section id="blogs" className="relative py-10 sm:py-12 bg-[#F5F7FB] dark:bg-[#0F172A] text-[#0F172A] dark:text-white border-t border-b border-[#E2E8F0] dark:border-slate-800 overflow-hidden transition-colors duration-300">
      {/* Background decoration */}
      <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-blue-500/5 dark:bg-blue-600/10 rounded-full blur-[120px] pointer-events-none transition-colors duration-300" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/5 dark:bg-purple-600/10 rounded-full blur-[100px] pointer-events-none transition-colors duration-300" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8 space-y-1.5">
          <span className="inline-block px-3 py-1 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-[#2563EB] dark:text-blue-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest font-mono border border-blue-100 dark:border-blue-800/50">
            Writing & Insights
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] dark:text-white tracking-tight leading-tight">
            Latest Writings
          </h2>
          <div className="h-1 w-10 bg-[#2563EB] dark:bg-blue-500 rounded-full mx-auto" />
        </div>

        {/* Blogs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {blogs.slice(0, 3).map((blog, index) => (
            <motion.div
              key={blog._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ y: -4 }}
              className="flex flex-col h-full rounded-xl bg-white dark:bg-slate-900/80 backdrop-blur-md border border-[#E2E8F0] dark:border-slate-800 hover:border-[#2563EB]/50 dark:hover:border-blue-500/50 transition-all duration-300 overflow-hidden shadow-sm dark:shadow-none group cursor-pointer"
              onClick={() => setSelectedBlog(blog)}
            >
              {/* Cover Image */}
              <div className="relative aspect-[16/9] overflow-hidden bg-slate-950">
                <img
                  src={getAssetUrl(blog.coverImage?.url)}
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60" />
                
                <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded bg-white/20 dark:bg-black/40 backdrop-blur-md text-[10px] font-bold text-white uppercase font-mono tracking-wider border border-white/30 shadow">
                  {blog.category}
                </span>
              </div>

              {/* Card content info */}
              <div className="p-4 sm:p-5 flex flex-col flex-grow relative space-y-2">
                {/* Meta details floating above content line */}
                <div className="flex items-center justify-between text-[#64748B] dark:text-slate-400 text-[11px] font-mono border-b border-slate-100 dark:border-slate-800 pb-2.5">
                  <div className="flex items-center space-x-1.5">
                    <User className="h-3.5 w-3.5 text-[#2563EB] dark:text-blue-400" />
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{blog.author?.username || 'Admin'}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Calendar className="h-3.5 w-3.5 text-[#2563EB] dark:text-blue-400" />
                    <span>{new Date(blog.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>

                <h3 className="text-[#0F172A] dark:text-white font-extrabold text-base sm:text-lg line-clamp-2 leading-snug group-hover:text-[#2563EB] dark:group-hover:text-blue-400 transition-colors">
                  {blog.title}
                </h3>
                
                <p className="text-[#334155] dark:text-slate-400 text-sm line-clamp-3 leading-relaxed flex-grow font-light mb-6">
                  {blog.summary}
                </p>

                {/* Tags and Read More */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 mt-auto">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-4 w-4 text-[#2563EB] dark:text-blue-400" />
                    <span className="text-xs font-bold text-[#2563EB] dark:text-blue-400 font-mono uppercase tracking-wider">Read Article</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-[#2563EB] dark:text-blue-400 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Link to dedicated blogs subpage */}
        <div className="flex justify-center pt-6 sm:pt-8">
          <Link
            href="/blogs"
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl font-bold bg-white dark:bg-slate-800 text-[#2563EB] dark:text-blue-400 border border-[#E2E8F0] dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-xs sm:text-sm shadow-sm cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
          >
            <span>Browse All Writings</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* BLOG CONTENT DETAIL MODAL */}
        <AnimatePresence>
          {selectedBlog && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedBlog(null)}
                className="absolute inset-0 bg-[#0F172A]/80 backdrop-blur-sm"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative w-full max-w-4xl max-h-[90vh] sm:max-h-[85vh] overflow-y-auto custom-scrollbar bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 rounded-3xl shadow-2xl z-10 flex flex-col"
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedBlog(null)}
                  className="absolute top-4 right-4 z-20 p-2.5 bg-black/20 dark:bg-white/10 hover:bg-black/40 dark:hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>

                {/* Cover Image Header */}
                <div className="relative w-full h-64 sm:h-80 bg-slate-950 shrink-0">
                  <img
                    src={getAssetUrl(selectedBlog.coverImage?.url)}
                    alt={selectedBlog.title}
                    className="w-full h-full object-cover opacity-80 mix-blend-overlay"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                  
                  {/* Floating Header Info */}
                  <div className="absolute bottom-0 left-0 w-full p-6 sm:p-10 text-white">
                    <span className="inline-block px-3 py-1 rounded-lg bg-blue-600/80 backdrop-blur-md text-xs font-bold uppercase font-mono tracking-widest border border-blue-400/30 mb-4">
                      {selectedBlog.category}
                    </span>
                    <h3 className="text-3xl sm:text-5xl font-extrabold leading-tight tracking-tight drop-shadow-md">
                      {selectedBlog.title}
                    </h3>
                  </div>
                </div>

                {/* Details Contents */}
                <div className="flex-grow bg-white dark:bg-slate-900 p-6 sm:p-10 space-y-8">
                  
                  {/* Meta Bar */}
                  <div className="flex flex-wrap items-center gap-6 pb-6 border-b border-[#E2E8F0] dark:border-slate-800 text-[#64748B] dark:text-slate-400 text-xs sm:text-sm font-mono">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-[#2563EB] dark:text-blue-400">
                        <User className="h-4 w-4" />
                      </div>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Written by {selectedBlog.author?.username || 'Admin'}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-[#2563EB] dark:text-blue-400">
                        <Calendar className="h-4 w-4" />
                      </div>
                      <span>{new Date(selectedBlog.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-[#2563EB] dark:text-blue-400">
                        <Clock className="h-4 w-4" />
                      </div>
                      <span>5 min read</span>
                    </div>
                  </div>

                  {/* Summary Callout */}
                  <div className="p-6 bg-[#F8FAFC] dark:bg-slate-800/50 border-l-4 border-[#2563EB] rounded-r-2xl text-[#0F172A] dark:text-white text-base sm:text-lg leading-relaxed font-light italic">
                    "{selectedBlog.summary}"
                  </div>

                  {/* HTML Content (simulated via whitespace-pre-line) */}
                  <div className="text-[#334155] dark:text-slate-300 text-base sm:text-lg leading-loose whitespace-pre-line font-light">
                    {selectedBlog.content}
                  </div>

                  {/* Tags */}
                  <div className="pt-8 border-t border-[#E2E8F0] dark:border-slate-800">
                    <h4 className="text-sm font-bold text-[#0F172A] dark:text-white uppercase tracking-wider mb-4 font-mono">Related Topics</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedBlog.tags.map((tag) => (
                        <span
                          key={tag}
                          className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 hover:border-[#2563EB] dark:hover:border-blue-500 rounded-xl text-xs text-[#334155] dark:text-slate-300 font-mono transition-colors cursor-pointer"
                        >
                          <Tag className="h-3 w-3 text-[#2563EB] dark:text-blue-400" />
                          <span>{tag}</span>
                        </span>
                      ))}
                    </div>
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
