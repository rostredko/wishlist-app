import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

type RouteLang = 'ua' | 'en';

type Props = {
  lang: RouteLang;
  user: { uid: string } | null;
  signInLoading: boolean;
  isTelegram: boolean;
  onCreateClick: () => void;
};

export function HomePageBrandBar({ lang, user, signInLoading, isTelegram, onCreateClick }: Props) {
  const { t } = useTranslation(['home', 'examples'], { lng: lang });
  const { t: tAuth } = useTranslation('auth', { lng: lang });

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        mb: 2,
        flexWrap: 'wrap',
        rowGap: 1.5,
      }}
    >
      <Box
        component={RouterLink}
        to={`/${lang}`}
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 1.25,
          minWidth: 0,
          textDecoration: 'none',
          color: 'inherit',
          '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', borderRadius: 1 },
        }}
      >
        <Box
          aria-hidden
          sx={{ fontSize: { xs: '2.25rem', sm: '2.75rem' }, lineHeight: 1, userSelect: 'none' }}
        >
          🎁
        </Box>
        <Typography variant="h6" component="span" sx={{ fontWeight: 800, letterSpacing: 0.02 }}>
          {t('brandName')}
        </Typography>
      </Box>

      {!user ? (
        <Tooltip
          title={isTelegram ? tAuth('telegramInstructionTitle') : t('createTooltip')}
          placement="bottom-end"
        >
          <Box
            component="span"
            sx={{
              ml: { xs: 0, sm: 'auto' },
              width: { xs: '100%', sm: 'auto' },
              flexShrink: 0,
              display: 'inline-block',
            }}
          >
            <Button
              variant="contained"
              color="primary"
              size="medium"
              sx={{
                fontWeight: 700,
                width: { xs: '100%', sm: 'auto' },
              }}
              onClick={() => void onCreateClick()}
              disabled={signInLoading}
              aria-label={t('createBtn')}
            >
              {t('createBtn')}
            </Button>
          </Box>
        </Tooltip>
      ) : (
        <Box
          sx={{
            ml: { xs: 0, sm: 'auto' },
            width: { xs: '100%', sm: 'auto' },
            flexShrink: 0,
          }}
        >
          <Button
            variant="contained"
            color="primary"
            size="medium"
            sx={{
              fontWeight: 700,
              width: { xs: '100%', sm: 'auto' },
            }}
            onClick={() => void onCreateClick()}
            disabled={signInLoading}
            aria-label={t('createBtn')}
          >
            {t('createBtn')}
          </Button>
        </Box>
      )}
    </Box>
  );
}
