'use client';

import React, { useState, useEffect } from 'react';
import API from '../../../../lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Loader2, Save, X } from 'lucide-react';

export default function AboutBasicAdmin() {
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
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Profile Image URL</label>
            <input
              type="text"
              value={formFields.profileImage.url}
              onChange={(e) => setFormFields({ ...formFields, profileImage: { ...formFields.profileImage, url: e.target.value } })}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 focus:border-indigo-500 rounded-xl text-sm text-slate-800 dark:text-slate-200"
              placeholder="https://..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Cover Image URL</label>
            <input
              type="text"
              value={formFields.coverImage.url}
              onChange={(e) => setFormFields({ ...formFields, coverImage: { ...formFields.coverImage, url: e.target.value } })}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 focus:border-indigo-500 rounded-xl text-sm text-slate-800 dark:text-slate-200"
              placeholder="https://..."
            />
          </div>
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

        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Resume Link (PDF, Doc, or Google Drive)</label>
            <input
              type="url"
              value={formFields.resumeUrl}
              onChange={(e) => setFormFields({ ...formFields, resumeUrl: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 focus:border-indigo-500 rounded-xl text-sm text-slate-800 dark:text-slate-200"
              placeholder="https://drive.google.com/... or https://yourdomain.com/resume.pdf"
            />
          </div>
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
