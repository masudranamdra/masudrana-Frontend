import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#090D1A] flex flex-col items-center justify-center space-y-4 px-4">
      <div className="relative flex items-center justify-center">
        <div className="w-16 h-16 rounded-full border-4 border-slate-800 border-t-blue-500 animate-spin" />
        <div className="absolute w-8 h-8 rounded-full border-4 border-slate-800 border-b-indigo-500 animate-spin [animation-direction:reverse]" />
      </div>
      <p className="text-slate-400 font-mono text-xs tracking-widest uppercase animate-pulse">
        Loading Masud Rana Portfolio...
      </p>
    </div>
  );
}
