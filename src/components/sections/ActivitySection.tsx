'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import API, { getAssetUrl } from '../../lib/api';
import { Activity } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ArrowRight, Clock, Info, X, Briefcase, GraduationCap, Trophy, Folder } from 'lucide-react';

export const ActivitySection: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await API.get('/activities');
        if (res.data && res.data.success) {
          setActivities(res.data.data);
        }
      } catch (error) {
        console.error('Failed to load activities:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  if (loading) {
    return (
      <section className="py-32 bg-[#F5F7FB] dark:bg-[#0F172A]" id="activities">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="h-6 w-36 bg-slate-200 dark:bg-slate-700 animate-pulse rounded-md mx-auto mb-6" />
          <div className="h-48 w-full bg-slate-200/50 dark:bg-slate-800/50 animate-pulse rounded-2xl max-w-4xl mx-auto" />
        </div>
      </section>
    );
  }

  // Filter activities for engagements (events, awards, projects with images)
  const engagementActivities = activities.filter((a) => a.image?.url || a.category === 'Project' || a.category === 'Work');

  if (engagementActivities.length === 0) return null;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Work': return <Briefcase className="h-3 w-3" />;
      case 'Education': return <GraduationCap className="h-3 w-3" />;
      case 'Award': return <Trophy className="h-3 w-3" />;
      case 'Project': return <Folder className="h-3 w-3" />;
      default: return <Info className="h-3 w-3" />;
    }
  };

  return (
    <section id="activities" className="relative py-32 bg-[#F5F7FB] dark:bg-[#0F172A] text-[#0F172A] dark:text-white border-t border-b border-[#E2E8F0] dark:border-slate-800 overflow-hidden transition-colors duration-300">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-blue-500/5 dark:bg-blue-600/10 rounded-full blur-[120px] pointer-events-none transition-colors duration-300" />
      <div className="absolute bottom-10 right-0 w-[400px] h-[400px] bg-emerald-500/5 dark:bg-emerald-600/10 rounded-full blur-[100px] pointer-events-none transition-colors duration-300" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-[#2563EB] dark:text-blue-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest font-mono border border-blue-100 dark:border-blue-800/50">
            Current Projects
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#0F172A] dark:text-white tracking-tight leading-tight">
            Activities & Engagements
          </h2>
          <div className="h-1.5 w-16 bg-gradient-to-r from-[#2563EB] to-emerald-500 rounded-full mx-auto mt-4" />
        </div>

        {/* Timeline Style List */}
        <div className="space-y-6">
          {engagementActivities.slice(0, 4).map((activity, index) => (
            <motion.div
              key={activity._id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              onClick={() => setSelectedActivity(activity)}
              className="group p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900/80 backdrop-blur-md border border-[#E2E8F0] dark:border-slate-800 flex flex-col md:flex-row items-start md:items-stretch gap-6 hover:border-[#2563EB]/50 dark:hover:border-blue-500/50 transition-all duration-300 shadow-lg shadow-slate-200/50 dark:shadow-none cursor-pointer transform hover:-translate-y-1"
            >
              {/* Left content: text details */}
              <div className="flex-grow space-y-4 flex flex-col justify-between w-full">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-[#EFF6FF] dark:bg-blue-900/30 text-[#2563EB] dark:text-blue-400 font-bold border border-[#DBEAFE] dark:border-blue-800/50 text-[10px] font-mono uppercase tracking-wider">
                      {getCategoryIcon(activity.category)}
                      <span>{activity.category}</span>
                    </span>
                    <span className="text-[11px] text-[#64748B] dark:text-slate-400 font-mono flex items-center bg-slate-50 dark:bg-slate-800 px-2.5 py-1 rounded-md border border-slate-100 dark:border-slate-700">
                      <Calendar className="h-3 w-3 mr-1.5 text-[#2563EB] dark:text-blue-400" />
                      Started: {activity.date}
                    </span>
                    {activity.duration && (
                      <span className="text-[11px] text-[#64748B] dark:text-slate-400 font-mono flex items-center bg-slate-50 dark:bg-slate-800 px-2.5 py-1 rounded-md border border-slate-100 dark:border-slate-700">
                        <Clock className="h-3 w-3 mr-1.5 text-amber-500" />
                        Est. Time: {activity.duration}
                      </span>
                    )}
                  </div>
                  <h4 className="text-[#0F172A] dark:text-white font-extrabold text-xl leading-tight tracking-tight group-hover:text-[#2563EB] dark:group-hover:text-blue-400 transition-colors">
                    {activity.title}
                  </h4>
                  <p className="text-[#64748B] dark:text-slate-400 text-sm leading-relaxed font-light line-clamp-2">
                    {activity.description}
                  </p>
                </div>
                
                <div className="flex items-center text-[#2563EB] dark:text-blue-400 text-xs font-bold font-mono tracking-wider pt-2 mt-auto">
                  <span className="uppercase">View Full Details</span>
                  <ArrowRight className="h-4 w-4 ml-1.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Right content: rectangular image thumbnail preview */}
              {activity.image?.url && (
                <div className="w-full md:w-56 h-40 md:h-full min-h-[140px] rounded-2xl overflow-hidden shrink-0 border border-[#E2E8F0] dark:border-slate-800 bg-slate-100 dark:bg-slate-800/50 relative">
                  <img
                    src={getAssetUrl(activity.image.url)}
                    alt={activity.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Link to dedicated activities subpage */}
        <div className="flex justify-center pt-8">
          <Link
            href="/activities"
            className="group inline-flex items-center space-x-2 px-8 py-4 rounded-2xl font-bold bg-white dark:bg-slate-800 text-[#2563EB] dark:text-blue-400 border border-[#E2E8F0] dark:border-slate-700 hover:bg-[#2563EB] hover:text-white dark:hover:bg-blue-600 dark:hover:text-white hover:border-transparent transition-all duration-300 shadow-lg shadow-slate-200/50 dark:shadow-none"
          >
            <span>Explore All Engagements</span>
            <ArrowRight className="h-4.5 w-4.5 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* MODAL POPUP FOR DETAILED ACTIVITY */}
        <AnimatePresence>
          {selectedActivity && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedActivity(null)}
                className="absolute inset-0 bg-[#0F172A]/80 backdrop-blur-sm"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative w-full max-w-3xl max-h-[90vh] sm:max-h-[85vh] overflow-y-auto custom-scrollbar bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 rounded-3xl shadow-2xl z-10 flex flex-col"
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedActivity(null)}
                  className="absolute top-4 right-4 z-20 p-2.5 bg-black/20 dark:bg-white/10 hover:bg-black/40 dark:hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>

                {/* Cover Image Header */}
                {selectedActivity.image?.url && (
                  <div className="relative w-full h-60 sm:h-72 bg-slate-950 shrink-0 border-b border-[#E2E8F0] dark:border-slate-800">
                    <img
                      src={getAssetUrl(selectedActivity.image.url)}
                      alt={selectedActivity.title}
                      className="w-full h-full object-cover opacity-90 mix-blend-overlay"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
                    
                    <div className="absolute bottom-0 left-0 w-full p-6 sm:p-8 text-white flex gap-3">
                      <span className="inline-block px-3 py-1 rounded-lg bg-blue-600/80 backdrop-blur-md text-[10px] font-bold uppercase font-mono tracking-widest border border-blue-400/30">
                        {selectedActivity.category}
                      </span>
                    </div>
                  </div>
                )}

                {/* Details Contents */}
                <div className="flex-grow bg-white dark:bg-slate-900 p-6 sm:p-10 space-y-8">
                  
                  {/* Title and Meta */}
                  <div className="space-y-4">
                    {!selectedActivity.image?.url && (
                      <span className="inline-block px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-[#2563EB] dark:text-blue-400 text-[10px] font-bold uppercase font-mono tracking-widest border border-blue-200 dark:border-blue-800/50 mb-2">
                        {selectedActivity.category}
                      </span>
                    )}
                    <h3 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] dark:text-white leading-tight tracking-tight">
                      {selectedActivity.title}
                    </h3>
                    
                    <div className="flex flex-wrap items-center gap-4 text-[#64748B] dark:text-slate-400 text-xs sm:text-sm font-mono pt-2">
                      <div className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-xl border border-slate-100 dark:border-slate-700">
                        <Calendar className="h-4 w-4 text-[#2563EB] dark:text-blue-400" />
                        <span>Started: <strong className="text-slate-700 dark:text-slate-300 font-semibold">{selectedActivity.date}</strong></span>
                      </div>
                      
                      {selectedActivity.duration && (
                        <div className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-xl border border-slate-100 dark:border-slate-700">
                          <Clock className="h-4 w-4 text-amber-500" />
                          <span>Duration: <strong className="text-slate-700 dark:text-slate-300 font-semibold">{selectedActivity.duration}</strong></span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Short Description */}
                  <div className="p-5 bg-blue-50/50 dark:bg-slate-800/30 border border-blue-100 dark:border-slate-700/50 rounded-2xl text-[#334155] dark:text-slate-300 text-base leading-relaxed italic">
                    "{selectedActivity.description}"
                  </div>

                  {/* Full Details Content */}
                  <div className="pt-2">
                    <h4 className="text-sm font-bold text-[#0F172A] dark:text-white uppercase tracking-wider mb-4 font-mono flex items-center">
                      <Info className="h-4 w-4 mr-2 text-[#2563EB] dark:text-blue-400" />
                      Detailed Activities
                    </h4>
                    {selectedActivity.fullDetails ? (
                      <div className="text-[#334155] dark:text-slate-400 text-base sm:text-lg leading-loose whitespace-pre-line font-light p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                        {selectedActivity.fullDetails}
                      </div>
                    ) : (
                      <div className="text-slate-400 dark:text-slate-500 text-sm italic py-4">
                        No additional details provided for this activity.
                      </div>
                    )}
                  </div>

                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};
