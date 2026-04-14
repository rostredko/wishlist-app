import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import DeleteIcon from '@mui/icons-material/Delete';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import type { WishList } from '@models/WishList';

type RouteLang = 'ua' | 'en';

type WLItem = WishList & { id: string };

type Props = {
  lang: RouteLang;
  isLoading: boolean;
  myLists: WLItem[] | null;
  signInLoading: boolean;
  onCreateClick: () => void;
  onDeleteRequest: (id: string, title?: string) => void;
};

export function HomePageMyListsSection({
  lang,
  isLoading,
  myLists,
  signInLoading,
  onCreateClick,
  onDeleteRequest,
}: Props) {
  const { t } = useTranslation(['home', 'examples'], { lng: lang });
  const navigate = useNavigate();

  return (
    <Stack sx={{ width: '100%', mt: 4, pb: 4 }} spacing={0}>
      <Stack spacing={2}>
        <Typography
          component="h2"
          variant="h5"
          sx={{
            fontWeight: 700,
            fontSize: { xs: 26, sm: 30, md: 32 },
            lineHeight: 1.25,
            textAlign: { xs: 'center', md: 'left' },
          }}
        >
          {t('your')}
        </Typography>

        {isLoading && (
          <Grid container spacing={2}>
            {Array.from({ length: 6 }).map((_, i) => (
              <Grid key={i} size={{ xs: 12, md: 6, lg: 4 }}>
                <Skeleton variant="rounded" height={96} />
              </Grid>
            ))}
          </Grid>
        )}

        {!isLoading && myLists && myLists.length === 0 && (
          <Card variant="outlined">
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography>{t('noLists')}</Typography>
                <Button variant="outlined" onClick={() => void onCreateClick()}>
                  {t('createOne')}
                </Button>
              </Stack>
            </CardContent>
          </Card>
        )}

        {!isLoading && myLists && myLists.length > 0 && (
          <Grid container spacing={2}>
            {myLists.map((wl) => (
              <Grid key={wl.id} size={{ xs: 12, md: 6, lg: 4 }}>
                <Card
                  variant="outlined"
                  onClick={() => navigate(`/${lang}/wishlist/${wl.id}`)}
                  sx={{
                    cursor: 'pointer',
                    display: 'flex',
                    transition: 'transform 120ms ease, box-shadow 120ms ease',
                    '&:hover': { transform: 'translateY(-2px)', boxShadow: 6 },
                  }}
                >
                  <CardContent
                    sx={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      p: 2,
                      '&:last-child': { pb: 2 },
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 700,
                        pr: 1,
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {wl.title || t('untitled')}
                    </Typography>
                    <IconButton
                      aria-label={t('deleteAria')}
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteRequest(wl.id, wl.title);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Stack>

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
    </Stack>
  );
}
