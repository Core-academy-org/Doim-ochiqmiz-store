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
import defaultConfig from '../../firebase-applet-config.json';

const activeConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || defaultConfig?.apiKey || "demo-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || defaultConfig?.authDomain || "demo.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || defaultConfig?.projectId || "demo-project",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || defaultConfig?.storageBucket || "demo.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || defaultConfig?.messagingSenderId || "000000000000",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || defaultConfig?.appId || "1:000000000000:web:0000000000000000000000",
  firestoreDatabaseId: import.meta.env.VITE_FIREBASE_DATABASE_ID || defaultConfig?.firestoreDatabaseId || "(default)"
};

// Safely initialize Firebase App
let app;
try {
  app = getApps().length > 0 ? getApp() : initializeApp(activeConfig);
} catch (error) {
  console.warn("Firebase app initialization fallback:", error);
  app = getApps().length > 0 ? getApp() : initializeApp({ projectId: "demo-project" });
}

// Safely initialize Firestore with fallback support
const databaseId = activeConfig.firestoreDatabaseId || '(default)';
let db;
try {
  db = initializeFirestore(
    app,
    {
      experimentalAutoDetectLongPolling: true
    },
    databaseId
  );
} catch (error) {
  console.warn("Custom Firestore initialization failed, attempting standard getFirestore:", error);
  try {
    db = getFirestore(app);
  } catch (err) {
    console.error("Firestore unavailable:", err);
  }
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
