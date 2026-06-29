/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  serverTimestamp,
  doc,
  getDoc,
  deleteDoc
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase';
import { Channel, User } from '../types';
import { initialChannels, initialDMs } from '../mockData';

export function useChannels(currentUserId: string | undefined) {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [dms, setDMs] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUserId) {
      setChannels([]);
      setDMs([]);
      setLoading(false);
      return;
    }

    if (!isFirebaseConfigured) {
      // Local Storage Offline channels listener
      const loadLocalChannels = () => {
        let localChansJson = localStorage.getItem('mock_channels_list');
        let localDmsJson = localStorage.getItem('mock_dms_list');

        if (!localChansJson) {
          localStorage.setItem('mock_channels_list', JSON.stringify(initialChannels));
          localChansJson = JSON.stringify(initialChannels);
        }
        if (!localDmsJson) {
          localStorage.setItem('mock_dms_list', JSON.stringify(initialDMs));
          localDmsJson = JSON.stringify(initialDMs);
        }

        setChannels(JSON.parse(localChansJson));
        setDMs(JSON.parse(localDmsJson));
        setLoading(false);
      };

      loadLocalChannels();

      // Listen for local changes across tabs or events
      window.addEventListener('storage', loadLocalChannels);
      return () => window.removeEventListener('storage', loadLocalChannels);
    }

    // Real Firebase listener
    setLoading(true);

    const channelsQuery = query(
      collection(db, 'channels'),
      where('isDM', '==', false)
    );

    const unsubscribeChannels = onSnapshot(channelsQuery, async (snapshot) => {
      if (snapshot.empty) {
        try {
          await addDoc(collection(db, 'channels'), {
            name: 'general-announcements',
            description: 'University-wide updates, events, and essential announcements',
            isDM: false,
            createdAt: serverTimestamp(),
            members: []
          });
          await addDoc(collection(db, 'channels'), {
            name: 'study-group-alpha',
            description: 'Alpha study circle for examinations and quiz preparations',
            isDM: false,
            createdAt: serverTimestamp(),
            members: []
          });
        } catch (err) {
          console.error("Error seeding default channels:", err);
        }
        return;
      }

      const channelList: Channel[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        channelList.push({
          id: doc.id,
          name: data.name || '',
          description: data.description || '',
          isDM: false,
          avatar: data.avatar || '',
          unreadCount: 0,
          lastMessageAt: data.lastMessageAt || 0
        });
      });
      setChannels(channelList);
    }, (error) => {
      console.error("Error fetching channels:", error);
    });

    const dmsQuery = query(
      collection(db, 'channels'),
      where('isDM', '==', true),
      where('members', 'array-contains', currentUserId)
    );

    const unsubscribeDMs = onSnapshot(dmsQuery, async (snapshot) => {
      const dmPromises = snapshot.docs.map(async (snapshotDoc) => {
        const data = snapshotDoc.data();
        const members: string[] = data.members || [];
        const otherUserId = members.find(m => m !== currentUserId);
        
        let dmName = 'Unknown Scholar';
        let dmAvatar = '';
        let dmStatus: 'active' | 'offline' = 'offline';
        let dmRole = 'STUDENT';
        
        if (otherUserId) {
          const userDoc = await getDoc(doc(db, 'users', otherUserId));
          if (userDoc.exists()) {
            const userData = userDoc.data() as User;
            dmName = userData.name;
            dmAvatar = userData.avatar;
            dmStatus = userData.availability === 'Active' ? 'active' : 'offline';
            dmRole = userData.role;
          }
        }
        
        return {
          id: snapshotDoc.id,
          name: dmName,
          description: dmRole,
          isDM: true,
          avatar: dmAvatar,
          status: dmStatus,
          role: dmRole,
          lastMessageSnippet: data.lastMessageSnippet || '',
          lastMessageAt: data.lastMessageAt || 0
        } as Channel;
      });

      const dmList = await Promise.all(dmPromises);
      setDMs(dmList);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching DMs:", error);
      setLoading(false);
    });

    return () => {
      unsubscribeChannels();
      unsubscribeDMs();
    };
  }, [currentUserId]);

  const createChannel = async (name: string, description: string) => {
    if (!currentUserId) throw new Error('User not logged in');
    const cleanName = name.trim().toLowerCase().replace(/\s+/g, '-');
    
    if (!isFirebaseConfigured) {
      const newChan: Channel = {
        id: 'ch_' + Date.now(),
        name: cleanName,
        description,
        isDM: false,
        unreadCount: 0
      };

      const updated = [...channels, newChan];
      localStorage.setItem('mock_channels_list', JSON.stringify(updated));
      setChannels(updated);
      return;
    }

    await addDoc(collection(db, 'channels'), {
      name: cleanName,
      description,
      isDM: false,
      createdBy: currentUserId,
      createdAt: serverTimestamp(),
      members: [currentUserId]
    });
  };

  const createDM = async (otherUser: User) => {
    if (!currentUserId) throw new Error('User not logged in');
    
    if (!isFirebaseConfigured) {
      // Check if DM exists
      const existing = dms.find(d => d.name === otherUser.name);
      if (existing) return;

      const newDm: Channel = {
        id: 'dm_' + Date.now(),
        name: otherUser.name,
        description: otherUser.role,
        isDM: true,
        avatar: otherUser.avatar,
        status: otherUser.availability === 'Active' ? 'active' : 'offline',
        role: otherUser.role,
        lastMessageSnippet: 'Started a new direct thread.'
      };

      const updated = [...dms, newDm];
      localStorage.setItem('mock_dms_list', JSON.stringify(updated));
      setDMs(updated);
      return;
    }

    await addDoc(collection(db, 'channels'), {
      isDM: true,
      members: [currentUserId, otherUser.id],
      createdAt: serverTimestamp(),
      lastMessageSnippet: ''
    });
  };

  const deleteChannel = async (channelId: string) => {
    if (!currentUserId) throw new Error('User not logged in');

    if (!isFirebaseConfigured) {
      const updated = channels.filter(c => c.id !== channelId);
      localStorage.setItem('mock_channels_list', JSON.stringify(updated));
      setChannels(updated);
      window.dispatchEvent(new Event('storage'));
      return;
    }

    await deleteDoc(doc(db, 'channels', channelId));
  };

  return { channels, dms, loading, createChannel, createDM, deleteChannel };
}
