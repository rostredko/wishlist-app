/** After Google sign-in, open Create wishlist dialog (popup + redirect return + Telegram return). */
const WL_PENDING_CREATE_KEY = 'wl_pending_create_wishlist';
const WL_PENDING_CREATE_MAX_AGE_MS = 30 * 60 * 1000;

export function setPendingWishlistCreateAfterAuth() {
  try {
    sessionStorage.setItem(WL_PENDING_CREATE_KEY, String(Date.now()));
  } catch {
    /* ignore */
  }
}

export function clearPendingWishlistCreateAfterAuth() {
  try {
    sessionStorage.removeItem(WL_PENDING_CREATE_KEY);
  } catch {
    /* ignore */
  }
}

/** If a valid pending intent exists, remove it and return true. */
export function consumePendingWishlistCreateAfterAuth(): boolean {
  try {
    const raw = sessionStorage.getItem(WL_PENDING_CREATE_KEY);
    if (raw == null) return false;
    sessionStorage.removeItem(WL_PENDING_CREATE_KEY);
    const t = parseInt(raw, 10);
    if (Number.isNaN(t) || Date.now() - t > WL_PENDING_CREATE_MAX_AGE_MS) return false;
    return true;
  } catch {
    return false;
  }
}
