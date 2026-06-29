/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { User, Channel, Message, FileItem, CommunityPost } from './types';

export const currentUser: User = {
  id: 'mock_alex',
  name: 'Alex Rivera',
  email: 'alex.rivera@bbdu.edu',
  department: 'Computer Science',
  role: 'STUDENT',
  avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Alex%20Rivera',
  tags: ['Student'],
  bio: "Passionate about edge computing and academic collaboration.",
  availability: 'Active'
};

export const initialChannels: Channel[] = [
  {
    id: 'ch_data_science',
    name: 'data-science-project',
    description: 'Final Semester Capstone Collaboration',
    unreadCount: 0,
    isDM: false
  },
  {
    id: 'ch_general',
    name: 'general-announcements',
    description: 'University-wide updates, events, and essential announcements',
    unreadCount: 0,
    isDM: false
  },
  {
    id: 'ch_study_group',
    name: 'study-group-alpha',
    description: 'Alpha study circle for examinations and quiz preparations',
    unreadCount: 0,
    isDM: false
  }
];

export const initialDMs: Channel[] = [
  {
    id: 'dm_sarah_miller',
    name: 'Dr. Sarah Miller',
    description: 'FACULTY ADVISOR',
    isDM: true,
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Sarah%20Miller',
    status: 'active',
    role: 'FACULTY ADVISOR',
    lastMessageSnippet: "I've shared the dataset..."
  },
  {
    id: 'dm_marcus_chen',
    name: 'Marcus Chen',
    description: 'STUDENT',
    isDM: true,
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Marcus%20Chen',
    status: 'offline',
    role: 'STUDENT',
    lastMessageSnippet: 'See you in the lab later.'
  }
];

export const initialMessages: Record<string, Message[]> = {
  ch_data_science: [
    {
      id: 'msg_1',
      channelId: 'ch_data_science',
      senderId: 'mock_sarah',
      senderName: 'Dr. Sarah Miller',
      senderAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Sarah%20Miller',
      senderRole: 'FACULTY ADVISOR',
      text: "Hello everyone! I've just uploaded the cleaned dataset for the Neural Network module in the Files tab. Please review the new column mappings.",
      timestamp: '10:45 AM'
    },
    {
      id: 'msg_2',
      channelId: 'ch_data_science',
      senderId: 'mock_alex',
      senderName: 'Alex Rivera',
      senderAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Alex%20Rivera',
      senderRole: 'STUDENT',
      text: "Thanks Dr. Miller! I'm starting on the visualization layer right now. Does the dataset include the pre-processed tensors?",
      timestamp: '10:47 AM'
    },
    {
      id: 'msg_3',
      channelId: 'ch_data_science',
      senderId: 'mock_marcus',
      senderName: 'Marcus Chen',
      senderAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Marcus%20Chen',
      senderRole: 'STUDENT',
      text: "I've also prepared this technical brief for the presentation.",
      timestamp: '11:02 AM',
      fileAttachment: {
        name: 'Project_Brief_v2.pdf',
        size: '2.4 MB',
        type: 'pdf',
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
      }
    }
  ]
};

export const initialFiles: FileItem[] = [
  {
    id: 'file_1',
    name: 'Distributed_Systems_Syllabus.pdf',
    type: 'pdf',
    size: '1.2 MB',
    category: 'Lectures',
    date: 'Jun 24, 2026',
    author: 'Dr. Sarah Miller',
    authorAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Sarah%20Miller',
    downloadUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    starredBy: []
  },
  {
    id: 'file_2',
    name: 'Capstone_Tensors_Dataset.xlsx',
    type: 'xlsx',
    size: '12.8 MB',
    category: 'Assignments',
    date: 'Jun 26, 2026',
    author: 'Marcus Chen',
    authorAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Marcus%20Chen',
    downloadUrl: 'https://file-examples.com/wp-content/uploads/2017/02/file_example_XLSX_10.xlsx',
    starredBy: []
  }
];

export const initialPosts: CommunityPost[] = [
  {
    id: 'post_1',
    author: 'Dr. Sarah Miller',
    authorId: 'mock_sarah',
    authorAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Sarah%20Miller',
    authorRole: 'FACULTY ADVISOR',
    content: "Excited to announce that the BBDU Annual Computing Symposium abstract submission is now open! This year's focus is on Hybrid Cloud Architectures and Edge Data Orchestration. Looking forward to some outstanding submissions from our research groups.",
    timestamp: '2 hours ago',
    likes: 8,
    likedBy: [],
    comments: 2,
    tags: ['Symposium', 'Research', 'Cloud']
  },
  {
    id: 'post_2',
    author: 'Marcus Chen',
    authorId: 'mock_marcus',
    authorAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Marcus%20Chen',
    authorRole: 'STUDENT',
    content: "Just finalized the performance profiling runs for our consensus logic simulation. Using local storage indexing instead of real-time server lookups reduced latency overheads by nearly 40%. Drafting the detailed findings report today.",
    timestamp: 'Yesterday',
    likes: 12,
    likedBy: [],
    comments: 1,
    tags: ['Consensus', 'Profile', 'CS']
  }
];
