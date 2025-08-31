import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const isTest =
  process.env.NODE_ENV === 'test' ||
  (typeof import.meta !== 'undefined' &&
    (import.meta as any).env &&
    (import.meta as any).env.MODE === 'test');

const firebaseConfig = {
  apiKey:
    (!isTest && import.meta.env.VITE_FIREBASE_API_KEY) || 'test-api-key',
  authDomain:
    (!isTest && import.meta.env.VITE_FIREBASE_AUTH_DOMAIN) || 'test-auth.domain',
  projectId:
    (!isTest && import.meta.env.VITE_FIREBASE_PROJECT_ID) || 'test-project-id',
  storageBucket:
    (!isTest && import.meta.env.VITE_FIREBASE_STORAGE_BUCKET) || 'test-bucket',
  messagingSenderId:
    (!isTest && import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID) || '0',
  appId: (!isTest && import.meta.env.VITE_FIREBASE_APP_ID) || 'test-app-id',
};

const app: FirebaseApp =
  getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

if (isTest) {
  console.info('[firebase] Initialized with test-safe config');
}