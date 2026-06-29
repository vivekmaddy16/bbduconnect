/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '../firebase';
import { User } from '../types';

interface AuthContextType {
  user: FirebaseUser | null;
  userProfile: User | null;
  loading: boolean;
  isMockMode: boolean;
  signup: (email: string, password: string, name: string, department: string, role: User['role']) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<Omit<User, 'id' | 'email' | 'role'>>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      // Offline LocalStorage Auth simulation
      const mockUid = localStorage.getItem('mock_user_uid');
      const mockProfileJson = localStorage.getItem('mock_user_profile');
      
      if (mockUid && mockProfileJson) {
        setUser({ uid: mockUid } as FirebaseUser);
        setUserProfile(JSON.parse(mockProfileJson) as User);
      }
      setLoading(false);
      return;
    }

    let unsubscribeProfile: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      // Clean up previous profile listener if any
      if (unsubscribeProfile) {
        unsubscribeProfile();
        unsubscribeProfile = null;
      }

      if (currentUser) {
        // Set up real-time listener for user profile doc
        const userRef = doc(db, 'users', currentUser.uid);
        
        unsubscribeProfile = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            setUserProfile(docSnap.data() as User);
          } else {
            setUserProfile(null);
          }
          setLoading(false);
        }, (error) => {
          console.error("Error listening to user profile:", error);
          setLoading(false);
        });
      } else {
        setUserProfile(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) unsubscribeProfile();
    };
  }, []);

  const signup = async (
    email: string, 
    password: string, 
    name: string, 
    department: string, 
    role: User['role']
  ) => {
    const avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`;

    if (!isFirebaseConfigured) {
      // Save locally
      const mockUid = 'mock_' + Date.now();
      const newMockProfile: User = {
        id: mockUid,
        name,
        email,
        department,
        role,
        avatar: avatarUrl,
        bio: 'Academic scholar.',
        tags: role === 'STUDENT' ? ['Student'] : ['Faculty', 'Advisor'],
        availability: 'Active'
      };

      // Add to list of registered mock users
      const usersJson = localStorage.getItem('mock_users') || '[]';
      const users = JSON.parse(usersJson);
      users.push(newMockProfile);
      localStorage.setItem('mock_users', JSON.stringify(users));

      // Set session
      localStorage.setItem('mock_user_uid', mockUid);
      localStorage.setItem('mock_user_profile', JSON.stringify(newMockProfile));
      
      setUser({ uid: mockUid } as FirebaseUser);
      setUserProfile(newMockProfile);
      return;
    }

    // Real Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    const newProfile: User = {
      id: firebaseUser.uid,
      name,
      email,
      department,
      role,
      avatar: avatarUrl,
      bio: '',
      tags: [],
      availability: 'Active',
      createdAt: serverTimestamp()
    };

    await setDoc(doc(db, 'users', firebaseUser.uid), newProfile);
  };

  const login = async (email: string, password: string) => {
    if (!isFirebaseConfigured) {
      // Local check
      const usersJson = localStorage.getItem('mock_users') || '[]';
      const users = JSON.parse(usersJson);
      const matchedUser = users.find((u: User) => u.email.toLowerCase() === email.trim().toLowerCase());
      
      if (matchedUser) {
        localStorage.setItem('mock_user_uid', matchedUser.id);
        localStorage.setItem('mock_user_profile', JSON.stringify(matchedUser));
        setUser({ uid: matchedUser.id } as FirebaseUser);
        setUserProfile(matchedUser);
      } else {
        // Build a default profile for first-time login of Sarah/Marcus/Admin mock accounts
        const name = email.split('@')[0];
        const displayName = name.charAt(0).toUpperCase() + name.slice(1);
        const isFaculty = email.toLowerCase().includes('sarah') || email.toLowerCase().includes('faculty') || email.toLowerCase().includes('advisor');
        const isAdmin = email.toLowerCase().includes('admin');
        const userRole = isFaculty ? 'FACULTY ADVISOR' : isAdmin ? 'ADMIN' : 'STUDENT';
        const avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(displayName)}`;

        const newMockProfile: User = {
          id: 'mock_' + (isFaculty ? 'sarah' : isAdmin ? 'admin' : 'alex'),
          name: isFaculty ? 'Dr. Sarah Miller' : isAdmin ? 'System Admin' : displayName,
          email,
          department: isFaculty ? 'Data Science' : 'Computer Science',
          role: userRole,
          avatar: avatarUrl,
          bio: isFaculty ? 'Faculty Advisor, Data Science' : 'Academic Scholar',
          tags: isFaculty ? ['Faculty', 'Subject Expert'] : ['Student'],
          availability: 'Active'
        };

        users.push(newMockProfile);
        localStorage.setItem('mock_users', JSON.stringify(users));
        localStorage.setItem('mock_user_uid', newMockProfile.id);
        localStorage.setItem('mock_user_profile', JSON.stringify(newMockProfile));
        
        setUser({ uid: newMockProfile.id } as FirebaseUser);
        setUserProfile(newMockProfile);
      }
      return;
    }

    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    if (!isFirebaseConfigured) {
      localStorage.removeItem('mock_user_uid');
      localStorage.removeItem('mock_user_profile');
      setUser(null);
      setUserProfile(null);
      return;
    }

    await signOut(auth);
  };

  const updateProfile = async (updates: Partial<Omit<User, 'id' | 'email' | 'role'>>) => {
    if (!user || !userProfile) throw new Error('No user is logged in');
    
    if (!isFirebaseConfigured) {
      const updatedProfile = { ...userProfile, ...updates };
      localStorage.setItem('mock_user_profile', JSON.stringify(updatedProfile));
      setUserProfile(updatedProfile);

      // Update in users registry
      const usersJson = localStorage.getItem('mock_users') || '[]';
      const users = JSON.parse(usersJson);
      const index = users.findIndex((u: User) => u.id === userProfile.id);
      if (index !== -1) {
        users[index] = { ...users[index], ...updates };
        localStorage.setItem('mock_users', JSON.stringify(users));
      }
      return;
    }

    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, updates);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      userProfile, 
      loading, 
      isMockMode: !isFirebaseConfigured,
      signup, 
      login, 
      logout, 
      updateProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
