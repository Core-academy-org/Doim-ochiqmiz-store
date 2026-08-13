import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
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

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const firebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId,
);

const fallbackConfig = {
  apiKey: 'not-configured',
  authDomain: 'not-configured.invalid',
  projectId: 'doimochiqmiz-not-configured',
  appId: '1:0:web:not-configured',
};

const app = getApps().length > 0
  ? getApp()
  : initializeApp(firebaseConfigured ? firebaseConfig : fallbackConfig);

const db = getFirestore(app, import.meta.env.VITE_FIREBASE_DATABASE_ID || '(default)');

export { 
  app, 
  db, 
  firebaseConfigured,
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
