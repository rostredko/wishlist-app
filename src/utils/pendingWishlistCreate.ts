import { isDemoWishlistId } from '@constants/exampleWishlists';

const KEY = 'wl_pending_create_wishlist';
const MAX_AGE_MS = 30 * 60 * 1000;
export const WISHLIST_AUTH_COMPLETE = 'wishlist-auth-complete';
export type CreationSource = 'home' | 'guest_list' | 'demo' | 'blog';
export type WishlistCreationIntent = {
  action: 'create' | 'copy_demo';
  demoId?: string;
  language: 'ua' | 'en';
  path: string;
  source: CreationSource;
};
type StoredIntent = WishlistCreationIntent & { attemptId: string; startedAt: number; phase: 'pending' | 'redirect' | 'authenticated' };
let inMemoryIntent: StoredIntent | null = null;

function readIntent(): StoredIntent | null {
  let value: StoredIntent | null = inMemoryIntent;
  try {
    const raw = sessionStorage.getItem(KEY);
    value = raw ? JSON.parse(raw) as StoredIntent : null;
  } catch {
    // Storage restrictions still permit popup recovery in this document.
  }
  if (!value || typeof value.attemptId !== 'string' || !Number.isFinite(value.startedAt) ||
    Date.now() < value.startedAt || Date.now() - value.startedAt > MAX_AGE_MS ||
    !['ua', 'en'].includes(value.language) || !['pending', 'redirect', 'authenticated'].includes(value.phase) ||
    !['home', 'guest_list', 'demo', 'blog'].includes(value.source) ||
    typeof value.path !== 'string' || !(value.path === `/${value.language}` || value.path.startsWith(`/${value.language}/`)) ||
    !['create', 'copy_demo'].includes(value.action) ||
    (!inMemoryIntent && value.phase !== 'redirect') ||
    (value.action === 'copy_demo' && (!value.demoId || !isDemoWishlistId(value.demoId) || value.path !== `/${value.language}/wishlist/${value.demoId}`))) {
    clearPendingWishlistCreateAfterAuth();
    return null;
  }
  return value;
}

function saveIntent(value: StoredIntent) {
  inMemoryIntent = value;
  try { sessionStorage.setItem(KEY, JSON.stringify(value)); } catch { /* Popup flows still work without storage. */ }
}

export function setPendingWishlistCreateAfterAuth(intent: WishlistCreationIntent) {
  saveIntent({ ...intent, attemptId: crypto.randomUUID(), startedAt: Date.now(), phase: 'pending' });
}

export function clearPendingWishlistCreateAfterAuth(expectedAttempt?: string) {
  if (expectedAttempt && readIntent()?.attemptId !== expectedAttempt) return;
  inMemoryIntent = null;
  try { sessionStorage.removeItem(KEY); } catch { /* Storage can be restricted. */ }
}

export function getPendingWishlistAuthAttempt(): string | null {
  return readIntent()?.attemptId ?? null;
}

export function markPendingWishlistRedirect(expectedAttempt?: string) {
  const intent = readIntent();
  if (intent && (!expectedAttempt || intent.attemptId === expectedAttempt)) saveIntent({ ...intent, phase: 'redirect' });
}

export function hasPendingWishlistRedirect(): boolean {
  return readIntent()?.phase === 'redirect';
}

export function completePendingWishlistAuth(expectedAttempt?: string) {
  const intent = readIntent();
  if (!intent || expectedAttempt && intent.attemptId !== expectedAttempt) return;
  saveIntent({ ...intent, phase: 'authenticated' });
  window.dispatchEvent(new Event(WISHLIST_AUTH_COMPLETE));
}

export function consumePendingWishlistCreateAfterAuth(path: string): WishlistCreationIntent | null {
  const intent = readIntent();
  if (!intent || intent.phase !== 'authenticated' || intent.path !== path) return null;
  clearPendingWishlistCreateAfterAuth();
  return intent;
}

/** Internal navigation abandons the action; an OAuth return to its exact path retains it. */
export function discardPendingWishlistCreateOnNavigation(path: string) {
  const intent = readIntent();
  if (intent && intent.path !== path) clearPendingWishlistCreateAfterAuth();
}
