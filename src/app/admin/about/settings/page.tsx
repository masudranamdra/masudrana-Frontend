'use client';

import React, { useState, useEffect } from 'react';
import API from '../../../../lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Loader2, Save, Layout, Globe, Palette } from 'lucide-react';

export default function AboutSettingsAdmin() {
  const [formFields, setFormFields] = useState({
    theme: 'dark',
    globalAnimation: 'fade',
    containerWidth: 'max-w-7xl',
    sectionGap: 'gap-16',
    borderRadius: 'rounded-2xl',
    boxShadow: 'shadow-xl',
    typography: 'font-sans',
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
    seoOgImage: '',
    canonicalUrl: '',
    showStory: true,
    showEducation: true,
    showExperience: true,
    showSkills: true,
    showServices: true,
    showGallery: true,
    showFAQ: true,
    showTestimonials: true,
    showProjects: true,
    showLifestyle: true,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const triggerToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMsg({ text, type });
    setTimeout(() => setToastMsg(null), 3000);
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await API.get('/about/settings');
        if (res.data?.success && res.data.data) {
          setFormFields({
            ...formFields,
            ...res.data.data
          });
        }
      } catch (error) {
        triggerToast('Failed to load settings', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const res = await API.put('/about/settings', formFields);
      if (res.data?.success) {
        triggerToast('Settings saved successfully!');
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

  const ToggleSwitch = ({ label, field }: { label: string, field: keyof typeof formFields }) => (
    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-xl">
      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
      <button
        type="button"
        onClick={() => setFormFields({ ...formFields, [field]: !formFields[field] })}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          formFields[field] ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            formFields[field] ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

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

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Page Settings</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Configure layout, SEO, and visibility rules.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* Style Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-2">
            <Palette className="w-5 h-5 text-indigo-500" />
            Design & Layout
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Theme Preference</label>
              <select
                value={formFields.theme}
                onChange={(e) => setFormFields({ ...formFields, theme: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 focus:border-indigo-500 rounded-xl text-sm text-slate-800 dark:text-slate-200"
              >
                <option value="dark">Dark Theme</option>
                <option value="light">Light Theme</option>
                <option value="glass">Glassmorphism</option>
                <option value="gradient">Gradient Colors</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Global Animation</label>
              <select
                value={formFields.globalAnimation}
                onChange={(e) => setFormFields({ ...formFields, globalAnimation: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 focus:border-indigo-500 rounded-xl text-sm text-slate-800 dark:text-slate-200"
              >
                <option value="fade">Fade In</option>
                <option value="slide">Slide Up</option>
                <option value="scale">Scale & Reveal</option>
                <option value="parallax">Parallax Scroll</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Container Width</label>
              <select
                value={formFields.containerWidth}
                onChange={(e) => setFormFields({ ...formFields, containerWidth: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 focus:border-indigo-500 rounded-xl text-sm text-slate-800 dark:text-slate-200"
              >
                <option value="max-w-5xl">Narrow (5xl)</option>
                <option value="max-w-7xl">Default (7xl)</option>
                <option value="max-w-full">Full Width</option>
              </select>
            </div>
          </div>
        </div>

        {/* SEO Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-2">
            <Globe className="w-5 h-5 text-indigo-500" />
            SEO Optimization
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">SEO Title</label>
              <input
                type="text"
                value={formFields.seoTitle}
                onChange={(e) => setFormFields({ ...formFields, seoTitle: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 focus:border-indigo-500 rounded-xl text-sm text-slate-800 dark:text-slate-200"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Canonical URL</label>
              <input
                type="text"
                value={formFields.canonicalUrl}
                onChange={(e) => setFormFields({ ...formFields, canonicalUrl: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 focus:border-indigo-500 rounded-xl text-sm text-slate-800 dark:text-slate-200"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">SEO Meta Description</label>
            <textarea
              rows={2}
              value={formFields.seoDescription}
              onChange={(e) => setFormFields({ ...formFields, seoDescription: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 focus:border-indigo-500 rounded-xl text-sm text-slate-800 dark:text-slate-200"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">SEO Keywords (comma separated)</label>
            <input
              type="text"
              value={formFields.seoKeywords}
              onChange={(e) => setFormFields({ ...formFields, seoKeywords: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 focus:border-indigo-500 rounded-xl text-sm text-slate-800 dark:text-slate-200"
            />
          </div>
        </div>

        {/* Section Visibility */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-2">
            <Layout className="w-5 h-5 text-indigo-500" />
            Section Visibility Toggles
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <ToggleSwitch label="My Story" field="showStory" />
            <ToggleSwitch label="Education" field="showEducation" />
            <ToggleSwitch label="Experience" field="showExperience" />
            <ToggleSwitch label="Skills & Tech" field="showSkills" />
            <ToggleSwitch label="Services" field="showServices" />
            <ToggleSwitch label="Gallery" field="showGallery" />
            <ToggleSwitch label="Testimonials" field="showTestimonials" />
            <ToggleSwitch label="Projects" field="showProjects" />
            <ToggleSwitch label="Lifestyle" field="showLifestyle" />
            <ToggleSwitch label="FAQ" field="showFAQ" />
          </div>
        </div>

        <div className="flex justify-end border-t border-slate-200 dark:border-white/5 pt-6 mt-6">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center space-x-2 px-6 py-3 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
