/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Heart, 
  MessageSquare, 
  Share2, 
  Send, 
  Users, 
  Plus, 
  Search, 
  Sparkles, 
  Tag, 
  X,
  FileText,
  Menu
} from 'lucide-react';
import { CommunityPost, User } from '../types';
import { initialPosts } from '../data';

interface CommunityScreenProps {
  user: User;
  onToggleSidebar: () => void;
}

export default function CommunityScreen({ user, onToggleSidebar }: CommunityScreenProps) {
  const [posts, setPosts] = useState<CommunityPost[]>(initialPosts);
  const [newPostText, setNewPostText] = useState('');
  const [newPostTag, setNewPostTag] = useState('');
  const [postTagsList, setPostTagsList] = useState<string[]>(['Research']);
  
  // Comment threads mapping: postId -> list of comment strings
  const [commentsMap, setCommentsMap] = useState<Record<string, { author: string; text: string }[]>>({
    post_1: [
      { author: 'Marcus Chen', text: "I'll definitely be submitting an abstract for my Distributed systems project, Dr. Miller!" },
      { author: 'David R.', text: "Excellent, looking forward to the keynote!" }
    ],
    post_2: [
      { author: 'Dr. Sarah Miller', text: "Excellent choice of clustering library, Marcus. I would love to look at the latency benchmark." }
    ]
  });

  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Handle Like Increment
  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p));
  };

  // Add tag to list
  const handleAddTag = () => {
    if (!newPostTag.trim()) return;
    const clean = newPostTag.trim().replace(/\s+/g, '');
    if (!postTagsList.includes(clean)) {
      setPostTagsList(prev => [...prev, clean]);
    }
    setNewPostTag('');
  };

  // Remove tag from list
  const handleRemoveTag = (t: string) => {
    setPostTagsList(prev => prev.filter(x => x !== t));
  };

  // Publish a new post
  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    const publishedPost: CommunityPost = {
      id: `post_${Date.now()}`,
      author: user.name,
      authorAvatar: user.avatar,
      authorRole: user.role,
      content: newPostText,
      timestamp: 'Just now',
      likes: 0,
      comments: 0,
      tags: postTagsList.length > 0 ? postTagsList : ['Academic']
    };

    setPosts(prev => [publishedPost, ...prev]);
    setNewPostText('');
    setPostTagsList(['Research']); // Reset to default tag
  };

  // Add Comment under active post
  const handleAddComment = (postId: string) => {
    if (!commentInput.trim()) return;
    
    const newComment = {
      author: user.name,
      text: commentInput.trim()
    };

    setCommentsMap(prev => ({
      ...prev,
      [postId]: [...(prev[postId] || []), newComment]
    }));

    setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: p.comments + 1 } : p));
    setCommentInput('');
  };

  // Filter posts by search query
  const filteredPosts = posts.filter(p => 
    p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="md:ml-[280px] h-screen flex flex-col overflow-hidden bg-background">
      {/* Top Header */}
      <header className="h-16 bg-surface border-b border-outline-variant flex justify-between items-center px-4 md:px-6 shrink-0 z-20">
        <div className="flex items-center gap-3 md:gap-4 flex-1 max-w-xl">
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-2 text-on-surface-variant hover:text-primary rounded-lg hover:bg-surface-container transition-colors focus:outline-none"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h2 className="text-sm font-bold text-primary hidden lg:block">Campus Bulletin</h2>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-4 h-4" />
            <input 
              className="w-full h-10 pl-10 pr-4 bg-surface-container-low border border-outline-variant rounded-full text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none" 
              placeholder="Search symposium announcements, research logs..." 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </header>

      {/* Bulletin Board Feed Area */}
      <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
        <div className="max-w-[720px] mx-auto space-y-6">
          
          <div>
            <h3 className="text-xl font-bold text-primary">Academic Hub</h3>
            <p className="text-xs text-on-surface-variant mt-1">Staggered updates, publications, and forum threads of BBDU.</p>
          </div>

          {/* New Post / Publication Composer Card */}
          <form onSubmit={handleCreatePost} className="bg-surface border border-outline-variant rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-start gap-3">
              <img 
                className="w-10 h-10 rounded-full object-cover shrink-0 border border-outline-variant" 
                alt={user.name} 
                src={user.avatar} 
                referrerPolicy="no-referrer"
              />
              <div className="flex-1">
                <textarea 
                  className="w-full bg-transparent border-none text-xs text-on-background focus:ring-0 resize-none outline-none min-h-[60px]" 
                  placeholder="Share a research log, question, or symposium reminder..."
                  value={newPostText}
                  onChange={(e) => setNewPostText(e.target.value)}
                />
              </div>
            </div>

            {/* Selected Tags tray */}
            {postTagsList.length > 0 && (
              <div className="flex flex-wrap gap-1 items-center px-1">
                <span className="text-[10px] text-on-surface-variant/70 font-semibold mr-1">Tags:</span>
                {postTagsList.map(t => (
                  <span key={t} className="bg-primary-fixed/40 text-on-primary-fixed-variant text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    #{t}
                    <button 
                      type="button" 
                      onClick={() => handleRemoveTag(t)}
                      className="text-on-primary-fixed-variant/80 hover:text-error focus:outline-none"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* composer foot buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-outline-variant/30">
              <div className="flex items-center gap-1.5">
                <div className="relative flex items-center bg-surface-container-low px-2 py-1 rounded-lg border border-outline-variant">
                  <Tag className="w-3.5 h-3.5 text-on-surface-variant mr-1" />
                  <input 
                    type="text" 
                    placeholder="Add custom tag" 
                    className="bg-transparent border-none focus:ring-0 text-[10px] w-20 outline-none font-medium text-on-surface"
                    value={newPostTag}
                    onChange={(e) => setNewPostTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                  />
                  <button 
                    type="button"
                    onClick={handleAddTag}
                    className="p-0.5 bg-primary text-white rounded hover:bg-primary-container focus:outline-none"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <button 
                type="submit"
                disabled={!newPostText.trim()}
                className="px-4 py-2 bg-primary disabled:opacity-50 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm hover:opacity-90 active:scale-95 transition-all focus:outline-none"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Publish
              </button>
            </div>
          </form>

          {/* Staggered Community feed list */}
          <div className="space-y-6">
            {filteredPosts.map((post) => (
              <div key={post.id} className="bg-surface border border-outline-variant rounded-xl p-5 shadow-xs space-y-4">
                
                {/* Author profile block */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img 
                      className="w-10 h-10 rounded-full object-cover border border-outline-variant" 
                      alt={post.author} 
                      src={post.authorAvatar} 
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-on-surface">{post.author}</h4>
                        <span className="bg-primary-fixed/40 text-on-primary-fixed-variant text-[9px] font-bold px-1.5 rounded uppercase">
                          {post.authorRole}
                        </span>
                      </div>
                      <p className="text-[10px] text-on-surface-variant font-medium mt-0.5">{post.timestamp}</p>
                    </div>
                  </div>
                </div>

                {/* content text */}
                <p className="text-xs text-on-surface leading-relaxed whitespace-pre-wrap">
                  {post.content}
                </p>

                {/* post tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {post.tags.map(t => (
                      <span key={t} className="bg-surface-container-high text-on-surface-variant text-[10px] font-bold px-2 py-0.5 rounded-full">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}

                {/* Interact action buttons */}
                <div className="flex items-center justify-between border-t border-outline-variant/30 pt-3 text-on-surface-variant">
                  <div className="flex items-center gap-4">
                    {/* Like button */}
                    <button 
                      onClick={() => handleLike(post.id)}
                      className="flex items-center gap-1 text-[11px] font-semibold hover:text-error transition-colors focus:outline-none bg-transparent border-none cursor-pointer"
                    >
                      <Heart className="w-4 h-4 text-error/80" fill="none" />
                      <span>{post.likes} Likes</span>
                    </button>

                    {/* Comments toggle button */}
                    <button 
                      onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)}
                      className={`flex items-center gap-1 text-[11px] font-semibold hover:text-primary transition-colors focus:outline-none bg-transparent border-none cursor-pointer ${
                        activeCommentPostId === post.id ? 'text-primary' : ''
                      }`}
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>{post.comments} Comments</span>
                    </button>
                  </div>

                  <button 
                    onClick={() => alert(`Unique post link copied for ${post.author}'s post`)}
                    className="p-1 text-on-surface-variant hover:text-primary rounded-full transition-colors focus:outline-none"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Expanded Comment Tray Section */}
                {activeCommentPostId === post.id && (
                  <div className="bg-surface-container-low rounded-xl p-4 border border-outline-variant/40 space-y-4">
                    <h5 className="text-[11px] font-bold text-primary uppercase">Academic Discussion</h5>
                    
                    {/* List of comments */}
                    <div className="space-y-3 divide-y divide-outline-variant/20">
                      {commentsMap[post.id]?.map((cmt, cIdx) => (
                        <div key={cIdx} className={`text-[11px] leading-relaxed pt-2 ${cIdx === 0 ? 'pt-0' : ''}`}>
                          <p className="font-bold text-on-surface">{cmt.author}</p>
                          <p className="text-on-surface-variant mt-0.5">{cmt.text}</p>
                        </div>
                      ))}
                      {(!commentsMap[post.id] || commentsMap[post.id].length === 0) && (
                        <p className="text-[10px] text-on-surface-variant">No comments published yet.</p>
                      )}
                    </div>

                    {/* Comment composer */}
                    <div className="flex gap-2 items-center bg-surface border border-outline-variant rounded-lg p-1.5 focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent transition-all">
                      <input 
                        type="text" 
                        placeholder="Write a peer response..." 
                        className="bg-transparent border-none focus:ring-0 text-xs flex-1 outline-none font-medium px-2 py-1 text-on-surface"
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddComment(post.id);
                          }
                        }}
                      />
                      <button 
                        onClick={() => handleAddComment(post.id)}
                        disabled={!commentInput.trim()}
                        className="p-1.5 bg-primary text-white hover:bg-primary-container disabled:opacity-50 rounded-md focus:outline-none"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

              </div>
            ))}
          </div>

        </div>
      </main>
    </div>
  );
}
