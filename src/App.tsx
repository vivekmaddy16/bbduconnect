/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppView } from './types';
import { useAuth } from './contexts/AuthContext';
import LoginScreen from './components/LoginScreen';
import Sidebar from './components/Sidebar';
import MessagesScreen from './components/MessagesScreen';
import FilesScreen from './components/FilesScreen';
import CommunityScreen from './components/CommunityScreen';
import SettingsScreen from './components/SettingsScreen';
import { Loader2 } from 'lucide-react';

export default function App() {
  const { user, userProfile, loading } = useAuth();
  const [currentView, setCurrentView] = useState<AppView>('messages');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const handleToggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const handleViewChange = (view: AppView) => {
    setCurrentView(view);
    setSidebarOpen(false);
  };

  // Show premium loading spinner while Firebase Auth is initializing
  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-sm font-semibold text-on-surface-variant animate-pulse">
          Initializing BbduConnect Secure Session...
        </p>
      </div>
    );
  }

  // If user or their Firestore profile isn't loaded, show the login/signup screen
  if (!user || !userProfile) {
    return <LoginScreen />;
  }

  return (
    <div className="min-h-screen bg-background text-on-background flex overflow-hidden">
      {/* Persistent left sidebar navigation */}
      <Sidebar 
        currentView={currentView} 
        onViewChange={handleViewChange} 
        user={userProfile}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main app panels based on view selection */}
      <div className="flex-1 min-w-0 h-screen overflow-hidden">
        {currentView === 'messages' && (
          <MessagesScreen user={userProfile} onToggleSidebar={handleToggleSidebar} />
        )}
        {currentView === 'files' && (
          <FilesScreen user={userProfile} onToggleSidebar={handleToggleSidebar} />
        )}
        {currentView === 'community' && (
          <CommunityScreen user={userProfile} onToggleSidebar={handleToggleSidebar} />
        )}
        {currentView === 'settings' && (
          <SettingsScreen 
            user={userProfile} 
            onToggleSidebar={handleToggleSidebar}
          />
        )}
      </div>
    </div>
  );
}
