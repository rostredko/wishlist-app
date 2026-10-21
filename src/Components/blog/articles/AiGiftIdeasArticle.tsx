import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import SEOHead from '@components/SEOHead';
import { resolveBlogAlternates } from '@constants/blogArticles';
import { BlogArticleFooter } from '../BlogArticleFooter';
import type { BlogArticleProps } from '../blogArticleTypes';

type ArticleLink = { label: string; href: string };
type Section = {
  id: string;
  heading: string;
  paragraphs: string[];
  prompt?: string;
  bullets?: string[];
  after?: string;
  links?: ArticleLink[];
};
type ArticleContent = {
  title: string;
  description: string;
  h1: string;
  datePublished: string;
  dateModified: string;
  intro: string[];
  sections: Section[];
  sourcesHeading: string;
  sourcesIntro: string;
  sources: (ArticleLink & { note: string })[];
  cta: string;
  ctaNote: string;
};

export default function AiGiftIdeasArticle({ origin, routeLang }: BlogArticleProps) {
  const { t } = useTranslation('blog', { lng: routeLang });
  const content = t('articles.chatgpt-gift-ideas', { returnObjects: true }) as ArticleContent;
  const slug = routeLang === 'ua' ? 'yak-vybraty-podarunok-z-chatgpt' : 'chatgpt-gift-ideas';
  const canonical = `${origin}/${routeLang}/blog/${slug}`;

  return (
    <>
      <SEOHead
        lang={routeLang === 'ua' ? 'uk' : 'en'}
        title={content.title}
        description={content.description}
        canonical={canonical}
        alternates={resolveBlogAlternates(origin, routeLang, slug)}
        structured={{
          article: {
            headline: content.h1,
            datePublished: content.datePublished,
            dateModified: content.dateModified,
          },
          breadcrumbs: [
            { name: t('breadcrumbHome'), url: `${origin}/${routeLang}` },
            { name: t('breadcrumbBlog'), url: `${origin}/${routeLang}/blog` },
            { name: content.h1, url: canonical },
          ],
        }}
      />
      <Box component="article" sx={{ pt: { xs: 6, md: 10 }, pb: 4 }}>
        <Container maxWidth="md">
          <Typography variant="h1" sx={{ fontWeight: 800, fontSize: { xs: 26, md: 34 }, mb: 2 }}>
            {content.h1}
          </Typography>
          {content.intro.map(paragraph => (
            <Typography key={paragraph} sx={{ mb: 3, color: 'text.secondary' }}>{paragraph}</Typography>
          ))}
          <Stack spacing={4}>
            {content.sections.map(section => (
              <Box component="section" key={section.id} aria-labelledby={`gift-${section.id}`}>
                <Typography id={`gift-${section.id}`} variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                  {section.heading}
                </Typography>
                {section.paragraphs.map(paragraph => (
                  <Typography key={paragraph} sx={{ mb: 2 }}>{paragraph}</Typography>
                ))}
                {section.prompt && (
                  <Paper component="blockquote" variant="outlined" sx={{ m: 0, mb: 2, p: { xs: 2, sm: 3 } }}>
                    <Typography sx={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{section.prompt}</Typography>
                  </Paper>
                )}
                {section.bullets && (
                  <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                    {section.bullets.map(item => <Typography component="li" key={item} sx={{ mb: 1.5 }}>{item}</Typography>)}
                  </Box>
                )}
                {section.after && <Typography sx={{ mb: 2 }}>{section.after}</Typography>}
                {section.links && (
                  <Stack spacing={1} alignItems="flex-start">
                    {section.links.map(link => link.href.startsWith('/') ? (
                      <Link key={link.href} component={RouterLink} to={link.href}>{link.label}</Link>
                    ) : <Link key={link.href} href={link.href}>{link.label}</Link>)}
                  </Stack>
                )}
              </Box>
            ))}
            <Box>
              <Button component={RouterLink} to={`/${routeLang}`} state={{ creationSource: 'blog' }} variant="contained" sx={{ mb: 1 }}>
                {content.cta}
              </Button>
              <Typography variant="body2" color="text.secondary">{content.ctaNote}</Typography>
            </Box>
            <Box component="section" aria-labelledby="gift-sources">
              <Typography id="gift-sources" variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                {content.sourcesHeading}
              </Typography>
              <Typography sx={{ mb: 2 }}>{content.sourcesIntro}</Typography>
              <Box component="ul" sx={{ pl: 3 }}>
                {content.sources.map(source => (
                  <Box component="li" key={source.href} sx={{ mb: 2 }}>
                    <Link href={source.href}>{source.label}</Link>
                    <Typography variant="body2" color="text.secondary">{source.note}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Stack>
          <BlogArticleFooter routeLang={routeLang} date={content.dateModified} />
        </Container>
      </Box>
    </>
  );
}
