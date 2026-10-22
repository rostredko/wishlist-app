import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Link, MemoryRouter, Route, Routes } from 'react-router-dom';
import '../i18n';
import BlogArticlePage from '@components/blog/BlogArticlePage';
import BlogHubPage from '@components/blog/BlogHubPage';
import { buildRoutes, renderPage } from '../../scripts/prerender';
import { renderArticleHtml } from '../prerender/renderArticleHtml';

const origin = 'https://wishlistapp.com.ua';
const cases = [
  { lang: 'ua', slug: 'yak-vybraty-podarunok-z-chatgpt', h1: 'Як вибрати подарунок з ChatGPT і не купити зайвого', title: 'Як вибрати подарунок з ChatGPT: ідеї та вішліст | WishList App' },
  { lang: 'en', slug: 'chatgpt-gift-ideas', h1: 'How to use ChatGPT for gift ideas without buying more stuff', title: 'ChatGPT Gift Ideas: From AI Suggestions to a Wishlist | WishList App' },
] as const;

afterEach(() => {
  document.head.innerHTML = '';
});

describe('AI gift article publication', () => {
  it.each(cases)('opens the $lang article from the hub with localized SEO and useful links', async ({ lang, slug, h1, title }) => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={[`/${lang}/blog`]}>
        <Routes>
          <Route path="/:lng/blog" element={<BlogHubPage />} />
          <Route path="/:lng/blog/:slug" element={<BlogArticlePage />} />
        </Routes>
      </MemoryRouter>,
    );
    await user.click(screen.getByRole('link', { name: new RegExp(h1) }));
    expect(await screen.findByRole('heading', { name: h1, level: 1 })).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('link', { name: /OpenAI/ })).toHaveAttribute('href', 'https://openai.com/index/chatgpt-shopping-research/');
    expect(screen.getByRole('link', { name: /Tom.s Guide/ })).toHaveAttribute('href', expect.stringContaining('tomsguide.com'));
    expect(document.querySelector(`a[href="/${lang}/wishlist/birthday-list${lang === 'ua' ? '-ua' : ''}"]`)).not.toBeNull();

    await waitFor(() => {
      expect(document.title).toBe(title);
      expect(document.documentElement.lang).toBe(lang === 'ua' ? 'uk' : 'en');
      expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute('href', `${window.location.origin}/${lang}/blog/${slug}`);
      expect(document.querySelector('link[hreflang="uk"]')).toHaveAttribute('href', `${window.location.origin}/ua/blog/yak-vybraty-podarunok-z-chatgpt`);
      expect(document.querySelector('link[hreflang="en"]')).toHaveAttribute('href', `${window.location.origin}/en/blog/chatgpt-gift-ideas`);
      const article = JSON.parse(document.querySelector('script[data-jsonld-id="article"]')?.textContent ?? '{}');
      expect(article).toMatchObject({ '@type': 'Article', headline: h1, datePublished: '2026-10-21', dateModified: '2026-10-21' });
    });
  });

  it('replaces article content and metadata when navigating between languages', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/en/blog/chatgpt-gift-ideas']}>
        <Link to="/ua/blog/yak-vybraty-podarunok-z-chatgpt">Switch language</Link>
        <Routes><Route path="/:lng/blog/:slug" element={<BlogArticlePage />} /></Routes>
      </MemoryRouter>,
    );
    expect(await screen.findByRole('heading', { name: cases[1].h1, level: 1 })).toBeInTheDocument();
    await user.click(screen.getByRole('link', { name: 'Switch language' }));
    expect(await screen.findByRole('heading', { name: cases[0].h1, level: 1 })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: cases[1].h1, level: 1 })).not.toBeInTheDocument();
    await waitFor(() => expect(document.title).toBe(cases[0].title));
  });

  it.each(cases)('publishes matching $lang first-response metadata, sitemap and HTML canonical', ({ lang, slug, h1, title }) => {
    const path = `/${lang}/blog/${slug}`;
    const route = buildRoutes(resolve('.'), renderArticleHtml).find(candidate => candidate.path === path);
    expect(route).toBeDefined();
    const doc = new DOMParser().parseFromString(renderPage(readFileSync('index.html', 'utf8'), route!), 'text/html');
    expect(doc.title).toBe(title);
    expect(doc.querySelector('h1')?.textContent).toBe(h1);
    expect(doc.querySelector('meta[property="og:title"]')?.getAttribute('content')).toBe(title);
    expect(doc.querySelector('meta[name="twitter:title"]')?.getAttribute('content')).toBe(title);
    expect(doc.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(origin + path);
    expect(doc.querySelectorAll('link[rel="canonical"]')).toHaveLength(1);
    expect(doc.querySelector('link[hreflang="uk"]')?.getAttribute('href')).toBe(`${origin}/ua/blog/yak-vybraty-podarunok-z-chatgpt`);
    expect(doc.querySelector('meta[name="robots"]')?.getAttribute('content')).not.toContain('noindex');
    const sitemap = new DOMParser().parseFromString(readFileSync('public/sitemap.xml', 'utf8'), 'application/xml');
    const entry = [...sitemap.querySelectorAll('url')].find(url => url.querySelector('loc')?.textContent === origin + path);
    expect(entry?.querySelector('lastmod')?.textContent).toBe('2026-10-21');
  });

  it('fails the build when localized article metadata is incomplete', () => {
    const root = mkdtempSync(join(tmpdir(), 'wishlist-blog-metadata-'));
    try {
      for (const lang of ['en', 'ua']) {
        mkdirSync(join(root, 'src/Components/blog/articles', lang), { recursive: true });
        mkdirSync(join(root, 'src/locales', lang), { recursive: true });
        writeFileSync(join(root, 'src/locales', lang, 'blog.json'), JSON.stringify({ articles: { 'chatgpt-gift-ideas': { title: 'Title', h1: 'Heading' } } }));
      }
      expect(() => buildRoutes(root, renderArticleHtml)).toThrow(/Missing "description"/);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
