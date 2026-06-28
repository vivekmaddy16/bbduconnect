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
  Eye,
  CheckCircle,
  HelpCircle,
  X,
  Menu
} from 'lucide-react';
import { Channel, Message, User as UserType } from '../types';
import { initialChannels, initialDMs, initialMessages } from '../data';

interface MessagesScreenProps {
  user: UserType;
  onToggleSidebar: () => void;
}

export default function MessagesScreen({ user, onToggleSidebar }: MessagesScreenProps) {
  const [channels, setChannels] = useState<Channel[]>(initialChannels);
  const [dms, setDMs] = useState<Channel[]>(initialDMs);
  const [activeId, setActiveId] = useState<string>('ch_data_science');
  const [messages, setMessages] = useState<Record<string, Message[]>>(initialMessages);
  
  const [inputText, setInputText] = useState('');
  const [attachedFile, setAttachedFile] = useState<{ name: string; size: string; type: string } | null>(null);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showRightSidebar, setShowRightSidebar] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeChannel = 
    channels.find(c => c.id === activeId) || 
    dms.find(d => d.id === activeId);

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
    // Clear unread count when clicked
    setChannels(prev => prev.map(c => c.id === id ? { ...c, unreadCount: 0 } : c));
  };

  // Add simulated reply timer for higher fidelity
  const simulateReply = (chanId: string, authorName: string) => {
    setTimeout(() => {
      const responses = [
        "That looks perfect, let me review the calculations.",
        "Excellent progress! I think we should double-check the database indexes for performance.",
        "Should we schedule our sync meeting for tomorrow at 2:00 PM?",
        "I've added my comments to the shared document.",
        "Got it! I will merge these changes into the main branch shortly."
      ];
      const randResponse = responses[Math.floor(Math.random() * responses.length)];

      const isDM = dms.some(d => d.id === chanId);
      const dmTarget = dms.find(d => d.id === chanId);
      const defaultAvatar = 'https://lh3.googleusercontent.com/aida-public/AB6AXuATDfKyDw9py25e-EeMwDmy4QJJ2nTmvVtkO5ihth1fTA2iqi8q25kIC0xCfz5PZvCaouc3NyxZ4DVBIfoLAHkk7M_6PcS1KPFLhif6nTkLZ29uVEEfmysjVX4RmwCKAQAhAIMoJSJ8x9W_eVeu3Qswe5eGxYS4zJQ6BFFzn5gi81B9T6GVCEghYDMcdSBx5KoC1bbi12FyVLwR08cFG5OL1MVYrar9tuaXkJ0LZlr6ITjwoPCvb56psb049ionib3pg7ui76sq6QE';

      const replyMsg: Message = {
        id: `msg_reply_${Date.now()}`,
        channelId: chanId,
        senderName: isDM ? dmTarget?.name || 'Dr. Sarah Miller' : 'Dr. Sarah Miller',
        senderAvatar: isDM ? (dmTarget?.avatar || defaultAvatar) : defaultAvatar,
        senderRole: isDM ? dmTarget?.role || 'FACULTY ADVISOR' : 'FACULTY ADVISOR',
        text: randResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSelf: false
      };

      setMessages(prev => ({
        ...prev,
        [chanId]: [...(prev[chanId] || []), replyMsg]
      }));
    }, 2000);
  };

  // Handle Sending a Message
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() && !attachedFile && !attachedImage) return;

    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      channelId: activeId,
      senderName: user.name,
      senderAvatar: user.avatar,
      senderRole: user.role,
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSelf: true,
      fileAttachment: attachedFile || undefined,
      imageAttachment: attachedImage || undefined
    };

    setMessages(prev => ({
      ...prev,
      [activeId]: [...(prev[activeId] || []), newMsg]
    }));

    // Trigger auto simulated reply for realistic interaction
    simulateReply(activeId, activeChannel?.name || 'System');

    // Reset input fields
    setInputText('');
    setAttachedFile(null);
    setAttachedImage(null);
  };

  // Simulate attaching a PDF
  const simulateAttachFile = () => {
    setAttachedFile({
      name: 'Dataset_Tensors_Final_v3.pdf',
      size: '4.8 MB',
      type: 'pdf'
    });
    setAttachedImage(null);
  };

  // Simulate attaching an Image
  const simulateAttachImage = () => {
    setAttachedImage('https://lh3.googleusercontent.com/aida-public/AB6AXuATIrI-6AE11LyLvmxa5cAYJON4G0GDVOzA8Audh04s1nBVJ7FNP22_xdwQAGHn8lNUN2hwODaWUOdwQSjAr1OVz-MC4KPoD0gbisgvyHGPCooEINJFPcRL9ja1HUBxqHr_IEdv3YfSesoVQwoh2qSpWvUNxrV6bx-4fiLjb4_jQVIxOO1HTISn_P77oK9hY7Q6mJoPo9BM5FP5vb0YGyN9c2X4IQTUe33nnTUihfQej_j7Cu7LA-4vn3ICp8TpXpgelOIi3J5318g');
    setAttachedFile(null);
  };

  // Filter messages based on search query
  const currentChatMessages = messages[activeId] || [];
  const filteredMessages = currentChatMessages.filter(m => 
    m.text?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.fileAttachment?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Add new channel handler
  const handleAddNewChannel = () => {
    const name = prompt('Enter new channel name (no spaces):');
    if (!name) return;
    const cleanName = name.trim().toLowerCase().replace(/\s+/g, '-');
    const newChan: Channel = {
      id: `ch_${Date.now()}`,
      name: cleanName,
      description: 'Newly created discussion group',
      unreadCount: 0,
      isDM: false
    };
    setChannels(prev => [...prev, newChan]);
    setMessages(prev => ({ ...prev, [newChan.id]: [] }));
    setActiveId(newChan.id);
  };

  return (
    <div className="md:ml-[280px] h-screen flex flex-col overflow-hidden bg-background">
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
            onClick={() => alert('Faculty Advisor: Dr. Sarah Miller, Department Dean: Dean Arthur Pendelton')}
          >
            <Users className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content Pane Split */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Pane 1: Conversations List (Channels/DMs) */}
        <section className="w-[280px] border-r border-outline-variant bg-surface flex flex-col shrink-0">
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
                    <img 
                      className="w-10 h-10 rounded-full object-cover" 
                      alt={dm.name} 
                      src={dm.avatar} 
                      referrerPolicy="no-referrer"
                    />
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
        <section className="flex-1 bg-surface-container-low flex flex-col relative overflow-hidden">
          {/* Chat Header */}
          <div className="h-16 px-4 md:px-6 border-b border-outline-variant flex items-center justify-between bg-surface/80 backdrop-blur-md sticky top-0 z-10 shrink-0">
            <div className="flex items-center gap-3">
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
                  {activeChannel?.isDM ? activeChannel?.name : (activeChannel?.name || 'Channel')}
                </h2>
                <p className="text-[10px] text-on-surface-variant truncate font-medium">
                  {activeChannel?.description}
                </p>
              </div>
            </div>
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
          </div>

          {/* Messages Area (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="flex justify-center my-4">
              <span className="bg-surface-container-highest text-on-surface-variant text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Monday, October 23
              </span>
            </div>

            {/* Empty States */}
            {filteredMessages.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-xs text-on-surface-variant font-medium">No academic conversations found in this chat.</p>
                <p className="text-[11px] text-on-surface-variant/70 mt-1">Send a message to kick off the research thread.</p>
              </div>
            )}

            {/* Message Feed cards */}
            {filteredMessages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex gap-3 max-w-[85%] ${msg.isSelf ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                <img 
                  className="w-10 h-10 rounded-full shrink-0 object-cover align-bottom self-end" 
                  alt={msg.senderName} 
                  src={msg.senderAvatar} 
                  referrerPolicy="no-referrer"
                />
                <div className={`flex flex-col ${msg.isSelf ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-on-surface">{msg.senderName}</span>
                    {msg.senderRole && (
                      <span className="bg-primary-fixed/30 text-on-primary-fixed-variant text-[9px] font-bold px-1.5 py-0.2 rounded uppercase">
                        {msg.senderRole}
                      </span>
                    )}
                    <span className="text-[10px] text-on-surface-variant/70 font-medium">{msg.timestamp}</span>
                  </div>

                  {/* Standard Text Bubble */}
                  {msg.text && (
                    <div className={`p-3.5 rounded-2xl shadow-sm text-xs leading-relaxed border ${
                      msg.isSelf 
                        ? 'bg-primary text-white border-primary rounded-br-none' 
                        : 'bg-surface border-outline-variant/40 rounded-bl-none text-on-surface'
                    }`}>
                      {msg.text}
                    </div>
                  )}

                  {/* PDF Attachment Attachment */}
                  {msg.fileAttachment && (
                    <div className="mt-2 bg-surface p-3.5 rounded-2xl shadow-sm border border-outline-variant/40 max-w-sm rounded-bl-none">
                      <div className="flex items-center gap-3 bg-surface-container-low p-2.5 rounded-lg border border-outline-variant hover:border-primary transition-colors cursor-pointer">
                        <div className="w-10 h-10 bg-primary-fixed text-primary flex items-center justify-center rounded">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-on-surface truncate">{msg.fileAttachment.name}</p>
                          <p className="text-[10px] text-on-surface-variant font-semibold">{msg.fileAttachment.size} • PDF Document</p>
                        </div>
                        <Download 
                          onClick={() => alert(`Downloading ${msg.fileAttachment?.name} (Simulated)`)}
                          className="w-5 h-5 text-on-surface-variant hover:text-primary shrink-0" 
                        />
                      </div>
                    </div>
                  )}

                  {/* Image Attachment Card */}
                  {msg.imageAttachment && (
                    <div className="mt-2 bg-primary p-1 rounded-2xl shadow-sm overflow-hidden border-2 border-primary max-w-sm rounded-br-none">
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
            ))}

            <div ref={messagesEndRef} />
          </div>

          {/* Message Input & Rich Formatting Dock */}
          <div className="p-4 bg-surface/90 backdrop-blur-md border-t border-outline-variant shrink-0">
            {/* Attachment Previews */}
            {attachedFile && (
              <div className="mb-2 p-2 bg-surface-container border border-outline-variant/40 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="text-primary w-5 h-5" />
                  <span className="text-xs font-bold text-on-surface truncate max-w-md">{attachedFile.name}</span>
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
                  <span className="text-xs font-bold text-on-surface truncate">Simulation: Dashboard preview image attached</span>
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
                className="w-full bg-transparent border-none focus:ring-0 px-4 py-2 resize-none text-xs min-h-[50px] outline-none" 
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
                    onClick={simulateAttachFile}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-on-surface-variant hover:bg-surface-container rounded-lg text-[11px] font-bold transition-colors focus:outline-none"
                    type="button"
                  >
                    <Paperclip className="w-4 h-4" />
                    Attach
                  </button>
                  <button 
                    onClick={simulateAttachImage}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-on-surface-variant hover:bg-surface-container rounded-lg text-[11px] font-bold transition-colors focus:outline-none"
                    type="button"
                  >
                    <ImageIcon className="w-4 h-4" />
                    Media
                  </button>
                </div>
                <button 
                  className="bg-primary hover:bg-primary-container text-white hover:text-on-primary-container p-2 rounded-xl flex items-center justify-center active:scale-95 transition-all shadow-sm focus:outline-none"
                  type="submit"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Pane 3: Channel Info Sidebar */}
        {showRightSidebar && (
          <section className="w-[300px] border-l border-outline-variant bg-surface flex flex-col shrink-0 overflow-y-auto">
            {/* Top Identity Block */}
            <div className="p-6 border-b border-outline-variant flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-primary-fixed rounded-2xl flex items-center justify-center text-primary mb-3 shadow-sm">
                <Hash className="w-8 h-8" />
              </div>
              <h3 className="text-xs font-bold text-on-surface">#{activeChannel?.name}</h3>
              <p className="text-[10px] text-on-surface-variant mt-1">
                Created by {activeChannel?.isDM ? activeChannel.name : 'Alex Rivera'} • 12 Oct
              </p>
              
              <div className="flex gap-2 mt-4 w-full">
                <button 
                  onClick={() => alert('Channel details edit mode is currently restricted (Simulated).')}
                  className="flex-1 px-3 py-2 bg-surface-container-low hover:bg-surface-container-high border border-outline-variant rounded-xl text-[11px] font-bold transition-colors focus:outline-none"
                >
                  Edit
                </button>
                <button 
                  onClick={() => alert(`Unique Link Copied: https://bbdu.edu/channel/${activeChannel?.id}`)}
                  className="flex-1 px-3 py-2 bg-surface-container-low hover:bg-surface-container-high border border-outline-variant rounded-xl text-[11px] font-bold transition-colors focus:outline-none"
                >
                  Share
                </button>
              </div>
            </div>

            {/* Members Section */}
            <div className="p-6 border-b border-outline-variant">
              <h4 className="text-[11px] font-bold text-primary-container mb-4 flex justify-between uppercase">
                Members 
                <span className="text-on-surface-variant font-normal">8</span>
              </h4>
              
              <div className="space-y-4">
                {/* Advisor */}
                <div className="flex items-center gap-3">
                  <div className="relative shrink-0">
                    <img 
                      className="w-8 h-8 rounded-full object-cover" 
                      alt="Dr. Sarah Miller" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuATDfKyDw9py25e-EeMwDmy4QJJ2nTmvVtkO5ihth1fTA2iqi8q25kIC0xCfz5PZvCaouc3NyxZ4DVBIfoLAHkk7M_6PcS1KPFLhif6nTkLZ29uVEEfmysjVX4RmwCKAQAhAIMoJSJ8x9W_eVeu3Qswe5eGxYS4zJQ6BFFzn5gi81B9T6GVCEghYDMcdSBx5KoC1bbi12FyVLwR08cFG5OL1MVYrar9tuaXkJ0LZlr6ITjwoPCvb56psb049ionib3pg7ui76sq6QE" 
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-secondary border-2 border-white rounded-full"></span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-on-surface truncate">Dr. Sarah Miller</p>
                    <p className="text-[9px] font-extrabold text-on-surface-variant/80 tracking-wider uppercase">FACULTY ADVISOR</p>
                  </div>
                </div>

                {/* You */}
                <div className="flex items-center gap-3">
                  <div className="relative shrink-0">
                    <img 
                      className="w-8 h-8 rounded-full object-cover" 
                      alt="Alex Rivera" 
                      src={user.avatar} 
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-secondary border-2 border-white rounded-full"></span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-on-surface truncate">{user.name} (You)</p>
                    <p className="text-[9px] font-extrabold text-on-surface-variant/80 tracking-wider uppercase">STUDENT</p>
                  </div>
                </div>

                {/* Marcus Chen */}
                <div className="flex items-center gap-3">
                  <div className="relative shrink-0">
                    <img 
                      className="w-8 h-8 rounded-full object-cover" 
                      alt="Marcus Chen" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqy-Gi_Qf14KB9XdwTfT3uaLfx8Tc_DxAD-vo4PTqRWJnYclgYcUxwk6HvkVEbYpcnSMhRceOFNzskeLhDDoeOWcVub6FiJzCaL-AbNTt5k6dGOzTzBTDe1rEZ9pwnidAUe1ro7sFENCUg5xnZd7X6TgcZLkg8lugh4gu2hmn8a3uk_mmV8eIpJsFSBBnpQxBTl-pCJrz_tOaAgOen1FfxC897_h9wMUfJzcaGLamKJuEBxcuOYw6GPyIj2FKwB87JD33D09wcpIM" 
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-secondary border-2 border-white rounded-full"></span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-on-surface truncate">Marcus Chen</p>
                    <p className="text-[9px] font-extrabold text-on-surface-variant/80 tracking-wider uppercase">STUDENT</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Shared Media */}
            <div className="p-6">
              <h4 className="text-[11px] font-bold text-primary-container mb-4 uppercase">Shared Media</h4>
              <div className="grid grid-cols-3 gap-1.5">
                <div className="aspect-square rounded-lg bg-surface-container-high hover:opacity-85 cursor-pointer overflow-hidden shadow-sm">
                  <img 
                    className="w-full h-full object-cover" 
                    alt="Research data glowing" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBkbuYdr4Ej9qq3QOa8ZA5NaJparaiV4jVfR4erHdrAVfNXC_0pD0B7YgnUHRXrxyrr3GrmjAzOyKoV1UCnU9a2nKjLYPx92WDPt6pJXP7dqHwESD-7WScGO7nt1KGiVAZG8ppDOmjKJQ0jpIgK93Inv4CDc601c4UOhkZzC3IGdSGGeK299DM3hkh3MarIwvvvNXEEO8YXaBYpRbJ5fqI3l6m-VuURqz5As4CsqW54SgK03b9cO4oYm3lb7XTBUkLbGYmVOKh75qk" 
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="aspect-square rounded-lg bg-surface-container-high hover:opacity-85 cursor-pointer overflow-hidden shadow-sm">
                  <img 
                    className="w-full h-full object-cover" 
                    alt="University library architectural morning light" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmFWd7tlZ-b5WtckqbCPs9gXnhArUM216vNdApuyY52yh9ox_NEVjZhTPfEu-kxkBQWReJROqNNjp85mCLWc484DNlEdZkdpDvwuFfBV99HaT7W4mT-l04-QhSJYC7GbLaJrYmX98l2iweT9r8wdNnR7B4WqcYDfpqTvfOZlEwOeH4bFb5C2xYCprylU1w-JuL6gUahbETWi8j3stYbQ9hqpoX6nz35O_e0On3rFDHevYld0ahwG79IE9qMVW5kHTF2ooT2at-vdo" 
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="aspect-square rounded-lg bg-surface-container-high hover:bg-surface-container-highest flex items-center justify-center border border-outline-variant/50 cursor-pointer text-on-surface-variant shadow-sm">
                  <ImageIcon className="w-5 h-5" />
                </div>
              </div>
              <button 
                onClick={() => alert('Opening Shared Media Library (24 items total)...')}
                className="w-full mt-4 py-2 text-primary font-bold text-xs hover:underline bg-transparent border-none focus:outline-none"
              >
                View all 24 items
              </button>
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
