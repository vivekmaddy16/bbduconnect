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
  createdAt?: any;
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
  members?: string[];
  createdBy?: string;
  createdAt?: any;
}

export interface AttachmentFile {
  name: string;
  size: string;
  type: string;
  url?: string;
}

export interface Message {
  id: string;
  channelId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderRole?: string;
  text?: string;
  timestamp: any;
  fileAttachment?: AttachmentFile;
  imageAttachment?: string;
}

export interface FileItem {
  id: string;
  name: string;
  type: 'pdf' | 'docx' | 'zip' | 'xlsx' | 'pptx' | 'jpg' | 'png' | string;
  size: string;
  category: 'PDFs' | 'Assignments' | 'Lectures' | 'Research' | 'All';
  date: string;
  timestamp?: any;
  author: string;
  authorId?: string;
  authorAvatar?: string;
  badges?: string[];
  imageUrl?: string;
  downloadUrl?: string;
  starredBy?: string[];
  isStarred?: boolean;
}

export interface CommunityPost {
  id: string;
  author: string;
  authorId: string;
  authorAvatar: string;
  authorRole: string;
  content: string;
  timestamp: any;
  likes: number;
  likedBy?: string[];
  comments: number;
  tags: string[];
}

export interface PostComment {
  id: string;
  postId: string;
  author: string;
  authorId: string;
  authorAvatar?: string;
  text: string;
  timestamp: any;
}
