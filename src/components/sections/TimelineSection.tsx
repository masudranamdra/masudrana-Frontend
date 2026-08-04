'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import API, { getAssetUrl } from '../../lib/api';
import { Activity } from '../../types';
import { motion } from 'framer-motion';
import { Briefcase, GraduationCap, ArrowRight, BookOpen, Calendar, MapPin, Building, Award, Code, Star, ExternalLink, Image as ImageIcon } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

export const TimelineSection: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await API.get('/activities');
        if (res.data && res.data.success) {
          // Filter only published ones
          const published = res.data.data.filter((a: Activity) => a.isPublished !== false);
          // Sort by order descending
          published.sort((a: Activity, b: Activity) => b.order - a.order);
          setActivities(published);
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
      <section className="py-32 bg-[#F5F7FB] dark:bg-[#0F172A]" id="experience">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="h-6 w-36 bg-slate-200 dark:bg-slate-700 animate-pulse rounded-md mx-auto mb-6" />
          <div className="h-48 w-full bg-slate-200/50 dark:bg-slate-700/50 animate-pulse rounded-2xl" />
        </div>
      </section>
    );
  }

  if (activities.length === 0) return null;

  const workItem = activities.find(a => a.category === 'Work' && a.isFeatured) || activities.find(a => a.category === 'Work');
  const eduItem = activities.find(a => a.category === 'Education' && a.isFeatured) || activities.find(a => a.category === 'Education');
  const courseItem = activities.find(a => a.category === 'Course' && a.isFeatured) || activities.find(a => a.category === 'Course');

  const previewItems = [workItem, eduItem, courseItem].filter(Boolean) as Activity[];

  const getIcon = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName] || Star;
    return <Icon className="h-5 w-5" />;
  };

  return (
    <section id="experience" className="relative py-32 bg-[#F5F7FB] dark:bg-[#0F172A] text-[#0F172A] dark:text-white border-t border-b border-[#E2E8F0] dark:border-slate-800 overflow-hidden transition-colors duration-300">
      
      {/* Background decoration */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-blue-500/5 dark:bg-blue-600/10 rounded-full blur-[100px] pointer-events-none transition-colors duration-300" />
      <div className="absolute bottom-1/4 right-0 w-[550px] h-[550px] bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-[110px] pointer-events-none transition-colors duration-300" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-[#2563EB] dark:text-blue-400 font-mono">Career Snapshot</span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#0F172A] dark:text-white tracking-tight leading-tight transition-colors duration-300">
            Work & Education
          </h2>
          <div className="h-1 w-12 bg-[#2563EB] dark:bg-blue-500 rounded-full mx-auto" />
          <p className="text-[#64748B] dark:text-slate-400 text-sm max-w-lg mx-auto pt-4">
            A brief look at my professional journey, academic background, and continuous learning.
          </p>
        </div>

        {/* Minimal Timeline List */}
        <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[#E2E8F0] dark:before:via-slate-800 before:to-transparent">
          {previewItems.map((item, index) => (
            <motion.div 
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
            >
              {/* Icon / Node */}
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-[#0F172A] bg-blue-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 group-hover:scale-110 transition-transform">
                {getIcon(item.icon)}
              </div>
              
              {/* Card */}
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 shadow-sm hover:shadow-lg rounded-2xl group-hover:-translate-y-1 transition-all duration-300">
                <div className="flex justify-between items-start mb-2">
                  <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider font-mono rounded bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    {item.category}
                  </span>
                  <span className="flex items-center text-xs text-slate-500 dark:text-slate-400 font-mono">
                    <Calendar className="h-3.5 w-3.5 mr-1" />
                    {item.date}
                  </span>
                </div>
                <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {item.title}
                </h4>
                {item.companyName || item.instituteName || item.platform ? (
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center flex-wrap gap-2">
                    {(item.companyName || item.instituteName || item.platform)}
                    {item.location && <span className="text-xs font-normal text-slate-500 flex items-center"><MapPin className="h-3 w-3 mr-0.5"/> {item.location}</span>}
                  </p>
                ) : null}
                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View Complete Resume link */}
        <div className="flex justify-center pt-20">
          <Link
            href="/experience"
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#0F172A] dark:bg-white text-white dark:text-[#0F172A] rounded-2xl font-bold text-lg overflow-hidden transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-slate-900/20 dark:shadow-white/10"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#2563EB] to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10 flex items-center gap-2 group-hover:text-white transition-colors">
              View Complete Resume & History
              <ArrowRight className="h-5 w-5" />
            </span>
          </Link>
        </div>

      </div>
    </section>
  );
};
