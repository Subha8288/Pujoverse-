import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  initializeFirestore,
  getFirestore,
  collection,
  doc,
  getDocFromServer,
  onSnapshot,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  serverTimestamp
} from 'firebase/firestore';
import { PhotoEntry, PandalLandmark, ChatMessage, UserProfile } from '../types/contest';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const firestoreDbId =
  firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
    ? firebaseConfig.firestoreDatabaseId
    : undefined;

// Initialize Firestore with experimentalForceLongPolling to ensure seamless connectivity across iframes & proxies
export const db = (() => {
  try {
    return initializeFirestore(
      app,
      {
        experimentalForceLongPolling: true,
      },
      firestoreDbId
    );
  } catch {
    return firestoreDbId ? getFirestore(app, firestoreDbId) : getFirestore(app);
  }
})();

// Connectivity state tracker
let isCloudConnected = false;
export const getIsCloudConnected = () => isCloudConnected;

// Mandatory boot connection test per Firebase skill guidelines with graceful timeout guard
async function testConnection() {
  try {
    const checkPromise = getDocFromServer(doc(db, 'test', 'connection'));
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Connection check timeout')), 4000)
    );
    await Promise.race([checkPromise, timeoutPromise]);
    isCloudConnected = true;
    console.log('[PujoVerse Firebase] Connected successfully to Cloud Firestore.');
  } catch (error) {
    isCloudConnected = false;
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('[PujoVerse Firebase] Offline mode active: client will use local cache.');
    } else {
      console.info('[PujoVerse Firebase] Cloud Firestore initialized with resilient offline-first fallback.');
    }
  }
}
testConnection();

// Collection References
const PHOTOS_COLLECTION = 'photos';
const PANDALS_COLLECTION = 'pandals';
const MESSAGES_COLLECTION = 'messages';
const USERS_COLLECTION = 'users';

export const FirebaseService = {
  getDb() {
    return db;
  },

  // Real-time listener for photos
  subscribeToPhotos(onUpdate: (photos: PhotoEntry[]) => void) {
    try {
      const q = query(collection(db, PHOTOS_COLLECTION), orderBy('createdAt', 'desc'), limit(100));
      return onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const list: PhotoEntry[] = [];
            snapshot.forEach((docSnap) => {
              const data = docSnap.data();
              list.push({
                ...data,
                id: docSnap.id
              } as PhotoEntry);
            });
            onUpdate(list);
          }
        },
        (err) => {
          console.warn('[PujoVerse Firebase] Photos listener fallback:', err);
        }
      );
    } catch (err) {
      console.warn('[PujoVerse Firebase] Subscription failed:', err);
      return () => {};
    }
  },

  // Save or update photo to cloud
  async savePhoto(photo: PhotoEntry) {
    try {
      const docRef = doc(db, PHOTOS_COLLECTION, photo.id);
      await setDoc(docRef, {
        ...photo,
        updatedAt: serverTimestamp()
      }, { merge: true });
      return true;
    } catch (err) {
      console.error('[PujoVerse Firebase] Error saving photo:', err);
      return false;
    }
  },

  async updatePhoto(photoId: string, updates: Partial<PhotoEntry>) {
    try {
      const docRef = doc(db, PHOTOS_COLLECTION, photoId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      return true;
    } catch (err) {
      console.error('[PujoVerse Firebase] Error updating photo:', err);
      return false;
    }
  },

  async deletePhoto(photoId: string) {
    try {
      const docRef = doc(db, PHOTOS_COLLECTION, photoId);
      await deleteDoc(docRef);
      return true;
    } catch (err) {
      console.error('[PujoVerse Firebase] Error deleting photo:', err);
      return false;
    }
  },

  // Real-time listener for custom pandals across West Bengal
  subscribeToPandals(onUpdate: (pandals: PandalLandmark[]) => void) {
    try {
      const q = query(collection(db, PANDALS_COLLECTION), limit(200));
      return onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const list: PandalLandmark[] = [];
            snapshot.forEach((docSnap) => {
              const data = docSnap.data();
              list.push({
                ...data,
                id: docSnap.id
              } as PandalLandmark);
            });
            onUpdate(list);
          }
        },
        (err) => {
          console.warn('[PujoVerse Firebase] Pandals listener fallback:', err);
        }
      );
    } catch (err) {
      console.warn('[PujoVerse Firebase] Pandals subscription failed:', err);
      return () => {};
    }
  },

  // Save custom pandal across West Bengal
  async savePandal(pandal: PandalLandmark) {
    try {
      const docRef = doc(db, PANDALS_COLLECTION, pandal.id);
      await setDoc(docRef, {
        ...pandal,
        createdAtServer: serverTimestamp()
      }, { merge: true });
      return true;
    } catch (err) {
      console.error('[PujoVerse Firebase] Error saving custom pandal:', err);
      return false;
    }
  },

  // Real-time listener for Adda chat messages
  subscribeToChat(onUpdate: (messages: ChatMessage[]) => void) {
    try {
      const q = query(collection(db, MESSAGES_COLLECTION), orderBy('timestamp', 'asc'), limit(80));
      return onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const list: ChatMessage[] = [];
            snapshot.forEach((docSnap) => {
              const data = docSnap.data();
              list.push({
                ...data,
                id: docSnap.id
              } as ChatMessage);
            });
            onUpdate(list);
          }
        },
        (err) => {
          console.warn('[PujoVerse Firebase] Chat listener fallback:', err);
        }
      );
    } catch (err) {
      console.warn('[PujoVerse Firebase] Chat subscription failed:', err);
      return () => {};
    }
  },

  // Send Adda chat message
  async sendChatMessage(msg: ChatMessage) {
    try {
      const docRef = doc(db, MESSAGES_COLLECTION, msg.id);
      await setDoc(docRef, {
        ...msg,
        sentAtServer: serverTimestamp()
      });
      return true;
    } catch (err) {
      console.error('[PujoVerse Firebase] Error sending chat message:', err);
      return false;
    }
  },

  // Sync user profile
  async saveUserProfile(user: UserProfile) {
    try {
      const docRef = doc(db, USERS_COLLECTION, user.id);
      await setDoc(docRef, {
        ...user,
        syncedAt: serverTimestamp()
      }, { merge: true });
      return true;
    } catch (err) {
      console.error('[PujoVerse Firebase] Error syncing user profile:', err);
      return false;
    }
  }
};
