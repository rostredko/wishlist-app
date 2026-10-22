/** Editorial slots for routing and hub cards. Only equivalent topics use hreflang. */
export const BLOG_SLUG_PAIRS = [
  { en: 'christmas-wishlist', ua: 'vishlist-na-novyj-rik-i-rizdvo' },
  { en: 'kids-christmas-list', ua: 'lyst-svyatomu-mykolayu' },
  { en: 'secret-santa-questionnaire', ua: 'tayemnyj-santa-pravyla', equivalent: false },
  { en: 'chatgpt-gift-ideas', ua: 'yak-vybraty-podarunok-z-chatgpt' },
  { en: 'how-to-create-a-wishlist', ua: 'yak-zrobyty-vishlist' },
  { en: 'how-lists-change-your-life', ua: 'yak-spysky-zminyuyut-zhyttia' },
  { en: 'best-wishlist-apps-2026', ua: 'de-stvoryty-vishlist-2026' },
  { en: 'amazon-wishlist-alternatives', ua: 'najkrashchi-servisy-spysku-bazhan-v-ukraini', equivalent: false },
  { en: 'how-to-create-a-birthday-wishlist', ua: 'yak-zrobyty-vishlist-na-den-narodzhennya' },
  { en: 'wishlist-vs-gift-registry', ua: 'vishlist-chy-google-docs-telegram', equivalent: false },
  { en: 'best-secret-santa-apps', ua: 'yak-podilytysia-vishlistom-bez-dublikativ', equivalent: false },
] as const;

export type BlogRouteLang = 'ua' | 'en';

export type BlogSlugPair = (typeof BLOG_SLUG_PAIRS)[number];

export const BLOG_LAST_UPDATED = '2026-10-09';

export function resolveBlogAlternates(
  origin: string,
  routeLang: BlogRouteLang,
  slug: string,
): { en: string; uk: string } | undefined {
  const pair = BLOG_SLUG_PAIRS.find((p) => p[routeLang === 'en' ? 'en' : 'ua'] === slug);
  if (!pair || ('equivalent' in pair && !pair.equivalent)) return undefined;
  return {
    en: `${origin}/en/blog/${pair.en}`,
    uk: `${origin}/ua/blog/${pair.ua}`,
  };
}

export function findBlogPairBySlug(routeLang: BlogRouteLang, slug: string): BlogSlugPair | undefined {
  return BLOG_SLUG_PAIRS.find((p) => p[routeLang === 'en' ? 'en' : 'ua'] === slug);
}
