import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

function readText(relativePath: string): string {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

describe('static SEO config', () => {
  it('ships no static canonical or hreflang in the SPA shell (prerender injects them per route)', () => {
    const html = readText('index.html');
    const doc = new DOMParser().parseFromString(html, 'text/html');

    // Homepage-pointing hreflang/canonical on every route made Google
    // canonicalize the whole site to /ua (GSC: "Duplicate, Google chose
    // different canonical than user"). scripts/prerender.ts injects the
    // correct per-route tags at build time; the shell must stay bare.
    expect(doc.querySelector('link[rel="canonical"]')).toBeNull();
    expect(doc.querySelector('link[rel="alternate"][hreflang]')).toBeNull();
    expect(html).toContain('<!-- prerender:hero -->');
    expect(html).toContain('<!-- /prerender:hero -->');
  });

  it('uses slashless URLs in the sitemap and includes x-default for example pages', () => {
    const sitemap = readText('public/sitemap.xml');

    expect(sitemap).not.toContain('https://wishlistapp.com.ua/en/wishlist/christmas-list/');
    expect(sitemap).not.toContain('https://wishlistapp.com.ua/ua/wishlist/christmas-list-ua/');
    expect(sitemap).toContain('https://wishlistapp.com.ua/en/wishlist/christmas-list');
    expect(sitemap).toContain('https://wishlistapp.com.ua/ua/wishlist/christmas-list-ua');
    expect(sitemap).toContain('<xhtml:link rel="alternate" hreflang="x-default" href="https://wishlistapp.com.ua/ua/wishlist/christmas-list-ua"/>');
  });

  it('declares explicit AI crawler rules in robots.txt', () => {
    const robots = readText('public/robots.txt');

    expect(robots).toContain('User-agent: GPTBot');
    expect(robots).toContain('User-agent: OAI-SearchBot');
    expect(robots).toContain('User-agent: PerplexityBot');
    expect(robots).toContain('User-agent: ClaudeBot');
    expect(robots).toContain('User-agent: Google-Extended');
    expect(robots).toContain('Allow: /');
  });

  it('ships an llms.txt file with the core public pages', () => {
    const llms = readText('public/llms.txt');

    expect(llms).toContain('# WishList App');
    expect(llms).toContain('https://wishlistapp.com.ua/ua');
    expect(llms).toContain('https://wishlistapp.com.ua/en');
    expect(llms).toContain('https://wishlistapp.com.ua/en/wishlist/christmas-list');
    expect(llms).toContain('https://wishlistapp.com.ua/ua/wishlist/christmas-list-ua');
  });
});
