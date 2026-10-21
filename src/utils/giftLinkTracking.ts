import { trackEvent } from '@utils/analytics';

/** Navigation belongs to the anchor; analytics is a best-effort side effect. */
export function trackGiftLinkClick(viewerRole: 'owner' | 'guest', isDemo: boolean): void {
  void trackEvent('click_gift_link', { viewer_role: viewerRole, is_demo: isDemo, has_link: true });
}
