const isTest =
    process.env.NODE_ENV === 'test' ||
    (typeof import.meta !== 'undefined' &&
        import.meta.env &&
        import.meta.env.MODE === 'test');

export const firebaseConfig = {
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
