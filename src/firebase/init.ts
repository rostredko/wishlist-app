import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { firebaseConfig } from './config';

const existingApp = getApps().find(candidate => candidate.name === '[DEFAULT]');

if (existingApp && Object.entries(firebaseConfig).some(([key, value]) =>
    existingApp.options[key as keyof typeof firebaseConfig] !== value)) {
    throw new Error('Firebase configuration changed. Reload the page before continuing.');
}

export const app: FirebaseApp = existingApp ?? initializeApp(firebaseConfig);
