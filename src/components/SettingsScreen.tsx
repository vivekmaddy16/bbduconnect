/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  Save, 
  LogOut, 
  CheckCircle, 
  User, 
  Bell, 
  Lock, 
  Clock, 
  ShieldAlert, 
  Laptop, 
  EyeOff, 
  Search, 
  Check, 
  HelpCircle,
  BellRing,
  Menu
} from 'lucide-react';
import { User as UserType } from '../types';

interface SettingsScreenProps {
  user: UserType;
  onUpdateUser: (updatedUser: Partial<UserType>) => void;
  onLogout: () => void;
  onToggleSidebar: () => void;
}

export default function SettingsScreen({ user, onUpdateUser, onLogout, onToggleSidebar }: SettingsScreenProps) {
  const [fullName, setFullName] = useState(user.name);
  const [bio, setBio] = useState(user.bio || '');
  const [availability, setAvailability] = useState(user.availability);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  
  // Toggle switches
  const [msgNotifications, setMsgNotifications] = useState(true);
  const [activitySummary, setActivitySummary] = useState(false);

  // Success toast state
  const [showToast, setShowToast] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Sync local state when user prop changes (e.g. after re-login)
  useEffect(() => {
    setFullName(user.name);
    setBio(user.bio || '');
    setAvailability(user.availability);
  }, [user.name, user.bio, user.availability]);

  const handleSaveChanges = () => {
    onUpdateUser({
      name: fullName,
      bio: bio,
      availability: availability
    });

    // Fire success toast
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const handleStatusChange = (status: 'Active' | 'Focus Mode' | 'Offline') => {
    setAvailability(status);
    setShowStatusDropdown(false);
  };

  return (
    <div className="md:ml-[280px] h-screen flex flex-col overflow-hidden bg-background">
      {/* Top Bar AppBar */}
      <header className="h-16 bg-surface border-b border-outline-variant flex justify-between items-center px-4 md:px-6 shrink-0 z-20">
        <div className="flex items-center gap-3 md:gap-4 flex-1 max-w-xl">
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-2 text-on-surface-variant hover:text-primary rounded-lg hover:bg-surface-container transition-colors focus:outline-none"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h2 className="text-sm font-bold text-primary hidden lg:block">Settings</h2>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-4 h-4" />
            <input 
              className="w-full h-10 pl-10 pr-4 bg-surface-container-low border border-outline-variant rounded-full text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none" 
              placeholder="Search settings..." 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="material-symbols-outlined text-on-surface-variant p-2 hover:bg-surface-container rounded-full hover:text-primary transition-colors focus:outline-none">
            <Bell className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Scrollable setting workspace */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="max-w-[960px] mx-auto space-y-6">
          
          {/* Profile Section: Bento-style Header */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Profile Card */}
            <div className="md:col-span-2 bg-surface border border-outline-variant rounded-xl p-6 shadow-xs relative overflow-hidden">
              <div className="flex flex-col sm:flex-row items-center gap-6 z-10 relative">
                <div className="relative group shrink-0">
                  <img 
                    className="w-24 h-24 rounded-full border-4 border-primary-fixed shadow-md object-cover" 
                    alt={user.name} 
                    src={user.avatar} 
                    referrerPolicy="no-referrer"
                  />
                  <button 
                    onClick={() => alert('Image uploading simulation activated! (Simulated)')}
                    className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full border-2 border-white hover:scale-110 transition-transform focus:outline-none"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex-1 space-y-3 text-center sm:text-left min-w-0">
                  <div>
                    <h3 className="text-lg font-bold text-on-background truncate">{user.name}</h3>
                    <p className="text-xs text-on-surface-variant font-medium">PhD Candidate • Distributed Systems</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start">
                    {user.tags?.map((tag, idx) => (
                      <span 
                        key={idx} 
                        className={`px-3 py-0.5 rounded-full text-[10px] font-bold ${
                          tag === 'Faculty' 
                            ? 'bg-primary-fixed text-on-primary-fixed' 
                            : tag === 'Subject Expert' 
                            ? 'bg-secondary-container text-on-secondary-container' 
                            : 'bg-tertiary-fixed text-on-tertiary-fixed'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Availability status Quick Card */}
            <div className="bg-surface border border-outline-variant rounded-xl p-6 shadow-xs flex flex-col justify-between relative">
              <h4 className="text-xs font-bold text-on-background uppercase tracking-wider">Status</h4>
              
              <div className="space-y-4 pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-on-surface-variant font-semibold">Availability</span>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2.5 h-2.5 rounded-full border border-white shrink-0 ${
                      availability === 'Active' 
                        ? 'bg-secondary' 
                        : availability === 'Focus Mode' 
                        ? 'bg-tertiary' 
                        : 'bg-outline'
                    }`} />
                    <span className={`text-xs font-bold ${
                      availability === 'Active' 
                        ? 'text-on-secondary-container' 
                        : availability === 'Focus Mode' 
                        ? 'text-tertiary-fixed-dim' 
                        : 'text-on-surface-variant'
                    }`}>
                      {availability}
                    </span>
                  </div>
                </div>

                <div className="relative">
                  <button 
                    onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                    className="w-full py-2 bg-surface-container-high rounded-lg text-xs font-bold hover:bg-outline-variant/30 transition-colors focus:outline-none"
                  >
                    Edit Status
                  </button>

                  {/* Status Dropdown */}
                  {showStatusDropdown && (
                    <div className="absolute top-10 right-0 left-0 bg-surface border border-outline-variant rounded-lg shadow-xl z-30 p-1.5 space-y-1">
                      {(['Active', 'Focus Mode', 'Offline'] as const).map((st) => (
                        <button
                          key={st}
                          onClick={() => handleStatusChange(st)}
                          className="w-full px-3 py-2 text-left text-xs font-semibold rounded-md hover:bg-surface-container-low transition-colors flex items-center justify-between focus:outline-none"
                        >
                          <span className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${
                              st === 'Active' ? 'bg-secondary' : st === 'Focus Mode' ? 'bg-tertiary' : 'bg-outline'
                            }`} />
                            {st}
                          </span>
                          {availability === st && <Check className="w-3.5 h-3.5 text-primary" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Personal Information Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Basic Info input card */}
            <div className="bg-surface border border-outline-variant rounded-xl p-6 shadow-xs space-y-4">
              <h4 className="text-xs font-bold text-on-background flex items-center gap-2 uppercase tracking-wider">
                <User className="text-primary w-4 h-4" />
                Personal Information
              </h4>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-on-surface-variant">Full Name</label>
                  <input 
                    className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-2.5 text-xs font-medium focus:ring-2 focus:ring-primary focus:border-primary outline-none" 
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-on-surface-variant">Academic Bio</label>
                  <textarea 
                    className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-2.5 text-xs font-medium focus:ring-2 focus:ring-primary focus:border-primary resize-none outline-none" 
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Notification Preferences */}
            <div className="bg-surface border border-outline-variant rounded-xl p-6 shadow-xs space-y-4">
              <h4 className="text-xs font-bold text-on-background flex items-center gap-2 uppercase tracking-wider">
                <BellRing className="text-primary w-4 h-4" />
                Notification Preferences
              </h4>
              
              <div className="space-y-4 divide-y divide-outline-variant/30">
                {/* Switch 1 */}
                <div className="flex items-center justify-between py-1">
                  <div className="max-w-[75%]">
                    <p className="text-xs text-on-background font-bold">Message Notifications</p>
                    <p className="text-[10px] text-on-surface-variant mt-0.5">Receive real-time sound and banner alerts for new research chat lines.</p>
                  </div>
                  <button 
                    onClick={() => setMsgNotifications(!msgNotifications)}
                    className={`w-10 h-6 rounded-full p-0.5 transition-colors focus:outline-none ${msgNotifications ? 'bg-primary' : 'bg-surface-container-highest'}`}
                    type="button"
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform ${msgNotifications ? 'translate-x-4' : 'translate-x-0'}`} />
                  </button>
                </div>

                {/* Switch 2 */}
                <div className="flex items-center justify-between pt-3">
                  <div className="max-w-[75%]">
                    <p className="text-xs text-on-background font-bold">Activity Summary Digest</p>
                    <p className="text-[10px] text-on-surface-variant mt-0.5">Opt into receiving a curated weekly digest of publications and academic files.</p>
                  </div>
                  <button 
                    onClick={() => setActivitySummary(!activitySummary)}
                    className={`w-10 h-6 rounded-full p-0.5 transition-colors focus:outline-none ${activitySummary ? 'bg-primary' : 'bg-surface-container-highest'}`}
                    type="button"
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform ${activitySummary ? 'translate-x-4' : 'translate-x-0'}`} />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Privacy & Active Sessions (JWT Focus) */}
          <section className="bg-surface border border-outline-variant rounded-xl p-6 shadow-xs space-y-4">
            <h4 className="text-xs font-bold text-on-background flex items-center gap-2 uppercase tracking-wider">
              <Lock className="text-primary w-4 h-4" />
              Privacy & Active Sessions
            </h4>
            
            <div className="space-y-4">
              <div className="p-3 bg-surface-container-low border border-outline-variant rounded-lg flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Laptop className="text-primary-container w-5 h-5" />
                  <div>
                    <p className="text-xs text-on-background font-bold">Current JWT Session</p>
                    <p className="text-[10px] text-on-surface-variant mt-0.5">Chrome on MacOS • 192.168.1.1</p>
                  </div>
                </div>
                <button 
                  onClick={() => alert('Simulated Session Revocation: Token invalidated.')}
                  className="px-3 py-1 bg-error-container text-on-error-container hover:bg-error hover:text-white rounded-lg text-xs font-bold transition-colors focus:outline-none"
                  type="button"
                >
                  Revoke Session
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="flex items-start gap-3">
                  <Clock className="text-on-tertiary-container w-5 h-5 shrink-0" />
                  <div>
                    <p className="text-xs text-on-background font-bold">Auto-Logout Timer</p>
                    <p className="text-[10px] text-on-surface-variant leading-relaxed mt-0.5">
                      Automatically invalidates JWT tokens and requires re-authentication after 24 hours of inactivity.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <EyeOff className="text-on-secondary-container w-5 h-5 shrink-0" />
                  <div>
                    <p className="text-xs text-on-background font-bold">Profile Privacy Shield</p>
                    <p className="text-[10px] text-on-surface-variant leading-relaxed mt-0.5">
                      Restrict students and non-verified visitors from auditing your unpublished drafts and notes in the vaults.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Footer Actions */}
          <section className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
            <button 
              onClick={handleSaveChanges}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white hover:opacity-90 active:scale-95 transition-all rounded-xl text-xs font-bold shadow-md focus:outline-none"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
            <button 
              onClick={onLogout}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 text-error border border-error-container rounded-xl text-xs font-bold hover:bg-error-container transition-all active:scale-95 focus:outline-none"
            >
              <LogOut className="w-4 h-4" />
              Log Out
            </button>
          </section>

        </div>
      </div>

      {/* Floating Toast Notification */}
      <div 
        className={`fixed bottom-6 right-6 bg-inverse-surface text-inverse-on-surface px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 transition-all duration-500 z-50 ${
          showToast ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'
        }`}
      >
        <CheckCircle className="text-secondary w-5 h-5" />
        <p className="text-xs font-bold">Settings updated successfully</p>
      </div>
    </div>
  );
}
