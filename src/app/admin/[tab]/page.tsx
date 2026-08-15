'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import API, { getAssetUrl } from '../../../lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Edit, Trash2, Loader2, CheckCircle2, AlertCircle, Eye,
  Lock, Unlock, Download, Mail, Star, ExternalLink, Calendar,
  Briefcase, GraduationCap, Trophy, ShieldAlert, FolderCode, Sliders,
  PenTool, BookOpen, Image, Video, FileText, Settings, Quote, Search
} from 'lucide-react';
import { useConfig } from '../../../context/ConfigContext';
import DualImageInput from '../../../components/admin/DualImageInput';
import RichTextEditor from '../../../components/admin/RichTextEditor';
import ProjectGalleryUploader from '../../../components/admin/ProjectGalleryUploader';

export default function AdminTabRoute() {
  const router = useRouter();
  const params = useParams();
  const tab = (params.tab as string) || '';
  const { config, fetchConfig, updateConfig } = useConfig();

  // Unified State
  const [dataList, setDataList] = useState<any[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<any | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Forms Fields State (Unified Object)
  const [formFields, setFormFields] = useState<any>({});
  const [fileObject, setFileObject] = useState<File | null>(null);

  // Feedback Messages
  const [toastMsg, setToastMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Read message details state
  const [activeMessage, setActiveMessage] = useState<any | null>(null);

  // Display toast helper
  const triggerToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMsg({ text, type });
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Fetch data list based on tab
  const fetchData = async () => {
    try {
      setListLoading(true);
      let endpoint = '';
      if (tab === 'projects') endpoint = '/projects';
      else if (tab === 'skills') endpoint = '/skills';
      else if (tab === 'blogs') endpoint = '/blogs'; // admin fetches all blogs
      else if (tab === 'articles') endpoint = '/articles';
      else if (tab === 'testimonials') endpoint = '/testimonials';
      else if (tab === 'activities') endpoint = '/activities';
      else if (tab === 'gallery-images') endpoint = '/gallery/images';
      else if (tab === 'gallery-videos') endpoint = '/gallery/videos';
      else if (tab === 'documents') endpoint = '/documents';
      else if (tab === 'messages') endpoint = '/messages';

      if (!endpoint) return;

      const res = await API.get(endpoint);
      if (res.data && res.data.success) {
        setDataList(res.data.data || []);
      }
    } catch (error: any) {
      triggerToast('Failed to load list details.', 'error');
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    if (tab && tab !== 'configuration') {
      fetchData();
    } else if (tab === 'configuration') {
      fetchConfig().then(() => {
        if (config) {
          setFormFields({
            heroTitle: config.heroTitle || '',
            heroSubtitle: config.heroSubtitle || '',
            siteDescription: config.siteDescription || '',
            contactEmail: config.contactEmail || '',
            contactPhone: config.contactPhone || '',
            contactAddress: config.contactAddress || '',
            seoKeywords: config.seoKeywords ? config.seoKeywords.join(', ') : '',
            github: config.socialLinks?.github || '',
            linkedin: config.socialLinks?.linkedin || '',
            twitter: config.socialLinks?.twitter || '',
            youtube: config.socialLinks?.youtube || '',
            facebook: config.socialLinks?.facebook || '',
            instagram: config.socialLinks?.instagram || '',
            dribbble: config.socialLinks?.dribbble || '',
            medium: config.socialLinks?.medium || '',
          });
        }
      });
    }
    setModalOpen(false);
    setEditItem(null);
    setFileObject(null);
  }, [tab]);

  // Synchronize configuration fields when config loads
  useEffect(() => {
    if (tab === 'configuration' && config) {
      setFormFields({
        heroTitle: config.heroTitle || '',
        heroSubtitle: config.heroSubtitle || '',
        siteDescription: config.siteDescription || '',
        contactEmail: config.contactEmail || '',
        contactPhone: config.contactPhone || '',
        contactAddress: config.contactAddress || '',
        seoKeywords: config.seoKeywords ? config.seoKeywords.join(', ') : '',
        github: config.socialLinks?.github || '',
        linkedin: config.socialLinks?.linkedin || '',
        twitter: config.socialLinks?.twitter || '',
        youtube: config.socialLinks?.youtube || '',
        facebook: config.socialLinks?.facebook || '',
        instagram: config.socialLinks?.instagram || '',
        dribbble: config.socialLinks?.dribbble || '',
        medium: config.socialLinks?.medium || '',
      });
    }
  }, [config]);

  // Prepare form fields when opening add/edit modals
  const openFormModal = (item: any = null) => {
    if (tab === 'projects') {
      if (item && item._id) {
        router.push(`/admin/projects/edit/${item._id}`);
      } else {
        router.push('/admin/projects/create');
      }
      return;
    }

    setEditItem(item);
    setFileObject(null);

    if (item) {
      // Edit mode: map item values
      if (tab === 'projects') {
        setFormFields({
          title: item.title,
          description: item.description,
          category: item.category,
          tags: item.tags.join(', '),
          githubLink: item.githubLink || '',
          demoLink: item.demoLink || '',
          isFeatured: item.isFeatured,
          order: item.order,
        });
      } else if (tab === 'skills') {
        setFormFields({
          title: item.title,
          description: item.description,
          icon: item.icon,
          colorTheme: item.colorTheme,
          coreCompetencies: item.coreCompetencies || [],
          tools: item.tools || [],
          order: item.order,
        });
      } else if (tab === 'blogs') {
        setFormFields({
          title: item.title,
          content: item.content,
          summary: item.summary,
          category: item.category,
          tags: item.tags.join(', '),
          isFeatured: item.isFeatured,
          isPublished: item.isPublished,
        });
      } else if (tab === 'articles') {
        setFormFields({
          title: item.title,
          externalLink: item.externalLink,
          category: item.category,
          tags: item.tags.join(', '),
          summary: item.summary,
          isFeatured: item.isFeatured,
          source: item.source,
        });
      } else if (tab === 'testimonials') {
        setFormFields({
          clientName: item.clientName,
          position: item.position,
          company: item.company,
          rating: item.rating,
          reviewContent: item.reviewContent,
          isFeatured: item.isFeatured,
          order: item.order,
        });
      } else if (tab === 'activities') {
        setFormFields({
          title: item.title,
          description: item.description,
          date: item.date,
          duration: item.duration || '',
          fullDetails: item.fullDetails || '',
          category: item.category,
          icon: item.icon,
          order: item.order,
        });
      } else if (tab === 'gallery-images') {
        setFormFields({
          title: item.title,
          description: item.description || '',
          category: item.category,
          tags: item.tags.join(', '),
          isProtected: item.isProtected,
          isFeatured: item.isFeatured,
          order: item.order,
        });
      } else if (tab === 'gallery-videos') {
        setFormFields({
          title: item.title,
          description: item.description || '',
          url: item.url,
          thumbnail: item.thumbnail || '',
          isProtected: item.isProtected,
          isFeatured: item.isFeatured,
          order: item.order,
        });
      } else if (tab === 'documents') {
        setFormFields({
          title: item.title,
          description: item.description || '',
          type: item.type,
          tags: item.tags.join(', '),
          isProtected: item.isProtected,
          category: item.category,
        });
      }
    } else {
      // Add mode: default empty values
      if (tab === 'projects') {
        setFormFields({ title: '', description: '', category: 'Frontend', tags: '', githubLink: '', demoLink: '', isFeatured: false, order: 0 });
      } else if (tab === 'skills') {
        setFormFields({ title: '', description: '', icon: 'Code2', colorTheme: 'blue', coreCompetencies: [], tools: [], order: 0 });
      } else if (tab === 'blogs') {
        setFormFields({ title: '', content: '', summary: '', category: 'Development', tags: '', isFeatured: false, isPublished: false });
      } else if (tab === 'articles') {
        setFormFields({ title: '', externalLink: '', category: 'Writing', tags: '', summary: '', isFeatured: false, source: 'Medium' });
      } else if (tab === 'testimonials') {
        setFormFields({ clientName: '', position: '', company: '', rating: 5, reviewContent: '', isFeatured: false, order: 0 });
      } else if (tab === 'activities') {
        setFormFields({ title: '', description: '', date: '', duration: '', fullDetails: '', category: 'Work', icon: 'Briefcase', order: 0 });
      } else if (tab === 'gallery-images') {
        setFormFields({ title: '', description: '', category: 'Design', tags: '', isProtected: false, isFeatured: false, order: 0 });
      } else if (tab === 'gallery-videos') {
        setFormFields({ title: '', description: '', url: '', thumbnail: '', isProtected: false, isFeatured: false, order: 0 });
      } else if (tab === 'documents') {
        setFormFields({ title: '', description: '', type: 'pdf', tags: '', isProtected: false, category: 'General' });
      }
    }
    setModalOpen(true);
  };

  // Delete Item helper
  const handleDeleteItem = async (id: string) => {
    if (!confirm('Are you absolutely sure you want to delete this item?')) return;
    try {
      let endpoint = '';
      if (tab === 'projects') endpoint = `/projects/${id}`;
      else if (tab === 'skills') endpoint = `/skills/${id}`;
      else if (tab === 'blogs') endpoint = `/blogs/${id}`;
      else if (tab === 'articles') endpoint = `/articles/${id}`;
      else if (tab === 'testimonials') endpoint = `/testimonials/${id}`;
      else if (tab === 'activities') endpoint = `/activities/${id}`;
      else if (tab === 'gallery-images') endpoint = `/gallery/images/${id}`;
      else if (tab === 'gallery-videos') endpoint = `/gallery/videos/${id}`;
      else if (tab === 'documents') endpoint = `/documents/${id}`;
      else if (tab === 'messages') endpoint = `/messages/${id}`;

      const res = await API.delete(endpoint);
      if (res.data && res.data.success) {
        triggerToast('Item deleted successfully.');
        fetchData();
      }
    } catch {
      triggerToast('Failed to delete item.', 'error');
    }
  };

  // Toggle Message read/unread status
  const handleToggleRead = async (msg: any) => {
    try {
      const res = await API.put(`/messages/${msg._id}`, { isRead: !msg.isRead });
      if (res.data && res.data.success) {
        triggerToast(`Message marked as ${!msg.isRead ? 'read' : 'unread'}.`);
        fetchData();
      }
    } catch {
      triggerToast('Failed to toggle status.', 'error');
    }
  };

  // Submit add/edit form
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      let endpoint = '';
      if (tab === 'projects') endpoint = '/projects';
      else if (tab === 'skills') endpoint = '/skills';
      else if (tab === 'blogs') endpoint = '/blogs';
      else if (tab === 'articles') endpoint = '/articles';
      else if (tab === 'testimonials') endpoint = '/testimonials';
      else if (tab === 'activities') endpoint = '/activities';
      else if (tab === 'gallery-images') endpoint = '/gallery/images';
      else if (tab === 'gallery-videos') endpoint = '/gallery/videos';
      else if (tab === 'documents') endpoint = '/documents';

      // Check if edit mode
      if (editItem) {
        endpoint = `${endpoint}/${editItem._id}`;
      }

      // Check if file upload is required
      const needsFormObj = ['projects', 'blogs', 'articles', 'testimonials', 'activities', 'gallery-images', 'documents'].includes(tab);

      let payload: any;

      if (needsFormObj) {
        const formData = new FormData();

        // Append all form values
        Object.entries(formFields).forEach(([k, v]) => {
          formData.append(k, String(v));
        });

        // Append file
        if (fileObject) {
          let fieldName = 'image';
          if (tab === 'blogs') fieldName = 'coverImage';
          else if (tab === 'articles') fieldName = 'previewImage';
          else if (tab === 'testimonials') fieldName = 'avatar';
          else if (tab === 'documents') fieldName = 'file';
          formData.append(fieldName, fileObject);
        }

        payload = formData;
      } else {
        payload = formFields;
      }

      let res;
      if (editItem) {
        res = await API.put(endpoint, payload);
      } else {
        res = await API.post(endpoint, payload);
      }

      if (res.data && res.data.success) {
        triggerToast(`Item ${editItem ? 'updated' : 'created'} successfully.`);
        setModalOpen(false);
        fetchData();
      }
    } catch (err: any) {
      triggerToast(err.response?.data?.message || 'Form submission failed.', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  // Submit global site configuration
  const handleConfigSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const keywordsArray = formFields.seoKeywords
        ? formFields.seoKeywords.split(',').map((k: string) => k.trim())
        : [];

      const payload = {
        heroTitle: formFields.heroTitle,
        heroSubtitle: formFields.heroSubtitle,
        siteDescription: formFields.siteDescription,
        contactEmail: formFields.contactEmail,
        contactPhone: formFields.contactPhone,
        contactAddress: formFields.contactAddress,
        seoKeywords: keywordsArray,
        socialLinks: {
          github: formFields.github,
          linkedin: formFields.linkedin,
          twitter: formFields.twitter,
          youtube: formFields.youtube,
          facebook: formFields.facebook,
          instagram: formFields.instagram,
          dribbble: formFields.dribbble,
          medium: formFields.medium,
        },
      };

      await updateConfig(payload);
      triggerToast('Configuration updated successfully.');
    } catch {
      triggerToast('Failed to update configuration settings.', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  // Render Form Input helper
  const renderInput = (label: string, name: string, type: string = 'text', placeholder: string = '') => (
    <div className="space-y-1.5">
      <label className="text-slate-400 text-xs font-semibold">{label}</label>
      <input
        type={type}
        value={formFields[name] || ''}
        placeholder={placeholder}
        onChange={(e) => setFormFields({ ...formFields, [name]: e.target.value })}
        className="w-full px-3 py-2 bg-slate-950 border border-white/5 focus:border-indigo-500/50 rounded-xl text-xs text-slate-300 focus:outline-none"
      />
    </div>
  );

  return (
    <div className="space-y-8 relative">
      {/* Toast Notification */}
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

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight capitalize">
            Manage {tab.replace('-', ' ')}
          </h1>
          <p className="text-slate-400 text-xs font-light">
            Perform CRUD operations, upload assets, and change preferences.
          </p>
        </div>

        {tab !== 'configuration' && tab !== 'messages' && (
          <button
            onClick={() => openFormModal()}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-500 text-white text-xs transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Create New</span>
          </button>
        )}
      </div>

      {/* LIST VIEWS */}
      {listLoading && tab !== 'configuration' ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
        </div>
      ) : (
        /* TABLE GRID LISTS */
        tab !== 'configuration' && (
          <div className="rounded-2xl bg-slate-950 border border-white/5 overflow-hidden">
            {dataList.length === 0 ? (
              <p className="p-8 text-slate-500 text-xs text-center">No data found in this category.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 text-slate-500 font-mono">
                      <th className="p-4 font-semibold uppercase">Item</th>
                      <th className="p-4 font-semibold uppercase">Category / Info</th>
                      {tab === 'documents' && <th className="p-4 font-semibold uppercase">Downloads</th>}
                      {tab === 'messages' && <th className="p-4 font-semibold uppercase">Subject</th>}
                      {tab !== 'messages' && <th className="p-4 font-semibold uppercase">Featured / Security</th>}
                      <th className="p-4 font-semibold uppercase text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-300">
                    {dataList.map((item) => (
                      <tr key={item._id} className="hover:bg-white/[0.01] transition-colors">
                        <td className="p-4 font-bold text-white max-w-[200px] truncate">
                          {item.title || item.name || item.clientName}
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[9px] font-mono">
                            {item.category || item.position || item.type || item.email || 'General'}
                          </span>
                        </td>

                        {/* Downloads column */}
                        {tab === 'documents' && (
                          <td className="p-4 text-slate-400 font-mono">
                            {item.downloadCount || 0} times
                          </td>
                        )}

                        {/* Subject column */}
                        {tab === 'messages' && (
                          <td className="p-4 text-slate-400 truncate max-w-[200px]">
                            {item.subject}
                          </td>
                        )}

                        {/* Features status column */}
                        {tab !== 'messages' && (
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              {item.isFeatured && (
                                <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 text-[9px] font-bold">Featured</span>
                              )}
                              {item.isProtected && (
                                <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[9px] font-bold flex items-center space-x-1">
                                  <Lock className="h-2.5 w-2.5" />
                                  <span>Locked</span>
                                </span>
                              )}
                              {item.isPublished !== undefined && (
                                <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${item.isPublished ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                                  {item.isPublished ? 'Published' : 'Draft'}
                                </span>
                              )}
                            </div>
                          </td>
                        )}

                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            {tab === 'messages' && (
                              <>
                                <button
                                  onClick={() => {
                                    setActiveMessage(item);
                                    if (!item.isRead) handleToggleRead(item); // auto-mark read when viewing!
                                  }}
                                  className="p-1.5 rounded-lg bg-white/5 text-indigo-400 hover:text-white transition-colors"
                                  title="Read message"
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={() => handleToggleRead(item)}
                                  className={`px-2 py-1 rounded-md text-[10px] font-semibold transition-all ${item.isRead ? 'bg-slate-900 text-slate-500' : 'bg-indigo-600/20 text-indigo-400'
                                    }`}
                                >
                                  {item.isRead ? 'Mark Unread' : 'Mark Read'}
                                </button>
                              </>
                            )}

                            {tab !== 'messages' && (
                              <button
                                onClick={() => openFormModal(item)}
                                className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white transition-colors"
                                title="Edit"
                              >
                                <Edit className="h-3.5 w-3.5" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteItem(item._id)}
                              className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white transition-all"
                              title="Delete"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )
      )}

      {/* DYNAMIC FORM MODAL (Add/Edit CRUD items) */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-slate-900 border border-white/10 rounded-2xl max-w-xl w-full shadow-2xl z-10 p-6 max-h-[85vh] overflow-y-auto no-scrollbar"
            >
              <h3 className="text-white font-extrabold text-lg mb-6 pb-2 border-b border-white/5">
                {editItem ? 'Edit Item' : 'Create New Item'}
              </h3>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                {/* PROJECTS TAB INPUTS */}
                {tab === 'projects' && (
                  <>
                    {renderInput('Project Title (প্রজেক্ট শিরোনাম)', 'title', 'text', 'Next.js SaaS Enterprise Application')}
                    {renderInput('Subtitle / Tagline (উপ-শিরোনাম English/বাংলা)', 'subtitle', 'text', 'ফুল-স্ট্যাক ই-কমার্স ও পোর্টফোলিও সলিউশন')}
                    
                    <RichTextEditor
                      label="Project Description (প্রফেশনাল বিবরণ, হেডিং ও ফরম্যাটিং সহ)"
                      value={formFields.description || ''}
                      onChange={(val) => setFormFields({ ...formFields, description: val })}
                    />

                    <ProjectGalleryUploader
                      label="Case Study & Gallery Photos (কেস স্টাডি ও প্রজেক্ট গ্যালারি ছবি)"
                      images={
                        formFields.gallery && formFields.gallery.length > 0
                          ? formFields.gallery.map((g: any) => (typeof g === 'string' ? g : g.url))
                          : (formFields.documentDetails?.images || [])
                      }
                      onChange={(imgs) => {
                        const formattedGallery = imgs.map((url: string) => ({ url, publicId: '', caption: '' }));
                        setFormFields({
                          ...formFields,
                          gallery: formattedGallery,
                          documentDetails: { ...(formFields.documentDetails || {}), images: imgs }
                        });
                      }}
                    />

                    {renderInput('Category', 'category', 'text', 'Frontend / Backend / Full Stack')}
                    {renderInput('Tags (Comma separated)', 'tags', 'text', 'React, Next.js, Node.js, MongoDB')}
                    {renderInput('GitHub Source Code Link', 'githubLink', 'text', 'https://github.com/profile/repo')}
                    {renderInput('Live Demo Link', 'demoLink', 'text', 'https://demo.com')}
                  </>
                )}

                {/* SKILLS TAB INPUTS */}
                {tab === 'skills' && (
                  <>
                    {renderInput('Category Title', 'title', 'text', 'Web Development')}
                    {renderInput('Description', 'description', 'text', 'Building scalable web apps...')}
                    {renderInput('Category Icon (Lucide)', 'icon', 'text', 'Code2 / Palette / Search')}
                    
                    <div className="space-y-1.5">
                      <label className="text-slate-400 text-xs font-semibold">Color Theme</label>
                      <select
                        value={formFields.colorTheme || 'blue'}
                        onChange={(e) => setFormFields({ ...formFields, colorTheme: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-950 border border-white/5 rounded-xl text-xs text-slate-300 focus:outline-none"
                      >
                        <option value="blue">Blue</option>
                        <option value="purple">Purple</option>
                        <option value="emerald">Emerald</option>
                        <option value="rose">Rose</option>
                        <option value="amber">Amber</option>
                      </select>
                    </div>

                    {/* Competencies Builder */}
                    <div className="pt-4 space-y-2 border-t border-white/5">
                      <div className="flex justify-between items-center">
                        <label className="text-slate-300 text-xs font-bold">Core Competencies</label>
                        <button type="button" onClick={() => {
                          const newComps = [...(formFields.coreCompetencies || []), { name: '', icon: 'Check' }];
                          setFormFields({ ...formFields, coreCompetencies: newComps });
                        }} className="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded">Add +</button>
                      </div>
                      {(formFields.coreCompetencies || []).map((comp: any, idx: number) => (
                        <div key={idx} className="flex gap-2">
                          <input type="text" placeholder="Name" value={comp.name} onChange={(e) => {
                            const newComps = [...formFields.coreCompetencies];
                            newComps[idx].name = e.target.value;
                            setFormFields({ ...formFields, coreCompetencies: newComps });
                          }} className="flex-1 px-3 py-2 bg-slate-950 border border-white/5 rounded-xl text-xs text-white" />
                          <input type="text" placeholder="Icon" value={comp.icon} onChange={(e) => {
                            const newComps = [...formFields.coreCompetencies];
                            newComps[idx].icon = e.target.value;
                            setFormFields({ ...formFields, coreCompetencies: newComps });
                          }} className="w-24 px-3 py-2 bg-slate-950 border border-white/5 rounded-xl text-xs text-white" />
                          <button type="button" onClick={() => {
                            const newComps = [...formFields.coreCompetencies];
                            newComps.splice(idx, 1);
                            setFormFields({ ...formFields, coreCompetencies: newComps });
                          }} className="p-2 bg-rose-500/10 text-rose-500 rounded-xl"><Trash2 className="w-4 h-4"/></button>
                        </div>
                      ))}
                    </div>

                    {/* Tools Builder */}
                    <div className="pt-4 space-y-2 border-t border-white/5">
                      <div className="flex justify-between items-center">
                        <label className="text-slate-300 text-xs font-bold">Tools & Mastery</label>
                        <button type="button" onClick={() => {
                          const newTools = [...(formFields.tools || []), { name: '', icon: 'Tool', level: 80, color: 'text-blue-500' }];
                          setFormFields({ ...formFields, tools: newTools });
                        }} className="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded">Add Tool +</button>
                      </div>
                      {(formFields.tools || []).map((tool: any, idx: number) => (
                        <div key={idx} className="flex flex-col gap-2 p-3 bg-white/5 rounded-xl border border-white/5">
                          <div className="flex gap-2">
                             <input type="text" placeholder="Tool Name" value={tool.name} onChange={(e) => {
                              const newTools = [...formFields.tools];
                              newTools[idx].name = e.target.value;
                              setFormFields({ ...formFields, tools: newTools });
                            }} className="flex-1 px-3 py-2 bg-slate-950 border border-white/5 rounded-xl text-xs text-white" />
                            <button type="button" onClick={() => {
                              const newTools = [...formFields.tools];
                              newTools.splice(idx, 1);
                              setFormFields({ ...formFields, tools: newTools });
                            }} className="p-2 bg-rose-500/10 text-rose-500 rounded-xl"><Trash2 className="w-4 h-4"/></button>
                          </div>
                          <div className="flex gap-2">
                             <input type="text" placeholder="Icon" value={tool.icon} onChange={(e) => {
                              const newTools = [...formFields.tools];
                              newTools[idx].icon = e.target.value;
                              setFormFields({ ...formFields, tools: newTools });
                            }} className="flex-1 px-3 py-2 bg-slate-950 border border-white/5 rounded-xl text-xs text-white" />
                             <input type="number" placeholder="Level %" value={tool.level} onChange={(e) => {
                              const newTools = [...formFields.tools];
                              newTools[idx].level = Number(e.target.value);
                              setFormFields({ ...formFields, tools: newTools });
                            }} className="w-24 px-3 py-2 bg-slate-950 border border-white/5 rounded-xl text-xs text-white" />
                             <input type="text" placeholder="Color (e.g. text-blue-500)" value={tool.color} onChange={(e) => {
                              const newTools = [...formFields.tools];
                              newTools[idx].color = e.target.value;
                              setFormFields({ ...formFields, tools: newTools });
                            }} className="flex-1 px-3 py-2 bg-slate-950 border border-white/5 rounded-xl text-xs text-white" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* BLOGS TAB INPUTS */}
                {tab === 'blogs' && (
                  <>
                    {renderInput('Blog Title', 'title', 'text', 'Getting Started with Next.js 15')}
                    <div className="space-y-1.5">
                      <label className="text-slate-400 text-xs font-semibold">Blog Summary</label>
                      <input
                        type="text"
                        value={formFields.summary || ''}
                        onChange={(e) => setFormFields({ ...formFields, summary: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-950 border border-white/5 focus:border-indigo-500/50 rounded-xl text-xs text-slate-300 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-slate-400 text-xs font-semibold">Rich Content (Markdown/Text)</label>
                      <textarea
                        rows={6}
                        value={formFields.content || ''}
                        onChange={(e) => setFormFields({ ...formFields, content: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-950 border border-white/5 focus:border-indigo-500/50 rounded-xl text-xs text-slate-300 focus:outline-none font-mono"
                      />
                    </div>
                    {renderInput('Category', 'category', 'text', 'Development')}
                    {renderInput('Tags (Comma separated)', 'tags', 'text', 'nextjs, react')}
                  </>
                )}

                {/* ARTICLES TAB INPUTS */}
                {tab === 'articles' && (
                  <>
                    {renderInput('Article Title', 'title', 'text', 'Mongoose Performance Tips')}
                    {renderInput('External Syndication Link', 'externalLink', 'text', 'https://medium.com/my-article')}
                    {renderInput('Category', 'category', 'text', 'Database')}
                    {renderInput('Tags', 'tags', 'text', 'mongodb')}
                    {renderInput('Publisher Source', 'source', 'text', 'Medium / Dev.to / LinkedIn')}
                    <div className="space-y-1.5">
                      <label className="text-slate-400 text-xs font-semibold">Article Summary</label>
                      <textarea
                        rows={2}
                        value={formFields.summary || ''}
                        onChange={(e) => setFormFields({ ...formFields, summary: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-950 border border-white/5 focus:border-indigo-500/50 rounded-xl text-xs text-slate-300 focus:outline-none"
                      />
                    </div>
                  </>
                )}

                {/* TESTIMONIALS TAB INPUTS */}
                {tab === 'testimonials' && (
                  <>
                    {renderInput('Client Name', 'clientName')}
                    {renderInput('Client Position', 'position', 'text', 'VP of Engineering')}
                    {renderInput('Company', 'company', 'text', 'Stripe Inc')}
                    <div className="space-y-1.5">
                      <label className="text-slate-400 text-xs font-semibold font-mono">Rating (1-5)</label>
                      <select
                        value={formFields.rating || 5}
                        onChange={(e) => setFormFields({ ...formFields, rating: parseInt(e.target.value, 10) })}
                        className="w-full px-3 py-2 bg-slate-950 border border-white/5 rounded-xl text-xs text-slate-300 focus:outline-none"
                      >
                        <option value={5}>5 stars</option>
                        <option value={4}>4 stars</option>
                        <option value={3}>3 stars</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-slate-400 text-xs font-semibold">Review content</label>
                      <textarea
                        rows={3}
                        value={formFields.reviewContent || ''}
                        onChange={(e) => setFormFields({ ...formFields, reviewContent: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-950 border border-white/5 focus:border-indigo-500/50 rounded-xl text-xs text-slate-300 focus:outline-none"
                      />
                    </div>
                  </>
                )}

                {/* TIMELINE ACTIVITIES INPUTS */}
                {tab === 'activities' && (
                  <>
                    {renderInput('Activity Title (e.g. Project Name)', 'title', 'text', 'M.Sc Computer Science')}
                    {renderInput('Short Summary', 'description')}
                    <div className="space-y-1.5">
                      <label className="text-slate-400 text-xs font-semibold">Full Detailed Description (Shown in Popup)</label>
                      <textarea
                        rows={5}
                        value={formFields.fullDetails || ''}
                        onChange={(e) => setFormFields({ ...formFields, fullDetails: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-950 border border-white/5 focus:border-indigo-500/50 rounded-xl text-xs text-slate-300 focus:outline-none custom-scrollbar"
                      />
                    </div>
                    {renderInput('Date range (Start Date)', 'date', 'text', 'Oct 2023 - Present')}
                    {renderInput('Duration / Estimated Time', 'duration', 'text', 'e.g. 3 Months')}
                    <div className="space-y-1.5">
                      <label className="text-slate-400 text-xs font-semibold">Category</label>
                      <select
                        value={formFields.category || 'Work'}
                        onChange={(e) => setFormFields({ ...formFields, category: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-950 border border-white/5 rounded-xl text-xs text-slate-300 focus:outline-none"
                      >
                        <option value="Work">Work</option>
                        <option value="Education">Education</option>
                        <option value="Award">Award</option>
                        <option value="Project">Project</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    {renderInput('Lucide Icon', 'icon', 'text', 'Briefcase / GraduationCap / Trophy')}
                  </>
                )}

                {/* GALLERY IMAGES INPUTS */}
                {tab === 'gallery-images' && (
                  <>
                    {renderInput('Image Title', 'title')}
                    {renderInput('Image category', 'category', 'text', 'UI design')}
                    {renderInput('Tags', 'tags', 'text', 'figma')}
                    <div className="space-y-1.5">
                      <label className="text-slate-400 text-xs font-semibold">Image Description</label>
                      <input
                        type="text"
                        value={formFields.description || ''}
                        onChange={(e) => setFormFields({ ...formFields, description: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-950 border border-white/5 focus:border-indigo-500/50 rounded-xl text-xs text-slate-300 focus:outline-none"
                      />
                    </div>
                  </>
                )}

                {/* GALLERY VIDEOS INPUTS */}
                {tab === 'gallery-videos' && (
                  <>
                    {renderInput('Video Title', 'title')}
                    {renderInput('Video Streaming URL', 'url', 'text', 'https://www.youtube.com/watch?v=VIDEO_ID')}
                    {renderInput('Fallback Thumbnail URL', 'thumbnail')}
                    <div className="space-y-1.5">
                      <label className="text-slate-400 text-xs font-semibold">Video Description</label>
                      <input
                        type="text"
                        value={formFields.description || ''}
                        onChange={(e) => setFormFields({ ...formFields, description: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-950 border border-white/5 focus:border-indigo-500/50 rounded-xl text-xs text-slate-300 focus:outline-none"
                      />
                    </div>
                  </>
                )}

                {/* DOCUMENTS INPUTS */}
                {tab === 'documents' && (
                  <>
                    {renderInput('Document Title', 'title')}
                    <div className="space-y-1.5">
                      <label className="text-slate-400 text-xs font-semibold font-mono">Document Category</label>
                      <input
                        type="text"
                        value={formFields.category || ''}
                        onChange={(e) => setFormFields({ ...formFields, category: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-950 border border-white/5 rounded-xl text-xs text-slate-300 focus:outline-none"
                      />
                    </div>
                    {renderInput('Tags', 'tags', 'text', 'resume, pdf')}
                    <div className="space-y-1.5">
                      <label className="text-slate-400 text-xs font-semibold">Document Type</label>
                      <select
                        value={formFields.type || 'pdf'}
                        onChange={(e) => setFormFields({ ...formFields, type: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-950 border border-white/5 rounded-xl text-xs text-slate-300 focus:outline-none"
                      >
                        <option value="resume">Resume</option>
                        <option value="pdf">PDF Doc</option>
                        <option value="presentation">Presentation</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-slate-400 text-xs font-semibold">Document Description</label>
                      <input
                        type="text"
                        value={formFields.description || ''}
                        onChange={(e) => setFormFields({ ...formFields, description: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-950 border border-white/5 focus:border-indigo-500/50 rounded-xl text-xs text-slate-300 focus:outline-none"
                      />
                    </div>
                  </>
                )}

                {/* Order Index (Common) */}
                {formFields.order !== undefined && renderInput('Order Index Sorting', 'order', 'number')}

                {/* Boolean Toggles (Common Checkboxes) */}
                <div className="flex flex-wrap gap-4 pt-2 border-t border-white/5">
                  {formFields.isFeatured !== undefined && (
                    <label className="flex items-center space-x-2 text-xs font-semibold text-slate-400 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formFields.isFeatured === 'true' || formFields.isFeatured === true}
                        onChange={(e) => setFormFields({ ...formFields, isFeatured: e.target.checked })}
                        className="accent-indigo-500"
                      />
                      <span>Mark Featured</span>
                    </label>
                  )}
                  {formFields.isProtected !== undefined && (
                    <label className="flex items-center space-x-2 text-xs font-semibold text-slate-400 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formFields.isProtected === 'true' || formFields.isProtected === true}
                        onChange={(e) => setFormFields({ ...formFields, isProtected: e.target.checked })}
                        className="accent-indigo-500"
                      />
                      <span>Require User Auth Lock</span>
                    </label>
                  )}
                  {formFields.isPublished !== undefined && (
                    <label className="flex items-center space-x-2 text-xs font-semibold text-slate-400 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formFields.isPublished === 'true' || formFields.isPublished === true}
                        onChange={(e) => setFormFields({ ...formFields, isPublished: e.target.checked })}
                        className="accent-indigo-500"
                      />
                      <span>Publish Instantly</span>
                    </label>
                  )}
                </div>

                {/* Dual Option Image/File Selector (Direct Upload OR Image URL) */}
                {['projects', 'blogs', 'articles', 'testimonials', 'activities', 'gallery-images', 'documents'].includes(tab) && (() => {
                  let imgKey = 'image';
                  let labelText = 'Preview / Feature Image';
                  if (tab === 'blogs') { imgKey = 'coverImage'; labelText = 'Blog Cover Image'; }
                  else if (tab === 'articles') { imgKey = 'previewImage'; labelText = 'Article Preview Image'; }
                  else if (tab === 'testimonials') { imgKey = 'avatar'; labelText = 'Client Avatar Image'; }
                  else if (tab === 'documents') { imgKey = 'fileUrl'; labelText = 'Document File / Link'; }
                  else if (tab === 'gallery-images') { imgKey = 'url'; labelText = 'Gallery Image'; }

                  const currentValue = typeof formFields[imgKey] === 'string' 
                    ? formFields[imgKey] 
                    : (formFields[imgKey]?.url || '');

                  return (
                    <div className="space-y-1.5 border-t border-white/5 pt-4">
                      <DualImageInput
                        label={labelText}
                        value={currentValue}
                        onChangeUrl={(url) => setFormFields({ ...formFields, [imgKey]: url })}
                        fileObject={fileObject}
                        onFileSelect={(file) => setFileObject(file)}
                      />
                    </div>
                  );
                })()}

                {/* Submit buttons */}
                <div className="flex items-center justify-end space-x-4 pt-6 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 bg-slate-950 border border-white/5 hover:bg-slate-900 text-slate-400 rounded-xl text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="flex items-center space-x-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-xl text-xs font-semibold transition-colors"
                  >
                    {formLoading ? (
                      <Loader2 className="h-4.5 w-4.5 animate-spin" />
                    ) : (
                      <span>Save Changes</span>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SINGLE UNIFIED CONFIGURATION FORM VIEW */}
      {tab === 'configuration' && (
        <form onSubmit={handleConfigSubmit} className="space-y-8">
          {/* Section 1: Hero Settings */}
          <div className="p-8 rounded-2xl bg-slate-950 border border-white/5 space-y-4">
            <h3 className="text-white font-bold text-sm uppercase tracking-wider pb-2 border-b border-white/5 flex items-center space-x-2">
              <FolderCode className="h-4 w-4 text-indigo-400" />
              <span>Hero Text Configurations</span>
            </h3>
            {renderInput('Hero Title Banner', 'heroTitle')}
            <div className="space-y-1.5">
              <label className="text-slate-400 text-xs font-semibold">Hero Subtitle</label>
              <textarea
                rows={2}
                value={formFields.heroSubtitle || ''}
                onChange={(e) => setFormFields({ ...formFields, heroSubtitle: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-white/5 focus:border-indigo-500/50 rounded-xl text-xs text-slate-300 focus:outline-none"
              />
            </div>
          </div>

          {/* Section 2: General Bio & Meta */}
          <div className="p-8 rounded-2xl bg-slate-950 border border-white/5 space-y-4">
            <h3 className="text-white font-bold text-sm uppercase tracking-wider pb-2 border-b border-white/5 flex items-center space-x-2">
              <Sliders className="h-4 w-4 text-indigo-400" />
              <span>Bio & Search Engine Optimization (SEO)</span>
            </h3>
            <div className="space-y-1.5">
              <label className="text-slate-400 text-xs font-semibold">About Bio Description</label>
              <textarea
                rows={3}
                value={formFields.siteDescription || ''}
                onChange={(e) => setFormFields({ ...formFields, siteDescription: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-white/5 focus:border-indigo-500/50 rounded-xl text-xs text-slate-300 focus:outline-none"
              />
            </div>
            {renderInput('SEO Meta Tags (Comma separated)', 'seoKeywords')}
          </div>

          {/* Section 3: Contact Settings */}
          <div className="p-8 rounded-2xl bg-slate-950 border border-white/5 space-y-4">
            <h3 className="text-white font-bold text-sm uppercase tracking-wider pb-2 border-b border-white/5 flex items-center space-x-2">
              <Mail className="h-4 w-4 text-indigo-400" />
              <span>Contact Credentials</span>
            </h3>
            {renderInput('Primary Email', 'contactEmail', 'email')}
            {renderInput('Office Phone', 'contactPhone')}
            {renderInput('Physical Location Address', 'contactAddress')}
          </div>

          {/* Section 4: Social Links */}
          <div className="p-8 rounded-2xl bg-slate-950 border border-white/5 space-y-4">
            <h3 className="text-white font-bold text-sm uppercase tracking-wider pb-2 border-b border-white/5 flex items-center space-x-2">
              <Settings className="h-4 w-4 text-indigo-400" />
              <span>Social Media Accounts Links</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderInput('GitHub URL', 'github')}
              {renderInput('LinkedIn URL', 'linkedin')}
              {renderInput('Twitter / X URL', 'twitter')}
              {renderInput('YouTube URL', 'youtube')}
              {renderInput('Facebook URL', 'facebook')}
              {renderInput('Instagram URL', 'instagram')}
              {renderInput('Dribbble URL', 'dribbble')}
              {renderInput('Medium URL', 'medium')}
            </div>
          </div>

          {/* Save Configurations controls button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={formLoading}
              className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-xl text-xs font-semibold transition-all shadow-lg shadow-indigo-500/25"
            >
              {formLoading ? (
                <Loader2 className="h-4.5 w-4.5 animate-spin" />
              ) : (
                <span>Save Site Settings</span>
              )}
            </button>
          </div>
        </form>
      )}

      {/* MESSAGE READER MODAL */}
      <AnimatePresence>
        {activeMessage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveMessage(null)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-slate-900 border border-white/10 rounded-2xl max-w-lg w-full shadow-2xl z-10 p-6 space-y-4"
            >
              <div className="pb-3 border-b border-white/5">
                <span className="text-[10px] text-slate-500 font-mono">From Client</span>
                <h3 className="text-white font-extrabold text-lg">{activeMessage.name}</h3>
                <p className="text-indigo-400 text-xs font-mono">{activeMessage.email}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 font-mono block">Subject</span>
                <p className="text-white text-sm font-semibold">{activeMessage.subject}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 font-mono block">Message Contents</span>
                <div className="p-4 rounded-xl bg-slate-950 border border-white/5 text-slate-300 text-xs whitespace-pre-line leading-relaxed font-light">
                  {activeMessage.message}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/5 text-[10px] text-slate-500 font-mono">
                <span>Received: {new Date(activeMessage.createdAt).toLocaleString()}</span>
                <button
                  onClick={() => setActiveMessage(null)}
                  className="px-4 py-1.5 bg-slate-950 border border-white/5 hover:bg-slate-900 text-slate-400 rounded-xl text-[10px] font-bold"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
