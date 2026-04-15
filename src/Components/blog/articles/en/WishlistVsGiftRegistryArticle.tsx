import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
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

const SLUG = 'wishlist-vs-gift-registry';

export default function WishlistVsGiftRegistryArticle({ origin, routeLang }: BlogArticleProps) {
  const { t: tb } = useTranslation('blog', { lng: routeLang });
  const canonicalUrl = `${origin}/en/blog/${SLUG}`;
  const alternates = resolveBlogAlternates(origin, 'en', SLUG)!;

  return (
    <>
      <SEOHead
        lang="en"
        title="Wishlist vs Gift Registry - Honest Side-by-Side | WishList App Blog"
        description="I built a wishlist app, not a registry. Here is the clear difference between a wishlist and a gift registry - and when each one is the right choice."
        canonical={canonicalUrl}
        alternates={alternates}
        keywords="wishlist vs gift registry, gift registry vs wishlist, wedding registry alternative, online wish list"
        structured={{
          article: {
            headline: 'Wishlist vs Gift Registry - The Honest Difference',
            datePublished: BLOG_LAST_UPDATED,
            dateModified: BLOG_LAST_UPDATED,
          },
          faq: [
            {
              q: 'Is a wishlist the same as a gift registry?',
              a: 'Not exactly. A gift registry is usually tied to one retailer and associated with a formal occasion like a wedding. A wishlist can mix any shops and works for any occasion - birthdays, holidays, Secret Santa.',
            },
            {
              q: 'Do I need a registry for a wedding?',
              a: 'It depends on your context. A retailer registry works well if most guests shop at one store. If you have international guests or prefer specific items from various shops, a store-agnostic wishlist may work better or alongside a registry.',
            },
          ],
          breadcrumbs: [
            { name: tb('breadcrumbHome'), url: `${origin}/en` },
            { name: tb('breadcrumbBlog'), url: `${origin}/en/blog` },
            { name: 'Wishlist vs Gift Registry', url: canonicalUrl },
          ],
        }}
      />

      <Box component="article" sx={{ pt: { xs: 6, md: 10 }, pb: 4 }}>
        <Container maxWidth="md">
          <Typography variant="h1" sx={{ fontWeight: 800, fontSize: { xs: 26, md: 34 }, mb: 2 }}>
            Wishlist vs gift registry - the honest difference
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
            People use these words interchangeably, but they solve different problems. I have skin in
            this game - I built a wishlist app, not a registry platform. That choice was deliberate,
            and understanding the distinction is why I made it.
          </Typography>

          <Stack spacing={4}>
            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                Core difference in one table
              </Typography>
              <TableContainer component={Paper} variant="outlined" sx={{ bgcolor: 'background.paper' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Dimension</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Gift registry</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Wishlist</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Stores</TableCell>
                      <TableCell>Typically one retailer or chain</TableCell>
                      <TableCell>Any mix of shops and URLs</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Occasion type</TableCell>
                      <TableCell>Formal - wedding, baby shower, milestone</TableCell>
                      <TableCell>Any - birthday, holiday, everyday</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Guest experience</TableCell>
                      <TableCell>Checkout integrated with the retailer</TableCell>
                      <TableCell>Link to any store, claim tracked separately</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Claiming mechanism</TableCell>
                      <TableCell>Marked &quot;purchased&quot; in the retailer system</TableCell>
                      <TableCell>Claimed anonymously in the wishlist app</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Setup time</TableCell>
                      <TableCell>Can be involved - store visit or detailed scanning</TableCell>
                      <TableCell>Minutes - paste links from anywhere</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Checkout</TableCell>
                      <TableCell>Handled by the retailer</TableCell>
                      <TableCell>Guest buys wherever the link points</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Digital format</TableCell>
                      <TableCell>Often physical in-store component too</TableCell>
                      <TableCell>Fully digital, share a link</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                When a registry is the right call
              </Typography>
              <Typography variant="body1">
                I want to be honest here: a traditional registry genuinely wins in some situations.
                If you are planning a wedding and most guests shop at the same department store, the
                retailer registry is seamless - guests can walk into the store, scan a QR code, and
                buy. The tight checkout integration also means returns and exchanges are handled
                smoothly. For large household purchases - furniture, appliances, full kitchen sets -
                where you want specific SKUs, sizes, and colors confirmed, a registry gives you that
                structure. The same applies to baby showers where the gift list is stroller + car
                seat + crib and you need a specific model with a specific color option.
              </Typography>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                When a wishlist wins
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Outside the formal-occasion lane, a wishlist is almost always a better fit.
              </Typography>
              <Box component="ul" sx={{ pl: 3, mt: 0 }}>
                <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                  <strong>Birthdays:</strong> the honoree wants things from five different shops -
                  a registry cannot hold that gracefully.
                </Typography>
                <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                  <strong>Holidays and Secret Santa:</strong> a quick link in a group chat is all you need;
                  nobody wants to navigate a formal registry for a &euro;30 exchange.
                </Typography>
                <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                  <strong>Mixed international groups:</strong> if some gifters are in a different country,
                  they may not have access to the registry&apos;s store. Any-URL wishlists let them buy locally.
                </Typography>
                <Typography component="li" variant="body1">
                  <strong>Niche or handmade items:</strong> Etsy sellers, independent bookshops, local
                  experiences - none of these appear in any department store registry.
                </Typography>
              </Box>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                Can you have both?
              </Typography>
              <Typography variant="body1">
                Yes, and many people do. A common approach for weddings: use a department store
                registry for the big-ticket household items where the integrated checkout helps, and
                run a WishList App list alongside it for experiences, niche items, and anything from
                shops the registry does not carry. Guests can pick whichever list matches their
                shopping preference. Splitting by price tier also works - registry for large items,
                wishlist for smaller personal ones.
              </Typography>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                How I think about it when building WishList App
              </Typography>
              <Typography variant="body1">
                When I was designing the claiming mechanic, I deliberately kept it lightweight and
                anonymous rather than building retailer integrations. The reason is that most gifting
                happens at no fixed retailer - and I wanted guests to be able to buy at the shop
                they know and trust, rather than being funneled somewhere specific. The tradeoff is
                that I do not handle checkout at all: clicking a claimed item still goes to the
                original product page. That is intentional. The app&apos;s job is coordination, not
                commerce.
              </Typography>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                Related posts
              </Typography>
              <Typography variant="body1">
                For a broader comparison of tools,{' '}
                <RouterLink to={`/${routeLang}/blog/amazon-wishlist-alternatives`}>
                  Amazon wishlist alternatives
                </RouterLink>{' '}
                covers the multi-store angle in more detail. If you are setting up a list for a
                specific event,{' '}
                <RouterLink to={`/${routeLang}/blog/how-to-create-a-birthday-wishlist`}>
                  how to create a birthday wishlist
                </RouterLink>{' '}
                has the step-by-step method.
              </Typography>
            </section>
          </Stack>

          <BlogArticleFooter routeLang={routeLang} />
        </Container>
      </Box>
    </>
  );
}
