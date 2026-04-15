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

const SLUG = 'how-to-create-a-birthday-wishlist';

export default function HowToCreateBirthdayWishlistArticle({ origin, routeLang }: BlogArticleProps) {
  const { t: th } = useTranslation('home', { lng: routeLang });
  const { t: tb } = useTranslation('blog', { lng: routeLang });
  const canonicalUrl = `${origin}/en/blog/${SLUG}`;
  const alternates = resolveBlogAlternates(origin, 'en', SLUG)!;

  return (
    <>
      <SEOHead
        lang="en"
        title="How to Create a Birthday Wishlist - The 4-Step Method | WishList App Blog"
        description="I designed WishList App for birthday gift lists. Here is the 4-step method I use: clear title, real links, a description with price range, and anonymous claiming."
        canonical={canonicalUrl}
        alternates={alternates}
        keywords="how to create birthday wishlist, birthday wishlist, birthday gift list online, make birthday wish list"
        structured={{
          article: {
            headline: 'How to Create a Birthday Wishlist - The 4-Step Method',
            datePublished: BLOG_LAST_UPDATED,
            dateModified: BLOG_LAST_UPDATED,
          },
          howTo: {
            name: 'Create a birthday wishlist',
            description: 'A 4-step method for a birthday wishlist that actually gets used.',
            steps: [
              { text: 'Pick a clear title that includes the year or occasion so guests immediately know what they are looking at.' },
              { text: 'Add items with real URLs and an optional description - you can include the price range, specific color, or model so guests know exactly what to buy.' },
              { text: 'Write a single one-line message with the wishlist link and drop it in the group chat you already use.' },
              { text: 'Tell guests they can claim an item anonymously - this prevents duplicate gifts and protects the surprise.' },
            ],
          },
          breadcrumbs: [
            { name: tb('breadcrumbHome'), url: `${origin}/en` },
            { name: tb('breadcrumbBlog'), url: `${origin}/en/blog` },
            { name: 'How to Create a Birthday Wishlist', url: canonicalUrl },
          ],
        }}
      />

      <Box component="article" sx={{ pt: { xs: 6, md: 10 }, pb: 4 }}>
        <Container maxWidth="md">
          <Typography variant="h1" sx={{ fontWeight: 800, fontSize: { xs: 26, md: 34 }, mb: 2 }}>
            How to create a birthday wishlist - the method I actually use
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
            Birthday gifting is the number one use case I designed WishList App for. I have watched
            too many lists die because the link got buried in a chat thread, items had no URLs, or
            nobody knew whether someone else had already bought something. The method below solves
            all three problems.
          </Typography>

          <Stack spacing={4}>
            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                My 4-step method
              </Typography>

              <Typography variant="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                Step 1 - Pick a clear title with the year
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                &quot;My 30th - 2026&quot; is immediately understood. &quot;Stuff I want&quot; is not. A
                specific title also prevents confusion when you have multiple lists for different
                occasions. I include the year because it helps me look back and also signals to
                guests that this is current and active.
              </Typography>

              <Typography variant="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                Step 2 - Add items with real URLs and a description
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                The URL is what makes the list actually work. Without it, guests are guessing which
                version of a product you meant - wrong color, wrong size, wrong model. Paste the
                direct product page link. If price matters for your crowd, write something like
                &quot;~$30&quot; in the item description - there is no dedicated price field, just a free-text
                description where you can add any context you want.
              </Typography>

              <Typography variant="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                Step 3 - Write one share message with the link
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                I write something like: &quot;If you were thinking of a gift for my birthday, here is
                what I actually want - [link]. No pressure, just easier than guessing.&quot; One message,
                one link, everywhere - WhatsApp group, email thread, family chat. The single source
                of truth matters; do not post different lists in different places.
              </Typography>

              <Typography variant="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                Step 4 - Tell guests they can claim
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                The claiming feature is the most underused part of any wishlist app. Guests can tap
                an item to mark it as &quot;I&apos;m buying this&quot; - anonymously, so you never see who
                picked what. This one feature eliminates duplicate gifts. I always mention it
                explicitly in my share message because people do not discover it on their own.
              </Typography>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                What to include vs skip
              </Typography>
              <TableContainer component={Paper} variant="outlined" sx={{ bgcolor: 'background.paper' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Item type</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Include?</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Reason</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Specific product with a URL</TableCell>
                      <TableCell>Yes</TableCell>
                      <TableCell>No guesswork for the buyer</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Price range note (e.g. &quot;~€30&quot;)</TableCell>
                      <TableCell>Yes</TableCell>
                      <TableCell>Saves guests from budget anxiety</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Vague descriptions without links</TableCell>
                      <TableCell>Skip</TableCell>
                      <TableCell>Leads to wrong items or no purchase</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Things you already own</TableCell>
                      <TableCell>Skip</TableCell>
                      <TableCell>Clean up duplicates before sharing</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Experience gifts (dinner, tickets)</TableCell>
                      <TableCell>Yes, with a note</TableCell>
                      <TableCell>Link to the venue or booking page if possible</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Extremely expensive items (&gt;10x typical budget)</TableCell>
                      <TableCell>Optional</TableCell>
                      <TableCell>Fine if labeled clearly - guests can skip it</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                How to share effectively
              </Typography>
              <Box component="ul" sx={{ pl: 3, mt: 0 }}>
                <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                  Share 3-4 weeks before the event - early enough to order, not so early people forget.
                </Typography>
                <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                  Send the same link in every channel you use - do not maintain separate lists per person.
                </Typography>
                <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                  Keep the list updated. Remove items that got purchased outside the app, add new ones
                  if your preferences change.
                </Typography>
                <Typography component="li" variant="body1">
                  A single reminder a week before is fine - more than that feels pushy.
                </Typography>
              </Box>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                Common mistakes I see
              </Typography>
              <TableContainer component={Paper} variant="outlined" sx={{ bgcolor: 'background.paper' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Mistake</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>What happens</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Fix</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>No product URLs</TableCell>
                      <TableCell>Guests buy the wrong variant or give up</TableCell>
                      <TableCell>Paste the direct product page, not just the brand name</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Sharing the list too late</TableCell>
                      <TableCell>Delivery misses the event date</TableCell>
                      <TableCell>Share 3-4 weeks out for anything that needs shipping</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Not mentioning the claim feature</TableCell>
                      <TableCell>Duplicate gifts land on your doorstep</TableCell>
                      <TableCell>One sentence in the share message: &quot;you can mark what you&apos;re getting&quot;</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Multiple versions of the list in different chats</TableCell>
                      <TableCell>Someone claims an item that was already purchased elsewhere</TableCell>
                      <TableCell>One URL, shared everywhere</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </section>

            <section>
              <Typography variant="body1" sx={{ mb: 2 }}>
                You can see what a finished birthday wishlist looks like in practice:{' '}
                <RouterLink to={`/${routeLang}/wishlist/birthday-list`}>
                  birthday wishlist example
                </RouterLink>
                .
              </Typography>
              <Button
                component={RouterLink}
                to={`/${routeLang}/wishlist/birthday-list`}
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
                If you are choosing between tools,{' '}
                <RouterLink to={`/${routeLang}/blog/best-wishlist-apps-2026`}>
                  best wishlist apps in 2026
                </RouterLink>{' '}
                covers the full landscape. If the occasion is a group gift exchange rather than a
                birthday,{' '}
                <RouterLink to={`/${routeLang}/blog/best-secret-santa-apps`}>
                  best Secret Santa apps
                </RouterLink>{' '}
                has the setup I recommend.
              </Typography>
            </section>
          </Stack>

          <BlogArticleFooter routeLang={routeLang} />
        </Container>
      </Box>
    </>
  );
}
