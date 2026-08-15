'use client';

import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, Link as LinkIcon, Image as ImageIcon, X, Loader2, Check } from 'lucide-react';
import API from '../../lib/api';

interface DualImageInputProps {
  label?: string;
  value?: string;
  onChangeUrl: (url: string) => void;
  fileObject?: File | null;
  onFileSelect?: (file: File | null) => void;
  folder?: string;
  autoUpload?: boolean;
  accept?: string;
  placeholder?: string;
  className?: string;
}

export default function DualImageInput({
  label = 'Image',
  value = '',
  onChangeUrl,
  fileObject = null,
  onFileSelect,
  folder = 'portfolio',
  autoUpload = false,
  accept = 'image/*',
  placeholder = 'https://example.com/image.jpg',
  className = '',
}: DualImageInputProps) {
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload');
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [urlInput, setUrlInput] = useState<string>(value || '');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setUrlInput(value || '');
    if (value) {
      setPreviewUrl(value);
    }
  }, [value]);

  useEffect(() => {
    if (fileObject) {
      const objectUrl = URL.createObjectURL(fileObject);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else if (value) {
      setPreviewUrl(value);
    } else {
      setPreviewUrl('');
    }
  }, [fileObject, value]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError('');

    if (autoUpload) {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('image', file);
      formData.append('folder', folder);

      try {
        const res = await API.post('/upload', formData);
        if (res.data?.success && res.data?.data?.url) {
          onChangeUrl(res.data.data.url);
          setPreviewUrl(res.data.data.url);
        } else {
          setUploadError('Upload failed');
        }
      } catch (err: any) {
        setUploadError(err.response?.data?.message || 'Error uploading file');
      } finally {
        setIsUploading(false);
      }
    } else {
      if (onFileSelect) {
        onFileSelect(file);
      }
    }
  };

  const handleUrlSubmit = () => {
    onChangeUrl(urlInput);
    setPreviewUrl(urlInput);
    if (onFileSelect) {
      onFileSelect(null);
    }
  };

  const handleClear = () => {
    onChangeUrl('');
    setUrlInput('');
    setPreviewUrl('');
    if (onFileSelect) {
      onFileSelect(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />
          <span>{label}</span>
        </label>

        <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-white/10 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors font-medium cursor-pointer ${
              activeTab === 'upload'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UploadCloud className="w-3 h-3" />
            <span>ছবি আপলোড (File)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors font-medium cursor-pointer ${
              activeTab === 'url'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LinkIcon className="w-3 h-3" />
            <span>ছবির লিংক (URL)</span>
          </button>
        </div>
      </div>

      {activeTab === 'upload' && (
        <div className="relative">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept={accept}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full py-3 px-4 bg-slate-950 border border-dashed border-slate-700 hover:border-indigo-500 rounded-xl flex items-center justify-center gap-2 text-xs font-medium text-slate-300 hover:text-white transition-all group cursor-pointer"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
                <span>Uploading Image...</span>
              </>
            ) : fileObject ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="truncate max-w-[200px] text-emerald-400 font-semibold">{fileObject.name}</span>
                <span className="text-slate-500">(Click to change)</span>
              </>
            ) : (
              <>
                <UploadCloud className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
                <span>ছবি ফাইল সিলেক্ট করুন (Direct File Upload)</span>
              </>
            )}
          </button>
        </div>
      )}

      {activeTab === 'url' && (
        <div className="flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => {
              setUrlInput(e.target.value);
              onChangeUrl(e.target.value);
            }}
            placeholder={placeholder}
            className="flex-1 px-3 py-2 bg-slate-950 border border-white/10 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          />
          <button
            type="button"
            onClick={handleUrlSubmit}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Apply URL
          </button>
        </div>
      )}

      {uploadError && (
        <p className="text-xs text-rose-400 mt-1 font-medium">{uploadError}</p>
      )}

      {previewUrl && (
        <div className="relative mt-2 rounded-xl overflow-hidden border border-white/10 bg-slate-950 p-2 flex items-center gap-3">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-12 h-12 rounded-lg object-cover bg-slate-900 border border-white/10"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100';
            }}
          />
          <div className="flex-1 min-w-0">
            <span className="text-[11px] font-semibold text-emerald-400 block truncate">
              {fileObject ? `Selected File: ${fileObject.name}` : 'Image URL Active'}
            </span>
            <span className="text-[10px] text-slate-400 block truncate">{previewUrl}</span>
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="p-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 rounded-lg transition-colors cursor-pointer"
            title="Remove Image"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
