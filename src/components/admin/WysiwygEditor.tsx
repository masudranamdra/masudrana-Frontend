'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Bold, Italic, Underline, Strikethrough,
  Heading1, Heading2, Heading3, AlignLeft, AlignCenter, AlignRight,
  List, ListOrdered, Quote, Eye, Edit3, Sparkles, Palette,
  Check, Undo, Redo, RemoveFormatting
} from 'lucide-react';
import { FormattedText } from '../FormattedText';

interface WysiwygEditorProps {
  id?: string;
  label?: string;
  value: string;
  onChange: (htmlValue: string) => void;
  placeholder?: string;
  minHeight?: string;
  className?: string;
}

export default function WysiwygEditor({
  id = 'projectDescriptionEditor',
  label = 'Project Detailed Description',
  value = '',
  onChange,
  placeholder = 'Write detailed project description... Select text to apply colors and headings.',
  minHeight = '300px',
  className = '',
}: WysiwygEditorProps) {
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [customColor, setCustomColor] = useState('#6366f1');
  const [hexInput, setHexInput] = useState('#6366f1');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const isUpdatingFromProp = useRef(false);

  // Preset palette
  const presetColors = [
    { name: 'Indigo', hex: '#6366f1' },
    { name: 'Emerald', hex: '#10b981' },
    { name: 'Amber', hex: '#f59e0b' },
    { name: 'Rose', hex: '#f43f5e' },
    { name: 'Cyan', hex: '#06b6d4' },
    { name: 'Purple', hex: '#a855f7' },
    { name: 'Sky Blue', hex: '#38bdf8' },
    { name: 'Orange', hex: '#ff5722' },
    { name: 'White', hex: '#ffffff' },
  ];

  // Synchronize incoming value into contenteditable innerHTML when not focused
  useEffect(() => {
    if (editorRef.current && !isUpdatingFromProp.current) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || '';
      }
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      isUpdatingFromProp.current = true;
      const html = editorRef.current.innerHTML;
      onChange(html);
      setTimeout(() => {
        isUpdatingFromProp.current = false;
      }, 50);
    }
  };

  const exec = (command: string, valueArg: string = '') => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand(command, false, valueArg);
    handleInput();
  };

  const applyTextColor = (colorHex: string) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand('foreColor', false, colorHex);
    setCustomColor(colorHex);
    setHexInput(colorHex);
    setShowColorPicker(false);
    handleInput();
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Header Label and Mode Selector */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-white/10 pb-2">
        <label htmlFor={id} className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-indigo-500" />
          <span>{label}</span>
        </label>

        <div className="flex items-center bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-white/10 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('editor')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all font-semibold cursor-pointer ${
              activeTab === 'editor'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Visual Editor</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all font-semibold cursor-pointer ${
              activeTab === 'preview'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Live Output Preview</span>
          </button>
        </div>
      </div>

      {activeTab === 'editor' ? (
        <div className="rounded-2xl border border-slate-300 dark:border-white/10 bg-slate-950 overflow-hidden space-y-0 shadow-lg">
          {/* Formatting Toolbar */}
          <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-900 border-b border-white/10 text-xs">
            {/* Undo / Redo */}
            <div className="flex items-center gap-0.5 bg-slate-950 p-0.5 rounded-lg border border-white/10">
              <button
                type="button"
                onClick={() => exec('undo')}
                title="Undo"
                className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center"
              >
                <Undo className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => exec('redo')}
                title="Redo"
                className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center"
              >
                <Redo className="w-4 h-4" />
              </button>
            </div>

            <div className="h-4 w-px bg-white/10 mx-0.5" />

            {/* Headings */}
            <div className="flex items-center gap-0.5 bg-slate-950 p-0.5 rounded-lg border border-white/10">
              <button
                type="button"
                onClick={() => exec('formatBlock', '<h1>')}
                title="Main Title (H1)"
                className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center"
              >
                <Heading1 className="w-4 h-4 text-indigo-400" />
              </button>
              <button
                type="button"
                onClick={() => exec('formatBlock', '<h2>')}
                title="Section Heading (H2)"
                className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center"
              >
                <Heading2 className="w-4 h-4 text-emerald-400" />
              </button>
              <button
                type="button"
                onClick={() => exec('formatBlock', '<h3>')}
                title="Sub-heading (H3)"
                className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center"
              >
                <Heading3 className="w-4 h-4 text-amber-400" />
              </button>
            </div>

            <div className="h-4 w-px bg-white/10 mx-0.5" />

            {/* Basic Text Formatting */}
            <div className="flex items-center gap-0.5 bg-slate-950 p-0.5 rounded-lg border border-white/10">
              <button
                type="button"
                onClick={() => exec('bold')}
                title="Bold"
                className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => exec('italic')}
                title="Italic"
                className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center"
              >
                <Italic className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => exec('underline')}
                title="Underline"
                className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center"
              >
                <Underline className="w-4 h-4 text-indigo-400" />
              </button>
              <button
                type="button"
                onClick={() => exec('strikeThrough')}
                title="Strikethrough"
                className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center"
              >
                <Strikethrough className="w-4 h-4" />
              </button>
            </div>

            <div className="h-4 w-px bg-white/10 mx-0.5" />

            {/* Custom Color Picker Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="flex items-center gap-1.5 p-1.5 px-2 bg-slate-950 hover:bg-slate-900 text-slate-200 rounded-lg border border-white/10 cursor-pointer min-h-[32px]"
                title="Select Text Color"
              >
                <Palette className="w-4 h-4 text-indigo-400" />
                <span className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-sm" style={{ backgroundColor: customColor }} />
                <span className="text-[11px] font-mono font-bold hidden sm:inline">{customColor}</span>
              </button>

              {/* Color Picker Popover */}
              {showColorPicker && (
                <div className="absolute top-10 left-0 z-50 p-3 bg-slate-900 border border-white/15 rounded-2xl shadow-2xl space-y-3 w-64">
                  <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                    <span className="text-xs font-bold text-white">Select Text Color</span>
                    <button
                      type="button"
                      onClick={() => setShowColorPicker(false)}
                      className="text-xs text-slate-400 hover:text-white cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Preset Colors Grid */}
                  <div className="grid grid-cols-5 gap-1.5">
                    {presetColors.map((c) => (
                      <button
                        key={c.hex}
                        type="button"
                        onClick={() => applyTextColor(c.hex)}
                        className="h-7 rounded-lg border border-white/20 flex items-center justify-center hover:scale-110 transition-transform cursor-pointer shadow-sm"
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      />
                    ))}
                  </div>

                  {/* Custom Color Input */}
                  <div className="space-y-1 pt-1 border-t border-white/10">
                    <label className="text-[10px] text-slate-400 font-mono block">Custom Color Wheel / HEX Code</label>
                    <div className="flex gap-1.5 items-center">
                      <input
                        type="color"
                        value={customColor}
                        onChange={(e) => applyTextColor(e.target.value)}
                        className="w-8 h-8 rounded cursor-pointer bg-transparent border-0"
                      />
                      <input
                        type="text"
                        value={hexInput}
                        onChange={(e) => {
                          setHexInput(e.target.value);
                          if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
                            applyTextColor(e.target.value);
                          }
                        }}
                        placeholder="#6366f1"
                        className="flex-1 px-2.5 py-1 bg-slate-950 border border-white/10 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={() => applyTextColor(hexInput)}
                        className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="h-4 w-px bg-white/10 mx-0.5" />

            {/* Alignments */}
            <div className="flex items-center gap-0.5 bg-slate-950 p-0.5 rounded-lg border border-white/10">
              <button
                type="button"
                onClick={() => exec('justifyLeft')}
                title="Align Left"
                className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center"
              >
                <AlignLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => exec('justifyCenter')}
                title="Align Center"
                className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center"
              >
                <AlignCenter className="w-4 h-4 text-indigo-400" />
              </button>
              <button
                type="button"
                onClick={() => exec('justifyRight')}
                title="Align Right"
                className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center"
              >
                <AlignRight className="w-4 h-4" />
              </button>
            </div>

            <div className="h-4 w-px bg-white/10 mx-0.5" />

            {/* Lists & Format Clear */}
            <div className="flex items-center gap-0.5 bg-slate-950 p-0.5 rounded-lg border border-white/10">
              <button
                type="button"
                onClick={() => exec('insertUnorderedList')}
                title="Bullet List"
                className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => exec('insertOrderedList')}
                title="Numbered List"
                className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center"
              >
                <ListOrdered className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => exec('removeFormat')}
                title="Clear Formatting"
                className="p-1.5 text-rose-400 hover:bg-rose-500/20 rounded cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center"
              >
                <RemoveFormatting className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ContentEditable Visual Input Area */}
          <div
            id={id}
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            onBlur={handleInput}
            style={{ minHeight }}
            className="w-full p-4 bg-slate-950 text-slate-100 text-xs sm:text-sm font-sans focus:outline-none custom-scrollbar leading-relaxed overflow-y-auto space-y-2 font-normal"
          />

          {/* Status Bar */}
          <div className="px-4 py-2 bg-slate-900/80 border-t border-white/5 text-[11px] text-slate-400 flex flex-wrap justify-between items-center gap-2">
            <span>Select any text and click heading or color buttons to format in real time.</span>
            <span className="font-mono text-indigo-400 font-semibold">{value.replace(/<[^>]*>?/gm, '').length} characters</span>
          </div>
        </div>
      ) : (
        /* Live Render Preview Tab */
        <div className="p-6 rounded-2xl border border-slate-300 dark:border-white/10 bg-slate-950 min-h-[320px] max-h-[500px] overflow-y-auto custom-scrollbar space-y-4 shadow-lg">
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-400 border-b border-white/10 pb-2 flex justify-between items-center">
            <span>Live Output Preview</span>
            <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold">Active View</span>
          </div>
          {value.trim() ? (
            <FormattedText content={value} className="text-sm leading-relaxed" />
          ) : (
            <p className="text-xs text-slate-500 italic">No description entered yet. Switch to Visual Editor tab to add content.</p>
          )}
        </div>
      )}
    </div>
  );
}
