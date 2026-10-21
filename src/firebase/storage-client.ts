import { connectStorageEmulator, getStorage } from 'firebase/storage';
import { app } from './init';
import { useFirebaseEmulators } from './config';

export const storage = getStorage(app);
if (useFirebaseEmulators) connectStorageEmulator(storage, '127.0.0.1', 9199);
