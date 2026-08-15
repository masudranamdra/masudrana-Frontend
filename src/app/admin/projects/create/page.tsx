'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import API from '../../../../lib/api';
import {
  ArrowLeft, Save, Loader2, Image as ImageIcon, Sparkles,
  FolderCode, Globe, CheckCircle2, AlertCircle, Eye
} from 'lucide-react';
import DualImageInput from '../../../../components/admin/DualImageInput';
import ProjectGalleryUploader from '../../../../components/admin/ProjectGalleryUploader';
import WysiwygEditor from '../../../../components/admin/WysiwygEditor';

export default function CreateProjectAdminPage() {
  const router = useRouter();

  const [formFields, setFormFields] = useState({
    title: '',
    subtitle: '',
    description: '',
    category: 'Full Stack',
    tags: 'React, Next.js, Node.js, MongoDB',
    githubLink: '',
    demoLink: '',
    image: '',
    gallery: [] as Array<{ url: string; publicId?: string; caption?: string }>,
    isFeatured: true,
    featuredInAbout: false,
    order: 0,
  });

  const [fileObject, setFileObject] = useState<File | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const triggerToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMsg({ text, type });
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formFields.title.trim()) {
      triggerToast('Please enter project title', 'error');
      return;
    }

    setFormLoading(true);

    try {
      let res;
      if (fileObject) {
        const formData = new FormData();
        Object.entries(formFields).forEach(([k, v]) => {
          if (k === 'gallery') {
            formData.append('gallery', JSON.stringify(v));
          } else if (typeof v === 'object' && v !== null) {
            formData.append(k, JSON.stringify(v));
          } else {
            formData.append(k, String(v));
          }
        });
        formData.append('image', fileObject);
        res = await API.post('/projects', formData);
      } else {
        const payload = {
          ...formFields,
          imageUrl: formFields.image,
        };
        res = await API.post('/projects', payload);
      }

      if (res.data && res.data.success) {
        triggerToast('Project created successfully!');
        setTimeout(() => {
          router.push('/admin/projects');
        }, 1000);
      } else {
        triggerToast('Failed to create project', 'error');
      }
    } catch (err: any) {
      triggerToast(err.response?.data?.message || 'Error creating project', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div className={`fixed top-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-2xl flex items-center space-x-2 text-sm font-bold border transition-all ${
          toastMsg.type === 'success'
            ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
            : 'bg-rose-500/20 border-rose-500/40 text-rose-300'
        }`}>
          {toastMsg.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
          <span>{toastMsg.text}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => router.push('/admin/projects')}
            className="p-2.5 bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-300 rounded-xl transition-colors cursor-pointer"
            title="Back to Projects"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <FolderCode className="w-6 h-6 text-indigo-500" />
              <span>Create New Project</span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Upload cover photo, case study gallery, and professional formatted description.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => router.push('/admin/projects')}
            className="px-4 py-2.5 bg-slate-900 border border-white/10 hover:bg-slate-800 text-slate-300 text-xs font-bold rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="createProjectForm"
            disabled={formLoading}
            className="flex-1 sm:flex-none px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-lg flex items-center justify-center space-x-2 cursor-pointer"
          >
            {formLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Save Project</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Form Layout (2 Columns on Desktop) */}
      <form id="createProjectForm" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (8 Columns) */}
        <div className="lg:col-span-8 space-y-6 bg-slate-900/60 p-5 sm:p-7 rounded-3xl border border-white/10">
          
          {/* Title */}
          <div className="space-y-1.5">
            <label htmlFor="projectTitle" className="text-xs font-bold text-slate-300 block">
              Project Title *
            </label>
            <input
              id="projectTitle"
              type="text"
              required
              value={formFields.title}
              onChange={(e) => setFormFields({ ...formFields, title: e.target.value })}
              placeholder="e.g. Personal Knowledge Vault & Learning Hub"
              className="w-full px-4 py-3 bg-slate-950 border border-white/10 focus:border-indigo-500 rounded-2xl text-sm text-white focus:outline-none"
            />
          </div>

          {/* Subtitle */}
          <div className="space-y-1.5">
            <label htmlFor="projectSubtitle" className="text-xs font-bold text-slate-300 block">
              Subtitle / Tagline
            </label>
            <input
              id="projectSubtitle"
              type="text"
              value={formFields.subtitle}
              onChange={(e) => setFormFields({ ...formFields, subtitle: e.target.value })}
              placeholder="e.g. Full-Stack E-Commerce & Knowledge Vault SaaS Application"
              className="w-full px-4 py-3 bg-slate-950 border border-white/10 focus:border-indigo-500 rounded-2xl text-sm text-white focus:outline-none"
            />
          </div>

          {/* Description Editor */}
          <WysiwygEditor
            id="projectDescriptionEditor"
            label="Project Description"
            value={formFields.description}
            onChange={(htmlVal) => setFormFields({ ...formFields, description: htmlVal })}
            minHeight="320px"
          />

          {/* Case Study Gallery Photos */}
          <ProjectGalleryUploader
            label="Case Study & Gallery Photos"
            images={formFields.gallery.map((g) => (typeof g === 'string' ? g : g.url))}
            onChange={(imgs) => {
              const formatted = imgs.map((url) => ({ url, publicId: '', caption: '' }));
              setFormFields({ ...formFields, gallery: formatted });
            }}
          />
        </div>

        {/* Right Sidebar Column (4 Columns) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Cover / Homepage Image */}
          <div className="p-5 bg-slate-900/60 rounded-3xl border border-white/10 space-y-4">
            <DualImageInput
              label="Cover Photo (Homepage & Card Preview) *"
              value={formFields.image}
              onChangeUrl={(url) => setFormFields({ ...formFields, image: url })}
              fileObject={fileObject}
              onFileSelect={(file) => setFileObject(file)}
            />
          </div>

          {/* Meta Configuration */}
          <div className="p-5 bg-slate-900/60 rounded-3xl border border-white/10 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 border-b border-white/10 pb-2">
              Project Meta & Links
            </h3>

            <div className="space-y-1.5">
              <label htmlFor="projectCategory" className="text-xs font-bold text-slate-300 block">Category</label>
              <select
                id="projectCategory"
                value={formFields.category}
                onChange={(e) => setFormFields({ ...formFields, category: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none"
              >
                <option value="Full Stack">Full Stack</option>
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="SaaS Platform">SaaS Platform</option>
                <option value="Mobile App">Mobile App</option>
                <option value="UI/UX Design">UI/UX Design</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="projectTags" className="text-xs font-bold text-slate-300 block">Tags</label>
              <input
                id="projectTags"
                type="text"
                value={formFields.tags}
                onChange={(e) => setFormFields({ ...formFields, tags: e.target.value })}
                placeholder="React, Next.js, Node.js, MongoDB"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="githubLink" className="text-xs font-bold text-slate-300 block flex items-center gap-1">
                <FolderCode className="w-3.5 h-3.5 text-indigo-400" />
                <span>GitHub Source Link</span>
              </label>
              <input
                id="githubLink"
                type="url"
                value={formFields.githubLink}
                onChange={(e) => setFormFields({ ...formFields, githubLink: e.target.value })}
                placeholder="https://github.com/username/repo"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="demoLink" className="text-xs font-bold text-slate-300 block flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-indigo-400" />
                <span>Live Demo Link</span>
              </label>
              <input
                id="demoLink"
                type="url"
                value={formFields.demoLink}
                onChange={(e) => setFormFields({ ...formFields, demoLink: e.target.value })}
                placeholder="https://my-demo-app.com"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="projectOrder" className="text-xs font-bold text-slate-300 block">Sort Order Index</label>
              <input
                id="projectOrder"
                type="number"
                value={formFields.order}
                onChange={(e) => setFormFields({ ...formFields, order: parseInt(e.target.value, 10) || 0 })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none"
              />
            </div>

            <div className="pt-2 border-t border-white/10 space-y-2">
              <label className="flex items-center space-x-2 text-xs font-semibold text-slate-300 cursor-pointer">
                <input
                  id="isFeatured"
                  type="checkbox"
                  checked={formFields.isFeatured}
                  onChange={(e) => setFormFields({ ...formFields, isFeatured: e.target.checked })}
                  className="accent-indigo-500 h-4 w-4"
                />
                <span>Mark Featured on Homepage</span>
              </label>

              <label className="flex items-center space-x-2 text-xs font-semibold text-slate-300 cursor-pointer">
                <input
                  id="featuredInAbout"
                  type="checkbox"
                  checked={formFields.featuredInAbout}
                  onChange={(e) => setFormFields({ ...formFields, featuredInAbout: e.target.checked })}
                  className="accent-indigo-500 h-4 w-4"
                />
                <span>Show on About Page</span>
              </label>
            </div>
          </div>

        </div>

      </form>
    </div>
  );
}
