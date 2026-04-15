import { useEffect } from 'react';

type Lang = 'en' | 'uk';

type ItemListLD =
  | { name?: string; items: Array<string> }
  | { name?: string; items: Array<{ name: string }> };

type FAQItem = {
  q: string;
  a: string;
};

type BreadcrumbItem = {
  name: string;
  url: string;
};

type ArticleLD = {
  headline: string;
  datePublished?: string;
  dateModified?: string;
  authorName?: string;
};

type HowToLD = {
  name: string;
  description?: string;
  steps: Array<{ text: string; name?: string }>;
};

type GuideItemListLD = {
  name?: string;
  items: Array<{ name: string; url: string }>;
};

type StructuredProps = {
  website?: boolean;
  webapp?: boolean;
  itemList?: ItemListLD | null;
  organization?: boolean;
  faq?: FAQItem[] | null;
  breadcrumbs?: BreadcrumbItem[] | null;
  article?: ArticleLD | null;
  howTo?: HowToLD | null;
  guideItemList?: GuideItemListLD | null;
};

type SEOHeadProps = {
  title: string;
  description: string;
  lang: Lang;
  canonical?: string;
  image?: string;
  alternates?: Partial<Record<Lang, string>>;
  structured?: StructuredProps;
  keywords?: string;
  robots?: string;
};

function sanitizeCanonical(rawHref: string) {
  try {
    const url = new URL(rawHref);
    url.hash = '';
    url.search = '';
    if (url.pathname.length > 1 && url.pathname.endsWith('/')) {
      url.pathname = url.pathname.replace(/\/+$/, '');
    }
    return url.toString();
  } catch {
    return rawHref;
  }
}

function currentOrigin() {
  if (typeof window !== 'undefined') return window.location.origin;
  return 'https://wishlistapp.com.ua';
}

function absoluteUrl(href: string) {
  try {
    return new URL(href, currentOrigin()).toString();
  } catch {
    return href;
  }
}

function upsertMetaByName(name: string, content: string) {
  // First, try to find existing managed tag
  let el = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"][data-seo-head="1"]`);

  // If not found, try to find static tag (without data-seo-head)
  if (!el) {
    el = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]:not([data-seo-head])`);
    if (el) {
      // Update existing static tag and mark it as managed
      el.setAttribute('data-seo-head', '1');
    }
  }

  // If still not found, create new tag
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', name);
    el.setAttribute('data-seo-head', '1');
    document.head.appendChild(el);
  }

  el.setAttribute('content', content);
}

function upsertMetaByProperty(property: string, content: string) {
  // First, try to find existing managed tag
  let el = document.head.querySelector<HTMLMetaElement>(`meta[property="${property}"][data-seo-head="1"]`);

  // If not found, try to find static tag (without data-seo-head)
  if (!el) {
    el = document.head.querySelector<HTMLMetaElement>(`meta[property="${property}"]:not([data-seo-head])`);
    if (el) {
      // Update existing static tag and mark it as managed
      el.setAttribute('data-seo-head', '1');
    }
  }

  // If still not found, create new tag
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('property', property);
    el.setAttribute('data-seo-head', '1');
    document.head.appendChild(el);
  }

  el.setAttribute('content', content);
}

function upsertLink(rel: string, href: string, extra?: Record<string, string>) {
  const extraSelector = extra
    ? Object.entries(extra).map(([k, v]) => `[${k}="${v}"]`).join('')
    : '';

  // First, try to find existing managed link
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"][data-seo-head="1"]${extraSelector}`);

  // If not found, try to find static link (without data-seo-head)
  if (!el) {
    const staticSelector = `link[rel="${rel}"]:not([data-seo-head])${extraSelector}`;
    el = document.head.querySelector<HTMLLinkElement>(staticSelector);
    if (el) {
      // Update existing static link and mark it as managed
      el.setAttribute('data-seo-head', '1');
    }
  }

  // If still not found, create new link
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    el.setAttribute('data-seo-head', '1');
    if (extra) {
      for (const [k, v] of Object.entries(extra)) el.setAttribute(k, v);
    }
    document.head.appendChild(el);
  }

  el.setAttribute('href', href);
}

function removeAllManaged(selector: string) {
  document.head.querySelectorAll(selector).forEach(n => n.remove());
}

function removeStaticMetaTags() {
  // Remove static OG tags that might conflict (we'll create new managed ones)
  document.head.querySelectorAll('meta[property^="og:"]:not([data-seo-head])').forEach(n => n.remove());

  // Remove static Twitter tags that might conflict (we'll create new managed ones)
  document.head.querySelectorAll('meta[name^="twitter:"]:not([data-seo-head])').forEach(n => n.remove());

  // Remove static hreflang links that might conflict (we'll create new managed ones)
  document.head.querySelectorAll('link[rel="alternate"][hreflang]:not([data-seo-head])').forEach(n => n.remove());

  // Remove static canonical links that might conflict (we'll create new managed ones)
  document.head.querySelectorAll('link[rel="canonical"]:not([data-seo-head])').forEach(n => n.remove());

  // For unique meta tags, remove duplicates but keep the first one for upsertMetaByName to update
  // This ensures we don't have multiple description/viewport/etc tags
  const uniqueMetaNames = ['description', 'keywords', 'viewport', 'theme-color', 'robots'];
  uniqueMetaNames.forEach(name => {
    const existing = document.head.querySelectorAll(`meta[name="${name}"]:not([data-seo-head])`);
    // Remove all but the first one (upsertMetaByName will update the first one)
    for (let i = 1; i < existing.length; i++) {
      existing[i].remove();
    }
  });
}

const toOgLocale = (l: Lang) => (l === 'uk' ? 'uk_UA' : 'en_US');

function buildAlternatesAuto(href: string): Partial<Record<Lang, string>> {
  try {
    const url = new URL(href);
    const parts = url.pathname.split('/').filter(Boolean);
    const buildLocalizedHref = (lang: 'en' | 'ua', rest: string[]) =>
      rest.length > 0 ? `${url.origin}/${lang}/${rest.join('/')}` : `${url.origin}/${lang}`;

    if (parts.length === 0) {
      return { en: `${url.origin}/en`, uk: `${url.origin}/ua` };
    }
    const [maybeLang, ...rest] = parts;

    if (maybeLang !== 'en' && maybeLang !== 'ua') {
      return {
        en: buildLocalizedHref('en', parts),
        uk: buildLocalizedHref('ua', parts),
      };
    }

    return {
      en: buildLocalizedHref('en', rest),
      uk: buildLocalizedHref('ua', rest),
    };
  } catch {
    return {};
  }
}

function upsertJsonLd(id: string, data: unknown) {
  const selector = `script[type="application/ld+json"][data-seo-head="1"][data-jsonld-id="${id}"]`;
  let el = document.head.querySelector<HTMLScriptElement>(selector);
  const payload = JSON.stringify(data);

  if (!el) {
    el = document.createElement('script');
    el.type = 'application/ld+json';
    el.setAttribute('data-seo-head', '1');
    el.setAttribute('data-jsonld-id', id);
    document.head.appendChild(el);
  }
  if (el.textContent !== payload) {
    el.textContent = payload;
  }
}

function removeAllJsonLd() {
  document.head
    .querySelectorAll<HTMLScriptElement>('script[type="application/ld+json"][data-seo-head="1"]')
    .forEach(n => n.remove());
}

export default function SEOHead({
  title,
  description,
  lang,
  canonical,
  image,
  alternates,
  structured,
  keywords,
  robots,
}: SEOHeadProps) {
  useEffect(() => {
    if (typeof document === 'undefined') return;

    // Check for existing viewport before removing static tags
    const existingViewport = document.head.querySelector<HTMLMetaElement>('meta[name="viewport"]:not([data-seo-head])');
    const hasViewportFit = existingViewport?.content.includes('viewport-fit=cover') ?? false;

    // Remove static tags that might conflict before updating
    removeStaticMetaTags();

    document.documentElement.lang = lang;

    const origin = currentOrigin();

    const href = sanitizeCanonical(
      canonical
        ? absoluteUrl(canonical)
        : (typeof window !== 'undefined'
          ? new URL(window.location.pathname, origin).toString()
          : `${origin}/`)
    );
    const canonicalOrigin = (() => {
      try {
        return new URL(href).origin;
      } catch {
        return origin;
      }
    })();

    const ogImage = absoluteUrl(image ?? `${origin}/og-image.webp`);
    const ogLocale = toOgLocale(lang);

    document.title = title;

    upsertMetaByName('description', description);
    if (keywords) {
      upsertMetaByName('keywords', keywords);
    }
    upsertMetaByName(
      'robots',
      robots ?? 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1'
    );

    // Update viewport, but preserve viewport-fit=cover if it existed
    upsertMetaByName('viewport', hasViewportFit
      ? 'width=device-width, initial-scale=1, viewport-fit=cover'
      : 'width=device-width, initial-scale=1');

    upsertMetaByName('theme-color', '#1976d2');

    removeAllManaged('link[rel="canonical"][data-seo-head="1"]');
    upsertLink('canonical', href);

    removeAllManaged('link[rel="alternate"][data-seo-head="1"]');
    const alts = Object.keys(alternates ?? {}).length
      ? (alternates as Partial<Record<Lang, string>>)
      : buildAlternatesAuto(href);

    const enHref = alts.en ? absoluteUrl(alts.en) : undefined;
    const ukHref = alts.uk ? absoluteUrl(alts.uk) : undefined;

    if (enHref) upsertLink('alternate', sanitizeCanonical(enHref), { hreflang: 'en' });
    if (ukHref) upsertLink('alternate', sanitizeCanonical(ukHref), { hreflang: 'uk' });
    upsertLink('alternate', sanitizeCanonical(ukHref ?? `${canonicalOrigin}/ua`), { hreflang: 'x-default' });

    upsertMetaByProperty('og:locale', ogLocale);
    upsertMetaByProperty('og:type', 'website');
    upsertMetaByProperty('og:site_name', 'WishList App');
    upsertMetaByProperty('og:title', title);
    upsertMetaByProperty('og:description', description);
    upsertMetaByProperty('og:image', ogImage);
    upsertMetaByProperty('og:image:width', '1200');
    upsertMetaByProperty('og:image:height', '630');
    upsertMetaByProperty('og:image:type', 'image/webp');
    upsertMetaByProperty('og:image:alt', image ? title : 'WishList App - free online wishlist maker');
    upsertMetaByProperty('og:url', href);

    removeAllManaged('meta[property="og:locale:alternate"][data-seo-head="1"]');
    (['en', 'uk'] as Lang[])
      .filter((l) => l !== lang && (l === 'en' ? enHref : ukHref))
      .forEach((l) => {
        const el = document.createElement('meta');
        el.setAttribute('property', 'og:locale:alternate');
        el.setAttribute('content', toOgLocale(l));
        el.setAttribute('data-seo-head', '1');
        document.head.appendChild(el);
      });

    upsertMetaByName('twitter:card', 'summary_large_image');
    upsertMetaByName('twitter:title', title);
    upsertMetaByName('twitter:description', description);
    upsertMetaByName('twitter:image', ogImage);

    removeAllJsonLd();

    if (structured?.website) {
      upsertJsonLd('website', {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'WishList App',
        url: origin + '/',
        description: description,
        inLanguage: lang === 'uk' ? 'uk-UA' : 'en-US',
      });
    }

    if (structured?.webapp) {
      upsertJsonLd('webapp', {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'WishList App',
        applicationCategory: 'ProductivityApplication',
        operatingSystem: 'Web',
        url: origin + '/',
        description: description,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'UAH',
        },
        featureList: [
          'Create wishlists',
          'Share private links',
          'Anonymous gift claiming',
          'Multi-language support',
          'Free to use',
        ],
      });
    }

    if (structured?.itemList) {
      const src = structured.itemList;
      const rawItems = src.items;
      const itemsRaw: Array<string | { name?: string }> = Array.isArray(rawItems) ? rawItems : [];
      const names: string[] = itemsRaw
        .map((it) => (typeof it === 'string' ? it : it?.name))
        .filter((n): n is string => typeof n === 'string' && n.length > 0);

      if (names.length > 0) {
        upsertJsonLd('itemlist', {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: src.name ?? 'Wishlist',
          description: `Wishlist items: ${names.slice(0, 5).join(', ')}${names.length > 5 ? '...' : ''}`,
          numberOfItems: names.length,
          itemListElement: names.map((n, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: n,
          })),
        });
      }
    }

    if (structured?.organization) {
      upsertJsonLd('organization', {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'WishList App',
        url: origin + '/',
        logo: {
          '@type': 'ImageObject',
          url: `${origin}/android-chrome-512x512.png`,
          width: 512,
          height: 512,
        },
        description: description,
        sameAs: [],
      });
    }

    if (structured?.faq && Array.isArray(structured.faq) && structured.faq.length > 0) {
      upsertJsonLd('faq', {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: structured.faq.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.a,
          },
        })),
      });
    }

    if (structured?.breadcrumbs && Array.isArray(structured.breadcrumbs) && structured.breadcrumbs.length > 0) {
      upsertJsonLd('breadcrumbs', {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: structured.breadcrumbs.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: absoluteUrl(item.url),
        })),
      });
    }

    if (structured?.article) {
      const a = structured.article;
      upsertJsonLd('article', {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: a.headline,
        datePublished: a.datePublished,
        dateModified: a.dateModified,
        author: {
          '@type': 'Organization',
          name: a.authorName ?? 'WishList App',
        },
        publisher: {
          '@type': 'Organization',
          name: 'WishList App',
          logo: {
            '@type': 'ImageObject',
            url: `${origin}/android-chrome-512x512.png`,
          },
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': href,
        },
      });
    }

    if (structured?.howTo && structured.howTo.steps.length > 0) {
      const h = structured.howTo;
      upsertJsonLd('howto', {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: h.name,
        description: h.description,
        step: h.steps.map((s, i) => ({
          '@type': 'HowToStep',
          position: i + 1,
          name: s.name,
          text: s.text,
        })),
      });
    }

    if (structured?.guideItemList && structured.guideItemList.items.length > 0) {
      const g = structured.guideItemList;
      upsertJsonLd('guideitemlist', {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: g.name ?? 'Guides',
        numberOfItems: g.items.length,
        itemListElement: g.items.map((it, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: it.name,
          item: absoluteUrl(it.url),
        })),
      });
    }
  }, [title, description, lang, canonical, image, alternates, structured, keywords, robots]);

  return null;
}
