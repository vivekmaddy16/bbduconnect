/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { User, Channel, Message, FileItem, CommunityPost } from './types';

export const currentUser: User = {
  id: 'user_alex',
  name: 'Alex Rivera',
  email: 'alex.rivera@bbdu.edu',
  department: 'Computer Science',
  role: 'STUDENT',
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCkxglEbamu_MazDsq1npsaDo2ooYtypMvpvI5dGpb9Om8yyOB1GYX6exN7zpUijzEhYLjg6fPOWHbEhWNrd1sVzcI5BtptfdMIXoG0hfubHJNtx_QPRy-VemXjEYRHnzj4FBwQZHAtkCIYpRPOejNmW1DOaQvz5RkhKm1NNMGdTMssEgo3K6YklCKXgi8r2-mqJ17PpKs3eqcz-F5PFDClyERC3wpLGf_ggLXzZ1m5NKAeZ77HKzsqJUvtUyomJj2AcVoMubCoETY',
  tags: ['Faculty', 'Subject Expert', 'Researcher'],
  bio: "Passionate about edge computing and academic collaboration. Let's connect for research initiatives!",
  availability: 'Active'
};

export const initialChannels: Channel[] = [
  {
    id: 'ch_data_science',
    name: 'data-science-project',
    description: 'Final Semester Capstone Collaboration',
    unreadCount: 4,
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
    description: 'Faculty Advisor, Data Science',
    isDM: true,
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuATDfKyDw9py25e-EeMwDmy4QJJ2nTmvVtkO5ihth1fTA2iqi8q25kIC0xCfz5PZvCaouc3NyxZ4DVBIfoLAHkk7M_6PcS1KPFLhif6nTkLZ29uVEEfmysjVX4RmwCKAQAhAIMoJSJ8x9W_eVeu3Qswe5eGxYS4zJQ6BFFzn5gi81B9T6GVCEghYDMcdSBx5KoC1bbi12FyVLwR08cFG5OL1MVYrar9tuaXkJ0LZlr6ITjwoPCvb56psb049ionib3pg7ui76sq6QE',
    status: 'active',
    role: 'FACULTY ADVISOR',
    lastMessageSnippet: "I've shared the dataset..."
  },
  {
    id: 'dm_marcus_chen',
    name: 'Marcus Chen',
    description: 'Graduate Student & Research Assistant',
    isDM: true,
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqy-Gi_Qf14KB9XdwTfT3uaLfx8Tc_DxAD-vo4PTqRWJnYclgYcUxwk6HvkVEbYpcnSMhRceOFNzskeLhDDoeOWcVub6FiJzCaL-AbNTt5k6dGOzTzBTDe1rEZ9pwnidAUe1ro7sFENCUg5xnZd7X6TgcZLkg8lugh4gu2hmn8a3uk_mmV8eIpJsFSBBnpQxBTl-pCJrz_tOaAgOen1FfxC897_h9wMUfJzcaGLamKJuEBxcuOYw6GPyIj2FKwB87JD33D09wcpIM',
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
      senderName: 'Dr. Sarah Miller',
      senderAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuATDfKyDw9py25e-EeMwDmy4QJJ2nTmvVtkO5ihth1fTA2iqi8q25kIC0xCfz5PZvCaouc3NyxZ4DVBIfoLAHkk7M_6PcS1KPFLhif6nTkLZ29uVEEfmysjVX4RmwCKAQAhAIMoJSJ8x9W_eVeu3Qswe5eGxYS4zJQ6BFFzn5gi81B9T6GVCEghYDMcdSBx5KoC1bbi12FyVLwR08cFG5OL1MVYrar9tuaXkJ0LZlr6ITjwoPCvb56psb049ionib3pg7ui76sq6QE',
      senderRole: 'FACULTY ADVISOR',
      text: "Hello everyone! I've just uploaded the cleaned dataset for the Neural Network module in the Files tab. Please review the new column mappings.",
      timestamp: '10:45 AM',
      isSelf: false
    },
    {
      id: 'msg_2',
      channelId: 'ch_data_science',
      senderName: 'Alex Rivera',
      senderAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCkxglEbamu_MazDsq1npsaDo2ooYtypMvpvI5dGpb9Om8yyOB1GYX6exN7zpUijzEhYLjg6fPOWHbEhWNrd1sVzcI5BtptfdMIXoG0hfubHJNtx_QPRy-VemXjEYRHnzj4FBwQZHAtkCIYpRPOejNmW1DOaQvz5RkhKm1NNMGdTMssEgo3K6YklCKXgi8r2-mqJ17PpKs3eqcz-F5PFDClyERC3wpLGf_ggLXzZ1m5NKAeZ77HKzsqJUvtUyomJj2AcVoMubCoETY',
      senderRole: 'STUDENT',
      text: "Thanks Dr. Miller! I'm starting on the visualization layer right now. Does the dataset include the pre-processed tensors?",
      timestamp: '10:47 AM',
      isSelf: true
    },
    {
      id: 'msg_3',
      channelId: 'ch_data_science',
      senderName: 'Marcus Chen',
      senderAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqy-Gi_Qf14KB9XdwTfT3uaLfx8Tc_DxAD-vo4PTqRWJnYclgYcUxwk6HvkVEbYpcnSMhRceOFNzskeLhDDoeOWcVub6FiJzCaL-AbNTt5k6dGOzTzBTDe1rEZ9pwnidAUe1ro7sFENCUg5xnZd7X6TgcZLkg8lugh4gu2hmn8a3uk_mmV8eIpJsFSBBnpQxBTl-pCJrz_tOaAgOen1FfxC897_h9wMUfJzcaGLamKJuEBxcuOYw6GPyIj2FKwB87JD33D09wcpIM',
      senderRole: 'STUDENT',
      text: "I've also prepared this technical brief for the presentation.",
      timestamp: '11:02 AM',
      fileAttachment: {
        name: 'Project_Brief_v2.pdf',
        size: '2.4 MB',
        type: 'pdf'
      },
      isSelf: false
    },
    {
      id: 'msg_4',
      channelId: 'ch_data_science',
      senderName: 'Alex Rivera',
      senderAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCkxglEbamu_MazDsq1npsaDo2ooYtypMvpvI5dGpb9Om8yyOB1GYX6exN7zpUijzEhYLjg6fPOWHbEhWNrd1sVzcI5BtptfdMIXoG0hfubHJNtx_QPRy-VemXjEYRHnzj4FBwQZHAtkCIYpRPOejNmW1DOaQvz5RkhKm1NNMGdTMssEgo3K6YklCKXgi8r2-mqJ17PpKs3eqcz-F5PFDClyERC3wpLGf_ggLXzZ1m5NKAeZ77HKzsqJUvtUyomJj2AcVoMubCoETY',
      senderRole: 'STUDENT',
      timestamp: '11:15 AM',
      text: 'First draft of the dashboard UI!',
      imageAttachment: 'https://lh3.googleusercontent.com/aida-public/AB6AXuATIrI-6AE11LyLvmxa5cAYJON4G0GDVOzA8Audh04s1nBVJ7FNP22_xdwQAGHn8lNUN2hwODaWUOdwQSjAr1OVz-MC4KPoD0gbisgvyHGPCooEINJFPcRL9ja1HUBxqHr_IEdv3YfSesoVQwoh2qSpWvUNxrV6bx-4fiLjb4_jQVIxOO1HTISn_P77oK9hY7Q6mJoPo9BM5FP5vb0YGyN9c2X4IQTUe33nnTUihfQej_j7Cu7LA-4vn3ICp8TpXpgelOIi3J5318g',
      isSelf: true
    }
  ],
  ch_general: [
    {
      id: 'gen_msg_1',
      channelId: 'ch_general',
      senderName: 'Dean Arthur Pendelton',
      senderAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDKRR-9vMX6DvOdETtbladAda_gkVpZW_yMbsOV2P6ENAV1wsQKNGEiSLUZ7gTmPYjAcy7Z_P3xGjUaKKWRPBTJHNQf5CuWVzhl7VWMSjrafobNctrn7Ke9p4KZLFZPMqSM7-EpNqGSgMrAPcElLZC75u4c0ZsDZSzoiTWJTxTjNpQ35M2qxpabZC9k9MPvs81NCeF_j-AE7tKhxdJaXAFaZqlvwU6dc1n2OOqMZtGytPncz8aweFcyvK5mGgS_YM5dnDluD6lmLQw',
      senderRole: 'ADMIN',
      text: 'Good morning everyone. Welcome to the Fall 2026 academic semester at BBDU. We have exciting updates regarding the new Engineering Research facility opening this September!',
      timestamp: '09:00 AM',
      isSelf: false
    }
  ],
  ch_study_group: [
    {
      id: 'study_msg_1',
      channelId: 'ch_study_group',
      senderName: 'Marcus Chen',
      senderAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqy-Gi_Qf14KB9XdwTfT3uaLfx8Tc_DxAD-vo4PTqRWJnYclgYcUxwk6HvkVEbYpcnSMhRceOFNzskeLhDDoeOWcVub6FiJzCaL-AbNTt5k6dGOzTzBTDe1rEZ9pwnidAUe1ro7sFENCUg5xnZd7X6TgcZLkg8lugh4gu2hmn8a3uk_mmV8eIpJsFSBBnpQxBTl-pCJrz_tOaAgOen1FfxC897_h9wMUfJzcaGLamKJuEBxcuOYw6GPyIj2FKwB87JD33D09wcpIM',
      senderRole: 'STUDENT',
      text: "Does anyone want to meet in library room 3B for a study session on Distributed Consensus algorithm?",
      timestamp: '02:30 PM',
      isSelf: false
    }
  ],
  dm_sarah_miller: [
    {
      id: 'dm_sarah_1',
      channelId: 'dm_sarah_miller',
      senderName: 'Dr. Sarah Miller',
      senderAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuATDfKyDw9py25e-EeMwDmy4QJJ2nTmvVtkO5ihth1fTA2iqi8q25kIC0xCfz5PZvCaouc3NyxZ4DVBIfoLAHkk7M_6PcS1KPFLhif6nTkLZ29uVEEfmysjVX4RmwCKAQAhAIMoJSJ8x9W_eVeu3Qswe5eGxYS4zJQ6BFFzn5gi81B9T6GVCEghYDMcdSBx5KoC1bbi12FyVLwR08cFG5OL1MVYrar9tuaXkJ0LZlr6ITjwoPCvb56psb049ionib3pg7ui76sq6QE',
      senderRole: 'FACULTY ADVISOR',
      text: "Hello Alex, I've shared the neural networks dataset with you. Please run the cleaning script on the pre-processed tensors.",
      timestamp: '10:44 AM',
      isSelf: false
    }
  ],
  dm_marcus_chen: [
    {
      id: 'dm_marcus_1',
      channelId: 'dm_marcus_chen',
      senderName: 'Marcus Chen',
      senderAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqy-Gi_Qf14KB9XdwTfT3uaLfx8Tc_DxAD-vo4PTqRWJnYclgYcUxwk6HvkVEbYpcnSMhRceOFNzskeLhDDoeOWcVub6FiJzCaL-AbNTt5k6dGOzTzBTDe1rEZ9pwnidAUe1ro7sFENCUg5xnZd7X6TgcZLkg8lugh4gu2hmn8a3uk_mmV8eIpJsFSBBnpQxBTl-pCJrz_tOaAgOen1FfxC897_h9wMUfJzcaGLamKJuEBxcuOYw6GPyIj2FKwB87JD33D09wcpIM',
      senderRole: 'STUDENT',
      text: "See you in the lab later.",
      timestamp: '09:12 AM',
      isSelf: false
    }
  ]
};

export const initialFiles: FileItem[] = [
  {
    id: 'file_1',
    name: 'Campus_Design_A1.jpg',
    type: 'jpg',
    size: '14.8 MB',
    category: 'Research',
    date: '2h ago',
    author: 'David R.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9YQWoDWbKKhEsSIINabU2Il__mIkkNYBLCUYxtCJJ18X4DO0rItQi_p7fiFHmeAePh9zcHAIR3kITc07FzetCwHxLnDR2pUnj3g7XiDHH8Bqer0bEiBEnqc2PSphJ_MsIsIIeGsLUxnSkHW6N6vQSCkX-QDOoFAy8WAAKancpWDIjLRazyl1aQaooP1LeQb7b9wjOzOx5XWtOgMVUn7aoDPUdY7A6GiXeFW77OFwDpscyiKizFi58Ruj08byZ36qbm_BYF9BsTZg'
  },
  {
    id: 'file_2',
    name: 'Advanced_Calculus_Syllabus.pdf',
    type: 'pdf',
    size: '12.4 MB',
    category: 'Lectures',
    date: 'Yesterday',
    author: 'Dr. Sarah L.',
    badges: ['Mathematics', 'Lecture']
  },
  {
    id: 'file_3',
    name: 'Lab_Report_S3.docx',
    type: 'docx',
    size: '440 KB',
    category: 'Assignments',
    date: 'Edited Yesterday',
    author: 'Alex Rivera',
    badges: ['Faculty Only']
  },
  {
    id: 'file_4',
    name: 'Study_Session_Ref.zip',
    type: 'zip',
    size: '85.2 MB',
    category: 'Research',
    date: 'Oct 24',
    author: 'Mike L.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBkbuYdr4Ej9qq3QOa8ZA5NaJparaiV4jVfR4erHdrAVfNXC_0pD0B7YgnUHRXrxyrr3GrmjAzOyKoV1UCnU9a2nKjLYPx92WDPt6pJXP7dqHwESD-7WScGO7nt1KGiVAZG8ppDOmjKJQ0jpIgK93Inv4CDc601c4UOhkZzC3IGdSGGeK299DM3hkh3MarIwvvvNXEEO8YXaBYpRbJ5fqI3l6m-VuURqz5As4CsqW54SgK03b9cO4oYm3lb7XTBUkLbGYmVOKh75qk'
  },
  {
    id: 'file_5',
    name: 'Grade_Distribution_Matrix.xlsx',
    type: 'xlsx',
    size: '2.1 MB',
    category: 'Research',
    date: 'Oct 20',
    author: 'Admin Team',
    badges: ['Confidential'],
    isStarred: true
  },
  {
    id: 'file_6',
    name: 'Final_Project_Pitch_Deck.pptx',
    type: 'pptx',
    size: '15.8 MB',
    category: 'Assignments',
    date: 'Oct 15',
    author: 'Jordan B.',
    badges: ['Team Alpha']
  }
];

export const initialPosts: CommunityPost[] = [
  {
    id: 'post_1',
    author: 'Dr. Sarah Miller',
    authorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuATDfKyDw9py25e-EeMwDmy4QJJ2nTmvVtkO5ihth1fTA2iqi8q25kIC0xCfz5PZvCaouc3NyxZ4DVBIfoLAHkk7M_6PcS1KPFLhif6nTkLZ29uVEEfmysjVX4RmwCKAQAhAIMoJSJ8x9W_eVeu3Qswe5eGxYS4zJQ6BFFzn5gi81B9T6GVCEghYDMcdSBx5KoC1bbi12FyVLwR08cFG5OL1MVYrar9tuaXkJ0LZlr6ITjwoPCvb56psb049ionib3pg7ui76sq6QE',
    authorRole: 'FACULTY ADVISOR',
    content: "We are thrilled to announce that BBDU is hosting its annual Computer Science Symposium next Friday. Submissions for poster sessions are now open! Please submit a 200-word abstract if you're interested in presenting your current capstone prototypes.",
    timestamp: 'Yesterday at 4:32 PM',
    likes: 42,
    comments: 8,
    tags: ['Symposium', 'ComputerScience', 'Research']
  },
  {
    id: 'post_2',
    author: 'Marcus Chen',
    authorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqy-Gi_Qf14KB9XdwTfT3uaLfx8Tc_DxAD-vo4PTqRWJnYclgYcUxwk6HvkVEbYpcnSMhRceOFNzskeLhDDoeOWcVub6FiJzCaL-AbNTt5k6dGOzTzBTDe1rEZ9pwnidAUe1ro7sFENCUg5xnZd7X6TgcZLkg8lugh4gu2hmn8a3uk_mmV8eIpJsFSBBnpQxBTl-pCJrz_tOaAgOen1FfxC897_h9wMUfJzcaGLamKJuEBxcuOYw6GPyIj2FKwB87JD33D09wcpIM',
    authorRole: 'STUDENT',
    content: "Just finished prototyping the distributed hash table cluster in Go! Check out my study notes and Docker configurations on my academic github. It's ready to handle the simulation tests tonight.",
    timestamp: '2 hours ago',
    likes: 18,
    comments: 3,
    tags: ['Go', 'Networking', 'Systems']
  }
];
