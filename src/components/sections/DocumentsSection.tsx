'use client';

import React, { useState, useEffect } from 'react';
import API from '../../lib/api';
import { DocumentAsset } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { FileDown, Lock, Download, FileText, CheckCircle, Unlock } from 'lucide-react';
import Link from 'next/link';

export const DocumentsSection: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [documents, setDocuments] = useState<DocumentAsset[]>([]);
  const [loading, setLoading] = useState(true);

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
  }, [isAuthenticated]); // refetch when login status shifts to reveal locked materials!

  // Download handler redirect
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

  if (loading) {
    return (
      <section className="py-24 transition-colors duration-300" id="documents">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="h-6 w-36 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-md mx-auto mb-6" />
          <div className="h-48 w-full bg-slate-100 dark:bg-slate-800/50 animate-pulse rounded-2xl max-w-xl mx-auto" />
        </div>
      </section>
    );
  }

  if (documents.length === 0) return null;

  return (
    <section id="documents" className="py-24 bg-slate-50 dark:bg-slate-900/10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 font-mono">Resources</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">Documents & Downloads</h2>
          <div className="h-1 w-12 bg-indigo-500 rounded-full mx-auto" />
        </div>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {documents.map((doc) => {
            const isLocked = doc.isProtected && !isAuthenticated;
            return (
              <motion.div
                key={doc._id}
                whileHover={{ y: -2 }}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 hover:border-indigo-500/25 dark:hover:border-indigo-500/20 shadow-sm dark:shadow-none transition-all duration-300 flex items-start justify-between gap-6"
              >
                {/* File Icon */}
                <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/5 text-indigo-600 dark:text-indigo-400 shrink-0">
                  <FileText className="h-6 w-6" />
                </div>

                {/* File Description details */}
                <div className="space-y-2 flex-grow min-w-0">
                  <div className="flex items-center space-x-2 flex-wrap gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/10 text-[9px] font-bold uppercase font-mono tracking-wider">
                      {doc.type}
                    </span>
                    {doc.isProtected && (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/10 text-[9px] font-bold uppercase font-mono">
                        <Lock className="h-2.5 w-2.5" />
                        <span>Protected</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-slate-900 dark:text-white font-bold text-sm truncate">{doc.title}</h3>
                  {doc.description && (
                    <p className="text-slate-600 dark:text-slate-400 text-xs line-clamp-2 leading-relaxed font-light">
                      {doc.description}
                    </p>
                  )}

                  {/* Tags & Downloads Counter */}
                  <div className="flex items-center space-x-4 pt-2 text-[10px] text-slate-500 dark:text-slate-500 font-mono">
                    <span className="flex items-center space-x-1">
                      <Download className="h-3 w-3" />
                      <span>{doc.downloadCount || 0} downloads</span>
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <div className="shrink-0 pt-1">
                  {isLocked ? (
                    <Link
                      href="/login"
                      className="p-2 rounded-xl bg-amber-600/10 text-amber-600 border border-amber-500/20 hover:bg-amber-600 hover:text-white transition-all block"
                      title="Login to Download"
                    >
                      <Lock className="h-4 w-4" />
                    </Link>
                  ) : (
                    <button
                      onClick={() => handleDownload(doc._id)}
                      className="p-2 rounded-xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 hover:bg-indigo-600 hover:text-white transition-all cursor-pointer"
                      title="Download Resource"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  )}
                </div>

              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
