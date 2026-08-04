"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, UserCircle, Route, Briefcase, Heart, Settings, Image as ImageIcon } from 'lucide-react';

const tabs = [
  { name: 'Basic Info', href: '/admin/about/basic', icon: UserCircle },
  { name: 'Journey & Timeline', href: '/admin/about/journey', icon: Route },
  { name: 'Professional', href: '/admin/about/professional', icon: Briefcase },
  { name: 'Lifestyle', href: '/admin/about/lifestyle', icon: Heart },
  { name: 'Gallery', href: '/admin/about/gallery', icon: ImageIcon },
  { name: 'Settings', href: '/admin/about/settings', icon: Settings },
];

export default function AboutAdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50 dark:bg-[#0F172A] gap-6 p-6">
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-64 shrink-0 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col">
        <div className="mb-8 px-4">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6 text-indigo-500" />
            About Page
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Manage your entire portfolio identity.
          </p>
        </div>
        
        <nav className="flex flex-col gap-2 flex-grow">
          {tabs.map((tab) => {
            const isActive = pathname.startsWith(tab.href);
            const Icon = tab.icon;
            
            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-medium' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-500 dark:text-indigo-400' : 'text-slate-400'}`} />
                {tab.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm overflow-hidden">
        {children}
      </main>
    </div>
  );
}
