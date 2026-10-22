import { describe, expect, it } from 'vitest';
import { isTitleSuggestionSeason } from '@constants/season';

describe('isTitleSuggestionSeason (Nov 1 - Dec 31, local time)', () => {
  it.each([
    ['Oct 31, 23:59', new Date(2026, 9, 31, 23, 59), false],
    ['Nov 1, 00:00', new Date(2026, 10, 1, 0, 0), true],
    ['Dec 31, 23:59', new Date(2026, 11, 31, 23, 59), true],
    ['Jan 1, 00:00', new Date(2027, 0, 1, 0, 0), false],
  ])('%s -> %s', (_label, date, expected) => {
    expect(isTitleSuggestionSeason(date)).toBe(expected);
  });
});
