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
import { resolveBlogAlternates } from '@constants/blogArticles';
import type { BlogArticleProps } from '@components/blog/blogArticleTypes';
import { BlogArticleFooter } from '@components/blog/BlogArticleFooter';

const SLUG = 'how-to-create-a-wishlist';
const PUBLISHED = '2026-07-03';

export default function HowToCreateWishlistArticle({ origin, routeLang }: BlogArticleProps) {
  const { t: th } = useTranslation('home', { lng: routeLang });
  const { t: tb } = useTranslation('blog', { lng: routeLang });
  const canonicalUrl = `${origin}/en/blog/${SLUG}`;
  const alternates = resolveBlogAlternates(origin, 'en', SLUG);

  return (
    <>
      <SEOHead
        lang="en"
        title="How to Create a Wishlist People Actually Buy From | WishList App Blog"
        description="Three people gave me the same book one Christmas. Here is how to create a wishlist that fixes that: where to make one free, what to add, and how to share it without cringing."
        canonical={canonicalUrl}
        alternates={alternates}
        keywords="how to create a wishlist, how to make a wish list, what is a wishlist, create wishlist free, how to share a wishlist, online wishlist"
        structured={{
          article: {
            headline: 'How to Create a Wishlist People Actually Buy From',
            datePublished: PUBLISHED,
            dateModified: PUBLISHED,
          },
          howTo: {
            name: 'Create a wishlist online',
            description: 'Five steps from empty page to a shared wishlist your friends actually use.',
            steps: [
              { text: 'Sign in to a wishlist service - with WishList App a Google account is enough, and creating a list takes about 30 seconds.' },
              { text: 'Name the list after the occasion, like "Birthday 2026" or "Housewarming" - a clear title tells guests instantly what it is for.' },
              { text: 'Add each item with a direct product link and a short description - mention the price range, size, or color so nobody has to guess.' },
              { text: 'Share one link in the chat your friends already use - the same URL for everyone, no guest registration required.' },
              { text: 'Tell guests they can claim items anonymously - everyone sees what is taken, nobody sees who took it, so there are no duplicate gifts.' },
            ],
          },
          faq: [
            {
              q: 'What is a wishlist?',
              a: 'A wishlist is a list of things you would like to receive, with links to where they can be bought. You share it with friends or family before a birthday, holiday, or wedding so they know what to give - and, in a good wishlist app, they can reserve items so you never get two of the same gift.',
            },
            {
              q: 'Where can I create a wishlist for free?',
              a: 'WishList App is completely free with no ads - sign in with Google, add items from any online store, and share a single link. Store wishlists (like Amazon) are also free but lock you into one shop.',
            },
            {
              q: 'Do my friends need an account to see my wishlist?',
              a: 'No. Anyone with the link can open the list and anonymously claim a gift without registering. Only the list owner needs to sign in.',
            },
            {
              q: 'What should I put on a wishlist?',
              a: 'Specific items with direct product links work best: exact model, color, and size. Add a short description with a price range for context, mix a few price levels so every guest finds something, and skip vague entries like "something cozy".',
            },
          ],
          breadcrumbs: [
            { name: tb('breadcrumbHome'), url: `${origin}/en` },
            { name: tb('breadcrumbBlog'), url: `${origin}/en/blog` },
            { name: 'How to Create a Wishlist', url: canonicalUrl },
          ],
        }}
      />

      <Box component="article" sx={{ pt: { xs: 6, md: 10 }, pb: 4 }}>
        <Container maxWidth="md">
          <Typography variant="h1" sx={{ fontWeight: 800, fontSize: { xs: 26, md: 34 }, mb: 2 }}>
            How to create a wishlist people actually buy from
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
            One Christmas I unwrapped the same book three times. Same cover, same edition, three
            different relatives, each one proud of the idea. I laughed the first time. By the third
            I was doing the face you do when you pretend to be surprised. That evening my mom said
            &quot;well, you should have told us what you wanted&quot; - and she was right, and it
            annoyed me for years, and eventually it turned into this app. So this is not a neutral
            guide. This is everything I got wrong before I got it right.
          </Typography>

          <Stack spacing={4}>
            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                The things I tried first (so you can skip them)
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Before building anything I went through the whole evolutionary chain of wishlist
                technology. Every stage failed in its own way:
              </Typography>
              <TableContainer component={Paper} variant="outlined" sx={{ bgcolor: 'background.paper' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Attempt</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>How it died</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Telling people out loud</TableCell>
                      <TableCell>Nobody remembers a verbal answer from October in December</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Google Doc pinned in the family chat</TableCell>
                      <TableCell>My aunt worked from a screenshot she took two weeks earlier. Duplicate gift anyway</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Amazon wishlist</TableCell>
                      <TableCell>The one thing I really wanted that year was from a local shop. Not on Amazon. Off the list</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>&quot;Just surprise me&quot;</TableCell>
                      <TableCell>Three identical books. See above</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              <Typography variant="body1" sx={{ mt: 2 }}>
                The pattern behind every failure: the list and the coordination lived in different
                places. People could see what I wanted, but not what someone else had already
                bought. That second half is the entire problem.
              </Typography>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                What a wishlist actually is 🎁
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                A wishlist is a list of things you want, with links to where they can be bought,
                that other people can see. That is the whole concept. Wedding registries have
                worked like this for a century; the internet just removed the department store. The
                one modern addition that matters is anonymous claiming: guests quietly mark what
                they are buying, everyone else sees &quot;taken&quot;, and you see nothing at all.
                Gifts stop duplicating and the surprise survives.
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                And no, it is not greedy. I felt weird about it too, the first time. Then I noticed
                what happened on the giving side: my friends stopped stressing. Picking a gift from
                a list takes two minutes and lands every time. Guessing takes a weekend and lands
                maybe half the time. The list is a favor to them, not a demand from you. It took me
                embarrassingly long to believe that.
              </Typography>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                How I make a wishlist now - the 30-second version
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                The mechanics are genuinely fast. What takes thought is the content, and I will get
                to that.
              </Typography>

              <Typography variant="h6" component="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                1. Sign in and name the list after the occasion
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Google login, new list, done. I name mine like files: &quot;Birthday 2026&quot;,
                &quot;New apartment&quot;. My first list was called &quot;stuff&quot; and my friend
                asked me in all seriousness whether it was a moving checklist. Name the occasion.
              </Typography>

              <Typography variant="h6" component="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                2. Add real links, not vibes
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                &quot;Nice headphones&quot; is a vibe. A link to the exact model in the exact color
                is a gift. I paste the product page from whatever store has it - any store, any
                country - and add one line of context: &quot;~$40, the green one, size M&quot;.
                That one line is doing more work than everything else on the list.
              </Typography>

              <Typography variant="h6" component="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                3. Mix the prices on purpose
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                A couple of small things, a few mid-range, one honest dream item labeled as a dream
                item. A list where everything costs a fortune reads as a demand. A list with a $8
                pack of good coffee on it tells your broke student cousin he is welcome too.
              </Typography>

              <Typography variant="h6" component="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                4. One link for everyone
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                I send the same URL to every chat. Never two copies in two places: that recreates
                the screenshot problem that got me the duplicate gift in my Google Doc era. Guests
                open it in the browser, no account, no app install.
              </Typography>

              <Typography variant="h6" component="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                5. Say the claiming part out loud
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Nobody discovers the claim button on their own, so I literally write it in the
                message: &quot;you can tap an item to mark you are getting it, I will not see
                who&quot;. This one sentence is the difference between a wishlist and a lottery. I
                went deeper on this in{' '}
                <RouterLink to={`/${routeLang}/blog/best-secret-santa-apps`}>
                  best Secret Santa apps
                </RouterLink>
                , where duplicates hurt the most.
              </Typography>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                The message I actually send
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Word for word, from my last birthday:
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, mb: 2, bgcolor: 'background.paper' }}>
                <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                  &quot;If you were planning to get me something - here is what I would actually
                  use: [link]. Totally optional. You can tap an item there to mark it so nobody
                  doubles up. I will not see who picked what.&quot;
                </Typography>
              </Paper>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Three sentences. Nobody has ever replied with anything worse than a thumbs up. The
                fear that someone will think you are entitled? In four years of doing this and
                watching thousands of lists get shared, I have never once seen it happen. The
                timing matters more than the wording:
              </Typography>
              <Box component="ul" sx={{ pl: 3, mt: 0 }}>
                <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                  Send it 3-4 weeks out, so slow shipping is not your guests&apos; problem.
                </Typography>
                <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                  Best moment to share: the second someone asks &quot;what do you want?&quot;. That
                  question is a signed permission slip.
                </Typography>
                <Typography component="li" variant="body1">
                  Prune it when things change. I once left an already-bought kettle on my list for
                  a month. My friend was not thrilled.
                </Typography>
              </Box>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                Questions I keep getting
              </Typography>

              <Typography variant="h6" component="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                Where can I create a wishlist for free?
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                WishList App is free, no ads, no premium tier - that is the deal and the whole
                business model conversation is a different post. Store wishlists are free too but
                chain you to one shop, which is exactly how I lost my local-shop gift that year. I
                compared everything honestly in{' '}
                <RouterLink to={`/${routeLang}/blog/best-wishlist-apps-2026`}>
                  best wishlist apps in 2026
                </RouterLink>
                .
              </Typography>

              <Typography variant="h6" component="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                Do my friends need an account?
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                No. This is non-negotiable in my book: the moment a guest sees a signup form, you
                have lost a gift. Only the list owner signs in; guests just open the link and claim.
              </Typography>

              <Typography variant="h6" component="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                What should I actually put on it?
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                For the record, my current list: proper running socks (the expensive ones I never
                buy myself), a specific board game, a 51mm espresso tamper because I measured mine
                wrong the first time, and one labeled dream item, an office chair, that nobody is
                expected to buy. Specific, linked, mixed prices, one honest dream. That formula has
                not failed me yet.
              </Typography>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                Steal a finished list instead of starting blank
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Blank pages are where wishlists go to die, so we keep live examples you can look
                at:{' '}
                <RouterLink to={`/${routeLang}/wishlist/birthday-list`}>birthday</RouterLink>,{' '}
                <RouterLink to={`/${routeLang}/wishlist/christmas-list`}>Christmas</RouterLink>,{' '}
                <RouterLink to={`/${routeLang}/wishlist/wedding-list`}>wedding</RouterLink> and{' '}
                <RouterLink to={`/${routeLang}/wishlist/secret-santa-list`}>Secret Santa</RouterLink>.
                Birthdays have enough quirks that I keep a{' '}
                <RouterLink to={`/${routeLang}/blog/how-to-create-a-birthday-wishlist`}>
                  separate birthday checklist
                </RouterLink>{' '}
                too. Making one for the holidays? My guide on{' '}
                <RouterLink to={`/${routeLang}/blog/christmas-wishlist`}>
                  how to make a Christmas wish list
                </RouterLink>{' '}
                covers what changes when the whole family buys at once.
              </Typography>
              <Button
                component={RouterLink}
                to={`/${routeLang}`} state={{ creationSource: 'blog' }}
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
                Escaping a one-store list?{' '}
                <RouterLink to={`/${routeLang}/blog/amazon-wishlist-alternatives`}>
                  Amazon wishlist alternatives
                </RouterLink>{' '}
                is my field report. Not sure a wishlist fits your event at all?{' '}
                <RouterLink to={`/${routeLang}/blog/wishlist-vs-gift-registry`}>
                  Wishlist vs gift registry
                </RouterLink>{' '}
                sorts that out. And if you want the origin story of my list obsession,{' '}
                <RouterLink to={`/${routeLang}/blog/how-lists-change-your-life`}>
                  it starts in childhood
                </RouterLink>
                .
              </Typography>
            </section>
          </Stack>

          <BlogArticleFooter routeLang={routeLang} date={PUBLISHED} />
        </Container>
      </Box>
    </>
  );
}
