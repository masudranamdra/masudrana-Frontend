'use client';

import React, { useState } from 'react';
import { useAbout } from '../../context/AboutContext';
import { useConfig } from '../../context/ConfigContext';
import { useAuth } from '../../context/AuthContext';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, BookOpen, Coffee, Camera, ShieldCheck, Cpu, 
  Lightbulb, Send, CheckCircle2, Calendar, MapPin, 
  MessageCircleQuestion, ChevronDown, Eye, FileDown, X, 
  Lock, Sparkles, ExternalLink, UserCheck, Maximize2, Compass
} from 'lucide-react';
import { FaGithub, FaLinkedin, FaTwitter, FaFacebook, FaYoutube, FaInstagram, FaGlobe } from 'react-icons/fa';
import { SiMedium } from 'react-icons/si';
import Link from 'next/link';

interface CardModalData {
  title: string;
  category: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

export default function AboutJourneyPage() {
  const { about, loading } = useAbout();
  const { config } = useConfig();
  const { isAuthenticated } = useAuth();

  // Modals state
  const [activeModalCard, setActiveModalCard] = useState<CardModalData | null>(null);
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
      <div className="min-h-screen bg-[#F5F7FB] dark:bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB]"></div>
      </div>
    );
  }

  if (!about) {
    return (
      <div className="min-h-screen bg-[#F5F7FB] dark:bg-slate-950 flex flex-col items-center justify-center text-center p-4">
        <h2 className="text-2xl font-bold mb-2">No Profile Data Found</h2>
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
    // If protected and user not logged in, exclude or mark
    if (item.isProtected && !isAuthenticated) return false;
    if (activeGalleryTab === 'all') return true;
    return item.category?.toLowerCase() === activeGalleryTab.toLowerCase();
  });

  return (
    <div className="min-h-screen bg-[#F5F7FB] dark:bg-[#090D16] text-[#0F172A] dark:text-slate-100 transition-colors duration-300 flex flex-col font-sans" suppressHydrationWarning>
      <Navbar />

      <main className="flex-grow pt-28 pb-24 relative overflow-hidden">
        {/* Background ambient lighting */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/3 right-10 w-[450px] h-[450px] bg-indigo-500/10 dark:bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">

          {/* Top Bar: Back link & Title */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <Link
              href="/"
              className="inline-flex items-center space-x-2 text-[#64748B] dark:text-slate-400 hover:text-[#2563EB] dark:hover:text-blue-400 transition-colors group bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 px-4 py-2 rounded-xl shadow-sm w-fit cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              <span className="font-semibold text-xs uppercase tracking-wider font-mono">Back to Home</span>
            </Link>

            <div className="flex items-center space-x-3">
              {about.basic?.availability && (
                <span className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 dark:bg-emerald-900/30 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{about.basic.availability}</span>
                </span>
              )}
            </div>
          </div>

          {/* Section 1: Formal Executive Header Card */}
          <section className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              
              {/* Profile Image Column */}
              <div className="lg:col-span-4 flex justify-center">
                <div className="relative group rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-100 dark:border-slate-800 max-w-[320px] w-full aspect-square bg-slate-100 dark:bg-slate-800">
                  <img
                    src={about.basic?.profileImage?.url || about.basic?.coverImage?.url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60'}
                    alt={name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60" />
                </div>
              </div>

              {/* Identity & Bio Column */}
              <div className="lg:col-span-8 space-y-6">
                <div className="space-y-2">
                  <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 dark:text-blue-400 font-mono">
                    Professional Overview & Identity
                  </span>
                  <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
                    {name}
                  </h1>
                  <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {title}
                  </p>
                </div>

                <p className="text-base sm:text-lg leading-relaxed text-slate-600 dark:text-slate-300 font-light">
                  {introduction}
                </p>

                {/* Location & Contact Meta */}
                <div className="flex flex-wrap items-center gap-6 pt-2 text-sm text-slate-600 dark:text-slate-400 font-medium">
                  {about.basic?.contactEmail && (
                    <div className="flex items-center space-x-2">
                      <Send className="h-4 w-4 text-blue-500" />
                      <span>{about.basic.contactEmail}</span>
                    </div>
                  )}
                  {about.basic?.location && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-blue-500" />
                      <span>{about.basic.location}</span>
                    </div>
                  )}
                </div>

                {/* Primary Actions */}
                <div className="pt-4 flex flex-wrap items-center gap-4">
                  <button
                    onClick={() => setIsResumeModalOpen(true)}
                    className="inline-flex items-center space-x-2.5 px-6 py-3.5 rounded-2xl font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/25 dark:shadow-blue-900/40 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer border border-blue-400/30"
                  >
                    <FileDown className="h-4 w-4" />
                    <span>View / Download Resume</span>
                  </button>

                  <a
                    href="#personal-gallery"
                    className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-2xl font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white transition-all border border-slate-200 dark:border-slate-700"
                  >
                    <Camera className="h-4 w-4 text-indigo-500" />
                    <span>Personal Gallery</span>
                  </a>
                </div>
              </div>

            </div>
          </section>

          {/* Section 2: Structured Truncated Cards with "See More" Modals */}
          <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Core Domains & Expertise
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Click <span className="font-semibold text-blue-500 font-mono">"See More"</span> on any card to explore complete details.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

              {/* CARD 1: Professional Summary & Mindset */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-7 border border-slate-200/80 dark:border-slate-800 shadow-lg shadow-slate-200/30 dark:shadow-none flex flex-col justify-between hover:border-blue-500/50 transition-all duration-300 group">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-3 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-2xl border border-blue-500/20">
                      <ShieldCheck className="h-6 w-6" />
                    </div>
                    <span className="text-[10px] font-extrabold uppercase font-mono tracking-wider px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                      Summary
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors">
                    Professional Summary & Mindset
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                    {professionalSummary}
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-100 dark:border-slate-800/80 mt-6">
                  <button
                    onClick={() => setActiveModalCard({
                      title: 'Professional Summary & Mindset',
                      category: 'Overview',
                      icon: <ShieldCheck className="h-6 w-6 text-blue-500" />,
                      content: (
                        <div className="space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                          <div>
                            <h4 className="text-xs font-extrabold uppercase tracking-wider font-mono text-blue-500 mb-2">
                              Executive Summary
                            </h4>
                            <p className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
                              {professionalSummary}
                            </p>
                          </div>
                          <div>
                            <h4 className="text-xs font-extrabold uppercase tracking-wider font-mono text-blue-500 mb-2">
                              Developer Mindset
                            </h4>
                            <p className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
                              {whoIAm}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                    className="w-full py-2.5 px-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold text-xs flex items-center justify-center space-x-2 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 transition-all cursor-pointer"
                  >
                    <span>See More</span>
                    <Sparkles className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* CARD 2: Development Philosophy */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-7 border border-slate-200/80 dark:border-slate-800 shadow-lg shadow-slate-200/30 dark:shadow-none flex flex-col justify-between hover:border-indigo-500/50 transition-all duration-300 group">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-3 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-2xl border border-indigo-500/20">
                      <Cpu className="h-6 w-6" />
                    </div>
                    <span className="text-[10px] font-extrabold uppercase font-mono tracking-wider px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                      Philosophy
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-500 transition-colors">
                    Development Philosophy
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                    {philosophy}
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-100 dark:border-slate-800/80 mt-6">
                  <button
                    onClick={() => setActiveModalCard({
                      title: 'Development Philosophy',
                      category: 'Engineering Standards',
                      icon: <Cpu className="h-6 w-6 text-indigo-500" />,
                      content: (
                        <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                          <p className="p-5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 text-base font-light">
                            {philosophy}
                          </p>
                        </div>
                      )
                    })}
                    className="w-full py-2.5 px-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center justify-center space-x-2 hover:bg-indigo-600 hover:text-white transition-all cursor-pointer"
                  >
                    <span>See More</span>
                    <Sparkles className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* CARD 3: Core Values */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-7 border border-slate-200/80 dark:border-slate-800 shadow-lg shadow-slate-200/30 dark:shadow-none flex flex-col justify-between hover:border-amber-500/50 transition-all duration-300 group">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-3 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-2xl border border-amber-500/20">
                      <Lightbulb className="h-6 w-6" />
                    </div>
                    <span className="text-[10px] font-extrabold uppercase font-mono tracking-wider px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                      Principles
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors">
                    Core Values & Quality
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                    {coreValues.slice(0, 2).join(' • ')}
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-100 dark:border-slate-800/80 mt-6">
                  <button
                    onClick={() => setActiveModalCard({
                      title: 'Core Values & Quality Standards',
                      category: 'Culture',
                      icon: <Lightbulb className="h-6 w-6 text-amber-500" />,
                      content: (
                        <div className="space-y-3">
                          {coreValues.map((val: string, idx: number) => (
                            <div key={idx} className="flex items-start space-x-3 p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
                              <CheckCircle2 className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                              <span className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200">{val}</span>
                            </div>
                          ))}
                        </div>
                      )
                    })}
                    className="w-full py-2.5 px-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 font-bold text-xs flex items-center justify-center space-x-2 hover:bg-amber-600 hover:text-white transition-all cursor-pointer"
                  >
                    <span>See More</span>
                    <Sparkles className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* CARD 4: Professional Journey */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-7 border border-slate-200/80 dark:border-slate-800 shadow-lg shadow-slate-200/30 dark:shadow-none flex flex-col justify-between hover:border-emerald-500/50 transition-all duration-300 group">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl border border-emerald-500/20">
                      <BookOpen className="h-6 w-6" />
                    </div>
                    <span className="text-[10px] font-extrabold uppercase font-mono tracking-wider px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                      Timeline
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors">
                    Professional Journey
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                    {journeyText}
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-100 dark:border-slate-800/80 mt-6">
                  <button
                    onClick={() => setActiveModalCard({
                      title: 'Professional Journey & Milestones',
                      category: 'History',
                      icon: <BookOpen className="h-6 w-6 text-emerald-500" />,
                      content: (
                        <div className="space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                          <p className="p-5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 font-light">
                            {journeyText}
                          </p>
                          {about.timelines && about.timelines.length > 0 && (
                            <div className="space-y-3 pt-2">
                              <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-emerald-500">Milestone History</h4>
                              <div className="space-y-3">
                                {about.timelines.map((t: any, idx: number) => (
                                  <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                                    <div className="flex justify-between text-xs font-mono text-slate-400 mb-1">
                                      <span>{t.title}</span>
                                      <span>{t.date}</span>
                                    </div>
                                    <p className="text-xs text-slate-600 dark:text-slate-300">{t.description}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center justify-center space-x-2 hover:bg-emerald-600 hover:text-white transition-all cursor-pointer"
                  >
                    <span>See More</span>
                    <Sparkles className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* CARD 5: Beyond Coding & Personal Life */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-7 border border-slate-200/80 dark:border-slate-800 shadow-lg shadow-slate-200/30 dark:shadow-none flex flex-col justify-between hover:border-purple-500/50 transition-all duration-300 group md:col-span-2 lg:col-span-2">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-3 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-2xl border border-purple-500/20">
                      <Coffee className="h-6 w-6" />
                    </div>
                    <span className="text-[10px] font-extrabold uppercase font-mono tracking-wider px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                      Personal Life
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-purple-500 transition-colors">
                    Beyond Coding & Interests
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                    {lifestyleText}
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-100 dark:border-slate-800/80 mt-6">
                  <button
                    onClick={() => setActiveModalCard({
                      title: 'Beyond Coding & Personal Life',
                      category: 'Lifestyle',
                      icon: <Coffee className="h-6 w-6 text-purple-500" />,
                      content: (
                        <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                          <p className="p-5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 font-light">
                            {lifestyleText}
                          </p>
                        </div>
                      )
                    })}
                    className="w-full py-2.5 px-4 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 font-bold text-xs flex items-center justify-center space-x-2 hover:bg-purple-600 hover:text-white transition-all cursor-pointer"
                  >
                    <span>See More</span>
                    <Sparkles className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* Section 3: EXCLUSIVE PERSONAL & LIFESTYLE GALLERY */}
          <section id="personal-gallery" className="pt-8 border-t border-slate-200/80 dark:border-slate-800 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 font-mono text-xs font-bold uppercase tracking-widest">
                  <Camera className="h-4 w-4" />
                  <span>Exclusive Personal Vault</span>
                </div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  Personal & Lifestyle Gallery
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl">
                  A formal collection of personal moments, travel, workspace setups, and events. Managed directly from the Admin Panel with Privacy Control.
                </p>
              </div>

              {/* Category Filter Tabs */}
              {galleryCategories.length > 1 && (
                <div className="flex items-center gap-2 flex-wrap bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
                  {galleryCategories.map((cat: string) => (
                    <button
                      key={cat}
                      onClick={() => setActiveGalleryTab(cat)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                        activeGalleryTab.toLowerCase() === cat.toLowerCase()
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
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
                    className="relative group aspect-square rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md hover:shadow-xl hover:border-indigo-500/50 transition-all duration-300 cursor-pointer"
                  >
                    <img
                      src={imgUrl}
                      alt={caption}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300 text-[10px] font-extrabold uppercase tracking-wider font-mono border border-indigo-500/30">
                          {category}
                        </span>
                        <Maximize2 className="h-4 w-4 text-white/80" />
                      </div>
                      <p className="text-white text-sm font-bold truncate">{caption}</p>
                    </div>

                    {isProtected && (
                      <div className="absolute top-3 right-3 p-1.5 bg-amber-500/90 text-white rounded-lg text-[10px] font-bold flex items-center space-x-1 shadow-sm">
                        <Lock className="h-3 w-3" />
                        <span>Private</span>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {filteredGallery.length === 0 && (
              <div className="text-center p-12 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 space-y-2">
                <Camera className="h-10 w-10 text-slate-400 mx-auto" />
                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">Gallery Empty</h4>
                <p className="text-xs text-slate-500">Log into Admin Panel &gt; Media Gallery to add personal photos.</p>
              </div>
            )}
          </section>

          {/* Section 4: Frequently Asked Questions */}
          {about.faqs && about.faqs.length > 0 && (
            <section className="bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
              <div className="flex items-center space-x-3 pb-4 border-b border-slate-200 dark:border-slate-800">
                <div className="p-3 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-2xl border border-rose-500/20">
                  <MessageCircleQuestion className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Frequently Asked Questions</h3>
              </div>

              <div className="space-y-4">
                {about.faqs.map((faq: any, idx: number) => {
                  const isOpen = openFaq === (faq._id || idx.toString());
                  return (
                    <div key={faq._id || idx} className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-950">
                      <button
                        onClick={() => setOpenFaq(isOpen ? null : (faq._id || idx.toString()))}
                        className="flex items-center justify-between w-full p-5 text-left transition-colors hover:bg-slate-100 dark:hover:bg-slate-900"
                      >
                        <span className="font-bold text-slate-900 dark:text-white pr-4 text-sm sm:text-base">{faq.question}</span>
                        <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180 text-blue-500' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="p-5 pt-0 text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed border-t border-slate-200 dark:border-slate-800 mt-2 pt-4">
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

          {/* Section 5: Collaboration CTA */}
          <section className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 p-8 sm:p-12 rounded-3xl shadow-2xl text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 text-center md:text-left">
              <h3 className="text-3xl font-black tracking-tight">Let's Create Something Remarkable</h3>
              <p className="text-sm text-blue-100 max-w-xl font-light leading-relaxed">
                Interested in working together or discussing potential project architecture? Get in touch today.
              </p>
            </div>

            <Link
              href="/#contact"
              className="px-8 py-4 bg-white text-blue-600 font-extrabold rounded-2xl shadow-xl hover:bg-slate-50 transition-all hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap"
            >
              Get In Touch
            </Link>
          </section>

        </div>
      </main>

      {/* --- CARD "SEE MORE" MODAL --- */}
      <AnimatePresence>
        {activeModalCard && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl relative border border-slate-200 dark:border-slate-800 space-y-6 max-h-[85vh] flex flex-col"
            >
              <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl">
                    {activeModalCard.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                      {activeModalCard.title}
                    </h3>
                    <span className="text-[10px] font-extrabold uppercase font-mono tracking-wider text-blue-500">
                      {activeModalCard.category}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveModalCard(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-full transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto pr-2 space-y-4">
                {activeModalCard.content}
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
                <button
                  onClick={() => setActiveModalCard(null)}
                  className="px-6 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Close Window
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- LIGHTBOX MODAL FOR PERSONAL GALLERY --- */}
      <AnimatePresence>
        {selectedGalleryItem && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800"
            >
              <button
                onClick={() => setSelectedGalleryItem(null)}
                className="absolute top-4 right-4 z-10 p-2.5 bg-black/60 text-white rounded-full hover:bg-black transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="aspect-video bg-black flex items-center justify-center overflow-hidden">
                <img
                  src={selectedGalleryItem.url}
                  alt={selectedGalleryItem.caption}
                  className="max-h-[75vh] w-auto object-contain"
                />
              </div>

              <div className="p-6 bg-slate-900 flex items-center justify-between text-white">
                <div>
                  <span className="text-[10px] font-extrabold uppercase font-mono text-indigo-400 tracking-wider">
                    {selectedGalleryItem.category}
                  </span>
                  <h4 className="text-base font-bold mt-0.5">{selectedGalleryItem.caption}</h4>
                </div>
                <a
                  href={selectedGalleryItem.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-500 transition-colors"
                >
                  View Full Image
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
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-4xl w-full shadow-2xl relative border border-slate-200 dark:border-slate-800 space-y-6 max-h-[90vh] flex flex-col"
            >
              <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-2xl border border-blue-500/20">
                    <FileDown className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Curriculum Vitae / Resume</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{name} • {title}</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsResumeModalOpen(false)}
                  className="p-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-full transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-grow overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 min-h-[350px] sm:min-h-[480px] flex items-center justify-center">
                {about.basic?.resumeUrl ? (
                  <iframe
                    src={about.basic.resumeUrl}
                    className="w-full h-full min-h-[380px] sm:min-h-[500px] rounded-2xl"
                    title={`${name} Resume`}
                  />
                ) : (
                  <div className="text-center p-8 space-y-3">
                    <FileDown className="h-10 w-10 text-amber-500 mx-auto" />
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">No Resume Uploaded Yet</h4>
                    <p className="text-xs text-slate-500">Log into Admin Panel &gt; About Basic to attach your resume URL/PDF.</p>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <p className="text-xs text-slate-500 dark:text-slate-400">Official document preview.</p>

                {about.basic?.resumeUrl && (
                  <div className="flex items-center space-x-3">
                    <a
                      href={about.basic.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 rounded-xl font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs"
                    >
                      Fullscreen View
                    </a>

                    <a
                      href={about.basic.resumeUrl}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-2.5 rounded-xl font-bold bg-blue-600 text-white shadow-lg text-xs"
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
