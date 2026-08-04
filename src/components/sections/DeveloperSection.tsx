'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, LayoutTemplate, Layers, Cpu, Sparkles } from 'lucide-react';

export const DeveloperSection: React.FC = () => {
  const cards = [
    {
      icon: Layers,
      title: 'Clean Architecture',
      desc: 'Separation of concerns, dependency injection, and modular system design that makes code bases scalable, readable, and easy to maintain.',
      glowColor: 'group-hover:shadow-[0_15px_30px_-10px_rgba(37,99,235,0.15)]',
      borderColor: 'group-hover:border-blue-500/40',
      iconColor: 'text-blue-600 bg-blue-50 border-blue-100',
    },
    {
      icon: Zap,
      title: 'Performance First',
      desc: 'Optimized rendering pipelines, aggressive caching strategies, asset minimization, and lazy loading for sub-second visual responses.',
      glowColor: 'group-hover:shadow-[0_15px_30px_-10px_rgba(234,179,8,0.15)]',
      borderColor: 'group-hover:border-yellow-500/40',
      iconColor: 'text-yellow-600 bg-yellow-50 border-yellow-100',
    },
    {
      icon: LayoutTemplate,
      title: 'Responsive Systems',
      desc: 'Fluid grids, responsive layouts, and adaptively rendered interfaces that behave natively on mobile, tablet, and ultra-wide displays.',
      glowColor: 'group-hover:shadow-[0_15px_30px_-10px_rgba(168,85,247,0.15)]',
      borderColor: 'group-hover:border-purple-500/40',
      iconColor: 'text-purple-600 bg-purple-50 border-purple-100',
    },
    {
      icon: Shield,
      title: 'Secure Development',
      desc: 'Role-based access controls, data encryption at rest and in transit, input sanitation, XSS prevention, and strict API rate limiting.',
      glowColor: 'group-hover:shadow-[0_15px_30px_-10px_rgba(239,68,68,0.15)]',
      borderColor: 'group-hover:border-red-500/40',
      iconColor: 'text-red-600 bg-red-50 border-red-100',
    },
    {
      icon: Sparkles,
      title: 'Creative UI Engineering',
      desc: 'Cinematic micro-interactions, rich gradients, layered animations, and high-fidelity physics-based motion transitions.',
      glowColor: 'group-hover:shadow-[0_15px_30px_-10px_rgba(6,182,212,0.15)]',
      borderColor: 'group-hover:border-cyan-500/40',
      iconColor: 'text-cyan-600 bg-cyan-50 border-cyan-100',
    },
  ];

  return (
    <section id="developer" className="relative py-32 bg-[#F5F7FB] border-t border-b border-[#E2E8F0] overflow-hidden">
      {/* Decorative Glow Layer */}
      <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[90px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <motion.span 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-[#2563EB] font-mono flex items-center justify-center space-x-2"
          >
            <Cpu className="h-4 w-4 text-[#2563EB]" />
            <span>Architecture & Mindset</span>
          </motion.span>
          
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-5xl font-extrabold text-[#0F172A] tracking-tight leading-tight"
          >
            Developer Identity
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-[#334155] text-xs sm:text-sm font-light max-w-xl mx-auto leading-relaxed"
          >
            A look into how I construct robust software systems, blending creative aesthetics with performance-first backend infrastructures.
          </motion.p>
          
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: 48 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="h-1 bg-[#2563EB] rounded-full mx-auto" 
          />
        </div>

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.08 }}
                whileHover={{ y: -5 }}
                className="group relative rounded-2xl bg-white border border-[#E2E8F0] p-8 transition-all duration-300 shadow-md shadow-slate-100/40 hover:border-slate-300"
              >
                {/* Background Hover Glow */}
                <div className={`absolute inset-0 rounded-2xl transition-all duration-300 pointer-events-none opacity-0 group-hover:opacity-100 ${card.glowColor}`} />
                <div className={`absolute inset-0 rounded-2xl border border-transparent transition-all duration-300 pointer-events-none ${card.borderColor}`} />
                
                {/* Icon Container */}
                <div className={`p-3 border rounded-xl w-fit mb-6 transition-transform duration-500 group-hover:scale-105 ${card.iconColor}`}>
                  <Icon className="h-6 w-6" />
                </div>

                {/* Content */}
                <h3 className="text-[#0F172A] font-bold text-lg mb-3 tracking-tight group-hover:text-[#2563EB] transition-colors duration-300">
                  {card.title}
                </h3>
                <p className="text-[#64748B] text-xs sm:text-sm leading-relaxed font-light">
                  {card.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
