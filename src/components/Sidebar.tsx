/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  GraduationCap, 
  MessageSquare, 
  FolderOpen, 
  Users, 
  Settings,
  User,
  X
} from 'lucide-react';
import { AppView, User as UserType } from '../types';

interface SidebarProps {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
  user: UserType;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ currentView, onViewChange, user, isOpen, onClose }: SidebarProps) {
  const navItems = [
    { id: 'messages' as AppView, label: 'Messages', icon: MessageSquare },
    { id: 'files' as AppView, label: 'Files', icon: FolderOpen },
    { id: 'community' as AppView, label: 'Community', icon: Users },
    { id: 'settings' as AppView, label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-40 md:hidden" 
          onClick={onClose}
        />
      )}

      <aside className={`fixed left-0 top-0 h-full w-[280px] bg-surface border-r border-outline-variant shadow-sm flex flex-col py-6 px-4 z-50 transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0`}>
        {/* Brand Header */}
        <div className="flex items-center justify-between mb-8 px-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white shadow-sm">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-primary tracking-tight">BbduConnect</h1>
              <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider">Academic Hub</p>
            </div>
          </div>
          {/* Close button - mobile only */}
          <button
            onClick={onClose}
            className="md:hidden p-1.5 text-on-surface-variant hover:text-on-surface rounded-full hover:bg-surface-container transition-colors focus:outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 flex flex-col gap-1">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`flex items-center gap-3.5 p-3 rounded-xl text-left text-sm font-medium transition-all duration-200 focus:outline-none ${
                  isActive
                    ? 'bg-primary-container text-on-primary-container border-l-4 border-primary shadow-sm font-semibold'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface active:scale-95'
                }`}
              >
                <IconComponent className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-on-surface-variant'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User profile widget at the bottom */}
        <div className="mt-auto pt-4 border-t border-outline-variant">
          <button
            onClick={() => onViewChange('settings')}
            className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-surface-container-high transition-all text-left focus:outline-none"
          >
            <div className="relative">
              {user.avatar ? (
                <img 
                  className="w-10 h-10 rounded-full border-2 border-primary-fixed object-cover" 
                  alt={user.name} 
                  src={user.avatar} 
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-primary font-bold">
                  <User className="w-5 h-5" />
                </div>
              )}
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-secondary border-2 border-surface-container-lowest rounded-full"></span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-on-surface truncate">{user.name}</p>
              <p className="text-[10px] text-on-surface-variant truncate font-medium">{user.department}</p>
            </div>
          </button>
        </div>
      </aside>
    </>
  );
}
