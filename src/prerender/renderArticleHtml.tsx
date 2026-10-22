import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import '../i18n';
import BlogArticlePage from '@components/blog/BlogArticlePage';
import type { BlogRouteLang } from '@constants/blogArticles';

/**
 * Build-time only (loaded by scripts/prerender.ts, never bundled into the app).
 * Renders a blog article with the same components the SPA uses, so the static
 * HTML that non-JS crawlers read carries the article text, not just its H1.
 */

const KEPT_TAGS = new Set([
  'h1', 'h2', 'h3', 'h4', 'p', 'ul', 'ol', 'li', 'blockquote',
  'table', 'thead', 'tbody', 'tr', 'th', 'td', 'a', 'strong', 'em', 'code', 'br',
]);
const BLOCK_TAGS = new Set(['h1', 'h2', 'h3', 'h4', 'p', 'ul', 'ol', 'li', 'blockquote', 'table', 'thead', 'tbody', 'tr']);
const UNWRAPPED_BLOCKS = /^(div|section|article|nav|header|footer|main|aside|figure|figcaption|h5|h6|dl|dt|dd)$/;
const DROPPED_ELEMENTS = /<(style|script|svg|button|textarea|select)\b[^>]*>[\s\S]*?<\/\1>/g;

/** Reduces MUI/emotion markup to plain semantic HTML: no classes, styles, icons or controls. */
export function toSemanticHtml(markup: string): string {
  return markup
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(DROPPED_ELEMENTS, '')
    .replace(/<(\/?)([a-zA-Z][a-zA-Z0-9]*)([^>]*?)\/?>/g, (_tag, slash: string, rawName: string, attrs: string) => {
      const name = rawName.toLowerCase();
      if (!KEPT_TAGS.has(name)) return UNWRAPPED_BLOCKS.test(name) ? '\n' : '';
      if (slash) return `</${name}>${BLOCK_TAGS.has(name) ? '\n' : ''}`;
      const href = name === 'a' ? attrs.match(/\shref="([^"]*)"/)?.[1] : undefined;
      const open = href ? `<a href="${href}">` : `<${name}>`;
      return BLOCK_TAGS.has(name) ? `\n${open}` : open;
    })
    .replace(/<(p|li|h[1-4]|td|th|strong|em|a)>\s*<\/\1>\n?/g, '')
    .replace(/[ \t]+/g, ' ')
    .replace(/\s*\n\s*/g, '\n')
    .trim();
}

export function renderArticleHtml(lang: BlogRouteLang, slug: string): string {
  const markup = renderToStaticMarkup(
    <MemoryRouter initialEntries={[`/${lang}/blog/${slug}`]}>
      <Routes>
        <Route path="/:lng/blog/:slug" element={<BlogArticlePage />} />
      </Routes>
    </MemoryRouter>,
  );
  return toSemanticHtml(markup);
}
