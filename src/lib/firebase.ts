import { initializeApp } from 'firebase/app';
import { 
  initializeFirestore, 
  collection, 
  doc, 
  query, 
  orderBy, 
  where,
  increment,
  serverTimestamp,
  Timestamp,
  addDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc, 
  onSnapshot 
} from 'firebase/firestore';

// Configuration from AI Studio injected JSON
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
}, firebaseConfig.firestoreDatabaseId);

export {
  app,
  db,
  collection,
  doc,
  query,
  orderBy,
  where,
  increment,
  serverTimestamp,
  Timestamp,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  onSnapshot
};
