import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import '../i18n';
import BlogArticlePage from '@components/blog/BlogArticlePage';
import { BLOG_SLUG_PAIRS } from '@constants/blogArticles';
import { DEMO_ITEMS, DEMO_WISHLISTS, EXAMPLE_SEO, EXAMPLE_WISHLIST_ALTERNATES } from '@constants/exampleWishlists';
import { buildRoutes, renderPage } from '../../scripts/prerender';
import { renderArticleHtml } from '../prerender/renderArticleHtml';
import enBlog from '../locales/en/blog.json';
import uaBlog from '../locales/ua/blog.json';
import enExamples from '../locales/en/examples.json';
import uaExamples from '../locales/ua/examples.json';

const ORIGIN = 'https://wishlistapp.com.ua';
const read = (file: string) => readFileSync(resolve(file), 'utf8');
const parse = (html: string) => new DOMParser().parseFromString(html, 'text/html');
const wordsIn = (html: string) => (parse(html).body.textContent ?? '').replace(/\s+/g, ' ').split(' ')
  .filter(word => /[\p{L}\p{N}]/u.test(word)).length;

const ARTICLES = [
  {
    lang: 'ua', slug: 'vishlist-na-novyj-rik-i-rizdvo', counterpart: '/en/blog/christmas-wishlist', minWords: 1500, howTo: true,
    title: 'Вішліст на Новий рік 2027 і Різдво: як скласти і поділитися з рідними',
    description: 'Як зробити вішліст на Новий рік і Різдво: що додати, як поділитися одним посиланням і уникнути однакових подарунків. Безкоштовно, без реклами.',
    h1: 'Вішліст на Новий рік і Різдво: як скласти і поділитися з рідними',
    demo: '/ua/wishlist/christmas-list-ua',
  },
  {
    lang: 'en', slug: 'christmas-wishlist', counterpart: '/ua/blog/vishlist-na-novyj-rik-i-rizdvo', minWords: 1500, howTo: true,
    title: 'How to Make a Christmas Wish List (and Share It With Family) in 2026',
    description: 'Make a Christmas wish list in 5 minutes: what to add, how to share one link with family, and how guests claim gifts so nobody buys duplicates. Free, no ads.',
    h1: 'How to make a Christmas wish list and share it with family',
    demo: '/en/wishlist/christmas-list',
  },
  {
    lang: 'ua', slug: 'lyst-svyatomu-mykolayu', counterpart: '/en/blog/kids-christmas-list', minWords: 1200, howTo: true,
    title: 'Лист Святому Миколаю: як допомогти дитині скласти список бажань (+ зразок)',
    description: 'Як написати лист Святому Миколаю разом із дитиною: зразок листа, ідеї за віком і як поділитися списком з бабусею та хрещеними.',
    h1: 'Лист Святому Миколаю: як допомогти дитині скласти список бажань',
    demo: '/ua/wishlist/st-nicholas-list-ua',
  },
  {
    lang: 'en', slug: 'kids-christmas-list', counterpart: '/ua/blog/lyst-svyatomu-mykolayu', minWords: 1200, howTo: true,
    title: "Kids' Christmas List: From a Letter to Santa to a Shareable Wishlist",
    description: 'Help your child write a letter to Santa, turn it into a shareable wishlist, and let grandparents claim gifts without duplicates. Free template inside.',
    h1: "Kids' Christmas list: from a letter to Santa to a shareable wishlist",
    demo: '/en/wishlist/kids-christmas-list',
  },
  {
    lang: 'ua', slug: 'tayemnyj-santa-pravyla', counterpart: undefined, minWords: 1100, howTo: true,
    title: 'Таємний Санта: правила, бюджет, жеребкування і вішліст для кожного',
    description: 'Як організувати Таємного Санту на роботі, з друзями чи онлайн: правила, бюджет, жеребкування і вішліст, щоб подарунок точно сподобався.',
    h1: 'Таємний Санта: правила, бюджет, жеребкування і вішліст',
    demo: '/ua/wishlist/secret-santa-list-ua',
  },
  {
    lang: 'en', slug: 'secret-santa-questionnaire', counterpart: undefined, minWords: 1100, howTo: false,
    title: 'Secret Santa Questionnaire: 20 Questions and a Wishlist Template',
    description: 'Copy a 20-question Secret Santa questionnaire, turn the answers into a short wishlist, and share it with your giver. Works for office and family exchanges.',
    h1: 'Secret Santa questionnaire: 20 questions and a wishlist template',
    demo: '/en/wishlist/secret-santa-list',
  },
  {
    lang: 'ua', slug: 'shcho-poprosyty-na-novyj-rik', counterpart: '/en/blog/what-to-put-on-christmas-list', minWords: 2000, howTo: false,
    title: 'Що попросити на Новий рік: 70 ідей для вішліста за бюджетом',
    description: 'Не знаєте, що додати у вішліст? 70 ідей на Новий рік і Різдво: до 500, 1000 і 3000 грн, враження, корисні речі і донати.',
    h1: 'Що попросити на Новий рік і Різдво: 70 ідей для вішліста',
    demo: '/ua/wishlist/christmas-list-ua',
  },
  {
    lang: 'en', slug: 'what-to-put-on-christmas-list', counterpart: '/ua/blog/shcho-poprosyty-na-novyj-rik', minWords: 2000, howTo: false,
    title: 'What to Put on Your Christmas List: 70 Ideas by Budget',
    description: 'Stuck on your Christmas list? 70 ideas by budget - under 25, 50 and 100 EUR/USD - plus experiences and practical gifts, ready to add to a shareable wishlist.',
    h1: 'What to put on your Christmas list: 70 ideas by budget',
    demo: '/en/wishlist/christmas-list',
  },
] as const;

const IDEA_ARTICLES = ARTICLES.filter(({ slug }) => slug === 'shcho-poprosyty-na-novyj-rik' || slug === 'what-to-put-on-christmas-list');

const HOLIDAY_DEMOS = ['christmas-list', 'christmas-list-ua', 'secret-santa-list', 'secret-santa-list-ua', 'kids-christmas-list', 'st-nicholas-list-ua'];

afterEach(() => {
  document.head.innerHTML = '';
});

describe('holiday blog registration', () => {
  it('lists the three holiday pairs first, with hreflang only for the equivalent ones', () => {
    expect(BLOG_SLUG_PAIRS.slice(0, 3)).toEqual([
      { en: 'christmas-wishlist', ua: 'vishlist-na-novyj-rik-i-rizdvo' },
      { en: 'kids-christmas-list', ua: 'lyst-svyatomu-mykolayu' },
      { en: 'secret-santa-questionnaire', ua: 'tayemnyj-santa-pravyla', equivalent: false },
    ]);
  });

  it('lists the budget ideas pair right after them, as hreflang equivalents', () => {
    expect(BLOG_SLUG_PAIRS[3]).toEqual({ en: 'what-to-put-on-christmas-list', ua: 'shcho-poprosyty-na-novyj-rik' });
  });

  it('has hub cards in both locales for every new pair', () => {
    for (const cards of [enBlog.cards, uaBlog.cards] as Record<string, { title: string; desc: string; read: string }>[]) {
      for (const pair of BLOG_SLUG_PAIRS.slice(0, 4)) {
        expect(cards[pair.en]?.title, pair.en).toBeTruthy();
        expect(cards[pair.en]?.desc, pair.en).toBeTruthy();
        expect(cards[pair.en]?.read, pair.en).toBeTruthy();
      }
    }
  });
});

describe('holiday articles in the first HTTP response', () => {
  let routes: ReturnType<typeof buildRoutes>;
  beforeAll(() => {
    routes = buildRoutes(resolve('.'), renderArticleHtml);
  });

  it.each(ARTICLES)('prerenders /$lang/blog/$slug with its own metadata, H1 and full text', ({ lang, slug, title, description, h1, counterpart, minWords, demo }) => {
    const path = `/${lang}/blog/${slug}`;
    const route = routes.find(candidate => candidate.path === path);
    expect(route).toBeDefined();
    const doc = parse(renderPage(read('index.html'), route!));

    expect(doc.title).toBe(title);
    expect(doc.querySelector('meta[name="description"]')?.getAttribute('content')).toBe(description);
    expect(doc.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(ORIGIN + path);
    expect(doc.querySelectorAll('h1')).toHaveLength(1);
    expect(doc.querySelector('h1')?.textContent).toBe(h1);
    expect(routes.filter(other => other.title === title)).toHaveLength(1);
    expect(routes.filter(other => other.description === description)).toHaveLength(1);

    if (counterpart) {
      expect(doc.querySelectorAll('link[hreflang]')).toHaveLength(3);
      expect(doc.querySelector(`link[hreflang="${lang === 'ua' ? 'en' : 'uk'}"]`)?.getAttribute('href')).toBe(ORIGIN + counterpart);
    } else {
      expect(doc.querySelectorAll('link[hreflang]')).toHaveLength(0);
    }

    expect(wordsIn(route!.heroHtml)).toBeGreaterThanOrEqual(minWords);
    expect(route!.heroHtml).toContain(`href="${demo}"`);
    expect(route!.heroHtml).toContain(`href="/${lang}"`);
  });

  it('keeps the new article copy free of em dashes', () => {
    for (const { lang, slug } of ARTICLES) expect(renderArticleHtml(lang, slug), slug).not.toContain('\u2014');
  });

  it('links the budget ideas article from the "what to add" section of both pillars', () => {
    const section = (lang: 'ua' | 'en', slug: string, h2: string) => {
      const html = renderArticleHtml(lang, slug);
      return html.slice(html.indexOf(`<h2>${h2}</h2>`), html.indexOf('<h2>', html.indexOf(`<h2>${h2}</h2>`) + 1));
    };
    expect(section('ua', 'vishlist-na-novyj-rik-i-rizdvo', 'Що додати у вішліст на Новий рік?')).toContain('href="/ua/blog/shcho-poprosyty-na-novyj-rik"');
    expect(section('en', 'christmas-wishlist', 'What should you put on a Christmas list?')).toContain('href="/en/blog/what-to-put-on-christmas-list"');
  });
});

describe('holiday article structured data', () => {
  it.each(ARTICLES)('emits Article, FAQ and breadcrumb JSON-LD for /$lang/blog/$slug', async ({ lang, slug, h1, howTo }) => {
    render(
      <MemoryRouter initialEntries={[`/${lang}/blog/${slug}`]}>
        <Routes><Route path="/:lng/blog/:slug" element={<BlogArticlePage />} /></Routes>
      </MemoryRouter>,
    );
    expect(await screen.findByRole('heading', { name: h1, level: 1 })).toBeInTheDocument();
    const visibleQuestions = screen.getAllByRole('heading', { level: 3 }).map(heading => heading.textContent?.trim());

    await waitFor(() => {
      const article = JSON.parse(document.querySelector('script[data-jsonld-id="article"]')?.textContent ?? '{}');
      expect(article).toMatchObject({ '@type': 'Article', headline: h1, datePublished: '2026-10-22', dateModified: '2026-10-22' });
    });
    const faq = JSON.parse(document.querySelector('script[data-jsonld-id="faq"]')?.textContent ?? '{}');
    expect(faq['@type']).toBe('FAQPage');
    expect(faq.mainEntity.length).toBeGreaterThanOrEqual(4);
    for (const question of faq.mainEntity) expect(visibleQuestions).toContain(question.name);
    expect(document.querySelector('script[data-jsonld-id="breadcrumbs"]')).not.toBeNull();
    expect(Boolean(document.querySelector('script[data-jsonld-id="howto"]'))).toBe(howTo);
  });
});

describe('budget ideas articles', () => {
  it.each(IDEA_ARTICLES)('numbers exactly 70 ideas on /$lang/blog/$slug and lists each with its anchor in ItemList JSON-LD', async ({ lang, slug, h1 }) => {
    render(
      <MemoryRouter initialEntries={[`/${lang}/blog/${slug}`]}>
        <Routes><Route path="/:lng/blog/:slug" element={<BlogArticlePage />} /></Routes>
      </MemoryRouter>,
    );
    expect(await screen.findByRole('heading', { name: h1, level: 1 })).toBeInTheDocument();
    const ideas = [...document.querySelectorAll('li[id^="idea-"]')];
    expect(ideas.map(idea => idea.id)).toEqual(Array.from({ length: 70 }, (_, index) => `idea-${index + 1}`));

    await waitFor(() => expect(document.querySelector('script[data-jsonld-id="guideitemlist"]')).not.toBeNull());
    const list = JSON.parse(document.querySelector('script[data-jsonld-id="guideitemlist"]')!.textContent!);
    expect(list['@type']).toBe('ItemList');
    expect(list.numberOfItems).toBe(70);
    list.itemListElement.forEach((entry: { position: number; name: string; item: string }, index: number) => {
      expect(entry.position).toBe(index + 1);
      expect(entry.item).toBe(`${window.location.origin}/${lang}/blog/${slug}#idea-${index + 1}`);
      expect(`${entry.name}.`).toBe(ideas[index].querySelector('strong')?.textContent);
    });
  });
});

describe('holiday URLs in sitemap and llms.txt', () => {
  const sitemap = new DOMParser().parseFromString(read('public/sitemap.xml'), 'application/xml');
  const entryFor = (url: string) => [...sitemap.querySelectorAll('url')].find(node => node.querySelector('loc')?.textContent === url);
  const llms = read('public/llms.txt');

  it.each([
    ...ARTICLES.map(({ lang, slug, counterpart }) => ({ path: `/${lang}/blog/${slug}`, paired: Boolean(counterpart) })),
    { path: '/en/wishlist/kids-christmas-list', paired: true },
    { path: '/ua/wishlist/st-nicholas-list-ua', paired: true },
  ])('lists $path with today as lastmod', ({ path, paired }) => {
    const entry = entryFor(ORIGIN + path);
    expect(entry).toBeDefined();
    expect(entry?.querySelector('lastmod')?.textContent).toBe('2026-10-22');
    expect(entry?.getElementsByTagName('xhtml:link').length).toBe(paired ? 3 : 0);
    expect(llms).toContain(ORIGIN + path);
  });

  it('names the holiday query intents and the update date in llms.txt', () => {
    for (const intent of ['Christmas wish list', "Kids' Christmas list", 'letter to Santa', 'Secret Santa questionnaire', 'What to put on my Christmas list', 'вішліст на Новий рік', 'лист Святому Миколаю', 'що попросити на Новий рік']) {
      expect(llms).toContain(intent);
    }
    expect(llms).toContain('last_updated: 2026-10-22');
  });
});

describe('holiday demo wishlists', () => {
  it('wires the kids pair through every demo map', () => {
    for (const id of ['kids-christmas-list', 'st-nicholas-list-ua']) {
      expect(DEMO_WISHLISTS[id]?.title, id).toBeTruthy();
      expect(EXAMPLE_SEO[id]?.title, id).toBeTruthy();
      expect(EXAMPLE_WISHLIST_ALTERNATES[id]).toEqual({ en: 'kids-christmas-list', uk: 'st-nicholas-list-ua' });
    }
    expect(EXAMPLE_SEO['christmas-list-ua'].title).toBe('Вішліст на Новий рік 2027 і Різдво - приклад і шаблон | WishList App');
    expect(EXAMPLE_SEO['christmas-list'].title).toBe('Christmas Wish List 2026 - Example and Free Template | WishList App');
  });

  it('gives each holiday demo 10-12 items, with notes and some illustrative prices', () => {
    for (const id of HOLIDAY_DEMOS) {
      const items = DEMO_ITEMS[id];
      expect(items.length, id).toBeGreaterThanOrEqual(10);
      expect(items.length, id).toBeLessThanOrEqual(12);
      expect(items.every(item => item.description), id).toBe(true);
      expect(items.some(item => item.priceMinor != null && item.currency), id).toBe(true);
      expect(new Set(items.map(item => item.id)).size, id).toBe(items.length);
    }
  });

  it('places the kids card right after the New Year card on both homepages', () => {
    expect(enExamples.cards.map(card => card.wishlistId).slice(0, 2)).toEqual(['christmas-list', 'kids-christmas-list']);
    expect(uaExamples.cards.map(card => card.wishlistId).slice(0, 2)).toEqual(['christmas-list-ua', 'st-nicholas-list-ua']);
  });

  it('prerenders the intro under the H1 of each holiday demo', () => {
    const routes = buildRoutes(resolve('.'), renderArticleHtml);
    const intros: Record<string, string> = { ...enExamples.intros, ...uaExamples.intros };
    for (const id of HOLIDAY_DEMOS) {
      const lang = id.endsWith('-ua') ? 'ua' : 'en';
      const route = routes.find(candidate => candidate.path === `/${lang}/wishlist/${id}`);
      const doc = parse(renderPage(read('index.html'), route!));
      expect(doc.querySelector('h1')?.textContent, id).toBe(DEMO_WISHLISTS[id].title);
      expect(doc.querySelector('h1 + p')?.textContent, id).toBe(intros[id]);
      expect(doc.querySelectorAll('li').length, id).toBe(DEMO_ITEMS[id].length);
    }
  });

  it('reserves every demo ID in both Firestore and Storage rules', () => {
    const demoIds = Object.keys(DEMO_WISHLISTS).sort();
    for (const file of ['firestore.rules', 'storage.rules']) {
      const list = read(file).match(/function isReservedDemo\(wishlistId\) \{\s*return wishlistId in \[([^\]]+)\]/)?.[1] ?? '';
      expect([...list.matchAll(/'([^']+)'/g)].map(match => match[1]).sort(), file).toEqual(demoIds);
    }
  });
});
