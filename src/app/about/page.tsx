'use client';

import React, { useState } from 'react';
import { useAbout } from '../../context/AboutContext';
import { useConfig } from '../../context/ConfigContext';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Coffee, Camera, Compass, ShieldCheck, Cpu, Lightbulb, Send, CheckCircle2, Calendar, MapPin, Play, ImageIcon, VideoIcon, MessageCircleQuestion, ChevronDown, Globe, Eye, FileDown, X } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { FaGithub, FaLinkedin, FaTwitter, FaFacebook, FaYoutube, FaInstagram, FaGlobe } from 'react-icons/fa';
import { SiMedium } from 'react-icons/si';
import Link from 'next/link';

export default function AboutJourneyPage() {
  const { about, loading } = useAbout();
  const { config } = useConfig();
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);

  // Placeholder data fallback if database fields are empty
  const defaultJourney = "From writing my first line of code to architecting complex scalable frontend applications, my journey has been fueled by an insatiable curiosity and a passion for solving real-world problems. I started as a self-taught developer tinkering with basic HTML/CSS, and quickly fell in love with the power of modern JS frameworks. Over the years, I've focused on building modular components, optimizing rendering performance, and implementing pixel-perfect designs.";

  const defaultLifestyle = "When I'm not glued to my IDE debugging complex logic, you'll find me exploring the great outdoors, capturing moments through my camera lens, and discovering the best local coffee shops. I believe that a healthy work-life balance is the key to sustained creativity and professional growth.";

  const defaultActivities = [
    "Tech Community Mentoring",
    "Open Source Contributions",
    "Photography & Traveling",
    "Fitness & Mindfulness"
  ];

  const defaultLifestyleImages = [
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1504593811423-6dd665756598?w=600&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&auto=format&fit=crop&q=60"
  ];

  const defaultCoreValues = [
    "Clean Code: Writing readable, maintainable, and self-documenting code.",
    "Performance: Ensuring fast load times and smooth rendering profiles.",
    "Accessibility (a11y): Crafting interfaces that everyone can use.",
    "User Experience: Designing intuitive flows and high-fidelity layouts.",
    "Continuous Learning: Always adapting to new standards and frameworks.",
    "Problem Solving: Breaking down complex challenges into modular solutions.",
    "Collaboration: Communicating clearly and supporting my team."
  ];

  const defaultCurrentFocus = [
    "React 19 & Next.js 16 App Router",
    "TypeScript & Type-Safe APIs",
    "Tailwind CSS v4 & Modern PostCSS styling",
    "Performance Profiling & Web Vitals"
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F7FB] dark:bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB]"></div>
      </div>
    );
  }

  if (!about) {
    return (
      <div className="min-h-screen bg-[#F5F7FB] dark:bg-slate-900 flex flex-col items-center justify-center text-center p-4">
        <h2 className="text-2xl font-bold mb-2">No Profile Data Found</h2>
        <Link href="/" className="text-blue-500 hover:underline">Back to Home</Link>
      </div>
    );
  }

  const name = about.basic?.fullName || "Masud Rana";
  const title = about.basic?.tagline || "Frontend Developer";
  const introduction = about.basic?.mission || "I specialize in developing high-performance web applications using modern stacks.";
  const professionalSummary = about.professional?.professionalSummary || "Frontend Engineer focused on building fast, accessible, and clean user interfaces.";
  const whoIAm = about.professional?.whoIAm || "I am a frontend-focused developer who loves bringing designs to life with precise code and animations.";
  const philosophy = about.professional?.philosophy || "My philosophy is that simple code is better code. I write DRY, component-based frontend projects.";

  // @ts-ignore
  const coreValues = about.professional?.coreValues?.length ? about.professional.coreValues : defaultCoreValues;
  // @ts-ignore
  const currentFocus = about.professional?.currentFocus?.length ? about.professional.currentFocus : defaultCurrentFocus;
  const journeyText = about.basic?.shortBio || defaultJourney;
  const lifestyleText = about.lifestyle?.lifestyleText || defaultLifestyle;
  // @ts-ignore
  const lifestyleImages = about.lifestyle?.lifestyleImages?.length
    // @ts-ignore
    ? about.lifestyle.lifestyleImages.map((img: any) => typeof img === 'string' ? img : img.url)
    : defaultLifestyleImages;
  // @ts-ignore
  const activities = about.lifestyle?.dailyLifeActivities?.length ? about.lifestyle.dailyLifeActivities : defaultActivities;
  const imageUrl = about.basic?.profileImage?.url || about.basic?.coverImage?.url;
  const [openFaq, setOpenFaq] = React.useState<string | null>(null);

  // Helper to determine animation variants based on global settings
  const getAnimationVariants = (): any => {
    const animation = about.settings?.globalAnimation || 'slide';
    
    switch (animation) {
      case 'fade':
        return {
          initial: { opacity: 0 },
          whileInView: { opacity: 1, transition: { duration: 0.6 } }
        };
      case 'scale':
        return {
          initial: { opacity: 0, scale: 0.9 },
          whileInView: { opacity: 1, scale: 1, transition: { duration: 0.5, type: 'spring' } }
        };
      case 'parallax':
        return {
          initial: { opacity: 0, y: 50 },
          whileInView: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
        };
      case 'slide':
      default:
        return {
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0, transition: { duration: 0.5 } }
        };
    }
  };

  const animVariants = getAnimationVariants();

  return (
    <div className="min-h-screen bg-[#F5F7FB] dark:bg-[#0F172A] text-[#0F172A] dark:text-white transition-colors duration-300 flex flex-col" suppressHydrationWarning>
      <Navbar />

      <main className="flex-grow pt-28 pb-20 relative overflow-hidden">

        {/* Background glow effects */}
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-0 w-[450px] h-[450px] bg-purple-500/10 dark:bg-purple-600/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-[#64748B] dark:text-slate-400 hover:text-[#2563EB] dark:hover:text-blue-400 transition-colors mb-10 group bg-white dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 px-4 py-2 rounded-xl shadow-sm w-fit cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span className="font-semibold text-sm">Back to Home</span>
          </Link>

          {/* Section 1: Professional Introduction */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
            <div className="lg:col-span-5">
              {imageUrl && (
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 aspect-square max-w-sm mx-auto">
                  <img
                    src={imageUrl}
                    alt={name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#2563EB] dark:text-blue-400 font-mono block">Professional Profile</span>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                About <span className="text-[#2563EB] dark:text-blue-500">{name}</span>
              </h1>
              <p className="text-lg font-bold text-slate-600 dark:text-slate-400">
                {title}
              </p>
              <div className="h-1.5 w-16 bg-[#2563EB] dark:bg-blue-500 rounded-full" />
              <p className="text-base sm:text-lg leading-relaxed text-[#334155] dark:text-slate-300 font-light">
                {introduction}
              </p>
              
              {about.basic?.resumeUrl && (
                <div className="pt-6">
                  <button
                    onClick={() => setIsResumeModalOpen(true)}
                    className="inline-flex items-center justify-center space-x-2.5 w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] dark:bg-blue-600 dark:hover:bg-blue-500 shadow-xl shadow-blue-500/20 dark:shadow-blue-900/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                  >
                    <FileDown className="h-5 w-5" />
                    <span>রিজিউমি</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

            {/* Main Content Area */}
            <div className="lg:col-span-8 space-y-10">

              {/* Section 2 & 3: Professional Summary & Who I Am */}
              <motion.section
                initial={animVariants.initial}
                whileInView={animVariants.whileInView}
                viewport={{ once: true }}
                className="bg-white dark:bg-slate-800 p-8 sm:p-10 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-[#E2E8F0] dark:border-slate-700 transition-colors duration-300 space-y-6"
              >
                <div className="flex items-center space-x-3 pb-4 border-b border-[#E2E8F0] dark:border-slate-700">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-[#2563EB] dark:text-blue-400 rounded-xl">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight">Who I Am & Professional Summary</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-extrabold uppercase tracking-wider font-mono text-slate-400 mb-1">Professional Summary</h3>
                    <p className="text-base leading-relaxed text-[#334155] dark:text-slate-300 font-light">
                      {professionalSummary}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold uppercase tracking-wider font-mono text-slate-400 mb-1">Developer Mindset</h3>
                    <p className="text-base leading-relaxed text-[#334155] dark:text-slate-300 font-light">
                      {whoIAm}
                    </p>
                  </div>
                </div>
              </motion.section>

              {/* Section 4: Development Philosophy */}
              <motion.section
                initial={animVariants.initial}
                whileInView={animVariants.whileInView}
                viewport={{ once: true }}
                className="bg-white dark:bg-slate-800 p-8 sm:p-10 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-[#E2E8F0] dark:border-slate-700 transition-colors duration-300"
              >
                <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-[#E2E8F0] dark:border-slate-700">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-[#2563EB] dark:text-blue-400 rounded-xl">
                    <Cpu className="h-6 w-6" />
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight">Development Philosophy</h2>
                </div>
                <p className="text-base leading-relaxed text-[#334155] dark:text-slate-300 font-light">
                  {philosophy}
                </p>
              </motion.section>

              {/* Section 5: Core Values */}
              <motion.section
                initial={animVariants.initial}
                whileInView={animVariants.whileInView}
                viewport={{ once: true }}
                className="bg-white dark:bg-slate-800 p-8 sm:p-10 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-[#E2E8F0] dark:border-slate-700 transition-colors duration-300"
              >
                <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-[#E2E8F0] dark:border-slate-700">
                  <div className="p-3 bg-[#EFF6FF] dark:bg-blue-900/30 text-[#2563EB] dark:text-blue-400 rounded-xl">
                    <Lightbulb className="h-6 w-6" />
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight">Core Values</h2>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {coreValues.map((val: string, idx: number) => {
                    const parts = val.split(':');
                    const valueTitle = parts[0];
                    const valueDesc = parts.slice(1).join(':').trim();
                    return (
                      <div key={idx} className="flex items-start space-x-3 p-4 bg-[#F5F7FB] dark:bg-slate-900/50 rounded-2xl border border-[#E2E8F0] dark:border-slate-700/50">
                        <CheckCircle2 className="h-5 w-5 text-[#2563EB] dark:text-blue-400 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-bold text-[#0F172A] dark:text-white">{valueTitle}</h4>
                          {valueDesc && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{valueDesc}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.section>

              {/* Section 6: Professional Journey */}
              <motion.section
                initial={animVariants.initial}
                whileInView={animVariants.whileInView}
                viewport={{ once: true }}
                className="bg-white dark:bg-slate-800 p-8 sm:p-10 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-[#E2E8F0] dark:border-slate-700 transition-colors duration-300"
              >
                <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-[#E2E8F0] dark:border-slate-700">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-[#2563EB] dark:text-blue-400 rounded-xl">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight">Professional Journey</h2>
                </div>
                <p className="text-base leading-relaxed text-[#334155] dark:text-slate-300 font-light whitespace-pre-wrap">
                  {journeyText}
                </p>

                {about.timelines && about.timelines.length > 0 && (
                  <div className="mt-10 relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[#E2E8F0] dark:before:via-slate-700 before:to-transparent">
                    {about.timelines.map((item: any, index: number) => (
                      <motion.div
                        key={item._id || index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                      >
                        <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-slate-800 bg-blue-100 dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 group-hover:scale-110 transition-transform">
                          <CheckCircle2 className="h-5 w-5" />
                        </div>

                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 bg-[#F5F7FB] dark:bg-slate-900/50 border border-[#E2E8F0] dark:border-slate-700/50 hover:border-[#2563EB] dark:hover:border-blue-500 rounded-2xl group-hover:-translate-y-1 transition-all duration-300">
                          <div className="flex justify-between items-start mb-2">
                            {item.category && (
                              <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider font-mono rounded bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
                                {item.category}
                              </span>
                            )}
                            {item.date && (
                              <span className="flex items-center text-xs text-slate-500 dark:text-slate-400 font-mono">
                                <Calendar className="h-3.5 w-3.5 mr-1" />
                                {item.date}
                              </span>
                            )}
                          </div>
                          <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {item.title}
                          </h4>
                          {item.subtitle && (
                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center flex-wrap gap-2">
                              {item.subtitle}
                            </p>
                          )}
                          {item.description && (
                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.section>

              {/* Section 8: Beyond Coding */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-slate-800 p-8 sm:p-10 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-[#E2E8F0] dark:border-slate-700 transition-colors duration-300"
              >
                <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-[#E2E8F0] dark:border-slate-700">
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl">
                    <Coffee className="h-6 w-6" />
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight">Beyond Coding</h2>
                </div>
                <p className="text-base leading-relaxed text-[#334155] dark:text-slate-300 font-light mb-8 whitespace-pre-wrap">
                  {lifestyleText}
                </p>

                {/* Image Grid */}
                {lifestyleImages.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {lifestyleImages.map((src: string, idx: number) => (
                      <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden group border border-[#E2E8F0] dark:border-slate-700">
                        <img
                          src={src}
                          alt={`Lifestyle image ${idx + 1}`}
                          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                          <span className="text-white text-xs font-semibold tracking-wider uppercase">Photo</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.section>

              {/* Section 10: Media Gallery */}
              {about.gallery && about.gallery.length > 0 && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-slate-800 p-8 sm:p-10 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-[#E2E8F0] dark:border-slate-700 transition-colors duration-300"
                >
                  <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-[#E2E8F0] dark:border-slate-700">
                    <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl">
                      <Camera className="h-6 w-6" />
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight">Media Gallery</h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {about.gallery.map((media: any, idx: number) => (
                      <div key={media._id || idx} className="relative group aspect-video rounded-2xl bg-slate-100 dark:bg-slate-900 overflow-hidden shadow-md border border-[#E2E8F0] dark:border-slate-700">
                        {media.type === 'video' ? (
                          <iframe
                            src={media.url}
                            title={media.caption || 'Video'}
                            className="w-full h-full border-0"
                            allowFullScreen
                          />
                        ) : (
                          <img
                            src={media.url}
                            alt={media.caption || 'Gallery Image'}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        )}
                        {media.caption && media.type === 'image' && (
                          <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <p className="text-white text-sm font-medium">{media.caption}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.section>
              )}

              {/* Section 11: FAQ Accordion */}
              {about.faqs && about.faqs.length > 0 && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-slate-800 p-8 sm:p-10 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-[#E2E8F0] dark:border-slate-700 transition-colors duration-300"
                >
                  <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-[#E2E8F0] dark:border-slate-700">
                    <div className="p-3 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-xl">
                      <MessageCircleQuestion className="h-6 w-6" />
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight">Frequently Asked Questions</h2>
                  </div>

                  <div className="space-y-4">
                    {about.faqs.map((faq: any, idx: number) => {
                      const isOpen = openFaq === faq._id || openFaq === idx.toString();
                      return (
                        <div key={faq._id || idx} className="border border-[#E2E8F0] dark:border-slate-700 rounded-2xl overflow-hidden bg-[#F5F7FB] dark:bg-slate-900/50">
                          <button
                            onClick={() => setOpenFaq(isOpen ? null : (faq._id || idx.toString()))}
                            className="flex items-center justify-between w-full p-5 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                          >
                            <span className="font-bold text-slate-900 dark:text-white pr-4">{faq.question}</span>
                            <ChevronDown className={`h-5 w-5 text-slate-500 transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180 text-blue-500' : ''}`} />
                          </button>
                          <AnimatePresence>
                            {isOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                              >
                                <div className="p-5 pt-0 text-slate-600 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-wrap border-t border-[#E2E8F0] dark:border-slate-700 mt-2 pt-4">
                                  {faq.answer}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </motion.section>
              )}

            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4 space-y-10">

              {/* Social Connect (New) */}
              {config?.socialLinks && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-[#E2E8F0] dark:border-slate-700 transition-colors duration-300"
                >
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl shrink-0">
                      <Send className="h-5 w-5" />
                    </div>
                    <h3 className="text-xl font-bold tracking-tight">Connect With Me</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {about.basic?.socialLinks?.map((link: any, idx: number) => {
                      const getPlatformStyles = (platform: string) => {
                        const p = platform.toLowerCase();
                        if (p === 'linkedin') return "bg-[#0077b5]/10 hover:bg-[#0077b5]/20 text-[#0077b5] dark:text-[#0077b5]";
                        if (p === 'twitter') return "bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 text-[#1DA1F2] dark:text-[#1DA1F2]";
                        if (p === 'youtube') return "bg-[#FF0000]/10 hover:bg-[#FF0000]/20 text-[#FF0000] dark:text-[#FF0000]";
                        if (p === 'facebook') return "bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] dark:text-[#1877F2]";
                        if (p === 'instagram') return "bg-[#E1306C]/10 hover:bg-[#E1306C]/20 text-[#E1306C] dark:text-[#E1306C]";
                        return "bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-white";
                      };

                      const getIcon = (platform: string) => {
                        const p = platform.toLowerCase();
                        if (p === 'github') return <FaGithub className="w-5 h-5" />;
                        if (p === 'linkedin') return <FaLinkedin className="w-5 h-5" />;
                        if (p === 'twitter') return <FaTwitter className="w-5 h-5" />;
                        if (p === 'facebook') return <FaFacebook className="w-5 h-5" />;
                        if (p === 'medium') return <SiMedium className="w-5 h-5" />;
                        if (p === 'youtube') return <FaYoutube className="w-5 h-5" />;
                        if (p === 'instagram') return <FaInstagram className="w-5 h-5" />;
                        return <FaGlobe className="w-5 h-5" />;
                      };

                      return (
                        <a 
                          key={idx}
                          href={link.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-semibold transition-colors ${getPlatformStyles(link.platform)}`}
                        >
                          {getIcon(link.platform)}
                          <span>{link.platform}</span>
                        </a>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Section 7: Current Focus */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-[#E2E8F0] dark:border-slate-700 transition-colors duration-300"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl shrink-0">
                    <Cpu className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-bold tracking-tight">Current Focus</h3>
                </div>
                <ul className="space-y-3">
                  {currentFocus.map((focus: string, idx: number) => (
                    <li key={idx} className="flex items-center p-3.5 bg-[#F5F7FB] dark:bg-slate-900/50 rounded-xl border border-[#E2E8F0] dark:border-slate-700/50 hover:border-[#2563EB] dark:hover:border-blue-500 transition-colors group">
                      <div className="h-2 w-2 rounded-full bg-[#2563EB] dark:bg-blue-500 mr-3 shrink-0 group-hover:scale-125 transition-transform" />
                      <span className="text-xs font-semibold text-[#334155] dark:text-slate-300">{focus}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Hobbies / Interests */}
              {activities.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-[#E2E8F0] dark:border-slate-700 transition-colors duration-300"
                >
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2.5 bg-[#EFF6FF] dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl shrink-0">
                      <Compass className="h-5 w-5" />
                    </div>
                    <h3 className="text-xl font-bold tracking-tight">Interests</h3>
                  </div>
                  <ul className="space-y-3">
                    {activities.map((activity: string, idx: number) => (
                      <li key={idx} className="flex items-center p-3.5 bg-[#F5F7FB] dark:bg-slate-900/50 rounded-xl border border-[#E2E8F0] dark:border-slate-700/50 hover:border-[#2563EB] dark:hover:border-blue-500 transition-colors group">
                        <div className="h-2 w-2 rounded-full bg-[#2563EB] dark:bg-blue-500 mr-3 shrink-0 group-hover:scale-125 transition-transform" />
                        <span className="text-xs font-semibold text-[#334155] dark:text-slate-300">{activity}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Section 9: Collaboration CTA */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] dark:from-blue-600 dark:to-blue-800 p-8 rounded-3xl shadow-lg shadow-blue-500/20 text-white relative overflow-hidden"
              >
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                <div className="relative z-10">
                  <Send className="h-8 w-8 mb-5 text-blue-200" />
                  <h3 className="text-2xl font-bold mb-3 tracking-tight">Let's Collaborate</h3>
                  <p className="text-xs text-blue-100 mb-8 font-light leading-relaxed">
                    I'm always open to discussing new projects, creative ideas or opportunities to build amazing digital experiences.
                  </p>
                  <Link
                    href="/#contact"
                    className="flex justify-center w-full bg-white text-[#2563EB] font-bold py-3.5 px-4 rounded-xl hover:bg-slate-50 transition-colors shadow-md hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                  >
                    Let's Connect
                  </Link>
                </div>
              </motion.div>

            </div>
          </div>
        </div>
      </main>

      {/* Resume Modal for Main About Page */}
      <AnimatePresence>
        {isResumeModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl relative border border-slate-200 dark:border-slate-700"
            >
              <button 
                onClick={() => setIsResumeModalOpen(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-700 rounded-full transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
              
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileDown className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">রিজিউমি অপশন</h3>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                <a 
                  href={about.basic?.resumeUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={() => setIsResumeModalOpen(false)}
                  className="flex items-center justify-center space-x-2 w-full py-3 px-4 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl font-semibold hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                >
                  <Eye className="h-5 w-5" />
                  <span>দেখুন</span>
                </a>
                
                <a 
                  href={about.basic?.resumeUrl} 
                  download 
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsResumeModalOpen(false)}
                  className="flex items-center justify-center space-x-2 w-full py-3 px-4 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl font-semibold shadow-md transition-colors"
                >
                  <FileDown className="h-5 w-5" />
                  <span>ডাউনলোড করুন</span>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
