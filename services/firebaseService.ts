import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit, 
  type Firestore 
} from 'firebase/firestore';
import type { HistoryItem, SmogPledge, SupportTicket } from '../types';

let firebaseApp: FirebaseApp | null = null;
let firestoreDb: Firestore | null = null;
let isConfigured = false;

// Initialize Firebase JS SDK gracefully
try {
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || (typeof process !== 'undefined' ? process.env?.FIREBASE_API_KEY : undefined),
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'agrilens-eco-punjab',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
  };

  if (firebaseConfig.apiKey) {
    if (!getApps().length) {
      firebaseApp = initializeApp(firebaseConfig);
    } else {
      firebaseApp = getApps()[0];
    }
    firestoreDb = getFirestore(firebaseApp);
    isConfigured = true;
    console.log('☁️ Firebase Firestore successfully initialized for AgriLens Eco.');
  } else {
    console.info('ℹ️ Firebase credentials not provided in .env. Running in resilient Offline-First LocalStorage mode.');
  }
} catch (error) {
  console.warn('Firebase init warning:', error);
}

export const getFirestoreStatus = () => {
  return {
    isConfigured,
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true
  };
};

/**
 * Syncs a farmer scan to Cloud Firestore 'scans' collection
 */
export const syncScanToFirestore = async (item: HistoryItem): Promise<boolean> => {
  try {
    if (!firestoreDb || !isConfigured) {
      return false;
    }
    const docRef = doc(collection(firestoreDb, 'scans'), item.id);
    await setDoc(docRef, {
      ...item,
      syncedAt: new Date().toISOString()
    }, { merge: true });
    return true;
  } catch (error) {
    console.warn('Firestore scan sync fallback to localStorage:', error);
    return false;
  }
};

/**
 * Syncs an Anti-Smog / Stubble Residue pledge to Firestore 'epccd_smog_reports'
 */
export const syncSmogPledgeToFirestore = async (pledge: SmogPledge): Promise<boolean> => {
  // Always persist to localStorage first
  try {
    const existing = JSON.parse(localStorage.getItem('epccd_smog_pledges') || '[]');
    const updated = [pledge, ...existing.filter((p: SmogPledge) => p.id !== pledge.id)];
    localStorage.setItem('epccd_smog_pledges', JSON.stringify(updated));
  } catch (e) {
    console.warn('LocalStorage pledge save error:', e);
  }

  // Then sync to Cloud Firestore
  try {
    if (!firestoreDb || !isConfigured) {
      return false;
    }
    const docRef = doc(collection(firestoreDb, 'epccd_smog_reports'), pledge.id);
    await setDoc(docRef, {
      ...pledge,
      department: 'EPCCD Punjab',
      syncedAt: new Date().toISOString()
    }, { merge: true });
    return true;
  } catch (error) {
    console.warn('Firestore smog report sync error:', error);
    return false;
  }
};

/**
 * Loads recent smog pledges for community social proof & department impact statistics
 */
export const getRecentSmogPledges = async (): Promise<SmogPledge[]> => {
  // Read local first
  let localPledges: SmogPledge[] = [];
  try {
    localPledges = JSON.parse(localStorage.getItem('epccd_smog_pledges') || '[]');
  } catch (e) {
    localPledges = [];
  }

  if (firestoreDb && isConfigured) {
    try {
      const q = query(collection(firestoreDb, 'epccd_smog_reports'), orderBy('timestamp', 'desc'), limit(20));
      const snap = await getDocs(q);
      const cloudPledges: SmogPledge[] = [];
      snap.forEach(d => {
        cloudPledges.push(d.data() as SmogPledge);
      });
      if (cloudPledges.length > 0) {
        return cloudPledges;
      }
    } catch (e) {
      console.warn('Error fetching cloud pledges, using local cache:', e);
    }
  }

  return localPledges;
};

/**
 * Submits a Support / Feedback ticket to Cloud Firestore 'support_tickets' collection with localStorage fallback
 */
export const submitSupportTicket = async (ticket: SupportTicket): Promise<boolean> => {
  // Always persist locally first
  try {
    const existing = JSON.parse(localStorage.getItem('agrilens_support_tickets') || '[]');
    const updated = [ticket, ...existing.filter((t: SupportTicket) => t.id !== ticket.id)];
    localStorage.setItem('agrilens_support_tickets', JSON.stringify(updated));
  } catch (e) {
    console.warn('LocalStorage ticket save error:', e);
  }

  // Then sync to Cloud Firestore
  try {
    if (!firestoreDb || !isConfigured) {
      return false;
    }
    const docRef = doc(collection(firestoreDb, 'support_tickets'), ticket.id);
    await setDoc(docRef, {
      ...ticket,
      appVersion: 'AgriLens Eco v2.0',
      syncedAt: new Date().toISOString()
    }, { merge: true });
    return true;
  } catch (error) {
    console.warn('Firestore ticket sync error, falling back to local storage:', error);
    return false;
  }
};

/**
 * Loads recent support tickets
 */
export const getSupportTickets = async (): Promise<SupportTicket[]> => {
  let localTickets: SupportTicket[] = [];
  try {
    localTickets = JSON.parse(localStorage.getItem('agrilens_support_tickets') || '[]');
  } catch (e) {
    localTickets = [];
  }

  if (firestoreDb && isConfigured) {
    try {
      const q = query(collection(firestoreDb, 'support_tickets'), orderBy('createdAt', 'desc'), limit(15));
      const snap = await getDocs(q);
      const cloudTickets: SupportTicket[] = [];
      snap.forEach(d => {
        cloudTickets.push(d.data() as SupportTicket);
      });
      if (cloudTickets.length > 0) {
        return cloudTickets;
      }
    } catch (e) {
      console.warn('Error fetching cloud tickets, using local cache:', e);
    }
  }

  return localTickets;
};

