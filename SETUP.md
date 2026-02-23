# 🚀 Deployment Guide — Solo Leveling SYSTEM

## Firebase Setup (Required)

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add Project"** → name it (e.g. `solo-leveling-gym`)
3. Disable Google Analytics (optional) → **Create Project**

### 2. Enable Google Authentication
1. In Firebase Console → **Build** → **Authentication**
2. Click **"Get Started"**
3. Go to **Sign-in method** tab
4. Enable **Google** provider
5. Set your support email → **Save**
6. Also enable **Anonymous** sign-in (for guest mode)

### 3. Create Firestore Database
1. In Firebase Console → **Build** → **Firestore Database**
2. Click **"Create Database"**
3. Start in **Production mode**
4. Choose a location closest to your users → **Enable**
5. Go to **Rules** tab and paste the contents of `firestore.rules`:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /hunters/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```
6. Click **Publish**

### 4. Register Web App & Get Config
1. In Firebase Console → **Project Settings** (gear icon)
2. Scroll down → Click **"Add App"** → Choose **Web** (</> icon)
3. Name it (e.g. `solo-leveling-web`) → **Register App**
4. Copy the `firebaseConfig` object
5. Paste it into `js/firebase-config.js`, replacing the placeholder values:
```javascript
const firebaseConfig = {
    apiKey:            "AIzaSy...",
    authDomain:        "solo-leveling-gym.firebaseapp.com",
    projectId:         "solo-leveling-gym",
    storageBucket:     "solo-leveling-gym.appspot.com",
    messagingSenderId: "123456789",
    appId:             "1:123456789:web:abc123"
};
```

### 5. Add Vercel Domain to Authorized Domains
1. In Firebase Console → **Authentication** → **Settings**
2. Go to **Authorized domains**
3. Click **"Add domain"**
4. Add your Vercel domain: `your-app.vercel.app`

---

## Vercel Deployment

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Solo Leveling SYSTEM - ready to deploy"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### 2. Deploy on Vercel
1. Go to [vercel.com](https://vercel.com/) and sign in with GitHub
2. Click **"Add New"** → **"Project"**
3. Import your GitHub repository
4. Framework Preset: **Other**
5. Leave all defaults → **Deploy**

### 3. Update Firebase Authorized Domain
After deployment, add your `*.vercel.app` URL to Firebase Auth authorized domains (Step 5 above).

---

## Architecture

```
Login Flow:
  User opens app → Login Screen → Google/Guest Sign-in
  → Firebase Auth → Load data from Firestore → Boot Screen → App

Save Flow:
  saveGame() → localStorage (instant) → Firestore (debounced 2s)

Load Flow:
  Auth success → Firestore data (primary) → localStorage (fallback)
```

## Files Added
- `js/firebase-config.js` — Firebase initialization (⚠ add your config here)
- `js/auth.js` — Google & Guest authentication
- `js/db.js` — Firestore cloud save/load with offline support
- `vercel.json` — Vercel routing config
- `firestore.rules` — Firestore security rules
- `SETUP.md` — This file
