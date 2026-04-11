import { describe, it, expect, afterEach } from 'vitest';
import { waitFor } from '@testing-library/react';
import { customRender as render } from '../test/render';
import SEOHead from '@components/SEOHead';

describe('SEOHead', () => {
  afterEach(() => {
    document.head.innerHTML = '';
    document.documentElement.lang = 'en';
  });

  it('keeps slashless canonical and alternate URLs and points x-default to /ua', async () => {
    render(
      <SEOHead
        title="Example wishlist"
        description="Example description"
        lang="en"
        canonical="https://wishlistapp.com.ua/en/wishlist/christmas-list"
        alternates={{
          en: 'https://wishlistapp.com.ua/en/wishlist/christmas-list',
          uk: 'https://wishlistapp.com.ua/ua/wishlist/christmas-list-ua',
        }}
      />
    );

    await waitFor(() => {
      expect(
        document.head.querySelector('link[rel="canonical"]')?.getAttribute('href')
      ).toBe('https://wishlistapp.com.ua/en/wishlist/christmas-list');
    });

    expect(
      document.head.querySelector('link[rel="alternate"][hreflang="en"]')?.getAttribute('href')
    ).toBe('https://wishlistapp.com.ua/en/wishlist/christmas-list');

    expect(
      document.head.querySelector('link[rel="alternate"][hreflang="uk"]')?.getAttribute('href')
    ).toBe('https://wishlistapp.com.ua/ua/wishlist/christmas-list-ua');

    expect(
      document.head.querySelector('link[rel="alternate"][hreflang="x-default"]')?.getAttribute('href')
    ).toBe('https://wishlistapp.com.ua/ua');
  });

  it('allows overriding robots meta content', async () => {
    render(
      <SEOHead
        title="Missing wishlist"
        description="Wishlist not found"
        lang="en"
        robots="noindex,follow"
      />
    );

    await waitFor(() => {
      expect(document.head.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe('noindex,follow');
    });
  });
});
