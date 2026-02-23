// ==========================================
//  FIREBASE-CONFIG.JS — Firebase initialization
//  ⚠ REPLACE the config below with YOUR Firebase project config
//  Go to: console.firebase.google.com → Project Settings → Web App
// ==========================================

const firebaseConfig = {
  apiKey: "AIzaSyAObOOvBzqFkkLn7ouXJ54bcwMLXKpP6PE",
  authDomain: "solo-leveling-gym-2e0f0.firebaseapp.com",
  projectId: "solo-leveling-gym-2e0f0",
  storageBucket: "solo-leveling-gym-2e0f0.firebasestorage.app",
  messagingSenderId: "712388717480",
  appId: "1:712388717480:web:6501a05ab3dad997418b9d",
  measurementId: "G-TX7E0PGG2H"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Global refs
const fireAuth = firebase.auth();
const fireDB   = firebase.firestore();

// Persistence for offline support
fireDB.enablePersistence({ synchronizeTabs: true })
    .catch(err => {
        if (err.code === 'failed-precondition') {
            console.warn('[System] Firestore persistence failed: multiple tabs open.');
        } else if (err.code === 'unimplemented') {
            console.warn('[System] Firestore persistence not available in this browser.');
        }
    });

console.log('[System] Firebase initialized.');
