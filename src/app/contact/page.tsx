'use client';

import React, { useState } from 'react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import API from '../../lib/api';
import { motion } from 'framer-motion';
import { Send, Loader2, CheckCircle2, AlertCircle, Mail, Phone, MapPin } from 'lucide-react';
import { useConfig } from '../../context/ConfigContext';

const contactSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  subject: z.string().min(3, { message: 'Subject must be at least 3 characters.' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactPage() {
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

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FB] text-[#0F172A]">
      <Navbar />

      <main className="flex-grow pt-32 pb-24 relative overflow-hidden">
        {/* Decorative Glow Elements */}
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[450px] h-[450px] bg-purple-500/5 rounded-full blur-[110px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Page Title */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#2563EB] font-mono">Communications Hub</span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0F172A] tracking-tight">Start A Collaboration</h1>
            <div className="h-1 w-12 bg-[#2563EB] rounded-full mx-auto" />
            <p className="text-slate-500 text-sm max-w-lg mx-auto font-light leading-relaxed">
              Have a project in mind or want to explore working together? Drop me a line below.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch max-w-5xl mx-auto">
            {/* Contact Details Column */}
            <div className="lg:col-span-5 flex flex-col justify-between p-8 rounded-2xl bg-white border border-[#E2E8F0] space-y-8 shadow-md shadow-slate-100/50">
              <div className="space-y-4">
                <h2 className="text-[#0F172A] font-bold text-xl tracking-tight">Let's discuss a project</h2>
                <p className="text-[#64748B] text-xs sm:text-sm leading-relaxed font-light">
                  Fill out the form to message me directly. I check my inbox daily and will get back to you shortly.
                </p>
              </div>

              <div className="space-y-6 text-[#334155] text-xs sm:text-sm">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-slate-50 border border-[#E2E8F0] text-[#2563EB] rounded-xl shrink-0">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-[#64748B] text-xs font-mono">Email Address</h3>
                    <a href={`mailto:${config?.contactEmail || 'admin@example.com'}`} className="hover:text-[#2563EB] transition-colors font-medium">
                      {config?.contactEmail || 'admin@example.com'}
                    </a>
                  </div>
                </div>

                {config?.contactPhone && (
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-slate-50 border border-[#E2E8F0] text-[#2563EB] rounded-xl shrink-0">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-[#64748B] text-xs font-mono">Phone Number</h3>
                      <span className="font-medium">{config.contactPhone}</span>
                    </div>
                  </div>
                )}

                {config?.contactAddress && (
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-slate-50 border border-[#E2E8F0] text-[#2563EB] rounded-xl shrink-0">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-[#64748B] text-xs font-mono">Location</h3>
                      <span className="font-medium">{config.contactAddress}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-[#E2E8F0] pt-4 text-[#64748B] text-[10px] font-mono">
                Secure contact form. Submissions are encrypted.
              </div>
            </div>

            {/* Form Column */}
            <div className="lg:col-span-7 p-8 rounded-2xl bg-white border border-[#E2E8F0] flex flex-col justify-center shadow-md shadow-slate-100/50">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                
                {/* Form Feedback Messages */}
                {submitSuccess && (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs rounded-xl flex items-center space-x-3">
                    <CheckCircle2 className="h-5 w-5 shrink-0" />
                    <span>{submitSuccess}</span>
                  </div>
                )}
                {submitError && (
                  <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs rounded-xl flex items-center space-x-3">
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

                {/* Name field */}
                <div className="space-y-1.5">
                  <label className="text-[#334155] text-xs font-semibold">Your Name</label>
                  <input
                    type="text"
                    placeholder="Masud Rana"
                    {...register('name')}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-[#E2E8F0] focus:border-[#2563EB]/50 focus:ring-1 focus:ring-[#2563EB]/50 rounded-xl text-sm text-[#0F172A] placeholder-[#64748B] focus:outline-none transition-all"
                  />
                  {errors.name && (
                    <span className="text-rose-600 text-xs font-mono">{errors.name.message}</span>
                  )}
                </div>

                {/* Email field */}
                <div className="space-y-1.5">
                  <label className="text-[#334155] text-xs font-semibold">Email Address</label>
                  <input
                    type="email"
                    placeholder="client@example.com"
                    {...register('email')}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-[#E2E8F0] focus:border-[#2563EB]/50 focus:ring-1 focus:ring-[#2563EB]/50 rounded-xl text-sm text-[#0F172A] placeholder-[#64748B] focus:outline-none transition-all"
                  />
                  {errors.email && (
                    <span className="text-rose-600 text-xs font-mono">{errors.email.message}</span>
                  )}
                </div>

                {/* Subject field */}
                <div className="space-y-1.5">
                  <label className="text-[#334155] text-xs font-semibold">Subject</label>
                  <input
                    type="text"
                    placeholder="Project Inquiry"
                    {...register('subject')}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-[#E2E8F0] focus:border-[#2563EB]/50 focus:ring-1 focus:ring-[#2563EB]/50 rounded-xl text-sm text-[#0F172A] placeholder-[#64748B] focus:outline-none transition-all"
                  />
                  {errors.subject && (
                    <span className="text-rose-600 text-xs font-mono">{errors.subject.message}</span>
                  )}
                </div>

                {/* Message field */}
                <div className="space-y-1.5">
                  <label className="text-[#334155] text-xs font-semibold">Message</label>
                  <textarea
                    rows={5}
                    placeholder="Hello! I would love to build a SaaS application with you..."
                    {...register('message')}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-[#E2E8F0] focus:border-[#2563EB]/50 focus:ring-1 focus:ring-[#2563EB]/50 rounded-xl text-sm text-[#0F172A] placeholder-[#64748B] focus:outline-none transition-all resize-none"
                  />
                  {errors.message && (
                    <span className="text-rose-600 text-xs font-mono">{errors.message.message}</span>
                  )}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center justify-center space-x-2 w-full py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-xl transition-all shadow-md cursor-pointer disabled:bg-slate-300 disabled:text-slate-500"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
