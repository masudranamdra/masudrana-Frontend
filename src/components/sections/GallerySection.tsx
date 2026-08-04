'use client';

import React, { useState, useEffect } from 'react';
import API, { getAssetUrl } from '../../lib/api';
import { GalleryImage, GalleryVideo } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Play, Image as ImageIcon, Video as VideoIcon, X, Eye } from 'lucide-react';
import Link from 'next/link';

export const GallerySection: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [videos, setVideos] = useState<GalleryVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'images' | 'videos'>('images');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<GalleryVideo | null>(null);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const [imgRes, vidRes] = await Promise.all([
          API.get('/gallery/images'),
          API.get('/gallery/videos'),
        ]);
        if (imgRes.data && imgRes.data.success) setImages(imgRes.data.data);
        if (vidRes.data && vidRes.data.success) setVideos(vidRes.data.data);
      } catch (error) {
        console.error('Failed to load gallery resources:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMedia();
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

  if (loading) {
    return (
      <section className="py-32 bg-[#020617]" id="gallery">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="h-6 w-36 bg-slate-900 animate-pulse rounded-md mx-auto mb-6" />
          <div className="h-48 w-full bg-slate-900/50 animate-pulse rounded-2xl" />
        </div>
      </section>
    );
  }

  return (
    <section id="gallery" className="relative py-32 bg-[#020617] text-white border-t border-b border-white/5 overflow-hidden">
      {/* Dynamic Glow Layer */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-indigo-400 font-mono">Creative Media Vault</span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">Visual Showcase</h2>
          <div className="h-1 w-12 bg-indigo-500 rounded-full mx-auto" />
        </div>

        {/* Media Selector Tabs */}
        <div className="flex justify-center mb-16">
          <div className="inline-flex p-1 rounded-2xl bg-slate-900/60 border border-white/5 backdrop-blur-md">
            <button
              onClick={() => setActiveTab('images')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl text-xs font-semibold transition-all duration-300 cursor-pointer ${
                activeTab === 'images'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ImageIcon className="h-4 w-4" />
              <span>Image Gallery</span>
            </button>
            <button
              onClick={() => setActiveTab('videos')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl text-xs font-semibold transition-all duration-300 cursor-pointer ${
                activeTab === 'videos'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <VideoIcon className="h-4 w-4" />
              <span>Video Hub</span>
            </button>
          </div>
        </div>

        {/* Render Tab Contents */}
        {activeTab === 'images' ? (
          images.length === 0 ? (
            <div className="text-center py-20 text-slate-500 text-sm italic">No images currently in gallery.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {images.map((img) => {
                const isLocked = img.isProtected && !isAuthenticated;
                return (
                  <motion.div
                    key={img._id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    whileHover={{ y: -4 }}
                    className="relative group aspect-square rounded-2xl bg-slate-900/20 border border-white/5 overflow-hidden shadow-lg transition-all duration-300"
                  >
                    <img
                      src={getAssetUrl(img.url)}
                      alt={img.title}
                      className={`w-full h-full object-cover transition-all duration-700 ${
                        isLocked ? 'blur-xl scale-110 pointer-events-none' : 'group-hover:scale-105'
                      }`}
                    />

                    {/* Locked overlay */}
                    {isLocked ? (
                      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center space-y-4">
                        <div className="p-3.5 rounded-full bg-slate-900 border border-white/10 text-indigo-400">
                          <Lock className="h-5 w-5" />
                        </div>
                        <span className="text-white text-xs font-bold font-mono tracking-widest uppercase">Protected Resource</span>
                        <p className="text-[10px] text-slate-400 max-w-[190px] leading-relaxed">
                          This asset requires client credentials.
                        </p>
                        <Link
                          href="/login"
                          className="px-5 py-2 rounded-xl text-[10px] font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-lg"
                        >
                          Authenticate
                        </Link>
                      </div>
                    ) : (
                      /* Hover View Overlay */
                      <div className="absolute inset-0 bg-slate-950/80 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center p-6 text-center transition-opacity duration-300">
                        <h4 className="text-white font-bold text-base mb-1">{img.title}</h4>
                        <span className="text-[9px] text-indigo-400 font-mono mb-4 uppercase tracking-widest">{img.category}</span>
                        <button
                          onClick={() => setSelectedImage(img)}
                          className="p-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg transition-transform hover:scale-105 cursor-pointer"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )
        ) : (
          /* VIDEOS TAB */
          videos.length === 0 ? (
            <div className="text-center py-20 text-slate-500 text-sm italic">No videos currently in hub.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {videos.map((vid) => {
                const isLocked = vid.isProtected && !isAuthenticated;
                return (
                  <motion.div
                    key={vid._id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    whileHover={{ y: -4 }}
                    className="relative group aspect-video rounded-2xl bg-slate-900/20 border border-white/5 overflow-hidden shadow-lg transition-all duration-300"
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
                      <div className="w-full h-full bg-slate-950 flex items-center justify-center text-slate-600">
                        <VideoIcon className="h-8 w-8" />
                      </div>
                    )}

                    {/* Platform Tag */}
                    {!isLocked && (
                      <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-slate-950/80 backdrop-blur-sm text-[9px] font-bold text-slate-400 uppercase font-mono tracking-wider border border-white/5">
                        {vid.platform}
                      </span>
                    )}

                    {/* Lock Screen for Protected Videos */}
                    {isLocked ? (
                      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center space-y-4">
                        <div className="p-3.5 rounded-full bg-slate-900 border border-white/10 text-indigo-400">
                          <Lock className="h-5 w-5" />
                        </div>
                        <span className="text-white text-xs font-bold font-mono tracking-widest uppercase">Protected Video</span>
                        <p className="text-[10px] text-slate-400 max-w-[190px] leading-relaxed">
                          Authorization required to stream this resource.
                        </p>
                        <Link
                          href="/login"
                          className="px-5 py-2 rounded-xl text-[10px] font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-lg"
                        >
                          Authenticate
                        </Link>
                      </div>
                    ) : (
                      /* Play Trigger Overlay */
                      <div className="absolute inset-0 bg-slate-950/60 flex flex-col items-center justify-center p-6 text-center transition-all duration-300">
                        <button
                          onClick={() => setSelectedVideo(vid)}
                          className="p-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300 cursor-pointer"
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
          )
        )}

        {/* IMAGE PREVIEW MODAL */}
        <AnimatePresence>
          {selectedImage && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedImage(null)}
                className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative bg-slate-900 border border-white/10 rounded-2xl overflow-hidden max-w-3xl w-full shadow-2xl z-10 p-4"
              >
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-white font-bold text-lg">{selectedImage.title}</h3>
                    <p className="text-xs text-slate-400">{selectedImage.category}</p>
                  </div>
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="p-2 bg-slate-950/65 hover:bg-slate-950 text-slate-400 hover:text-white border border-white/5 rounded-xl cursor-pointer"
                  >
                    <X className="h-4.5 w-4.5" />
                  </button>
                </div>
                
                <div className="aspect-video bg-slate-950 rounded-xl overflow-hidden">
                  <img
                    src={getAssetUrl(selectedImage.url)}
                    alt={selectedImage.title}
                    className="w-full h-full object-contain"
                  />
                </div>

                {selectedImage.description && (
                  <p className="text-slate-300 text-sm mt-4 font-light leading-relaxed">
                    {selectedImage.description}
                  </p>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* VIDEO INLINE IFRAME PLAYER MODAL */}
        <AnimatePresence>
          {selectedVideo && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedVideo(null)}
                className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative bg-slate-900 border border-white/10 rounded-2xl overflow-hidden max-w-3xl w-full shadow-2xl z-10 p-4"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white font-bold text-lg">{selectedVideo.title}</h3>
                  <button
                    onClick={() => setSelectedVideo(null)}
                    className="p-2 bg-slate-950/65 hover:bg-slate-950 text-slate-400 hover:text-white border border-white/5 rounded-xl cursor-pointer"
                  >
                    <X className="h-4.5 w-4.5" />
                  </button>
                </div>

                {/* Embed player */}
                <div className="aspect-video bg-slate-950 rounded-xl overflow-hidden relative">
                  <iframe
                    src={getVideoEmbedUrl(selectedVideo.url)}
                    title={selectedVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full border-0"
                  />
                </div>

                {selectedVideo.description && (
                  <p className="text-slate-300 text-sm mt-4 font-light leading-relaxed">
                    {selectedVideo.description}
                  </p>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};
