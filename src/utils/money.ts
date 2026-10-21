export const SUPPORTED_CURRENCIES = ['UAH', 'USD', 'EUR', 'GBP'] as const;
export type Currency = typeof SUPPORTED_CURRENCIES[number];
export const MAX_PRICE_MINOR = 100_000_000;

export function isValidMoney(priceMinor: unknown, currency: unknown): boolean {
  return typeof priceMinor === 'number' && Number.isInteger(priceMinor) && priceMinor >= 0 &&
    priceMinor <= MAX_PRICE_MINOR && SUPPORTED_CURRENCIES.includes(currency as Currency);
}

export function parsePriceInput(input: string): { valid: true; priceMinor: number | null } | { valid: false } {
  const value = input.trim();
  if (!value) return { valid: true, priceMinor: null };
  if (!/^\d+(?:[.,]\d{1,2})?$/.test(value)) return { valid: false };
  const [whole, fraction = ''] = value.replace(',', '.').split('.');
  const priceMinor = Number(whole) * 100 + Number(fraction.padEnd(2, '0'));
  return isValidMoney(priceMinor, 'UAH') ? { valid: true, priceMinor } : { valid: false };
}

export function formatPrice(priceMinor: number, currency: Currency, locale: string): string {
  return new Intl.NumberFormat(locale === 'ua' ? 'uk-UA' : locale, { style: 'currency', currency }).format(priceMinor / 100);
}
