import '../i18n';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent } from '@testing-library/react';
import { customRender as render, screen } from '../test/render';
import { WishListItemRow } from '@components/WishListItemRow';

vi.mock('@hooks/useAuth', () => ({ useAuth: () => ({ user: null }) }));

describe('gift store navigation', () => {
  it.each(['missing', 'queue-only', 'throws'])('preserves the real link when analytics %s', (mode) => {
    window.dataLayer = [];
    window.gtag = mode === 'missing' ? undefined : mode === 'throws'
      ? vi.fn(() => { throw new Error('blocked'); }) : vi.fn();
    const open = vi.spyOn(window, 'open').mockImplementation(() => null);
    const rowClick = vi.fn();
    render(<WishListItemRow item={{ id: 'i1', name: 'Book', link: 'https://shop.test/book', claimed: false }}
      canEdit={false} onRowClick={rowClick} onEditClick={vi.fn()} onDeleteClick={vi.fn()} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'https://shop.test/book');
    expect(link).toHaveAttribute('target', '_blank');
    expect(fireEvent.click(link)).toBe(true);
    expect(fireEvent.click(link, { ctrlKey: true })).toBe(true);
    expect(fireEvent.click(link, { metaKey: true })).toBe(true);
    expect(rowClick).not.toHaveBeenCalled();
    expect(open).not.toHaveBeenCalled();
    open.mockRestore();
  });
});
