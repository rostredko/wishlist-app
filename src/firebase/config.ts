const productionHosts = new Set([
    'wishlistapp.com.ua',
    'www.wishlistapp.com.ua',
    'wishlist-app-51cf7.web.app',
    'wishlist-app-51cf7.firebaseapp.com',
]);

// Runtime host checks also isolate a production bundle served by local preview.
export const useFirebaseEmulators = import.meta.env.DEV ||
    import.meta.env.MODE !== 'production' ||
    !productionHosts.has(globalThis.location?.hostname ?? '');

export const firebaseConfig = useFirebaseEmulators ? {
    apiKey: 'demo-wishlist-local-key',
    authDomain: 'demo-wishlist-local.firebaseapp.com',
    projectId: 'demo-wishlist-local',
    storageBucket: 'demo-wishlist-local.appspot.com',
    messagingSenderId: '0',
    appId: 'demo-wishlist-local-app',
} : {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

if (Object.values(firebaseConfig).some(value => typeof value !== 'string' || !value.trim())) {
    throw new Error('Firebase configuration is incomplete. Check the production build environment.');
}
