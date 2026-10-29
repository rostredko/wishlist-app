import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import type { Plugin } from 'vite';

import { BLOG_SLUG_PAIRS, resolveBlogAlternates } from '../src/constants/blogArticles';
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

type FaqItem = { q: string; a: string };

/** Returns semantic HTML for one article, rendered from its React component (see src/prerender). */
export type ArticleRenderer = (lang: RouteLang, slug: string) => string;

type PrerenderRoute = {
  path: string;
  lang: RouteLang;
  title: string;
  description: string;
  keywords?: string;
  /** Replaces the hero block between the prerender:hero markers. */
  heroHtml: string;
  /** Plain-text H1, repeated in the route's <noscript> note. */
  h1: string;
  /** Route-language sentence that follows the H1 in <noscript>. */
  noscript: string;
  /** Emitted as FAQPage JSON-LD that SEOHead takes over after hydration. */
  faq?: FaqItem[];
  /** Emitted as BreadcrumbList JSON-LD that SEOHead takes over after hydration. */
  breadcrumbs?: Breadcrumb[];
  alternates?: { en: string; uk: string };
};

type Breadcrumb = { name: string; url: string };

type ArticleSeo = {
  title: string;
  description: string;
  keywords?: string;
  h1: string;
  /** Literal name of the article's last SEOHead breadcrumb, when the component spells one out. */
  breadcrumb?: string;
};

const LINK_STYLE = 'color:#2196f3';
const NOSCRIPT_STYLE = 'padding: 0 24px; max-width: 900px; margin: 16px auto;';
const HTML_ENTITIES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', '#x27': "'", '#39': "'" };

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function unescapeHtml(s: string): string {
  return s.replace(/&(amp|lt|gt|quot|#x27|#39);/g, (entity, name: string) => HTML_ENTITIES[name] ?? entity);
}

function readFaq(locale: Record<string, unknown>, source: string): FaqItem[] {
  const faq = locale.faq;
  if (!Array.isArray(faq) || faq.length === 0
    || !faq.every((item) => typeof item?.q === 'string' && typeof item?.a === 'string')) {
    throw new Error(`[prerender] Missing or malformed "faq" in ${source}`);
  }
  return faq as FaqItem[];
}

function faqHtml(title: string, faq: FaqItem[]): string {
  return [
    `<section>\n<h2>${esc(title)}</h2>`,
    ...faq.map((item) => `<h3>${esc(item.q)}</h3>\n<p>${esc(item.a)}</p>`),
    '</section>',
  ].join('\n');
}

/** JSON that cannot close its own <script> element. */
function scriptJson(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
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
 * New articles keep metadata in blog.json under articles[English slug].
 * Legacy components retain their literal SEO props; malformed metadata fails the build.
 */
function extractArticleSeo(root: string): Map<string, ArticleSeo> {
  const result = new Map<string, ArticleSeo>();

  for (const lang of ['en', 'ua'] as const) {
    const localeSource = `src/locales/${lang}/blog.json`;
    const localizedArticles = JSON.parse(readFileSync(join(root, localeSource), 'utf-8')).articles;
    for (const pair of BLOG_SLUG_PAIRS) {
      const localized = localizedArticles?.[pair.en];
      if (!localized) continue;
      const source = `${localeSource} articles.${pair.en}`;
      result.set(`${lang}:${pair[lang]}`, {
        title: req(localized, 'title', source),
        description: req(localized, 'description', source),
        h1: req(localized, 'h1', source),
      });
    }
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

      const breadcrumbBlock = source.match(/breadcrumbs: \[([\s\S]*?)\]/)?.[1] ?? '';
      const breadcrumb = [...breadcrumbBlock.matchAll(/name: (['"])((?:(?!\1)[^\\\n])+)\1/g)].pop()?.[2];

      result.set(`${lang}:${slug}`, { title, description, keywords, h1, breadcrumb });
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

export function buildRoutes(root: string, renderArticle: ArticleRenderer): PrerenderRoute[] {
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
    const blogBreadcrumbs: Breadcrumb[] = [
      { name: req(blog, 'breadcrumbHome', `${source}/blog.json`), url: `${ORIGIN}/${lang}` },
      { name: req(blog, 'breadcrumbBlog', `${source}/blog.json`), url: `${ORIGIN}/${lang}/blog` },
    ];
    const noscript = req(home, 'noscript', `${source}/home.json`);
    const faq = readFaq(home, `${source}/home.json`);
    const heroH1 = req(home, 'heroH1', `${source}/home.json`);

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
        `<h1 class="shell-h1">${esc(heroH1)}</h1>`,
        `<p>${esc(req(home, 'heroH2', `${source}/home.json`))}</p>`,
        '<div class="shell-btn"></div>',
        faqHtml(req(home, 'faqTitle', `${source}/home.json`), faq),
      ].join('\n                '),
      h1: heroH1,
      noscript,
      faq,
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
      h1: req(privacy, 'title', `${source}/privacy.json`),
      noscript,
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
      h1: req(hub, 'h1', `${source}/blog.json hub`),
      noscript,
      breadcrumbs: blogBreadcrumbs,
      alternates: { en: `${ORIGIN}/en/blog`, uk: `${ORIGIN}/ua/blog` },
    });

    const notFoundH1 = blogRaw.notFound?.h1 as string | undefined;
    for (const pair of BLOG_SLUG_PAIRS) {
      const slug = pair[lang];
      const seo = article(articles, lang, slug);
      const body = renderArticle(lang, slug);
      const h1Html = body.match(/<h1>([\s\S]*?)<\/h1>/)?.[1];
      const h1 = h1Html === undefined ? '' : unescapeHtml(h1Html.replace(/<[^>]+>/g, '')).trim();
      if (!h1 || h1 === notFoundH1) {
        throw new Error(`[prerender] Article ${lang}/${slug} rendered without its own H1`);
      }
      routes.push({
        path: `/${lang}/blog/${slug}`,
        lang,
        title: seo.title,
        description: seo.description,
        keywords: seo.keywords,
        heroHtml: [
          `<nav><a href="/${lang}" style="${LINK_STYLE}">${esc(req(blog, 'breadcrumbHome', `${source}/blog.json`))}</a>`
          + ` &rsaquo; <a href="/${lang}/blog" style="${LINK_STYLE}">${esc(req(blog, 'breadcrumbBlog', `${source}/blog.json`))}</a></nav>`,
          body.replace('<h1>', '<h1 class="shell-h1">'),
        ].join('\n                '),
        h1,
        noscript,
        // Components that name their last crumb with an expression (t(), content.h1) use the H1.
        breadcrumbs: [...blogBreadcrumbs, { name: seo.breadcrumb ?? h1, url: `${ORIGIN}/${lang}/blog/${slug}` }],
        alternates: resolveBlogAlternates(ORIGIN, lang, slug),
      });
    }

    const backHome = req(blog, 'backHome', `${source}/blog.json`);
    const demoIntros = (JSON.parse(readFileSync(join(root, `${source}/examples.json`), 'utf-8')).intros ?? {}) as Record<string, string>;
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
          ...(demoIntros[id] ? [`<p>${esc(demoIntros[id])}</p>`] : []),
          `<p>${esc(seo.description)}</p>`,
          `<ul>\n                    ${items
            .map((item) => `<li>${esc(item.name)}</li>`)
            .join('\n                    ')}\n                </ul>`,
          `<p><a href="/${lang}" style="${LINK_STYLE}">${esc(backHome)}</a></p>`,
        ].join('\n                '),
        h1: demoTitle,
        noscript,
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

export function renderPage(template: string, route: PrerenderRoute): string {
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
    ...(route.alternates ? [
      `<link rel="alternate" hreflang="en" href="${route.alternates.en}" />`,
      `<link rel="alternate" hreflang="uk" href="${route.alternates.uk}" />`,
      `<link rel="alternate" hreflang="x-default" href="${route.alternates.uk}" />`,
    ] : []),
    // Same attributes as SEOHead's upsertJsonLd(), so hydration replaces these instead of duplicating them.
    ...(route.faq ? [
      `<script type="application/ld+json" data-seo-head="1" data-jsonld-id="faq">${scriptJson({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: route.faq.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
      })}</script>`,
    ] : []),
    ...(route.breadcrumbs ? [
      `<script type="application/ld+json" data-seo-head="1" data-jsonld-id="breadcrumbs">${scriptJson({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: route.breadcrumbs.map((crumb, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: crumb.name,
          item: crumb.url,
        })),
      })}</script>`,
    ] : []),
  ].join('\n    ');
  html = replaceOnce(html, /<\/head>/, `    ${headLinks}\n</head>`, 'head close', route.path);

  html = replaceOnce(
    html,
    /<!-- prerender:hero -->[\s\S]*?<!-- \/prerender:hero -->/,
    route.heroHtml,
    'hero markers',
    route.path,
  );

  const note = `${route.h1}${/[.!?…]$/.test(route.h1) ? '' : '.'} ${route.noscript}`;
  html = replaceOnce(
    html,
    /<!-- prerender:noscript -->[\s\S]*?<!-- \/prerender:noscript -->/,
    `<noscript>\n        <p style="${NOSCRIPT_STYLE}">${esc(note)}</p>\n    </noscript>`,
    'noscript markers',
    route.path,
  );

  return html;
}

/** Unlisted routes keep the SPA entrypoint, but never inherit homepage search markup. */
export function renderUnlistedShell(template: string, heroHtml: string, title = 'WishList App'): string {
  return template
    .replace(/<meta name="robots"[^>]*>/, '<meta name="robots" content="noindex,follow" />')
    .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, '')
    .replace(/<noscript>[\s\S]*?<\/noscript>/g, '')
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/<meta property="og:url"[^>]*>/, '')
    .replace(/<meta (?:name="(?:description|twitter:title|twitter:description)"|property="(?:og:title|og:description)")[^>]*>/g, '')
    .replace(/<!-- prerender:hero -->[\s\S]*?<!-- \/prerender:hero -->/, heroHtml);
}

/**
 * Loads the article renderer through Vite's SSR module loader, so the React
 * components (TSX, path aliases, JSON locales) run in Node without a second build.
 * Imported lazily: esbuild refuses to load under the jsdom test environment.
 */
async function withArticleRenderer<T>(root: string, run: (render: ArticleRenderer) => T): Promise<T> {
  const [{ createServer }, { default: tsconfigPaths }] = await Promise.all([import('vite'), import('vite-tsconfig-paths')]);
  const server = await createServer({
    root,
    configFile: false,
    logLevel: 'warn',
    appType: 'custom',
    server: { middlewareMode: true, hmr: false, ws: false },
    optimizeDeps: { noDiscovery: true, include: [] },
    esbuild: { jsx: 'automatic' },
    plugins: [tsconfigPaths({ root, projects: ['tsconfig.app.json'] })],
  });
  try {
    const mod = await server.ssrLoadModule('/src/prerender/renderArticleHtml.tsx');
    return run(mod.renderArticleHtml as ArticleRenderer);
  } finally {
    await server.close();
  }
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
    async closeBundle() {
      const distDir = resolve(root, outDir);
      const template = readFileSync(join(distDir, 'index.html'), 'utf-8');
      const routes = await withArticleRenderer(root, (render) => buildRoutes(root, render));
      assertSitemapCoverage(root, routes);
      for (const route of routes) {
        const outFile = join(distDir, `${route.path.slice(1)}.html`);
        mkdirSync(dirname(outFile), { recursive: true });
        writeFileSync(outFile, renderPage(template, route));
      }
      writeFileSync(join(distDir, 'personal-wishlist.html'), renderUnlistedShell(template, '<h1 class="shell-h1">WishList App</h1>'));
      const notFound = JSON.parse(readFileSync(join(root, 'src/locales/ua/home.json'), 'utf8')).notFound;
      writeFileSync(join(distDir, '404.html'), renderUnlistedShell(template,
        `<h1 class="shell-h1">${esc(notFound.h1)}</h1><p>${esc(notFound.body)}</p><a href="/ua">${esc(notFound.backHome)}</a>`,
        notFound.title));
      this.info(`prerendered ${routes.length} routes into ${outDir}/`);
    },
  };
}
