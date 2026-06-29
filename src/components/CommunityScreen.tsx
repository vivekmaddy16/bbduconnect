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
  Menu,
  Loader2
} from 'lucide-react';
import { CommunityPost, User } from '../types';
import { usePosts, usePostComments } from '../hooks/usePosts';
import { formatTime } from '../utils';

interface CommunityScreenProps {
  user: User;
  onToggleSidebar: () => void;
}

export default function CommunityScreen({ user, onToggleSidebar }: CommunityScreenProps) {
  const { posts, loading, createPost, toggleLikePost } = usePosts(user);
  
  const [newPostText, setNewPostText] = useState('');
  const [newPostTag, setNewPostTag] = useState('');
  const [postTagsList, setPostTagsList] = useState<string[]>(['Research']);
  
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

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
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    try {
      await createPost(
        newPostText.trim(),
        postTagsList.length > 0 ? postTagsList : ['Academic']
      );
      setNewPostText('');
      setPostTagsList(['Research']); // Reset to default tag
    } catch (err) {
      console.error(err);
      alert('Failed to publish post.');
    }
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
              {user.avatar ? (
                <img 
                  className="w-10 h-10 rounded-full object-cover shrink-0 border border-outline-variant" 
                  alt={user.name} 
                  src={user.avatar} 
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container font-bold text-xs flex items-center justify-center border border-outline-variant shrink-0">
                  {user.name.charAt(0)}
                </div>
              )}
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
            {loading ? (
              <div className="flex flex-col items-center py-12">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <p className="text-xs font-semibold text-on-surface-variant mt-2">Loading bulletin feed...</p>
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-12 bg-surface border border-outline-variant rounded-xl">
                <p className="text-xs text-on-surface-variant font-medium">No updates posted yet.</p>
                <p className="text-[10px] text-on-surface-variant/70 mt-1">Publish the first symposium thread!</p>
              </div>
            ) : (
              filteredPosts.map((post) => {
                const isLiked = post.likedBy?.includes(user.id) || false;
                return (
                  <div key={post.id} className="bg-surface border border-outline-variant rounded-xl p-5 shadow-xs space-y-4">
                    
                    {/* Author profile block */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {post.authorAvatar ? (
                          <img 
                            className="w-10 h-10 rounded-full object-cover border border-outline-variant" 
                            alt={post.author} 
                            src={post.authorAvatar} 
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container text-xs font-bold flex items-center justify-center border border-outline-variant">
                            {post.author.charAt(0)}
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-on-surface">{post.author}</h4>
                            <span className="bg-primary-fixed/30 text-on-primary-fixed-variant text-[9px] font-bold px-1.5 rounded uppercase font-sans">
                              {post.authorRole}
                            </span>
                          </div>
                          <p className="text-[10px] text-on-surface-variant font-medium mt-0.5">{formatTime(post.timestamp)}</p>
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
                          onClick={() => toggleLikePost(post.id, isLiked)}
                          className={`flex items-center gap-1 text-[11px] font-semibold hover:text-error transition-colors focus:outline-none bg-transparent border-none cursor-pointer ${
                            isLiked ? 'text-error font-bold' : ''
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${isLiked ? 'text-error fill-error' : 'text-on-surface-variant/80'}`} />
                          <span>{post.likes} Likes</span>
                        </button>

                        {/* Comments toggle button */}
                        <button 
                          onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)}
                          className={`flex items-center gap-1 text-[11px] font-semibold hover:text-primary transition-colors focus:outline-none bg-transparent border-none cursor-pointer ${
                            activeCommentPostId === post.id ? 'text-primary font-bold' : ''
                          }`}
                        >
                          <MessageSquare className="w-4 h-4" />
                          <span>{post.comments} Comments</span>
                        </button>
                      </div>

                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(`https://bbduconnect.edu/post/${post.id}`);
                          alert("Post link copied to clipboard!");
                        }}
                        className="p-1 text-on-surface-variant hover:text-primary rounded-full transition-colors focus:outline-none"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Expanded Comment Tray Section */}
                    {activeCommentPostId === post.id && (
                      <CommentTray postId={post.id} user={user} />
                    )}

                  </div>
                );
              })
            )}
          </div>

        </div>
      </main>
    </div>
  );
}

interface CommentTrayProps {
  postId: string;
  user: User;
}

function CommentTray({ postId, user }: CommentTrayProps) {
  const { comments, loading, addComment } = usePostComments(postId, user);
  const [commentInput, setCommentInput] = useState('');

  const handleAddCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    try {
      await addComment(commentInput.trim());
      setCommentInput('');
    } catch (err) {
      console.error(err);
      alert('Failed to publish peer response.');
    }
  };

  return (
    <div className="bg-surface-container-low rounded-xl p-4 border border-outline-variant/40 space-y-4">
      <h5 className="text-[11px] font-bold text-primary uppercase">Academic Discussion</h5>
      
      {/* List of comments */}
      <div className="space-y-3 divide-y divide-outline-variant/20 max-h-60 overflow-y-auto pr-1">
        {loading && (
          <div className="flex justify-center p-2">
            <Loader2 className="w-4 h-4 text-primary animate-spin" />
          </div>
        )}
        {comments.map((cmt) => (
          <div key={cmt.id} className="text-[11px] leading-relaxed pt-2 first:pt-0 text-on-surface">
            <div className="flex items-center gap-1.5 font-bold text-on-surface">
              <span>{cmt.author}</span>
              <span className="text-[9px] text-on-surface-variant font-medium">({formatTime(cmt.timestamp)})</span>
            </div>
            <p className="text-on-surface-variant mt-0.5">{cmt.text}</p>
          </div>
        ))}
        {!loading && comments.length === 0 && (
          <p className="text-[10px] text-on-surface-variant">No comments published yet.</p>
        )}
      </div>

      {/* Comment composer */}
      <form onSubmit={handleAddCommentSubmit} className="flex gap-2 items-center bg-surface border border-outline-variant rounded-lg p-1.5 focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent transition-all">
        <input 
          type="text" 
          placeholder="Write a peer response..." 
          className="bg-transparent border-none focus:ring-0 text-xs flex-1 outline-none font-medium px-2 py-1 text-on-surface"
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
        />
        <button 
          type="submit"
          disabled={!commentInput.trim()}
          className="p-1.5 bg-primary text-white hover:bg-primary-container disabled:opacity-50 rounded-md focus:outline-none"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
