/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  doc, 
  arrayUnion, 
  arrayRemove, 
  serverTimestamp 
} from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage, isFirebaseConfigured } from '../firebase';
import { FileItem, User } from '../types';
import { formatBytes } from '../utils';
import { initialFiles } from '../mockData';

export function useFiles(currentUserProfile: User | null) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUserProfile) {
      setFiles([]);
      setLoading(false);
      return;
    }

    if (!isFirebaseConfigured) {
      // Local Storage Offline Files listener
      const loadLocalFiles = () => {
        const key = 'mock_files_list';
        let localFilesJson = localStorage.getItem(key);

        if (!localFilesJson) {
          localStorage.setItem(key, JSON.stringify(initialFiles));
          localFilesJson = JSON.stringify(initialFiles);
        }

        const rawFiles = JSON.parse(localFilesJson) as FileItem[];
        const mapped = rawFiles.map(f => ({
          ...f,
          isStarred: f.starredBy ? f.starredBy.includes(currentUserProfile.id) : false
        }));

        setFiles(mapped);
        setLoading(false);
      };

      loadLocalFiles();

      window.addEventListener('storage', loadLocalFiles);
      return () => window.removeEventListener('storage', loadLocalFiles);
    }

    // Real Firebase listener
    setLoading(true);

    const filesQuery = query(
      collection(db, 'files'),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(filesQuery, (snapshot) => {
      const fileList: FileItem[] = [];
      snapshot.forEach((snapshotDoc) => {
        const data = snapshotDoc.data();
        const starredBy = data.starredBy || [];
        fileList.push({
          id: snapshotDoc.id,
          name: data.name || '',
          type: data.type || 'pdf',
          size: data.size || '0 Bytes',
          category: data.category || 'All',
          date: data.date || 'Just now',
          author: data.author || 'Anonymous',
          authorAvatar: data.authorAvatar || '',
          badges: data.badges || [],
          downloadUrl: data.downloadUrl || '',
          starredBy: starredBy,
          isStarred: currentUserProfile ? starredBy.includes(currentUserProfile.id) : false
        });
      });
      setFiles(fileList);
      setLoading(false);
    }, (error) => {
      console.error("Error streaming files:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUserProfile]);

  const uploadFile = (
    file: File, 
    category: FileItem['category'],
    onProgress: (progress: number) => void,
    onSuccess: () => void,
    onError: (err: any) => void
  ) => {
    if (!currentUserProfile) {
      onError(new Error('User not logged in'));
      return;
    }

    if (!isFirebaseConfigured) {
      // LocalStorage file upload simulation
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        onProgress(progress);
        
        if (progress >= 100) {
          clearInterval(interval);
          
          try {
            const ext = file.name.split('.').pop()?.toLowerCase() || 'pdf';
            const cleanExt = ['pdf', 'zip', 'xlsx', 'pptx', 'docx', 'jpg', 'png'].includes(ext) ? ext : 'pdf';
            const formattedDate = new Date().toLocaleDateString([], {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            });

            // createObjectURL allows real browser downloads of uploaded files in mock mode!
            const localDownloadUrl = URL.createObjectURL(file);

            const newFileRecord: FileItem = {
              id: 'file_' + Date.now(),
              name: file.name,
              type: cleanExt,
              size: formatBytes(file.size),
              category,
              date: formattedDate,
              author: currentUserProfile.name,
              authorId: currentUserProfile.id,
              authorAvatar: currentUserProfile.avatar,
              badges: ['New'],
              downloadUrl: localDownloadUrl,
              starredBy: []
            };

            const key = 'mock_files_list';
            const list = JSON.parse(localStorage.getItem(key) || '[]');
            const updated = [newFileRecord, ...list];
            localStorage.setItem(key, JSON.stringify(updated));
            
            // Dispatch custom storage event for in-tab sync
            window.dispatchEvent(new Event('storage'));
            onSuccess();
          } catch (err) {
            onError(err);
          }
        }
      }, 100);
      return;
    }

    // Real Firebase Storage upload
    const storageRef = ref(storage, `vault/${currentUserProfile.id}/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        onProgress(progress);
      },
      (error) => {
        console.error("Storage upload error:", error);
        onError(error);
      },
      async () => {
        try {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          const ext = file.name.split('.').pop()?.toLowerCase() || 'pdf';
          const cleanExt = ['pdf', 'zip', 'xlsx', 'pptx', 'docx', 'jpg', 'png'].includes(ext) ? ext : 'pdf';
          
          const formattedDate = new Date().toLocaleDateString([], {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          });

          const newFileMetadata = {
            name: file.name,
            type: cleanExt,
            size: formatBytes(file.size),
            category,
            date: formattedDate,
            timestamp: serverTimestamp(),
            author: currentUserProfile.name,
            authorId: currentUserProfile.id,
            authorAvatar: currentUserProfile.avatar,
            badges: ['New'],
            downloadUrl,
            starredBy: []
          };

          await addDoc(collection(db, 'files'), newFileMetadata);
          onSuccess();
        } catch (err) {
          console.error("Error saving file metadata:", err);
          onError(err);
        }
      }
    );
  };

  const toggleStarFile = async (fileId: string, isCurrentlyStarred: boolean) => {
    if (!currentUserProfile) return;
    
    if (!isFirebaseConfigured) {
      // LocalStorage toggle star
      const key = 'mock_files_list';
      const list = JSON.parse(localStorage.getItem(key) || '[]');
      const idx = list.findIndex((f: FileItem) => f.id === fileId);
      if (idx !== -1) {
        const starred = list[idx].starredBy || [];
        if (isCurrentlyStarred) {
          list[idx].starredBy = starred.filter((uid: string) => uid !== currentUserProfile.id);
        } else {
          list[idx].starredBy = [...starred, currentUserProfile.id];
        }
        localStorage.setItem(key, JSON.stringify(list));
        window.dispatchEvent(new Event('storage'));
      }
      return;
    }

    // Real Firebase
    const fileRef = doc(db, 'files', fileId);
    await updateDoc(fileRef, {
      starredBy: isCurrentlyStarred 
        ? arrayRemove(currentUserProfile.id)
        : arrayUnion(currentUserProfile.id)
    });
  };

  return { files, loading, uploadFile, toggleStarFile };
}
