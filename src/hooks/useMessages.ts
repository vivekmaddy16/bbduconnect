/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  updateDoc,
  doc,
  serverTimestamp,
  deleteDoc
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase';
import { Message, User, AttachmentFile, Channel } from '../types';
import { initialMessages } from '../mockData';

export function useMessages(channelId: string | undefined, currentUserProfile: User | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!channelId || !currentUserProfile) {
      setMessages([]);
      setLoading(false);
      return;
    }

    if (!isFirebaseConfigured) {
      // Local Storage Offline Messages listener
      const loadLocalMessages = () => {
        const key = `mock_messages_${channelId}`;
        let localMsgsJson = localStorage.getItem(key);

        if (!localMsgsJson) {
          // Check if we have initial mock data for this channel
          const seed = initialMessages[channelId] || [];
          localStorage.setItem(key, JSON.stringify(seed));
          localMsgsJson = JSON.stringify(seed);
        }

        setMessages(JSON.parse(localMsgsJson));
        setLoading(false);
      };

      loadLocalMessages();

      window.addEventListener('storage', loadLocalMessages);
      return () => window.removeEventListener('storage', loadLocalMessages);
    }

    // Real Firebase listener
    setLoading(true);

    const messagesQuery = query(
      collection(db, 'channels', channelId, 'messages'),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const messageList: Message[] = [];
      snapshot.forEach((snapshotDoc) => {
        const data = snapshotDoc.data();
        messageList.push({
          id: snapshotDoc.id,
          channelId: channelId,
          senderId: data.senderId || '',
          senderName: data.senderName || '',
          senderAvatar: data.senderAvatar || '',
          senderRole: data.senderRole || '',
          text: data.text || '',
          timestamp: data.timestamp,
          fileAttachment: data.fileAttachment,
          imageAttachment: data.imageAttachment
        } as Message);
      });
      setMessages(messageList);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching messages:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [channelId, currentUserProfile]);

  const sendMessage = async (
    text: string, 
    fileAttachment?: AttachmentFile, 
    imageAttachment?: string
  ) => {
    if (!channelId || !currentUserProfile) throw new Error('Cannot send message: configuration missing');

    const formattedTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (!isFirebaseConfigured) {
      // Local Storage Message write
      const newMsg: Message = {
        id: 'msg_' + Date.now(),
        channelId,
        senderId: currentUserProfile.id,
        senderName: currentUserProfile.name,
        senderAvatar: currentUserProfile.avatar,
        senderRole: currentUserProfile.role,
        text,
        timestamp: formattedTime,
        fileAttachment,
        imageAttachment
      };

      const key = `mock_messages_${channelId}`;
      const currentList = JSON.parse(localStorage.getItem(key) || '[]');
      const updatedList = [...currentList, newMsg];
      localStorage.setItem(key, JSON.stringify(updatedList));
      setMessages(updatedList);

      // Trigger a simulated reply in offline mode after 1.5s to keep UI interactive
      setTimeout(() => {
        const responses = [
          "That looks perfect, let me review the details.",
          "Excellent progress! I think we should test these benchmarks.",
          "Should we schedule our sync meeting for tomorrow at 2:00 PM?",
          "I've added my comments to the shared document.",
          "Got it! I will merge these changes into the main branch shortly."
        ];
        const randResponse = responses[Math.floor(Math.random() * responses.length)];

        const replyMsg: Message = {
          id: 'msg_reply_' + Date.now(),
          channelId,
          senderId: 'mock_sarah',
          senderName: 'Dr. Sarah Miller',
          senderAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuATDfKyDw9py25e-EeMwDmy4QJJ2nTmvVtkO5ihth1fTA2iqi8q25kIC0xCfz5PZvCaouc3NyxZ4DVBIfoLAHkk7M_6PcS1KPFLhif6nTkLZ29uVEEfmysjVX4RmwCKAQAhAIMoJSJ8x9W_eVeu3Qswe5eGxYS4zJQ6BFFzn5gi81B9T6GVCEghYDMcdSBx5KoC1bbi12FyVLwR08cFG5OL1MVYrar9tuaXkJ0LZlr6ITjwoPCvb56psb049ionib3pg7ui76sq6QE',
          senderRole: 'FACULTY ADVISOR',
          text: randResponse,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        const refreshedList = [...updatedList, replyMsg];
        localStorage.setItem(key, JSON.stringify(refreshedList));
        setMessages(refreshedList);
      }, 1500);

      // Update snippet in local Channels list
      const updateSnippets = (listKey: string) => {
        const listJson = localStorage.getItem(listKey);
        if (listJson) {
          const list = JSON.parse(listJson);
          const idx = list.findIndex((c: Channel) => c.id === channelId);
          if (idx !== -1) {
            let snippet = text;
            if (!snippet && fileAttachment) snippet = `📎 ${fileAttachment.name}`;
            else if (!snippet && imageAttachment) snippet = '🖼️ Sent an image';
            list[idx].lastMessageSnippet = snippet.substring(0, 60);
            list[idx].lastMessageAt = Date.now();
            localStorage.setItem(listKey, JSON.stringify(list));
          }
        }
      };
      updateSnippets('mock_channels_list');
      updateSnippets('mock_dms_list');
      return;
    }

    // Real Firebase write
    const messageData = {
      senderId: currentUserProfile.id,
      senderName: currentUserProfile.name,
      senderAvatar: currentUserProfile.avatar,
      senderRole: currentUserProfile.role,
      text,
      timestamp: serverTimestamp(),
      fileAttachment: fileAttachment || null,
      imageAttachment: imageAttachment || null
    };

    await addDoc(collection(db, 'channels', channelId, 'messages'), messageData);

    const channelRef = doc(db, 'channels', channelId);
    let snippet = text;
    if (!snippet && fileAttachment) {
      snippet = `📎 ${fileAttachment.name}`;
    } else if (!snippet && imageAttachment) {
      snippet = '🖼️ Sent an image';
    }
    await updateDoc(channelRef, {
      lastMessageSnippet: snippet.substring(0, 60),
      lastMessageAt: Date.now()
    });
  };

  const deleteMessage = async (messageId: string) => {
    if (!channelId) return;

    if (!isFirebaseConfigured) {
      const key = `mock_messages_${channelId}`;
      const currentList = JSON.parse(localStorage.getItem(key) || '[]');
      const updatedList = currentList.filter((m: Message) => m.id !== messageId);
      localStorage.setItem(key, JSON.stringify(updatedList));
      setMessages(updatedList);

      const lastMsg = updatedList[updatedList.length - 1];
      const snippet = lastMsg ? lastMsg.text || '📎 Sent an attachment' : 'No messages in this chat';

      const updateSnippets = (listKey: string) => {
        const listJson = localStorage.getItem(listKey);
        if (listJson) {
          const list = JSON.parse(listJson);
          const idx = list.findIndex((c: Channel) => c.id === channelId);
          if (idx !== -1) {
            list[idx].lastMessageSnippet = snippet.substring(0, 60);
            localStorage.setItem(listKey, JSON.stringify(list));
          }
        }
      };
      updateSnippets('mock_channels_list');
      updateSnippets('mock_dms_list');
      window.dispatchEvent(new Event('storage'));
      return;
    }

    await deleteDoc(doc(db, 'channels', channelId, 'messages', messageId));
  };

  return { messages, loading, sendMessage, deleteMessage };
}
