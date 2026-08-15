'use client';

import React from 'react';

interface FormattedTextProps {
  content: string;
  className?: string;
}

export const FormattedText: React.FC<FormattedTextProps> = ({ content = '', className = '' }) => {
  if (!content) return null;

  // Converts markdown & custom BBCode tags into clean, sanitized HTML
  const parseInlineFormatting = (str: string): string => {
    if (!str) return '';
    let formatted = str;

    // Bold **text**
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900 dark:text-white">$1</strong>');
    // Italic *text*
    formatted = formatted.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
    // Underline <u>text</u>
    formatted = formatted.replace(/<u>(.*?)<\/u>/g, '<u class="underline decoration-indigo-500 underline-offset-2">$1</u>');
    // Strikethrough ~~text~~
    formatted = formatted.replace(/~~(.*?)~~/g, '<del class="line-through text-slate-500">$1</del>');

    // Custom BBCode [color:#hex]text[/color] -> <span style="color: #hex; font-weight: 600;">text</span>
    formatted = formatted.replace(/\[color:(.*?)\](.*?)\[\/color\]/gi, '<span style="color: $1; font-weight: 600;">$2</span>');

    // Custom BBCode [bg:#hex]text[/bg] -> <mark style="background-color: $1; padding: 2px 6px; border-radius: 4px;">text</mark>
    formatted = formatted.replace(/\[bg:(.*?)\](.*?)\[\/bg\]/gi, '<mark style="background-color: $1; padding: 2px 6px; border-radius: 4px; color: #ffffff;">$2</mark>');

    // Alignments [align:center]text[/align] or <div align="center">
    formatted = formatted.replace(/\[align:(left|center|right)\](.*?)\[\/align\]/gi, '<div style="text-align: $1;">$2</div>');
    formatted = formatted.replace(/<div align="(left|center|right)">(.*?)<\/div>/gi, '<div style="text-align: $1;">$2</div>');

    // Ensure raw <span style="..."> tags use valid class names if any
    formatted = formatted.replace(/className=/g, 'class=');

    return formatted;
  };

  const renderFormattedParagraphs = (text: string) => {
    const lines = text.split('\n');

    return lines.map((line, idx) => {
      const trimmed = line.trim();

      // Empty line -> spacing paragraph
      if (!trimmed) {
        return <div key={idx} className="h-3" />;
      }

      // H1 Header (# Heading)
      if (trimmed.startsWith('# ')) {
        const titleText = trimmed.replace(/^#\s+/, '');
        return (
          <h1 key={idx} className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-6 mb-3 tracking-tight border-b border-indigo-500/20 pb-1.5 flex items-center gap-2">
            <span className="w-2 h-6 bg-indigo-600 rounded-full inline-block shrink-0" />
            <span dangerouslySetInnerHTML={{ __html: parseInlineFormatting(titleText) }} />
          </h1>
        );
      }

      // H2 Header (## Heading)
      if (trimmed.startsWith('## ')) {
        const titleText = trimmed.replace(/^##\s+/, '');
        return (
          <h2 key={idx} className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white mt-5 mb-2 tracking-tight flex items-center gap-2">
            <span className="w-1.5 h-4 bg-emerald-500 rounded-full inline-block shrink-0" />
            <span dangerouslySetInnerHTML={{ __html: parseInlineFormatting(titleText) }} />
          </h2>
        );
      }

      // H3 Header (### Heading)
      if (trimmed.startsWith('### ')) {
        const titleText = trimmed.replace(/^###\s+/, '');
        return (
          <h3 key={idx} className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200 mt-4 mb-2 tracking-tight">
            <span dangerouslySetInnerHTML={{ __html: parseInlineFormatting(titleText) }} />
          </h3>
        );
      }

      // Quote / Callout (> Quote)
      if (trimmed.startsWith('> ')) {
        const quoteText = trimmed.replace(/^>\s+/, '');
        return (
          <blockquote key={idx} className="my-3 pl-4 py-2 border-l-4 border-indigo-500 bg-indigo-500/10 text-indigo-900 dark:text-indigo-200 rounded-r-xl italic text-sm font-medium">
            <span dangerouslySetInnerHTML={{ __html: parseInlineFormatting(quoteText) }} />
          </blockquote>
        );
      }

      // Bullet List (- or *)
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const listText = trimmed.replace(/^[-*]\s+/, '');
        return (
          <div key={idx} className="flex items-start gap-2.5 my-1.5 pl-2 text-slate-700 dark:text-slate-300">
            <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0 mt-2" />
            <span className="flex-1" dangerouslySetInnerHTML={{ __html: parseInlineFormatting(listText) }} />
          </div>
        );
      }

      // Numbered List (1. 2. etc)
      const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
      if (numMatch) {
        return (
          <div key={idx} className="flex items-start gap-2.5 my-1.5 pl-2 text-slate-700 dark:text-slate-300">
            <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 font-mono text-xs font-bold shrink-0 mt-0.5">
              {numMatch[1]}
            </span>
            <span className="flex-1" dangerouslySetInnerHTML={{ __html: parseInlineFormatting(numMatch[2]) }} />
          </div>
        );
      }

      // Horizontal Divider (---)
      if (trimmed === '---' || trimmed === '***') {
        return <hr key={idx} className="my-6 border-slate-200 dark:border-white/10" />;
      }

      // Standard Paragraph line
      return (
        <p
          key={idx}
          className="leading-relaxed text-slate-700 dark:text-slate-300 my-1.5 font-normal text-sm sm:text-base"
          dangerouslySetInnerHTML={{ __html: parseInlineFormatting(line) }}
        />
      );
    });
  };

  return <div className={`space-y-1 ${className}`}>{renderFormattedParagraphs(content)}</div>;
};
