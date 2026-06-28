/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type AppView = 'messages' | 'files' | 'community' | 'settings';

export interface User {
  id: string;
  name: string;
  email: string;
  department: string;
  role: 'STUDENT' | 'FACULTY ADVISOR' | 'FACULTY' | 'ADMIN';
  avatar: string;
  tags?: string[];
  bio?: string;
  availability: 'Active' | 'Focus Mode' | 'Offline';
}

export interface Channel {
  id: string;
  name: string;
  description: string;
  unreadCount?: number;
  isDM?: boolean;
  avatar?: string;
  status?: 'active' | 'offline';
  role?: string;
  lastMessageSnippet?: string;
}

export interface AttachmentFile {
  name: string;
  size: string;
  type: string;
}

export interface Message {
  id: string;
  channelId: string;
  senderName: string;
  senderAvatar: string;
  senderRole?: string;
  text?: string;
  timestamp: string;
  fileAttachment?: AttachmentFile;
  imageAttachment?: string;
  isSelf: boolean;
}

export interface FileItem {
  id: string;
  name: string;
  type: 'pdf' | 'docx' | 'zip' | 'xlsx' | 'pptx' | 'jpg' | 'png';
  size: string;
  category: 'PDFs' | 'Assignments' | 'Lectures' | 'Research' | 'All';
  date: string;
  author: string;
  authorAvatar?: string;
  badges?: string[];
  imageUrl?: string;
  isStarred?: boolean;
}

export interface CommunityPost {
  id: string;
  author: string;
  authorAvatar: string;
  authorRole: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  tags: string[];
}
