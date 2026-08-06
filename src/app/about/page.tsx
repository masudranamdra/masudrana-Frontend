'use client';

import React, { useState } from 'react';
import { useAbout } from '../../context/AboutContext';
import { useConfig } from '../../context/ConfigContext';
import { useAuth } from '../../context/AuthContext';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronDown, X, Lock } from 'lucide-react';
import Link from 'next/link';

interface CardModalData {
  content: React.ReactNode;
}

export default function AboutJourneyPage() {
  const { about, loading } = useAbout();
  const { config } = useConfig();
  const { isAuthenticated } = useAuth();

  // Modals state
  const [activeModalContent, setActiveModalContent] = useState<React.ReactNode | null>(null);
  const [selectedGalleryItem, setSelectedGalleryItem] = useState<any | null>(null);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [activeGalleryTab, setActiveGalleryTab] = useState<string>('all');

  // Fallback default content
  const defaultJourney = `From writing my first line of code to architecting complex scalable web applications, my journey has been fueled by an insatiable curiosity and a passion for solving real-world problems. 

I started as a self-taught developer tinkering with basic HTML/CSS, and quickly fell in love with the power of modern JavaScript & TypeScript ecosystems. Over the years, I've focused on building modular components, optimizing rendering performance, and implementing pixel-perfect user interfaces with robust backend systems.`;

  const defaultLifestyle = `When I'm not glued to my IDE debugging complex logic, you'll find me exploring the great outdoors, capturing moments through my camera lens, and discovering local coffee spots. 

I strongly believe that a healthy work-life balance and continuous personal discovery are the foundations of sustained technical creativity and engineering excellence.`;

  const defaultCoreValues = [
    "Clean Code: Writing readable, maintainable, and self-documenting code.",
    "Performance First: Ensuring fast load times and smooth rendering profiles.",
    "Accessibility (a11y): Crafting digital interfaces that everyone can navigate.",
    "User Centricity: Designing intuitive flows and pixel-perfect responsive layouts.",
    "Continuous Evolution: Constantly adapting to new standards and frameworks.",
    "Modular Architecture: Breaking down complex challenges into decoupled systems."
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F7FB] dark:bg-[#0F172A] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!about) {
    return (
      <div className="min-h-screen bg-[#F5F7FB] dark:bg-[#0F172A] flex flex-col items-center justify-center text-center p-4">
        <h2 className="text-xl font-bold mb-2">No Profile Data Found</h2>
        <Link href="/" className="text-blue-500 hover:underline">Back to Home</Link>
      </div>
    );
  }

  const name = about.basic?.fullName || "Masud Rana";
  const title = about.basic?.tagline || "Full Stack Developer & Architect";
  const introduction = about.basic?.shortBio || about.basic?.mission || "Specializing in modern full-stack web applications, type-safe APIs, and responsive SaaS user interfaces.";
  const professionalSummary = about.professional?.professionalSummary || "Experienced software engineer dedicated to crafting clean, high-performance web applications and modular digital systems.";
  const whoIAm = about.professional?.whoIAm || "A forward-thinking software developer driven by architectural elegance, intuitive UI design, and robust API development.";
  const philosophy = about.professional?.philosophy || "Simple, well-tested code is better than clever, complex code. Prioritizing maintainability, security, and developer ergonomics.";

  // @ts-ignore
  const coreValues = about.professional?.coreValues?.length ? about.professional.coreValues : defaultCoreValues;
  const journeyText = about.basic?.shortBio || defaultJourney;
  const lifestyleText = about.lifestyle?.lifestyleText || defaultLifestyle;

  // Filter personal gallery items
  const galleryItems = about.gallery || [];
  const galleryCategories = ['all', ...Array.from(new Set(galleryItems.map((item: any) => item.category || 'Personal')))];
  
  const filteredGallery = galleryItems.filter((item: any) => {
    if (item.isProtected && !isAuthenticated) return false;
    if (activeGalleryTab === 'all') return true;
    return item.category?.toLowerCase() === activeGalleryTab.toLowerCase();
  });

  return (
    <div className="min-h-screen bg-[#F5F7FB] dark:bg-[#0F172A] text-[#0F172A] dark:text-slate-100 transition-colors duration-300 flex flex-col font-sans" suppressHydrationWarning>
      <Navbar />

      <main className="flex-grow pt-28 pb-24 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">

          {/* Top Bar Navigation */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <Link
              href="/"
              className="inline-flex items-center space-x-2 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group bg-white/70 dark:bg-slate-900/70 border border-slate-200/60 dark:border-slate-800/60 px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider font-mono cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              <span>Back to Home</span>
            </Link>

            {about.basic?.availability && (
              <span className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 dark:bg-emerald-900/30 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{about.basic.availability}</span>
              </span>
            )}
          </div>

          {/* Executive Identity & Overview */}
          <section className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md rounded-3xl p-8 sm:p-12 border border-slate-200/50 dark:border-slate-800/50 shadow-sm relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              
              {/* Profile Photo */}
              <div className="lg:col-span-4 flex justify-center">
                <div className="relative rounded-2xl overflow-hidden shadow-md border border-slate-200 dark:border-slate-800 max-w-[280px] w-full aspect-square bg-slate-100 dark:bg-slate-800">
                  <img
                    src={about.basic?.profileImage?.url || about.basic?.coverImage?.url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60'}
                    alt={name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Personal Identity */}
              <div className="lg:col-span-8 space-y-5">
                <div className="space-y-1">
                  <span className="text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400 font-mono">
                    Overview
                  </span>
                  <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
                    {name}
                  </h1>
                  <p className="text-base sm:text-lg font-bold text-blue-600 dark:text-blue-400">
                    {title}
                  </p>
                </div>

                <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 font-light">
                  {introduction}
                </p>

                {/* Location & Contact Meta */}
                <div className="flex flex-wrap items-center gap-6 text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium pt-1">
                  {about.basic?.contactEmail && <span>{about.basic.contactEmail}</span>}
                  {about.basic?.location && <span>• {about.basic.location}</span>}
                </div>

                {/* Formal Action Buttons (Logo-free) */}
                <div className="pt-3 flex flex-wrap items-center gap-4">
                  <button
                    onClick={() => setIsResumeModalOpen(true)}
                    className="px-7 py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 transition-all text-xs cursor-pointer shadow-sm"
                  >
                    <span>Resume</span>
                  </button>

                  <a
                    href="#personal-gallery"
                    className="px-6 py-3 rounded-xl font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-all text-xs border border-slate-200 dark:border-slate-700"
                  >
                    <span>Personal Gallery</span>
                  </a>
                </div>
              </div>

            </div>
          </section>

          {/* Cards Section: Blended seamlessly with background */}
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                Profile & Professional Details
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Click <span className="font-semibold text-blue-500">"See More"</span> on any topic to read full content.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              {/* CARD 1: Professional Summary */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 dark:border-slate-800/50 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300"
              >
                <div className="space-y-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-blue-500">
                    Summary
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Professional Summary & Mindset
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                    {professionalSummary}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200/40 dark:border-slate-800/40 mt-5">
                  <button
                    onClick={() => setActiveModalContent(
                      <div className="space-y-6 text-slate-800 dark:text-slate-200">
                        <div>
                          <h4 className="text-xs font-bold uppercase font-mono tracking-wider text-blue-500 mb-2">
                            Professional Summary
                          </h4>
                          <p className="text-sm sm:text-base leading-relaxed p-5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 font-light">
                            {professionalSummary}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-xs font-bold uppercase font-mono tracking-wider text-blue-500 mb-2">
                            Developer Mindset
                          </h4>
                          <p className="text-sm sm:text-base leading-relaxed p-5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 font-light">
                            {whoIAm}
                          </p>
                        </div>
                      </div>
                    )}
                    className="w-full py-2.5 px-4 rounded-lg bg-blue-500/10 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 font-bold text-xs hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 transition-all cursor-pointer text-center"
                  >
                    <span>See More</span>
                  </button>
                </div>
              </motion.div>

              {/* CARD 2: Development Philosophy */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 dark:border-slate-800/50 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300"
              >
                <div className="space-y-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-indigo-500">
                    Philosophy
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Development Philosophy
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                    {philosophy}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200/40 dark:border-slate-800/40 mt-5">
                  <button
                    onClick={() => setActiveModalContent(
                      <div className="space-y-4 text-slate-800 dark:text-slate-200">
                        <h4 className="text-xs font-bold uppercase font-mono tracking-wider text-indigo-500 mb-2">
                          Development Philosophy
                        </h4>
                        <p className="text-sm sm:text-base leading-relaxed p-5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 font-light">
                          {philosophy}
                        </p>
                      </div>
                    )}
                    className="w-full py-2.5 px-4 rounded-lg bg-indigo-500/10 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 font-bold text-xs hover:bg-indigo-600 hover:text-white transition-all cursor-pointer text-center"
                  >
                    <span>See More</span>
                  </button>
                </div>
              </motion.div>

              {/* CARD 3: Core Values */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 dark:border-slate-800/50 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300"
              >
                <div className="space-y-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-amber-500">
                    Values
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Core Principles & Values
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                    {coreValues.slice(0, 2).join(' • ')}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200/40 dark:border-slate-800/40 mt-5">
                  <button
                    onClick={() => setActiveModalContent(
                      <div className="space-y-4 text-slate-800 dark:text-slate-200">
                        <h4 className="text-xs font-bold uppercase font-mono tracking-wider text-amber-500 mb-2">
                          Core Principles & Standards
                        </h4>
                        <div className="space-y-3">
                          {coreValues.map((val: string, idx: number) => (
                            <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-medium">
                              {val}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    className="w-full py-2.5 px-4 rounded-lg bg-amber-500/10 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 font-bold text-xs hover:bg-amber-600 hover:text-white transition-all cursor-pointer text-center"
                  >
                    <span>See More</span>
                  </button>
                </div>
              </motion.div>

              {/* CARD 4: Professional Journey */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 dark:border-slate-800/50 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300"
              >
                <div className="space-y-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-emerald-500">
                    Journey
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Professional Journey
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                    {journeyText}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200/40 dark:border-slate-800/40 mt-5">
                  <button
                    onClick={() => setActiveModalContent(
                      <div className="space-y-6 text-slate-800 dark:text-slate-200">
                        <div>
                          <h4 className="text-xs font-bold uppercase font-mono tracking-wider text-emerald-500 mb-2">
                            Professional Journey
                          </h4>
                          <p className="text-sm sm:text-base leading-relaxed p-5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 font-light whitespace-pre-wrap">
                            {journeyText}
                          </p>
                        </div>
                        {about.timelines && about.timelines.length > 0 && (
                          <div className="space-y-3">
                            <h5 className="text-xs font-bold uppercase font-mono tracking-wider text-emerald-500">Milestones</h5>
                            <div className="space-y-3">
                              {about.timelines.map((t: any, idx: number) => (
                                <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                                  <div className="flex justify-between text-xs font-mono text-slate-400">
                                    <span className="font-bold text-slate-800 dark:text-slate-200">{t.title}</span>
                                    <span>{t.date}</span>
                                  </div>
                                  <p className="text-xs text-slate-600 dark:text-slate-400">{t.description}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    className="w-full py-2.5 px-4 rounded-lg bg-emerald-500/10 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 font-bold text-xs hover:bg-emerald-600 hover:text-white transition-all cursor-pointer text-center"
                  >
                    <span>See More</span>
                  </button>
                </div>
              </motion.div>

              {/* CARD 5: Beyond Coding */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 dark:border-slate-800/50 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 md:col-span-2"
              >
                <div className="space-y-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-purple-500">
                    Personal
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Beyond Coding & Life
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                    {lifestyleText}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200/40 dark:border-slate-800/40 mt-5">
                  <button
                    onClick={() => setActiveModalContent(
                      <div className="space-y-4 text-slate-800 dark:text-slate-200">
                        <h4 className="text-xs font-bold uppercase font-mono tracking-wider text-purple-500 mb-2">
                          Beyond Coding & Personal Life
                        </h4>
                        <p className="text-sm sm:text-base leading-relaxed p-5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 font-light whitespace-pre-wrap">
                          {lifestyleText}
                        </p>
                      </div>
                    )}
                    className="w-full py-2.5 px-4 rounded-lg bg-purple-500/10 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 font-bold text-xs hover:bg-purple-600 hover:text-white transition-all cursor-pointer text-center"
                  >
                    <span>See More</span>
                  </button>
                </div>
              </motion.div>

            </div>
          </div>

          {/* EXCLUSIVE PERSONAL & LIFESTYLE GALLERY */}
          <section id="personal-gallery" className="pt-8 border-t border-slate-200/60 dark:border-slate-800/60 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-widest font-mono text-indigo-500">
                  Personal Vault
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  Personal & Lifestyle Gallery
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Exclusive personal moments and setups. Managed directly from Admin Panel with Privacy Control.
                </p>
              </div>

              {/* Category Filters */}
              {galleryCategories.length > 1 && (
                <div className="flex items-center gap-2 flex-wrap bg-white/50 dark:bg-slate-900/50 p-1.5 rounded-xl border border-slate-200/50 dark:border-slate-800/50">
                  {galleryCategories.map((cat: string) => (
                    <button
                      key={cat}
                      onClick={() => setActiveGalleryTab(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                        activeGalleryTab.toLowerCase() === cat.toLowerCase()
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredGallery.map((item: any, idx: number) => {
                const imgUrl = typeof item === 'string' ? item : item.url || item.image?.url;
                const caption = typeof item === 'object' ? item.caption || item.title : `Photo ${idx + 1}`;
                const category = typeof item === 'object' ? item.category : 'Personal';
                const isProtected = typeof item === 'object' ? item.isProtected : false;

                return (
                  <motion.div
                    key={item._id || idx}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    onClick={() => setSelectedGalleryItem({ url: imgUrl, caption, category, isProtected })}
                    className="relative group aspect-square rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 shadow-sm hover:border-blue-500 transition-all duration-300 cursor-pointer"
                  >
                    <img
                      src={imgUrl}
                      alt={caption}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                      <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-wider">{category}</span>
                      <p className="text-white text-xs font-bold truncate">{caption}</p>
                    </div>

                    {isProtected && (
                      <div className="absolute top-3 right-3 p-1.5 bg-amber-500/90 text-white rounded-md text-[10px] font-bold flex items-center space-x-1 shadow-sm">
                        <Lock className="h-3 w-3" />
                        <span>Private</span>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {filteredGallery.length === 0 && (
              <div className="text-center p-10 bg-white/40 dark:bg-slate-900/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                <p className="text-xs text-slate-500">No images in this category.</p>
              </div>
            )}
          </section>

          {/* Frequently Asked Questions */}
          {about.faqs && about.faqs.length > 0 && (
            <section className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm p-8 sm:p-10 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 space-y-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-200/50 dark:border-slate-800/50 pb-4">
                Frequently Asked Questions
              </h3>

              <div className="space-y-3">
                {about.faqs.map((faq: any, idx: number) => {
                  const isOpen = openFaq === (faq._id || idx.toString());
                  return (
                    <div key={faq._id || idx} className="border border-slate-200/60 dark:border-slate-800/60 rounded-xl overflow-hidden bg-slate-50/50 dark:bg-slate-950/50">
                      <button
                        onClick={() => setOpenFaq(isOpen ? null : (faq._id || idx.toString()))}
                        className="flex items-center justify-between w-full p-4 text-left transition-colors hover:bg-slate-100/50 dark:hover:bg-slate-900/50"
                      >
                        <span className="font-bold text-slate-900 dark:text-white pr-4 text-xs sm:text-sm">{faq.question}</span>
                        <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180 text-blue-500' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="p-4 pt-0 text-slate-600 dark:text-slate-300 text-xs leading-relaxed border-t border-slate-200/40 dark:border-slate-800/40 mt-1 pt-3">
                              {faq.answer}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Formal Contact CTA */}
          {/* <section className="bg-slate-900 text-white p-8 sm:p-12 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="text-2xl font-bold tracking-tight">Let's Connect & Collaborate</h3>
              <p className="text-xs text-slate-400 max-w-xl font-light">
                Open to engineering projects, architectural discussions, or consulting opportunities.
              </p>
            </div>

            <Link
              href="/#contact"
              className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-md transition-all text-xs cursor-pointer whitespace-nowrap"
            >
              <span>Get In Touch</span>
            </Link>
          </section> */}

        </div>
      </main>

      {/* --- PURE CONTENT POP-UP MODAL (Logo-free, Content Focused) --- */}
      <AnimatePresence>
        {activeModalContent && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 bg-slate-950/75 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl relative border border-slate-200 dark:border-slate-800 space-y-6 max-h-[85vh] flex flex-col"
            >
              {/* Simple Close Bar */}
              <div className="flex justify-end border-b border-slate-200/50 dark:border-slate-800/50 pb-3">
                <button
                  onClick={() => setActiveModalContent(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-full transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Specific Detailed Content Only */}
              <div className="flex-grow overflow-y-auto pr-2">
                {activeModalContent}
              </div>

              {/* Footer Close Button */}
              <div className="pt-3 border-t border-slate-200/50 dark:border-slate-800/50 flex justify-end">
                <button
                  onClick={() => setActiveModalContent(null)}
                  className="px-6 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  <span>Close</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- LIGHTBOX MODAL FOR GALLERY --- */}
      <AnimatePresence>
        {selectedGalleryItem && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-4xl w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-800"
            >
              <button
                onClick={() => setSelectedGalleryItem(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-black/60 text-white rounded-full hover:bg-black transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="aspect-video bg-black flex items-center justify-center overflow-hidden">
                <img
                  src={selectedGalleryItem.url}
                  alt={selectedGalleryItem.caption}
                  className="max-h-[75vh] w-auto object-contain"
                />
              </div>

              <div className="p-5 bg-slate-900 flex items-center justify-between text-white border-t border-slate-800 text-xs">
                <div>
                  <span className="font-mono text-indigo-400 font-bold uppercase">{selectedGalleryItem.category}</span>
                  <p className="font-bold mt-0.5">{selectedGalleryItem.caption}</p>
                </div>
                <a
                  href={selectedGalleryItem.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-500 transition-colors"
                >
                  Full View
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- RESUME MODAL --- */}
      <AnimatePresence>
        {isResumeModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-4xl w-full shadow-2xl relative border border-slate-200 dark:border-slate-800 space-y-5 max-h-[90vh] flex flex-col"
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Curriculum Vitae / Resume</h3>
                <button
                  onClick={() => setIsResumeModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-full transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex-grow overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 min-h-[350px] sm:min-h-[480px] flex items-center justify-center">
                {about.basic?.resumeUrl ? (
                  <iframe
                    src={about.basic.resumeUrl}
                    className="w-full h-full min-h-[380px] sm:min-h-[500px] rounded-xl"
                    title={`${name} Resume`}
                  />
                ) : (
                  <div className="text-center p-8 space-y-2">
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">No Resume Uploaded Yet</p>
                    <p className="text-xs text-slate-500">Log into Admin Panel &gt; About Basic to attach your resume URL/PDF.</p>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
                <p className="text-xs text-slate-500 dark:text-slate-400">Official document preview.</p>

                {about.basic?.resumeUrl && (
                  <div className="flex items-center space-x-3">
                    <a
                      href={about.basic.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2 rounded-xl font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs"
                    >
                      Fullscreen View
                    </a>

                    <a
                      href={about.basic.resumeUrl}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-2 rounded-xl font-bold bg-blue-600 text-white shadow-sm text-xs"
                    >
                      Download Resume
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
