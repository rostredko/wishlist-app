// @vitest-environment node
import { describe, expect, it } from 'vitest';
// @ts-expect-error Operational Node script has no TypeScript declaration.
import { compareDocuments, validateRecoveryTarget, validateSnapshot } from '../../scripts/verify-firestore-recovery.mjs';

const source = 'projects/wishlist-app-51cf7/databases/(default)/documents/';
const recovered = 'projects/wishlist-app-51cf7/databases/wishlist-recovery-20261021t213013/documents/';
const fields = { ownerUid: { stringValue: 'synthetic-owner' }, claimed: { booleanValue: false }, createdAt: { timestampValue: '2020-01-01T00:00:00Z' } };

describe('production recovery verification', () => {
  it('compares relative document paths and typed fields independent of ordering', () => {
    const a = [{ name: source + 'wishlists/a/items/gift', fields }, { name: source + 'wishlists/a', fields: {} }];
    const b = [{ name: recovered + 'wishlists/a', fields: {} }, { name: recovered + 'wishlists/a/items/gift', fields: Object.fromEntries(Object.entries(fields).reverse()) }];
    expect(compareDocuments(a, b)).toMatchObject({ documents: 2, matched: true });
  });

  it('rejects changed reservations even when document counts match', () => {
    expect(() => compareDocuments([{ name: source + 'wishlists/a/items/gift', fields }], [{ name: recovered + 'wishlists/a/items/gift', fields: { ...fields, claimed: { booleanValue: true } } }])).toThrow('mismatch');
  });

  it('rejects missing gifts and renamed paths', () => {
    expect(() => compareDocuments([{ name: source + 'wishlists/a/items/gift', fields }], [])).toThrow('mismatch');
    expect(() => compareDocuments([{ name: source + 'wishlists/a', fields }], [{ name: recovered + 'wishlists/b', fields }])).toThrow('mismatch');
  });

  it.each(['(default)', 'production', 'other-project/database', 'wishlist-recovery-', 'wishlist-recovery-20261021t213013/../(default)'])('rejects unsafe recovery target %s', target => {
    expect(() => validateRecoveryTarget(target)).toThrow();
  });

  it('accepts only a dedicated recovery database and a whole-minute UTC snapshot', () => {
    expect(validateRecoveryTarget('wishlist-recovery-20261021t213013')).toBe('wishlist-recovery-20261021t213013');
    expect(validateSnapshot('2026-10-21T21:28:00Z')).toBe('2026-10-21T21:28:00Z');
    expect(() => validateSnapshot('2026-10-21T21:28:12Z')).toThrow();
    expect(() => validateSnapshot('2026-99-99T21:28:00Z')).toThrow();
  });
});
