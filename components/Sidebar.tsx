'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';

const Sidebar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const navItems = [
    { name: 'Dashboard', icon: 'dashboard', path: '/' },
    { name: 'Document Library', icon: 'folder_open', path: '/library' },
    { name: 'Exam Workspace', icon: 'smart_toy', path: '/workspace' },
    { name: 'Exam History', icon: 'history', path: '/history' },
    { name: 'Saved Answers', icon: 'bookmark', path: '/saved' },
  ];

  return (
    <aside className="flex w-72 flex-col justify-between border-r border-[#e7ebf3] bg-white p-4 transition-all duration-300 z-20 shrink-0 hidden md:flex">
      <div className="flex flex-col gap-8 h-full">
        {/* Brand */}
        <div className="flex items-center gap-3 px-2">
          <div className="flex items-center justify-center rounded-xl bg-primary/10 p-2">
            <span className="material-symbols-outlined text-primary text-3xl">school</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-text-main text-lg font-bold leading-normal">Nahad AI</h1>
            <p className="text-text-secondary text-xs font-medium leading-normal">Exam Solver</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2 flex-1">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => router.push(item.path)}
              className={`group flex items-center gap-3 px-3 py-3 rounded-lg transition-colors w-full text-left ${
                isActive(item.path)
                  ? 'bg-primary/10 text-primary'
                  : 'text-text-secondary hover:bg-[#f3f4f6] hover:text-text-main'
              }`}
            >
              <span className={`material-symbols-outlined ${isActive(item.path) ? 'filled' : ''}`}>
                {item.icon}
              </span>
              <span className={`text-sm ${isActive(item.path) ? 'font-semibold' : 'font-medium'}`}>
                {item.name}
              </span>
            </button>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="flex flex-col gap-2 mt-auto">
          <button className="group flex items-center gap-3 px-3 py-3 rounded-lg text-text-secondary hover:bg-[#f3f4f6] hover:text-text-main transition-colors w-full text-left">
            <span className="material-symbols-outlined">settings</span>
            <span className="text-sm font-medium">Settings</span>
          </button>
          
          <button 
            onClick={() => router.push('/workspace')}
            className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-12 bg-primary hover:bg-primary/90 text-white text-sm font-bold transition-all shadow-md shadow-primary/20"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            <span className="truncate">New Analysis</span>
          </button>

          <div className="mt-4 flex items-center gap-3 px-2 py-3 border-t border-[#e7ebf3]">
            <div 
              className="bg-center bg-no-repeat bg-cover rounded-full size-10 shrink-0 border-2 border-white shadow-sm bg-gray-200" 
              style={{backgroundImage: 'url("https://picsum.photos/200")'}}
            ></div>
            <div className="flex flex-col overflow-hidden">
              <p className="text-text-main text-sm font-semibold truncate">Ahmed Student</p>
              <p className="text-text-secondary text-xs truncate">student@nahad.edu</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
