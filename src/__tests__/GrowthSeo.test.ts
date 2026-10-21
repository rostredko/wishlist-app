import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { buildRoutes, renderPage, renderUnlistedShell } from '../../scripts/prerender';
import { resolveBlogAlternates } from '@constants/blogArticles';
import home from '../locales/ua/home.json';

const read = (file: string) => readFileSync(resolve(file), 'utf8');

describe('growth SEO policy', () => {
  it('only connects equivalent articles as language alternates', () => {
    for (const slug of ['amazon-wishlist-alternatives', 'wishlist-vs-gift-registry', 'best-secret-santa-apps']) {
      expect(resolveBlogAlternates('https://wishlistapp.com.ua', 'en', slug)).toBeUndefined();
    }
    expect(resolveBlogAlternates('https://wishlistapp.com.ua', 'en', 'how-to-create-a-wishlist')?.uk).toContain('yak-zrobyty-vishlist');
  });
  it('keeps creation metadata consistent in the source shell', () => {
    const html = read('index.html');
    expect(home.title).toBe('Створити вішліст безкоштовно - WishList App');
    expect(html).toContain(`<title>${home.title}</title>`);
    expect(html).toContain(`content="${home.desc}"`);
  });
  it('does not mask unknown paths with a catch-all successful response', () => {
    const config = JSON.parse(read('firebase.json'));
    expect(config.hosting.rewrites.some((r: { source: string }) => r.source === '**')).toBe(false);
    expect(config.hosting.rewrites).toContainEqual({ source: '/{ua,en}/wishlist/*', destination: '/personal-wishlist.html' });
  });
  it('prerenders all sitemap routes with matching metadata and only valid alternates', () => {
    const routes = buildRoutes(resolve('.'));
    for (const route of routes) {
      const doc = new DOMParser().parseFromString(renderPage(read('index.html'), route), 'text/html');
      expect(doc.title).toBe(route.title);
      expect(doc.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(`https://wishlistapp.com.ua${route.path}`);
      expect(doc.querySelectorAll('link[hreflang]').length).toBe(route.alternates ? 3 : 0);
      expect(doc.querySelector('meta[name="robots"]')?.getAttribute('content')).not.toContain('noindex');
    }
    expect(routes.find(route => route.path === '/ua')?.description).toBe(home.desc);
  });
  it('starts personal lists and 404 responses unlisted while preserving the app entrypoint', () => {
    for (const title of ['WishList App', home.notFound.title]) {
      const html = renderUnlistedShell(read('index.html'), '<h1>Unlisted route</h1>', title);
      const doc = new DOMParser().parseFromString(html, 'text/html');
      expect(doc.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe('noindex,follow');
      expect(doc.title).toBe(title);
      expect(doc.querySelector('script[type="module"]')).not.toBeNull();
      expect(doc.querySelector('script[type="application/ld+json"]')).toBeNull();
      expect(doc.querySelector('meta[property="og:url"]')).toBeNull();
      expect(doc.querySelector('noscript')).toBeNull();
      expect(doc.querySelector('h1')?.textContent).toBe('Unlisted route');
    }
  });
  it('does not claim unrelated article topics are translations in the sitemap', () => {
    const sitemap = read('public/sitemap.xml');
    const entry = sitemap.match(/<url>\s*<loc>https:\/\/wishlistapp.com.ua\/en\/blog\/wishlist-vs-gift-registry<\/loc>[\s\S]*?<\/url>/)?.[0];
    expect(entry).toBeDefined();
    expect(entry).not.toContain('hreflang');
  });
});
