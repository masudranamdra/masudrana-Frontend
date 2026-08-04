'use client';

import React, { useState, useEffect } from 'react';
import API, { getAssetUrl } from '../../../lib/api';
import { GalleryImage } from '../../../types';
import { useAuth } from '../../../context/AuthContext';
import { Navbar } from '../../../components/Navbar';
import { Footer } from '../../../components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, X, Eye, Search, Sparkles, Download } from 'lucide-react';
import Link from 'next/link';

export default function ImageGalleryPage() {
  const { isAuthenticated } = useAuth();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await API.get('/gallery/images');
        if (res.data && res.data.success) {
          setImages(res.data.data);
        }
      } catch (error) {
        console.error('Failed to load gallery images:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, [isAuthenticated]);

  // Unique categories
  const categories = ['All', ...Array.from(new Set(images.map((img) => img.category || 'General')))];

  // Filtered images
  const filteredImages = images.filter((img) => {
    const matchesCategory = activeCategory === 'All' || (img.category || 'General') === activeCategory;
    const matchesSearch = img.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (img.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FB] text-[#0F172A]">
      <Navbar />

      <main className="flex-grow pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold bg-[#EFF6FF] text-[#2563EB] border border-[#DBEAFE] uppercase tracking-wider font-mono">
              <Sparkles className="h-3 w-3" />
              <span>Free Data Libraries</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">Image Gallery</h1>
            <p className="text-[#64748B] text-sm sm:text-base font-light">
              Explore dynamic creative visual media assets, production photography, and visual mockups.
            </p>
            <div className="h-1.5 w-12 bg-[#2563EB] rounded-full mx-auto" />
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-sm">
            {/* Category Tabs */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 w-full md:w-auto no-scrollbar">
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
            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
              <input
                type="text"
                placeholder="Search images..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-[#E2E8F0] rounded-xl text-sm text-[#0F172A] placeholder-[#64748B] focus:outline-none focus:border-[#2563EB]/50 focus:ring-1 focus:ring-[#2563EB]/50 transition-all duration-300"
              />
            </div>
          </div>

          {/* Grid Layout */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="aspect-square bg-slate-200 animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="text-center py-20 text-slate-500 text-sm italic">
              No images found matching your search.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredImages.map((img) => {
                const isLocked = img.isProtected && !isAuthenticated;
                return (
                  <motion.div
                    key={img._id}
                    layout
                    whileHover={{ y: -5 }}
                    className="relative group aspect-square rounded-2xl bg-white border border-[#E2E8F0] overflow-hidden shadow-md transition-all duration-300"
                  >
                    <img
                      src={getAssetUrl(img.url)}
                      alt={img.title}
                      className={`w-full h-full object-cover transition-all duration-700 ${
                        isLocked ? 'blur-xl scale-110 pointer-events-none' : 'group-hover:scale-105'
                      }`}
                    />

                    {/* Lock Indicator Cover */}
                    {isLocked ? (
                      <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center p-4 text-center space-y-3">
                        <div className="p-3.5 rounded-full bg-slate-50 border border-[#E2E8F0] text-[#2563EB]">
                          <Lock className="h-5 w-5" />
                        </div>
                        <span className="text-[#0F172A] text-xs font-bold uppercase tracking-wider font-mono">Protected Image</span>
                        <p className="text-[10px] text-[#64748B] max-w-[180px] leading-relaxed">
                          Authorization required to access this file.
                        </p>
                        <Link
                          href="/login"
                          className="px-5 py-2 rounded-xl text-[10px] font-bold bg-[#2563EB] hover:bg-[#1D4ED8] text-white transition-all shadow-md"
                        >
                          Authenticate
                        </Link>
                      </div>
                    ) : (
                      /* Hover Info Cover */
                      <div className="absolute inset-0 bg-[#0F172A]/80 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center p-6 text-center transition-all duration-300">
                        <h4 className="text-white font-bold text-base mb-1">{img.title}</h4>
                        <span className="text-[9px] text-blue-300 font-mono mb-4 uppercase tracking-widest">{img.category}</span>
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => setSelectedImage(img)}
                            className="p-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl shadow-lg transition-transform hover:scale-105 cursor-pointer"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <a
                            href={getAssetUrl(img.url)}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl shadow-lg transition-transform hover:scale-105"
                          >
                            <Download className="h-4 w-4" />
                          </a>
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}

        </div>
      </main>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
              className="absolute inset-0 bg-[#0F172A]/40 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden max-w-3xl w-full shadow-2xl z-10 p-4"
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-[#0F172A] font-bold text-lg">{selectedImage.title}</h3>
                  <p className="text-xs text-[#64748B]">{selectedImage.category}</p>
                </div>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="p-2 bg-slate-50 border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] rounded-xl cursor-pointer animate-none"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>
              
              <div className="aspect-video bg-[#0F172A] rounded-xl overflow-hidden relative">
                <img
                  src={getAssetUrl(selectedImage.url)}
                  alt={selectedImage.title}
                  className="w-full h-full object-contain"
                />
              </div>

              {selectedImage.description && (
                <p className="text-[#334155] text-sm mt-4 font-light leading-relaxed">
                  {selectedImage.description}
                </p>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
