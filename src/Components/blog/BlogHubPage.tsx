import { Link as RouterLink, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { useTranslation } from 'react-i18next';

import SEOHead from '@components/SEOHead';
import { BLOG_SLUG_PAIRS } from '@constants/blogArticles';

export default function BlogHubPage() {
  const { lng } = useParams<{ lng: string }>();
  const lang = lng === 'ua' || lng === 'en' ? lng : 'ua';
  const seoLang = lang === 'ua' ? 'uk' : 'en';
  const { t } = useTranslation('blog', { lng: lang });

  const origin =
    typeof window !== 'undefined' ? window.location.origin : 'https://wishlistapp.com.ua';
  const canonicalUrl = `${origin}/${lang}/blog`;
  const alternates = {
    en: `${origin}/en/blog`,
    uk: `${origin}/ua/blog`,
  };

  const guideItemList = {
    name: t('hub.h1'),
    items: BLOG_SLUG_PAIRS.map((pair) => {
      const slug = lang === 'en' ? pair.en : pair.ua;
      return {
        name: t(`cards.${pair.en}.title`),
        url: `${origin}/${lang}/blog/${slug}`,
      };
    }),
  };

  return (
    <Box component="main" sx={{ pt: { xs: 6, md: 10 }, pb: 8 }}>
      <SEOHead
        lang={seoLang}
        title={t('hub.title')}
        description={t('hub.description')}
        canonical={canonicalUrl}
        alternates={alternates}
        keywords={t('hub.keywords')}
        structured={{
          breadcrumbs: [
            { name: t('breadcrumbHome'), url: `${origin}/${lang}` },
            { name: t('breadcrumbBlog'), url: canonicalUrl },
          ],
          guideItemList,
        }}
      />

      <Container maxWidth="md">
        <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          sx={{
            position: 'relative',
            mb: 2,
          }}
        >
          <Breadcrumbs
            sx={{
              mb: 2,
              flex: 1,
              minWidth: 0,
              pr: { xs: 15 },
              position: 'relative',
              zIndex: 1,
            }}
            aria-label="breadcrumb"
          >
            <Typography component={RouterLink} to={`/${lang}`} color="inherit" variant="body2">
              {t('breadcrumbHome')}
            </Typography>
            <Typography color="text.primary" variant="body2">
              {t('breadcrumbBlog')}
            </Typography>
          </Breadcrumbs>

          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Box
              component="img"
              src="/pencil_blog.png"
              alt=""
              aria-hidden="true"
              decoding="async"
              fetchPriority="low"
              sx={{
                display: { xs: 'none', md: 'block' },
                position: 'absolute',
                right: 0,
                top: '50%',
                width: { md: 200, lg: 220 },
                transform: 'translateY(calc(-50% - 18px))',
                opacity: 0.22,
                pointerEvents: 'none',
                userSelect: 'none',
              }}
            />
            <Typography
              variant="h1"
              sx={{
                position: 'relative',
                zIndex: 1,
                fontWeight: 800,
                fontSize: { xs: 28, md: 36 },
                pr: { md: 28 },
              }}
            >
              {t('hub.h1')}
            </Typography>
          </Box>

          <Box
            component="img"
            src="/pencil_blog.png"
            alt=""
            aria-hidden="true"
            decoding="async"
            fetchPriority="low"
            sx={{
              display: { xs: 'block', md: 'none' },
              position: 'absolute',
              top: 0,
              right: 0,
              zIndex: 0,
              width: 112,
              opacity: 0.22,
              pointerEvents: 'none',
              userSelect: 'none',
            }}
          />
        </Box>
        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
          {t('hub.description')}
        </Typography>

        <Stack spacing={2}>
          {BLOG_SLUG_PAIRS.map((pair) => {
            const slug = lang === 'en' ? pair.en : pair.ua;
            const to = `/${lang}/blog/${slug}`;
            return (
              <Card key={pair.en} variant="outlined">
                <CardActionArea component={RouterLink} to={to}>
                  <CardContent>
                    <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 20, mb: 1 }}>
                      {t(`cards.${pair.en}.title`)}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                      {t(`cards.${pair.en}.desc`)}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                      {t(`cards.${pair.en}.read`)}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            );
          })}
        </Stack>
        </Box>
      </Container>
    </Box>
  );
}
