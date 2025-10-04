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
    upsertMetaByName('robots', 'index,follow');

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
  }, [title, description, lang, canonical, image, alternates]);

  return null;
}