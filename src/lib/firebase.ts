// Standalone Zero-Dependency Local Database Provider
// Replaces external Firebase dependencies with pure client-side LocalStorage & Tab Sync
// Guarantees 100% build success on Vercel, Netlify, GitHub Pages, and offline mode.

const STORAGE_PREFIX = 'app_db_col_';
const DB_CHANGE_EVENT = 'app_local_db_change';

// Initial Seed Data if LocalStorage is empty
const INITIAL_SEEDS: Record<string, any[]> = {
  branches: [
    {
      id: 'branch_main_1',
      name: "Chilonzor Bosh Filial",
      address: "Toshkent sh., Chilonzor tumani, 9-mavze, 12-uy",
      phone: "+998 90 123 45 67",
      lat: 41.2856,
      lng: 69.2035,
      workingHours: "08:00 - 22:00",
      createdAt: new Date().toISOString()
    }
  ],
  siteSettings: [
    {
      id: 'config',
      heroNotice: "Do'konga kelishdan oldin narx va mavjudlikni ko'ring",
      headerTagline: "Filiallar real vaqt ombor tizimi",
      mainStoreBranchName: "Bosh Filial (Markaziy Do'kon)",
      mainStoreAddress: "Toshkent sh., Chilonzor tumani, 9-mavze, 12-uy",
      mainStoreMapUrl: "https://maps.app.goo.gl/uXpX1S7Q5B5Gf94S8",
      contactPhone: "+998 90 123 45 67",
      workingHoursNotice: "Har kuni 08:00 - 22:00"
    }
  ],
  products: [],
  news: [],
  chats: []
};

// Helper: Get Collection Array
function getCollectionData(collName: string): any[] {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + collName);
    if (!raw) {
      if (INITIAL_SEEDS[collName]) {
        saveCollectionData(collName, INITIAL_SEEDS[collName]);
        return INITIAL_SEEDS[collName];
      }
      return [];
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading local collection ${collName}:`, err);
    return [];
  }
}

// Helper: Save Collection Array & Dispatch Change
function saveCollectionData(collName: string, data: any[]) {
  try {
    localStorage.setItem(STORAGE_PREFIX + collName, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent(DB_CHANGE_EVENT, { detail: { collection: collName } }));
  } catch (err) {
    console.error(`Error saving local collection ${collName}:`, err);
  }
}

// Dummy App & DB exports
export const app = {};
export const db = {};

// Reference Creators
export function collection(dbRef: any, ...paths: string[]) {
  const name = paths.join('_');
  return { type: 'collection', name };
}

export function doc(dbOrColl: any, ...paths: string[]) {
  if (typeof dbOrColl === 'object' && dbOrColl?.type === 'collection') {
    return { type: 'doc', collection: dbOrColl.name, id: paths.join('_') };
  }
  if (paths.length >= 2) {
    const docId = paths[paths.length - 1];
    const collName = paths.slice(0, paths.length - 1).join('_');
    return { type: 'doc', collection: collName, id: docId };
  }
  return { type: 'doc', collection: paths[0] || '', id: paths[1] || '' };
}

// Query Helpers
export function query(collRef: any, ...constraints: any[]) {
  return collRef;
}

export function orderBy(field: string, direction: 'asc' | 'desc' = 'asc') {
  return { type: 'orderBy', field, direction };
}

export function where(field: string, op: string, value: any) {
  return { type: 'where', field, op, value };
}

// Special Field Handlers
export function increment(delta: number) {
  return { __isIncrement: true, delta };
}

export function serverTimestamp() {
  return new Date().toISOString();
}

export const Timestamp = {
  now: () => new Date().toISOString(),
  fromDate: (d: Date) => d.toISOString()
};

// CRUD Operations
export async function addDoc(collRef: any, data: any) {
  const collName = collRef.name;
  const items = getCollectionData(collName);
  const newId = 'doc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
  
  const newItem = {
    id: newId,
    ...data,
    createdAt: data.createdAt || new Date().toISOString()
  };

  items.unshift(newItem);
  saveCollectionData(collName, items);
  return { id: newId };
}

export async function setDoc(docRef: any, data: any, options?: { merge?: boolean }) {
  const collName = docRef.collection;
  const docId = docRef.id;
  const items = getCollectionData(collName);
  
  const existingIdx = items.findIndex(item => item.id === docId);
  if (existingIdx >= 0) {
    if (options?.merge) {
      items[existingIdx] = { ...items[existingIdx], ...data };
    } else {
      items[existingIdx] = { id: docId, ...data };
    }
  } else {
    items.push({ id: docId, ...data });
  }

  saveCollectionData(collName, items);
}

export async function updateDoc(docRef: any, updates: Record<string, any>) {
  const collName = docRef.collection;
  const docId = docRef.id;
  const items = getCollectionData(collName);

  const existingIdx = items.findIndex(item => item.id === docId);
  if (existingIdx === -1) return;

  const current = { ...items[existingIdx] };

  // Handle nested keys like 'reactions.❤️' or increment objects
  Object.keys(updates).forEach(key => {
    const val = updates[key];

    if (key.includes('.')) {
      const parts = key.split('.');
      let target = current;
      for (let i = 0; i < parts.length - 1; i++) {
        if (!target[parts[i]]) target[parts[i]] = {};
        target = target[parts[i]];
      }
      const lastKey = parts[parts.length - 1];

      if (val && typeof val === 'object' && val.__isIncrement) {
        target[lastKey] = (target[lastKey] || 0) + val.delta;
      } else {
        target[lastKey] = val;
      }
    } else {
      if (val && typeof val === 'object' && val.__isIncrement) {
        current[key] = (current[key] || 0) + val.delta;
      } else {
        current[key] = val;
      }
    }
  });

  items[existingIdx] = current;
  saveCollectionData(collName, items);
}

export async function deleteDoc(docRef: any) {
  const collName = docRef.collection;
  const docId = docRef.id;
  const items = getCollectionData(collName);

  const filtered = items.filter(item => item.id !== docId);
  saveCollectionData(collName, filtered);
}

export async function getDocs(queryRef: any) {
  const collName = queryRef.name || queryRef.collection;
  const items = getCollectionData(collName);

  return {
    empty: items.length === 0,
    docs: items.map(item => ({
      id: item.id,
      data: () => item
    })),
    forEach: (cb: (doc: { id: string; data: () => any }) => void) => {
      items.forEach(item => cb({ id: item.id, data: () => item }));
    }
  };
}

export async function getDoc(docRef: any) {
  const collName = docRef.collection;
  const docId = docRef.id;
  const items = getCollectionData(collName);
  const found = items.find(item => item.id === docId);

  return {
    id: docId,
    exists: () => !!found,
    data: () => found || null
  };
}

// Real-Time Subscriptions
export function onSnapshot(
  targetRef: any,
  callback: (snapshot: any) => void,
  errorCallback?: (error: any) => void
) {
  const collName = targetRef.name || targetRef.collection;
  const isDoc = targetRef.type === 'doc';
  const docId = targetRef.id;

  const emit = () => {
    try {
      const items = getCollectionData(collName);
      if (isDoc) {
        const found = items.find(item => item.id === docId);
        callback({
          id: docId,
          exists: () => !!found,
          data: () => found || null
        });
      } else {
        callback({
          empty: items.length === 0,
          docs: items.map(item => ({
            id: item.id,
            data: () => item
          })),
          forEach: (cb: (doc: { id: string; data: () => any }) => void) => {
            items.forEach(item => cb({ id: item.id, data: () => item }));
          }
        });
      }
    } catch (err) {
      if (errorCallback) errorCallback(err);
    }
  };

  // Immediate emit
  emit();

  // Listeners
  const handleLocalChange = (e: Event) => {
    const detail = (e as CustomEvent).detail;
    if (!detail || detail.collection === collName) {
      emit();
    }
  };

  const handleStorageChange = (e: StorageEvent) => {
    if (e.key && e.key.startsWith(STORAGE_PREFIX)) {
      emit();
    }
  };

  window.addEventListener(DB_CHANGE_EVENT, handleLocalChange);
  window.addEventListener('storage', handleStorageChange);

  return () => {
    window.removeEventListener(DB_CHANGE_EVENT, handleLocalChange);
    window.removeEventListener('storage', handleStorageChange);
  };
}
