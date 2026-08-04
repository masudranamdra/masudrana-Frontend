'use client';

import React, { useState, useEffect } from 'react';
import API from '../../../../lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Loader2, Save, Plus, Trash2, Briefcase } from 'lucide-react';

export default function AboutProfessionalAdmin() {
  const [formFields, setFormFields] = useState({
    professionalSummary: '',
    whoIAm: '',
    philosophy: '',
    coreValues: [] as string[],
    currentFocus: [] as string[],
    stats: [] as { label: string; value: string; icon: string; description: string; colorClass: string }[],
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const triggerToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMsg({ text, type });
    setTimeout(() => setToastMsg(null), 3000);
  };

  useEffect(() => {
    const fetchProfessional = async () => {
      try {
        const res = await API.get('/about/professional');
        if (res.data?.success && res.data.data) {
          setFormFields({
            ...formFields,
            ...res.data.data
          });
        }
      } catch (error) {
        triggerToast('Failed to load Professional info', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfessional();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const res = await API.put('/about/professional', formFields);
      if (res.data?.success) {
        triggerToast('Professional information saved successfully!');
      } else {
        triggerToast('Failed to save', 'error');
      }
    } catch (error: any) {
      triggerToast(error.response?.data?.message || 'Failed to save', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Handlers for Arrays
  const addStringItem = (field: 'coreValues' | 'currentFocus') => {
    setFormFields({ ...formFields, [field]: [...formFields[field], ''] });
  };
  const updateStringItem = (field: 'coreValues' | 'currentFocus', index: number, value: string) => {
    const updated = [...formFields[field]];
    updated[index] = value;
    setFormFields({ ...formFields, [field]: updated });
  };
  const removeStringItem = (field: 'coreValues' | 'currentFocus', index: number) => {
    const updated = [...formFields[field]];
    updated.splice(index, 1);
    setFormFields({ ...formFields, [field]: updated });
  };

  const addStat = () => {
    setFormFields({
      ...formFields,
      stats: [...formFields.stats, { label: '', value: '', icon: 'Briefcase', description: '', colorClass: '' }]
    });
  };
  const updateStat = (index: number, key: string, value: string) => {
    const updated = [...formFields.stats];
    updated[index] = { ...updated[index], [key]: value };
    setFormFields({ ...formFields, stats: updated });
  };
  const removeStat = (index: number) => {
    const updated = [...formFields.stats];
    updated.splice(index, 1);
    setFormFields({ ...formFields, stats: updated });
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

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Professional Profile</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Update your professional summary, values, and key stats.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* Texts */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Professional Summary</label>
            <textarea
              rows={4}
              value={formFields.professionalSummary}
              onChange={(e) => setFormFields({ ...formFields, professionalSummary: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 focus:border-indigo-500 rounded-xl text-sm text-slate-800 dark:text-slate-200"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Who I Am</label>
            <textarea
              rows={3}
              value={formFields.whoIAm}
              onChange={(e) => setFormFields({ ...formFields, whoIAm: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 focus:border-indigo-500 rounded-xl text-sm text-slate-800 dark:text-slate-200"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">My Philosophy</label>
            <textarea
              rows={2}
              value={formFields.philosophy}
              onChange={(e) => setFormFields({ ...formFields, philosophy: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 focus:border-indigo-500 rounded-xl text-sm text-slate-800 dark:text-slate-200"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Core Values */}
          <div className="space-y-4 bg-slate-50 dark:bg-slate-900/30 p-5 rounded-2xl border border-slate-200 dark:border-white/5">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 pb-2">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white">Core Values</h3>
              <button type="button" onClick={() => addStringItem('coreValues')} className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 flex items-center space-x-1 text-xs font-bold">
                <Plus className="h-4 w-4" /> <span>Add</span>
              </button>
            </div>
            {formFields.coreValues.map((item, index) => (
              <div key={index} className="flex gap-4">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => updateStringItem('coreValues', index, e.target.value)}
                  className="flex-1 px-4 py-2 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 focus:border-indigo-500 rounded-xl text-sm text-slate-800 dark:text-slate-200"
                />
                <button type="button" onClick={() => removeStringItem('coreValues', index)} className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition">
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>

          {/* Current Focus */}
          <div className="space-y-4 bg-slate-50 dark:bg-slate-900/30 p-5 rounded-2xl border border-slate-200 dark:border-white/5">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 pb-2">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white">Current Focus</h3>
              <button type="button" onClick={() => addStringItem('currentFocus')} className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 flex items-center space-x-1 text-xs font-bold">
                <Plus className="h-4 w-4" /> <span>Add</span>
              </button>
            </div>
            {formFields.currentFocus.map((item, index) => (
              <div key={index} className="flex gap-4">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => updateStringItem('currentFocus', index, e.target.value)}
                  className="flex-1 px-4 py-2 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 focus:border-indigo-500 rounded-xl text-sm text-slate-800 dark:text-slate-200"
                />
                <button type="button" onClick={() => removeStringItem('currentFocus', index)} className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition">
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-white/5">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 pb-2">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-indigo-500" />
              Key Stats / Counters
            </h2>
            <button type="button" onClick={addStat} className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 flex items-center space-x-1 text-xs font-bold bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1.5 rounded-lg">
              <Plus className="h-4 w-4" /> <span>Add Stat</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {formFields.stats.map((stat, index) => (
              <div key={index} className="p-5 bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-white/5 rounded-2xl space-y-4 relative group">
                <button type="button" onClick={() => removeStat(index)} className="absolute top-4 right-4 text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 className="h-4 w-4" />
                </button>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-500 dark:text-slate-400 font-bold block mb-1">Label</label>
                    <input type="text" value={stat.label} onChange={(e) => updateStat(index, 'label', e.target.value)} className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 focus:border-indigo-500 rounded-lg text-sm text-slate-800 dark:text-slate-300" placeholder="Years Experience" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 dark:text-slate-400 font-bold block mb-1">Value</label>
                    <input type="text" value={stat.value} onChange={(e) => updateStat(index, 'value', e.target.value)} className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 focus:border-indigo-500 rounded-lg text-sm text-slate-800 dark:text-slate-300" placeholder="8+" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-slate-500 dark:text-slate-400 font-bold block mb-1">Description</label>
                  <input type="text" value={stat.description} onChange={(e) => updateStat(index, 'description', e.target.value)} className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 focus:border-indigo-500 rounded-lg text-sm text-slate-800 dark:text-slate-300" placeholder="Building successful products..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-500 dark:text-slate-400 font-bold block mb-1">Icon Name</label>
                    <input type="text" value={stat.icon} onChange={(e) => updateStat(index, 'icon', e.target.value)} className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 focus:border-indigo-500 rounded-lg text-sm text-slate-800 dark:text-slate-300" placeholder="Briefcase" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 dark:text-slate-400 font-bold block mb-1">Color Class</label>
                    <input type="text" value={stat.colorClass} onChange={(e) => updateStat(index, 'colorClass', e.target.value)} className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 focus:border-indigo-500 rounded-lg text-sm text-slate-800 dark:text-slate-300" placeholder="text-indigo-500 bg-indigo-50" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end border-t border-slate-200 dark:border-white/5 pt-6 mt-6">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center space-x-2 px-6 py-3 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            <span>{isSaving ? 'Saving...' : 'Save Professional Info'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
