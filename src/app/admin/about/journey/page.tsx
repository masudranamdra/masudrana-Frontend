'use client';

import React, { useState, useEffect } from 'react';
import API from '../../../../lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Loader2, Save, Plus, Trash2, Route, Calendar, GraduationCap, Briefcase } from 'lucide-react';

export default function AboutJourneyAdmin() {
  const [formFields, setFormFields] = useState({
    timeline: [] as { 
      year: string; 
      title: string; 
      description: string; 
      type: 'education' | 'experience' | 'milestone'; 
      icon: string;
      link?: string;
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
    const fetchTimeline = async () => {
      try {
        const res = await API.get('/about/timeline');
        if (res.data?.success && res.data.data) {
          setFormFields({
            timeline: res.data.data.timeline || []
          });
        }
      } catch (error) {
        triggerToast('Failed to load Timeline info', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchTimeline();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const res = await API.put('/about/timeline', formFields);
      if (res.data?.success) {
        triggerToast('Timeline saved successfully!');
      } else {
        triggerToast('Failed to save', 'error');
      }
    } catch (error: any) {
      triggerToast(error.response?.data?.message || 'Failed to save', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const addTimelineEvent = () => {
    setFormFields({
      timeline: [
        { year: new Date().getFullYear().toString(), title: '', description: '', type: 'experience', icon: 'Briefcase' },
        ...formFields.timeline
      ]
    });
  };

  const updateTimelineEvent = (index: number, key: string, value: string) => {
    const updated = [...formFields.timeline];
    updated[index] = { ...updated[index], [key]: value };
    setFormFields({ timeline: updated });
  };

  const removeTimelineEvent = (index: number) => {
    const updated = [...formFields.timeline];
    updated.splice(index, 1);
    setFormFields({ timeline: updated });
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'education': return <GraduationCap className="w-5 h-5" />;
      case 'experience': return <Briefcase className="w-5 h-5" />;
      default: return <Route className="w-5 h-5" />;
    }
  };

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
            <Route className="w-6 h-6 text-indigo-500" />
            Journey & Timeline
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your education, work experience, and key milestones.</p>
        </div>
        <button type="button" onClick={addTimelineEvent} className="text-white bg-indigo-600 hover:bg-indigo-500 flex items-center space-x-2 text-sm font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm">
          <Plus className="h-4 w-4" /> <span>Add Event</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        <div className="space-y-4">
          {formFields.timeline.length === 0 ? (
            <div className="text-center p-12 bg-slate-50 dark:bg-slate-900/30 rounded-2xl border border-dashed border-slate-300 dark:border-white/10">
              <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-slate-600 dark:text-slate-300 font-medium">No timeline events yet</h3>
              <p className="text-sm text-slate-500 mt-1">Click "Add Event" to start building your journey.</p>
            </div>
          ) : (
            formFields.timeline.map((event, index) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={index} 
                className="p-5 bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-white/5 rounded-2xl space-y-4 relative group transition-all hover:border-indigo-500/50"
              >
                <div className="absolute top-5 right-5 flex gap-2">
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                    event.type === 'education' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                    event.type === 'experience' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                    'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                  }`}>
                    {getTypeIcon(event.type)}
                    {event.type}
                  </span>
                  <button type="button" onClick={() => removeTimelineEvent(index)} className="text-slate-400 hover:text-rose-500 p-1 bg-white dark:bg-slate-800 rounded-md shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-6">
                  <div className="md:col-span-1">
                    <label className="text-xs text-slate-500 dark:text-slate-400 font-bold block mb-1">Year / Date Range</label>
                    <input type="text" value={event.year} onChange={(e) => updateTimelineEvent(index, 'year', e.target.value)} className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 focus:border-indigo-500 rounded-lg text-sm text-slate-800 dark:text-slate-300 font-medium" placeholder="2020 - Present" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs text-slate-500 dark:text-slate-400 font-bold block mb-1">Title (Role / Degree)</label>
                    <input type="text" value={event.title} onChange={(e) => updateTimelineEvent(index, 'title', e.target.value)} className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 focus:border-indigo-500 rounded-lg text-sm text-slate-800 dark:text-slate-300 font-bold" placeholder="Senior Frontend Developer" />
                  </div>
                  <div className="md:col-span-1">
                    <label className="text-xs text-slate-500 dark:text-slate-400 font-bold block mb-1">Type</label>
                    <select value={event.type} onChange={(e) => updateTimelineEvent(index, 'type', e.target.value)} className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 focus:border-indigo-500 rounded-lg text-sm text-slate-800 dark:text-slate-300">
                      <option value="education">Education</option>
                      <option value="experience">Experience</option>
                      <option value="milestone">Milestone</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="text-xs text-slate-500 dark:text-slate-400 font-bold block mb-1">Description (Organization / Details)</label>
                  <textarea rows={2} value={event.description} onChange={(e) => updateTimelineEvent(index, 'description', e.target.value)} className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 focus:border-indigo-500 rounded-lg text-sm text-slate-800 dark:text-slate-300" placeholder="Worked at TechCorp..." />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-500 dark:text-slate-400 font-bold block mb-1">Link (Optional)</label>
                    <input type="text" value={event.link || ''} onChange={(e) => updateTimelineEvent(index, 'link', e.target.value)} className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 focus:border-indigo-500 rounded-lg text-sm text-slate-800 dark:text-slate-300" placeholder="https://..." />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 dark:text-slate-400 font-bold block mb-1">Icon Name (Optional)</label>
                    <input type="text" value={event.icon} onChange={(e) => updateTimelineEvent(index, 'icon', e.target.value)} className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 focus:border-indigo-500 rounded-lg text-sm text-slate-800 dark:text-slate-300" placeholder="Award" />
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        <div className="flex justify-end border-t border-slate-200 dark:border-white/5 pt-6 mt-6">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center space-x-2 px-6 py-3 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all disabled:opacity-50 shadow-md"
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            <span>{isSaving ? 'Saving...' : 'Save Timeline'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
