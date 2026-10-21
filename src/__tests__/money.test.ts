import { parsePriceInput, isValidMoney, formatPrice, MAX_PRICE_MINOR } from '@utils/money';

describe('optional money', () => {
  it.each(['', '  '])('keeps blank input optional', value => expect(parsePriceInput(value)).toEqual({ valid: true, priceMinor: null }));
  it.each([['0', 0], ['12,34', 1234], ['12.3', 1230]])('parses %s exactly', (value, amount) => expect(parsePriceInput(value)).toEqual({ valid: true, priceMinor: amount }));
  it.each(['-1', '1.234', '1e3', '1,2.3', '1000000.01'])('rejects %s', value => expect(parsePriceInput(value).valid).toBe(false));
  it('validates bounded integer amounts and currencies', () => {
    expect(isValidMoney(MAX_PRICE_MINOR, 'UAH')).toBe(true);
    expect(isValidMoney(1.5, 'USD')).toBe(false);
    expect(isValidMoney(0, 'BTC')).toBe(false);
  });
  it('formats zero in the chosen currency', () => expect(formatPrice(0, 'USD', 'en')).toContain('$0.00'));
});
