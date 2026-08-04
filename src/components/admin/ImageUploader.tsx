import React, { useState, useRef } from 'react';
import { UploadCloud, X, Loader2, Image as ImageIcon } from 'lucide-react';
import API from '../../lib/api';

interface ImageUploaderProps {
  onUploadSuccess: (url: string, publicId: string) => void;
  folder?: string;
  className?: string;
}

export default function ImageUploader({ onUploadSuccess, folder = 'portfolio', className = '' }: ImageUploaderProps) {
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
      const res = await API.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (res.data?.success) {
        onUploadSuccess(res.data.data.url, res.data.data.publicId);
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

  return (
    <div className={`relative ${className}`}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg, image/png, image/webp"
        className="hidden"
      />
      
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="w-full h-full min-h-[120px] border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 rounded-xl flex flex-col items-center justify-center gap-2 transition-colors bg-slate-50 dark:bg-slate-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 group"
      >
        {isUploading ? (
          <>
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Uploading...</span>
          </>
        ) : (
          <>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-full shadow-sm group-hover:scale-110 transition-transform">
              <UploadCloud className="w-6 h-6 text-slate-400 dark:text-slate-500 group-hover:text-indigo-500" />
            </div>
            <div className="text-center">
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300 block">Click to upload</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">PNG, JPG, WEBP (Max 5MB)</span>
            </div>
          </>
        )}
      </button>

      {error && (
        <div className="absolute -bottom-6 left-0 text-xs text-rose-500 font-medium">
          {error}
        </div>
      )}
    </div>
  );
}
