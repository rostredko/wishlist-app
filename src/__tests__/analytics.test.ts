import { beforeEach, describe, expect, it, vi } from 'vitest';
import { flushEventQueue, getAnalyticsPage, trackEvent, trackPageView } from '@utils/analytics';
import { BLOG_SLUG_PAIRS } from '@constants/blogArticles';

beforeEach(async () => {
  window.gtag = vi.fn();
  window.dataLayer = [];
  await flushEventQueue();
  vi.mocked(window.gtag).mockClear();
  window.history.replaceState({}, '', '/en/wishlist/private-access-token?email=private@example.com');
  document.title = 'Private person birthday';
});

describe('bounded product analytics', () => {
  it('classifies every Ukrainian and English article as an article', () => {
    for (const pair of BLOG_SLUG_PAIRS) {
      for (const language of ['ua', 'en'] as const) {
        const path = `/${language}/blog/${pair[language]}`;
        expect(getAnalyticsPage(path)).toMatchObject({ page_path: path, page_type: 'article', language });
      }
    }
  });

  it('keeps the same previous-page referrer for events within a visit', async () => {
    await trackPageView('/en');
    await trackPageView('/en/wishlist/private-access-token');
    await trackEvent('wishlist_view', { viewer_role: 'guest' });
    const calls = vi.mocked(window.gtag!).mock.calls;
    expect(calls.at(-1)?.[2]).toMatchObject({ page_referrer: `${window.location.origin}/en` });
  });
  it('removes personal text, identifiers and raw URLs while retaining bounded dimensions', async () => {
    await trackEvent('wishlist_item_add', {
      event_label: 'Private person', item_name: 'Private gift', wishlist_id: 'private-access-token',
      user_id: 'user-private', url: 'https://shop.test/?email=private@example.com',
      has_link: true, is_demo: false, viewer_role: 'owner', currency: 'UAH',
    });
    const payload = vi.mocked(window.gtag!).mock.calls.at(-1);
    expect(payload).toEqual(['event', 'wishlist_item_add', expect.objectContaining({
      has_link: true, is_demo: false, viewer_role: 'owner', currency: 'UAH',
      page_location: `${window.location.origin}/en/wishlist/personal`, page_title: 'Wishlist - WishList App',
    })]);
    expect(JSON.stringify(payload)).not.toMatch(/Private|private-access-token|private@example|user-private|shop.test/);
  });

  it('uses stable route metadata and removes queries and personal IDs from pageviews', async () => {
    await trackPageView('/en/wishlist/private-access-token?name=Private');
    expect(window.gtag).toHaveBeenLastCalledWith('event', 'page_view', expect.objectContaining({
      page_path: '/en/wishlist/personal', page_title: 'Wishlist - WishList App',
    }));
    expect(JSON.stringify(vi.mocked(window.gtag!).mock.calls)).not.toMatch(/Private|private-access-token/);
  });

  it('does not trust arbitrary strings passed as bounded dimensions', async () => {
    await trackEvent('wishlist_create', { viewer_role: 'Private person', creation_method: 'email@example.com', value: 100 });
    expect(window.gtag).toHaveBeenLastCalledWith('event', 'wishlist_create', expect.not.objectContaining({
      viewer_role: 'Private person', creation_method: 'email@example.com', value: 100,
    }));
  });

  it('keeps actions safe if analytics throws and flushes a queued event once', async () => {
    window.gtag = vi.fn(() => { throw new Error('blocked'); });
    await expect(trackEvent('wishlist_share_copy', { method: 'clipboard' })).resolves.toBeUndefined();
    window.gtag = vi.fn();
    await flushEventQueue();
    await flushEventQueue();
    expect(vi.mocked(window.gtag).mock.calls.filter(call => call[1] === 'wishlist_share_copy')).toHaveLength(1);
  });
});
