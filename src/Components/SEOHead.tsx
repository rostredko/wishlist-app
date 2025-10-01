import {useEffect} from 'react';

type Lang = 'en' | 'uk';

type SEOHeadProps = {
  title: string;
  description: string;
  lang: Lang;
  canonical?: string;
  image?: string;
  alternates?: Partial<Record<Lang, string>>;
};

function sanitizeCanonical(rawHref: string) {
  try {
    const url = new URL(rawHref);
    url.hash = '';
    url.search = '';
    return url.toString();
  } catch {
    return rawHref;
  }
}

function currentOrigin() {
  if (typeof window !== 'undefined') return window.location.origin;
  return 'https://wishlistapp.com.ua';
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

export default function SEOHead({
                                  title,
                                  description,
                                  lang,
                                  canonical,
                                  image,
                                  alternates,
                                }: SEOHeadProps) {
  useEffect(() => {
    if (typeof document === 'undefined') return;

    document.documentElement.lang = lang;

    const origin = currentOrigin();
    const href =
      canonical ??
      (typeof window !== 'undefined' ? sanitizeCanonical(window.location.href) : `${origin}/`);
    const ogImage = image ?? `${origin}/og-image.webp`;
    const ogLocale = lang === 'uk' ? 'uk_UA' : 'en_US';

    document.title = title;

    upsertMetaByName('description', description);
    upsertMetaByName('robots', 'index,follow');

    upsertLink('canonical', href);

    removeAllManaged('link[rel="alternate"][data-seo-head="1"]');
    const alts = alternates ?? {};
    if (alts.en) upsertLink('alternate', alts.en, {hreflang: 'en'});
    if (alts.uk) upsertLink('alternate', alts.uk, {hreflang: 'uk'});
    if (alts.en) upsertLink('alternate', alts.en, {hreflang: 'x-default'});

    upsertMetaByProperty('og:locale', ogLocale);
    upsertMetaByProperty('og:type', 'website');
    upsertMetaByProperty('og:site_name', 'WishList App');
    upsertMetaByProperty('og:title', title);
    upsertMetaByProperty('og:description', description);
    upsertMetaByProperty('og:image', ogImage);
    upsertMetaByProperty('og:url', href);

    upsertMetaByName('twitter:card', 'summary_large_image');
    upsertMetaByName('twitter:title', title);
    upsertMetaByName('twitter:description', description);
    upsertMetaByName('twitter:image', ogImage);
  }, [title, description, lang, canonical, image, alternates]);

  return null;
}