/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
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
import { useFiles } from '../hooks/useFiles';

interface FilesScreenProps {
  user: User;
  onToggleSidebar: () => void;
}

export default function FilesScreen({ user, onToggleSidebar }: FilesScreenProps) {
  const { files, loading, uploadFile, toggleStarFile } = useFiles(user);
  
  const [activeCategory, setActiveCategory] = useState<'All' | 'PDFs' | 'Assignments' | 'Lectures' | 'Research'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [layoutMode, setLayoutMode] = useState<'grid' | 'list'>('grid');
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Upload states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [newFileCategory, setNewFileCategory] = useState<'PDFs' | 'Assignments' | 'Lectures' | 'Research'>('Research');

  const fileInputRef = useRef<HTMLInputElement>(null);

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
    switch (type.toLowerCase()) {
      case 'pdf':
        return <FileText className="w-8 h-8 text-error shrink-0" />;
      case 'zip':
      case 'rar':
        return <Folder className="w-8 h-8 text-amber-500 shrink-0" />;
      case 'xlsx':
      case 'csv':
        return <TableProperties className="w-8 h-8 text-emerald-600 shrink-0" />;
      case 'pptx':
      case 'ppt':
        return <Presentation className="w-8 h-8 text-rose-500 shrink-0" />;
      case 'docx':
      case 'doc':
        return <FileText className="w-8 h-8 text-blue-600 shrink-0" />;
      default:
        return <ImageIcon className="w-8 h-8 text-primary shrink-0" />;
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  // Upload file logic
  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      alert('Please select a file to upload.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    uploadFile(
      selectedFile,
      newFileCategory,
      (progress) => setUploadProgress(progress),
      () => {
        // Success
        setIsUploading(false);
        setUploadProgress(0);
        setSelectedFile(null);
        setShowUploadModal(false);
      },
      (error) => {
        // Error
        setIsUploading(false);
        setUploadProgress(0);
        alert(`Failed to upload file: ${error.message || error}`);
      }
    );
  };

  return (
    <div className="md:ml-[280px] h-screen flex flex-col overflow-hidden bg-background">
      {/* Hidden File Selector */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileSelect} 
        className="hidden" 
      />

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
          onClick={() => {
            setSelectedFile(null);
            setShowUploadModal(true);
          }}
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
          <p className="text-xs text-on-surface-variant mt-1">Shared resources for Faculty of {user.department || 'Engineering & Tech'}.</p>
        </div>

        {/* Filters and Layout controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-surface p-3 rounded-xl border border-outline-variant/30">
          <div className="flex flex-wrap gap-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all focus:outline-none ${
                  activeCategory === cat 
                    ? 'bg-primary-container text-on-primary-container' 
                    : 'text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto border-t sm:border-t-0 pt-2 sm:pt-0 w-full sm:w-auto justify-end">
            <button 
              onClick={() => setLayoutMode('grid')}
              className={`p-1.5 rounded-lg transition-colors focus:outline-none ${layoutMode === 'grid' ? 'bg-surface-container-high text-primary' : 'text-on-surface-variant hover:bg-surface-container'}`}
            >
              <GridIcon className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setLayoutMode('list')}
              className={`p-1.5 rounded-lg transition-colors focus:outline-none ${layoutMode === 'list' ? 'bg-surface-container-high text-primary' : 'text-on-surface-variant hover:bg-surface-container'}`}
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Grid or List Layout View */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-xs font-semibold text-on-surface-variant mt-2">Loading documents from storage...</p>
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-outline-variant rounded-2xl bg-surface/50">
            <Folder className="w-12 h-12 text-on-surface-variant/40 mb-3" />
            <p className="text-sm font-bold text-on-surface">No documents match the search</p>
            <p className="text-xs text-on-surface-variant mt-1">Upload a resource to seed this vault category.</p>
          </div>
        ) : layoutMode === 'grid' ? (
          /* Grid Layout View */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredFiles.map((file) => (
              <div 
                key={file.id} 
                className="bg-surface border border-outline-variant/40 rounded-xl p-4 flex flex-col justify-between hover:shadow-md hover:border-outline transition-all group relative"
              >
                {/* Star Overlay */}
                <button 
                  onClick={() => toggleStarFile(file.id, !!file.isStarred)}
                  className="absolute top-3 right-3 p-1.5 bg-surface-container-lowest/80 backdrop-blur-xs rounded-full border border-outline-variant/30 text-on-surface-variant/40 hover:text-amber-500 focus:outline-none transition-colors"
                >
                  <Star className={`w-4 h-4 ${file.isStarred ? 'text-amber-500 fill-amber-500' : ''}`} />
                </button>

                <div>
                  <div className="mb-4">
                    {getFileIcon(file.type)}
                  </div>

                  <h4 className="text-xs font-bold text-on-surface line-clamp-1 pr-6" title={file.name}>
                    {file.name}
                  </h4>
                  <p className="text-[10px] text-on-surface-variant/80 font-medium mt-0.5">
                    {file.size} • {file.category}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-outline-variant/20 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    {file.authorAvatar ? (
                      <img 
                        className="w-5 h-5 rounded-full object-cover shrink-0" 
                        alt={file.author} 
                        src={file.authorAvatar} 
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-primary-container text-on-primary-container text-[9px] font-bold flex items-center justify-center shrink-0">
                        {file.author.charAt(0)}
                      </div>
                    )}
                    <span className="text-[10px] font-bold text-on-surface-variant truncate max-w-[80px]">
                      {file.author}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => {
                        if (file.downloadUrl) {
                          window.open(file.downloadUrl, '_blank');
                        } else {
                          alert('This file is simulated and does not have a real URL.');
                        }
                      }}
                      className="p-1 text-on-surface-variant hover:text-primary rounded transition-colors focus:outline-none"
                      title="Download"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => {
                        if (file.downloadUrl) {
                          navigator.clipboard.writeText(file.downloadUrl);
                          alert('Download URL copied to clipboard!');
                        } else {
                          alert('This is a simulated file; cannot copy download link.');
                        }
                      }}
                      className="p-1 text-on-surface-variant hover:text-primary rounded transition-colors focus:outline-none"
                      title="Share"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List Layout View */
          <div className="bg-surface border border-outline-variant rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left min-w-[600px]">
                <thead>
                  <tr className="bg-surface-container border-b border-outline-variant text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                    <th className="p-4">Name</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Size</th>
                    <th className="p-4">Uploaded By</th>
                    <th className="p-4">Date</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30">
                  {filteredFiles.map((file) => (
                    <tr key={file.id} className="hover:bg-surface-container-low transition-colors text-xs">
                      <td className="p-4 font-bold text-on-surface flex items-center gap-3">
                        <div className="w-6 h-6 shrink-0 flex items-center justify-center">
                          {getFileIcon(file.type)}
                        </div>
                        <span className="truncate max-w-xs">{file.name}</span>
                      </td>
                      <td className="p-4 text-on-surface-variant font-medium">{file.category}</td>
                      <td className="p-4 text-on-surface-variant font-medium">{file.size}</td>
                      <td className="p-4 text-on-surface-variant font-medium">{file.author}</td>
                      <td className="p-4 text-on-surface-variant font-medium">{file.date}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button 
                            onClick={() => toggleStarFile(file.id, !!file.isStarred)}
                            className={`p-1.5 rounded-full focus:outline-none ${file.isStarred ? 'text-amber-500' : 'text-on-surface-variant/40 hover:text-amber-500'}`}
                          >
                            <Star className="w-4 h-4" fill={file.isStarred ? 'currentColor' : 'none'} />
                          </button>
                          <button 
                            onClick={() => {
                              if (file.downloadUrl) {
                                window.open(file.downloadUrl, '_blank');
                              } else {
                                alert('This file is simulated and does not have a real URL.');
                              }
                            }}
                            className="p-1.5 text-on-surface-variant hover:text-primary rounded-full focus:outline-none"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => {
                              if (file.downloadUrl) {
                                navigator.clipboard.writeText(file.downloadUrl);
                                alert('Download URL copied to clipboard!');
                              } else {
                                alert('This is a simulated file; cannot copy download link.');
                              }
                            }}
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
          </div>
        )}
      </main>

      {/* Upload File Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-primary/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-surface border border-outline-variant rounded-2xl w-full max-w-lg shadow-2xl p-6 relative">
            <button 
              onClick={() => setShowUploadModal(false)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface p-1 rounded-full focus:outline-none"
              disabled={isUploading}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary-fixed text-primary flex items-center justify-center">
                <FileUp className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-primary">Upload Academic Document</h3>
                <p className="text-xs text-on-surface-variant">Publish documents, research notes, assignments, or slides to the vault.</p>
              </div>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-on-surface-variant block">Category Classifier</label>
                <select 
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-primary focus:border-primary outline-none text-on-surface"
                  value={newFileCategory}
                  onChange={(e) => setNewFileCategory(e.target.value as any)}
                  disabled={isUploading}
                >
                  <option value="Research">Research & Literature</option>
                  <option value="Lectures">Lecture Syllabus/Notes</option>
                  <option value="Assignments">Assignments & Tests</option>
                  <option value="PDFs">General PDFs</option>
                </select>
              </div>

              {/* Drag and Drop Zone */}
              <div 
                onClick={() => !isUploading && fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="border-2 border-dashed border-outline-variant rounded-xl p-6 text-center bg-surface-container-low/50 hover:bg-surface-container-low hover:border-primary transition-colors cursor-pointer flex flex-col items-center justify-center"
              >
                <FileUp className="w-8 h-8 text-on-surface-variant/50 mb-2" />
                <span className="text-xs font-bold text-on-surface">
                  {selectedFile ? `Selected: ${selectedFile.name}` : 'Drag your file here or click to select'}
                </span>
                <span className="text-[10px] text-on-surface-variant/70 mt-1">
                  {selectedFile ? `Size: ${Math.round(selectedFile.size / 1024)} KB` : 'Supports PDF, DOCX, XLSX, PPTX, ZIP, images (Max 100MB)'}
                </span>
              </div>

              {isUploading ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold text-primary">
                    <span className="flex items-center gap-1">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Uploading document...
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
                  disabled={!selectedFile}
                  className="w-full py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-xs font-bold shadow-md hover:shadow-lg transition-all focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
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
