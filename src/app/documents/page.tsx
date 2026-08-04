'use client';

import React, { useState, useEffect } from 'react';
import API from '../../lib/api';
import { DocumentAsset } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Lock, Download, Search, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function DocumentGalleryPage() {
  const { isAuthenticated } = useAuth();
  const [documents, setDocuments] = useState<DocumentAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const fetchDocs = async () => {
    try {
      const res = await API.get('/documents');
      if (res.data && res.data.success) {
        setDocuments(res.data.data);
      }
    } catch (error) {
      console.error('Failed to load documents:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, [isAuthenticated]);

  const handleDownload = (docId: string) => {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const downloadUrl = `${apiBase}/documents/${docId}/download`;
    
    // Redirect browser to download trigger (increments DB count & downloads file)
    window.open(downloadUrl, '_blank');
    
    // Refresh list locally after short delay to sync download counts
    setTimeout(() => {
      fetchDocs();
    }, 1500);
  };

  // Unique categories
  const categories = ['All', ...Array.from(new Set(documents.map((doc) => doc.type || 'General')))];

  // Filtered documents
  const filteredDocs = documents.filter((doc) => {
    const matchesCategory = activeCategory === 'All' || (doc.type || 'General') === activeCategory;
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (doc.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FB] text-[#0F172A]">
      <Navbar />

      <main className="flex-grow pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold bg-[#EFF6FF] text-[#2563EB] border border-[#DBEAFE] uppercase tracking-wider font-mono">
              <Sparkles className="h-3 w-3" />
              <span>Free Data Libraries</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">Document Gallery</h1>
            <p className="text-[#64748B] text-sm sm:text-base font-light">
              Download resumes, portfolio assets, learning summaries, slides, and project source ZIP archives.
            </p>
            <div className="h-1.5 w-12 bg-[#2563EB] rounded-full mx-auto" />
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-sm">
            {/* Category Tabs */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 w-full sm:w-auto no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 whitespace-nowrap border cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-[#2563EB] border-[#2563EB] text-white shadow-md'
                      : 'bg-white border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Bar */}
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-[#E2E8F0] rounded-xl text-sm text-[#0F172A] placeholder-[#64748B] focus:outline-none focus:border-[#2563EB]/50 focus:ring-1 focus:ring-[#2563EB]/50 transition-all duration-300"
              />
            </div>
          </div>

          {/* Grid Layout */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2].map((n) => (
                <div key={n} className="h-24 bg-slate-200 animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : filteredDocs.length === 0 ? (
            <div className="text-center py-20 text-slate-500 text-sm italic">
              No documents found matching your search.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredDocs.map((doc) => {
                const isLocked = doc.isProtected && !isAuthenticated;
                return (
                  <motion.div
                    key={doc._id}
                    whileHover={{ y: -2 }}
                    className="p-6 rounded-2xl bg-white border border-[#E2E8F0] hover:border-slate-300 shadow-md shadow-slate-100/40 transition-all duration-300 flex items-start justify-between gap-6"
                  >
                    {/* File Icon */}
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-[#E2E8F0] text-[#2563EB] shrink-0">
                      <FileText className="h-6 w-6" />
                    </div>

                    {/* File Description */}
                    <div className="space-y-2 flex-grow min-w-0">
                      <div className="flex items-center space-x-2 flex-wrap gap-1.5">
                        <span className="px-2 py-0.5 rounded bg-[#EFF6FF] text-[#2563EB] border border-[#DBEAFE] text-[9px] font-bold uppercase font-mono tracking-wider">
                          {doc.type}
                        </span>
                        {doc.isProtected && (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 border border-amber-500/15 text-[9px] font-bold uppercase font-mono">
                            <Lock className="h-2.5 w-2.5" />
                            <span>Protected</span>
                          </span>
                        )}
                      </div>

                      <h3 className="text-[#0F172A] font-bold text-sm truncate">{doc.title}</h3>
                      {doc.description && (
                        <p className="text-[#64748B] text-xs line-clamp-2 leading-relaxed font-light font-sans">
                          {doc.description}
                        </p>
                      )}

                      {/* Download stats */}
                      <div className="flex items-center space-x-4 pt-1 text-[10px] text-[#64748B] font-mono">
                        <span className="flex items-center space-x-1">
                          <Download className="h-3 w-3 text-[#2563EB]" />
                          <span>{doc.downloadCount || 0} clicks</span>
                        </span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="shrink-0 pt-1">
                      {isLocked ? (
                        <Link
                          href="/login"
                          className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 hover:bg-amber-600 hover:text-white transition-all block"
                          title="Login to Access"
                        >
                          <Lock className="h-4.5 w-4.5" />
                        </Link>
                      ) : (
                        <button
                          onClick={() => handleDownload(doc._id)}
                          className="p-2.5 rounded-xl bg-[#EFF6FF] text-[#2563EB] border border-[#DBEAFE] hover:bg-[#2563EB] hover:text-white transition-all cursor-pointer"
                          title="Download Resource"
                        >
                          <Download className="h-4.5 w-4.5" />
                        </button>
                      )}
                    </div>

                  </motion.div>
                );
              })}
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
