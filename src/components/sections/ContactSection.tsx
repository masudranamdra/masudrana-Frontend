'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import API from '../../lib/api';
import { motion } from 'framer-motion';
import { Send, Loader2, CheckCircle2, AlertCircle, Mail, Phone, MapPin, MessageSquare, User, FileText, MessageCircle } from 'lucide-react';
import { useConfig } from '../../context/ConfigContext';

const contactSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  subject: z.string().min(3, { message: 'Subject must be at least 3 characters.' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export const ContactSection: React.FC = () => {
  const { config } = useConfig();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  const onSubmit = async (values: ContactFormValues) => {
    setIsSubmitting(true);
    setSubmitSuccess(null);
    setSubmitError(null);
    try {
      const res = await API.post('/messages', values);
      if (res.data && res.data.success) {
        setSubmitSuccess(res.data.message || 'Thank you! Your message was sent successfully.');
        reset();
      } else {
        setSubmitError(res.data.message || 'Failed to send message. Please try again.');
      }
    } catch (error: any) {
      setSubmitError(
        error.response?.data?.message || 'Something went wrong. Please check your connection and try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Custom SVG Social Icons
  const socials = [
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com/in/masud-rana',
      icon: (
        <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
      )
    },
    {
      name: 'Twitter',
      url: 'https://twitter.com',
      icon: (
        <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
          <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
        </svg>
      )
    },
    {
      name: 'YouTube',
      url: 'https://youtube.com',
      icon: (
        <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
          <path d="M23.498 6.163c-.272-1.022-1.074-1.826-2.096-2.101-1.846-.497-9.402-.497-9.402-.497s-7.556 0-9.402.497c-1.022.275-1.824 1.079-2.096 2.101-.497 1.846-.497 5.704-.497 5.704s0 3.859.497 5.704c.272 1.022 1.074 1.826 2.096 2.101 1.846.497 9.402.497 9.402.497s7.556 0 9.402-.497c1.022-.275 1.824-1.079 2.096-2.101.497-1.846.497-5.704.497-5.704s0-3.859-.497-5.704zm-14.28 9.53v-7.387l6.4 3.69-6.4 3.697z"/>
        </svg>
      )
    },
    {
      name: 'Facebook',
      url: 'https://facebook.com',
      icon: (
        <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
          <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
        </svg>
      )
    },
    {
      name: 'Medium',
      url: 'https://medium.com',
      icon: (
        <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
          <path d="M2.846 5.23c.098-.242.046-.516-.135-.708l-2.05-2.47v-.552h6.792l5.19 11.393 4.646-11.393h6.398v.552l-1.782 1.71c-.156.126-.234.33-.205.53v14.4c-.03.2.048.404.205.53l1.737 1.71v.552h-9.336v-.552l1.79-1.737c.18-.18.18-.234.18-.53v-11.236l-5.11 12.983h-.8l-5.836-12.983v9.645c-.067.33.042.67.288.887l2.296 2.784v.552h-7.902v-.552l2.308-2.784c.243-.223.336-.566.257-.887v-10.957z"/>
        </svg>
      )
    },
    {
      name: 'Instagram',
      url: 'https://instagram.com',
      icon: (
        <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      )
    },
    {
      name: 'GitHub',
      url: 'https://github.com/masud-rana',
      icon: (
        <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      )
    }
  ];

  return (
    <section id="contact" className="relative py-32 bg-[#F5F7FB] dark:bg-[#0F172A] text-[#0F172A] dark:text-white border-t border-[#E2E8F0] dark:border-slate-800 overflow-hidden transition-colors duration-300">
      {/* Decorative Glow Elements */}
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 dark:bg-blue-600/10 rounded-full blur-[130px] pointer-events-none transition-colors duration-300" />
      <div className="absolute bottom-0 right-1/4 w-[450px] h-[450px] bg-indigo-500/5 dark:bg-indigo-600/10 rounded-full blur-[110px] pointer-events-none transition-colors duration-300" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-[#2563EB] dark:text-blue-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest font-mono border border-blue-100 dark:border-blue-800/50">
            Communications Hub
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#0F172A] dark:text-white tracking-tight leading-tight">Get In Touch</h2>
          <div className="h-1.5 w-16 bg-gradient-to-r from-[#2563EB] to-indigo-500 rounded-full mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch max-w-6xl mx-auto">
          {/* Contact Details Column */}
          <div className="lg:col-span-5 flex flex-col justify-between p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900/60 backdrop-blur-md border border-[#E2E8F0] dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none space-y-10 relative overflow-hidden group">
            <div className="absolute -top-32 -left-32 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-700 pointer-events-none"></div>
            
            <div className="space-y-4 relative z-10">
              <h3 className="text-[#0F172A] dark:text-white font-extrabold text-3xl tracking-tight">Let's connect</h3>
              <p className="text-[#64748B] dark:text-slate-400 text-sm leading-relaxed font-light">
                Whether you have a question or just want to say hi, I'll try my best to get back to you!
              </p>
            </div>

            {/* Contact details list */}
            <div className="space-y-6 text-[#334155] dark:text-slate-300 text-sm relative z-10">
              <div className="flex items-center space-x-4 group/item">
                <div className="p-3.5 bg-blue-50 dark:bg-blue-900/30 text-[#2563EB] dark:text-blue-400 rounded-2xl shrink-0 border border-blue-100 dark:border-blue-800/30 transition-transform group-hover/item:scale-110 shadow-sm">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-[#64748B] dark:text-slate-400 text-[10px] uppercase font-bold tracking-wider font-mono">Email</h4>
                  <a href={`mailto:${config?.contactEmail || 'admin@example.com'}`} className="text-[#0F172A] dark:text-white hover:text-[#2563EB] dark:hover:text-blue-400 transition-colors font-semibold">
                    {config?.contactEmail || 'admin@example.com'}
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-4 group/item">
                <div className="p-3.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-500 dark:text-emerald-400 rounded-2xl shrink-0 border border-emerald-100 dark:border-emerald-800/30 transition-transform group-hover/item:scale-110 shadow-sm">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-[#64748B] dark:text-slate-400 text-[10px] uppercase font-bold tracking-wider font-mono">WhatsApp</h4>
                  <a href="https://wa.me/8801877080660" target="_blank" rel="noopener noreferrer" className="text-[#0F172A] dark:text-white hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors font-semibold">
                    +880 1877-080660
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-4 group/item">
                <div className="p-3.5 bg-blue-50 dark:bg-blue-900/30 text-[#2563EB] dark:text-blue-400 rounded-2xl shrink-0 border border-blue-100 dark:border-blue-800/30 transition-transform group-hover/item:scale-110 shadow-sm">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-[#64748B] dark:text-slate-400 text-[10px] uppercase font-bold tracking-wider font-mono">Phone</h4>
                  <a href={`tel:${config?.contactPhone || '01877080660'}`} className="text-[#0F172A] dark:text-white hover:text-[#2563EB] dark:hover:text-blue-400 transition-colors font-semibold">
                    {config?.contactPhone || '+880 1877-080660'}
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-4 group/item">
                <div className="p-3.5 bg-rose-50 dark:bg-rose-900/30 text-rose-500 dark:text-rose-400 rounded-2xl shrink-0 border border-rose-100 dark:border-rose-800/30 transition-transform group-hover/item:scale-110 shadow-sm">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-[#64748B] dark:text-slate-400 text-[10px] uppercase font-bold tracking-wider font-mono">Address</h4>
                  <span className="font-semibold text-[#0F172A] dark:text-white">Dinajpur, Bangladesh</span>
                </div>
              </div>
            </div>

            {/* Social media connections */}
            <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800 relative z-10">
              <h4 className="text-[#64748B] dark:text-slate-400 text-[10px] uppercase font-bold tracking-widest font-mono">Find me on</h4>
              <div className="flex flex-wrap gap-3">
                {socials.map((soc) => (
                  <a
                    key={soc.name}
                    href={soc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 text-[#64748B] dark:text-slate-400 hover:text-white hover:bg-[#2563EB] dark:hover:bg-blue-600 hover:border-transparent transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1"
                    title={soc.name}
                  >
                    {soc.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-7 p-1 sm:p-1 rounded-[2rem] bg-gradient-to-br from-[#2563EB]/20 to-indigo-500/20 dark:from-blue-500/20 dark:to-indigo-500/20 shadow-2xl relative">
            <div className="h-full w-full bg-white dark:bg-[#0F172A] rounded-[1.8rem] p-8 sm:p-10 relative overflow-hidden flex flex-col justify-center border border-white/50 dark:border-slate-800/50">
              {/* Background design accents */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="mb-8 space-y-2 relative z-10 text-center">
                <h3 className="text-2xl font-extrabold text-[#0F172A] dark:text-white">
                  Send a Message
                </h3>
                <p className="text-[#64748B] dark:text-slate-400 text-sm font-light">
                  Have an idea, proposal, or question? Send it over instantly.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10">
                
                {/* Form Feedback Messages */}
                {submitSuccess && (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 dark:text-emerald-400 text-sm rounded-xl flex items-center space-x-3">
                    <CheckCircle2 className="h-5 w-5 shrink-0" />
                    <span>{submitSuccess}</span>
                  </div>
                )}
                {submitError && (
                  <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 dark:text-rose-400 text-sm rounded-xl flex items-center space-x-3">
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name field */}
                  <div className="space-y-2">
                    <label className="text-[#64748B] dark:text-slate-400 text-xs font-bold uppercase tracking-wider font-mono ml-1">Your Name</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 group-focus-within:text-[#2563EB] transition-colors">
                        <User className="h-4.5 w-4.5" />
                      </div>
                      <input
                        type="text"
                        placeholder="John Doe"
                        {...register('name')}
                        className="w-full pl-12 pr-4 py-3.5 bg-[#F8FAFC] dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 focus:border-[#2563EB] dark:focus:border-blue-500 focus:ring-2 focus:ring-[#2563EB]/20 dark:focus:ring-blue-500/20 rounded-2xl text-sm text-[#0F172A] dark:text-white placeholder-[#94A3B8] dark:placeholder-slate-600 focus:outline-none transition-all shadow-sm"
                      />
                    </div>
                    {errors.name && (
                      <span className="text-rose-500 dark:text-rose-400 text-xs ml-1 font-medium">{errors.name.message}</span>
                    )}
                  </div>

                  {/* Email field */}
                  <div className="space-y-2">
                    <label className="text-[#64748B] dark:text-slate-400 text-xs font-bold uppercase tracking-wider font-mono ml-1">Your Email</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 group-focus-within:text-[#2563EB] transition-colors">
                        <Mail className="h-4.5 w-4.5" />
                      </div>
                      <input
                        type="email"
                        placeholder="john@example.com"
                        {...register('email')}
                        className="w-full pl-12 pr-4 py-3.5 bg-[#F8FAFC] dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 focus:border-[#2563EB] dark:focus:border-blue-500 focus:ring-2 focus:ring-[#2563EB]/20 dark:focus:ring-blue-500/20 rounded-2xl text-sm text-[#0F172A] dark:text-white placeholder-[#94A3B8] dark:placeholder-slate-600 focus:outline-none transition-all shadow-sm"
                      />
                    </div>
                    {errors.email && (
                      <span className="text-rose-500 dark:text-rose-400 text-xs ml-1 font-medium">{errors.email.message}</span>
                    )}
                  </div>
                </div>

                {/* Subject field */}
                <div className="space-y-2">
                  <label className="text-[#64748B] dark:text-slate-400 text-xs font-bold uppercase tracking-wider font-mono ml-1">Subject</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 group-focus-within:text-[#2563EB] transition-colors">
                      <FileText className="h-4.5 w-4.5" />
                    </div>
                    <input
                      type="text"
                      placeholder="Project proposal"
                      {...register('subject')}
                      className="w-full pl-12 pr-4 py-3.5 bg-[#F8FAFC] dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 focus:border-[#2563EB] dark:focus:border-blue-500 focus:ring-2 focus:ring-[#2563EB]/20 dark:focus:ring-blue-500/20 rounded-2xl text-sm text-[#0F172A] dark:text-white placeholder-[#94A3B8] dark:placeholder-slate-600 focus:outline-none transition-all shadow-sm"
                    />
                  </div>
                  {errors.subject && (
                    <span className="text-rose-500 dark:text-rose-400 text-xs ml-1 font-medium">{errors.subject.message}</span>
                  )}
                </div>

                {/* Message field */}
                <div className="space-y-2">
                  <label className="text-[#64748B] dark:text-slate-400 text-xs font-bold uppercase tracking-wider font-mono ml-1">Message</label>
                  <div className="relative group">
                    <div className="absolute top-4 left-4 flex items-start pointer-events-none text-slate-400 dark:text-slate-500 group-focus-within:text-[#2563EB] transition-colors">
                      <MessageCircle className="h-4.5 w-4.5" />
                    </div>
                    <textarea
                      rows={5}
                      placeholder="Describe your project requirements, timeline, budget..."
                      {...register('message')}
                      className="w-full pl-12 pr-4 py-4 bg-[#F8FAFC] dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 focus:border-[#2563EB] dark:focus:border-blue-500 focus:ring-2 focus:ring-[#2563EB]/20 dark:focus:ring-blue-500/20 rounded-2xl text-sm text-[#0F172A] dark:text-white placeholder-[#94A3B8] dark:placeholder-slate-600 focus:outline-none resize-none transition-all shadow-sm custom-scrollbar"
                    />
                  </div>
                  {errors.message && (
                    <span className="text-rose-500 dark:text-rose-400 text-xs ml-1 font-medium">{errors.message.message}</span>
                  )}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center justify-center space-x-2.5 w-full py-4 bg-gradient-to-r from-[#2563EB] to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:opacity-70 text-white font-bold rounded-2xl transition-all duration-300 shadow-xl shadow-blue-500/30 cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Transmitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
