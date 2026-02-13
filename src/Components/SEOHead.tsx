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

type StructuredProps = {
  website?: boolean;
  webapp?: boolean;
  itemList?: ItemListLD | null;
  organization?: boolean;
  faq?: FAQItem[] | null;
  howTo?: boolean;
  breadcrumbs?: BreadcrumbItem[] | null;
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
};

function sanitizeCanonical(rawHref: string) {
  try {
    const url = new URL(rawHref);
    url.hash = '';
    url.search = '';
    // Ensure trailing slash for root paths or subdirectories if not a file
    if (!url.pathname.endsWith('/') && !url.pathname.includes('.')) {
      url.pathname += '/';
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

    if (parts.length === 0) {
      return { en: `${url.origin}/en/`, uk: `${url.origin}/ua/` };
    }
    const [maybeLang, ...rest] = parts;
    const restPath = rest.join('/');
    const withSlash = restPath ? `/${restPath}` : '/';
    const origin = url.origin;

    if (maybeLang !== 'en' && maybeLang !== 'ua') {
      return { en: `${origin}/en${withSlash}`, uk: `${origin}/ua${withSlash}` };
    }

    return {
      en: `${origin}/en${withSlash}`,
      uk: `${origin}/ua${withSlash}`,
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

    const ogImage = absoluteUrl(image ?? `${origin}/og-image.webp`);
    const ogLocale = toOgLocale(lang);

    document.title = title;

    upsertMetaByName('description', description);
    if (keywords) {
      upsertMetaByName('keywords', keywords);
    }
    upsertMetaByName('robots', 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1');

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
    upsertLink('alternate', `${origin}/`, { hreflang: 'x-default' });

    upsertMetaByProperty('og:locale', ogLocale);
    upsertMetaByProperty('og:type', 'website');
    upsertMetaByProperty('og:site_name', 'WishList App');
    upsertMetaByProperty('og:title', title);
    upsertMetaByProperty('og:description', description);
    upsertMetaByProperty('og:image', ogImage);
    upsertMetaByProperty('og:image:width', '1200');
    upsertMetaByProperty('og:image:height', '630');
    upsertMetaByProperty('og:image:type', 'image/webp');
    upsertMetaByProperty('og:image:alt', title);
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
        inLanguage: [lang === 'uk' ? 'uk-UA' : 'en-US'],
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: origin + '/?q={search_term_string}',
          },
          'query-input': 'required name=search_term_string',
        },
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
          priceCurrency: 'USD',
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
      const itemsRaw = Array.isArray((src as any).items) ? (src as any).items : [];
      const names: string[] = itemsRaw.map((it: any) => (typeof it === 'string' ? it : it?.name)).filter(Boolean);

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
        logo: `${origin}/og-image.webp`,
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

    if (structured?.howTo) {
      upsertJsonLd('howto', {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: 'How to use WishList App',
        description: 'Learn how to create and share wishlists with friends using WishList App',
        step: [
          {
            '@type': 'HowToStep',
            position: 1,
            name: 'Create a wishlist',
            text: 'Sign in with Google and click "Create wishlist" button to start.',
          },
          {
            '@type': 'HowToStep',
            position: 2,
            name: 'Share the link',
            text: 'Share the private URL with friends. Works from any device and is completely free.',
          },
          {
            '@type': 'HowToStep',
            position: 3,
            name: 'Friends claim gifts',
            text: 'Friends can anonymously claim gifts so everyone sees what\'s already taken.',
          },
          {
            '@type': 'HowToStep',
            position: 4,
            name: 'Manage your lists',
            text: 'Sign in with Google to manage and organize all your wishlists.',
          },
        ],
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
  }, [title, description, lang, canonical, image, alternates, structured, keywords]);

  return null;
}