import {memo, useMemo} from 'react';
import {Box, Typography} from '@mui/material';
import {Link as RouterLink} from 'react-router-dom';

import BannerUploader from '@components/BannerUploader';
import type {WishList} from '@models/WishList';
import GiftLogo from '@assets/favicon.png';

type Props = {
  wishlist: WishList | null;
  canEdit: boolean;
  onBannerUpload: (newUrl: string) => void;
};

const WishlistHeader = ({wishlist, canEdit, onBannerUpload}: Props) => {
  if (!wishlist?.id) return null;

  const {id, bannerImage} = wishlist;

  const backgroundImage = useMemo(() => {
    return bannerImage
      ? `linear-gradient(0deg, rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url(${bannerImage})`
      : 'linear-gradient(135deg, #1a1a1a 0%, #2c2c2c 100%)';
  }, [bannerImage]);

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: {xs: 200, sm: 240, md: 260},
        backgroundImage,
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
              borderRadius: 2,
            },
          }}
        >
          <img src={GiftLogo} alt="WishList Logo" width={70} height={70}/>
          <Typography variant="h3" component="h1" sx={{m: 0, fontWeight: 800}}>
            MyWishList App
          </Typography>
        </Box>

        {canEdit && (
          <BannerUploader
            wishlistId={id}
            canEdit={canEdit}
            onUpload={onBannerUpload}
          />
        )}
      </Box>
    </Box>
  );
};

export default memo(WishlistHeader);