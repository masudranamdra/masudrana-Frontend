'use client';

import React, { useState, useEffect } from 'react';
import API, { getAssetUrl } from '../../../lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Loader2, Plus, Edit, Trash2, Calendar, Image as ImageIcon, Briefcase, GraduationCap, Trophy, Code, Star, BookOpen, Layers, Check, X } from 'lucide-react';
import { Activity } from '../../../types';
import DualImageInput from '../../../components/admin/DualImageInput';

export default function WorkEducationAdmin() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Activity | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('All');

  const defaultFormFields = {
    title: '', description: '', date: '', category: 'Work', icon: 'Briefcase', order: 0,
    isFeatured: false, isPublished: true, isCurrent: false,
    companyName: '', employmentType: '', location: '', companyWebsite: '',
    degree: '', department: '', instituteName: '', session: '', cgpa: '',
    platform: '', instructor: '', completionDate: '', credentialLink: '', duration: '',
    responsibilities: [] as string[], technologies: [] as string[], academicAchievements: [] as string[], skillsLearned: [] as string[]
  };

  const [formFields, setFormFields] = useState<any>(defaultFormFields);
  const [fileObject, setFileObject] = useState<File | null>(null);
  const [toastMsg, setToastMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const triggerToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMsg({ text, type });
    setTimeout(() => setToastMsg(null), 3000);
  };

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const res = await API.get('/activities');
      if (res.data && res.data.success) {
        setActivities(res.data.data.sort((a: Activity, b: Activity) => b.order - a.order));
      }
    } catch (error) {
      triggerToast('Failed to load activities', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const openModal = (item: Activity | null = null) => {
    setEditItem(item);
    setFileObject(null);
    if (item) {
      setFormFields({
        ...defaultFormFields,
        ...item
      });
    } else {
      setFormFields({ ...defaultFormFields });
    }
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you absolutely sure you want to delete this entry?')) return;
    try {
      const res = await API.delete(`/activities/${id}`);
      if (res.data && res.data.success) {
        triggerToast('Activity deleted successfully');
        fetchActivities();
      }
    } catch {
      triggerToast('Failed to delete activity', 'error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      let endpoint = '/activities';
      if (editItem) endpoint = `/activities/${editItem._id}`;

      const formData = new FormData();
      Object.entries(formFields).forEach(([k, v]) => {
        if (Array.isArray(v)) {
          v.forEach((val) => formData.append(`${k}[]`, val));
        } else if (v !== undefined && v !== null) {
          formData.append(k, String(v));
        }
      });

      if (fileObject) formData.append('image', fileObject);

      const res = editItem 
        ? await API.put(endpoint, formData) 
        : await API.post(endpoint, formData);

      if (res.data && res.data.success) {
        triggerToast(`Activity ${editItem ? 'updated' : 'created'} successfully!`);
        setModalOpen(false);
        fetchActivities();
      }
    } catch (err: any) {
      triggerToast(err.response?.data?.message || 'Submission failed.', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const togglePublish = async (activity: Activity) => {
    try {
      await API.put(`/activities/${activity._id}`, { isPublished: !activity.isPublished });
      fetchActivities();
    } catch {
      triggerToast('Failed to update status', 'error');
    }
  };

  const toggleFeatured = async (activity: Activity) => {
    try {
      await API.put(`/activities/${activity._id}`, { isFeatured: !activity.isFeatured });
      fetchActivities();
    } catch {
      triggerToast('Failed to update status', 'error');
    }
  };

  const handleArrayChange = (field: string, index: number, value: string) => {
    const updated = [...formFields[field]];
    updated[index] = value;
    setFormFields({ ...formFields, [field]: updated });
  };

  const handleArrayAdd = (field: string) => {
    setFormFields({ ...formFields, [field]: [...formFields[field], ''] });
  };

  const handleArrayRemove = (field: string, index: number) => {
    const updated = [...formFields[field]];
    updated.splice(index, 1);
    setFormFields({ ...formFields, [field]: updated });
  };

  const filteredActivities = filterCategory === 'All' 
    ? activities 
    : activities.filter(a => a.category === filterCategory);

  return (
    <div className="space-y-8 relative">
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 z-[60] p-4 rounded-xl border flex items-center space-x-3 shadow-xl backdrop-blur-md ${
              toastMsg.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
            }`}
          >
            {toastMsg.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
            <span className="text-xs font-semibold">{toastMsg.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Work & Education History</h1>
            <p className="text-slate-400 text-xs font-light">Manage your experience timeline, education, and professional courses.</p>
          </div>
        </div>
        <button onClick={() => openModal()} className="flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-500 text-white text-xs transition-colors">
          <Plus className="h-4 w-4" /><span>Add Record</span>
        </button>
      </div>

      <div className="flex space-x-2 border-b border-white/5 pb-4">
        {['All', 'Work', 'Education', 'Course', 'Award', 'Other'].map(cat => (
          <button key={cat} onClick={() => setFilterCategory(cat)} className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${filterCategory === cat ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}>
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 text-indigo-500 animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.length === 0 ? (
            <p className="col-span-full p-8 text-slate-500 text-sm text-center bg-slate-950 border border-white/5 rounded-2xl">No records found for this category.</p>
          ) : (
            filteredActivities.map((activity) => (
              <div key={activity._id} className={`bg-slate-950 border rounded-2xl overflow-hidden hover:border-indigo-500/30 transition-all ${!activity.isPublished ? 'border-rose-500/20 opacity-80' : 'border-white/5'}`}>
                {activity.image?.url ? (
                  <div className="w-full h-32 relative bg-slate-900 border-b border-white/5">
                    <img src={getAssetUrl(activity.image.url)} alt={activity.title} className="w-full h-full object-cover" />
                    {activity.isFeatured && <span className="absolute top-2 right-2 px-2 py-1 bg-yellow-500/90 text-yellow-950 text-[10px] font-bold rounded-md flex items-center"><Star className="h-3 w-3 mr-1"/> Featured</span>}
                  </div>
                ) : (
                  <div className="w-full h-32 bg-slate-900 flex flex-col items-center justify-center text-slate-700 border-b border-white/5 relative">
                    <ImageIcon className="h-8 w-8 mb-2" />
                    <span className="text-xs">No image</span>
                    {activity.isFeatured && <span className="absolute top-2 right-2 px-2 py-1 bg-yellow-500/90 text-yellow-950 text-[10px] font-bold rounded-md flex items-center"><Star className="h-3 w-3 mr-1"/> Featured</span>}
                  </div>
                )}
                <div className="p-5 space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="px-2 py-1 rounded bg-indigo-500/10 text-indigo-400 text-[10px] font-mono font-bold uppercase">{activity.category}</span>
                      <div className="flex space-x-2">
                        <button onClick={() => togglePublish(activity)} className={`text-[10px] px-2 py-1 rounded border font-bold ${activity.isPublished ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>{activity.isPublished ? 'Published' : 'Draft'}</button>
                      </div>
                    </div>
                    <h3 className="text-white font-bold text-lg line-clamp-1">{activity.title}</h3>
                    <div className="flex items-center text-slate-400 text-xs mt-1">{activity.date}</div>
                  </div>
                  <div className="pt-4 border-t border-white/5 flex justify-end gap-2">
                    <button onClick={() => toggleFeatured(activity)} className={`p-2 rounded-lg transition-colors ${activity.isFeatured ? 'bg-yellow-500/10 text-yellow-500' : 'bg-slate-800 text-slate-400'}`} title="Toggle Featured"><Star className="h-4 w-4" /></button>
                    <button onClick={() => openModal(activity)} className="p-2 bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"><Edit className="h-4 w-4" /></button>
                    <button onClick={() => handleDelete(activity._id)} className="p-2 bg-rose-500/10 text-rose-400 hover:text-white hover:bg-rose-500 rounded-lg transition-colors"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Form Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModalOpen(false)} className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-slate-900 border border-white/10 rounded-2xl max-w-4xl w-full shadow-2xl z-10 p-6 max-h-[90vh] overflow-y-auto no-scrollbar">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/5">
                <h3 className="text-white font-extrabold text-xl">{editItem ? 'Edit Record' : 'Add New Record'}</h3>
                <button onClick={() => setModalOpen(false)} className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-full"><X className="h-5 w-5" /></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* Core Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-slate-400 text-xs font-semibold">Category</label>
                    <select value={formFields.category} onChange={(e) => setFormFields({ ...formFields, category: e.target.value })} className="w-full px-4 py-3 bg-slate-950 border border-white/5 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-indigo-500/50">
                      <option value="Work">Work Experience</option>
                      <option value="Education">Education</option>
                      <option value="Course">Professional Course</option>
                      <option value="Award">Achievement / Award</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-slate-400 text-xs font-semibold">Title / Heading</label>
                    <input required type="text" value={formFields.title} onChange={(e) => setFormFields({ ...formFields, title: e.target.value })} className="w-full px-4 py-3 bg-slate-950 border border-white/5 focus:border-indigo-500/50 rounded-xl text-sm text-slate-300 focus:outline-none" placeholder="e.g. Senior Frontend Developer" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-slate-400 text-xs font-semibold">Date Range / Info</label>
                    <input required type="text" value={formFields.date} onChange={(e) => setFormFields({ ...formFields, date: e.target.value })} className="w-full px-4 py-3 bg-slate-950 border border-white/5 focus:border-indigo-500/50 rounded-xl text-sm text-slate-300 focus:outline-none" placeholder="e.g. Jan 2021 - Present" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-slate-400 text-xs font-semibold">Icon</label>
                    <select value={formFields.icon} onChange={(e) => setFormFields({ ...formFields, icon: e.target.value })} className="w-full px-4 py-3 bg-slate-950 border border-white/5 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-indigo-500/50">
                      <option value="Briefcase">Briefcase (Work)</option>
                      <option value="GraduationCap">GraduationCap (Edu)</option>
                      <option value="BookOpen">BookOpen (Course)</option>
                      <option value="Trophy">Trophy (Award)</option>
                      <option value="Code">Code (Tech)</option>
                      <option value="Star">Star (General)</option>
                      <option value="Layers">Layers (Project)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-400 text-xs font-semibold">Short Description</label>
                  <textarea required rows={3} value={formFields.description} onChange={(e) => setFormFields({ ...formFields, description: e.target.value })} className="w-full px-4 py-3 bg-slate-950 border border-white/5 focus:border-indigo-500/50 rounded-xl text-sm text-slate-300 focus:outline-none" placeholder="Brief overview..." />
                </div>

                {/* CATEGORY SPECIFIC FIELDS */}
                <div className="p-6 border border-indigo-500/20 bg-indigo-500/5 rounded-2xl space-y-6">
                  <h4 className="text-indigo-400 font-bold text-sm border-b border-indigo-500/10 pb-2 uppercase tracking-wider">{formFields.category} Details</h4>
                  
                  {formFields.category === 'Work' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" placeholder="Company Name" value={formFields.companyName} onChange={e => setFormFields({...formFields, companyName: e.target.value})} className="w-full px-4 py-3 bg-slate-950 border border-white/5 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-indigo-500/50" />
                        <input type="text" placeholder="Employment Type (e.g. Full-time)" value={formFields.employmentType} onChange={e => setFormFields({...formFields, employmentType: e.target.value})} className="w-full px-4 py-3 bg-slate-950 border border-white/5 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-indigo-500/50" />
                        <input type="text" placeholder="Location" value={formFields.location} onChange={e => setFormFields({...formFields, location: e.target.value})} className="w-full px-4 py-3 bg-slate-950 border border-white/5 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-indigo-500/50" />
                        <input type="text" placeholder="Company Website URL" value={formFields.companyWebsite} onChange={e => setFormFields({...formFields, companyWebsite: e.target.value})} className="w-full px-4 py-3 bg-slate-950 border border-white/5 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-indigo-500/50" />
                      </div>
                      
                      {/* Array inputs for Work */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center"><label className="text-slate-400 text-xs font-semibold">Technologies Used</label><button type="button" onClick={() => handleArrayAdd('technologies')} className="text-indigo-400 text-xs font-bold hover:text-indigo-300">+ Add</button></div>
                        {formFields.technologies.map((item: string, idx: number) => (
                          <div key={idx} className="flex gap-2"><input type="text" value={item} onChange={e => handleArrayChange('technologies', idx, e.target.value)} className="flex-1 px-4 py-2 bg-slate-950 border border-white/5 rounded-lg text-sm text-slate-300" /><button type="button" onClick={() => handleArrayRemove('technologies', idx)} className="text-rose-500 px-2"><Trash2 className="h-4 w-4"/></button></div>
                        ))}
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center"><label className="text-slate-400 text-xs font-semibold">Key Responsibilities</label><button type="button" onClick={() => handleArrayAdd('responsibilities')} className="text-indigo-400 text-xs font-bold hover:text-indigo-300">+ Add</button></div>
                        {formFields.responsibilities.map((item: string, idx: number) => (
                          <div key={idx} className="flex gap-2"><input type="text" value={item} onChange={e => handleArrayChange('responsibilities', idx, e.target.value)} className="flex-1 px-4 py-2 bg-slate-950 border border-white/5 rounded-lg text-sm text-slate-300" /><button type="button" onClick={() => handleArrayRemove('responsibilities', idx)} className="text-rose-500 px-2"><Trash2 className="h-4 w-4"/></button></div>
                        ))}
                      </div>
                    </div>
                  )}

                  {formFields.category === 'Education' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" placeholder="Degree (e.g. B.Sc)" value={formFields.degree} onChange={e => setFormFields({...formFields, degree: e.target.value})} className="w-full px-4 py-3 bg-slate-950 border border-white/5 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-indigo-500/50" />
                        <input type="text" placeholder="Department (e.g. Computer Science)" value={formFields.department} onChange={e => setFormFields({...formFields, department: e.target.value})} className="w-full px-4 py-3 bg-slate-950 border border-white/5 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-indigo-500/50" />
                        <input type="text" placeholder="Institute Name" value={formFields.instituteName} onChange={e => setFormFields({...formFields, instituteName: e.target.value})} className="w-full px-4 py-3 bg-slate-950 border border-white/5 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-indigo-500/50" />
                        <input type="text" placeholder="CGPA / Grade" value={formFields.cgpa} onChange={e => setFormFields({...formFields, cgpa: e.target.value})} className="w-full px-4 py-3 bg-slate-950 border border-white/5 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-indigo-500/50" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center"><label className="text-slate-400 text-xs font-semibold">Academic Achievements</label><button type="button" onClick={() => handleArrayAdd('academicAchievements')} className="text-indigo-400 text-xs font-bold hover:text-indigo-300">+ Add</button></div>
                        {formFields.academicAchievements.map((item: string, idx: number) => (
                          <div key={idx} className="flex gap-2"><input type="text" value={item} onChange={e => handleArrayChange('academicAchievements', idx, e.target.value)} className="flex-1 px-4 py-2 bg-slate-950 border border-white/5 rounded-lg text-sm text-slate-300" /><button type="button" onClick={() => handleArrayRemove('academicAchievements', idx)} className="text-rose-500 px-2"><Trash2 className="h-4 w-4"/></button></div>
                        ))}
                      </div>
                    </div>
                  )}

                  {formFields.category === 'Course' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" placeholder="Platform (e.g. Udemy, Coursera)" value={formFields.platform} onChange={e => setFormFields({...formFields, platform: e.target.value})} className="w-full px-4 py-3 bg-slate-950 border border-white/5 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-indigo-500/50" />
                        <input type="text" placeholder="Instructor" value={formFields.instructor} onChange={e => setFormFields({...formFields, instructor: e.target.value})} className="w-full px-4 py-3 bg-slate-950 border border-white/5 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-indigo-500/50" />
                        <input type="text" placeholder="Duration (e.g. 40 Hours)" value={formFields.duration} onChange={e => setFormFields({...formFields, duration: e.target.value})} className="w-full px-4 py-3 bg-slate-950 border border-white/5 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-indigo-500/50" />
                        <input type="text" placeholder="Credential URL" value={formFields.credentialLink} onChange={e => setFormFields({...formFields, credentialLink: e.target.value})} className="w-full px-4 py-3 bg-slate-950 border border-white/5 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-indigo-500/50" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center"><label className="text-slate-400 text-xs font-semibold">Skills Learned</label><button type="button" onClick={() => handleArrayAdd('skillsLearned')} className="text-indigo-400 text-xs font-bold hover:text-indigo-300">+ Add</button></div>
                        {formFields.skillsLearned.map((item: string, idx: number) => (
                          <div key={idx} className="flex gap-2"><input type="text" value={item} onChange={e => handleArrayChange('skillsLearned', idx, e.target.value)} className="flex-1 px-4 py-2 bg-slate-950 border border-white/5 rounded-lg text-sm text-slate-300" /><button type="button" onClick={() => handleArrayRemove('skillsLearned', idx)} className="text-rose-500 px-2"><Trash2 className="h-4 w-4"/></button></div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {['Award', 'Other', 'Project'].includes(formFields.category) && (
                    <p className="text-slate-400 text-xs">This category only uses the core fields (Title, Description, Date, Logo). Use description for extra details.</p>
                  )}
                </div>

                <div className="space-y-1.5 border-t border-white/5 pt-3">
                  <DualImageInput
                    label="Company / Institute Logo / Activity Image"
                    value={formFields.image || ''}
                    onChangeUrl={(url) => setFormFields({ ...formFields, image: url })}
                    fileObject={fileObject}
                    onFileSelect={(file) => setFileObject(file)}
                  />
                </div>

                <div className="flex items-center space-x-6 p-4 bg-slate-950 border border-white/5 rounded-xl">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input type="checkbox" checked={formFields.isCurrent} onChange={e => setFormFields({...formFields, isCurrent: e.target.checked})} className="form-checkbox h-4 w-4 text-indigo-600 rounded border-slate-700 bg-slate-900 focus:ring-0" />
                    <span className="text-sm font-semibold text-slate-300">Is Current / Present</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input type="checkbox" checked={formFields.isPublished} onChange={e => setFormFields({...formFields, isPublished: e.target.checked})} className="form-checkbox h-4 w-4 text-indigo-600 rounded border-slate-700 bg-slate-900 focus:ring-0" />
                    <span className="text-sm font-semibold text-slate-300">Publish Immediately</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input type="checkbox" checked={formFields.isFeatured} onChange={e => setFormFields({...formFields, isFeatured: e.target.checked})} className="form-checkbox h-4 w-4 text-indigo-600 rounded border-slate-700 bg-slate-900 focus:ring-0" />
                    <span className="text-sm font-semibold text-slate-300">Mark as Featured</span>
                  </label>
                </div>

                <div className="flex justify-end space-x-3 pt-6 border-t border-white/5">
                  <button type="button" onClick={() => setModalOpen(false)} className="px-6 py-3 rounded-xl text-sm font-bold text-slate-300 hover:bg-white/5 transition-colors">Cancel</button>
                  <button type="submit" disabled={formLoading} className="flex items-center space-x-2 px-8 py-3 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-500 text-white text-sm transition-colors disabled:opacity-50">
                    {formLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                    <span>{formLoading ? 'Saving...' : 'Save Record'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
