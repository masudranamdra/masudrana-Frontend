'use client';

import React, { useState, useEffect } from 'react';
import API from '../../../../lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Loader2, Save, X, FileText, UploadCloud, Trash2, ExternalLink } from 'lucide-react';
import { useAbout } from '../../../../context/AboutContext';
import DualImageInput from '../../../../components/admin/DualImageInput';

export default function AboutBasicAdmin() {
  const { fetchAbout } = useAbout();
  const [formFields, setFormFields] = useState({
    fullName: '',
    tagline: '',
    shortBio: '',
    coverImage: { url: '', publicId: '' },
    profileImage: { url: '', publicId: '' },
    mission: '',
    vision: '',
    careerObjective: '',
    resumeUrl: '',
    contactEmail: '',
    location: '',
    availability: '',
    socialLinks: [] as { platform: string; url: string; icon?: string; label?: string }[],
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [toastMsg, setToastMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const triggerToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMsg({ text, type });
    setTimeout(() => setToastMsg(null), 3000);
  };

  useEffect(() => {
    const fetchBasic = async () => {
      try {
        const res = await API.get('/about/basic');
        if (res.data?.success && res.data.data) {
          setFormFields({
            ...formFields,
            ...res.data.data
          });
        }
      } catch (error) {
        triggerToast('Failed to load Basic info', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchBasic();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const res = await API.put('/about/basic', formFields);
      if (res.data?.success) {
        triggerToast('Basic information saved successfully!');
        await fetchAbout();
      } else {
        triggerToast('Failed to save', 'error');
      }
    } catch (error: any) {
      triggerToast(error.response?.data?.message || 'Failed to save', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  const addSocialLink = () => {
    setFormFields({
      ...formFields,
      socialLinks: [...formFields.socialLinks, { platform: 'Github', url: '' }]
    });
  };

  const removeSocialLink = (index: number) => {
    const updated = [...formFields.socialLinks];
    updated.splice(index, 1);
    setFormFields({ ...formFields, socialLinks: updated });
  };

  const updateSocialLink = (index: number, field: string, value: string) => {
    const updated = [...formFields.socialLinks];
    updated[index] = { ...updated[index], [field]: value };
    setFormFields({ ...formFields, socialLinks: updated });
  };

  return (
    <div className="space-y-6 relative">
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 z-[60] p-4 rounded-xl border flex items-center space-x-3 shadow-xl backdrop-blur-md ${toastMsg.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
              : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
              }`}
          >
            {toastMsg.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
            <span className="text-xs font-semibold">{toastMsg.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Basic Info</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your identity, bio, and hero images.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Full Name</label>
            <input
              type="text"
              value={formFields.fullName}
              onChange={(e) => setFormFields({ ...formFields, fullName: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 focus:border-indigo-500 rounded-xl text-sm text-slate-800 dark:text-slate-200"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Tagline / Title</label>
            <input
              type="text"
              value={formFields.tagline}
              onChange={(e) => setFormFields({ ...formFields, tagline: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 focus:border-indigo-500 rounded-xl text-sm text-slate-800 dark:text-slate-200"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Short Bio</label>
          <textarea
            rows={3}
            value={formFields.shortBio}
            onChange={(e) => setFormFields({ ...formFields, shortBio: e.target.value })}
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 focus:border-indigo-500 rounded-xl text-sm text-slate-800 dark:text-slate-200"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DualImageInput
            label="Profile Image (প্রোফাইল ছবি)"
            value={formFields.profileImage.url}
            onChangeUrl={(url) => setFormFields((prev) => ({ ...prev, profileImage: { ...prev.profileImage, url } }))}
            autoUpload={true}
            folder="about"
          />
          <DualImageInput
            label="Cover Image (কভার ছবি)"
            value={formFields.coverImage.url}
            onChangeUrl={(url) => setFormFields((prev) => ({ ...prev, coverImage: { ...prev.coverImage, url } }))}
            autoUpload={true}
            folder="about"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Contact Email</label>
            <input
              type="email"
              value={formFields.contactEmail}
              onChange={(e) => setFormFields({ ...formFields, contactEmail: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 focus:border-indigo-500 rounded-xl text-sm text-slate-800 dark:text-slate-200"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Location</label>
            <input
              type="text"
              value={formFields.location}
              onChange={(e) => setFormFields({ ...formFields, location: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 focus:border-indigo-500 rounded-xl text-sm text-slate-800 dark:text-slate-200"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Availability</label>
            <input
              type="text"
              value={formFields.availability}
              onChange={(e) => setFormFields({ ...formFields, availability: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 focus:border-indigo-500 rounded-xl text-sm text-slate-800 dark:text-slate-200"
              placeholder="Available for freelance"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Mission</label>
          <textarea
            rows={2}
            value={formFields.mission}
            onChange={(e) => setFormFields({ ...formFields, mission: e.target.value })}
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 focus:border-indigo-500 rounded-xl text-sm text-slate-800 dark:text-slate-200"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Vision</label>
          <textarea
            rows={2}
            value={formFields.vision}
            onChange={(e) => setFormFields({ ...formFields, vision: e.target.value })}
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 focus:border-indigo-500 rounded-xl text-sm text-slate-800 dark:text-slate-200"
          />
        </div>

        {/* Resume / CV Management Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-indigo-500/20 text-white space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-indigo-400" />
                <h3 className="text-lg font-bold text-white">Resume / CV Management</h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Upload your resume PDF/DOC file or paste a Google Drive view link to display on the homepage.
              </p>
            </div>

            {formFields.resumeUrl && (
              <div className="flex items-center space-x-2">
                <a
                  href={formFields.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors border border-indigo-500/30"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Preview</span>
                </a>
                <button
                  type="button"
                  onClick={() => setFormFields({ ...formFields, resumeUrl: '' })}
                  className="px-3.5 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors border border-rose-500/30"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Remove Resume</span>
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* File Upload Option */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Upload PDF / Document File</label>
              <div className="relative">
                <input
                  type="file"
                  id="resumeFileUpload"
                  accept=".pdf,.doc,.docx"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    try {
                      setIsUploadingResume(true);
                      const formData = new FormData();
                      formData.append('image', file); // API expects upload file field
                      const res = await API.post('/about/upload', formData);
                      if (res.data?.success && res.data.data?.url) {
                        setFormFields((prev) => ({ ...prev, resumeUrl: res.data.data.url }));
                        triggerToast('Resume uploaded successfully!');
                      } else {
                        triggerToast('Failed to upload file', 'error');
                      }
                    } catch (err: any) {
                      triggerToast(err.response?.data?.message || 'Error uploading resume', 'error');
                    } finally {
                      setIsUploadingResume(false);
                      e.target.value = '';
                    }
                  }}
                  className="hidden"
                />
                <label
                  htmlFor="resumeFileUpload"
                  className="flex items-center justify-center space-x-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold cursor-pointer transition-all shadow-md shadow-indigo-600/20"
                >
                  {isUploadingResume ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <UploadCloud className="h-4 w-4" />
                  )}
                  <span>{isUploadingResume ? 'Uploading File...' : 'Upload PDF File'}</span>
                </label>
              </div>
            </div>

            {/* Direct URL Option */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Or Paste Direct URL (Google Drive / Cloudinary)</label>
              <input
                type="url"
                value={formFields.resumeUrl}
                onChange={(e) => setFormFields({ ...formFields, resumeUrl: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-900 border border-white/10 focus:border-indigo-500 rounded-xl text-xs text-white placeholder-slate-500"
                placeholder="https://drive.google.com/... or https://domain.com/resume.pdf"
              />
            </div>
          </div>

          {formFields.resumeUrl ? (
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-between text-xs text-indigo-300">
              <span className="truncate max-w-[80%] font-mono">Attached: {formFields.resumeUrl}</span>
              <span className="px-2 py-0.5 bg-indigo-500/20 rounded text-[10px] uppercase font-bold text-indigo-300">Active</span>
            </div>
          ) : (
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-300 flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>No Resume attached yet. Upload a file above or paste a URL link.</span>
            </div>
          )}
        </div>

        {/* Social Links Section */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">Social Links</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Add your professional links (GitHub, LinkedIn, Medium etc.)</p>
            </div>
            <button
              type="button"
              onClick={addSocialLink}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-sm font-semibold transition-colors"
            >
              + Add Link
            </button>
          </div>

          <div className="space-y-4">
            {formFields.socialLinks.map((link, index) => (
              <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-white/5">
                <div className="w-full sm:w-1/3">
                  <select
                    value={link.platform}
                    onChange={(e) => updateSocialLink(index, 'platform', e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-lg text-sm"
                  >
                    <option value="Github">GitHub</option>
                    <option value="Linkedin">LinkedIn</option>
                    <option value="Twitter">Twitter (X)</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Medium">Medium</option>
                    <option value="Youtube">YouTube</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Website">Website</option>
                  </select>
                </div>
                <div className="w-full sm:w-2/3 flex gap-2">
                  <input
                    type="url"
                    value={link.url}
                    onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-lg text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => removeSocialLink(index)}
                    className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
            {formFields.socialLinks.length === 0 && (
              <div className="text-center py-6 text-sm text-slate-500 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                No social links added yet. Click "+ Add Link" to get started.
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end border-t border-slate-200 dark:border-white/5 pt-6 mt-6">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center space-x-2 px-6 py-3 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            <span>{isSaving ? 'Saving...' : 'Save Basic Info'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
