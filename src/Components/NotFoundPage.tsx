import { Link as RouterLink, useParams, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import SEOHead from '@components/SEOHead';

export default function NotFoundPage() {
  const { lng } = useParams();
  const { pathname } = useLocation();
  const lang = (lng ?? pathname.split('/')[1]) === 'en' ? 'en' : 'ua';
  const { t } = useTranslation('home', { lng: lang });
  return (
    <Container component="main" maxWidth="md" sx={{ py: 8 }}>
      <SEOHead lang={lang === 'ua' ? 'uk' : 'en'} title={t('notFound.title')} description={t('notFound.body')} robots="noindex,follow" />
      <Typography variant="h3" component="h1" sx={{ mb: 2 }}>{t('notFound.h1')}</Typography>
      <Typography sx={{ mb: 3 }}>{t('notFound.body')}</Typography>
      <Button component={RouterLink} to={`/${lang}`} variant="contained">{t('notFound.backHome')}</Button>
    </Container>
  );
}
