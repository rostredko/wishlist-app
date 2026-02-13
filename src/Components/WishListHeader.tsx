import { memo, useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import BannerUploader from '@components/BannerUploader';
import type { WishList } from '@models/WishList';
import GiftLogo from '@assets/favicon.png';

type Props = {
  wishlist: WishList | null;
  canEdit: boolean;
  isExampleWishlist?: boolean;
  isAdmin?: boolean;
  onBannerUpload: (newUrl: string) => void;
};

const WishlistHeader = ({ wishlist, canEdit, isExampleWishlist = false, isAdmin = false, onBannerUpload }: Props) => {
  if (!wishlist?.id) return null;

  const { id, bannerImage } = wishlist;
  const { lng } = useParams();
  const { t } = useTranslation('wishlist');

  const homeHref =
    lng === 'ua' || lng === 'en'
      ? `/${lng}`
      : '/';

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: { xs: 200, sm: 240, md: 260 },
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 4,
        mb: 4,
        overflow: 'hidden',
      }}
    >
      {/* Background Image or Gradient */}
      {bannerImage ? (
        <>
          <Box
            component="img"
            src={bannerImage}
            alt={t('wishlistBanner')}
            // @ts-expect-error - fetchPriority is available in React 19 but types might lag
            fetchPriority="high"
            sx={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              zIndex: 0,
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              background: 'linear-gradient(0deg, rgba(0,0,0,0.45), rgba(0,0,0,0.45))',
              zIndex: 1,
            }}
          />
        </>
      ) : (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2c2c2c 100%)',
            zIndex: 0,
          }}
        />
      )}

      <Box
        sx={{
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1.5,
          position: 'relative',
          zIndex: 2,
        }}
      >
        <Box
          component={RouterLink}
          to={homeHref}
          aria-label={t('backToHome')}
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
          <img src={GiftLogo} alt="WishList Logo" width={70} height={70} />
          <Typography variant="h3" component="h1" sx={{ m: 0, fontWeight: 800 }}>
            MyWishList App
          </Typography>
        </Box>

        {canEdit && (!isExampleWishlist || isAdmin) && (
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