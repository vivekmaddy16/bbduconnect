/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { User, AppView } from './types';
import { currentUser } from './data';
import LoginScreen from './components/LoginScreen';
import Sidebar from './components/Sidebar';
import MessagesScreen from './components/MessagesScreen';
import FilesScreen from './components/FilesScreen';
import CommunityScreen from './components/CommunityScreen';
import SettingsScreen from './components/SettingsScreen';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User>(currentUser);
  const [currentView, setCurrentView] = useState<AppView>('messages');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // Handle successful login
  const handleLoginSuccess = (loginUser: Partial<User>) => {
    setUser(prev => ({
      ...prev,
      ...loginUser
    }));
    setIsAuthenticated(true);
    setCurrentView('messages');
  };

  // Handle user logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setSidebarOpen(false);
  };

  // Handle user metadata update (e.g. from Settings tab)
  const handleUpdateUser = (updatedUserFields: Partial<User>) => {
    setUser(prev => ({
      ...prev,
      ...updatedUserFields
    }));
  };

  const handleToggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  // Close sidebar when view changes on mobile
  const handleViewChange = (view: AppView) => {
    setCurrentView(view);
    setSidebarOpen(false);
  };

  if (!isAuthenticated) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-background text-on-background flex overflow-hidden">
      {/* Persistent left sidebar navigation */}
      <Sidebar 
        currentView={currentView} 
        onViewChange={handleViewChange} 
        user={user}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main app panels based on view selection */}
      <div className="flex-1 min-w-0 h-screen overflow-hidden">
        {currentView === 'messages' && (
          <MessagesScreen user={user} onToggleSidebar={handleToggleSidebar} />
        )}
        {currentView === 'files' && (
          <FilesScreen user={user} onToggleSidebar={handleToggleSidebar} />
        )}
        {currentView === 'community' && (
          <CommunityScreen user={user} onToggleSidebar={handleToggleSidebar} />
        )}
        {currentView === 'settings' && (
          <SettingsScreen 
            user={user} 
            onUpdateUser={handleUpdateUser} 
            onLogout={handleLogout}
            onToggleSidebar={handleToggleSidebar}
          />
        )}
      </div>
    </div>
  );
}
