'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import API, { getAssetUrl } from '../../lib/api';
import { Article } from '../../types';
import { motion } from 'framer-motion';
import { ExternalLink, BookOpen, Search } from 'lucide-react';

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');

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

  // Collect unique categories
  const categories = ['All', ...Array.from(new Set(articles.map((art) => art.category)))];

  // Filter articles based on search and tab
  const filteredArticles = articles.filter((art) => {
    const matchesTab = activeTab === 'All' || art.category === activeTab;
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FB] text-[#0F172A]">
      <Navbar />

      <main className="flex-grow pt-32 pb-24 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Page Title */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#2563EB] font-mono">Publications</span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0F172A] tracking-tight">External Articles</h1>
            <div className="h-1 w-12 bg-[#2563EB] rounded-full mx-auto" />
            <p className="text-slate-500 text-sm max-w-lg mx-auto font-light leading-relaxed">
              Browse technical writeups, guest columns, and essays published on platforms like Medium and Dev.to.
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
                placeholder="Search publications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-[#E2E8F0] rounded-xl text-sm text-[#0F172A] placeholder-[#64748B] focus:outline-none focus:border-[#2563EB]/50 focus:ring-1 focus:ring-[#2563EB]/50 transition-all duration-300"
              />
            </div>
          </div>

          {/* Grid layout of articles */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-80 bg-white border border-[#E2E8F0] animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="text-center py-20 text-slate-500 text-sm italic">
              No articles found matching the criteria.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((art, index) => (
                <motion.a
                  key={art._id}
                  href={art.externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  whileHover={{ y: -5 }}
                  className="flex flex-col h-full rounded-2xl bg-white border border-[#E2E8F0] hover:border-[#2563EB]/30 transition-all duration-300 overflow-hidden shadow-md shadow-slate-100/40 group"
                >
                  {/* Preview Image */}
                  <div className="relative aspect-video overflow-hidden bg-slate-950">
                    <img
                      src={getAssetUrl(art.previewImage?.url)}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Source Badge */}
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-[#2563EB] text-white text-[9px] font-bold uppercase font-mono tracking-wider border border-[#EFF6FF]">
                      {art.source}
                    </span>
                  </div>

                  {/* Contents */}
                  <div className="p-6 flex flex-col flex-grow space-y-4">
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold tracking-wider text-[#64748B] uppercase font-mono">
                        {art.category}
                      </span>
                      <h2 className="text-[#0F172A] font-bold text-base line-clamp-2 leading-snug group-hover:text-[#2563EB] transition-colors flex items-start justify-between gap-2">
                        <span>{art.title}</span>
                        <ExternalLink className="h-4 w-4 text-[#64748B] shrink-0 mt-0.5 group-hover:text-[#0F172A] transition-colors" />
                      </h2>
                    </div>

                    <p className="text-[#334155] text-xs sm:text-sm line-clamp-3 leading-relaxed flex-grow font-light">
                      {art.summary}
                    </p>

                    {/* Footer tags */}
                    <div className="flex items-center justify-between pt-2 border-t border-[#E2E8F0] mt-auto">
                      <div className="flex flex-wrap gap-1">
                        {art.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="px-1.5 py-0.5 bg-slate-50 border border-[#E2E8F0] rounded text-[9px] font-semibold text-[#64748B] font-mono"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <span className="flex items-center space-x-1 text-[10px] font-bold text-[#2563EB] group-hover:underline">
                        <BookOpen className="h-3 w-3" />
                        <span>Read Article</span>
                      </span>
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
