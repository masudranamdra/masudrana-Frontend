'use client';

import React, { useState, useEffect } from 'react';
import API from '../../../../lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Loader2, Save, Plus, Trash2, Camera, Heart, Compass } from 'lucide-react';

export default function AboutLifestyleAdmin() {
  const [formFields, setFormFields] = useState({
    lifestyleText: '',
    dailyLifeActivities: [] as string[],
    hobbies: [] as string[],
    travelDestinations: [] as string[],
    lifestyleImages: [] as { url: string; publicId: string }[],
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const triggerToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMsg({ text, type });
    setTimeout(() => setToastMsg(null), 3000);
  };

  useEffect(() => {
    const fetchLifestyle = async () => {
      try {
        const res = await API.get('/about/lifestyle');
        if (res.data?.success && res.data.data) {
          setFormFields({
            ...formFields,
            ...res.data.data
          });
        }
      } catch (error) {
        triggerToast('Failed to load Lifestyle info', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchLifestyle();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const res = await API.put('/about/lifestyle', formFields);
      if (res.data?.success) {
        triggerToast('Lifestyle information saved successfully!');
      } else {
        triggerToast('Failed to save', 'error');
      }
    } catch (error: any) {
      triggerToast(error.response?.data?.message || 'Failed to save', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // String Array Handlers
  const addStringItem = (field: 'dailyLifeActivities' | 'hobbies' | 'travelDestinations') => {
    setFormFields({ ...formFields, [field]: [...formFields[field], ''] });
  };
  const updateStringItem = (field: 'dailyLifeActivities' | 'hobbies' | 'travelDestinations', index: number, value: string) => {
    const updated = [...formFields[field]];
    updated[index] = value;
    setFormFields({ ...formFields, [field]: updated });
  };
  const removeStringItem = (field: 'dailyLifeActivities' | 'hobbies' | 'travelDestinations', index: number) => {
    const updated = [...formFields[field]];
    updated.splice(index, 1);
    setFormFields({ ...formFields, [field]: updated });
  };

  // Lifestyle Images (using URLs for now, can be integrated with direct upload later)
  const addLifestyleImage = () => {
    setFormFields({ ...formFields, lifestyleImages: [...formFields.lifestyleImages, { url: '', publicId: '' }] });
  };
  const updateLifestyleImage = (index: number, value: string) => {
    const updated = [...formFields.lifestyleImages];
    updated[index].url = value;
    setFormFields({ ...formFields, lifestyleImages: updated });
  };
  const removeLifestyleImage = (index: number) => {
    const updated = [...formFields.lifestyleImages];
    updated.splice(index, 1);
    setFormFields({ ...formFields, lifestyleImages: updated });
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
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Heart className="w-6 h-6 text-emerald-500" />
            Lifestyle & Interests
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Showcase what makes you human beyond work.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* Main Text */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Lifestyle Description</label>
          <textarea
            rows={4}
            value={formFields.lifestyleText}
            onChange={(e) => setFormFields({ ...formFields, lifestyleText: e.target.value })}
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 focus:border-emerald-500 rounded-xl text-sm text-slate-800 dark:text-slate-200"
            placeholder="When I'm not coding, you can find me..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Daily Activities */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 pb-2">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Compass className="w-4 h-4 text-emerald-500" />
                Daily Activities
              </h3>
              <button type="button" onClick={() => addStringItem('dailyLifeActivities')} className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 flex items-center space-x-1 text-xs font-bold">
                <Plus className="h-4 w-4" /> <span>Add</span>
              </button>
            </div>
            {formFields.dailyLifeActivities.map((item, index) => (
              <div key={index} className="flex gap-3">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => updateStringItem('dailyLifeActivities', index, e.target.value)}
                  className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 focus:border-emerald-500 rounded-xl text-sm text-slate-800 dark:text-slate-200"
                  placeholder="Morning Coffee & Reading"
                />
                <button type="button" onClick={() => removeStringItem('dailyLifeActivities', index)} className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Hobbies */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 pb-2">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Heart className="w-4 h-4 text-emerald-500" />
                Hobbies
              </h3>
              <button type="button" onClick={() => addStringItem('hobbies')} className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 flex items-center space-x-1 text-xs font-bold">
                <Plus className="h-4 w-4" /> <span>Add</span>
              </button>
            </div>
            {formFields.hobbies.map((item, index) => (
              <div key={index} className="flex gap-3">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => updateStringItem('hobbies', index, e.target.value)}
                  className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 focus:border-emerald-500 rounded-xl text-sm text-slate-800 dark:text-slate-200"
                  placeholder="Photography"
                />
                <button type="button" onClick={() => removeStringItem('hobbies', index)} className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Lifestyle Photos */}
        <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-white/5">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 pb-2">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Camera className="w-5 h-5 text-emerald-500" />
              Lifestyle Photos
            </h3>
            <button type="button" onClick={addLifestyleImage} className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 flex items-center space-x-1 text-xs font-bold bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 rounded-lg">
              <Plus className="h-4 w-4" /> <span>Add Photo URL</span>
            </button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {formFields.lifestyleImages.map((img, index) => (
              <div key={index} className="flex gap-4 items-center bg-slate-50 dark:bg-slate-900/30 p-3 rounded-xl border border-slate-200 dark:border-white/5">
                <div className="flex-1">
                  <input
                    type="text"
                    value={img.url}
                    onChange={(e) => updateLifestyleImage(index, e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 focus:border-emerald-500 rounded-lg text-sm text-slate-800 dark:text-slate-300"
                    placeholder="Image URL"
                  />
                </div>
                {img.url ? (
                  <img src={img.url} alt={`Lifestyle ${index}`} className="w-12 h-12 rounded-lg object-cover border border-slate-200 dark:border-white/10" />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-slate-200 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-white/10">
                    <Camera className="w-5 h-5 text-slate-400" />
                  </div>
                )}
                <button type="button" onClick={() => removeLifestyleImage(index)} className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end border-t border-slate-200 dark:border-white/5 pt-6 mt-6">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center space-x-2 px-6 py-3 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            <span>{isSaving ? 'Saving...' : 'Save Lifestyle Info'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
