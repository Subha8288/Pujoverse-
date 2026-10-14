import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  initializeFirestore,
  getFirestore,
  collection,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  serverTimestamp
} from 'firebase/firestore';
import { PhotoEntry, PandalLandmark, ChatMessage, UserProfile, VideoEntry } from '../types/contest';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const firestoreDbId =
  firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
    ? firebaseConfig.firestoreDatabaseId
    : undefined;

// Initialize Firestore with auto-detect long polling for optimal connection in iframes & browsers
export const db = (() => {
  try {
    return initializeFirestore(
      app,
      {
        experimentalAutoDetectLongPolling: true,
      },
      firestoreDbId
    );
  } catch {
    return firestoreDbId ? getFirestore(app, firestoreDbId) : getFirestore(app);
  }
})();

// Connectivity state tracker
let isCloudConnected = true;
export const getIsCloudConnected = () => isCloudConnected;

// Non-blocking gentle connection check that avoids throwing code=unavailable errors
async function testConnection() {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    isCloudConnected = false;
    return;
  }
  try {
    // Gentle probe with timeout that doesn't force a cold server lock
    const checkPromise = getDoc(doc(db, 'test', 'connection'));
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Connection check timeout')), 3000)
    );
    await Promise.race([checkPromise, timeoutPromise]);
    isCloudConnected = true;
  } catch {
    // Offline-first fallback: Firestore operates seamlessly with local cache
    isCloudConnected = false;
  }
}

if (typeof window !== 'undefined') {
  // Run connection check in next microtask to let Firestore finish initialization
  setTimeout(testConnection, 500);
  window.addEventListener('online', testConnection);
  window.addEventListener('offline', () => {
    isCloudConnected = false;
  });
}

// Collection References
const PHOTOS_COLLECTION = 'photos';
const VIDEOS_COLLECTION = 'videos';
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

  // Real-time listener for videos
  subscribeToVideos(onUpdate: (videos: VideoEntry[]) => void) {
    try {
      const q = query(collection(db, VIDEOS_COLLECTION), orderBy('createdAt', 'desc'), limit(100));
      return onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const list: VideoEntry[] = [];
            snapshot.forEach((docSnap) => {
              const data = docSnap.data();
              list.push({
                ...data,
                id: docSnap.id
              } as VideoEntry);
            });
            onUpdate(list);
          }
        },
        (err) => {
          console.warn('[PujoVerse Firebase] Videos listener fallback:', err);
        }
      );
    } catch (err) {
      console.warn('[PujoVerse Firebase] Videos subscription failed:', err);
      return () => {};
    }
  },

  async saveVideo(video: VideoEntry) {
    try {
      const docRef = doc(db, VIDEOS_COLLECTION, video.id);
      await setDoc(docRef, {
        ...video,
        updatedAt: serverTimestamp()
      }, { merge: true });
      return true;
    } catch (err) {
      console.error('[PujoVerse Firebase] Error saving video:', err);
      return false;
    }
  },

  async updateVideo(videoId: string, updates: Partial<VideoEntry>) {
    try {
      const docRef = doc(db, VIDEOS_COLLECTION, videoId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      return true;
    } catch (err) {
      console.error('[PujoVerse Firebase] Error updating video:', err);
      return false;
    }
  },

  async deleteVideo(videoId: string) {
    try {
      const docRef = doc(db, VIDEOS_COLLECTION, videoId);
      await deleteDoc(docRef);
      return true;
    } catch (err) {
      console.error('[PujoVerse Firebase] Error deleting video:', err);
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
  },

  async deleteUserProfile(userId: string) {
    try {
      const docRef = doc(db, USERS_COLLECTION, userId);
      await deleteDoc(docRef);
      return true;
    } catch (err) {
      console.warn('[PujoVerse Firebase] Error removing user profile from cloud:', err);
      return false;
    }
  }
};
