import { Box } from '@mui/material';
import BannerUploader from './BannerUploader';
import GiftLogo from '../../public/favicon.png';
import type { WishList } from '../types/WishList';
import { Link as RouterLink } from 'react-router-dom';

type Props = {
  wishlist: WishList | null;
  canEdit: boolean;
  onBannerUpload: (newUrl: string) => void;
};

const WishlistHeader = ({ wishlist, canEdit, onBannerUpload }: Props) => {
  if (!wishlist || !wishlist.id) {
    console.log('undefined');
    return null;
  }

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: 250,
        backgroundImage: wishlist.bannerImage ? `url(${wishlist.bannerImage})` : 'none',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 4,
        mb: 4,
      }}
    >
      <Box
        sx={{
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1.5,
        }}
      >
        <Box
          component={RouterLink}
          to="/"
          aria-label="Go to home"
          sx={{
            textDecoration: 'none',
            color: 'inherit',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1,
            cursor: 'pointer',
            '&:focus-visible': {
              outline: '2px solid rgba(255,255,255,0.6)',
              borderRadius: 8,
            },
          }}
        >
          <img src={GiftLogo} alt="WishList Logo" width={70} height={70} />
          <h1 style={{ margin: 0, fontSize: '2.5rem' }}>MyWishList App</h1>
        </Box>

        {canEdit && (
          <BannerUploader
            wishlistId={wishlist.id}
            canEdit={canEdit}
            onUpload={onBannerUpload}
          />
        )}
      </Box>
    </Box>
  );
};

export default WishlistHeader;