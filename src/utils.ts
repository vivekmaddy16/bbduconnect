/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Format a Firestore timestamp or general Date/string into a readable time/date string
 */
export function formatTime(timestamp: any): string {
  if (!timestamp) return '';

  let date: Date;

  // Handle Firestore Timestamp object (has seconds or toDate method)
  if (typeof timestamp.toDate === 'function') {
    date = timestamp.toDate();
  } else if (timestamp.seconds !== undefined) {
    date = new Date(timestamp.seconds * 1000);
  } else if (timestamp instanceof Date) {
    date = timestamp;
  } else if (typeof timestamp === 'string') {
    // If it's already a formatted string, return it
    if (timestamp.includes(':') && (timestamp.includes('AM') || timestamp.includes('PM'))) {
      return timestamp;
    }
    date = new Date(timestamp);
  } else if (typeof timestamp === 'number') {
    date = new Date(timestamp);
  } else {
    return '';
  }

  // Check if date is invalid
  if (isNaN(date.getTime())) {
    return '';
  }

  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  if (isToday) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else {
    // Return "MMM DD, YYYY" or "MMM DD"
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }
}

/**
 * Format bytes to readable size (e.g. 2.4 MB)
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
