'use client';

import React, { useState, useRef } from 'react';
import {
  Bold, Italic, Underline, Strikethrough,
  Heading1, Heading2, Heading3, AlignLeft, AlignCenter, AlignRight,
  List, ListOrdered, Quote, Eye, Edit3, Sparkles, Palette, Check,
  Columns, RotateCcw
} from 'lucide-react';
import { FormattedText } from '../FormattedText';

interface RichTextEditorProps {
  label?: string;
  value: string;
  onChange: (val: string) => void;
  rows?: number;
  placeholder?: string;
  className?: string;
}

export default function RichTextEditor({
  label = 'Description / বিবরণ',
  value = '',
  onChange,
  rows = 8,
  placeholder = 'এখানে আপনার বিস্তারিত প্রজেক্ট বিবরণ লিখুন... (হেডিং, কালার ও প্যারাগ্রাফ স্পেসিং সহ)',
  className = '',
}: RichTextEditorProps) {
  const [activeMode, setActiveMode] = useState<'editor' | 'split' | 'preview'>('editor');
  const [customColor, setCustomColor] = useState('#6366f1');
  const [hexInput, setHexInput] = useState('#6366f1');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Quick preset palette
  const presetColors = [
    { name: 'Indigo', hex: '#6366f1' },
    { name: 'Emerald', hex: '#10b981' },
    { name: 'Amber', hex: '#f59e0b' },
    { name: 'Rose', hex: '#f43f5e' },
    { name: 'Cyan', hex: '#06b6d4' },
    { name: 'Purple', hex: '#a855f7' },
    { name: 'Sky Blue', hex: '#38bdf8' },
    { name: 'White', hex: '#ffffff' },
  ];

  const insertFormatting = (prefix: string, suffix: string = '') => {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end) || 'Selected Text';
    const replacement = `${prefix}${selectedText}${suffix}`;
    const newValue = value.substring(0, start) + replacement + value.substring(end);
    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
    }, 0);
  };

  const applyColor = (colorHex: string) => {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end) || 'Colored Text';
    
    // HTML span tag for clean styled text
    const prefix = `<span style="color: ${colorHex}; font-weight: 600;">`;
    const suffix = `</span>`;
    const replacement = `${prefix}${selectedText}${suffix}`;
    const newValue = value.substring(0, start) + replacement + value.substring(end);
    onChange(newValue);
    setShowColorPicker(false);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
    }, 0);
  };

  const applyBlockPrefix = (prefix: string) => {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end) || 'Heading Title';
    const replacement = `\n\n${prefix} ${selectedText}\n\n`;
    const newValue = value.substring(0, start) + replacement + value.substring(end);
    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length + 3, start + prefix.length + 3 + selectedText.length);
    }, 0);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Editor Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-white/10 pb-2">
        <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-indigo-500" />
          <span>{label}</span>
        </label>

        {/* Mode Switcher Tabs (Responsive for Mobile/Desktop) */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-white/10 text-xs">
          <button
            type="button"
            onClick={() => setActiveMode('editor')}
            className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg transition-all font-semibold cursor-pointer ${
              activeMode === 'editor'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span className="text-[11px] sm:text-xs">এডিটর</span>
          </button>
          
          <button
            type="button"
            onClick={() => setActiveMode('split')}
            className={`hidden md:flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all font-semibold cursor-pointer ${
              activeMode === 'split'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="Side-by-side Live Split View"
          >
            <Columns className="w-3.5 h-3.5" />
            <span className="text-xs">স্প্লিট ভিউ (Split)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('preview')}
            className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg transition-all font-semibold cursor-pointer ${
              activeMode === 'preview'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="text-[11px] sm:text-xs">প্রিভিউ</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-950 overflow-hidden ${
        activeMode === 'split' ? 'grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/10' : ''
      }`}>
        
        {/* Editor Column */}
        {(activeMode === 'editor' || activeMode === 'split') && (
          <div className="flex flex-col h-full">
            {/* Formatting Toolbar (Mobile Touch Optimized Horizontal Scroll) */}
            <div className="flex items-center gap-1 p-2 bg-slate-900/90 border-b border-white/10 overflow-x-auto no-scrollbar touch-pan-x text-xs">
              
              {/* Headings Dropdown / Buttons */}
              <div className="flex items-center gap-0.5 bg-slate-950 p-0.5 rounded-lg border border-white/10 shrink-0">
                <button
                  type="button"
                  onClick={() => applyBlockPrefix('#')}
                  title="Main Title (H1)"
                  className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center"
                >
                  <Heading1 className="w-4 h-4 text-indigo-400" />
                </button>
                <button
                  type="button"
                  onClick={() => applyBlockPrefix('##')}
                  title="Section Heading (H2)"
                  className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center"
                >
                  <Heading2 className="w-4 h-4 text-emerald-400" />
                </button>
                <button
                  type="button"
                  onClick={() => applyBlockPrefix('###')}
                  title="Sub-heading (H3)"
                  className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center"
                >
                  <Heading3 className="w-4 h-4 text-amber-400" />
                </button>
              </div>

              <div className="h-4 w-px bg-white/10 mx-0.5 shrink-0" />

              {/* Text Styling */}
              <div className="flex items-center gap-0.5 bg-slate-950 p-0.5 rounded-lg border border-white/10 shrink-0">
                <button
                  type="button"
                  onClick={() => insertFormatting('**', '**')}
                  title="Bold Text"
                  className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center"
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('*', '*')}
                  title="Italic Text"
                  className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center"
                >
                  <Italic className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('<u>', '</u>')}
                  title="Underline Text"
                  className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center"
                >
                  <Underline className="w-4 h-4 text-indigo-400" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('~~', '~~')}
                  title="Strikethrough"
                  className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center"
                >
                  <Strikethrough className="w-4 h-4" />
                </button>
              </div>

              <div className="h-4 w-px bg-white/10 mx-0.5 shrink-0" />

              {/* Custom Color Picker Button */}
              <div className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className="flex items-center gap-1.5 p-1.5 px-2 bg-slate-950 hover:bg-slate-900 text-slate-200 rounded-lg border border-white/10 cursor-pointer min-h-[32px]"
                  title="Choose Custom Color"
                >
                  <Palette className="w-4 h-4 text-indigo-400" />
                  <span className="w-3 h-3 rounded-full border border-white/30" style={{ backgroundColor: customColor }} />
                  <span className="text-[11px] font-mono font-semibold hidden sm:inline">{customColor}</span>
                </button>

                {/* Color Picker Popover */}
                {showColorPicker && (
                  <div className="absolute top-10 left-0 z-50 p-3 bg-slate-900 border border-white/15 rounded-2xl shadow-2xl space-y-3 w-64">
                    <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                      <span className="text-xs font-bold text-white">Choose Color</span>
                      <button
                        type="button"
                        onClick={() => setShowColorPicker(false)}
                        className="text-xs text-slate-400 hover:text-white"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Presets */}
                    <div className="grid grid-cols-4 gap-1.5">
                      {presetColors.map((c) => (
                        <button
                          key={c.hex}
                          type="button"
                          onClick={() => {
                            setCustomColor(c.hex);
                            setHexInput(c.hex);
                            applyColor(c.hex);
                          }}
                          className="h-7 rounded-lg border border-white/10 flex items-center justify-center hover:scale-105 transition-transform cursor-pointer"
                          style={{ backgroundColor: c.hex }}
                          title={c.name}
                        />
                      ))}
                    </div>

                    {/* Custom Hex Code Input */}
                    <div className="space-y-1 pt-1">
                      <label className="text-[10px] text-slate-400 font-mono block">Custom Color (HEX Code / Picker)</label>
                      <div className="flex gap-1.5 items-center">
                        <input
                          type="color"
                          value={customColor}
                          onChange={(e) => {
                            setCustomColor(e.target.value);
                            setHexInput(e.target.value);
                          }}
                          className="w-8 h-8 rounded cursor-pointer bg-transparent border-0"
                        />
                        <input
                          type="text"
                          value={hexInput}
                          onChange={(e) => {
                            setHexInput(e.target.value);
                            if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
                              setCustomColor(e.target.value);
                            }
                          }}
                          placeholder="#6366f1"
                          className="flex-1 px-2 py-1 bg-slate-950 border border-white/10 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
                        />
                        <button
                          type="button"
                          onClick={() => applyColor(hexInput)}
                          className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg cursor-pointer"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="h-4 w-px bg-white/10 mx-0.5 shrink-0" />

              {/* Alignments */}
              <div className="flex items-center gap-0.5 bg-slate-950 p-0.5 rounded-lg border border-white/10 shrink-0">
                <button
                  type="button"
                  onClick={() => insertFormatting('<div align="left">\n', '\n</div>')}
                  title="Align Left"
                  className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center"
                >
                  <AlignLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('<div align="center">\n', '\n</div>')}
                  title="Align Center"
                  className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center"
                >
                  <AlignCenter className="w-4 h-4 text-indigo-400" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('<div align="right">\n', '\n</div>')}
                  title="Align Right"
                  className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center"
                >
                  <AlignRight className="w-4 h-4" />
                </button>
              </div>

              <div className="h-4 w-px bg-white/10 mx-0.5 shrink-0" />

              {/* Lists & Callouts */}
              <div className="flex items-center gap-0.5 bg-slate-950 p-0.5 rounded-lg border border-white/10 shrink-0">
                <button
                  type="button"
                  onClick={() => insertFormatting('\n- ', '')}
                  title="Bullet List"
                  className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('\n1. ', '')}
                  title="Numbered List"
                  className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center"
                >
                  <ListOrdered className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('\n> ', '')}
                  title="Callout Box"
                  className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center"
                >
                  <Quote className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Main Textarea */}
            <textarea
              ref={textareaRef}
              rows={rows}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="w-full p-4 bg-slate-950 text-slate-200 text-xs sm:text-sm font-sans focus:outline-none custom-scrollbar leading-relaxed resize-y flex-1"
            />

            {/* Footer Status Bar */}
            <div className="px-4 py-2 bg-slate-900/60 border-t border-white/5 text-[11px] text-slate-400 flex justify-between items-center">
              <span className="hidden sm:inline">প্যারাগ্রাফ ও স্পেসিং বজায় রাখতে Enter বাটন চাপুন।</span>
              <span className="font-mono text-indigo-400 font-semibold">{value.length} characters</span>
            </div>
          </div>
        )}

        {/* Live Preview Column (Shown in 'preview' or 'split' modes) */}
        {(activeMode === 'preview' || activeMode === 'split') && (
          <div className="p-4 sm:p-5 bg-slate-950 overflow-y-auto max-h-[500px] custom-scrollbar space-y-3">
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-400 border-b border-white/10 pb-2 flex justify-between items-center">
              <span>লাইভ আউটপুট প্রিভিউ (Live Preview)</span>
              <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">Live</span>
            </div>
            
            {value.trim() ? (
              <FormattedText content={value} className="text-sm leading-relaxed" />
            ) : (
              <p className="text-xs text-slate-500 italic">কোনো বিবরণ লেখা হয়নি। পূর্বে 'এডিটর' ট্যাবে গিয়ে প্রজেক্ট বিবরণ লিখুন।</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
