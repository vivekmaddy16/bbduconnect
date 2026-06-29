/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
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
  Menu,
  Loader2
} from 'lucide-react';
import { User as UserType } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';

interface SettingsScreenProps {
  user: UserType;
  onToggleSidebar: () => void;
}

export default function SettingsScreen({ user, onToggleSidebar }: SettingsScreenProps) {
  const { logout, updateProfile } = useAuth();
  
  const [fullName, setFullName] = useState(user.name);
  const [bio, setBio] = useState(user.bio || '');
  const [availability, setAvailability] = useState(user.availability);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  
  // Toggle switches
  const [msgNotifications, setMsgNotifications] = useState(true);
  const [activitySummary, setActivitySummary] = useState(false);

  // Status flags
  const [showToast, setShowToast] = useState(false);
  const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Sync local state when user prop changes (e.g. after re-login)
  useEffect(() => {
    setFullName(user.name);
    setBio(user.bio || '');
    setAvailability(user.availability);
  }, [user.name, user.bio, user.availability]);

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      await updateProfile({
        name: fullName,
        bio: bio,
        availability: availability
      });

      // Fire success toast
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } catch (err) {
      console.error(err);
      alert('Failed to save profile changes.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleStatusChange = async (status: 'Active' | 'Focus Mode' | 'Offline') => {
    setAvailability(status);
    setShowStatusDropdown(false);
    try {
      await updateProfile({ availability: status });
    } catch (err) {
      console.error(err);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUpdatingAvatar(true);
    try {
      const avatarRef = ref(storage, `avatars/${user.id}/profile_${Date.now()}`);
      const snapshot = await uploadBytes(avatarRef, file);
      const url = await getDownloadURL(snapshot.ref);
      
      await updateProfile({ avatar: url });
      alert('Profile avatar updated successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to upload and update profile avatar.');
    } finally {
      setIsUpdatingAvatar(false);
    }
  };

  const handleSignOutClick = async () => {
    try {
      await logout();
    } catch (err) {
      console.error(err);
      alert('Failed to log out.');
    }
  };

  return (
    <div className="md:ml-[280px] h-screen flex flex-col overflow-hidden bg-background text-on-background">
      {/* Hidden Avatar input file */}
      <input 
        type="file" 
        accept="image/*" 
        ref={avatarInputRef} 
        onChange={handleAvatarChange} 
        className="hidden" 
      />

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
                  {user.avatar ? (
                    <img 
                      className="w-24 h-24 rounded-full border-4 border-primary-fixed shadow-md object-cover" 
                      alt={user.name} 
                      src={user.avatar} 
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full border-4 border-primary-fixed shadow-md bg-primary-container text-on-primary-container font-bold text-3xl flex items-center justify-center">
                      {user.name.charAt(0)}
                    </div>
                  )}
                  <button 
                    onClick={() => !isUpdatingAvatar && avatarInputRef.current?.click()}
                    className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full border-2 border-white hover:scale-110 transition-transform focus:outline-none disabled:opacity-50"
                    disabled={isUpdatingAvatar}
                  >
                    {isUpdatingAvatar ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Camera className="w-4 h-4" />
                    )}
                  </button>
                </div>
                
                <div className="flex-1 space-y-3 text-center sm:text-left min-w-0">
                  <div>
                    <h3 className="text-lg font-bold text-on-background truncate">{user.name}</h3>
                    <p className="text-xs text-on-surface-variant font-medium">
                      {user.role} | {user.department || 'Academic Department'}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start">
                    {user.tags?.map((tag, idx) => (
                      <span 
                        key={idx} 
                        className="px-3 py-0.5 rounded-full text-[10px] font-bold bg-secondary-container text-on-secondary-container"
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
                          className="w-full px-3 py-2 text-left text-xs font-semibold rounded-md hover:bg-surface-container-low transition-colors flex items-center justify-between focus:outline-none text-on-surface"
                        >
                          <span className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${
                              st === 'Active' ? 'bg-secondary' : st === 'Focus Mode' ? 'bg-tertiary' : 'bg-outline'
                            }`} />
                            {st}
                          </span>
                          {availability === st && <Check className="w-4 h-4 text-primary" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Bento-style details configuration grid */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Profile Fields updates */}
            <div className="md:col-span-2 bg-surface border border-outline-variant rounded-xl p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-primary flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </h3>
              
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-on-surface-variant block">Full Name</label>
                  <input 
                    type="text" 
                    className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-primary focus:border-primary outline-none text-on-surface"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-on-surface-variant block">Biography</label>
                  <textarea 
                    rows={4}
                    className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-primary focus:border-primary outline-none text-on-surface resize-none"
                    placeholder="Tell your academic peers about yourself..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button 
                  onClick={handleSaveChanges}
                  disabled={isSaving}
                  className="px-5 py-2.5 bg-primary disabled:opacity-50 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-md hover:bg-primary/95 transition-all active:scale-95 focus:outline-none"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Save Changes
                </button>
              </div>
            </div>

            {/* Notification and Preferences settings block */}
            <div className="bg-surface border border-outline-variant rounded-xl p-6 shadow-xs flex flex-col justify-between">
              <div className="space-y-6">
                <h3 className="text-sm font-bold text-primary flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Preferences
                </h3>

                <div className="space-y-4">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <p className="text-xs font-bold text-on-surface">Message Notifications</p>
                      <p className="text-[10px] text-on-surface-variant mt-0.5">Alert on direct messages</p>
                    </div>
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 text-primary bg-surface-container border-outline-variant rounded focus:ring-primary"
                      checked={msgNotifications}
                      onChange={(e) => setMsgNotifications(e.target.checked)}
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <p className="text-xs font-bold text-on-surface">Activity Summaries</p>
                      <p className="text-[10px] text-on-surface-variant mt-0.5">Weekly email brief</p>
                    </div>
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 text-primary bg-surface-container border-outline-variant rounded focus:ring-primary"
                      checked={activitySummary}
                      onChange={(e) => setActivitySummary(e.target.checked)}
                    />
                  </label>
                </div>
              </div>

              <div className="pt-6 border-t border-outline-variant/30 mt-6">
                <button 
                  onClick={handleSignOutClick}
                  className="w-full py-2.5 border border-error text-error hover:bg-error-container hover:text-on-error-container rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors focus:outline-none"
                >
                  <LogOut className="w-4 h-4" />
                  Log Out
                </button>
              </div>
            </div>
          </section>

        </div>
      </div>

      {/* Floating Success Toast notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 bg-secondary text-on-secondary px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 border border-secondary border-opacity-20 animate-fade-in z-50">
          <CheckCircle className="w-5 h-5 text-on-secondary" />
          <span className="text-xs font-bold">Profile updated successfully!</span>
        </div>
      )}
    </div>
  );
}
