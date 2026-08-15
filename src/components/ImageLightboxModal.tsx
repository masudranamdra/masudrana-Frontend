'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Download, ZoomIn, ZoomOut, Maximize2, Image as ImageIcon } from 'lucide-react';
import { getAssetUrl } from '../lib/api';

interface ImageLightboxModalProps {
  isOpen: boolean;
  images: string[];
  currentIndex?: number;
  title?: string;
  onClose: () => void;
}

export const ImageLightboxModal: React.FC<ImageLightboxModalProps> = ({
  isOpen,
  images = [],
  currentIndex = 0,
  title = '',
  onClose,
}) => {
  const [index, setIndex] = useState(currentIndex);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    setIndex(currentIndex);
  }, [currentIndex, isOpen]);

  // Keyboard navigation & Escape key listener
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, index, images.length]);

  if (!isOpen || images.length === 0) return null;

  const currentImageUrl = getAssetUrl(images[index] || images[0]);

  const handlePrev = () => {
    setIsZoomed(false);
    setIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = () => {
    setIsZoomed(false);
    setIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = currentImageUrl;
    link.download = `image_${index + 1}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[500] flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-2 sm:p-4 md:p-6 overflow-hidden select-none"
        onClick={onClose}
      >
        {/* Main Lightbox Dialog Container */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-6xl h-full max-h-[92vh] flex flex-col justify-between items-center bg-slate-900/90 border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
        >
          {/* Top Controls Bar */}
          <div className="w-full px-4 sm:px-6 py-3.5 bg-slate-950/80 border-b border-white/10 flex items-center justify-between z-20">
            <div className="flex items-center space-x-2 text-slate-300 text-xs sm:text-sm font-semibold truncate max-w-[60%]">
              <ImageIcon className="w-4 h-4 text-indigo-400 shrink-0" />
              <span className="truncate">{title || 'Full Resolution Image Preview'}</span>
              {images.length > 1 && (
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 font-mono text-xs font-bold shrink-0">
                  {index + 1} / {images.length}
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              <button
                type="button"
                onClick={() => setIsZoomed(!isZoomed)}
                className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
                title={isZoomed ? 'Reset Zoom' : 'Zoom Image'}
              >
                {isZoomed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={handleDownload}
                className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
                title="Download Full Image"
              >
                <Download className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onClose}
                className="p-2 text-slate-300 hover:text-white hover:bg-rose-500/20 rounded-xl transition-colors cursor-pointer ml-1"
                title="Close (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Central Image Viewport (Supports ANY aspect ratio & dimension without cropping!) */}
          <div className="relative flex-1 w-full flex items-center justify-center p-2 sm:p-6 overflow-auto custom-scrollbar">
            {images.length > 1 && (
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-3 sm:left-5 z-30 p-2.5 sm:p-3 bg-slate-950/70 hover:bg-indigo-600 text-white rounded-full transition-all shadow-xl hover:scale-110 cursor-pointer border border-white/10"
                title="Previous Image (Left Arrow)"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            )}

            <div className={`relative flex items-center justify-center transition-transform duration-300 ${
              isZoomed ? 'cursor-zoom-out scale-125' : 'cursor-zoom-in scale-100'
            }`}>
              <img
                src={currentImageUrl}
                alt={title || `Image ${index + 1}`}
                onClick={() => setIsZoomed(!isZoomed)}
                className="max-h-[75vh] sm:max-h-[80vh] max-w-full w-auto h-auto object-contain rounded-2xl shadow-2xl transition-all duration-300"
              />
            </div>

            {images.length > 1 && (
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-3 sm:right-5 z-30 p-2.5 sm:p-3 bg-slate-950/70 hover:bg-indigo-600 text-white rounded-full transition-all shadow-xl hover:scale-110 cursor-pointer border border-white/10"
                title="Next Image (Right Arrow)"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            )}
          </div>

          {/* Bottom Thumbnails Strip (When multi-image gallery) */}
          {images.length > 1 && (
            <div className="w-full px-4 py-3 bg-slate-950/80 border-t border-white/10 flex items-center justify-center gap-2 overflow-x-auto no-scrollbar z-20">
              {images.map((img, idx) => {
                const url = getAssetUrl(img);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setIsZoomed(false);
                      setIndex(idx);
                    }}
                    className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                      idx === index
                        ? 'border-indigo-500 scale-105 shadow-md shadow-indigo-500/20'
                        : 'border-white/10 opacity-50 hover:opacity-100'
                    }`}
                  >
                    <img src={url} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                );
              })}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
