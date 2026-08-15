'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import API, { getAssetUrl } from '../../lib/api';
import { Testimonial } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote, ArrowRight, Plus, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import DualImageInput from '../admin/DualImageInput';

export const TestimonialSection: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  const [modalOpen, setModalOpen] = useState(false);
  const [formFields, setFormFields] = useState({
    clientName: user?.username || '',
    position: '',
    company: '',
    rating: 5,
    reviewContent: '',
    avatar: '',
  });
  const [fileObject, setFileObject] = useState<File | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  const triggerToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMsg({ text, type });
    setTimeout(() => setToastMsg(null), 3000);
  };

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
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

  useEffect(() => {
    fetchTestimonials();
  }, [user]); // Re-fetch if user logs in to see their pending ones

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleAddClick = () => {
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      setFormFields(prev => ({ ...prev, clientName: user?.username || '' }));
      setModalOpen(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      const formData = new FormData();
      formData.append('clientName', formFields.clientName);
      formData.append('position', formFields.position);
      formData.append('company', formFields.company);
      formData.append('rating', String(formFields.rating));
      formData.append('reviewContent', formFields.reviewContent);
      if (fileObject) {
        formData.append('avatar', fileObject);
      } else if (formFields.avatar) {
        formData.append('avatar', formFields.avatar);
      }

      const res = await API.post('/testimonials', formData);

      if (res.data && res.data.success) {
        triggerToast('Recommendation submitted successfully! It is now pending admin approval.');
        setModalOpen(false);
        fetchTestimonials();
        setCurrentIndex(0); // Go back to start to potentially see the new pending one
      }
    } catch (err: any) {
      triggerToast(err.response?.data?.message || 'Failed to submit recommendation', 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-32 bg-[#F5F7FB] dark:bg-[#0F172A]" id="testimonials">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="h-6 w-36 bg-slate-200 dark:bg-slate-700 animate-pulse rounded-md mx-auto mb-6" />
          <div className="h-48 w-full bg-slate-200/50 dark:bg-slate-800/50 animate-pulse rounded-2xl max-w-xl mx-auto" />
        </div>
      </section>
    );
  }

  const current = testimonials[currentIndex];

  return (
    <section id="testimonials" className="relative py-32 bg-[#F5F7FB] dark:bg-[#0F172A] text-[#0F172A] dark:text-white border-t border-b border-[#E2E8F0] dark:border-slate-800 overflow-hidden transition-colors duration-300">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 z-[60] p-4 rounded-xl border flex items-center space-x-3 shadow-xl backdrop-blur-md ${toastMsg.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
              }`}
          >
            <span className="text-xs font-semibold">{toastMsg.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-500/5 dark:bg-blue-600/10 rounded-full blur-[100px] pointer-events-none transition-colors duration-300" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-[#2563EB] dark:text-blue-400 font-mono">Endorsements</span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#0F172A] dark:text-white tracking-tight leading-tight">
            Client Recommendations
          </h2>
          <div className="h-1 w-12 bg-[#2563EB] dark:bg-blue-500 rounded-full mx-auto" />
        </div>

        <div className="flex justify-center mb-12">
          <button
            onClick={handleAddClick}
            className="flex items-center space-x-2 px-6 py-3 rounded-2xl font-bold bg-[#2563EB] hover:bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] transition-all duration-300 transform hover:-translate-y-1"
          >
            <Plus className="h-5 w-5" />
            <span>Add Your Recommendation</span>
          </button>
        </div>

        {testimonials.length > 0 ? (
          <div className="relative max-w-4xl mx-auto">
            {/* Quote Icon */}
            <div className="absolute -top-10 -left-6 text-[#2563EB]/10 dark:text-blue-400/10 pointer-events-none z-0">
              <Quote className="h-24 w-24 transform -scale-x-100" />
            </div>

            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="relative z-10 p-8 sm:p-14 rounded-3xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 shadow-2xl shadow-slate-200/40 dark:shadow-none flex flex-col items-center text-center space-y-8"
            >
              
              {/* Pending Badge */}
              {!current.isApproved && (
                <div className="absolute top-4 right-4 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-500 dark:text-amber-400 text-[10px] font-bold uppercase tracking-wider rounded-full flex items-center space-x-2">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span>Processing / Pending Approval</span>
                </div>
              )}

              {/* Rating Stars */}
              <div className="flex items-center space-x-1 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < current.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200 dark:text-slate-700'
                    }`}
                  />
                ))}
              </div>

              {/* Testimonial Review Text */}
              <p className="text-[#334155] dark:text-slate-300 text-lg sm:text-xl leading-relaxed font-light italic max-w-3xl">
                "{current.reviewContent}"
              </p>

              {/* Client Info details */}
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 pt-6 border-t border-slate-200 dark:border-slate-800 w-full justify-center">
                {current.avatar?.url ? (
                  <img
                    src={getAssetUrl(current.avatar.url)}
                    alt={current.clientName}
                    className="w-16 h-16 rounded-full object-cover border-2 border-white dark:border-slate-800 shadow-md"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center border-2 border-white dark:border-slate-800 text-[#2563EB] dark:text-blue-400 font-bold text-xl shadow-md">
                    {current.clientName.charAt(0)}
                  </div>
                )}

                <div className="text-center sm:text-left">
                  <h4 className="text-[#0F172A] dark:text-white font-extrabold text-base">{current.clientName}</h4>
                  <p className="text-[#64748B] dark:text-slate-400 text-sm font-light mt-0.5">
                    {current.position} at <span className="text-[#2563EB] dark:text-blue-400 font-semibold">{current.company}</span>
                  </p>
                </div>
              </div>

            </motion.div>

            {/* Navigation Controls buttons */}
            {testimonials.length > 1 && (
              <div className="flex justify-center items-center space-x-4 mt-8">
                <button
                  onClick={handlePrev}
                  className="p-3 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-[#E2E8F0] dark:border-slate-700 text-[#64748B] dark:text-slate-400 hover:text-[#0F172A] dark:hover:text-white rounded-xl shadow-sm transition-all duration-300 cursor-pointer"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <div className="text-[#64748B] dark:text-slate-400 text-xs font-mono font-bold select-none">
                  {currentIndex + 1} / {testimonials.length}
                </div>
                <button
                  onClick={handleNext}
                  className="p-3 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-[#E2E8F0] dark:border-slate-700 text-[#64748B] dark:text-slate-400 hover:text-[#0F172A] dark:hover:text-white rounded-xl shadow-sm transition-all duration-300 cursor-pointer"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center text-slate-500 py-10">
            No recommendations yet. Be the first to add one!
          </div>
        )}

        {/* Link to dedicated testimonials subpage */}
        <div className="flex justify-center pt-16">
          <Link
            href="/testimonials"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl font-bold bg-white dark:bg-slate-800 text-[#2563EB] dark:text-blue-400 border border-[#E2E8F0] dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Read All Recommendations</span>
            <ArrowRight className="h-4.5 w-4.5" />
          </Link>
        </div>

      </div>

      {/* Submission Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="absolute inset-0 bg-[#0F172A]/80 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl z-10 border border-slate-200 dark:border-slate-800 overflow-hidden"
            >
              <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-xl font-extrabold text-[#0F172A] dark:text-white">Add Recommendation</h3>
                <button onClick={() => setModalOpen(false)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div className="space-y-1.5">
                  <label className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Your Name</label>
                  <input
                    required
                    type="text"
                    value={formFields.clientName}
                    onChange={(e) => setFormFields({ ...formFields, clientName: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-blue-500 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Position</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. CEO"
                      value={formFields.position}
                      onChange={(e) => setFormFields({ ...formFields, position: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-blue-500 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Company</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Acme Corp"
                      value={formFields.company}
                      onChange={(e) => setFormFields({ ...formFields, company: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-blue-500 dark:text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Rating</label>
                  <select
                    value={formFields.rating}
                    onChange={(e) => setFormFields({ ...formFields, rating: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-blue-500 dark:text-white"
                  >
                    {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Stars</option>)}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Review</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Share your experience working with me..."
                    value={formFields.reviewContent}
                    onChange={(e) => setFormFields({ ...formFields, reviewContent: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-blue-500 dark:text-white resize-none"
                  />
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <DualImageInput
                    label="Profile Avatar Image (Optional)"
                    value={formFields.avatar || ''}
                    onChangeUrl={(url) => setFormFields({ ...formFields, avatar: url })}
                    fileObject={fileObject}
                    onFileSelect={(file) => setFileObject(file)}
                  />
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="submit"
                    disabled={submitLoading}
                    className="w-full flex items-center justify-center space-x-2 py-4 rounded-xl font-bold bg-[#2563EB] hover:bg-blue-600 text-white transition-all disabled:opacity-50"
                  >
                    {submitLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                    <span>{submitLoading ? 'Submitting...' : 'Submit Recommendation'}</span>
                  </button>
                  <p className="text-center text-[10px] text-slate-400 mt-3 font-medium">
                    Note: Your recommendation will be reviewed before appearing publicly.
                  </p>
                </div>
              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
};
