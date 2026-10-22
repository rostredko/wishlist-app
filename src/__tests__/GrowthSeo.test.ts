import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';
import { buildRoutes, renderPage, renderUnlistedShell } from '../../scripts/prerender';
import { renderArticleHtml, toSemanticHtml } from '../prerender/renderArticleHtml';
import { resolveBlogAlternates } from '@constants/blogArticles';
import { DEMO_WISHLISTS, EXAMPLE_SEO } from '@constants/exampleWishlists';
import home from '../locales/ua/home.json';
import enHome from '../locales/en/home.json';

const read = (file: string) => readFileSync(resolve(file), 'utf8');
const parse = (html: string) => new DOMParser().parseFromString(html, 'text/html');
const bodyOf = (page: string) => page.slice(page.indexOf('<body'));
const noscriptOf = (page: string) => bodyOf(page).match(/<noscript>([\s\S]*?)<\/noscript>/)?.[1] ?? '';
const textOf = (fragment: string) => (parse(fragment).body.textContent ?? '').replace(/\s+/g, ' ').trim();
// Same view as a non-JS AI crawler: raw body HTML with scripts and styles stripped.
const crawlerWords = (page: string) => textOf(bodyOf(page).replace(/<(script|style)[\s\S]*?<\/\1>/g, ' '))
  .split(' ').filter(word => /[\p{L}\p{N}]/u.test(word)).length;

const UA_DEFINITION = 'Вішліст (від англ. wishlist; ще пишуть «вишлист», «вішлист», «віш лист» або «віш ліст») - '
  + 'це список бажань, або список побажань: подарунки з посиланнями на магазини, якими ви ділитеся одним посиланням.';

describe('growth SEO policy', () => {
  let routes: ReturnType<typeof buildRoutes>;
  const page = (path: string) => {
    const route = routes.find(r => r.path === path);
    if (!route) throw new Error(`No prerender route for ${path}`);
    return renderPage(read('index.html'), route);
  };

  beforeAll(() => {
    routes = buildRoutes(resolve('.'), renderArticleHtml);
  });

  it('only connects equivalent articles as language alternates', () => {
    for (const slug of ['amazon-wishlist-alternatives', 'wishlist-vs-gift-registry', 'best-secret-santa-apps']) {
      expect(resolveBlogAlternates('https://wishlistapp.com.ua', 'en', slug)).toBeUndefined();
    }
    expect(resolveBlogAlternates('https://wishlistapp.com.ua', 'en', 'how-to-create-a-wishlist')?.uk).toContain('yak-zrobyty-vishlist');
  });
  it('keeps "онлайн" in the /ua title and "вішліст" in its description, mirrored in the source shell', () => {
    const doc = parse(read('index.html'));
    expect(home.title).toBe('Створити вішліст онлайн безкоштовно | WishList App');
    expect(home.desc).toContain('вішліст');
    expect(home.desc).toContain('онлайн');
    expect(doc.title).toBe(home.title);
    expect(doc.querySelector('meta[property="og:title"]')?.getAttribute('content')).toBe(home.title);
    expect(doc.querySelector('meta[name="twitter:title"]')?.getAttribute('content')).toBe(home.title);
    for (const selector of ['meta[name="description"]', 'meta[property="og:description"]', 'meta[name="twitter:description"]']) {
      expect(doc.querySelector(selector)?.getAttribute('content')).toBe(home.desc);
    }
  });
  it('opens the /ua FAQ with a definition that carries the spellings people search', () => {
    expect(home.faq[0].q).toBe('Що таке вішліст?');
    expect(home.faq[0].a.startsWith(UA_DEFINITION)).toBe(true);
  });
  it('reuses the FAQ definition in the UA how-to article', () => {
    expect(textOf(renderArticleHtml('ua', 'yak-zrobyty-vishlist'))).toContain(UA_DEFINITION);
  });
  it('names both holidays and both Secret Santa names on the UA seasonal examples', () => {
    expect(DEMO_WISHLISTS['christmas-list-ua'].title).toBe('Вішліст на Новий рік та Різдво');
    expect(parse(page('/ua/wishlist/christmas-list-ua')).querySelector('h1')?.textContent).toBe('Вішліст на Новий рік та Різдво');
    expect(EXAMPLE_SEO['secret-santa-list-ua'].description).toBe(
      'Перегляньте приклад вішліста для Таємного Санти (Таємного Миколая). Зробіть свій список подарунків безкоштовно.',
    );
  });
  it('does not mask unknown paths with a catch-all successful response', () => {
    const config = JSON.parse(read('firebase.json'));
    expect(config.hosting.rewrites.some((r: { source: string }) => r.source === '**')).toBe(false);
    expect(config.hosting.rewrites).toContainEqual({ source: '/{ua,en}/wishlist/*', destination: '/personal-wishlist.html' });
  });
  it('prerenders all sitemap routes with matching metadata and only valid alternates', () => {
    for (const route of routes) {
      const doc = parse(renderPage(read('index.html'), route));
      expect(doc.title).toBe(route.title);
      expect(doc.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(`https://wishlistapp.com.ua${route.path}`);
      expect(doc.querySelectorAll('link[hreflang]').length).toBe(route.alternates ? 3 : 0);
      expect(doc.querySelector('meta[name="robots"]')?.getAttribute('content')).not.toContain('noindex');
    }
    expect(routes.find(route => route.path === '/ua')?.description).toBe(home.desc);
  });
  it('ships one H1 per route and a noscript note in the route language that repeats it', () => {
    expect(routes).toHaveLength(40);
    for (const route of routes) {
      const html = page(route.path);
      const body = bodyOf(html);
      const h1 = parse(html).querySelector('h1')?.textContent?.trim() ?? '';
      const note = textOf(noscriptOf(html));
      expect(body.match(/<h1[\s>]/g), route.path).toHaveLength(1);
      expect(noscriptOf(html), route.path).not.toMatch(/<h1[\s>]/);
      expect(note.startsWith(h1), route.path).toBe(true);
      expect(note.endsWith(route.lang === 'ua' ? home.noscript : enHome.noscript), route.path).toBe(true);
      if (route.lang === 'ua') expect(body, route.path).not.toContain('Free Online Wishlist Maker');
    }
  });
  it('keeps the source shell noscript Ukrainian and free of a second H1', () => {
    const note = noscriptOf(read('index.html'));
    expect(note).not.toMatch(/<h1[\s>]/);
    expect(textOf(note)).toBe(`${home.heroH1}. ${home.noscript}`);
  });
  it('prerenders the homepage FAQ as text and FAQPage JSON-LD that SEOHead later replaces', () => {
    for (const [path, locale] of [['/ua', home], ['/en', enHome]] as const) {
      const html = page(path);
      const doc = parse(html);
      const questions = [...doc.querySelectorAll('h3')].map(h => h.textContent);
      expect(questions).toEqual(locale.faq.map(item => item.q));
      for (const item of locale.faq) expect(textOf(bodyOf(html))).toContain(item.a);
      const ld = doc.head.querySelector('script[type="application/ld+json"][data-seo-head="1"][data-jsonld-id="faq"]');
      const data = JSON.parse(ld?.textContent ?? '{}');
      expect(data['@type']).toBe('FAQPage');
      expect(data.mainEntity.map((q: { name: string }) => q.name)).toEqual(locale.faq.map(item => item.q));
    }
  });
  it('prerenders full article text for every blog post, without MUI markup', () => {
    for (const route of routes.filter(r => /\/blog\/./.test(r.path))) {
      // The shortest post (the UA service comparison) is ~200 words; the old shell gave 36-48.
      expect(crawlerWords(page(route.path)), route.path).toBeGreaterThan(150);
      expect(route.heroHtml, route.path).not.toMatch(/class="Mui|css-[a-z0-9]+|<style|<svg|<button/);
    }
  });
  it('gives AI crawlers far more than the 22-48 words of the old shell', () => {
    expect(crawlerWords(page('/ua'))).toBeGreaterThan(500);
    expect(crawlerWords(page('/en'))).toBeGreaterThan(500);
  });
  it('reduces rendered MUI markup to semantic HTML', () => {
    const markup = '<style data-emotion="css 1x">.css-1x{color:red}</style><div class="MuiBox-root css-1x">'
      + '<h2 class="MuiTypography-root MuiTypography-h2 css-2y">Title</h2>'
      + '<p class="MuiTypography-root" style="color:red">Text <a class="MuiLink-root" href="/ua" target="_blank" rel="noopener">link</a></p>'
      + '<button class="MuiButton-root" type="button">Copy<svg viewBox="0 0 24 24"><path d="M0"></path></svg></button>'
      + '<ul><li class="x">One</li></ul><img src="/a.webp" alt=""/></div>';
    expect(toSemanticHtml(markup)).toBe('<h2>Title</h2>\n<p>Text <a href="/ua">link</a></p>\n<ul>\n<li>One</li>\n</ul>');
  });
  it('starts personal lists and 404 responses unlisted while preserving the app entrypoint', () => {
    for (const title of ['WishList App', home.notFound.title]) {
      const html = renderUnlistedShell(read('index.html'), '<h1>Unlisted route</h1>', title);
      const doc = parse(html);
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
