import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { app } from './init';
import { useFirebaseEmulators } from './config';

export const db = getFirestore(app);
if (useFirebaseEmulators) connectFirestoreEmulator(db, '127.0.0.1', 8080);
