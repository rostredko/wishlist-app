import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useTranslation } from 'react-i18next';

import SEOHead from '@components/SEOHead';
import { BLOG_LAST_UPDATED, resolveBlogAlternates } from '@constants/blogArticles';
import type { BlogArticleProps } from '@components/blog/blogArticleTypes';
import { BlogArticleFooter } from '@components/blog/BlogArticleFooter';

const SLUG = 'best-wishlist-apps-2026';

export default function BestWishlistApps2026Article({ origin, routeLang }: BlogArticleProps) {
  const { t: th } = useTranslation('home', { lng: routeLang });
  const { t: tb } = useTranslation('blog', { lng: routeLang });
  const canonicalUrl = `${origin}/en/blog/${SLUG}`;
  const alternates = resolveBlogAlternates(origin, 'en', SLUG)!;

  return (
    <>
      <SEOHead
        lang="en"
        title="Best Wishlist Apps in 2026 - Honest Picks from a Builder | WishList App"
        description="I built WishList App and tested every major alternative. My honest breakdown of the best wishlist apps in 2026: speed, sharing, anonymous claims, and price."
        canonical={canonicalUrl}
        alternates={alternates}
        keywords="best wishlist apps 2026, wishlist app, online wishlist, gift list app, create wishlist free"
        structured={{
          article: {
            headline: 'Best Wishlist Apps in 2026 - Honest Picks from a Builder',
            datePublished: BLOG_LAST_UPDATED,
            dateModified: BLOG_LAST_UPDATED,
          },
          faq: [
            {
              q: 'What makes a good wishlist app in 2026?',
              a: 'Fast setup, no guest signup required, a private share link, and a way for guests to claim items anonymously so surprises are not spoiled.',
            },
            {
              q: 'Is WishList App free?',
              a: 'Yes - WishList App is completely free with no ads, as of 2026.',
            },
            {
              q: 'What is the best wishlist app for multiple stores?',
              a: 'WishList App accepts any URL from any shop, so you can mix Amazon, Etsy, local retailers, or any other store in a single list.',
            },
          ],
          breadcrumbs: [
            { name: tb('breadcrumbHome'), url: `${origin}/en` },
            { name: tb('breadcrumbBlog'), url: `${origin}/en/blog` },
            { name: 'Best Wishlist Apps in 2026', url: canonicalUrl },
          ],
        }}
      />

      <Box component="article" sx={{ pt: { xs: 6, md: 10 }, pb: 4 }}>
        <Container maxWidth="md">
          <Typography variant="h1" sx={{ fontWeight: 800, fontSize: { xs: 26, md: 34 }, mb: 2 }}>
            Best wishlist apps in 2026 - my honest take as the builder
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
            I built WishList App. I also obsessively test competitors whenever a new season comes around,
            because I want to know if my own product still earns its place or if I should be pointing people
            elsewhere. Here is what I actually think - no fake rankings, no affiliate links.
          </Typography>

          <Stack spacing={4}>
            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                What I look for in a wishlist app 🔍
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                When I evaluate any wishlist tool - including my own - I run it through five criteria.
                These come from watching real people use (and abandon) wishlist tools over the years.
              </Typography>
              <TableContainer component={Paper} variant="outlined" sx={{ bgcolor: 'background.paper' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Criterion</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Why it matters</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Store-agnostic</TableCell>
                      <TableCell>Real life means Etsy, local shops, and Amazon coexisting in one list</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>No guest signup</TableCell>
                      <TableCell>Every extra step loses a percentage of the people you sent the link to</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Anonymous claiming</TableCell>
                      <TableCell>Guests need to mark &quot;I&apos;m buying this&quot; without the recipient seeing who said it</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Fast setup</TableCell>
                      <TableCell>If it takes more than two minutes to get a shareable link, people give up</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Free tier that actually works</TableCell>
                      <TableCell>Paywalling core features punishes casual use - the most common use case</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                Full comparison at a glance 📊
              </Typography>
              <TableContainer component={Paper} variant="outlined" sx={{ bgcolor: 'background.paper' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>App</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Store-agnostic</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>No guest signup</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Anonymous claims</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Free</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>WishList App</TableCell>
                      <TableCell>Yes</TableCell>
                      <TableCell>Yes</TableCell>
                      <TableCell>Yes</TableCell>
                      <TableCell>Yes, no ads</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Amazon Wishlist</TableCell>
                      <TableCell>Amazon-first</TableCell>
                      <TableCell>Yes for viewing</TableCell>
                      <TableCell>Partial</TableCell>
                      <TableCell>Yes</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Elfster</TableCell>
                      <TableCell>Yes</TableCell>
                      <TableCell>No - signup required</TableCell>
                      <TableCell>Yes</TableCell>
                      <TableCell>Free tier exists</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>MyRegistry</TableCell>
                      <TableCell>Yes</TableCell>
                      <TableCell>Varies</TableCell>
                      <TableCell>Limited</TableCell>
                      <TableCell>Free tier exists</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Google Docs / Sheets</TableCell>
                      <TableCell>Manual</TableCell>
                      <TableCell>Yes</TableCell>
                      <TableCell>None built-in</TableCell>
                      <TableCell>Yes</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                My honest take on each option
              </Typography>

              <Typography variant="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                Amazon Wishlist
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                If your gift circle buys everything on Amazon Prime and stays in the same country, Amazon&apos;s
                wishlist is hard to beat for catalog depth. Where it breaks down: the moment someone wants
                something from a local shop, Etsy, or a European retailer, they are stuck. Claiming
                behavior also varies by region - in some markets guests can mark &quot;purchased&quot;, in others
                the recipient can see exactly who bought what, which kills surprises.
              </Typography>

              <Typography variant="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                Elfster
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Elfster does the Secret Santa draw well - it is probably the most polished dedicated app for
                that. The friction point is the signup wall for participants. I have seen group exchanges fall
                apart because three people in the chat refused to create another account. If everyone in your
                group is willing to register, Elfster is solid.
              </Typography>

              <Typography variant="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                Google Docs / Sheets
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Flexible and free forever. But there is no automated claiming - someone has to manually
                edit the sheet or leave a comment. Coordination overhead is real, and I have seen duplicate
                gifts happen because two people both typed &quot;I&apos;ll get this&quot; at the same time and neither
                noticed. Works better for small, organized households than for larger groups.
              </Typography>

              <Typography variant="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                WishList App - my own product
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                I will be straight with you: WishList App is not trying to be a full registry platform
                and it does not have a built-in draw feature for Secret Santa. What it does well is the
                core loop - add items with any URL from any shop, write context in the description field
                (price range, size, color - whatever helps), share one link, let guests
                claim without registering. It loads fast and has no ads. That is the thing I refuse to
                compromise on. If you need deep Amazon integration or a dedicated draw tool, a combination
                approach might make more sense.
              </Typography>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                When I reach for which tool
              </Typography>
              <TableContainer component={Paper} variant="outlined" sx={{ bgcolor: 'background.paper' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Situation</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>My pick</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Birthday, mixed shops, international friends</TableCell>
                      <TableCell>WishList App</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Amazon-only household, Prime-heavy circle</TableCell>
                      <TableCell>Amazon Wishlist</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Secret Santa with a draw needed</TableCell>
                      <TableCell>Elfster for the draw, WishList App for the wishlists</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Wedding registry at one department store</TableCell>
                      <TableCell>The store&apos;s own registry tool</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Quick internal team list, everyone in Google Workspace</TableCell>
                      <TableCell>Google Sheets is fine</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </section>

            <section>
              <Box sx={{ mt: 2 }}>
                <Button
                  component={RouterLink}
                  to={`/${routeLang}`}
                  variant="contained"
                  size="large"
                >
                  {th('createBtn')}
                </Button>
              </Box>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                Related posts
              </Typography>
              <Typography variant="body1">
                If you are looking at multi-store options specifically, I go deeper in{' '}
                <RouterLink to={`/${routeLang}/blog/amazon-wishlist-alternatives`}>
                  Amazon wishlist alternatives
                </RouterLink>
                . For a practical how-to, see{' '}
                <RouterLink to={`/${routeLang}/blog/how-to-create-a-birthday-wishlist`}>
                  how to create a birthday wishlist
                </RouterLink>
                . And if you are organizing an exchange,{' '}
                <RouterLink to={`/${routeLang}/blog/best-secret-santa-apps`}>
                  best Secret Santa apps
                </RouterLink>{' '}
                covers the full picture.
              </Typography>
            </section>
          </Stack>

          <BlogArticleFooter routeLang={routeLang} />
        </Container>
      </Box>
    </>
  );
}
