const sessionStorageTestKey = '__auth_test__';

function hasWindow(): boolean {
  return typeof window !== 'undefined' && typeof navigator !== 'undefined';
}

/**
 * Returns true when we know the current environment routinely blocks popups
 * (embedded messengers, some webviews, standalone PWAs, etc.). Redirect is only
 * safe to use when {@link canUseRedirectFlow} also returns true.
 */
export function shouldUseRedirect(): boolean {
  if (!hasWindow()) return false;

  const ua = navigator.userAgent?.toLowerCase() ?? '';

  const isEmbeddedMessenger =
    ua.includes('telegram') ||
    ua.includes('whatsapp') ||
    ua.includes('facebook') ||
    ua.includes('line') ||
    ua.includes('wechat') ||
    ua.includes('instagram') ||
    typeof (window as any).TelegramWebApp !== 'undefined';

  const isAndroidWebView = ua.includes('wv;') || (ua.includes('version/') && ua.includes('chrome/'));
  const isStandalonePwa =
    (navigator as any).standalone === true ||
    window.matchMedia?.('(display-mode: standalone)').matches === true;

  return isEmbeddedMessenger || isAndroidWebView || isStandalonePwa;
}

/**
 * Redirect-based flows need working sessionStorage to persist auth state across
 * the full page reload performed by the OAuth handler.
 */
export function canUseRedirectFlow(): boolean {
  if (!hasWindow()) return false;

  try {
    sessionStorage.setItem(sessionStorageTestKey, 'ok');
    sessionStorage.removeItem(sessionStorageTestKey);
    return true;
  } catch {
    return false;
  }
}

