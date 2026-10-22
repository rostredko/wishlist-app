import { BLOG_SLUG_PAIRS } from '@constants/blogArticles';
import { isDemoWishlistId } from '@constants/exampleWishlists';
import enHome from '../locales/en/home.json';
import uaHome from '../locales/ua/home.json';
import enBlog from '../locales/en/blog.json';
import uaBlog from '../locales/ua/blog.json';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

type EventParams = Record<string, unknown>;
type AnalyticsPage = { page_path: string; page_title: string; page_type: string; language: 'en' | 'ua' };
const queue: Array<{ name: string; params: EventParams }> = [];
const MAX_QUEUED_EVENTS = 100;
let previousPageLocation = '';
let currentPageReferrer: string | undefined;

const categories: Record<string, readonly string[]> = {
  event_category: ['engagement'],
  viewer_role: ['owner', 'admin', 'guest'],
  creation_method: ['manual', 'demo_copy', 'shared_copy'],
  source: ['home', 'guest_list', 'demo', 'blog'],
  method: ['native', 'clipboard', 'manual'],
  operation: ['create', 'copy', 'load', 'load_items', 'add_item', 'edit_item', 'reserve', 'share', 'delete', 'title', 'banner'],
  error_category: ['persistence', 'unavailable', 'permission', 'unknown'],
  currency: ['UAH', 'USD', 'EUR', 'GBP'],
  guide: ['new_year', 'st_nicholas', 'secret_santa'],
  suggestion: ['new_year', 'st_nicholas', 'secret_santa'],
};

export function getAnalyticsPage(path: string): AnalyticsPage {
  const pathname = path.split(/[?#]/)[0].replace(/\/+$/, '') || '/';
  const segments = pathname.split('/').filter(Boolean);
  const language: 'en' | 'ua' = segments[0] === 'en' ? 'en' : 'ua';
  const base = `/${language}`;
  const defaults = { language, page_path: `${base}/not-found`, page_title: 'Page not found - WishList App', page_type: 'not_found' };
  if (pathname === '/' || pathname === base) {
    return { ...defaults, page_path: base, page_title: language === 'ua' ? uaHome.title : enHome.title, page_type: 'home' };
  }
  if (!['en', 'ua'].includes(segments[0])) return defaults;
  if (segments[1] === 'privacy' && segments.length === 2) {
    return { ...defaults, page_path: `${base}/privacy`, page_title: 'Privacy - WishList App', page_type: 'privacy' };
  }
  if (['wishlist', 'wishlists'].includes(segments[1]) && segments.length === 3) {
    const demo = isDemoWishlistId(segments[2]);
    return { ...defaults, page_path: `${base}/wishlist/${demo ? segments[2] : 'personal'}`,
      page_title: demo ? 'Wishlist example - WishList App' : 'Wishlist - WishList App', page_type: demo ? 'demo' : 'wishlist' };
  }
  if (segments[1] === 'blog') {
    const blog = language === 'ua' ? uaBlog : enBlog;
    if (segments.length === 2) return { ...defaults, page_path: `${base}/blog`, page_title: blog.hub.title, page_type: 'blog' };
    const pair = BLOG_SLUG_PAIRS.find(pair => pair[language] === segments[2]);
    const card = pair ? blog.cards[pair.en] : undefined;
    if (segments.length === 3 && card) return { ...defaults, page_path: pathname, page_title: `${card.title} - WishList App`, page_type: 'article' };
  }
  return defaults;
}

function safeReferrer(): string {
  if (previousPageLocation) return previousPageLocation;
  try {
    const referrer = new URL(document.referrer);
    return referrer.origin === window.location.origin
      ? `${referrer.origin}${getAnalyticsPage(referrer.pathname).page_path}` : referrer.origin;
  } catch {
    return '';
  }
}

function pageParams(path: string, referrer = safeReferrer()): EventParams {
  const page = getAnalyticsPage(path);
  return { ...page, page_location: `${window.location.origin}${page.page_path}`, page_referrer: referrer };
}

function boundedParams(params: EventParams): EventParams {
  const safe: EventParams = {};
  for (const key of ['has_link', 'has_price', 'is_demo']) {
    if (typeof params[key] === 'boolean') safe[key] = params[key];
  }
  for (const [key, allowed] of Object.entries(categories)) {
    if (typeof params[key] === 'string' && allowed.includes(params[key] as string)) safe[key] = params[key];
  }
  return safe;
}

function sendOrQueue(name: string, params: EventParams): void {
  try {
    if (typeof window.gtag === 'function' && Array.isArray(window.dataLayer)) {
      window.gtag('event', name, params);
      return;
    }
  } catch {
    // Analytics must never block product actions, even with a broken tag implementation.
  }
  if (queue.length < MAX_QUEUED_EVENTS) queue.push({ name, params });
}

export async function trackEvent(eventName: string, params: EventParams = {}): Promise<void> {
  if (typeof window === 'undefined') return;
  sendOrQueue(eventName, { ...boundedParams(params), ...pageParams(window.location.pathname, currentPageReferrer) });
}

export async function trackPageView(path: string): Promise<void> {
  if (typeof window === 'undefined') return;
  const params = pageParams(path);
  sendOrQueue('page_view', params);
  previousPageLocation = params.page_location as string;
  currentPageReferrer = params.page_referrer as string;
}

export async function flushEventQueue(): Promise<void> {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function' || !Array.isArray(window.dataLayer)) return;
  while (queue.length) {
    const event = queue[0];
    try {
      window.gtag('event', event.name, event.params);
      queue.shift();
    } catch {
      return;
    }
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('load', () => { void flushEventQueue(); });
}
