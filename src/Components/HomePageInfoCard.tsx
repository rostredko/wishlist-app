import { lazy, Suspense, useMemo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

const VideoTutorialsSection = lazy(() => import('@components/VideoTutorialsSection'));

type RouteLang = 'ua' | 'en';

type Props = { lang: RouteLang };

export function HomePageInfoCard({ lang }: Props) {
  const { t } = useTranslation(['home', 'examples'], { lng: lang });

  const exampleCards = useMemo(() => {
    const cards = t('examples:cards', { returnObjects: true }) as Array<{
      title: string;
      emoji: string;
      wishlistId: string;
    }>;
    if (!Array.isArray(cards)) {
      return [];
    }
    return cards.map((card) => ({
      path: `/${lang}/wishlist/${card.wishlistId}`,
      title: card.title,
      emoji: card.emoji,
      wishlistId: card.wishlistId,
    }));
  }, [lang, t]);

  return (
    <Card variant="outlined" sx={{ bgcolor: 'background.paper' }}>
      <CardContent>
        <Stack spacing={2}>
          <Typography
            component="h2"
            variant="subtitle1"
            sx={{ fontWeight: 700, fontSize: { xs: 22, sm: 25 } }}
          >
            {t('what')}
          </Typography>

          <Stack
            spacing={2}
            sx={{
              pl: { xs: 2, sm: 4, md: 4 },
              m: 0,
            }}
          >
            {(t('whatList', { returnObjects: true }) as string[]).map((item, idx) => (
              <Typography
                key={idx}
                variant="body1"
                sx={{ fontSize: 18, display: 'flex', alignItems: 'flex-start', gap: 1 }}
              >
                {item}
              </Typography>
            ))}
          </Stack>

          <Divider />

          <Typography
            component="h2"
            variant="subtitle1"
            sx={{ fontWeight: 700, fontSize: { xs: 20, sm: 22 } }}
          >
            {t('how')}
          </Typography>

          <Stack
            component="ul"
            spacing={2}
            sx={{
              pl: { xs: 3, sm: 5, md: 6 },
              m: 0,
              listStylePosition: 'outside',
            }}
          >
            {(['li1', 'li2', 'li3', 'li4'] as const).map((key) => (
              <li key={key}>
                <Typography
                  variant="body1"
                  sx={{ fontSize: 18, display: 'flex', alignItems: 'flex-start', gap: 1 }}
                >
                  {t(key)}
                </Typography>
              </li>
            ))}
          </Stack>

          <Divider />

          <Suspense
            fallback={
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="60%" height={32} sx={{ mb: 1 }} />
                  <Skeleton variant="rectangular" height={0} sx={{ paddingTop: '56.25%', borderRadius: 2 }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="60%" height={32} sx={{ mb: 1 }} />
                  <Skeleton variant="rectangular" height={0} sx={{ paddingTop: '56.25%', borderRadius: 2 }} />
                </Box>
              </Stack>
            }
          >
            <VideoTutorialsSection lang={lang} />
          </Suspense>

          <Divider />

          <Typography component="h2" variant="subtitle1" sx={{ fontWeight: 700, fontSize: 24 }}>
            {t('examplesTitle')}
          </Typography>
          <Box sx={{ mb: 8 }}>
            <Grid container spacing={2}>
              {exampleCards.map((ex) => (
                <Grid key={ex.path} size={{ xs: 12, md: 6 }}>
                  <Card
                    variant="outlined"
                    component={RouterLink}
                    to={ex.path}
                    sx={{
                      height: '100%',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      textDecoration: 'none',
                      color: 'inherit',
                      px: { xs: 2, sm: 3 },
                      py: { xs: 1.5, sm: 2 },
                      '&:hover': { boxShadow: 6, transform: 'translateY(-2px)' },
                      transition: 'all 120ms ease',
                      gap: 2,
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontSize: { xs: 24, sm: 28 }, lineHeight: 1 }}>{ex.emoji}</Typography>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 700,
                          pr: 1,
                          overflow: 'hidden',
                          whiteSpace: { xs: 'normal', sm: 'normal' },
                          display: { sm: '-webkit-box' },
                          WebkitLineClamp: { sm: 2 },
                          WebkitBoxOrient: { sm: 'vertical' },
                        }}
                      >
                        {ex.title}
                      </Typography>
                    </Stack>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
