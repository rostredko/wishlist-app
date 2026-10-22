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

const SLUG = 'christmas-wishlist';
const PUBLISHED = '2026-10-22';

export default function ChristmasWishlistArticle({ origin, routeLang }: BlogArticleProps) {
  const { t: tb } = useTranslation('blog', { lng: routeLang });
  const canonicalUrl = `${origin}/en/blog/${SLUG}`;
  const alternates = resolveBlogAlternates(origin, 'en', SLUG);

  return (
    <>
      <SEOHead
        lang="en"
        title="How to Make a Christmas Wish List (and Share It With Family) in 2026"
        description="Make a Christmas wish list in 5 minutes: what to add, how to share one link with family, and how guests claim gifts so nobody buys duplicates. Free, no ads."
        canonical={canonicalUrl}
        alternates={alternates}
        keywords="christmas wish list, how to make a christmas list, christmas list maker, online christmas list, share christmas list with family, avoid duplicate christmas gifts"
        structured={{
          article: {
            headline: 'How to make a Christmas wish list and share it with family',
            datePublished: PUBLISHED,
            dateModified: PUBLISHED,
          },
          howTo: {
            name: 'Make a Christmas wish list',
            description: 'Five steps: a seasonal name, 8-15 gifts, links and prices across budgets, notes on size and color, and one link for the whole family.',
            steps: [
              { text: 'Name the list after the season, for example "Christmas 2026", so anyone opening the link knows what it is for.' },
              { text: 'Add 8-15 gifts so there is still a choice left for whoever opens the list last.' },
              { text: 'Give each gift a link to the product page and a rough price, mixing small, medium and bigger budgets.' },
              { text: 'Write the size, color or model in the description so nobody has to ask.' },
              { text: 'Send one link to the family chat and ask everyone to claim the gift they pick.' },
            ],
          },
          faq: [
            {
              q: 'When should I send my Christmas list?',
              a: 'By the end of November. Black Friday falls on November 27 in 2026 and plenty of people buy gifts in the sales. December shipping is slower too, so three or four weeks of slack never hurts.',
            },
            {
              q: 'Do my relatives need an account?',
              a: 'No. Only you need a Google account to create the list. Relatives open the link in any browser, browse the list and claim a gift without signing up.',
            },
            {
              q: 'Will I see who claimed a gift?',
              a: 'No, nobody sees names. You will see which gifts are claimed, because they show as taken to everyone, including you. If you want a surprise, stop opening your list once you have shared it.',
            },
            {
              q: 'How many items should be on a Christmas list?',
              a: 'For the holidays I suggest 8-15. Fewer, and whoever opens the list last finds nothing left. More, and the list turns into a catalog that is hard to choose from.',
            },
            {
              q: 'Is WishList App free?',
              a: 'Yes. WishList App is free with no ads and no premium tier. You can create as many lists as you like, and your family never pays or signs up to claim a gift.',
            },
          ],
          breadcrumbs: [
            { name: tb('breadcrumbHome'), url: `${origin}/en` },
            { name: tb('breadcrumbBlog'), url: `${origin}/en/blog` },
            { name: 'How to Make a Christmas Wish List', url: canonicalUrl },
          ],
        }}
      />

      <Box component="article" sx={{ pt: { xs: 6, md: 10 }, pb: 4 }}>
        <Container maxWidth="md">
          <Typography variant="h1" sx={{ fontWeight: 800, fontSize: { xs: 26, md: 34 }, mb: 2 }}>
            How to make a Christmas wish list and share it with family
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, color: 'text.secondary' }}>
            To make a Christmas wish list, create a list in WishList App with your Google account,
            add 8-15 gifts with links, rough prices and notes on size or color, then send one link to
            the family chat. Relatives open it without signing up and claim a gift, so everyone sees
            what is taken and nobody buys duplicates.
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Christmas is the one time of year when everybody buys you something in the same two
            weeks. Parents, siblings, the aunt who always asks, your partner&apos;s family. I have told
            the story of unwrapping the same book three times one Christmas in my guide on{' '}
            <RouterLink to={`/${routeLang}/blog/how-to-create-a-wishlist`}>how to create a wishlist</RouterLink>.
            Since then I make a Christmas list every year, and it works a little differently from a
            birthday list. Here is the method.
          </Typography>

          <Stack spacing={4}>
            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                How do you make a Christmas wish list? 5 steps
              </Typography>

              <Typography variant="h6" component="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                1. Name the list after the season
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                &quot;Christmas 2026&quot; or &quot;Anna&apos;s Christmas list&quot; tells anyone who opens
                the link a week later exactly what they are looking at. The year in the list name
                helps too: next winter you will start a fresh list, and nobody will shop from the old
                one by mistake. You can rename the list at any time by tapping its title.
              </Typography>

              <Typography variant="h6" component="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                2. Add 8-15 gifts
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                For a birthday, five to seven items are enough for me. A Christmas list needs more,
                because more people are buying at the same time. With five items and a big family,
                whoever opens the link last finds everything already claimed. With thirty items, the
                list reads like a catalog and nobody can decide. Somewhere between 8 and 15 gives
                people a real choice without the chaos.
              </Typography>

              <Typography variant="h6" component="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                3. Add links and prices across budgets
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Every gift gets a link to the exact product, from any store. WishList App has an
                optional price field with a currency, and I use it: it lets relatives pick something
                that fits their budget instead of guessing. Mix the prices on purpose - a few small
                things, several mid-range ones, and one or two bigger items people can share.
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                There is a timing reason as well. Black Friday falls on November 27 in 2026, and a lot
                of people do their Christmas shopping in those sales. If your list only appears in
                December, those gifts have already been bought blind.
              </Typography>

              <Typography variant="h6" component="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                4. Write the size, color and model
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                The description field is the most useful part of the whole list. &quot;Sweater, size M,
                anything but red&quot;, &quot;Over-ear headphones, earbuds hurt&quot;, &quot;Paperback,
                not the e-book&quot;. One line saves ten &quot;which one exactly?&quot; messages. For
                clothes and shoes I always add the size: it is the thing relatives most often do not
                know and feel awkward asking.
              </Typography>

              <Typography variant="h6" component="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                5. Share one link
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Copy the link to your list and post it in the family chat - once, in one place.
                Relatives do not need to sign up or install anything: they open the page in a browser,
                pick a gift and claim it. My message goes something like this:
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, mb: 2, bgcolor: 'background.paper' }}>
                <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                  &quot;If you were wondering what to get me this Christmas, here is my list: [link].
                  Totally optional. If you pick something, tap it and claim it so nobody else buys the
                  same thing.&quot;
                </Typography>
              </Paper>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                What should you put on a Christmas list?
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                A Christmas list is not quite a birthday list. More people, more budgets, and it is
                winter: warm things, cozy evenings in, something to do over the long break. This is
                how I spread ideas across price ranges:
              </Typography>
              <TableContainer component={Paper} variant="outlined" sx={{ bgcolor: 'background.paper' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Budget (EUR/USD)</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>What fits</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Who it is for</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Under 25</TableCell>
                      <TableCell>Wool socks, coffee beans or tea, a tree ornament, a paperback</TableCell>
                      <TableCell>Colleagues, nieces and nephews, anyone who wants to give something small</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>25-60</TableCell>
                      <TableCell>A board game, a blanket, a travel mug, a bookshop gift card</TableCell>
                      <TableCell>The heart of the list: most of the family will pick from here</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>60-120</TableCell>
                      <TableCell>Headphones, concert or theater tickets, a cooking class</TableCell>
                      <TableCell>Parents, or two or three people chipping in together</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Over 120</TableCell>
                      <TableCell>One honestly labeled dream item</TableCell>
                      <TableCell>Add a note: &quot;only if a few of you want to share it&quot;</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              <Typography variant="body1" sx={{ mt: 2 }}>
                Leave off anything you will buy for yourself before Christmas anyway, and anything you
                need tomorrow. The example list at the end of this post has eleven gifts like these -
                you can copy it and rework it in a few minutes.
              </Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                Need more ideas? See{' '}
                <RouterLink to={`/${routeLang}/blog/what-to-put-on-christmas-list`}>
                  what to put on your Christmas list
                </RouterLink>
                : 70 ideas sorted by budget, from wool socks to experiences and donations.
              </Typography>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                What mistakes ruin a Christmas list?
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
                      <TableCell>Sharing the list in mid-December</TableCell>
                      <TableCell>Half the gifts were already bought blind</TableCell>
                      <TableCell>Share the link by the end of November</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Only expensive gifts</TableCell>
                      <TableCell>Relatives feel awkward and buy something else</TableCell>
                      <TableCell>Add a few items under 25 EUR/USD</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>No sizes or models</TableCell>
                      <TableCell>The wrong sweater size, the wrong kind of headphones</TableCell>
                      <TableCell>Put the size and color in the note</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Different copies of the list in different chats</TableCell>
                      <TableCell>A claim in one copy does not show in the other</TableCell>
                      <TableCell>One link for the whole family</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Not asking people to claim</TableCell>
                      <TableCell>Nobody notices the claim button and duplicates come back</TableCell>
                      <TableCell>One sentence about claiming in your message</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                Is it rude to send a Christmas wish list?
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Not when people are asking - and at Christmas, they almost always are. I felt awkward
                about it at first too. It looked like a list of demands. From the giver&apos;s side it
                is the opposite: choosing from a list takes five minutes, while guessing takes a few
                evenings in shops and still might miss.
              </Typography>
              <Typography variant="body1" sx={{ mb: 1.5 }}>
                A few rules keep it from reading like an invoice:
              </Typography>
              <Box component="ul" sx={{ pl: 3, mt: 0 }}>
                <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                  Share it when someone asks &quot;what do you want?&quot;, or once in the family chat
                  - not to each person with a reminder.
                </Typography>
                <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                  Say &quot;totally optional&quot; and mean it.
                </Typography>
                <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                  Put small things next to the expensive ones so every budget has a choice.
                </Typography>
                <Typography component="li" variant="body1">
                  Never remind people more than once.
                </Typography>
              </Box>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                How do you stop family buying duplicate gifts?
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                With claiming. When a relative picks a gift, they tap it and confirm. From then on the
                gift shows as taken to everyone who opens the list, so the next person picks
                something else.
              </Typography>
              <TableContainer component={Paper} variant="outlined" sx={{ bgcolor: 'background.paper', mb: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Who</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>What they see</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>What they can do</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>You, the list owner</TableCell>
                      <TableCell>Every gift and which ones are claimed, without names</TableCell>
                      <TableCell>Add and edit gifts, release a claim</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Family with the link</TableCell>
                      <TableCell>Which gifts are free and which are taken</TableCell>
                      <TableCell>Claim a free gift without an account</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              <Typography variant="body1" sx={{ mb: 2 }}>
                One honest caveat: as the owner, you can see which gifts are claimed too. Nobody sees
                names, but everyone - you included - sees that a gift is taken. If you want the
                presents to be a complete surprise, simply stop opening your list once you have shared
                the link.
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                And claiming only works if people use it. The app cannot see a gift bought outside the
                list, which is why my message always asks people to claim what they pick.
              </Typography>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                How do you keep the list up to date?
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                A Christmas list lives for a few weeks, so give it a little care. If you buy something
                for yourself, delete it before anyone claims it. A gift that is already claimed is
                better left alone, though: whoever claimed it may have paid for it already. New ideas
                are fine to add at any time - they show up for everyone who opens the same link, with
                no need to send it again.
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                After the holidays there is no need to delete the list. Next winter, start a new one
                with the new year in its name, and keep the old one as a record of what you were given.
              </Typography>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                Should the kids get their own list?
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Yes. Children&apos;s gifts are different, often bought earlier, and grandparents tend to
                want a list of their own to work from. Make one list per child, created on your own
                account, so the child never sees what has been claimed. In many European families St.
                Nicholas visits on December 6, which moves the deadline even earlier. I wrote up the
                whole process, from the letter to Santa to the shared list, in{' '}
                <RouterLink to={`/${routeLang}/blog/kids-christmas-list`}>
                  kids&apos; Christmas list
                </RouterLink>
                . If your office or friends run a gift exchange, the{' '}
                <RouterLink to={`/${routeLang}/blog/secret-santa-questionnaire`}>
                  Secret Santa questionnaire
                </RouterLink>{' '}
                helps you build a short list for that too.
              </Typography>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                Frequently asked questions
              </Typography>

              <Typography variant="h6" component="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                When should I send my Christmas list?
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                By the end of November. Black Friday falls on November 27 in 2026 and plenty of people
                buy gifts in the sales. December shipping is slower too, so three or four weeks of
                slack never hurts.
              </Typography>

              <Typography variant="h6" component="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                Do my relatives need an account?
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                No. Only you need a Google account to create the list. Relatives open the link in any
                browser, browse the list and claim a gift without signing up.
              </Typography>

              <Typography variant="h6" component="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                Will I see who claimed a gift?
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                No, nobody sees names. You will see which gifts are claimed, because they show as taken
                to everyone, including you. If you want a surprise, stop opening your list once you
                have shared it.
              </Typography>

              <Typography variant="h6" component="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                How many items should be on a Christmas list?
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                For the holidays I suggest 8-15. Fewer, and whoever opens the list last finds nothing
                left. More, and the list turns into a catalog that is hard to choose from.
              </Typography>

              <Typography variant="h6" component="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                Is WishList App free?
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Yes. WishList App is free with no ads and no premium tier. You can create as many
                lists as you like, and your family never pays or signs up to claim a gift.
              </Typography>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                Start from a finished example
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Do not want to start from a blank page? Open the{' '}
                <RouterLink to={`/${routeLang}/wishlist/christmas-list`}>
                  Christmas wish list example
                </RouterLink>
                : eleven gifts across budgets, with notes and prices. Tap &quot;Use this example&quot;,
                sign in with Google and check the name - a copy appears in your account. Then swap in
                your own gifts and send the link to your family.
              </Typography>
              <Button
                component={RouterLink}
                to={`/${routeLang}/wishlist/christmas-list`}
                variant="contained"
                size="large"
              >
                Open the example list
              </Button>
              <Typography variant="body1" sx={{ mt: 2 }}>
                Or start an empty{' '}
                <RouterLink to={`/${routeLang}`} state={{ creationSource: 'blog' }}>wishlist</RouterLink>{' '}
                from the homepage - free and ad-free.
              </Typography>
            </section>
          </Stack>

          <BlogArticleFooter routeLang={routeLang} date={PUBLISHED} />
        </Container>
      </Box>
    </>
  );
}
