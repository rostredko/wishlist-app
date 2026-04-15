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

const SLUG = 'amazon-wishlist-alternatives';

export default function AmazonWishlistAlternativesArticle({ origin, routeLang }: BlogArticleProps) {
  const { t: th } = useTranslation('home', { lng: routeLang });
  const { t: tb } = useTranslation('blog', { lng: routeLang });
  const canonicalUrl = `${origin}/en/blog/${SLUG}`;
  const alternates = resolveBlogAlternates(origin, 'en', SLUG)!;

  return (
    <>
      <SEOHead
        lang="en"
        title="Amazon Wishlist Alternatives - Best Multi-Store Gift Lists | WishList App Blog"
        description="I use Amazon wishlists and I built a multi-store alternative. Honest comparison of Amazon wishlist alternatives for when one retailer is not enough."
        canonical={canonicalUrl}
        alternates={alternates}
        keywords="amazon wishlist alternative, multi store wishlist, free wishlist online, gift list website, create gift list"
        structured={{
          article: {
            headline: 'Amazon Wishlist Alternatives - from someone who uses both',
            datePublished: BLOG_LAST_UPDATED,
            dateModified: BLOG_LAST_UPDATED,
          },
          breadcrumbs: [
            { name: tb('breadcrumbHome'), url: `${origin}/en` },
            { name: tb('breadcrumbBlog'), url: `${origin}/en/blog` },
            { name: 'Amazon Wishlist Alternatives', url: canonicalUrl },
          ],
        }}
      />

      <Box component="article" sx={{ pt: { xs: 6, md: 10 }, pb: 4 }}>
        <Container maxWidth="md">
          <Typography variant="h1" sx={{ fontWeight: 800, fontSize: { xs: 26, md: 34 }, mb: 2 }}>
            Amazon wishlist alternatives - from someone who uses both
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
            I shop on Amazon. I also built WishList App specifically because Amazon&apos;s wishlist
            kept failing me the moment a gift crossed one retailer boundary. This is not an
            anti-Amazon piece - I am just describing the cases where the tool runs out of road.
          </Typography>

          <Stack spacing={4}>
            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                When Amazon wins
              </Typography>
              <Typography variant="body1">
                Catalog depth, Prime checkout speed, and tight integration with purchase history make
                Amazon&apos;s own wishlist hard to beat for households where everything ships from one
                warehouse. If everyone in your gift circle is a Prime member and you only want items
                available there, the native tool is fine. I use it myself when that is the situation.
              </Typography>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                Where Amazon falls short
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                The cracks appear fast once your needs go slightly outside that narrow lane.
              </Typography>
              <Box component="ul" sx={{ pl: 3, mt: 0 }}>
                <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                  Items from Etsy, local boutiques, or any shop Amazon does not carry cannot be
                  added cleanly - the workarounds (custom items, notes) are clunky.
                </Typography>
                <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                  Guests cannot claim gifts anonymously in a way that protects the surprise from
                  the recipient - the spoiler problem is real depending on privacy settings.
                </Typography>
                <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                  Outside the US, Amazon availability varies. In Ukraine, Poland, or most of Eastern
                  Europe, Amazon is not the primary shopping destination. A wishlist tied to it
                  just creates friction.
                </Typography>
                <Typography component="li" variant="body1">
                  Niche or handmade items - a specific book from a small press, a local
                  experience gift, a custom print - simply do not exist in any Amazon catalog.
                </Typography>
              </Box>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                Quick comparison
              </Typography>
              <TableContainer component={Paper} variant="outlined" sx={{ bgcolor: 'background.paper' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Need</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Amazon Wishlist</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>WishList App</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Items from multiple shops</TableCell>
                      <TableCell>Clunky workaround</TableCell>
                      <TableCell>Paste any URL - that is the whole design</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Guests without accounts</TableCell>
                      <TableCell>Can view, limited interaction</TableCell>
                      <TableCell>Full claim functionality, no signup</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Anonymous gift claims</TableCell>
                      <TableCell>Varies by region and settings</TableCell>
                      <TableCell>Built-in - recipient never sees who claimed what</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Ukrainian / European shops</TableCell>
                      <TableCell>Not supported</TableCell>
                      <TableCell>Any URL works</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Etsy and handmade items</TableCell>
                      <TableCell>Not available</TableCell>
                      <TableCell>Paste the link directly</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Budget context for items</TableCell>
                      <TableCell>Shows live Amazon price automatically</TableCell>
                      <TableCell>Write it in the item description field</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                The four scenarios where I switch
              </Typography>

              <Typography variant="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                1. Birthday with a mixed shop list
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                The birthday person wants a book from a local shop, a specific skincare item from
                a brand that does not sell on Amazon, and something handmade from Etsy. One list,
                three shops. Amazon cannot hold all of that cleanly.
              </Typography>

              <Typography variant="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                2. European or Ukrainian context
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                If the gifter is in Kyiv, Warsaw, or Berlin and Amazon delivery is slow, expensive,
                or unavailable for the item - the whole premise breaks down. A store-agnostic link
                means gifters can buy locally and still know exactly what was wanted.
              </Typography>

              <Typography variant="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                3. Surprise protection matters
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                If the recipient cannot see who bought what, the gift experience stays intact.
                This is especially important for birthdays and Secret Santa. Amazon&apos;s privacy
                controls here are inconsistent enough that I would not rely on them.
              </Typography>

              <Typography variant="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                4. Friend group is not on Amazon
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Some people do most shopping at physical stores or regional online retailers.
                Asking them to create Amazon accounts or navigate an unfamiliar interface just to
                claim a gift adds friction for no reason.
              </Typography>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                What a store-agnostic wishlist actually looks like
              </Typography>
              <Typography variant="body1">
                With WishList App, the flow is: find the product anywhere online, copy the URL,
                paste it into the link field, add a name and an optional description with any context
                you want - price range, color, specific model - done. The guest
                sees a link to the actual product page at the actual shop. No screenshots, no
                guessing, no &quot;I think it was the blue one on the third shelf.&quot; They click,
                they buy, they mark it claimed - all without creating an account.
              </Typography>
            </section>

            <section>
              <Box sx={{ mt: 1 }}>
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
                Read next
              </Typography>
              <Typography variant="body1">
                If you want a broader view of what to look for,{' '}
                <RouterLink to={`/${routeLang}/blog/best-wishlist-apps-2026`}>
                  best wishlist apps in 2026
                </RouterLink>{' '}
                covers the full landscape. And if the occasion is a birthday specifically,{' '}
                <RouterLink to={`/${routeLang}/blog/how-to-create-a-birthday-wishlist`}>
                  how to create a birthday wishlist
                </RouterLink>{' '}
                walks through the method I actually use.
              </Typography>
            </section>
          </Stack>

          <BlogArticleFooter routeLang={routeLang} />
        </Container>
      </Box>
    </>
  );
}
