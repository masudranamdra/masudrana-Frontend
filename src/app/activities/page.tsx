'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import API, { getAssetUrl } from '../../lib/api';
import { Activity } from '../../types';
import { motion } from 'framer-motion';
import { Trophy, Calendar } from 'lucide-react';

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

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

  // Filter activities for engagements (events, awards, projects with images)
  const engagementActivities = activities.filter((a) => a.image?.url || a.category === 'Project' || a.category === 'Other');

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FB] text-[#0F172A]">
      <Navbar />

      <main className="flex-grow pt-32 pb-24 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-1/2 left-0 w-[450px] h-[450px] bg-blue-500/5 rounded-full blur-[110px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
          
          {/* Page Title */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#2563EB] font-mono">Highlights</span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0F172A] tracking-tight">Activities & Engagements</h1>
            <div className="h-1 w-12 bg-[#2563EB] rounded-full mx-auto" />
            <p className="text-slate-500 text-sm max-w-lg mx-auto font-light leading-relaxed">
              Explore my speaking opportunities, technical community meetups, hackathons, and certifications.
            </p>
          </div>

          {/* Timeline Style List */}
          {loading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-32 bg-white border border-[#E2E8F0] animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : engagementActivities.length === 0 ? (
            <div className="text-center py-20 text-slate-500 text-sm italic">
              No activities published yet.
            </div>
          ) : (
            <div className="space-y-6">
              {engagementActivities.map((activity, index) => (
                <motion.div
                  key={activity._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="p-6 rounded-2xl bg-white border border-[#E2E8F0] flex flex-col md:flex-row items-start md:items-stretch gap-6 hover:border-slate-300 transition-all duration-300 shadow-md shadow-slate-100/40"
                >
                  {/* Left content: text details */}
                  <div className="flex-grow space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-0.5 rounded-lg bg-[#EFF6FF] text-[#2563EB] font-bold border border-[#DBEAFE] text-[9px] font-mono uppercase tracking-wider">
                          {activity.category}
                        </span>
                        <span className="text-[10px] text-[#64748B] font-mono flex items-center">
                          <Calendar className="h-3 w-3 mr-1 text-[#2563EB]" />
                          {activity.date}
                        </span>
                      </div>
                      <h2 className="text-[#0F172A] font-bold text-lg leading-tight tracking-tight">{activity.title}</h2>
                      <p className="text-[#64748B] text-xs sm:text-sm leading-relaxed font-light">{activity.description}</p>
                    </div>
                  </div>

                  {/* Right content: rectangular image thumbnail preview */}
                  {activity.image?.url && (
                    <div className="w-full md:w-48 h-32 md:h-28 rounded-xl overflow-hidden shrink-0 border border-[#E2E8F0] bg-slate-100">
                      <img
                        src={getAssetUrl(activity.image.url)}
                        alt={activity.title}
                        className="w-full h-full object-cover hover:scale-[1.03] transition-transform duration-500"
                      />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
