import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act } from 'react';
import { customRender as render, screen, within } from '../test/render';
import userEvent from '@testing-library/user-event';
import i18n from '../../src/i18n';
import { CreateWishListDialog } from '@components/CreateWishListDialog';

const createWishlist = vi.fn();
const navigate = vi.fn();
const copyWishlist = vi.fn();

vi.mock('@api/wishListService', () => ({
  createWishlist: (...args: unknown[]) => createWishlist(...args),
  copyWishlist: (...args: unknown[]) => copyWishlist(...args),
}));

vi.mock('react-router-dom', async (orig) => {
  const actual = await (orig as () => Promise<Record<string, unknown>>)();
  return {
    ...actual,
    useNavigate: () => navigate,
  };
});

describe('CreateWishListDialog (skeleton behavior)', () => {
  beforeEach(() => {
    createWishlist.mockReset();
    copyWishlist.mockReset();
    navigate.mockReset();
  });

  it('disables Create when title empty or user is null', async () => {
    const onClose = vi.fn();
    const { rerender } = render(
      <CreateWishListDialog open onClose={onClose} user={{ uid: 'u1' }} />
    );

    const createBtn = screen.getByRole('button', { name: /^create$/i });
    expect(createBtn).toBeDisabled();

    rerender(<CreateWishListDialog open onClose={onClose} user={null} />);
    expect(screen.getByRole('button', { name: /^create$/i })).toBeDisabled();
  });

  it('submits trimmed title, closes, clears input and navigates on success', async () => {
    const onClose = vi.fn();

    let resolve!: (id: string) => void;
    createWishlist.mockImplementation(
      () => new Promise<string>((r) => (resolve = r))
    );

    render(<CreateWishListDialog open onClose={onClose} user={{ uid: 'user-42' }} />);

    const input = screen.getByRole('textbox', { name: /wishlist name/i });
    const createBtn = screen.getByRole('button', { name: /^create$/i });

    await userEvent.type(input, '   My List   ');
    expect(createBtn).toBeEnabled();

    await userEvent.click(createBtn);

    expect(screen.getByRole('button', { name: /creating.../i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeDisabled();

    expect(createWishlist).toHaveBeenCalledWith('My List', 'user-42');

    await act(async () => {
      resolve('wl-777');
    });

    await vi.waitFor(() => {
      expect(navigate).toHaveBeenCalledWith(expect.stringMatching(/^\/(en|ua)\/wishlist\/wl-777$/));
      expect(onClose).toHaveBeenCalled();
      expect((input as HTMLInputElement).value).toBe('');
    });
  });

  it('Enter key in input triggers creation', async () => {
    const onClose = vi.fn();
    createWishlist.mockResolvedValueOnce('id-1');

    render(<CreateWishListDialog open onClose={onClose} user={{ uid: 'u1' }} />);

    const input = screen.getByRole('textbox', { name: /wishlist name/i });
    await userEvent.type(input, '  X  ');
    await userEvent.type(input, '{enter}');

    await vi.waitFor(() => {
      expect(createWishlist).toHaveBeenCalledWith('X', 'u1');
      expect(onClose).toHaveBeenCalled();
      expect(navigate).toHaveBeenCalledWith(expect.stringMatching(/^\/(en|ua)\/wishlist\/id-1$/));
    });
  });

  it('error path: logs error, stops loading, buttons re-enabled', async () => {
    const onClose = vi.fn();
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {
    });
    createWishlist.mockRejectedValueOnce(new Error('boom'));

    render(<CreateWishListDialog open onClose={onClose} user={{ uid: 'u1' }} />);

    const input = screen.getByRole('textbox', { name: /wishlist name/i });
    await userEvent.type(input, 'Y');

    await userEvent.click(screen.getByRole('button', { name: /^create$/i }));

    await vi.waitFor(() => {
      expect(screen.getByRole('button', { name: /^create$/i })).toBeEnabled();
      expect(screen.getByRole('button', { name: /cancel/i })).toBeEnabled();
      expect(onClose).not.toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalled();
      expect(screen.getByRole('alert')).toHaveTextContent(/could not create/i);
      expect(input).toHaveValue('Y');
    });
  });

  it('reviews the example title and copies resolved gifts only on explicit confirmation', async () => {
    const items = [{ id: 'template', name: 'Book', claimed: true, priceMinor: 2500, currency: 'USD' as const }];
    copyWishlist.mockResolvedValueOnce('copy-id');
    render(<CreateWishListDialog open user={{ uid: 'u1' }} onClose={vi.fn()} initialTitle="My birthday" copyItems={items} source="demo" />);
    expect(screen.getByRole('textbox', { name: /wishlist name/i })).toHaveValue('My birthday');
    expect(copyWishlist).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole('button', { name: /^create$/i }));
    await vi.waitFor(() => expect(copyWishlist).toHaveBeenCalledWith('My birthday', 'u1', items, 'demo_copy'));
    expect(createWishlist).not.toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith(expect.stringMatching(/\/wishlist\/copy-id$/));
  });

  it('Cancel calls safeClose (clears input and fires onClose)', async () => {
    const onClose = vi.fn();
    render(<CreateWishListDialog open onClose={onClose} user={{ uid: 'u1' }} />);

    const input = screen.getByRole('textbox', { name: /wishlist name/i });
    await userEvent.type(input, 'Something');

    await userEvent.click(screen.getByRole('button', { name: /cancel/i }));

    expect(onClose).toHaveBeenCalled();
    expect((input as HTMLInputElement).value).toBe('');
  });

  describe('seasonal title suggestions', () => {
    const suggestions = () => screen.queryByRole('group', { name: /holiday title ideas/i });

    beforeEach(() => {
      vi.useFakeTimers({ toFake: ['Date'] });
      window.gtag = vi.fn();
      window.dataLayer = [];
    });

    afterEach(() => {
      vi.useRealTimers();
      delete window.gtag;
      delete window.dataLayer;
    });

    it.each([
      ['Nov 1', new Date(2026, 10, 1, 0, 0)],
      ['Dec 31', new Date(2026, 11, 31, 23, 59)],
    ])('shows three chips on %s', (_label, now) => {
      vi.setSystemTime(now);
      render(<CreateWishListDialog open onClose={vi.fn()} user={{ uid: 'u1' }} />);
      expect(within(suggestions()!).getAllByRole('button').map(chip => chip.textContent)).toEqual([
        'Christmas Wish List 2026', "Kids' Christmas List", 'Secret Santa 2026',
      ]);
    });

    it.each([
      ['Oct 31', new Date(2026, 9, 31, 23, 59)],
      ['Jan 1', new Date(2027, 0, 1, 0, 0)],
    ])('hides the chips on %s', (_label, now) => {
      vi.setSystemTime(now);
      render(<CreateWishListDialog open onClose={vi.fn()} user={{ uid: 'u1' }} />);
      expect(suggestions()).toBeNull();
    });

    it('hides the chips when copying a list', () => {
      vi.setSystemTime(new Date(2026, 11, 1));
      const items = [{ id: 'template', name: 'Book', claimed: false }];
      render(<CreateWishListDialog open onClose={vi.fn()} user={{ uid: 'u1' }} initialTitle="Copy" copyItems={items} />);
      expect(suggestions()).toBeNull();
    });

    it('fills the title from a chip and reports only the bounded suggestion key', async () => {
      vi.setSystemTime(new Date(2026, 10, 20));
      render(<CreateWishListDialog open onClose={vi.fn()} user={{ uid: 'u1' }} />);
      await userEvent.click(screen.getByRole('button', { name: 'Secret Santa 2026' }));

      expect(screen.getByRole('textbox', { name: /wishlist name/i })).toHaveValue('Secret Santa 2026');
      expect(window.gtag).toHaveBeenCalledWith('event', 'title_suggestion_click', expect.objectContaining({ suggestion: 'secret_santa' }));
      expect(JSON.stringify(vi.mocked(window.gtag!).mock.calls)).not.toContain('Secret Santa 2026');
    });

    it('uses the Ukrainian titles with the coming New Year in Ukrainian', async () => {
      vi.setSystemTime(new Date(2026, 11, 10));
      await i18n.changeLanguage('ua');
      try {
        render(<CreateWishListDialog open onClose={vi.fn()} user={{ uid: 'u1' }} />);
        expect(within(screen.getByRole('group', { name: 'Ідеї назви до свят' })).getAllByRole('button').map(chip => chip.textContent)).toEqual([
          'Вішліст на Новий рік 2027', 'Лист Святому Миколаю', 'Таємний Санта 2026',
        ]);
      } finally {
        await i18n.changeLanguage('en');
      }
    });
  });

  it('while isCreating, both buttons disabled (guard against double submit)', async () => {
    const onClose = vi.fn();
    let resolve!: (id: string) => void;
    createWishlist.mockImplementation(
      () => new Promise<string>((r) => (resolve = r))
    );

    render(<CreateWishListDialog open onClose={onClose} user={{ uid: 'u1' }} />);

    const input = screen.getByRole('textbox', { name: /wishlist name/i });
    await userEvent.type(input, 'L');

    await userEvent.click(screen.getByRole('button', { name: /^create$/i }));

    expect(screen.getByRole('button', { name: /creating.../i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeDisabled();

    await act(async () => {
      resolve('ok-id');
    });
  });
});
