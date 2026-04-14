import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

type RouteLang = 'ua' | 'en';

type Props = { lang: RouteLang };

export function HomePageHero({ lang }: Props) {
  const { t } = useTranslation(['home', 'examples'], { lng: lang });

  return (
    <Box className="hero" sx={{ width: '100%' }}>
      <Stack spacing={2} alignItems="flex-start" sx={{ width: '100%' }}>
        <Typography variant="h3" component="h1" sx={{ fontWeight: 800, display: 'flex', gap: 1 }}>
          {t('heroH1')}
        </Typography>
        <Typography
          variant="h5"
          component="h2"
          sx={{
            fontWeight: 500,
            opacity: 0.88,
            pb: 3,
            fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.375rem' },
            lineHeight: 1.45,
            maxWidth: '42rem',
          }}
        >
          {t('heroH2')}
        </Typography>
      </Stack>
    </Box>
  );
}
