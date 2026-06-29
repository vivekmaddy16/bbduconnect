# BbduConnect — Social Academic Hub

**BbduConnect** is a premium, real-time social academic collaboration hub built for scholars, students, and faculty advisors at BBDU. It bridges the gap between structured learning and social collaboration, allowing users to exchange messages, share academic documents in a vault, publish research announcements, and coordinate course goals.

---

## ✨ Features

### 🔐 Secure Authentication & User Profiles
- **Role-Based Accounts**: Supports dedicated profiles for **Students**, **Faculty Advisors**, **Faculty**, and **Administrators** with custom department fields.
- **Interactive Profiles**: Manage biography info, customize profile tags, and set live availability statuses (*Active*, *Focus Mode*, *Offline*).
- **Custom Avatars**: Upload custom avatar photos directly from the settings panel.

### 💬 Real-Time Collaboration & Direct Messaging
- **Discussion Channels**: Create and join group topic channels (e.g. `#data-science-project`, `#study-group-alpha`).
- **Direct Messaging (DMs)**: Start private 1-on-1 threads by searching for a colleague's university email address.
- **Rich Chat attachments**: Send files and images inside chats. Features dynamic file formatting (PDF, ZIP, spreadsheet icons) and media preview cards.

### 📂 Academic Vault (File Management)
- **Real File Uploads**: Upload documents (PDF, DOCX, ZIP, XLSX, PPTX, images) with a live progress bar.
- **Categorization**: Filter files by categories like *Lectures*, *Assignments*, *Research*, or *PDFs*.
- **Star Registry**: Bookmark reference sheets or homework files with user-specific starred list persistence.
- **Downloads & Sharing**: Open live files in new tabs or copy file download links with one click.

### 📣 Campus Bulletin (Community Feed)
- **Academic Forum**: Publish announcements, research logs, and event alerts.
- **Atomic Likes**: Heart posts with user-indexed counters to prevent double-likes.
- **Discussion Threads**: Toggle nested comment drawers to read and post peer reviews on bulletins.
- **Topic Tags**: Organize bulletin board posts using custom tags (e.g., `#Symposium`, `#Research`).

---

## ⚡ Hybrid Execution Mode (Offline Fallback)

To make offline testing and development seamless, the application features an automatic **Hybrid Fallback Mode**:

1. **Firebase Mode (Production)**: When you provide your credentials in `.env.local`, the app connects to Google's backend. Logins write to Firebase Auth, messages/posts/comments sync live via Firestore listeners, and documents upload to Cloud Storage.
2. **Demo Mode (Development)**: If the `.env.local` contains placeholder values, the app runs in **Offline Demo Mode** (signified by a yellow "Demo Mode" badge in the sidebar). 
   - Uses `localStorage` as a mock persistence database.
   - Initialized with standard course channels, files, and chat messages.
   - Creating accounts, posting updates, and starring files persist even after refreshing the page.
   - File uploads simulate progress and use browser Blobs so that clicking **Download** in the list will download the exact file you selected from your computer!

---

## 🛠️ Technology Stack
- **Core**: React (v19), TypeScript (v5), Vite (v6)
- **Styling**: Vanilla CSS, Tailwind CSS (v4)
- **Backend SDK**: Firebase Web SDK (v10+)
  - **Firebase Auth**: User accounts and sessions.
  - **Cloud Firestore**: Real-time snapshot synchronization of chats, posts, comments, and profile states.
  - **Cloud Storage**: Image and document hosting.

---

## 🚀 Setup & Installation

### Prerequisite
Ensure you have **Node.js** (v18+) installed.

### 1. Clone & Install Dependencies
```bash
# Clone the repository and navigate into the folder
cd bbduconnect

# Install packages
npm install
```

### 2. Configure Environment variables
Create a `.env.local` file in the root of the project (if it doesn't already exist) and populate it with your Firebase configuration. You can copy the structure from `.env.example`:

```env
# BbduConnect Real Firebase Configuration
# =======================================

VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Firebase Console Configuration
To connect a real database, follow these setup rules in your **[Firebase Console](https://console.firebase.google.com/)**:
1. **Authentication**: Enable the **Email/Password** provider under Sign-in Methods.
2. **Firestore Database**: Create a database, start in **Test Mode** (or configure custom security rules).
3. **Cloud Storage**: Create a bucket, start in **Test Mode**.

### 4. Running Locally
```bash
# Start Vite development server
npm run dev
```
Open **[http://localhost:3000/](http://localhost:3000/)** (or the port shown in your terminal) in your browser!

### 5. Production Compilation
```bash
# Build the optimized production bundle
npm run build

# Preview the local production build
npm run preview
```

---

## 🔒 License
This project is licensed under the Apache-2.0 License. See the [LICENSE](LICENSE) file for details.
