'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import API, { getAssetUrl } from '../../lib/api';
import { Testimonial } from '../../types';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await API.get('/testimonials');
        if (res.data && res.data.success) {
          setTestimonials(res.data.data);
        }
      } catch (error) {
        console.error('Failed to load testimonials:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FB] text-[#0F172A]">
      <Navbar />

      <main className="flex-grow pt-32 pb-24 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-500/5 rounded-full blur-[110px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Page Title */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#2563EB] font-mono">Endorsements</span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0F172A] tracking-tight">Client Recommendations</h1>
            <div className="h-1 w-12 bg-[#2563EB] rounded-full mx-auto" />
            <p className="text-slate-500 text-sm max-w-lg mx-auto font-light leading-relaxed">
              Read feedback from the founders, engineering managers, and clients I have collaborated with.
            </p>
          </div>

          {/* Grid Layout of testimonials */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-64 bg-white border border-[#E2E8F0] animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : testimonials.length === 0 ? (
            <div className="text-center py-20 text-slate-500 text-sm italic">
              No recommendations published yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((current, index) => (
                <motion.div
                  key={current._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  whileHover={{ y: -5 }}
                  className="p-8 rounded-3xl bg-white border border-[#E2E8F0] shadow-md shadow-slate-100/50 hover:shadow-lg relative overflow-hidden flex flex-col justify-between space-y-6 transition-all duration-300"
                >
                  <div className="absolute top-6 right-6 text-slate-100 pointer-events-none">
                    <Quote className="h-10 w-10 transform -scale-x-100" />
                  </div>

                  <div className="space-y-4 relative z-10">
                    {/* Rating Stars */}
                    <div className="flex items-center space-x-1 text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4.5 w-4.5 ${
                            i < current.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Testimonial Review Text */}
                    <p className="text-[#334155] text-xs sm:text-sm leading-relaxed font-light italic">
                      "{current.reviewContent}"
                    </p>
                  </div>

                  {/* Client Info details */}
                  <div className="flex items-center space-x-4 pt-4 border-t border-slate-50 w-full">
                    {current.avatar?.url ? (
                      <img
                        src={getAssetUrl(current.avatar.url)}
                        alt={current.clientName}
                        className="w-10 h-10 rounded-full object-cover border border-[#E2E8F0] shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center border border-[#E2E8F0] text-[#2563EB] font-bold text-xs shrink-0">
                        {current.clientName.charAt(0)}
                      </div>
                    )}

                    <div className="text-left min-w-0">
                      <h3 className="text-[#0F172A] font-bold text-xs truncate">{current.clientName}</h3>
                      <p className="text-[#64748B] text-[10px] font-light truncate">
                        {current.position} at <span className="text-[#2563EB] font-semibold">{current.company}</span>
                      </p>
                    </div>
                  </div>

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
