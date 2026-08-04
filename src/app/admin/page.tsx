'use client';

import React, { useState, useEffect } from 'react';
import API from '../../lib/api';
import { Project, Skill, Blog, DocumentAsset, ContactMessage, GalleryImage, GalleryVideo } from '../../types';
import { motion } from 'framer-motion';
import {
  FolderCode,
  Sliders,
  PenTool,
  FileText,
  MessageSquare,
  Image,
  Video,
  Download,
  AlertCircle,
  Clock,
  ArrowRight,
  TrendingUp,
  Inbox
} from 'lucide-react';
import Link from 'next/link';

export default function AdminOverview() {
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    blogs: 0,
    documents: 0,
    messages: 0,
    unreadMessages: 0,
    mediaImages: 0,
    mediaVideos: 0,
    totalDownloads: 0,
  });
  const [loading, setLoading] = useState(true);
  const [latestMessages, setLatestMessages] = useState<ContactMessage[]>([]);

  useEffect(() => {
    const fetchOverviewStats = async () => {
      try {
        setLoading(true);
        // Query lists in parallel
        const [
          projRes,
          skillRes,
          blogRes,
          docRes,
          msgRes,
          imgRes,
          vidRes,
        ] = await Promise.all([
          API.get('/projects'),
          API.get('/skills'),
          API.get('/blogs'),
          API.get('/documents'),
          API.get('/messages'),
          API.get('/gallery/images'),
          API.get('/gallery/videos'),
        ]);

        const totalDownloads = (docRes.data?.data || []).reduce(
          (sum: number, doc: DocumentAsset) => sum + (doc.downloadCount || 0),
          0
        );

        const unreadMessages = (msgRes.data?.data || []).filter((m: ContactMessage) => !m.isRead).length;

        setStats({
          projects: projRes.data?.count || 0,
          skills: skillRes.data?.count || 0,
          blogs: blogRes.data?.count || 0,
          documents: docRes.data?.count || 0,
          messages: msgRes.data?.count || 0,
          unreadMessages,
          mediaImages: imgRes.data?.count || 0,
          mediaVideos: vidRes.data?.count || 0,
          totalDownloads,
        });

        // Set latest 3 inbox messages
        setLatestMessages((msgRes.data?.data || []).slice(0, 3));
      } catch (error) {
        console.error('Failed to load admin overview metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOverviewStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-slate-200 dark:bg-slate-900 animate-pulse rounded-md" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-32 bg-slate-100 dark:bg-slate-900/50 animate-pulse rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    { name: 'Projects', count: stats.projects, icon: FolderCode, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { name: 'Skills Loaded', count: stats.skills, icon: Sliders, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { name: 'Blogs Published', count: stats.blogs, icon: PenTool, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { name: 'Documents Manager', count: stats.documents, icon: FileText, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { name: 'Total Downloads', count: stats.totalDownloads, icon: Download, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    { name: 'Media Assets', count: stats.mediaImages + stats.mediaVideos, icon: Image, color: 'text-pink-400', bg: 'bg-pink-500/10' },
  ];

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold text-[var(--text-primary)] tracking-tight">System Overview</h1>
        <p className="text-[var(--text-secondary)] text-xs font-light">
          Real-time metrics, content stats, and system analytics.
        </p>
      </div>

      {/* Overview Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.name}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="p-6 rounded-2xl glass-panel border-[var(--card-border)] flex items-center justify-between"
            >
              <div className="space-y-1">
                <span className="text-[var(--text-secondary)] text-[10px] font-mono uppercase tracking-wider">{card.name}</span>
                <h3 className="text-2xl font-extrabold text-[var(--text-primary)]">{card.count}</h3>
              </div>
              <div className={`p-3.5 rounded-xl ${card.bg} ${card.color} border border-slate-200 dark:border-white/5`}>
                <Icon className="h-5 w-5" />
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Inbox overview card */}
        <div className="lg:col-span-8 p-6 rounded-2xl glass-panel border-[var(--card-border)] space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-[var(--card-border)]">
            <h3 className="text-[var(--text-primary)] font-bold text-sm uppercase tracking-wider flex items-center space-x-2">
              <Inbox className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <span>Unread Messages ({stats.unreadMessages})</span>
            </h3>
            <Link
              href="/admin/messages"
              className="flex items-center space-x-1 text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
            >
              <span>View Inbox</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {latestMessages.length === 0 ? (
            <p className="text-slate-500 text-xs text-center py-6">Your inbox is completely clear.</p>
          ) : (
            <div className="space-y-4">
              {latestMessages.map((msg) => (
                <div
                  key={msg._id}
                  className={`p-4 rounded-xl border transition-all ${
                    msg.isRead
                      ? 'bg-[var(--card-bg)]/40 border-[var(--card-border)]'
                      : 'bg-[var(--card-bg)] border-indigo-500/30 shadow-sm shadow-indigo-500/5'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-[var(--text-primary)] font-bold text-xs">{msg.name}</h4>
                      <p className="text-[var(--text-muted)] text-[10px] font-mono">{msg.email}</p>
                    </div>
                    {!msg.isRead && (
                      <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-[9px] font-extrabold uppercase font-mono">
                        New
                      </span>
                    )}
                  </div>
                  <h5 className="text-[var(--text-secondary)] text-xs font-semibold">{msg.subject}</h5>
                  <p className="text-[var(--text-muted)] text-xs line-clamp-2 mt-1 leading-relaxed font-light">{msg.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Config stats card */}
        <div className="lg:col-span-4 p-6 rounded-2xl glass-panel border-[var(--card-border)] space-y-6">
          <h3 className="text-[var(--text-primary)] font-bold text-sm uppercase tracking-wider pb-4 border-b border-[var(--card-border)] flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
            <span>Document Downloads</span>
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[var(--text-muted)] font-mono">Total Document Items</span>
              <span className="text-[var(--text-primary)] font-bold">{stats.documents}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[var(--text-muted)] font-mono">Total Download Traffic</span>
              <span className="text-[var(--text-primary)] font-bold flex items-center space-x-1.5">
                <TrendingUp className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400" />
                <span>{stats.totalDownloads} clicks</span>
              </span>
            </div>
            <p className="text-[10px] text-[var(--text-muted)] leading-relaxed font-light">
              Increments occur automatically when users download protected or public materials.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
