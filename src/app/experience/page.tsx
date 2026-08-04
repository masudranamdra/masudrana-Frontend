'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import API, { getAssetUrl } from '../../lib/api';
import { Activity, DocumentAsset } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, GraduationCap, Trophy, Code, Star, Calendar, Download, FileText, ExternalLink, Image as ImageIcon, MapPin, Building, BookOpen, Layers, CheckCircle2, Link as LinkIcon } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

export default function ExperiencePage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [documents, setDocuments] = useState<DocumentAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'All' | 'Work' | 'Education' | 'Course' | 'Award'>('All');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [actRes, docRes] = await Promise.all([
          API.get('/activities').catch(() => ({ data: { success: false, data: [] } })),
          API.get('/documents').catch(() => ({ data: { success: false, data: [] } }))
        ]);

        if (actRes.data && actRes.data.success) {
          const published = actRes.data.data.filter((a: Activity) => a.isPublished !== false);
          published.sort((a: Activity, b: Activity) => b.order - a.order);
          setActivities(published);
        }
        if (docRes.data && docRes.data.success) {
          const relevantDocs = docRes.data.data.filter((d: DocumentAsset) => 
            ['resume', 'pdf', 'presentation', 'other'].includes(d.type)
          );
          setDocuments(relevantDocs);
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getIcon = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName] || Star;
    return <Icon className="h-5 w-5" />;
  };

  const filteredActivities = activeTab === 'All' 
    ? activities 
    : activities.filter(a => a.category === activeTab);

  const renderTags = (tags?: string[]) => {
    if (!tags || tags.length === 0) return null;
    return (
      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
        {tags.map((tag, i) => (
          <span key={i} className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md">
            {tag}
          </span>
        ))}
      </div>
    );
  };

  const TimelineItem = ({ item, index }: { item: Activity, index: number }) => {
    const isWork = item.category === 'Work';
    const isEdu = item.category === 'Education';
    const isCourse = item.category === 'Course';
    
    // Determine colors
    let colorClass = 'text-slate-600 bg-slate-100 dark:text-slate-300 dark:bg-slate-800';
    let borderColor = 'border-slate-200 dark:border-slate-700';
    if (isWork) { colorClass = 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-500/10'; borderColor = 'border-blue-200 dark:border-blue-800'; }
    else if (isEdu) { colorClass = 'text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-500/10'; borderColor = 'border-purple-200 dark:border-purple-800'; }
    else if (isCourse) { colorClass = 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10'; borderColor = 'border-emerald-200 dark:border-emerald-800'; }

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="relative pl-10 sm:pl-12 group mb-10 last:mb-0"
      >
        {/* Line & Dot */}
        <div className="absolute left-0 top-0 bottom-[-40px] w-0.5 bg-gradient-to-b from-[#E2E8F0] dark:from-slate-700 to-transparent group-last:bottom-0" />
        <div className={`absolute left-[-11px] top-1.5 p-2 rounded-full ${colorClass} ${borderColor} border-2 shadow-md z-10 group-hover:scale-110 transition-transform`}>
          {getIcon(item.icon)}
        </div>

        {/* Content Card */}
        <div className="bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          
          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            {/* Logo / Image Side */}
            <div className="shrink-0 w-full md:w-48 flex flex-col gap-4">
              {item.image?.url ? (
                <div className="w-full h-32 md:h-48 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 relative group-hover:border-blue-300 dark:group-hover:border-blue-700 transition-colors">
                  <img src={getAssetUrl(item.image.url)} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
              ) : (
                <div className="w-full h-32 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400">
                  <ImageIcon className="h-8 w-8 mb-2 opacity-50" />
                  <span className="text-[10px] uppercase tracking-wider font-mono">No Image</span>
                </div>
              )}
              
              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                {item.isFeatured && (
                  <span className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400 rounded-md">
                    <Star className="h-3 w-3" /> Featured
                  </span>
                )}
                {item.isCurrent ? (
                  <span className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400 rounded-md animate-pulse">
                    <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" /> Present
                  </span>
                ) : (
                  <span className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 rounded-md">
                    <CheckCircle2 className="h-3 w-3" /> Completed
                  </span>
                )}
              </div>
            </div>

            {/* Details Side */}
            <div className="flex-grow space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider font-mono rounded-md mr-3 ${colorClass}`}>
                    {item.category}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 font-mono text-xs inline-flex items-center">
                    <Calendar className="h-3.5 w-3.5 mr-1.5" />
                    {item.date} {item.duration && `(${item.duration})`}
                  </span>
                </div>
                {(item.companyWebsite || item.credentialLink) && (
                  <a href={item.companyWebsite || item.credentialLink} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/20 transition-colors">
                    <LinkIcon className="h-4 w-4" />
                  </a>
                )}
              </div>

              <div>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {item.title}
                </h3>
                
                {/* Meta details (Company, Institute, Platform) */}
                <div className="flex flex-wrap gap-y-2 gap-x-6 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">
                  {(item.companyName || item.instituteName || item.platform) && (
                    <span className="flex items-center">
                      <Building className="h-4 w-4 mr-1.5 text-slate-400" />
                      {item.companyName || item.instituteName || item.platform}
                    </span>
                  )}
                  {item.location && (
                    <span className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1.5 text-slate-400" />
                      {item.location}
                    </span>
                  )}
                  {item.employmentType && (
                    <span className="flex items-center">
                      <Briefcase className="h-4 w-4 mr-1.5 text-slate-400" />
                      {item.employmentType}
                    </span>
                  )}
                  {(item.degree || item.department) && (
                    <span className="flex items-center">
                      <GraduationCap className="h-4 w-4 mr-1.5 text-slate-400" />
                      {item.degree} {item.department && `- ${item.department}`}
                    </span>
                  )}
                </div>

                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed whitespace-pre-wrap">
                  {item.description}
                </p>
              </div>

              {/* Arrays: Responsibilities / Achievements */}
              {(item.responsibilities?.length || 0) > 0 && (
                <div className="pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-2">Key Responsibilities</h4>
                  <ul className="space-y-1.5">
                    {item.responsibilities!.map((res, i) => (
                      <li key={i} className="text-sm text-slate-600 dark:text-slate-400 flex items-start">
                        <span className="mr-2 mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
                        <span className="leading-relaxed">{res}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tech Tags / Skills Learned */}
              {renderTags(item.technologies || item.skillsLearned || item.academicAchievements)}

            </div>
          </div>

        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FB] dark:bg-[#0F172A] text-[#0F172A] dark:text-white transition-colors duration-300">
      <Navbar />

      <main className="flex-grow pt-32 pb-24 relative overflow-hidden">
        
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-500/10 dark:from-blue-600/10 to-transparent pointer-events-none" />
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-[100px] pointer-events-none transition-colors duration-300" />
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
          
          {/* Page Hero Title */}
          <div className="text-center max-w-3xl mx-auto space-y-6 pt-10">
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest font-mono border border-blue-100 dark:border-blue-800">
              Complete Portfolio
            </span>
            <h1 className="text-4xl sm:text-6xl font-extrabold text-[#0F172A] dark:text-white tracking-tight leading-tight">
              Work & Education <br/> History
            </h1>
            <p className="text-[#64748B] dark:text-slate-400 text-base sm:text-lg max-w-xl mx-auto font-light leading-relaxed">
              A comprehensive timeline of my professional career, academic background, and continuous technology learning.
            </p>
          </div>

          {loading ? (
            <div className="text-center space-y-4 pt-10">
              <div className="h-10 w-64 bg-slate-200 dark:bg-slate-700 animate-pulse rounded-full mx-auto" />
              <div className="h-64 bg-slate-200/50 dark:bg-slate-800/50 animate-pulse rounded-3xl" />
            </div>
          ) : (
            <div className="space-y-12">
              
              {/* Category Tabs */}
              <div className="flex flex-wrap justify-center gap-2 sm:gap-4 p-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm w-fit mx-auto">
                {['All', 'Work', 'Education', 'Course', 'Award'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                      activeTab === tab 
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {tab === 'All' ? 'Complete Timeline' : tab === 'Course' ? 'Courses & Training' : tab}
                  </button>
                ))}
              </div>

              {/* Timeline Container */}
              <div className="max-w-4xl mx-auto pt-8">
                {filteredActivities.length === 0 ? (
                  <div className="text-center py-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl">
                    <Layers className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-500 font-medium">No records found for this category.</p>
                  </div>
                ) : (
                  <div>
                    {filteredActivities.map((activity, idx) => (
                      <TimelineItem key={activity._id} item={activity} index={idx} />
                    ))}
                  </div>
                )}
              </div>
              
              {/* Documents & CVs Vault */}
              <div className="pt-20 border-t border-[#E2E8F0] dark:border-slate-800 max-w-4xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl shadow-sm">
                        <FileText className="h-6 w-6" />
                      </div>
                      <h2 className="text-[#0F172A] dark:text-white font-extrabold text-3xl tracking-tight">Documents Vault</h2>
                    </div>
                    <p className="text-[#64748B] dark:text-slate-400 text-sm">Download my latest Resume, CV, or Portfolio documents.</p>
                  </div>
                </div>

                {documents.length === 0 ? (
                  <div className="w-full py-16 flex flex-col items-center justify-center border-2 border-dashed border-[#E2E8F0] dark:border-slate-700 rounded-3xl bg-white dark:bg-slate-900/50">
                    <FileText className="h-10 w-10 text-slate-300 dark:text-slate-600 mb-4" />
                    <p className="text-[#64748B] dark:text-slate-400 font-medium">No public documents available yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {documents.map((doc, idx) => (
                      <motion.div
                        key={doc._id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: idx * 0.1 }}
                        className="group flex flex-col bg-white dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 rounded-3xl overflow-hidden hover:shadow-xl hover:border-[#2563EB]/50 dark:hover:border-[#2563EB]/50 transition-all duration-300"
                      >
                        <div className="p-6 flex-grow space-y-4">
                          <div className="w-12 h-12 bg-[#F5F7FB] dark:bg-slate-900 rounded-2xl flex items-center justify-center text-[#2563EB] dark:text-blue-400 group-hover:scale-110 transition-transform">
                            {doc.type === 'pdf' ? <FileText className="h-6 w-6" /> : doc.type === 'resume' ? <Briefcase className="h-6 w-6" /> : <FileText className="h-6 w-6" />}
                          </div>
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] dark:text-slate-400 font-mono mb-1 block">
                              {doc.category || doc.type}
                            </span>
                            <h3 className="text-lg font-bold text-[#0F172A] dark:text-white group-hover:text-[#2563EB] dark:group-hover:text-blue-400 transition-colors">
                              {doc.title}
                            </h3>
                          </div>
                          <p className="text-sm text-[#64748B] dark:text-slate-400 font-light line-clamp-2">
                            {doc.description || "Official document"}
                          </p>
                        </div>
                        <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-[#E2E8F0] dark:border-slate-700 flex justify-between items-center">
                          <a
                            href={doc.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm font-bold text-[#2563EB] dark:text-blue-400 hover:text-[#1D4ED8] dark:hover:text-blue-300 transition-colors"
                          >
                            <ExternalLink className="h-4 w-4" /> Open File
                          </a>
                          <a
                            href={doc.fileUrl}
                            download
                            className="p-2 bg-white dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 text-[#0F172A] dark:text-white rounded-xl hover:bg-[#2563EB] hover:text-white hover:border-[#2563EB] transition-all cursor-pointer"
                            title="Download Document"
                          >
                            <Download className="h-4 w-4" />
                          </a>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
