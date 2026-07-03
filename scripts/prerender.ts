import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import type { Plugin } from 'vite';

import { BLOG_SLUG_PAIRS } from '../src/constants/blogArticles';
import {
  DEMO_ITEMS,
  DEMO_WISHLISTS,
  EXAMPLE_SEO,
  EXAMPLE_WISHLIST_ALTERNATES,
} from '../src/constants/exampleWishlists';

/**
 * Build-time prerender for all indexable routes (everything in public/sitemap.xml).
 *
 * Why: the SPA serves byte-identical index.html for every URL, so Google's
 * duplicate detection collapsed all pages into one canonical (the homepage)
 * before JS ever ran - GSC reported "Duplicate, Google chose different
 * canonical than user" and de-indexed nearly the whole site. Each route needs
 * unique title/description/canonical/hreflang/H1 in the first HTTP response.
 *
 * Output: dist/<path>.html per route (Firebase Hosting cleanUrls serves
 * /ua/blog/x from ua/blog/x.html, and static files win over the SPA rewrite).
 * SEOHead takes over after hydration and re-applies the same values.
 */

const ORIGIN = 'https://wishlistapp.com.ua';

type RouteLang = 'ua' | 'en';

type PrerenderRoute = {
  path: string;
  lang: RouteLang;
  title: string;
  description: string;
  keywords?: string;
  /** Replaces the hero block between the prerender:hero markers. */
  heroHtml: string;
  alternates: { en: string; uk: string };
};

type ArticleSeo = {
  title: string;
  description: string;
  keywords?: string;
  h1: string;
};

const LINK_STYLE = 'color:#2196f3';

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function readJson(root: string, rel: string): Record<string, string> {
  return JSON.parse(readFileSync(join(root, rel), 'utf-8'));
}

function req(obj: Record<string, string>, key: string, source: string): string {
  const value = obj[key];
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`[prerender] Missing "${key}" in ${source}`);
  }
  return value;
}

/**
 * Pulls SEO title/description/keywords and the H1 out of each blog article
 * component. Articles keep these as single-line string props on SEOHead;
 * if that shape changes, this throws and the build fails loudly.
 */
function extractArticleSeo(root: string): Map<string, ArticleSeo> {
  const result = new Map<string, ArticleSeo>();

  for (const lang of ['en', 'ua'] as const) {
    const dir = join(root, 'src/Components/blog/articles', lang);
    for (const file of readdirSync(dir).filter((f) => f.endsWith('.tsx'))) {
      const source = readFileSync(join(dir, file), 'utf-8');
      const at = `${lang}/${file}`;

      const slug = source.match(/const SLUG = '([^']+)'/)?.[1];
      const title = source.match(/^\s*title="([^"]+)"$/m)?.[1];
      const description = source.match(/^\s*description="([^"]+)"$/m)?.[1];
      const keywords = source.match(/^\s*keywords="([^"]+)"$/m)?.[1];
      if (!slug || !title || !description) {
        throw new Error(`[prerender] Could not extract SLUG/title/description from ${at}`);
      }

      const h1Raw = source
        .match(/variant="h1"[^>]*>\s*([\s\S]*?)<\/Typography>/)?.[1]
        ?.replace(/\s+/g, ' ')
        .trim();
      // JSX text may contain markup or expressions; fall back to the SEO title.
      const h1 = h1Raw && !/[<{]/.test(h1Raw) ? h1Raw : title.split(' | ')[0];

      result.set(`${lang}:${slug}`, { title, description, keywords, h1 });
    }
  }

  return result;
}

function article(map: Map<string, ArticleSeo>, lang: RouteLang, slug: string): ArticleSeo {
  const seo = map.get(`${lang}:${slug}`);
  if (!seo) {
    throw new Error(`[prerender] No article component found for ${lang}/${slug} (check BLOG_SLUG_PAIRS)`);
  }
  return seo;
}

function buildRoutes(root: string): PrerenderRoute[] {
  const routes: PrerenderRoute[] = [];
  const articles = extractArticleSeo(root);

  const locale = (lang: RouteLang, file: string) => readJson(root, `src/locales/${lang}/${file}`);

  for (const lang of ['ua', 'en'] as const) {
    const home = locale(lang, 'home.json');
    const privacy = locale(lang, 'privacy.json');
    const blogRaw = JSON.parse(readFileSync(join(root, `src/locales/${lang}/blog.json`), 'utf-8'));
    const blog = blogRaw as Record<string, string>;
    const hub = blogRaw.hub as Record<string, string>;

    const homeAlternates = { en: `${ORIGIN}/en`, uk: `${ORIGIN}/ua` };
    const source = `src/locales/${lang}`;

    routes.push({
      path: `/${lang}`,
      lang,
      title: req(home, 'title', `${source}/home.json`),
      description: req(home, 'desc', `${source}/home.json`),
      // Keep the static UA keywords on the UA homepage only.
      keywords: lang === 'ua'
        ? 'вішліст, список бажань, подарунки, день народження, різдво, весілля, безкоштовно, створити вішліст, поділитися вішлістом'
        : undefined,
      heroHtml: [
        `<h1 class="shell-h1">${esc(req(home, 'heroH1', `${source}/home.json`))}</h1>`,
        `<p>${esc(req(home, 'heroH2', `${source}/home.json`))}</p>`,
        '<div class="shell-btn"></div>',
      ].join('\n                '),
      alternates: homeAlternates,
    });

    routes.push({
      path: `/${lang}/privacy`,
      lang,
      title: req(privacy, 'title', `${source}/privacy.json`),
      description: req(privacy, 'intro', `${source}/privacy.json`),
      heroHtml: [
        `<h1 class="shell-h1">${esc(req(privacy, 'title', `${source}/privacy.json`))}</h1>`,
        `<p>${esc(req(privacy, 'intro', `${source}/privacy.json`))}</p>`,
        `<p><a href="/${lang}" style="${LINK_STYLE}">${esc(req(blog, 'backHome', `${source}/blog.json`))}</a></p>`,
      ].join('\n                '),
      alternates: { en: `${ORIGIN}/en/privacy`, uk: `${ORIGIN}/ua/privacy` },
    });

    const hubLinks = BLOG_SLUG_PAIRS.map((pair) => {
      const slug = pair[lang];
      const seo = article(articles, lang, slug);
      return `<li><a href="/${lang}/blog/${slug}" style="${LINK_STYLE}">${seo.h1}</a></li>`;
    }).join('\n                    ');

    routes.push({
      path: `/${lang}/blog`,
      lang,
      title: req(hub, 'title', `${source}/blog.json hub`),
      description: req(hub, 'description', `${source}/blog.json hub`),
      heroHtml: [
        `<h1 class="shell-h1">${esc(req(hub, 'h1', `${source}/blog.json hub`))}</h1>`,
        `<p>${esc(req(hub, 'description', `${source}/blog.json hub`))}</p>`,
        `<ul>\n                    ${hubLinks}\n                </ul>`,
      ].join('\n                '),
      alternates: { en: `${ORIGIN}/en/blog`, uk: `${ORIGIN}/ua/blog` },
    });

    for (const pair of BLOG_SLUG_PAIRS) {
      const slug = pair[lang];
      const seo = article(articles, lang, slug);
      routes.push({
        path: `/${lang}/blog/${slug}`,
        lang,
        title: seo.title,
        description: seo.description,
        keywords: seo.keywords,
        heroHtml: [
          `<nav><a href="/${lang}" style="${LINK_STYLE}">${esc(req(blog, 'breadcrumbHome', `${source}/blog.json`))}</a>`
          + ` &rsaquo; <a href="/${lang}/blog" style="${LINK_STYLE}">${esc(req(blog, 'breadcrumbBlog', `${source}/blog.json`))}</a></nav>`,
          `<h1 class="shell-h1">${seo.h1}</h1>`,
          `<p>${esc(seo.description)}</p>`,
        ].join('\n                '),
        alternates: {
          en: `${ORIGIN}/en/blog/${pair.en}`,
          uk: `${ORIGIN}/ua/blog/${pair.ua}`,
        },
      });
    }

    const backHome = req(blog, 'backHome', `${source}/blog.json`);
    const demoIds = Object.keys(EXAMPLE_SEO).filter((id) =>
      lang === 'ua' ? id.endsWith('-ua') : !id.endsWith('-ua'),
    );
    for (const id of demoIds) {
      const seo = EXAMPLE_SEO[id];
      const demoTitle = DEMO_WISHLISTS[id]?.title;
      const items = DEMO_ITEMS[id];
      const alt = EXAMPLE_WISHLIST_ALTERNATES[id];
      if (!demoTitle || !items?.length || !alt) {
        throw new Error(`[prerender] Incomplete demo wishlist data for "${id}"`);
      }
      routes.push({
        path: `/${lang}/wishlist/${id}`,
        lang,
        title: seo.title,
        description: seo.description,
        heroHtml: [
          `<h1 class="shell-h1">${esc(demoTitle)}</h1>`,
          `<p>${esc(seo.description)}</p>`,
          `<ul>\n                    ${items
            .map((item) => `<li>${esc(item.name)}</li>`)
            .join('\n                    ')}\n                </ul>`,
          `<p><a href="/${lang}" style="${LINK_STYLE}">${esc(backHome)}</a></p>`,
        ].join('\n                '),
        alternates: {
          en: `${ORIGIN}/en/wishlist/${alt.en}`,
          uk: `${ORIGIN}/ua/wishlist/${alt.uk}`,
        },
      });
    }
  }

  return routes;
}

/** Every sitemap URL must have a prerendered route, and vice versa. */
function assertSitemapCoverage(root: string, routes: PrerenderRoute[]): void {
  const sitemap = readFileSync(join(root, 'public/sitemap.xml'), 'utf-8');
  const sitemapUrls = new Set(
    [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]),
  );
  const routeUrls = new Set(routes.map((r) => ORIGIN + r.path));

  const missing = [...sitemapUrls].filter((u) => !routeUrls.has(u));
  const extra = [...routeUrls].filter((u) => !sitemapUrls.has(u));
  if (missing.length || extra.length) {
    throw new Error(
      `[prerender] Sitemap/routes mismatch. Missing prerender: ${missing.join(', ') || 'none'}. `
      + `Not in sitemap: ${extra.join(', ') || 'none'}.`,
    );
  }
}

function replaceOnce(html: string, pattern: RegExp, replacement: string, what: string, path: string): string {
  if (!pattern.test(html)) {
    throw new Error(`[prerender] ${what} not found in template for ${path}`);
  }
  return html.replace(pattern, () => replacement);
}

function renderPage(template: string, route: PrerenderRoute): string {
  const url = ORIGIN + route.path;
  const htmlLang = route.lang === 'ua' ? 'uk' : 'en';
  const ogLocale = route.lang === 'ua' ? 'uk_UA' : 'en_US';
  const ogLocaleAlt = route.lang === 'ua' ? 'en_US' : 'uk_UA';
  let html = template;

  html = replaceOnce(html, /<html lang="[^"]*">/, `<html lang="${htmlLang}">`, 'html lang', route.path);
  html = replaceOnce(html, /<title>[\s\S]*?<\/title>/, `<title>${esc(route.title)}</title>`, 'title', route.path);
  html = replaceOnce(
    html,
    /<meta name="description"[\s\S]*?\/>/,
    `<meta name="description" content="${esc(route.description)}" />`,
    'meta description',
    route.path,
  );
  html = replaceOnce(
    html,
    /\s*<meta name="keywords"[\s\S]*?\/>/,
    route.keywords ? `\n    <meta name="keywords" content="${esc(route.keywords)}" />` : '',
    'meta keywords',
    route.path,
  );

  html = replaceOnce(html, /<meta property="og:url"[\s\S]*?\/>/, `<meta property="og:url" content="${url}" />`, 'og:url', route.path);
  html = replaceOnce(html, /<meta property="og:title"[\s\S]*?\/>/, `<meta property="og:title" content="${esc(route.title)}" />`, 'og:title', route.path);
  html = replaceOnce(
    html,
    /<meta property="og:description"[\s\S]*?\/>/,
    `<meta property="og:description" content="${esc(route.description)}" />`,
    'og:description',
    route.path,
  );
  html = replaceOnce(html, /<meta property="og:locale"[\s\S]*?\/>/, `<meta property="og:locale" content="${ogLocale}" />`, 'og:locale', route.path);
  html = replaceOnce(
    html,
    /<meta property="og:locale:alternate"[\s\S]*?\/>/,
    `<meta property="og:locale:alternate" content="${ogLocaleAlt}" />`,
    'og:locale:alternate',
    route.path,
  );
  html = replaceOnce(html, /<meta name="twitter:title"[\s\S]*?\/>/, `<meta name="twitter:title" content="${esc(route.title)}" />`, 'twitter:title', route.path);
  html = replaceOnce(
    html,
    /<meta name="twitter:description"[\s\S]*?\/>/,
    `<meta name="twitter:description" content="${esc(route.description)}" />`,
    'twitter:description',
    route.path,
  );

  const headLinks = [
    `<link rel="canonical" href="${url}" />`,
    `<link rel="alternate" hreflang="en" href="${route.alternates.en}" />`,
    `<link rel="alternate" hreflang="uk" href="${route.alternates.uk}" />`,
    `<link rel="alternate" hreflang="x-default" href="${route.alternates.uk}" />`,
  ].join('\n    ');
  html = replaceOnce(html, /<\/head>/, `    ${headLinks}\n</head>`, 'head close', route.path);

  html = replaceOnce(
    html,
    /<!-- prerender:hero -->[\s\S]*?<!-- \/prerender:hero -->/,
    route.heroHtml,
    'hero markers',
    route.path,
  );

  return html;
}

export function prerender(): Plugin {
  let root = '';
  let outDir = 'dist';
  return {
    name: 'wishlist-prerender',
    apply: 'build',
    configResolved(config) {
      root = config.root;
      outDir = config.build.outDir;
    },
    closeBundle() {
      const distDir = resolve(root, outDir);
      const template = readFileSync(join(distDir, 'index.html'), 'utf-8');
      const routes = buildRoutes(root);
      assertSitemapCoverage(root, routes);
      for (const route of routes) {
        const outFile = join(distDir, `${route.path.slice(1)}.html`);
        mkdirSync(dirname(outFile), { recursive: true });
        writeFileSync(outFile, renderPage(template, route));
      }
      this.info(`prerendered ${routes.length} routes into ${outDir}/`);
    },
  };
}
