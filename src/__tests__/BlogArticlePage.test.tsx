import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect, afterEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import '../../src/i18n';
import BlogArticlePage from '@components/blog/BlogArticlePage';
import BlogHubPage from '@components/blog/BlogHubPage';
import { BLOG_SLUG_PAIRS } from '@constants/blogArticles';
import { buildRoutes, renderPage } from '../../scripts/prerender';
import { renderArticleHtml } from '../prerender/renderArticleHtml';

describe('BlogArticlePage', () => {
  afterEach(() => {
    document.head.innerHTML = '';
    document.documentElement.lang = 'en';
  });

  it('renders the how-to-create-a-wishlist article for both languages', async () => {
    const { unmount } = render(
      <MemoryRouter initialEntries={['/en/blog/how-to-create-a-wishlist']}>
        <Routes>
          <Route path="/:lng/blog/:slug" element={<BlogArticlePage />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(
      await screen.findByRole('heading', { name: /How to create a wishlist/i, level: 1 }),
    ).toBeInTheDocument();
    unmount();

    render(
      <MemoryRouter initialEntries={['/ua/blog/yak-zrobyty-vishlist']}>
        <Routes>
          <Route path="/:lng/blog/:slug" element={<BlogArticlePage />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(
      await screen.findByRole('heading', { name: /Як зробити вішліст/i, level: 1 }),
    ).toBeInTheDocument();
  });

  it('renders not found and noindex for an unknown slug', async () => {
    render(
      <MemoryRouter initialEntries={['/en/blog/unknown-slug']}>
        <Routes>
          <Route path="/:lng/blog/:slug" element={<BlogArticlePage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByRole('heading', { name: /Post not found/i })).toBeInTheDocument();

    await waitFor(() => {
      expect(document.head.querySelector('meta[name="robots"]')?.getAttribute('content')).toContain('noindex');
    });
  });
});

describe('article language equivalence', () => {
  it('keeps related topics accessible without advertising them as translations', async () => {
    render(
      <MemoryRouter initialEntries={['/ua/blog/najkrashchi-servisy-spysku-bazhan-v-ukraini']}>
        <Routes><Route path="/:lng/blog/:slug" element={<BlogArticlePage />} /></Routes>
      </MemoryRouter>,
    );
    expect(await screen.findByRole('heading', { name: /Сервіси для списку бажань в Україні/i, level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Wishpicks' })).toHaveAttribute('href', 'https://wishpicks.com/uk');
    expect(screen.getByRole('link', { name: 'Bazhannya' })).toHaveAttribute('href', 'https://bazhannya.com/');
    expect(screen.getAllByText(/2026-10-09/).length).toBeGreaterThan(0);
    await waitFor(() => expect(document.head.querySelector('link[hreflang]')).toBeNull());
  });
});

describe('blog article headings', () => {
  const articlePaths = (['ua', 'en'] as const).flatMap(lang => BLOG_SLUG_PAIRS.map(pair => `/${lang}/blog/${pair[lang]}`));
  const markupOf = (path: string) => renderToStaticMarkup(
    <MemoryRouter initialEntries={[path]}>
      <Routes><Route path="/:lng/blog/:slug" element={<BlogArticlePage />} /></Routes>
    </MemoryRouter>,
  );

  it.each(articlePaths)('%s opens with its only H1 and never skips a heading level', (path) => {
    const levels = [...markupOf(path).matchAll(/<h([1-6])\b/g)].map(match => Number(match[1]));
    expect(levels[0]).toBe(1);
    expect(levels.filter(level => level === 1)).toHaveLength(1);
    levels.forEach((level, index) => {
      if (index > 0) expect(level, `h${levels[index - 1]} -> h${level}`).toBeLessThanOrEqual(levels[index - 1] + 1);
    });
  });

  it.each(articlePaths)('%s does not use the h3/h4 variants, whose responsive theme sizes override sx fontSize', (path) => {
    // darkTheme scales h3/h4 in media queries that Emotion emits after sx, so a "18px" h3 renders at 40px on desktop.
    expect(markupOf(path)).not.toMatch(/MuiTypography-h[34]\b/);
  });
});

describe('blog breadcrumbs', () => {
  const ORIGIN = 'https://wishlistapp.com.ua';
  const template = readFileSync(resolve('index.html'), 'utf8');
  const routes = buildRoutes(resolve('.'), renderArticleHtml);
  const blogRoutes = routes.filter(route => /^\/(ua|en)\/blog(\/|$)/.test(route.path));
  const prerenderedHead = (path: string) => {
    const route = routes.find(candidate => candidate.path === path)!;
    return new DOMParser().parseFromString(renderPage(template, route), 'text/html').head;
  };
  const breadcrumbScripts = (head: HTMLHeadElement) =>
    head.querySelectorAll<HTMLScriptElement>('script[type="application/ld+json"][data-seo-head="1"][data-jsonld-id="breadcrumbs"]');

  afterEach(() => {
    document.head.innerHTML = '';
  });

  it('prerenders one BreadcrumbList on the blog hub and every article, and none elsewhere', () => {
    expect(blogRoutes.length).toBeGreaterThan(2);
    for (const route of routes) {
      const scripts = breadcrumbScripts(prerenderedHead(route.path));
      if (!blogRoutes.includes(route)) {
        expect(scripts, route.path).toHaveLength(0);
        continue;
      }
      expect(scripts, route.path).toHaveLength(1);
      const data = JSON.parse(scripts[0].textContent!);
      const items = data.itemListElement as Array<{ position: number; name: string; item: string }>;
      expect(data['@type']).toBe('BreadcrumbList');
      expect(items.map(item => item.position)).toEqual(items.map((_, index) => index + 1));
      expect(items[0].item).toBe(`${ORIGIN}/${route.lang}`);
      expect(items.at(-1)!.item).toBe(ORIGIN + route.path);
      for (const item of items) expect(item.name.trim(), route.path).not.toBe('');
    }
  });

  it.each(blogRoutes.map(route => route.path))('hydrates %s into a single BreadcrumbList identical to the prerendered one', async (path) => {
    const staticScript = breadcrumbScripts(prerenderedHead(path))[0];
    document.head.append(document.importNode(staticScript, true));

    render(
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/:lng/blog" element={<BlogHubPage />} />
          <Route path="/:lng/blog/:slug" element={<BlogArticlePage />} />
        </Routes>
      </MemoryRouter>,
    );

    // SEOHead builds URLs from window.location.origin, which differs from production under jsdom.
    await waitFor(() => expect(breadcrumbScripts(document.head)[0]?.textContent).toContain(window.location.origin));
    const scripts = breadcrumbScripts(document.head);
    expect(scripts).toHaveLength(1);
    expect(JSON.parse(scripts[0].textContent!.replaceAll(window.location.origin, ORIGIN)))
      .toEqual(JSON.parse(staticScript.textContent!));
  });
});
