'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 100, damping: 15 }
  }
};

export const SkillsSection: React.FC = () => {
  const [skillCategories, setSkillCategories] = useState<Skill[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Skill | null>(null);
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

  if (loading) {
    return (
      <section className="py-32 bg-[#F5F7FB] dark:bg-[#0F172A] flex justify-center">
        <LucideIcons.Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
      </section>
    );
  }

  // Get selected category theme for modal
  const selectedTheme = selectedCategory ? (colorThemes[selectedCategory.colorTheme] || colorThemes.blue) : colorThemes.blue;
  const SelectedIcon = selectedCategory ? (LucideIcons as any)[selectedCategory.icon] || LucideIcons.Code2 : LucideIcons.Code2;

  return (
    <section id="skills" className="relative py-32 bg-[#F5F7FB] dark:bg-[#0F172A] text-[#0F172A] dark:text-white overflow-hidden border-t border-b border-[#E2E8F0] dark:border-slate-800 transition-colors duration-300">
      
      {/* Decorative Blur Spheres */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 dark:bg-blue-600/10 rounded-full blur-[120px] pointer-events-none transition-colors duration-300" />
      <div className="absolute bottom-0 right-1/4 translate-x-1/2 translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 dark:bg-purple-600/10 rounded-full blur-[120px] pointer-events-none transition-colors duration-300" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <motion.span 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-[#2563EB] dark:text-blue-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest font-mono border border-blue-100 dark:border-blue-800/50"
          >
            <LucideIcons.Terminal className="h-3.5 w-3.5" />
            My Expertise
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-extrabold text-[#0F172A] dark:text-white tracking-tight leading-tight"
          >
            Technical Skillset
          </motion.h2>
          <p className="text-slate-500 dark:text-slate-400 font-light text-sm">Click on any category to view the specialized tools I use.</p>
          <motion.div 
            initial={{ opacity: 0, width: 0 }}
            whileInView={{ opacity: 1, width: 64 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="h-1.5 bg-gradient-to-r from-[#2563EB] to-purple-500 rounded-full mx-auto mt-4"
          />
        </div>

        {/* Skills Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {skillCategories.map((category) => {
            const CategoryIcon = (LucideIcons as any)[category.icon] || LucideIcons.Code2;
            const theme = colorThemes[category.colorTheme] || colorThemes.blue;
            
            return (
              <motion.div
                key={category._id}
                variants={itemVariants}
                onClick={() => setSelectedCategory(category)}
                className={`group cursor-pointer relative flex flex-col p-8 rounded-3xl bg-white dark:bg-slate-900/50 border border-[#E2E8F0] dark:border-slate-800/60 shadow-xl shadow-slate-200/40 dark:shadow-none hover:shadow-2xl hover:shadow-slate-300/40 dark:hover:shadow-blue-900/20 backdrop-blur-sm transition-all duration-500 overflow-hidden hover:-translate-y-2`}
              >
                {/* Gradient Hover Effect overlay */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 bg-gradient-to-br ${theme.gradient} transition-opacity duration-500`} />
                
                {/* Category Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className={`p-4 rounded-2xl ${theme.bgLight} ${theme.bgDark} ${theme.textColor} border ${theme.borderLight} ${theme.borderDark} group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}>
                      <CategoryIcon className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white leading-tight">
                      {category.title}
                    </h3>
                  </div>
                  <div className={`p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-slate-50 dark:bg-slate-800 text-slate-400`}>
                    <LucideIcons.ArrowRight className="h-4 w-4" />
                  </div>
                </div>

                {/* Sub-skills list */}
                <div className="flex-1 space-y-4">
                  {category.coreCompetencies?.map((skill, idx) => {
                    const SkillIcon = (LucideIcons as any)[skill.icon] || LucideIcons.Check;
                    return (
                      <div 
                        key={idx} 
                        className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <div className={`mt-0.5 p-1.5 rounded-lg ${theme.bgLight} ${theme.bgDark} ${theme.textColor}`}>
                          <SkillIcon className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">
                            {skill.name}
                          </h4>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Decorative bottom line */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${theme.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Modal Popup for Tools */}
        <AnimatePresence>
          {selectedCategory && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-900/80 backdrop-blur-sm"
              onClick={() => setSelectedCategory(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 relative"
              >
                {/* Modal Header */}
                <div className={`p-8 bg-gradient-to-br ${selectedTheme.gradient} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/10 dark:bg-black/20" />
                  <div className="relative z-10 flex items-start justify-between">
                    <div className="flex items-center gap-4 text-white">
                      <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                        <SelectedIcon className="h-8 w-8" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold">{selectedCategory.title}</h3>
                        <p className="text-white/80 text-sm mt-1">Tools & Technologies Mastery</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setSelectedCategory(null)}
                      className="p-2 bg-black/10 hover:bg-black/20 rounded-full text-white transition-colors"
                    >
                      <LucideIcons.X className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Tools List */}
                <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                  {selectedCategory.tools?.map((tool, idx) => {
                    const ToolIcon = (LucideIcons as any)[tool.icon] || LucideIcons.Wrench;
                    return (
                      <div key={idx} className="group">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-xl bg-slate-100 dark:bg-slate-800 ${tool.color}`}>
                              <ToolIcon className="h-5 w-5" />
                            </div>
                            <span className="font-bold text-slate-800 dark:text-white text-sm">{tool.name}</span>
                          </div>
                          <span className="text-xs font-mono font-bold text-slate-500">{tool.level}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${tool.level}%` }}
                            transition={{ duration: 1, delay: 0.1 * idx, ease: "easeOut" }}
                            className={`h-full bg-gradient-to-r ${selectedTheme.gradient} rounded-full`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Link to dedicated skills subpage */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="flex justify-center pt-16"
        >
          <Link
            href="/skills"
            className="group inline-flex items-center space-x-2 px-8 py-4 rounded-2xl font-bold bg-white dark:bg-slate-800 text-[#2563EB] dark:text-blue-400 border border-[#E2E8F0] dark:border-slate-700 hover:bg-[#2563EB] hover:text-white dark:hover:bg-blue-600 dark:hover:text-white hover:border-transparent transition-all duration-300 shadow-lg shadow-slate-200/50 dark:shadow-none"
          >
            <span>Explore All Skills</span>
            <LucideIcons.ArrowRight className="h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

      </div>
    </section>
  );
};
