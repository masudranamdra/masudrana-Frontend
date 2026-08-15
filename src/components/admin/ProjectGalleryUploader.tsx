'use client';

import React, { useState } from 'react';
import { Image as ImageIcon, Plus, Trash2, ExternalLink, UploadCloud, Check } from 'lucide-react';
import API from '../../lib/api';

interface ProjectGalleryUploaderProps {
  label?: string;
  images: string[];
  onChange: (images: string[]) => void;
  folder?: string;
}

export default function ProjectGalleryUploader({
  label = 'Project Case Study & Gallery Photos (গ্যালারি ও কেস স্টাডি ছবি)',
  images = [],
  onChange,
  folder = 'projects_gallery',
}: ProjectGalleryUploaderProps) {
  const [newUrl, setNewUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleAddUrl = () => {
    if (!newUrl.trim()) return;
    onChange([...images, newUrl.trim()]);
    setNewUrl('');
  };

  const handleRemoveImage = (index: number) => {
    const updated = [...images];
    updated.splice(index, 1);
    onChange(updated);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('image', file);
      formData.append('folder', folder);

      const res = await API.post('/upload', formData);
      if (res.data?.success && res.data.data?.url) {
        onChange([...images, res.data.data.url]);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-3 p-4 bg-slate-950/60 rounded-2xl border border-white/10">
      <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <ImageIcon className="w-4 h-4 text-indigo-400" />
          <span>{label}</span>
        </span>
        <span className="text-[11px] font-mono text-indigo-400 font-semibold">{images.length} Photos Added</span>
      </label>

      {/* Add New Image Input Controls (File Upload OR Image URL) */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
        <div className="sm:col-span-8 flex gap-2">
          <input
            type="url"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="ছবির ডিরেক্ট URL পেস্ট করুন (e.g. https://...)"
            className="flex-1 px-3 py-2 bg-slate-950 border border-white/10 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          />
          <button
            type="button"
            onClick={handleAddUrl}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-1 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Link</span>
          </button>
        </div>

        <div className="sm:col-span-4 relative">
          <input
            type="file"
            id="galleryDirectUpload"
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />
          <label
            htmlFor="galleryDirectUpload"
            className="w-full py-2 px-3 bg-slate-900 border border-dashed border-slate-700 hover:border-indigo-500 rounded-xl flex items-center justify-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <UploadCloud className="w-3.5 h-3.5 text-indigo-400" />
            <span>{isUploading ? 'Uploading...' : 'Upload File'}</span>
          </label>
        </div>
      </div>

      {/* Gallery Image List Grid */}
      {images.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 pt-2">
          {images.map((imgUrl, idx) => (
            <div
              key={idx}
              className="relative aspect-video rounded-xl overflow-hidden border border-white/10 bg-slate-900 group"
            >
              <img src={imgUrl} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <a
                  href={imgUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
                  title="View full image"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="p-1.5 bg-rose-500/80 hover:bg-rose-500 text-white rounded-lg transition-colors cursor-pointer"
                  title="Remove image"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-[11px] text-slate-500 italic pt-1">
          কেস স্টাডি বা গ্যালারির জন্য একাধিক ছবির ফাইল আপলোড করুন অথবা ডিরেক্ট ইমেজ লিংক যুক্ত করুন।
        </p>
      )}
    </div>
  );
}
