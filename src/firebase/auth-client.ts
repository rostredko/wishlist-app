import { connectAuthEmulator, getAuth, GoogleAuthProvider } from 'firebase/auth';
import { app } from './init';
import { useFirebaseEmulators } from './config';

export const auth = getAuth(app);
if (useFirebaseEmulators) {
    connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
}
export const googleProvider = new GoogleAuthProvider();
