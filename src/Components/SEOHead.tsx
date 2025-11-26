import {useEffect} from 'react';

type Lang = 'en' | 'uk';

type ItemListLD =
  | { name?: string; items: Array<string> }
  | { name?: string; items: Array<{ name: string }> };

type StructuredProps = {
  website?: boolean;
  webapp?: boolean;
  itemList?: ItemListLD | null;
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
    if (!url.pathname) url.pathname = '/';
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
  let el = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"][data-seo-head="1"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', name);
    el.setAttribute('data-seo-head', '1');
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertMetaByProperty(property: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[property="${property}"][data-seo-head="1"]`);
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
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"][data-seo-head="1"]${extraSelector}`);
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

const toOgLocale = (l: Lang) => (l === 'uk' ? 'uk_UA' : 'en_US');

function buildAlternatesAuto(href: string): Partial<Record<Lang, string>> {
  try {
    const url = new URL(href);
    const parts = url.pathname.split('/').filter(Boolean);

    if (parts.length === 0) {
      return {en: `${url.origin}/en/`, uk: `${url.origin}/uk/`};
    }
    const [maybeLang, ...rest] = parts;
    const restPath = rest.join('/');
    const withSlash = restPath ? `/${restPath}` : '/';
    const origin = url.origin;

    if (maybeLang !== 'en' && maybeLang !== 'uk') {
      return {en: `${origin}/en${withSlash}`, uk: `${origin}/uk${withSlash}`};
    }

    return {
      en: `${origin}/en${withSlash}`,
      uk: `${origin}/uk${withSlash}`,
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
    upsertMetaByName('viewport', 'width=device-width, initial-scale=1');
    upsertMetaByName('theme-color', '#1976d2');

    removeAllManaged('link[rel="canonical"][data-seo-head="1"]');
    upsertLink('canonical', href);

    removeAllManaged('link[rel="alternate"][data-seo-head="1"]');
    const alts = Object.keys(alternates ?? {}).length
      ? (alternates as Partial<Record<Lang, string>>)
      : buildAlternatesAuto(href);

    const enHref = alts.en ? absoluteUrl(alts.en) : undefined;
    const ukHref = alts.uk ? absoluteUrl(alts.uk) : undefined;

    if (enHref) upsertLink('alternate', sanitizeCanonical(enHref), {hreflang: 'en'});
    if (ukHref) upsertLink('alternate', sanitizeCanonical(ukHref), {hreflang: 'uk'});
    upsertLink('alternate', `${origin}/`, {hreflang: 'x-default'});

    upsertMetaByProperty('og:locale', ogLocale);
    upsertMetaByProperty('og:type', 'website');
    upsertMetaByProperty('og:site_name', 'WishList App');
    upsertMetaByProperty('og:title', title);
    upsertMetaByProperty('og:description', description);
    upsertMetaByProperty('og:image', ogImage);
    upsertMetaByProperty('og:image:width', '1200');
    upsertMetaByProperty('og:image:height', '630');
    upsertMetaByProperty('og:image:type', 'image/webp');
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
        description: 'Create and share wishlists for any occasion. Friends can anonymously claim gifts so everyone sees what\'s already taken. Simple and free.',
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
        description: 'Create and share wishlists for any occasion. Friends can anonymously claim gifts so everyone sees what\'s already taken. Simple and free.',
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
  }, [title, description, lang, canonical, image, alternates, structured, keywords]);

  return null;
}