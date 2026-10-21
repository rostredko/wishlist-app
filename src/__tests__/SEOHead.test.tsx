import { describe, it, expect, afterEach } from 'vitest';
import { waitFor } from '@testing-library/react';
import { customRender as render } from '../test/render';
import SEOHead from '@components/SEOHead';

describe('SEOHead', () => {
  afterEach(() => {
    document.head.innerHTML = '';
    document.documentElement.lang = 'en';
  });

  it('keeps slashless canonical and alternate URLs and points x-default to uk alternate', async () => {
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

    // x-default should point to the uk alternate URL, not the generic homepage
    expect(
      document.head.querySelector('link[rel="alternate"][hreflang="x-default"]')?.getAttribute('href')
    ).toBe('https://wishlistapp.com.ua/ua/wishlist/christmas-list-ua');
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

  it('does not invent language URLs for topics without declared translations', () => {
    render(<SEOHead title="Topic" description="Topic" lang="en" canonical="https://wishlistapp.com.ua/en/blog/one-language-topic" />);
    expect(document.head.querySelector('link[hreflang]')).toBeNull();
  });

  it('suppresses language alternates for unlisted personal lists', () => {
    render(<SEOHead title="Personal list" description="Personal list" lang="en" robots="noindex,follow"
      alternates={{ en: 'https://wishlistapp.com.ua/en/wishlist/personal', uk: 'https://wishlistapp.com.ua/ua/wishlist/personal' }} />);
    expect(document.head.querySelector('link[hreflang]')).toBeNull();
  });

  it('emits Article and HowTo JSON-LD when structured props are set', async () => {
    render(
      <SEOHead
        title="How to test"
        description="Test description"
        lang="en"
        canonical="https://wishlistapp.com.ua/en/blog/test"
        structured={{
          article: {
            headline: 'How to test',
            datePublished: '2026-04-01',
            dateModified: '2026-04-15',
          },
          howTo: {
            name: 'Test how-to',
            steps: [{ text: 'Step one' }],
          },
        }}
      />
    );

    await waitFor(() => {
      const article = document.head.querySelector(
        'script[type="application/ld+json"][data-jsonld-id="article"]',
      );
      expect(article?.textContent).toContain('"@type":"Article"');
      expect(article?.textContent).toContain('"datePublished":"2026-04-01"');
      expect(article?.textContent).toContain('"dateModified":"2026-04-15"');
      const howto = document.head.querySelector(
        'script[type="application/ld+json"][data-jsonld-id="howto"]',
      );
      expect(howto?.textContent).toContain('"@type":"HowTo"');
    });
  });
});
