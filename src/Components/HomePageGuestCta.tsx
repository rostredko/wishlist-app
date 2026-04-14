import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';

type RouteLang = 'ua' | 'en';

type Props = {
  lang: RouteLang;
  signInLoading: boolean;
  onCreateClick: () => void;
};

export function HomePageGuestCta({ lang, signInLoading, onCreateClick }: Props) {
  const { t } = useTranslation(['home', 'examples'], { lng: lang });

  return (
    <Stack sx={{ width: '100%', mt: 4, pb: 4 }} spacing={0}>
      <Tooltip title={t('createTooltip')} placement="top">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            mt: 6,
          }}
        >
          <Button
            size="large"
            variant="contained"
            onClick={() => void onCreateClick()}
            disabled={signInLoading}
            aria-label={t('createBtn')}
            sx={{ width: { xs: '100%', md: 'auto' }, minWidth: { md: 300 }, px: { md: 5 } }}
          >
            {t('createBtn')}
          </Button>
        </Box>
      </Tooltip>
    </Stack>
  );
}
