import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  initializeFirestore,
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  where, 
  increment, 
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import defaultFirebaseConfig from '../../firebase-applet-config.json';

// Build resolved Firebase configuration from env vars or static json config
const env = (import.meta as any).env || {};
const firebaseConfig = {
  projectId: env.VITE_FIREBASE_PROJECT_ID || defaultFirebaseConfig.projectId || "dauntless-triode-djkjx",
  appId: env.VITE_FIREBASE_APP_ID || defaultFirebaseConfig.appId || "1:894594625052:web:73a9f357e9dd1c26a3f9d9",
  apiKey: env.VITE_FIREBASE_API_KEY || defaultFirebaseConfig.apiKey || "AIzaSyD4gmwlRIYVEvmWXOBDOgHFr5pD_mzLriY",
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || defaultFirebaseConfig.authDomain || "dauntless-triode-djkjx.firebaseapp.com",
  firestoreDatabaseId: env.VITE_FIREBASE_DATABASE_ID || defaultFirebaseConfig.firestoreDatabaseId || "ai-studio-5462523f-87ae-4687-bef3-034cd3df0c9e",
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || defaultFirebaseConfig.storageBucket || "dauntless-triode-djkjx.firebasestorage.app",
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || defaultFirebaseConfig.messagingSenderId || "894594625052"
};

// Initialize Firebase safely
let app;
try {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
} catch (err) {
  console.warn("Firebase initialization error, using existing app instance if available:", err);
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
}

// Initialize Firestore with custom database ID and auto-detect long polling for container / proxy network stability
const databaseId = firebaseConfig.firestoreDatabaseId || '(default)';
let db;
try {
  db = initializeFirestore(
    app,
    {
      experimentalAutoDetectLongPolling: true
    },
    databaseId
  );
} catch (err) {
  db = getFirestore(app, databaseId);
}

export { 
  app, 
  db, 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  where, 
  increment, 
  serverTimestamp,
  Timestamp 
};
