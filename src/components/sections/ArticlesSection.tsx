'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import API, { getAssetUrl } from '../../lib/api';
import { Article } from '../../types';
import { motion } from 'framer-motion';
import { ExternalLink, BookOpen, ArrowRight, Share2, Tag } from 'lucide-react';

export const ArticlesSection: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await API.get('/articles');
        if (res.data && res.data.success) {
          setArticles(res.data.data);
        }
      } catch (error) {
        console.error('Failed to load articles:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  if (loading) {
    return (
      <section className="py-32 bg-[#F5F7FB] dark:bg-[#0F172A]" id="articles">
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

  if (articles.length === 0) return null;

  return (
    <section id="articles" className="relative py-10 sm:py-12 bg-[#F5F7FB] dark:bg-[#0F172A] text-[#0F172A] dark:text-white border-t border-b border-[#E2E8F0] dark:border-slate-800 overflow-hidden transition-colors duration-300">
      {/* Background decoration */}
      <div className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-blue-500/5 dark:bg-blue-600/10 rounded-full blur-[120px] pointer-events-none transition-colors duration-300" />
      <div className="absolute bottom-10 right-0 w-[400px] h-[400px] bg-indigo-500/5 dark:bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none transition-colors duration-300" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8 space-y-1.5">
          <span className="inline-block px-3 py-1 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-[#2563EB] dark:text-blue-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest font-mono border border-blue-100 dark:border-blue-800/50">
            Publications & Features
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] dark:text-white tracking-tight leading-tight">
            External Articles
          </h2>
          <div className="h-1 w-10 bg-[#2563EB] dark:bg-blue-500 rounded-full mx-auto" />
        </div>

        {/* Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {articles.slice(0, 3).map((art, index) => (
            <motion.a
              key={art._id}
              href={art.externalLink}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ y: -4 }}
              className="flex flex-col h-full rounded-xl bg-white dark:bg-slate-900/80 backdrop-blur-md border border-[#E2E8F0] dark:border-slate-800 hover:border-[#2563EB]/50 dark:hover:border-blue-500/50 transition-all duration-300 overflow-hidden shadow-sm dark:shadow-none group"
            >
              {/* Preview Image */}
              <div className="relative aspect-[16/9] overflow-hidden bg-slate-950">
                <img
                  src={getAssetUrl(art.previewImage?.url)}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                
                {/* Source Badge */}
                <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded bg-blue-600/90 dark:bg-blue-600/80 text-white text-[10px] font-bold uppercase font-mono tracking-wider border border-blue-400/30 shadow">
                  {art.source}
                </span>

                {/* Hover Link Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="p-2.5 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-white">
                    <ExternalLink className="h-4 w-4" />
                  </div>
                </div>
              </div>

              {/* Contents */}
              <div className="p-4 sm:p-5 flex flex-col flex-grow space-y-3">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold tracking-wider text-[#2563EB] dark:text-blue-400 uppercase font-mono bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded border border-blue-100/50 dark:border-blue-900/50">
                    {art.category}
                  </span>
                  <h3 className="text-[#0F172A] dark:text-white font-extrabold text-base sm:text-lg line-clamp-2 leading-snug group-hover:text-[#2563EB] dark:group-hover:text-blue-400 transition-colors flex items-start justify-between gap-2 pt-0.5">
                    <span>{art.title}</span>
                  </h3>
                </div>

                <p className="text-[#334155] dark:text-slate-400 text-xs sm:text-sm line-clamp-3 leading-relaxed flex-grow font-normal">
                  {art.summary}
                </p>

                {/* Footer tags */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 mt-auto">
                  <div className="flex flex-wrap gap-1.5">
                    {art.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center space-x-1 px-2 py-0.5 bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 rounded text-[10px] text-[#64748B] dark:text-slate-400 font-mono"
                      >
                        <Tag className="h-2.5 w-2.5" />
                        <span>{tag}</span>
                      </span>
                    ))}
                  </div>
                  
                  <span className="flex items-center space-x-1 text-xs font-bold text-[#2563EB] dark:text-blue-400 group-hover:text-blue-600 transition-colors">
                    <BookOpen className="h-3.5 w-3.5" />
                    <span className="uppercase tracking-wider font-mono text-[10px]">Read Page</span>
                  </span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Link to dedicated articles subpage */}
        <div className="flex justify-center pt-6 sm:pt-8">
          <Link
            href="/articles"
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl font-bold bg-white dark:bg-slate-800 text-[#2563EB] dark:text-blue-400 border border-[#E2E8F0] dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-xs sm:text-sm shadow-sm cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
          >
            <span>Browse All Publications</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

      </div>
    </section>
  );
};
