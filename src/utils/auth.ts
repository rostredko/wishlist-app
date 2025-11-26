/**
 * Determines if we should use signInWithRedirect instead of signInWithPopup
 * This is needed for mobile devices and embedded browsers (Telegram, etc.)
 * where popups may be blocked or sessionStorage is inaccessible
 */
export function shouldUseRedirect(): boolean {
  if (typeof window === 'undefined') return false;

  // Check if sessionStorage is accessible
  try {
    const testKey = '__auth_test__';
    sessionStorage.setItem(testKey, 'test');
    sessionStorage.removeItem(testKey);
  } catch {
    // sessionStorage is not accessible, use redirect
    return true;
  }

  // Check user agent for mobile devices
  const ua = navigator.userAgent.toLowerCase();
  const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua);
  
  // Check for embedded browsers
  const isEmbedded = 
    ua.includes('telegram') ||
    ua.includes('whatsapp') ||
    ua.includes('facebook') ||
    ua.includes('line') ||
    ua.includes('wechat') ||
    ua.includes('instagram') ||
    (window as any).TelegramWebApp !== undefined;

  // Use redirect on mobile or embedded browsers
  return isMobile || isEmbedded;
}

