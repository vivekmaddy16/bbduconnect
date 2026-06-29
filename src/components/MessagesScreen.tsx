/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, 
  Hash, 
  Phone, 
  Video, 
  Info, 
  Bold, 
  Italic, 
  Link, 
  List, 
  Smile, 
  Paperclip, 
  Image as ImageIcon, 
  Send, 
  Download, 
  Users, 
  Search, 
  Bell, 
  User, 
  FileText,
  X,
  Menu,
  ArrowLeft,
  Loader2,
  GraduationCap,
  Trash2
} from 'lucide-react';
import { Channel, Message, User as UserType } from '../types';
import { useChannels } from '../hooks/useChannels';
import { useMessages } from '../hooks/useMessages';
import { formatTime, formatBytes } from '../utils';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { storage, db } from '../firebase';

interface MessagesScreenProps {
  user: UserType;
  onToggleSidebar: () => void;
}

export default function MessagesScreen({ user, onToggleSidebar }: MessagesScreenProps) {
  const { channels, dms, loading: channelsLoading, createChannel, createDM, deleteChannel } = useChannels(user.id);
  const [activeId, setActiveId] = useState<string | undefined>(undefined);
  
  const [inputText, setInputText] = useState('');
  const [attachedFile, setAttachedFile] = useState<{ name: string; size: string; type: string; url: string } | null>(null);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showRightSidebar, setShowRightSidebar] = useState(true);
  const [showConversationList, setShowConversationList] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Set default active channel once loaded
  useEffect(() => {
    if (!activeId) {
      if (channels.length > 0) {
        setActiveId(channels[0].id);
      } else if (dms.length > 0) {
        setActiveId(dms[0].id);
      }
    }
  }, [channels, dms, activeId]);

  const activeChannel = 
    channels.find(c => c.id === activeId) || 
    dms.find(d => d.id === activeId);

  const { messages, loading: messagesLoading, sendMessage, deleteMessage } = useMessages(activeId, user);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeId]);

  // Handle Channel / DM Selection
  const handleSelectActive = (id: string) => {
    setActiveId(id);
    // On mobile, switch to chat view after selecting a conversation
    setShowConversationList(false);
  };

  // Handle Uploading file to Firebase Storage
  const handleFileUpload = async (file: File) => {
    const fileRef = ref(storage, `attachments/${user.id}/${Date.now()}_${file.name}`);
    const snapshot = await uploadBytes(fileRef, file);
    return await getDownloadURL(snapshot.ref);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    try {
      const url = await handleFileUpload(file);
      setAttachedFile({
        name: file.name,
        size: formatBytes(file.size),
        type: file.type.split('/')[1] || 'bin',
        url: url
      });
      setAttachedImage(null);
    } catch (err) {
      console.error(err);
      alert('Failed to upload file to storage.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    try {
      const url = await handleFileUpload(file);
      setAttachedImage(url);
      setAttachedFile(null);
    } catch (err) {
      console.error(err);
      alert('Failed to upload media to storage.');
    } finally {
      setIsUploading(false);
    }
  };

  // Handle Sending a Message
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() && !attachedFile && !attachedImage) return;

    try {
      await sendMessage(
        inputText,
        attachedFile || undefined,
        attachedImage || undefined
      );

      // Reset input fields
      setInputText('');
      setAttachedFile(null);
      setAttachedImage(null);
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Failed to send message.');
    }
  };

  // Filter messages based on search query
  const filteredMessages = messages.filter(m => 
    (m.text || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (m.fileAttachment?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Add new channel handler
  const handleAddNewChannel = async () => {
    const name = prompt('Enter new channel name (no spaces):');
    if (!name) return;
    const desc = prompt('Enter channel description (optional):');
    try {
      await createChannel(name, desc || '');
    } catch (err) {
      console.error(err);
      alert('Failed to create channel.');
    }
  };

  // Add new DM handler (search user by email)
  const handleAddNewDM = async () => {
    const email = prompt('Enter email address of the scholar to message:');
    if (!email) return;

    try {
      const usersQuery = query(collection(db, 'users'), where('email', '==', email.trim().toLowerCase()));
      const snapshot = await getDocs(usersQuery);
      
      if (snapshot.empty) {
        alert('No user found with that email address.');
        return;
      }

      const otherUserDoc = snapshot.docs[0];
      const otherUser = { id: otherUserDoc.id, ...otherUserDoc.data() } as UserType;

      if (otherUser.id === user.id) {
        alert('You cannot start a direct message thread with yourself.');
        return;
      }

      await createDM(otherUser);
    } catch (err) {
      console.error(err);
      alert('Failed to initiate direct message.');
    }
  };

  const canDelete = !activeChannel?.isDM && (
    activeChannel?.createdBy === user.id ||
    user.role === 'ADMIN' || 
    user.role === 'FACULTY' || 
    user.role === 'FACULTY ADVISOR'
  );

  const handleDeleteChannel = async () => {
    if (!activeId || !activeChannel) return;
    const confirmDelete = window.confirm(`Are you sure you want to delete the channel #${activeChannel.name}? All chat history will be permanently lost.`);
    if (confirmDelete) {
      try {
        await deleteChannel(activeId);
        setActiveId(undefined);
      } catch (err) {
        console.error(err);
        alert('Failed to delete channel.');
      }
    }
  };

  const handleDeleteMsg = async (messageId: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this message permanently?");
    if (confirmDelete) {
      try {
        await deleteMessage(messageId);
      } catch (err) {
        console.error(err);
        alert("Failed to delete message.");
      }
    }
  };

  return (
    <div className="md:ml-[280px] h-screen flex flex-col overflow-hidden bg-background">
      {/* Hidden File Inputs */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
      />
      <input 
        type="file" 
        accept="image/*" 
        ref={imageInputRef} 
        onChange={handleImageChange} 
        className="hidden" 
      />

      {/* Top Header Bar */}
      <header className="h-16 bg-surface border-b border-outline-variant flex justify-between items-center px-4 md:px-6 z-20 shrink-0">
        <div className="flex items-center gap-3 md:gap-4 flex-1 max-w-xl">
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-2 text-on-surface-variant hover:text-primary rounded-lg hover:bg-surface-container transition-colors focus:outline-none"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-bold text-primary hidden lg:block">BbduConnect</h2>
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant w-4 h-4" />
            <input 
              className="w-full h-10 pl-10 pr-4 bg-surface-container-low border border-outline-variant rounded-full text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none" 
              placeholder="Search for messages or files..." 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface focus:outline-none"
                onClick={() => setSearchQuery('')}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            className="p-2 text-on-surface-variant hover:text-primary rounded-full hover:bg-surface-container transition-all relative focus:outline-none"
            onClick={() => alert('No new notifications.')}
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full"></span>
          </button>
          <button 
            className="p-2 text-on-surface-variant hover:text-primary rounded-full hover:bg-surface-container transition-all focus:outline-none"
            onClick={() => alert(`Academic Network: Connected as ${user.name}`)}
          >
            <Users className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content Pane Split */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Pane 1: Conversations List (Channels/DMs) */}
        <section className={`border-r border-outline-variant bg-surface flex flex-col shrink-0 ${showConversationList ? 'flex w-full md:w-[280px]' : 'hidden md:flex md:w-[280px]'}`}>
          <div className="p-4 border-b border-outline-variant flex justify-between items-center">
            <h3 className="text-[11px] font-bold text-primary-container tracking-wider uppercase">Channels</h3>
            <button 
              onClick={handleAddNewChannel}
              className="text-primary hover:bg-primary-fixed p-1 rounded transition-colors focus:outline-none"
              title="Create Channel"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto py-2 space-y-1">
            {channelsLoading && (
              <div className="flex justify-center p-4">
                <Loader2 className="w-5 h-5 text-primary animate-spin" />
              </div>
            )}
            
            {/* Channels */}
            {channels.map((chan) => {
              const isActive = activeId === chan.id;
              return (
                <button
                  key={chan.id}
                  onClick={() => handleSelectActive(chan.id)}
                  className={`w-[calc(100%-16px)] mx-2 flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all focus:outline-none ${
                    isActive 
                      ? 'bg-surface-container-high text-primary font-bold shadow-sm' 
                      : 'text-on-surface-variant hover:bg-surface-container-low'
                  }`}
                >
                  <Hash className={`w-4 h-4 shrink-0 ${isActive ? 'text-primary' : 'text-on-surface-variant'}`} />
                  <span className="flex-1 truncate text-xs">{chan.name}</span>
                  {chan.unreadCount ? (
                    <span className="bg-primary text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-full shrink-0">
                      {chan.unreadCount}
                    </span>
                  ) : null}
                </button>
              );
            })}

            <div className="p-4 pt-6 border-t border-outline-variant flex justify-between items-center">
              <h3 className="text-[11px] font-bold text-primary-container tracking-wider uppercase">Direct Messages</h3>
              <button 
                onClick={handleAddNewDM}
                className="text-primary hover:bg-primary-fixed p-1 rounded transition-colors focus:outline-none"
                title="New DM"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* DMs */}
            {dms.map((dm) => {
              const isActive = activeId === dm.id;
              return (
                <button
                  key={dm.id}
                  onClick={() => handleSelectActive(dm.id)}
                  className={`w-[calc(100%-16px)] mx-2 flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all relative focus:outline-none ${
                    isActive 
                      ? 'bg-surface-container-high font-bold' 
                      : 'text-on-surface-variant hover:bg-surface-container-low'
                  }`}
                >
                  <div className="relative shrink-0">
                    {dm.avatar ? (
                      <img 
                        className="w-10 h-10 rounded-full object-cover" 
                        alt={dm.name} 
                        src={dm.avatar} 
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-sm">
                        {dm.name.charAt(0)}
                      </div>
                    )}
                    <span className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full ${
                      dm.status === 'active' ? 'bg-secondary' : 'bg-outline-variant'
                    }`}></span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-on-surface truncate">{dm.name}</p>
                    <p className="text-[10px] text-on-surface-variant truncate font-medium">{dm.lastMessageSnippet}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Pane 2: Main Chat Window */}
        <section className={`flex-1 bg-surface-container-low flex flex-col relative overflow-hidden ${showConversationList ? 'hidden md:flex' : 'flex'}`}>
          {/* Chat Header */}
          <div className="h-16 px-4 md:px-6 border-b border-outline-variant flex items-center justify-between bg-surface/80 backdrop-blur-md sticky top-0 z-10 shrink-0">
            <div className="flex items-center gap-3">
              {/* Mobile back button to return to conversation list */}
              <button
                onClick={() => setShowConversationList(true)}
                className="md:hidden p-2 text-on-surface-variant hover:text-primary rounded-lg hover:bg-surface-container transition-colors focus:outline-none -ml-1"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              {activeChannel?.isDM && activeChannel?.avatar ? (
                <img
                  className="w-8 h-8 rounded-full object-cover shrink-0"
                  alt={activeChannel.name}
                  src={activeChannel.avatar}
                  referrerPolicy="no-referrer"
                />
              ) : (
                <Hash className="text-primary w-5 h-5 shrink-0" />
              )}
              <div>
                <h2 className="text-sm font-bold text-primary truncate">
                  {activeChannel?.isDM ? activeChannel?.name : (activeChannel?.name || 'Select a channel')}
                </h2>
                <p className="text-[10px] text-on-surface-variant truncate font-medium">
                  {activeChannel?.description}
                </p>
              </div>
            </div>
            {activeId && (
              <div className="flex items-center gap-1.5">
                <button 
                  onClick={() => alert(`Initiating audio call with ${activeChannel?.name}...`)}
                  className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors focus:outline-none"
                >
                  <Phone className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => alert(`Starting video seminar on ${activeChannel?.name}...`)}
                  className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors focus:outline-none"
                >
                  <Video className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setShowRightSidebar(!showRightSidebar)}
                  className={`p-2 rounded-full transition-colors focus:outline-none ${
                    showRightSidebar ? 'text-primary bg-primary-fixed/20' : 'text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  <Info className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Messages Area (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messagesLoading && (
              <div className="flex justify-center p-4">
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
              </div>
            )}

            {/* Empty States */}
            {activeId && !messagesLoading && filteredMessages.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-xs text-on-surface-variant font-medium">No academic conversations found in this chat.</p>
                <p className="text-[11px] text-on-surface-variant/70 mt-1">Send a message to kick off the research thread.</p>
              </div>
            )}

            {!activeId && (
              <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <GraduationCap className="w-16 h-16 text-primary/45 mb-4" />
                <h3 className="text-sm font-bold text-on-surface">Welcome to BbduConnect Chat</h3>
                <p className="text-xs text-on-surface-variant max-w-sm mt-1 leading-relaxed">
                  Select a discussion channel or start a direct message to connect with students and faculty advisors.
                </p>
              </div>
            )}

            {/* Message Feed cards */}
            {activeId && filteredMessages.map((msg) => {
              const isSelf = msg.senderId === user.id;
              return (
                <div 
                  key={msg.id} 
                  className={`flex gap-3 max-w-[85%] ${isSelf ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
                >
                  {msg.senderAvatar ? (
                    <img 
                      className="w-10 h-10 rounded-full shrink-0 object-cover align-bottom self-end" 
                      alt={msg.senderName} 
                      src={msg.senderAvatar} 
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center font-bold text-xs align-bottom self-end shrink-0 border border-outline-variant">
                      {msg.senderName.charAt(0)}
                    </div>
                  )}
                  <div className={`flex flex-col ${isSelf ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-on-surface">{msg.senderName}</span>
                      {msg.senderRole && (
                        <span className="bg-primary-fixed/30 text-on-primary-fixed-variant text-[9px] font-bold px-1.5 py-0.2 rounded uppercase">
                          {msg.senderRole}
                        </span>
                      )}
                      <span className="text-[10px] text-on-surface-variant/70 font-medium">{formatTime(msg.timestamp)}</span>
                      {(isSelf || user.role === 'ADMIN') && (
                        <button 
                          onClick={() => handleDeleteMsg(msg.id)}
                          className="text-on-surface-variant/50 hover:text-error hover:bg-error/10 p-0.5 rounded transition-colors focus:outline-none ml-1 cursor-pointer"
                          title="Delete message"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Standard Text Bubble */}
                    {msg.text && (
                      <div className={`p-3.5 rounded-2xl shadow-sm text-xs leading-relaxed border ${
                        isSelf 
                          ? 'bg-primary text-white border-primary rounded-br-none' 
                          : 'bg-surface border-outline-variant/40 rounded-bl-none text-on-surface'
                      }`}>
                        {msg.text}
                      </div>
                    )}

                    {/* PDF Attachment Attachment */}
                    {msg.fileAttachment && (
                      <div className="mt-2 bg-surface p-3.5 rounded-2xl shadow-sm border border-outline-variant/40 max-w-sm rounded-bl-none">
                        <div 
                          onClick={() => msg.fileAttachment?.url && window.open(msg.fileAttachment.url, '_blank')}
                          className="flex items-center gap-3 bg-surface-container-low p-2.5 rounded-lg border border-outline-variant hover:border-primary transition-colors cursor-pointer"
                        >
                          <div className="w-10 h-10 bg-primary-fixed text-primary flex items-center justify-center rounded">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-on-surface truncate">{msg.fileAttachment.name}</p>
                            <p className="text-[10px] text-on-surface-variant font-semibold">{msg.fileAttachment.size} | PDF Document</p>
                          </div>
                          <Download 
                            className="w-5 h-5 text-on-surface-variant hover:text-primary shrink-0" 
                          />
                        </div>
                      </div>
                    )}

                    {/* Image Attachment Card */}
                    {msg.imageAttachment && (
                      <div 
                        onClick={() => window.open(msg.imageAttachment, '_blank')}
                        className="mt-2 bg-surface p-1 rounded-2xl shadow-sm overflow-hidden border border-outline-variant/40 max-w-sm cursor-pointer hover:opacity-95"
                      >
                        <img 
                          className="w-full h-40 object-cover rounded-xl" 
                          alt="Shared attachment visual" 
                          src={msg.imageAttachment}
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            <div ref={messagesEndRef} />
          </div>

          {/* Message Input & Rich Formatting Dock */}
          {activeId && (
            <div className="p-4 bg-surface/90 backdrop-blur-md border-t border-outline-variant shrink-0">
              {/* Attachment Previews */}
              {isUploading && (
                <div className="mb-2 p-2 bg-surface-container border border-outline-variant/40 rounded-xl flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-primary animate-spin" />
                  <span className="text-xs font-bold text-on-surface-variant">Uploading attachment to storage...</span>
                </div>
              )}

              {attachedFile && (
                <div className="mb-2 p-2 bg-surface-container border border-outline-variant/40 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="text-primary w-5 h-5" />
                    <span className="text-xs font-bold text-on-surface truncate max-w-md">{attachedFile.name} ({attachedFile.size})</span>
                  </div>
                  <button 
                    onClick={() => setAttachedFile(null)}
                    className="text-on-surface-variant hover:text-error bg-transparent border-none cursor-pointer focus:outline-none"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {attachedImage && (
                <div className="mb-2 p-2 bg-surface-container border border-outline-variant/40 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="text-secondary w-5 h-5" />
                    <span className="text-xs font-bold text-on-surface truncate max-w-md">Image attached (Ready to send)</span>
                  </div>
                  <button 
                    onClick={() => setAttachedImage(null)}
                    className="text-on-surface-variant hover:text-error bg-transparent border-none cursor-pointer focus:outline-none"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              <form className="flex flex-col bg-surface border border-outline-variant rounded-2xl focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent transition-all shadow-sm" onSubmit={handleSendMessage}>
                {/* Rich text formatting tools */}
                <div className="flex items-center gap-1.5 px-3 pt-2">
                  <button 
                    onClick={() => setInputText(prev => prev + '**bold text**')}
                    className="p-1.5 text-on-surface-variant hover:text-primary rounded-full hover:bg-surface-container transition-colors focus:outline-none" 
                    type="button"
                  >
                    <Bold className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setInputText(prev => prev + '*italic text*')}
                    className="p-1.5 text-on-surface-variant hover:text-primary rounded-full hover:bg-surface-container transition-colors focus:outline-none" 
                    type="button"
                  >
                    <Italic className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setInputText(prev => prev + '[Academic Link](https://bbdu.edu)')}
                    className="p-1.5 text-on-surface-variant hover:text-primary rounded-full hover:bg-surface-container transition-colors focus:outline-none" 
                    type="button"
                  >
                    <Link className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setInputText(prev => prev + '\n- Bullet Point')}
                    className="p-1.5 text-on-surface-variant hover:text-primary rounded-full hover:bg-surface-container transition-colors focus:outline-none" 
                    type="button"
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <div className="w-px h-4 bg-outline-variant mx-1"></div>
                  <button 
                    onClick={() => setInputText(prev => prev + ' 🎓 ')}
                    className="p-1.5 text-on-surface-variant hover:text-primary rounded-full hover:bg-surface-container transition-colors focus:outline-none" 
                    type="button"
                  >
                    <Smile className="w-4 h-4" />
                  </button>
                </div>

                {/* Real Input Textarea */}
                <textarea 
                  className="w-full bg-transparent border-none focus:ring-0 px-4 py-2 resize-none text-xs min-h-[50px] outline-none text-on-surface" 
                  placeholder={`Message #${activeChannel?.name || 'chat'}...`} 
                  rows={2}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />

                {/* Send and Attach buttons dock */}
                <div className="flex items-center justify-between px-4 pb-3">
                  <div className="flex items-center gap-1.5">
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-on-surface-variant hover:bg-surface-container rounded-lg text-[11px] font-bold transition-colors focus:outline-none"
                      type="button"
                      disabled={isUploading}
                    >
                      <Paperclip className="w-4 h-4" />
                      Attach
                    </button>
                    <button 
                      onClick={() => imageInputRef.current?.click()}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-on-surface-variant hover:bg-surface-container rounded-lg text-[11px] font-bold transition-colors focus:outline-none"
                      type="button"
                      disabled={isUploading}
                    >
                      <ImageIcon className="w-4 h-4" />
                      Media
                    </button>
                  </div>
                  <button 
                    className="bg-primary hover:bg-primary-container text-white hover:text-on-primary-container p-2 rounded-xl flex items-center justify-center active:scale-95 transition-all shadow-sm focus:outline-none disabled:opacity-50"
                    type="submit"
                    disabled={isUploading}
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          )}
        </section>

        {/* Pane 3: Channel Info Sidebar */}
        {activeId && showRightSidebar && (
          <section className="hidden xl:flex w-[300px] border-l border-outline-variant bg-surface flex-col shrink-0 overflow-y-auto">
            {/* Top Identity Block */}
            <div className="p-6 border-b border-outline-variant flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-primary-fixed rounded-2xl flex items-center justify-center text-primary mb-3 shadow-sm">
                {activeChannel?.isDM ? <User className="w-8 h-8" /> : <Hash className="w-8 h-8" />}
              </div>
              <h3 className="text-xs font-bold text-on-surface">
                {activeChannel?.isDM ? activeChannel.name : `#${activeChannel?.name}`}
              </h3>
              <p className="text-[10px] text-on-surface-variant mt-1">
                {activeChannel?.isDM ? activeChannel.description : 'Group Discussion Channel'}
              </p>
              
              <div className="flex gap-2 mt-4 w-full">
                {canDelete ? (
                  <button 
                    onClick={handleDeleteChannel}
                    className="flex-1 px-3 py-2 bg-error text-white hover:bg-error/90 rounded-xl text-[11px] font-bold transition-colors focus:outline-none shadow-sm"
                  >
                    Delete Channel
                  </button>
                ) : (
                  <button 
                    onClick={() => alert('Channel details edit mode is currently restricted.')}
                    className="flex-1 px-3 py-2 bg-surface-container-low hover:bg-surface-container-high border border-outline-variant rounded-xl text-[11px] font-bold transition-colors focus:outline-none"
                  >
                    Edit
                  </button>
                )}
                <button 
                  onClick={() => alert(`Unique Share Link: https://bbdu.edu/channel/${activeChannel?.id}`)}
                  className="flex-1 px-3 py-2 bg-surface-container-low hover:bg-surface-container-high border border-outline-variant rounded-xl text-[11px] font-bold transition-colors focus:outline-none"
                >
                  Share
                </button>
              </div>
            </div>

            {/* Info Section */}
            <div className="p-6 border-b border-outline-variant">
              <h4 className="text-[11px] font-bold text-primary-container mb-3 uppercase">About</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                {activeChannel?.description || 'No description provided for this channel.'}
              </p>
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
