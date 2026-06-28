/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Search, 
  Upload, 
  Grid as GridIcon, 
  List as ListIcon, 
  FileText, 
  Folder, 
  TableProperties, 
  Presentation, 
  Image as ImageIcon, 
  MoreVertical, 
  Share2, 
  Download, 
  Star,
  Plus,
  Loader2,
  X,
  FileUp,
  Menu
} from 'lucide-react';
import { FileItem, User } from '../types';
import { initialFiles } from '../data';

interface FilesScreenProps {
  user: User;
  onToggleSidebar: () => void;
}

export default function FilesScreen({ user, onToggleSidebar }: FilesScreenProps) {
  const [files, setFiles] = useState<FileItem[]>(initialFiles);
  const [activeCategory, setActiveCategory] = useState<'All' | 'PDFs' | 'Assignments' | 'Lectures' | 'Research'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [layoutMode, setLayoutMode] = useState<'grid' | 'list'>('grid');
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Upload simulation states
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileCategory, setNewFileCategory] = useState<'PDFs' | 'Assignments' | 'Lectures' | 'Research'>('Research');

  // Filter Categories
  const categories: ('All' | 'PDFs' | 'Assignments' | 'Lectures' | 'Research')[] = [
    'All', 'PDFs', 'Assignments', 'Lectures', 'Research'
  ];

  // Filter & Search Logic
  const filteredFiles = files.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          f.author.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeCategory === 'All') return matchesSearch;
    return matchesSearch && f.category === activeCategory;
  });

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-8 h-8 text-error shrink-0" />;
      case 'zip':
        return <Folder className="w-8 h-8 text-amber-500 shrink-0" />;
      case 'xlsx':
        return <TableProperties className="w-8 h-8 text-emerald-600 shrink-0" />;
      case 'pptx':
        return <Presentation className="w-8 h-8 text-rose-500 shrink-0" />;
      case 'docx':
        return <FileText className="w-8 h-8 text-blue-600 shrink-0" />;
      default:
        return <ImageIcon className="w-8 h-8 text-primary shrink-0" />;
    }
  };

  // Simulate file upload logic
  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName) return;

    setIsUploading(true);
    setUploadProgress(10);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            const ext = newFileName.split('.').pop() || 'pdf';
            const cleanExt = ['pdf', 'zip', 'xlsx', 'pptx', 'docx', 'jpg', 'png'].includes(ext) ? ext : 'pdf';
            const uploadedFile: FileItem = {
              id: `file_${Date.now()}`,
              name: newFileName,
              type: cleanExt as any,
              size: '4.2 MB',
              category: newFileCategory,
              date: 'Just now',
              author: user.name,
              badges: ['Uploaded']
            };
            setFiles(prevFiles => [uploadedFile, ...prevFiles]);
            setIsUploading(false);
            setUploadProgress(0);
            setNewFileName('');
            setShowUploadModal(false);
          }, 500);
          return 100;
        }
        return prev + 25;
      });
    }, 200);
  };

  const toggleStarFile = (id: string) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, isStarred: !f.isStarred } : f));
  };

  return (
    <div className="md:ml-[280px] h-screen flex flex-col overflow-hidden bg-background">
      {/* Top Bar Navigation */}
      <header className="h-16 bg-surface border-b border-outline-variant flex justify-between items-center px-4 md:px-6 shrink-0 z-20">
        <div className="flex items-center gap-3 md:gap-4 flex-1 max-w-xl">
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-2 text-on-surface-variant hover:text-primary rounded-lg hover:bg-surface-container transition-colors focus:outline-none"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h2 className="text-sm font-bold text-primary hidden lg:block">Academic Vault</h2>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-4 h-4" />
            <input 
              className="w-full h-10 pl-10 pr-4 bg-surface-container-low border border-outline-variant rounded-full text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none" 
              placeholder="Search academic resources, PDFs, or notes..." 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <button 
          onClick={() => setShowUploadModal(true)}
          className="bg-primary hover:bg-primary-container text-white hover:text-on-primary-container px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm focus:outline-none transition-all active:scale-95"
        >
          <Upload className="w-4 h-4" />
          Upload File
        </button>
      </header>

      {/* Main Files workspace */}
      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        <div>
          <h3 className="text-xl font-bold text-primary">Academic Vault</h3>
          <p className="text-xs text-on-surface-variant mt-1">Shared resources for Faculty of Engineering & Technology.</p>
        </div>

        {/* Filters and Layout controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-surface p-3 rounded-xl border border-outline-variant/30">
          {/* Tag Chips */}
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all focus:outline-none ${
                  activeCategory === cat
                    ? 'bg-primary text-white font-semibold'
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                {cat === 'All' ? 'All Files' : cat}
              </button>
            ))}
          </div>

          {/* Grid/List layout selector */}
          <div className="flex items-center gap-1 border border-outline-variant bg-surface-container-low p-1 rounded-lg shrink-0">
            <button
              onClick={() => setLayoutMode('grid')}
              className={`p-1.5 rounded ${layoutMode === 'grid' ? 'bg-surface text-primary font-bold shadow-xs' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
              title="Grid View"
            >
              <GridIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setLayoutMode('list')}
              className={`p-1.5 rounded ${layoutMode === 'list' ? 'bg-surface text-primary font-bold shadow-xs' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
              title="List View"
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Files Grid/List Area */}
        {filteredFiles.length === 0 ? (
          <div className="bg-surface border border-outline-variant rounded-2xl p-12 text-center flex flex-col items-center justify-center">
            <FileText className="w-12 h-12 text-on-surface-variant/40 mb-3" />
            <p className="text-sm font-bold text-on-surface">No resources match your search.</p>
            <p className="text-xs text-on-surface-variant mt-1">Try resetting the tags or typing a different keyword.</p>
          </div>
        ) : layoutMode === 'grid' ? (
          /* Grid Layout View */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFiles.map((file) => (
              <div 
                key={file.id} 
                className="bg-surface border border-outline-variant rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group border-l-4 border-l-primary"
              >
                {/* Visual Thumbnail */}
                {file.imageUrl ? (
                  <div className="h-44 bg-surface-container relative overflow-hidden shrink-0">
                    <img 
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                      alt={file.name} 
                      src={file.imageUrl}
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute top-3 right-3 bg-primary/95 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                      IMG
                    </span>
                  </div>
                ) : (
                  <div className="h-28 bg-surface-container-low flex items-center justify-center relative shrink-0">
                    {getFileIcon(file.type)}
                    <span className="absolute top-3 right-3 bg-surface-container-highest border border-outline-variant text-[10px] font-bold px-2 py-0.5 rounded uppercase text-on-surface">
                      {file.type}
                    </span>
                  </div>
                )}

                {/* File Description Block */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h4 className="text-xs font-extrabold text-on-surface line-clamp-1 group-hover:text-primary transition-colors">
                      {file.name}
                    </h4>
                    <p className="text-[10px] text-on-surface-variant font-medium mt-1">
                      {file.size} • {file.date}
                    </p>

                    {/* Badge Pill tags */}
                    {file.badges && file.badges.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {file.badges.map((badge, bIdx) => (
                          <span 
                            key={bIdx} 
                            className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                              badge === 'Faculty Only' 
                                ? 'bg-secondary-container text-on-secondary-container' 
                                : badge === 'Confidential' 
                                ? 'bg-error-container text-on-error-container' 
                                : 'bg-primary-fixed/40 text-on-primary-fixed-variant'
                            }`}
                          >
                            {badge}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Author metadata and fast download icons */}
                  <div className="flex items-center justify-between border-t border-outline-variant/30 pt-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary-fixed text-primary text-[10px] font-bold flex items-center justify-center">
                        {file.author.charAt(0)}
                      </div>
                      <span className="text-[11px] font-medium text-on-surface-variant truncate max-w-[100px]">
                        {file.author}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button 
                        onClick={() => toggleStarFile(file.id)}
                        className={`p-1.5 rounded-full transition-colors focus:outline-none ${file.isStarred ? 'text-amber-500' : 'text-on-surface-variant/40 hover:text-amber-500'}`}
                      >
                        <Star className="w-4 h-4" fill={file.isStarred ? 'currentColor' : 'none'} />
                      </button>
                      <button 
                        onClick={() => alert(`Unique Share Link Copied for ${file.name}`)}
                        className="p-1.5 text-on-surface-variant/70 hover:text-primary rounded-full transition-colors focus:outline-none"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => alert(`Initiating file download for ${file.name} (Simulated)`)}
                        className="p-1.5 text-on-surface-variant/70 hover:text-primary rounded-full transition-colors focus:outline-none"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List Layout View */
          <div className="bg-surface border border-outline-variant rounded-xl overflow-hidden shadow-sm">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-surface-container border-b border-outline-variant text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                  <th className="p-4">Name</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Size</th>
                  <th className="p-4">Uploaded By</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30">
                {filteredFiles.map((file) => (
                  <tr key={file.id} className="hover:bg-surface-container-low transition-colors text-xs">
                    <td className="p-4 font-bold text-on-surface flex items-center gap-3">
                      <div className="w-6 h-6 shrink-0 flex items-center justify-center">
                        {file.type === 'pdf' ? <FileText className="w-5 h-5 text-error" /> : <ImageIcon className="w-5 h-5 text-primary" />}
                      </div>
                      <span className="truncate max-w-xs">{file.name}</span>
                    </td>
                    <td className="p-4 font-semibold text-on-surface-variant uppercase">{file.type}</td>
                    <td className="p-4 text-on-surface-variant font-medium">{file.category}</td>
                    <td className="p-4 text-on-surface-variant font-medium">{file.size}</td>
                    <td className="p-4 text-on-surface-variant font-medium">{file.author}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button 
                          onClick={() => toggleStarFile(file.id)}
                          className={`p-1.5 rounded-full focus:outline-none ${file.isStarred ? 'text-amber-500' : 'text-on-surface-variant/40 hover:text-amber-500'}`}
                        >
                          <Star className="w-4 h-4" fill={file.isStarred ? 'currentColor' : 'none'} />
                        </button>
                        <button 
                          onClick={() => alert(`Simulated Download of ${file.name}`)}
                          className="p-1.5 text-on-surface-variant hover:text-primary rounded-full focus:outline-none"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => alert(`Shared URL copy for ${file.name}`)}
                          className="p-1.5 text-on-surface-variant hover:text-primary rounded-full focus:outline-none"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Upload File Simulation Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-primary/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-surface border border-outline-variant rounded-2xl w-full max-w-lg shadow-2xl p-6 relative">
            <button 
              onClick={() => setShowUploadModal(false)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface p-1 rounded-full focus:outline-none"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary-fixed text-primary flex items-center justify-center">
                <FileUp className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-primary">Upload Academic Document</h3>
                <p className="text-xs text-on-surface-variant">Simulate publishing research resources, homeworks, or materials.</p>
              </div>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-on-surface-variant block">File Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Distributed_Consensus_Draft.pdf"
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-on-surface-variant block">Category Classifier</label>
                <select 
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-primary focus:border-primary outline-none text-on-surface"
                  value={newFileCategory}
                  onChange={(e) => setNewFileCategory(e.target.value as any)}
                >
                  <option value="Research">Research & Literature</option>
                  <option value="Lectures">Lecture Syllabus/Notes</option>
                  <option value="Assignments">Assignments & Tests</option>
                </select>
              </div>

              {/* Drag and Drop Zone Simulator */}
              <div className="border-2 border-dashed border-outline-variant rounded-xl p-6 text-center bg-surface-container-low/50 hover:bg-surface-container-low hover:border-primary transition-colors cursor-pointer flex flex-col items-center justify-center">
                <FileUp className="w-8 h-8 text-on-surface-variant/50 mb-2" />
                <span className="text-xs font-bold text-on-surface">Drag your file here or click to select</span>
                <span className="text-[10px] text-on-surface-variant/70 mt-1">Supports PDF, DOCX, XLSX, PPTX, JPG (Max 100MB)</span>
              </div>

              {isUploading ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold text-primary">
                    <span className="flex items-center gap-1">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Uploading simulation progress...
                    </span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-surface-container-highest rounded-full h-2 overflow-hidden">
                    <div className="bg-primary h-full transition-all duration-200" style={{ width: `${uploadProgress}%` }}></div>
                  </div>
                </div>
              ) : (
                <button
                  type="submit"
                  className="w-full py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-xs font-bold shadow-md hover:shadow-lg transition-all focus:outline-none"
                >
                  Publish to Vault
                </button>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
