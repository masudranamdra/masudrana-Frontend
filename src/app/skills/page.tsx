'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import API from '../../lib/api';
import { Skill } from '../../types';

const colorThemes: any = {
  blue: {
    gradient: 'from-blue-500 to-cyan-400',
    bgLight: 'bg-blue-50',
    bgDark: 'dark:bg-blue-900/20',
    borderLight: 'border-blue-100',
    borderDark: 'dark:border-blue-800/30',
    textColor: 'text-blue-600 dark:text-blue-400',
  },
  purple: {
    gradient: 'from-purple-500 to-pink-400',
    bgLight: 'bg-purple-50',
    bgDark: 'dark:bg-purple-900/20',
    borderLight: 'border-purple-100',
    borderDark: 'dark:border-purple-800/30',
    textColor: 'text-purple-600 dark:text-purple-400',
  },
  emerald: {
    gradient: 'from-emerald-500 to-teal-400',
    bgLight: 'bg-emerald-50',
    bgDark: 'dark:bg-emerald-900/20',
    borderLight: 'border-emerald-100',
    borderDark: 'dark:border-emerald-800/30',
    textColor: 'text-emerald-600 dark:text-emerald-400',
  },
  rose: {
    gradient: 'from-rose-500 to-orange-400',
    bgLight: 'bg-rose-50',
    bgDark: 'dark:bg-rose-900/20',
    borderLight: 'border-rose-100',
    borderDark: 'dark:border-rose-800/30',
    textColor: 'text-rose-600 dark:text-rose-400',
  },
  amber: {
    gradient: 'from-amber-500 to-orange-400',
    bgLight: 'bg-amber-50',
    bgDark: 'dark:bg-amber-900/20',
    borderLight: 'border-amber-100',
    borderDark: 'dark:border-amber-800/30',
    textColor: 'text-amber-600 dark:text-amber-400',
  }
};

export default function SkillsPage() {
  const [skillCategories, setSkillCategories] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await API.get('/skills');
        if (res.data && res.data.success) {
          setSkillCategories(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching skills:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FB] dark:bg-[#0F172A] text-[#0F172A] dark:text-white transition-colors duration-300">
      <Navbar />

      <main className="flex-grow pt-32 pb-24 relative overflow-hidden">
        {/* Background Decorative Blurs */}
        <div className="absolute top-0 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 dark:bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute top-1/2 right-0 translate-x-1/3 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 dark:bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {/* Page Title */}
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <motion.span 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-[#2563EB] dark:text-blue-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest font-mono border border-blue-100 dark:border-blue-800/50"
            >
              <LucideIcons.Terminal className="h-3.5 w-3.5" />
              Expertise Matrix
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-6xl font-extrabold text-[#0F172A] dark:text-white tracking-tight leading-tight"
            >
              Technical Skillset
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-slate-500 dark:text-slate-400 text-sm sm:text-base max-w-2xl mx-auto font-light leading-relaxed"
            >
              A deep dive into the technologies, tools, and platforms I leverage to build digital products. From scalable backend architectures to pixel-perfect UI designs.
            </motion.p>
          </div>

          {/* Loading state */}
          {loading ? (
            <div className="flex justify-center py-20">
              <LucideIcons.Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
            </div>
          ) : skillCategories.length === 0 ? (
            <div className="text-center py-20 text-slate-500 dark:text-slate-400">
              No skills data available yet. Please add them from the admin panel.
            </div>
          ) : (
            /* Categories Detailed Sections */
            <div className="space-y-16">
              {skillCategories.map((category, index) => {
                const CategoryIcon = (LucideIcons as any)[category.icon] || LucideIcons.Code2;
                const theme = colorThemes[category.colorTheme] || colorThemes.blue;
                
                return (
                  <motion.div
                    key={category._id}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="bg-white dark:bg-slate-900/60 backdrop-blur-md rounded-[2.5rem] p-8 sm:p-12 border border-[#E2E8F0] dark:border-slate-800/60 shadow-xl shadow-slate-200/40 dark:shadow-none overflow-hidden relative group"
                  >
                    {/* Subtle hover gradient background */}
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 bg-gradient-to-br ${theme.gradient} transition-opacity duration-700`} />

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
                      
                      {/* Left Column: Category Description */}
                      <div className="lg:col-span-5 space-y-6">
                        <div className="flex items-center gap-4">
                          <div className={`p-4 rounded-2xl ${theme.bgLight} ${theme.bgDark} ${theme.textColor} border ${theme.borderLight} ${theme.borderDark}`}>
                            <CategoryIcon className="h-8 w-8" />
                          </div>
                          <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
                            {category.title}
                          </h2>
                        </div>
                        
                        <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-light">
                          {category.description}
                        </p>

                        <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                          <h4 className="text-[10px] uppercase font-bold tracking-widest font-mono text-slate-400">Core Competencies</h4>
                          <div className="flex flex-wrap gap-2">
                            {category.coreCompetencies?.map((skill, sIdx) => {
                              const SkillIcon = (LucideIcons as any)[skill.icon] || LucideIcons.Check;
                              return (
                                <div key={sIdx} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300">
                                  <SkillIcon className="h-3.5 w-3.5" />
                                  <span>{skill.name}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Right Column: Tools & Progress */}
                      <div className="lg:col-span-7 flex flex-col justify-center">
                        <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 space-y-6">
                          <h4 className="text-[10px] uppercase font-bold tracking-widest font-mono text-slate-400 mb-2">Tools & Technologies Mastery</h4>
                          
                          {category.tools?.map((tool, tIdx) => {
                            const ToolIcon = (LucideIcons as any)[tool.icon] || LucideIcons.Wrench;
                            return (
                              <div key={tIdx} className="space-y-2">
                                <div className="flex justify-between items-center text-sm font-bold">
                                  <div className="flex items-center space-x-3 text-slate-700 dark:text-slate-200">
                                    <div className={`p-1.5 rounded-md bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 ${tool.color}`}>
                                      <ToolIcon className="h-4 w-4" />
                                    </div>
                                    <span>{tool.name}</span>
                                  </div>
                                  <span className="text-slate-500 font-mono text-xs">{tool.level}%</span>
                                </div>
                                <div className="h-2.5 w-full bg-slate-200/60 dark:bg-slate-900 rounded-full overflow-hidden border border-slate-300/30 dark:border-black/50 shadow-inner">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${tool.level}%` }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1.2, delay: 0.2 + (tIdx * 0.1), ease: "easeOut" }}
                                    className={`h-full bg-gradient-to-r ${theme.gradient} rounded-full`}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
