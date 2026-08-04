'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

export const QuoteSection: React.FC = () => {
  return (
    <section id="quote" className="relative py-36 bg-[#F5F7FB] overflow-hidden flex items-center justify-center border-t border-b border-[#E2E8F0]">
      {/* Ambient background highlight */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.03),transparent_60%)]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-sky-500/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
        {/* Quote Icon */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 0.1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="flex justify-center"
        >
          <Quote className="h-16 w-16 text-[#2563EB] rotate-180" />
        </motion.div>
        
        {/* Quote Typography */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F172A] leading-tight tracking-tight max-w-4xl mx-auto font-sans font-light"
        >
          "Design is not just what it looks like and feels like. <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#60A5FA]">Design is how it works.</span> We build interfaces that tell stories and write systems that endure."
        </motion.h2>
        
        {/* Quote Author */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="space-y-1 pt-4"
        >
          <p className="text-sm font-semibold tracking-widest text-[#2563EB] uppercase font-mono">Philosophy & Code</p>
          <p className="text-[10px] text-[#64748B] font-mono">ESTABLISHED MCMXCVIII</p>
        </motion.div>
      </div>
    </section>
  );
};
