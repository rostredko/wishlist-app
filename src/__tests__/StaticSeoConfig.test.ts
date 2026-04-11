import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

function readText(relativePath: string): string {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

describe('static SEO config', () => {
  it('declares slashless hreflang links in the HTML shell', () => {
    const html = readText('index.html');
    const doc = new DOMParser().parseFromString(html, 'text/html');

    expect(doc.querySelector('link[rel="alternate"][hreflang="uk"]')?.getAttribute('href'))
      .toBe('https://wishlistapp.com.ua/ua');
    expect(doc.querySelector('link[rel="alternate"][hreflang="en"]')?.getAttribute('href'))
      .toBe('https://wishlistapp.com.ua/en');
    expect(doc.querySelector('link[rel="alternate"][hreflang="x-default"]')?.getAttribute('href'))
      .toBe('https://wishlistapp.com.ua/ua');
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
