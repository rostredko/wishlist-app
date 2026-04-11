import { useParams } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import SEOHead from '@components/SEOHead';

export default function PrivacyPage() {
  const { lng } = useParams<{ lng: string }>();
  const lang = lng === 'ua' || lng === 'en' ? lng : 'ua';
  const seoLang = lang === 'ua' ? 'uk' : 'en';
  const { t } = useTranslation('privacy', { lng: lang });

  const origin =
    typeof window !== 'undefined' ? window.location.origin : 'https://wishlistapp.com.ua';
  const canonicalUrl = `${origin}/${lang}/privacy`;
  const alternates = {
    en: `${origin}/en/privacy`,
    uk: `${origin}/ua/privacy`,
  };

  const dataItems = t('dataItems', { returnObjects: true }) as string[];

  return (
    <Box component="main" sx={{ pt: { xs: 6, md: 10 }, pb: 8 }}>
      <SEOHead
        lang={seoLang}
        title={t('title')}
        description={t('intro')}
        canonical={canonicalUrl}
        alternates={alternates}
      />
      <Container maxWidth="md">
        <Typography variant="h1" sx={{ fontWeight: 800, fontSize: { xs: 28, md: 36 }, mb: 1 }}>
          {t('title')}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>
          {t('lastUpdated')}
        </Typography>

        <Typography variant="body1" sx={{ mb: 4 }}>
          {t('intro')}
        </Typography>

        <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 2 }}>
          {t('dataTitle')}
        </Typography>
        <Box component="ul" sx={{ pl: 3, mb: 4 }}>
          {Array.isArray(dataItems) &&
            dataItems.map((item, idx) => (
              <Typography key={idx} component="li" variant="body1" sx={{ mb: 1 }}>
                {item}
              </Typography>
            ))}
        </Box>

        <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 2 }}>
          {t('useTitle')}
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          {t('useText')}
        </Typography>

        <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 2 }}>
          {t('storageTitle')}
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          {t('storageText')}
        </Typography>

        <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 2 }}>
          {t('rightsTitle')}
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          {t('rightsText')}
        </Typography>

        <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 2 }}>
          {t('contactTitle')}
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          {t('contactText')}{' '}
          <a href={`mailto:${t('contactEmail')}`} style={{ color: 'inherit' }}>
            {t('contactEmail')}
          </a>
        </Typography>

        <Button component={RouterLink} to={`/${lang}`} variant="outlined" sx={{ mt: 2 }}>
          {t('backHome')}
        </Button>
      </Container>
    </Box>
  );
}
