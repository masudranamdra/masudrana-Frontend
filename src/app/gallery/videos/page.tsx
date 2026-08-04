'use client';

import React, { useState, useEffect } from 'react';
import API, { getAssetUrl } from '../../../lib/api';
import { GalleryVideo } from '../../../types';
import { useAuth } from '../../../context/AuthContext';
import { Navbar } from '../../../components/Navbar';
import { Footer } from '../../../components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, X, Play, Search, Sparkles, Video as VideoIcon } from 'lucide-react';
import Link from 'next/link';

export default function VideoGalleryPage() {
  const { isAuthenticated } = useAuth();
  const [videos, setVideos] = useState<GalleryVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedVideo, setSelectedVideo] = useState<GalleryVideo | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await API.get('/gallery/videos');
        if (res.data && res.data.success) {
          setVideos(res.data.data);
        }
      } catch (error) {
        console.error('Failed to load gallery videos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, [isAuthenticated]);

  // Video embed parser helper
  const getVideoEmbedUrl = (url: string): string => {
    try {
      const parsedUrl = new URL(url);
      
      // Youtube watch link: youtube.com/watch?v=ID
      if (parsedUrl.hostname.includes('youtube.com') && parsedUrl.searchParams.has('v')) {
        return `https://www.youtube.com/embed/${parsedUrl.searchParams.get('v')}`;
      }
      
      // Youtube short link: youtu.be/ID
      if (parsedUrl.hostname.includes('youtu.be')) {
        return `https://www.youtube.com/embed/${parsedUrl.pathname.substring(1)}`;
      }
      
      // Vimeo: vimeo.com/ID
      if (parsedUrl.hostname.includes('vimeo.com')) {
        const id = parsedUrl.pathname.split('/')[1];
        return `https://player.vimeo.com/video/${id}`;
      }
      
      // Google Drive: drive.google.com/file/d/ID/view
      if (parsedUrl.hostname.includes('drive.google.com')) {
        const parts = parsedUrl.pathname.split('/');
        const fileIdx = parts.indexOf('d');
        if (fileIdx !== -1 && parts[fileIdx + 1]) {
          return `https://drive.google.com/file/d/${parts[fileIdx + 1]}/preview`;
        }
      }
    } catch {
      // Return direct URL if URL parsing fails
    }
    return url;
  };

  // Unique categories (using platform mapping)
  const categories = ['All', ...Array.from(new Set(videos.map((vid) => vid.platform || 'other')))];

  // Filtered videos
  const filteredVideos = videos.filter((vid) => {
    const matchesCategory = activeCategory === 'All' || (vid.platform || 'other') === activeCategory;
    const matchesSearch = vid.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (vid.description || '').toLowerCase().includes(searchQuery.toLowerCase());
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
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">Video Gallery</h1>
            <p className="text-[#64748B] text-sm sm:text-base font-light">
              Stream development tutorials, project demos, visual stories, and creative shorts.
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
                placeholder="Search videos..."
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
                <div key={n} className="aspect-video bg-slate-200 animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : filteredVideos.length === 0 ? (
            <div className="text-center py-20 text-slate-500 text-sm italic">
              No videos found matching your search.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredVideos.map((vid) => {
                const isLocked = vid.isProtected && !isAuthenticated;
                return (
                  <motion.div
                    key={vid._id}
                    layout
                    whileHover={{ y: -5 }}
                    className="relative group aspect-video rounded-2xl bg-white border border-[#E2E8F0] overflow-hidden shadow-md transition-all duration-300"
                  >
                    {vid.thumbnail ? (
                      <img
                        src={getAssetUrl(vid.thumbnail)}
                        alt={vid.title}
                        className={`w-full h-full object-cover transition-all duration-700 ${
                          isLocked ? 'blur-xl scale-110 pointer-events-none' : 'group-hover:scale-105'
                        }`}
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-50 flex items-center justify-center text-slate-400">
                        <VideoIcon className="h-8 w-8" />
                      </div>
                    )}

                    {/* Platform Tag */}
                    {!isLocked && (
                      <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-white/90 backdrop-blur-sm text-[9px] font-bold text-[#334155] uppercase font-mono tracking-wider border border-[#E2E8F0]">
                        {vid.platform}
                      </span>
                    )}

                    {/* Lock Indicator Cover */}
                    {isLocked ? (
                      <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center p-4 text-center space-y-3">
                        <div className="p-3.5 rounded-full bg-slate-50 border border-[#E2E8F0] text-[#2563EB]">
                          <Lock className="h-5 w-5" />
                        </div>
                        <span className="text-[#0F172A] text-xs font-bold uppercase tracking-wider font-mono">Protected Video</span>
                        <p className="text-[10px] text-[#64748B] max-w-[180px] leading-relaxed">
                          Authorization required to stream this clip.
                        </p>
                        <Link
                          href="/login"
                          className="px-5 py-2 rounded-xl text-[10px] font-bold bg-[#2563EB] hover:bg-[#1D4ED8] text-white transition-all shadow-md"
                        >
                          Authenticate
                        </Link>
                      </div>
                    ) : (
                      /* Play Cover */
                      <div className="absolute inset-0 bg-[#0F172A]/70 flex flex-col items-center justify-center p-6 text-center transition-all duration-300">
                        <button
                          onClick={() => setSelectedVideo(vid)}
                          className="p-4 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300 cursor-pointer"
                        >
                          <Play className="h-5 w-5 fill-white text-white" />
                        </button>
                        <h4 className="text-white font-bold text-sm mt-4 line-clamp-1 max-w-[85%]">{vid.title}</h4>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}

        </div>
      </main>

      {/* Video Modal Player */}
      <AnimatePresence>
        {selectedVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedVideo(null)}
              className="absolute inset-0 bg-[#0F172A]/40 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden max-w-3xl w-full shadow-2xl z-10 p-4"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-[#0F172A] font-bold text-lg">{selectedVideo.title}</h3>
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="p-2 bg-slate-50 border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] rounded-xl cursor-pointer"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              {/* Embed player */}
              <div className="aspect-video bg-[#0F172A] rounded-xl overflow-hidden relative">
                <iframe
                  src={getVideoEmbedUrl(selectedVideo.url)}
                  title={selectedVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full border-0"
                />
              </div>

              {selectedVideo.description && (
                <p className="text-[#334155] text-sm mt-4 font-light leading-relaxed">
                  {selectedVideo.description}
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
