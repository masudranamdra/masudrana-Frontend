'use client';

import React from 'react';
import Link from 'next/link';
import { useConfig } from '../context/ConfigContext';
import { Mail, Phone, MapPin, Sparkles, MessageSquare, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const { config } = useConfig();
  const currentYear = new Date().getFullYear();

  // Custom SVG Social Icons (Uniform style)
  const socials = [
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com/in/masud-rana',
      icon: (
        <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
      )
    },
    // {
    //   name: 'Twitter',
    //   url: 'https://twitter.com',
    //   icon: (
    //     <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24">
    //       <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
    //     </svg>
    //   )
    // },
    {
      name: 'GitHub',
      url: 'https://github.com/masud-rana',
      icon: (
        <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      )
    },
    {
      name: 'Facebook',
      url: 'https://facebook.com',
      icon: (
        <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24">
          <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
        </svg>
      )
    },
    {
      name: 'Instagram',
      url: 'https://instagram.com',
      icon: (
        <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      )
    },
    {
      name: 'YouTube',
      url: 'https://youtube.com',
      icon: (
        <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24">
          <path d="M23.498 6.163c-.272-1.022-1.074-1.826-2.096-2.101-1.846-.497-9.402-.497-9.402-.497s-7.556 0-9.402.497c-1.022.275-1.824 1.079-2.096 2.101-.497 1.846-.497 5.704-.497 5.704s0 3.859.497 5.704c.272 1.022 1.074 1.826 2.096 2.101 1.846.497 9.402.497 9.402.497s7.556 0 9.402-.497c1.022-.275 1.824-1.079 2.096-2.101.497-1.846.497-5.704.497-5.704s0-3.859-.497-5.704zm-14.28 9.53v-7.387l6.4 3.69-6.4 3.697z"/>
        </svg>
      )
    },
    // {
    //   name: 'Medium',
    //   url: 'https://medium.com',
    //   icon: (
    //     <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24">
    //       <path d="M2.846 5.23c.098-.242.046-.516-.135-.708l-2.05-2.47v-.552h6.792l5.19 11.393 4.646-11.393h6.398v.552l-1.782 1.71c-.156.126-.234.33-.205.53v14.4c-.03.2.048.404.205.53l1.737 1.71v.552h-9.336v-.552l1.79-1.737c.18-.18.18-.234.18-.53v-11.236l-5.11 12.983h-.8l-5.836-12.983v9.645c-.067.33.042.67.288.887l2.296 2.784v.552h-7.902v-.552l2.308-2.784c.243-.223.336-.566.257-.887v-10.957z"/>
    //     </svg>
    //   )
    // }
  ];

  return (
    <footer className="relative bg-[#090D1A] dark:bg-transparent dark:dark-gradient-footer text-white border-t border-[#1E293B] dark:border-none pt-12 pb-8 overflow-hidden">
      
      {/* Ambient background decoration */}
      <div className="absolute top-0 left-1/4 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-indigo-500/5 rounded-full blur-[90px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Callout Box */}
        <div className="mb-8 p-4 sm:p-5 rounded-xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-base sm:text-lg font-extrabold text-white flex items-center justify-center md:justify-start gap-2">
              📧 <span>Let's Build Something Exceptional</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 font-normal">
              Always open to proposals, software engineering contracts, and creative collaborations. 
            </p>
          </div>
          <Link
            href="/#contact"
            className="inline-flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm rounded-xl transition-all duration-300 shadow-md shrink-0"
          >
            <span>Start a Conversation</span>
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
          {/* Logo & Description */}
          <div className="md:col-span-4 space-y-5">
            <Link href="/" className="flex items-center space-x-2 text-white font-extrabold text-2xl tracking-wider">
              <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Masud Rana
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed font-light">
              {config?.siteDescription || 'A premium developer portfolio showcasing high-fidelity SaaS applications, technical skills, and software engineering articles.'}
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-4 space-y-5">
            <h3 className="text-white font-semibold text-xs uppercase tracking-widest font-mono border-l-2 border-indigo-500 pl-3">Navigation</h3>
            <ul className="grid grid-cols-2 gap-y-3 text-slate-400 text-sm font-light">
              <li>
                <Link href="/#about" className="hover:text-white hover:underline transition-all">About Bio</Link>
              </li>
              <li>
                <Link href="/#skills" className="hover:text-white hover:underline transition-all">My Skills</Link>
              </li>
              <li>
                <Link href="/#projects" className="hover:text-white hover:underline transition-all">Projects</Link>
              </li>
              <li>
                <Link href="/#experience" className="hover:text-white hover:underline transition-all">Experience</Link>
              </li>
              <li>
                <Link href="/#gallery" className="hover:text-white hover:underline transition-all">Media Vault</Link>
              </li>
              <li>
                <Link href="/#blogs" className="hover:text-white hover:underline transition-all">Writings</Link>
              </li>
              <li>
                <Link href="/#documents" className="hover:text-white hover:underline transition-all">Documents</Link>
              </li>
              <li>
                <Link href="/#contact" className="hover:text-white hover:underline transition-all">Get In Touch</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details & Social Links */}
          <div className="md:col-span-4 space-y-5">
            <h3 className="text-white font-semibold text-xs uppercase tracking-widest font-mono border-l-2 border-indigo-500 pl-3">Contact info</h3>
            
            <div className="space-y-3.5 text-slate-400 text-sm font-light">
              <div className="flex items-center space-x-3 group">
                <Mail className="h-4.5 w-4.5 text-indigo-400 shrink-0 group-hover:scale-110 transition-transform" />
                <a href={`mailto:${config?.contactEmail || 'admin@example.com'}`} className="hover:text-white transition-colors">
                  {config?.contactEmail || 'admin@example.com'}
                </a>
              </div>

              <div className="flex items-center space-x-3 group">
                <MessageSquare className="h-4.5 w-4.5 text-emerald-400 shrink-0 group-hover:scale-110 transition-transform" />
                <a href="https://wa.me/8801877080660" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  +880 1877-080660 (WhatsApp)
                </a>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="h-4.5 w-4.5 text-indigo-400 shrink-0" />
                <span>+880 1877-080660</span>
              </div>

              <div className="flex items-center space-x-3">
                <MapPin className="h-4.5 w-4.5 text-rose-500 shrink-0" />
                <span>Dinajpur, Bangladesh</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center space-x-3.5 pt-3">
              {socials.map((soc) => (
                <a
                  key={soc.name}
                  href={soc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-blue-600 hover:border-transparent transition-all duration-300 flex items-center justify-center shadow-md group"
                  title={soc.name}
                >
                  <span className="transition-transform duration-300 group-hover:scale-110">
                    {soc.icon}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-[#1E293B] pt-8 flex flex-col md:flex-row justify-between items-center text-slate-500 text-[10px] sm:text-xs">
          <p>© {currentYear} Masud Rana. All rights reserved.</p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0 font-mono">
            <Link href="/login" className="hover:text-slate-300 transition-colors">Client Login</Link>
            <Link href="/admin" className="hover:text-slate-300 transition-colors">Admin Area</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
