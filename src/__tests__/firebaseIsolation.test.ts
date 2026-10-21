import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { deleteApp, getApps } from 'firebase/app';

const productionEnv = {
  VITE_FIREBASE_API_KEY: 'production-key',
  VITE_FIREBASE_AUTH_DOMAIN: 'wishlist-app-51cf7.firebaseapp.com',
  VITE_FIREBASE_PROJECT_ID: 'wishlist-app-51cf7',
  VITE_FIREBASE_STORAGE_BUCKET: 'wishlist-app-51cf7.firebasestorage.app',
  VITE_FIREBASE_MESSAGING_SENDER_ID: '123',
  VITE_FIREBASE_APP_ID: 'production-app',
};

function runtime(mode: string, hostname: string, dev = mode !== 'production') {
  vi.stubEnv('NODE_ENV', mode === 'test' ? 'test' : dev ? 'development' : 'production');
  vi.stubEnv('MODE', mode);
  vi.stubEnv('DEV', dev);
  vi.stubGlobal('location', { hostname });
}

beforeEach(() => {
  vi.resetModules();
  for (const [key, value] of Object.entries(productionEnv)) vi.stubEnv(key, value);
});

afterEach(async () => {
  await Promise.all(getApps().map(deleteApp));
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe('Firebase environment isolation', () => {
  it.each([
    ['development', 'localhost', true],
    ['test', 'localhost', true],
    ['development', 'wishlistapp.com.ua', true],
    ['production', 'wishlistapp.com.ua', true],
    ['staging', 'wishlistapp.com.ua', false],
    ['production', 'localhost', false],
    ['production', '127.0.0.1', false],
    ['production', '[::1]', false],
    ['production', '192.168.1.5', false],
    ['production', 'preview.example.com', false],
    ['production', 'wishlistapp.com.ua.example.com', false],
  ])('isolates %s on %s (dev=%s) despite production env values', async (mode, hostname, dev) => {
    runtime(mode, hostname, dev);
    const { firebaseConfig } = await import('../firebase/config');
    expect(firebaseConfig.projectId).toBe('demo-wishlist-local');
    expect(firebaseConfig.storageBucket).toBe('demo-wishlist-local.appspot.com');
    expect(firebaseConfig.apiKey).not.toBe(productionEnv.VITE_FIREBASE_API_KEY);
    expect(firebaseConfig.authDomain).not.toBe(productionEnv.VITE_FIREBASE_AUTH_DOMAIN);
  });

  it.each([
    'wishlistapp.com.ua',
    'www.wishlistapp.com.ua',
    'wishlist-app-51cf7.web.app',
    'wishlist-app-51cf7.firebaseapp.com',
  ])('uses live configuration only for a production build on %s', async hostname => {
    runtime('production', hostname, false);
    const { firebaseConfig } = await import('../firebase/config');
    expect(firebaseConfig.projectId).toBe('wishlist-app-51cf7');
    expect(firebaseConfig.storageBucket).toBe('wishlist-app-51cf7.firebasestorage.app');
    expect(firebaseConfig.apiKey).toBe('production-key');
  });

  it.each(Object.keys(productionEnv))('refuses incomplete production configuration: %s', async key => {
    runtime('production', 'wishlistapp.com.ua', false);
    vi.stubEnv(key, '');
    await expect(import('../firebase/config')).rejects.toThrow(/Firebase configuration/);
  });

  it('connects all three real SDK clients to loopback emulators before use', async () => {
    runtime('development', 'localhost');
    const { auth } = await import('../firebase/auth-client');
    const { db } = await import('../firebase/db-client');
    const { storage } = await import('../firebase/storage-client');
    expect(auth.app.options.projectId).toBe('demo-wishlist-local');
    expect(auth.emulatorConfig).toMatchObject({ host: '127.0.0.1', port: 9099, protocol: 'http' });
    expect(db.app.options.projectId).toBe('demo-wishlist-local');
    expect(db.toJSON()).toMatchObject({ settings: { host: '127.0.0.1:8080', ssl: false } });
    expect(storage.app.options.storageBucket).toBe('demo-wishlist-local.appspot.com');
    expect(storage.host).toBe('127.0.0.1:9199');
  });

  it('refuses to reuse an already initialized production app in local development', async () => {
    runtime('production', 'wishlistapp.com.ua', false);
    const { app } = await import('../firebase/init');
    expect(app.options.projectId).toBe('wishlist-app-51cf7');
    vi.resetModules();
    runtime('development', 'localhost');
    await expect(import('../firebase/init')).rejects.toThrow(/Firebase configuration/);
  });
});
