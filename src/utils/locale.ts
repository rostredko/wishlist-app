export const SUPPORTED_LANGS = ['en', 'ua'] as const;
export type SupportedLang = typeof SUPPORTED_LANGS[number];

export function detectPreferredLang(langHeader: string): SupportedLang {
  // Language detected from Accept-Language header
  const l = (langHeader || '').toLowerCase();
  if (l.startsWith('uk') || l.startsWith('ua') || l.startsWith('ru')) return 'ua';
  return 'en';
}

export function isProbablyBot(ua: string | undefined): boolean {
  if ((navigator as any).webdriver) return true;
  if (!ua) return false;
  const s = ua.toLowerCase();
  return /\b(bot|crawl|spider|slurp|bingpreview|facebookexternalhit|whatsapp|telegrambot|embedly|quora link preview|discordbot|ia_archiver)\b/.test(s);
}