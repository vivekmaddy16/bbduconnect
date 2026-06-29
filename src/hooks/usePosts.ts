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
  serverTimestamp,
  increment
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase';
import { CommunityPost, PostComment, User } from '../types';
import { initialPosts } from '../mockData';

export function usePosts(currentUserProfile: User | null) {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      // Local Storage Offline Posts listener
      const loadLocalPosts = () => {
        const key = 'mock_posts_list';
        let localPostsJson = localStorage.getItem(key);

        if (!localPostsJson) {
          localStorage.setItem(key, JSON.stringify(initialPosts));
          localPostsJson = JSON.stringify(initialPosts);
        }

        setPosts(JSON.parse(localPostsJson));
        setLoading(false);
      };

      loadLocalPosts();

      window.addEventListener('storage', loadLocalPosts);
      return () => window.removeEventListener('storage', loadLocalPosts);
    }

    // Real Firebase listener
    setLoading(true);

    const postsQuery = query(
      collection(db, 'posts'),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
      const postList: CommunityPost[] = [];
      snapshot.forEach((snapshotDoc) => {
        const data = snapshotDoc.data();
        postList.push({
          id: snapshotDoc.id,
          author: data.author || 'Anonymous',
          authorId: data.authorId || '',
          authorAvatar: data.authorAvatar || '',
          authorRole: data.authorRole || 'STUDENT',
          content: data.content || '',
          timestamp: data.timestamp,
          likes: data.likes || 0,
          likedBy: data.likedBy || [],
          comments: data.comments || 0,
          tags: data.tags || []
        });
      });
      setPosts(postList);
      setLoading(false);
    }, (error) => {
      console.error("Error streaming posts:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const createPost = async (content: string, tags: string[]) => {
    if (!currentUserProfile) throw new Error('User not logged in');

    if (!isFirebaseConfigured) {
      const newPost: CommunityPost = {
        id: 'post_' + Date.now(),
        author: currentUserProfile.name,
        authorId: currentUserProfile.id,
        authorAvatar: currentUserProfile.avatar,
        authorRole: currentUserProfile.role,
        content,
        timestamp: 'Just now',
        likes: 0,
        likedBy: [],
        comments: 0,
        tags: tags.length > 0 ? tags : ['Academic']
      };

      const key = 'mock_posts_list';
      const list = JSON.parse(localStorage.getItem(key) || '[]');
      const updated = [newPost, ...list];
      localStorage.setItem(key, JSON.stringify(updated));
      
      window.dispatchEvent(new Event('storage'));
      return;
    }

    const newPost = {
      author: currentUserProfile.name,
      authorId: currentUserProfile.id,
      authorAvatar: currentUserProfile.avatar,
      authorRole: currentUserProfile.role,
      content,
      timestamp: serverTimestamp(),
      likes: 0,
      likedBy: [],
      comments: 0,
      tags: tags.length > 0 ? tags : ['Academic']
    };

    await addDoc(collection(db, 'posts'), newPost);
  };

  const toggleLikePost = async (postId: string, isCurrentlyLiked: boolean) => {
    if (!currentUserProfile) return;

    if (!isFirebaseConfigured) {
      const key = 'mock_posts_list';
      const list = JSON.parse(localStorage.getItem(key) || '[]');
      const idx = list.findIndex((p: CommunityPost) => p.id === postId);
      if (idx !== -1) {
        const likedBy = list[idx].likedBy || [];
        if (isCurrentlyLiked) {
          list[idx].likedBy = likedBy.filter((id: string) => id !== currentUserProfile.id);
          list[idx].likes = Math.max(0, list[idx].likes - 1);
        } else {
          list[idx].likedBy = [...likedBy, currentUserProfile.id];
          list[idx].likes += 1;
        }
        localStorage.setItem(key, JSON.stringify(list));
        window.dispatchEvent(new Event('storage'));
      }
      return;
    }

    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      likedBy: isCurrentlyLiked 
        ? arrayRemove(currentUserProfile.id)
        : arrayUnion(currentUserProfile.id),
      likes: increment(isCurrentlyLiked ? -1 : 1)
    });
  };

  return { posts, loading, createPost, toggleLikePost };
}

export function usePostComments(postId: string | null, currentUserProfile: User | null) {
  const [comments, setComments] = useState<PostComment[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!postId) {
      setComments([]);
      setLoading(false);
      return;
    }

    if (!isFirebaseConfigured) {
      // Local Storage Comments listener
      const loadLocalComments = () => {
        const key = `mock_comments_${postId}`;
        let localCommentsJson = localStorage.getItem(key);

        if (!localCommentsJson) {
          // Seed initial comments if matching the mock IDs
          let seed: PostComment[] = [];
          if (postId === 'post_1') {
            seed = [
              {
                id: 'c1',
                postId,
                author: 'Marcus Chen',
                authorId: 'mock_marcus',
                authorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqy-Gi_Qf14KB9XdwTfT3uaLfx8Tc_DxAD-vo4PTqRWJnYclgYcUxwk6HvkVEbYpcnSMhRceOFNzskeLhDDoeOWcVub6FiJzCaL-AbNTt5k6dGOzTzBTDe1rEZ9pwnidAUe1ro7sFENCUg5xnZd7X6TgcZLkg8lugh4gu2hmn8a3uk_mmV8eIpJsFSBBnpQxBTl-pCJrz_tOaAgOen1FfxC897_h9wMUfJzcaGLamKJuEBxcuOYw6GPyIj2FKwB87JD33D09wcpIM',
                text: "I'll definitely be submitting an abstract for my Distributed systems project, Dr. Miller!",
                timestamp: '10:48 AM'
              },
              {
                id: 'c2',
                postId,
                author: 'David R.',
                authorId: 'mock_david',
                text: "Excellent, looking forward to the keynote!",
                timestamp: '11:05 AM'
              }
            ];
          } else if (postId === 'post_2') {
            seed = [
              {
                id: 'c3',
                postId,
                author: 'Dr. Sarah Miller',
                authorId: 'mock_sarah',
                authorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuATDfKyDw9py25e-EeMwDmy4QJJ2nTmvVtkO5ihth1fTA2iqi8q25kIC0xCfz5PZvCaouc3NyxZ4DVBIfoLAHkk7M_6PcS1KPFLhif6nTkLZ29uVEEfmysjVX4RmwCKAQAhAIMoJSJ8x9W_eVeu3Qswe5eGxYS4zJQ6BFFzn5gi81B9T6GVCEghYDMcdSBx5KoC1bbi12FyVLwR08cFG5OL1MVYrar9tuaXkJ0LZlr6ITjwoPCvb56psb049ionib3pg7ui76sq6QE',
                text: "Excellent choice of clustering library, Marcus. I would love to look at the latency benchmark.",
                timestamp: '2:15 PM'
              }
            ];
          }
          localStorage.setItem(key, JSON.stringify(seed));
          localCommentsJson = JSON.stringify(seed);
        }

        setComments(JSON.parse(localCommentsJson));
        setLoading(false);
      };

      loadLocalComments();

      window.addEventListener('storage', loadLocalComments);
      return () => window.removeEventListener('storage', loadLocalComments);
    }

    // Real Firebase listener
    setLoading(true);

    const commentsQuery = query(
      collection(db, 'posts', postId, 'comments'),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(commentsQuery, (snapshot) => {
      const commentList: PostComment[] = [];
      snapshot.forEach((snapshotDoc) => {
        const data = snapshotDoc.data();
        commentList.push({
          id: snapshotDoc.id,
          postId: postId,
          author: data.author || 'Anonymous',
          authorId: data.authorId || '',
          authorAvatar: data.authorAvatar || '',
          text: data.text || '',
          timestamp: data.timestamp
        });
      });
      setComments(commentList);
      setLoading(false);
    }, (error) => {
      console.error("Error streaming comments:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [postId]);

  const addComment = async (text: string) => {
    if (!postId || !currentUserProfile) throw new Error('Cannot add comment: configuration missing');

    const formattedTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (!isFirebaseConfigured) {
      // LocalStorage Comment write
      const newComment: PostComment = {
        id: 'c_' + Date.now(),
        postId,
        author: currentUserProfile.name,
        authorId: currentUserProfile.id,
        authorAvatar: currentUserProfile.avatar,
        text,
        timestamp: formattedTime
      };

      const key = `mock_comments_${postId}`;
      const currentList = JSON.parse(localStorage.getItem(key) || '[]');
      const updatedList = [...currentList, newComment];
      localStorage.setItem(key, JSON.stringify(updatedList));
      setComments(updatedList);

      // Increment comments count on post
      const postsKey = 'mock_posts_list';
      const postsList = JSON.parse(localStorage.getItem(postsKey) || '[]');
      const postIdx = postsList.findIndex((p: CommunityPost) => p.id === postId);
      if (postIdx !== -1) {
        postsList[postIdx].comments += 1;
        localStorage.setItem(postsKey, JSON.stringify(postsList));
      }
      
      window.dispatchEvent(new Event('storage'));
      return;
    }

    // Real Firebase
    const commentData = {
      author: currentUserProfile.name,
      authorId: currentUserProfile.id,
      authorAvatar: currentUserProfile.avatar,
      text,
      timestamp: serverTimestamp()
    };

    await addDoc(collection(db, 'posts', postId, 'comments'), commentData);

    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      comments: increment(1)
    });
  };

  return { comments, loading, addComment };
}
