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

const SLUG = 'best-secret-santa-apps';

export default function BestSecretSantaAppsArticle({ origin, routeLang }: BlogArticleProps) {
  const { t: th } = useTranslation('home', { lng: routeLang });
  const { t: tb } = useTranslation('blog', { lng: routeLang });
  const canonicalUrl = `${origin}/en/blog/${SLUG}`;
  const alternates = resolveBlogAlternates(origin, 'en', SLUG)!;

  return (
    <>
      <SEOHead
        lang="en"
        title="Best Secret Santa Apps in 2026 - Draw + Wishlist Guide | WishList App Blog"
        description="Secret Santa needs two tools: a draw app and a wishlist. I run WishList App and here is how I pick the best Secret Santa setup for any group."
        canonical={canonicalUrl}
        alternates={alternates}
        keywords="secret santa app, best secret santa app 2026, secret santa wishlist, online gift exchange"
        structured={{
          article: {
            headline: 'Best Secret Santa Apps - What Actually Works in a Group Chat',
            datePublished: BLOG_LAST_UPDATED,
            dateModified: BLOG_LAST_UPDATED,
          },
          breadcrumbs: [
            { name: tb('breadcrumbHome'), url: `${origin}/en` },
            { name: tb('breadcrumbBlog'), url: `${origin}/en/blog` },
            { name: 'Best Secret Santa Apps', url: canonicalUrl },
          ],
        }}
      />

      <Box component="article" sx={{ pt: { xs: 6, md: 10 }, pb: 4 }}>
        <Container maxWidth="md">
          <Typography variant="h1" sx={{ fontWeight: 800, fontSize: { xs: 26, md: 34 }, mb: 2 }}>
            Best Secret Santa apps - what actually works in a group chat
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
            Secret Santa is two problems disguised as one. The draw - who gives to whom - and the
            wishlist - what to actually buy. Most people try to solve both with a single tool and
            end up with either chaos or a platform nobody in the group will sign up for. The
            cleaner approach is to treat them as separate and pick the right tool for each.
          </Typography>

          <Stack spacing={4}>
            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                The two problems you actually need to solve
              </Typography>

              <Typography variant="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                The draw
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                You need a fair random assignment where no one knows who got whom except their own
                match. Ideally nobody ends up assigned to themselves or their partner. This is a
                solved problem - there are several free tools that handle it well, and it does not
                need much more than that.
              </Typography>

              <Typography variant="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                The wishlist
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Once the draw is done, the assigned giver needs to know what to buy. Without a
                wishlist, you get a flood of DMs asking &quot;what do you actually want?&quot; and
                someone inevitably receives three identical items because communication broke down.
                A wishlist with claiming solves this - each giver can mark what they are buying, so
                nobody doubles up, and the recipient never sees who picked what.
              </Typography>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                Popular Secret Santa apps compared
              </Typography>
              <TableContainer component={Paper} variant="outlined" sx={{ bgcolor: 'background.paper' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>App</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Random draw</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Wishlist link</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>No guest signup</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Anonymous claims</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Free</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>DrawNames / Elfster</TableCell>
                      <TableCell>Yes, core feature</TableCell>
                      <TableCell>Built-in wishlist</TableCell>
                      <TableCell>No - signup required</TableCell>
                      <TableCell>Yes</TableCell>
                      <TableCell>Free tier</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Sneaky Santa</TableCell>
                      <TableCell>Yes</TableCell>
                      <TableCell>Limited</TableCell>
                      <TableCell>Partial</TableCell>
                      <TableCell>Partial</TableCell>
                      <TableCell>Free</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>WhatsApp group + spreadsheet</TableCell>
                      <TableCell>Manual</TableCell>
                      <TableCell>Manual</TableCell>
                      <TableCell>Yes</TableCell>
                      <TableCell>None</TableCell>
                      <TableCell>Yes</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>WishList App (wishlists only)</TableCell>
                      <TableCell>No</TableCell>
                      <TableCell>Yes, any store</TableCell>
                      <TableCell>Yes</TableCell>
                      <TableCell>Yes</TableCell>
                      <TableCell>Yes, no ads</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                WishList App handles the wishlist part only. For the draw, I use a separate free tool like
                DrawNames or a simple random name picker.
              </Typography>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                How I run Secret Santa with WishList App
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Here is the exact setup I use for group gift exchanges:
              </Typography>
              <Box component="ol" sx={{ pl: 3, mt: 0 }}>
                <Typography component="li" variant="body1" sx={{ mb: 1.5 }}>
                  Use any free draw tool (DrawNames, random.org, or even slips of paper) to assign
                  who gives to whom. Keep assignments private - only the giver sees their match.
                </Typography>
                <Typography component="li" variant="body1" sx={{ mb: 1.5 }}>
                  Each participant creates their own WishList App list and adds items with real URLs
                  and an optional description with relevant context (approximate price, size, color).
                </Typography>
                <Typography component="li" variant="body1" sx={{ mb: 1.5 }}>
                  Each person shares their wishlist link with their assigned Secret Santa - privately,
                  one-to-one, not in the group chat.
                </Typography>
                <Typography component="li" variant="body1" sx={{ mb: 1.5 }}>
                  The giver claims an item on the wishlist. The recipient never sees who claimed what
                  - only that something has been taken.
                </Typography>
                <Typography component="li" variant="body1">
                  On the day: no duplicates, no awkward &quot;I had no idea what you wanted&quot; moments,
                  no mandatory account signups that half the group ignored.
                </Typography>
              </Box>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                Tips that save every Secret Santa
              </Typography>
              <Box component="ul" sx={{ pl: 3, mt: 0 }}>
                <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                  Set a price range before wishlists are created - vague budgets lead to someone
                  spending &euro;80 while others spent &euro;20.
                </Typography>
                <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                  Give a hard deadline for wishlist creation - 2 weeks before the event is usually
                  enough. Without a deadline, one person always submits the night before.
                </Typography>
                <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                  For &quot;I don&apos;t know what I want&quot; participants: ask them to add three options
                  across different price points. Anything is better than nothing.
                </Typography>
                <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                  Remind people to add items from multiple stores - not just one retailer, especially
                  if participants are in different countries.
                </Typography>
                <Typography component="li" variant="body1">
                  Keep the wishlist link active after the event - it is useful if a gift arrives late
                  or someone buys a belated present.
                </Typography>
              </Box>
            </section>

            <section>
              <Typography variant="body1" sx={{ mb: 2 }}>
                See what a Secret Santa wishlist looks like from the guest side:{' '}
                <RouterLink to={`/${routeLang}/wishlist/secret-santa-list`}>
                  Secret Santa wishlist example
                </RouterLink>
                .
              </Typography>
              <Button
                component={RouterLink}
                to={`/${routeLang}/wishlist/secret-santa-list`}
                variant="contained"
                size="large"
              >
                {th('createBtn')}
              </Button>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                Related posts
              </Typography>
              <Typography variant="body1">
                The birthday wishlist flow uses the same claiming mechanic -{' '}
                <RouterLink to={`/${routeLang}/blog/how-to-create-a-birthday-wishlist`}>
                  how to create a birthday wishlist
                </RouterLink>{' '}
                has the full method. For a broader tool comparison,{' '}
                <RouterLink to={`/${routeLang}/blog/best-wishlist-apps-2026`}>
                  best wishlist apps in 2026
                </RouterLink>{' '}
                covers where each option wins.
              </Typography>
            </section>
          </Stack>

          <BlogArticleFooter routeLang={routeLang} />
        </Container>
      </Box>
    </>
  );
}
