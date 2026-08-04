'use client';

import React, { useState, useEffect } from 'react';
import API from '../../../../lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Loader2, Save, Image as ImageIcon, Trash2, Video } from 'lucide-react';
import ImageUploader from '../../../../components/admin/ImageUploader';

export default function AboutGalleryAdmin() {
  const [formFields, setFormFields] = useState({
    gallery: [] as { 
      url: string; 
      publicId: string;
      caption: string; 
      type: 'image' | 'video';
      isFeatured: boolean;
    }[]
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const triggerToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMsg({ text, type });
    setTimeout(() => setToastMsg(null), 3000);
  };

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await API.get('/about/gallery');
        if (res.data?.success && res.data.data) {
          setFormFields({
            gallery: res.data.data.gallery || []
          });
        }
      } catch (error) {
        triggerToast('Failed to load Gallery info', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const res = await API.put('/about/gallery', formFields);
      if (res.data?.success) {
        triggerToast('Gallery saved successfully!');
      } else {
        triggerToast('Failed to save', 'error');
      }
    } catch (error: any) {
      triggerToast(error.response?.data?.message || 'Failed to save', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUploadSuccess = (url: string, publicId: string) => {
    setFormFields({
      gallery: [
        { url, publicId, caption: '', type: 'image', isFeatured: false },
        ...formFields.gallery
      ]
    });
    triggerToast('Image uploaded and added to gallery!');
  };

  const addVideoURL = () => {
    setFormFields({
      gallery: [
        { url: '', publicId: '', caption: '', type: 'video', isFeatured: false },
        ...formFields.gallery
      ]
    });
  };

  const updateGalleryItem = (index: number, key: string, value: any) => {
    const updated = [...formFields.gallery];
    updated[index] = { ...updated[index], [key]: value };
    setFormFields({ gallery: updated });
  };

  const removeGalleryItem = (index: number) => {
    const updated = [...formFields.gallery];
    updated.splice(index, 1);
    setFormFields({ gallery: updated });
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 relative">
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 z-[60] p-4 rounded-xl border flex items-center space-x-3 shadow-xl backdrop-blur-md ${
              toastMsg.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
            }`}
          >
            {toastMsg.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
            <span className="text-xs font-semibold">{toastMsg.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center border-b border-slate-200 dark:border-white/5 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-indigo-500" />
            Media Gallery
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Upload images to Cloudinary or link external videos.</p>
        </div>
        <button type="button" onClick={addVideoURL} className="text-white bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 dark:hover:bg-slate-600 flex items-center space-x-2 text-sm font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm">
          <Video className="h-4 w-4" /> <span>Add Video Link</span>
        </button>
      </div>

      <div className="bg-slate-50 dark:bg-slate-900/30 p-6 rounded-2xl border border-slate-200 dark:border-white/5">
        <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Upload New Image</h3>
        <ImageUploader onUploadSuccess={handleUploadSuccess} folder="about_gallery" />
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {formFields.gallery.map((item, index) => (
            <div key={index} className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden group hover:border-indigo-500 transition-colors">
              {/* Media Preview */}
              <div className="relative aspect-video bg-slate-100 dark:bg-slate-900 overflow-hidden">
                {item.type === 'image' && item.url ? (
                  <img src={item.url} alt={item.caption} className="w-full h-full object-cover" />
                ) : item.type === 'video' && item.url ? (
                  <iframe src={item.url} className="w-full h-full" allowFullScreen />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                    {item.type === 'image' ? <ImageIcon className="w-8 h-8" /> : <Video className="w-8 h-8" />}
                  </div>
                )}
                
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button type="button" onClick={() => removeGalleryItem(index)} className="p-1.5 bg-rose-500 text-white rounded-lg hover:bg-rose-600 shadow-sm">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="absolute top-2 left-2">
                  <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded-md shadow-sm ${item.type === 'image' ? 'bg-indigo-500 text-white' : 'bg-rose-500 text-white'}`}>
                    {item.type}
                  </span>
                </div>
              </div>

              {/* Edit Details */}
              <div className="p-4 space-y-3">
                {item.type === 'video' && (
                  <div className="space-y-1">
                    <label className="text-xs text-slate-500 dark:text-slate-400 font-bold">Video URL</label>
                    <input 
                      type="text" 
                      value={item.url} 
                      onChange={(e) => updateGalleryItem(index, 'url', e.target.value)} 
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-lg text-sm text-slate-800 dark:text-slate-300 focus:outline-none focus:border-indigo-500" 
                      placeholder="YouTube/Vimeo embed URL" 
                    />
                  </div>
                )}
                <div className="space-y-1">
                  <label className="text-xs text-slate-500 dark:text-slate-400 font-bold">Caption</label>
                  <input 
                    type="text" 
                    value={item.caption} 
                    onChange={(e) => updateGalleryItem(index, 'caption', e.target.value)} 
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-lg text-sm text-slate-800 dark:text-slate-300 focus:outline-none focus:border-indigo-500" 
                    placeholder="Describe this media..." 
                  />
                </div>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={item.isFeatured} 
                    onChange={(e) => updateGalleryItem(index, 'isFeatured', e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 bg-slate-100 border-slate-300 dark:bg-slate-900 dark:border-slate-700"
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">Feature in main section</span>
                </label>
              </div>
            </div>
          ))}
        </div>

        {formFields.gallery.length === 0 && (
          <div className="text-center p-12 bg-slate-50 dark:bg-slate-900/30 rounded-2xl border border-dashed border-slate-300 dark:border-white/10">
            <ImageIcon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-slate-600 dark:text-slate-300 font-medium">Gallery is empty</h3>
            <p className="text-sm text-slate-500 mt-1">Upload images or add video links above.</p>
          </div>
        )}

        <div className="flex justify-end border-t border-slate-200 dark:border-white/5 pt-6 mt-6">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center space-x-2 px-6 py-3 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all disabled:opacity-50 shadow-md"
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            <span>{isSaving ? 'Saving...' : 'Save Gallery Order'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
