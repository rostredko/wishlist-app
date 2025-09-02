import { describe, it, expect, vi } from 'vitest';
import { customRender as render, screen } from '../test/render';
import userEvent from '@testing-library/user-event';
import { CreateWishListDialog } from '@components/CreateWishListDialog';

const createWishlist = vi.fn();
const navigate = vi.fn();

vi.mock('@api/wishListService', () => ({
  createWishlist: (...args: any[]) => createWishlist(...args),
}));

vi.mock('react-router-dom', async (orig) => {
  const actual = await (orig as any)();
  return {
    ...actual,
    useNavigate: () => navigate,
  };
});

describe('CreateWishListDialog (skeleton behavior)', () => {
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
    expect(screen.getByRole('button', { name: /creating…/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeDisabled();

    expect(createWishlist).toHaveBeenCalledWith('My List', 'user-42');

    resolve('wl-777');

    await vi.waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('/wishlist/wl-777');
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
      expect(navigate).toHaveBeenCalledWith('/wishlist/id-1');
    });
  });

  it('error path: logs error, stops loading, buttons re-enabled', async () => {
    const onClose = vi.fn();
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
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
    });
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

    expect(screen.getByRole('button', { name: /creating…/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeDisabled();

    resolve('ok-id');
  });
});