import { describe, it, expect, vi, beforeEach } from 'vitest';
import { customRender as render, screen } from '../test/render';
import userEvent from '@testing-library/user-event';
import BannerUploader from '@components/BannerUploader';

const uploadWishlistBanner = vi.fn();

vi.mock('@api/wishlistService', () => ({
  uploadWishlistBanner: (...args: any[]) => uploadWishlistBanner(...args),
}));

function makeFile({
                    name = 'pic.png',
                    type = 'image/png',
                    size,
                  }: { name?: string; type?: string; size?: number }) {
  const file = new File(['x'], name, { type });
  if (size !== undefined) {
    Object.defineProperty(file, 'size', { value: size });
  }
  return file;
}

function getHiddenInput(container: HTMLElement) {
  return container.querySelector('input[type="file"]') as HTMLInputElement;
}

describe('BannerUploader (skeleton behavior)', () => {
  beforeEach(() => {
    uploadWishlistBanner.mockReset();
    vi.restoreAllMocks();
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  it('does not render when canEdit=false', () => {
    const { container } = render(
      <BannerUploader wishlistId="wl-1" canEdit={false} onUpload={() => {}} />
    );
    expect(container).toBeTruthy();
    expect(screen.queryByRole('button', { name: /upload banner/i })).not.toBeInTheDocument();
  });

  it('happy path: uploads image, shows loader, calls onUpload', async () => {
    const onUpload = vi.fn();
    const { container, findByRole } = render(
      <BannerUploader wishlistId="wl-1" canEdit onUpload={onUpload} />
    );

    const button = screen.getByRole('button', { name: /upload banner/i });

    let resolve!: (v: string) => void;
    const url = 'https://cdn.example/banner.jpg';
    uploadWishlistBanner.mockImplementation(
      () =>
        new Promise<string>((r) => {
          resolve = r;
        })
    );

    const input = getHiddenInput(container);
    const file = makeFile({ type: 'image/jpeg', size: 1024 });

    await userEvent.upload(input, file);

    expect(button).toBeDisabled();
    expect(await findByRole('progressbar')).toBeInTheDocument();

    resolve(url);

    await vi.waitFor(() => {
      expect(uploadWishlistBanner).toHaveBeenCalledWith('wl-1', file);
      expect(onUpload).toHaveBeenCalledWith(url);
      expect(button).toBeEnabled();
    });
  });

  it('rejects non-image file types and shows alert', async () => {
    const onUpload = vi.fn();
    const { container } = render(
      <BannerUploader wishlistId="wl-1" canEdit onUpload={onUpload} />
    );

    const bad = makeFile({ name: 'doc.txt', type: 'text/plain', size: 50 });
    const input = getHiddenInput(container);

    await userEvent.upload(input, bad, { applyAccept: false });

    expect(window.alert).toHaveBeenCalledWith('Please select an image file.');
    expect(uploadWishlistBanner).not.toHaveBeenCalled();
    expect(onUpload).not.toHaveBeenCalled();
  });

  it('rejects files larger than limit and shows alert', async () => {
    const onUpload = vi.fn();
    const { container } = render(
      <BannerUploader wishlistId="wl-1" canEdit onUpload={onUpload} />
    );
    const tooBig = makeFile({ type: 'image/png', size: 8 * 1024 * 1024 + 1 });
    const input = getHiddenInput(container);

    await userEvent.upload(input, tooBig);

    expect(window.alert).toHaveBeenCalledWith(expect.stringMatching(/too large/i));
    expect(uploadWishlistBanner).not.toHaveBeenCalled();
    expect(onUpload).not.toHaveBeenCalled();
  });

  it('handles upload failure: alerts and clears loader', async () => {
    const onUpload = vi.fn();
    const { container } = render(
      <BannerUploader wishlistId="wl-1" canEdit onUpload={onUpload} />
    );

    uploadWishlistBanner.mockRejectedValueOnce(new Error('boom'));

    const input = getHiddenInput(container);
    const file = makeFile({ type: 'image/png', size: 1234 });

    await userEvent.upload(input, file);

    await vi.waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        'Failed to upload banner. Please try again.'
      );
      expect(screen.getByRole('button', { name: /upload banner/i })).toBeEnabled();
    });

    expect(onUpload).not.toHaveBeenCalled();
  });

  it('resets input after every attempt (we can upload again)', async () => {
    const onUpload = vi.fn();
    const { container } = render(
      <BannerUploader wishlistId="wl-1" canEdit onUpload={onUpload} />
    );

    uploadWishlistBanner.mockResolvedValueOnce('https://ok');

    const input = getHiddenInput(container);
    const file1 = makeFile({ type: 'image/png', size: 100 });
    await userEvent.upload(input, file1);

    await vi.waitFor(() => expect(onUpload).toHaveBeenCalledWith('https://ok'));
    onUpload.mockReset();

    const file2 = makeFile({ type: 'image/png', size: 100 });
    await userEvent.upload(input, file2);

    await vi.waitFor(() => expect(onUpload).toHaveBeenCalled());
  });
});