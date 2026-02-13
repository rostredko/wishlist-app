import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { firebaseConfig } from './config';

export const app: FirebaseApp =
    getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
