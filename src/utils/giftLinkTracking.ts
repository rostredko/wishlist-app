import { trackEvent } from '@utils/analytics';

export function logClickAndOpen(
  url: string,
  payload: { id: string; name?: string | null; user_id?: string },
) {
  let opened = false;
  const open = () => {
    if (opened) return;
    opened = true;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const gtagReady =
    typeof window !== 'undefined' &&
    typeof window.gtag === 'function' &&
    Array.isArray(window.dataLayer);

  if (gtagReady && window.gtag) {
    try {
      window.gtag('event', 'click_gift_link', {
        event_category: 'engagement',
        event_label: payload.name ?? '',
        item_id: payload.id,
        url,
        ...(payload.user_id ? { user_id: payload.user_id } : {}),
        event_callback: open,
      });
      return;
    } catch (error) {
      console.error('Failed to track click_gift_link event with callback:', error);
    }
  }

  trackEvent('click_gift_link', {
    event_category: 'engagement',
    event_label: payload.name ?? '',
    item_id: payload.id,
    url,
    ...(payload.user_id ? { user_id: payload.user_id } : {}),
  }).catch((error) => {
    console.error('Failed to track click_gift_link event:', error);
  });

  setTimeout(open, 500);
}
