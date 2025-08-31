import { describe, it, expect, vi, beforeEach } from 'vitest';
import { customRender as render, screen } from '../test/render';

vi.mock('@assets/favicon.png', () => ({ default: 'mock-logo.png' }));

const onUploadClick = vi.fn();

vi.mock('@components/BannerUploader', () => {
  return {
    default: (props: any) => {
      return (
        <button
          data-testid="mock-uploader"
          onClick={() => props.onUpload?.('https://new.url/banner.png')}
        >
          BannerUploader({props.wishlistId})
        </button>
      );
    },
  };
});

import WishlistHeader from '@components/WishListHeader';

const baseWishlist = (over: Partial<any> = {}) => ({
  id: 'wl-1',
  title: 'Test WL',
  bannerImage: undefined,
  ...over,
});

describe('WishlistHeader (skeleton behavior)', () => {
  beforeEach(() => {
    onUploadClick.mockReset();
  });

  it('returns null when wishlist missing or without id', () => {
    const { container: c1 } = render(
      <WishlistHeader wishlist={null} canEdit={false} onBannerUpload={onUploadClick} />
    );
    expect(c1.firstChild).toBeNull();

    const { container: c2 } = render(
      <WishlistHeader wishlist={{ title: 'No id' } as any} canEdit={false} onBannerUpload={onUploadClick} />
    );
    expect(c2.firstChild).toBeNull();
  });

  it('renders logo, title and home link', () => {
    render(<WishlistHeader wishlist={baseWishlist()} canEdit={false} onBannerUpload={onUploadClick} />);

    const homeLink = screen.getByRole('link', { name: /go to home/i });
    expect(homeLink).toHaveAttribute('href', '/');

    expect(screen.getByAltText(/wishlist logo/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /mywishlist app/i, level: 1 })).toBeInTheDocument();
  });

  it('does not render BannerUploader when canEdit=false', () => {
    render(<WishlistHeader wishlist={baseWishlist()} canEdit={false} onBannerUpload={onUploadClick} />);
    expect(screen.queryByTestId('mock-uploader')).not.toBeInTheDocument();
  });

  it('renders BannerUploader when canEdit=true and wires props', async () => {
    render(<WishlistHeader wishlist={baseWishlist()} canEdit={true} onBannerUpload={onUploadClick} />);
    const btn = await screen.findByTestId('mock-uploader');

    expect(btn).toHaveTextContent('BannerUploader(wl-1)');

    await (await import('@testing-library/user-event')).default.click(btn);
    expect(onUploadClick).toHaveBeenCalledWith('https://new.url/banner.png');
  });

  it('works also with bannerImage present (visual styles are not asserted)', () => {
    render(
      <WishlistHeader
        wishlist={baseWishlist({ bannerImage: 'https://img/banner.jpg' })}
        canEdit={true}
        onBannerUpload={onUploadClick}
      />
    );
    expect(screen.getByRole('link', { name: /go to home/i })).toBeInTheDocument();
    expect(screen.getByTestId('mock-uploader')).toBeInTheDocument();
  });
});