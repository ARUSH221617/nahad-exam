'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

const Header: React.FC = () => {
  const pathname = usePathname();

  const getTitle = () => {
    switch(pathname) {
      case '/': return 'Dashboard';
      case '/library': return 'Document Library';
      case '/workspace': return 'Exam Workspace';
      case '/history': return 'Exam History';
      default: return 'Nahad AI';
    }
  };

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between whitespace-nowrap bg-white/90 backdrop-blur-md px-8 py-4 border-b border-[#e7ebf3]">
      <div className="flex items-center gap-4">
        <h2 className="text-text-main text-2xl font-bold leading-tight tracking-[-0.015em]">
          {getTitle()}
        </h2>
      </div>
      <div className="flex items-center gap-6">
        {/* Search */}
        <div className="hidden md:flex w-full max-w-sm items-center rounded-lg bg-white border border-[#e7ebf3] h-10 px-3 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
          <span className="material-symbols-outlined text-text-secondary">search</span>
          <input 
            className="w-full bg-transparent border-none text-sm text-text-main placeholder-text-secondary focus:ring-0 px-3 outline-none" 
            placeholder="Search questions or files..." 
            type="text"
          />
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-3">
          <button className="flex items-center justify-center size-10 rounded-full bg-white text-text-main hover:bg-gray-50 border border-[#e7ebf3] transition-colors relative">
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            <span className="absolute top-2 right-2.5 size-2 rounded-full bg-red-500 ring-2 ring-white"></span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
