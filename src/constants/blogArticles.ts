/** Blog post slug pairs (EN ↔ UA) for hreflang and routing. */
export const BLOG_SLUG_PAIRS = [
  { en: 'how-lists-change-your-life', ua: 'yak-spysky-zminyuyut-zhyttia' },
  { en: 'best-wishlist-apps-2026', ua: 'de-stvoryty-vishlist-2026' },
  { en: 'amazon-wishlist-alternatives', ua: 'najkrashchi-servisy-spysku-bazhan-v-ukraini' },
  { en: 'how-to-create-a-birthday-wishlist', ua: 'yak-zrobyty-vishlist-na-den-narodzhennya' },
  { en: 'wishlist-vs-gift-registry', ua: 'vishlist-chy-google-docs-telegram' },
  { en: 'best-secret-santa-apps', ua: 'yak-podilytysia-vishlistom-bez-dublikativ' },
] as const;

export type BlogRouteLang = 'ua' | 'en';

export type BlogSlugPair = (typeof BLOG_SLUG_PAIRS)[number];

export const BLOG_LAST_UPDATED = '2026-04-15';

export function resolveBlogAlternates(
  origin: string,
  routeLang: BlogRouteLang,
  slug: string,
): { en: string; uk: string } | null {
  const pair = BLOG_SLUG_PAIRS.find((p) => p[routeLang === 'en' ? 'en' : 'ua'] === slug);
  if (!pair) return null;
  return {
    en: `${origin}/en/blog/${pair.en}`,
    uk: `${origin}/ua/blog/${pair.ua}`,
  };
}

export function findBlogPairBySlug(routeLang: BlogRouteLang, slug: string): BlogSlugPair | undefined {
  return BLOG_SLUG_PAIRS.find((p) => p[routeLang === 'en' ? 'en' : 'ua'] === slug);
}
