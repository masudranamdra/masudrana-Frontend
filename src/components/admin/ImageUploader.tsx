import React, { useState, useRef } from 'react';
import { UploadCloud, Link as LinkIcon, Loader2, Image as ImageIcon, Check } from 'lucide-react';
import API from '../../lib/api';

interface ImageUploaderProps {
  onUploadSuccess: (url: string, publicId: string) => void;
  folder?: string;
  className?: string;
}

export default function ImageUploader({ onUploadSuccess, folder = 'portfolio', className = '' }: ImageUploaderProps) {
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload');
  const [urlInput, setUrlInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError('File size must be less than 5MB');
      return;
    }

    setError('');
    setIsUploading(true);

    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', folder);

    try {
      const res = await API.post('/upload', formData);
      
      if (res.data?.success) {
        onUploadSuccess(res.data.data.url, res.data.data.publicId || '');
      } else {
        setError('Upload failed');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Error uploading file');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) {
      setError('Please enter a valid image URL');
      return;
    }
    setError('');
    onUploadSuccess(urlInput.trim(), '');
    setUrlInput('');
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Mode Selector Tabs */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-white/10 pb-2">
        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <ImageIcon className="w-4 h-4 text-indigo-500" />
          <span>Image Source Option</span>
        </span>
        <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-white/10 text-xs">
          <button
            type="button"
            onClick={() => { setActiveTab('upload'); setError(''); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all font-semibold cursor-pointer ${
              activeTab === 'upload'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>ছবি আপলোড (File Upload)</span>
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('url'); setError(''); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all font-semibold cursor-pointer ${
              activeTab === 'url'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>ছবির লিংক (Image URL)</span>
          </button>
        </div>
      </div>

      {/* Tab 1: File Upload */}
      {activeTab === 'upload' && (
        <div className="relative">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/jpeg, image/png, image/webp, image/gif"
            className="hidden"
          />
          
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full min-h-[110px] border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 rounded-xl flex flex-col items-center justify-center gap-2 transition-colors bg-slate-50 dark:bg-slate-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 group cursor-pointer"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-7 h-7 text-indigo-500 animate-spin" />
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Uploading Image...</span>
              </>
            ) : (
              <>
                <div className="p-2.5 bg-white dark:bg-slate-800 rounded-full shadow-sm group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-5 h-5 text-slate-400 dark:text-slate-500 group-hover:text-indigo-500" />
                </div>
                <div className="text-center">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">সরাসরি ডিভাইস থেকে ছবি আপলোড করুন</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">PNG, JPG, WEBP, GIF (Max 5MB)</span>
                </div>
              </>
            )}
          </button>
        </div>
      )}

      {/* Tab 2: Direct Image URL */}
      {activeTab === 'url' && (
        <form onSubmit={handleUrlSubmit} className="space-y-2">
          <div className="flex gap-2">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://images.unsplash.com/photo-... or Cloudinary / Drive link"
              className="flex-1 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/10 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Add Link</span>
            </button>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            যেকোনো সরাসরি ছবির URL লিংক পেস্ট করে 'Add Link' বাটনে ক্লিক করুন।
          </p>
        </form>
      )}

      {error && (
        <div className="text-xs text-rose-500 font-medium">
          {error}
        </div>
      )}
    </div>
  );
}
