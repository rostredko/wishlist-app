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

const SLUG = 'kids-christmas-list';
const PUBLISHED = '2026-10-22';

const SAMPLE_LETTER = [
  'Dear Santa,',
  'My name is Mia and I am 7. This year I learned to read on my own, and I helped look after our cat.',
  'I would really like:',
  '1. A kit to grow crystals.',
  '2. A book about animals with big pictures.',
  '3. Gloves for snowball fights.',
  'I also wish that Grandma\'s back stops hurting and that everyone in our family stays healthy.',
  'Thank you, Santa! I will keep helping at home.',
  'Mia',
];

export default function KidsChristmasListArticle({ origin, routeLang }: BlogArticleProps) {
  const { t: tb } = useTranslation('blog', { lng: routeLang });
  const canonicalUrl = `${origin}/en/blog/${SLUG}`;
  const alternates = resolveBlogAlternates(origin, 'en', SLUG);

  return (
    <>
      <SEOHead
        lang="en"
        title="Kids' Christmas List: From a Letter to Santa to a Shareable Wishlist"
        description="Help your child write a letter to Santa, turn it into a shareable wishlist, and let grandparents claim gifts without duplicates. Free template inside."
        canonical={canonicalUrl}
        alternates={alternates}
        keywords="kids christmas list, letter to santa template, how to write a letter to santa, christmas list for kids, christmas gift ideas for kids by age"
        structured={{
          article: {
            headline: "Kids' Christmas list: from a letter to Santa to a shareable wishlist",
            datePublished: PUBLISHED,
            dateModified: PUBLISHED,
          },
          howTo: {
            name: 'Turn a letter to Santa into a shareable wishlist',
            description: 'Five steps from a child\'s letter to a list grandparents and godparents can claim gifts from without duplicates.',
            steps: [
              { text: 'Read the letter together with your child and pick the 3-5 wishes that matter most.' },
              { text: 'Create a wishlist on your own account, for example "Christmas 2026 - Mia".' },
              { text: 'Add each wish with a product link, a rough price and a note on size or age.' },
              { text: 'Add 2-3 backup ideas at a lower price for relatives who want to give something small.' },
              { text: 'Send the link to the adults who are buying, and keep it away from your child.' },
            ],
          },
          faq: [
            {
              q: 'When should kids write their letter to Santa?',
              a: 'Three to four weeks before the day gifts are opened - early November if your family celebrates St. Nicholas on December 6, mid-November for December 25. That leaves relatives time to order before the December rush.',
            },
            {
              q: 'How many wishes should go in the letter?',
              a: 'Three to five. It helps your child choose what really matters and tells the adults where to focus. The wishlist can hold two or three extra backup ideas.',
            },
            {
              q: 'Should my child make the wishlist?',
              a: 'It is better if a parent creates it on their own Google account. That way you decide who gets the link, and your child never sees which gifts are claimed.',
            },
            {
              q: 'Will my child see that a gift is claimed?',
              a: 'Only if they open the link. Claimed gifts show as taken to everyone who opens the list, so share the link with adults only.',
            },
            {
              q: 'What if two relatives want to buy the same gift?',
              a: 'Whoever claims it first in the list buys it. The second person sees that the gift is taken and picks another one.',
            },
          ],
          breadcrumbs: [
            { name: tb('breadcrumbHome'), url: `${origin}/en` },
            { name: tb('breadcrumbBlog'), url: `${origin}/en/blog` },
            { name: "Kids' Christmas List", url: canonicalUrl },
          ],
        }}
      />

      <Box component="article" sx={{ pt: { xs: 6, md: 10 }, pb: 4 }}>
        <Container maxWidth="md">
          <Typography variant="h1" sx={{ fontWeight: 800, fontSize: { xs: 26, md: 34 }, mb: 2 }}>
            Kids&apos; Christmas list: from a letter to Santa to a shareable wishlist
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, color: 'text.secondary' }}>
            To make a kids&apos; Christmas list, sit down with your child a few weeks before Christmas
            and help them write a letter to Santa with 3-5 wishes. Then copy those wishes into a
            wishlist with links and sizes, and share it with grandparents and godparents. Your child
            writes the letter; you handle the coordination.
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            My very first wishlist was a letter like this. I was six, it was for St. Nicholas Day, and
            it was three wishes on a slip of paper by the window - I wrote about it in{' '}
            <RouterLink to={`/${routeLang}/blog/how-lists-change-your-life`}>
              why I have been making lists my whole life
            </RouterLink>
            . Parents still do the same thing today, with one extra step after the letter: turning a
            child&apos;s wishes into a list that grandparents, aunts and godparents can actually buy
            from. Here is how to do it without spoiling the magic.
          </Typography>

          <Stack spacing={4}>
            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                Why does a Christmas list help kids?
              </Typography>
              <Typography variant="body1" sx={{ mb: 1.5 }}>
                The letter is not only about presents. For your child it is a small ritual; for you it
                is the easiest way to find out what they actually want. Here is what it gives you both:
              </Typography>
              <Box component="ul" sx={{ pl: 3, mt: 0 }}>
                <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                  Your child learns to choose. Three to five wishes instead of &quot;everything from
                  the ads&quot; is a decision, not a catalog.
                </Typography>
                <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                  They remember something good they did this year, which beats being asked &quot;were
                  you good?&quot;.
                </Typography>
                <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                  They think about others: plenty of letters include a wish for Grandma or a little
                  brother.
                </Typography>
                <Typography component="li" variant="body1">
                  You get a concrete list instead of guesses a week before Christmas.
                </Typography>
              </Box>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                How do you write a letter to Santa? A free template
              </Typography>
              <Typography variant="body1" sx={{ mb: 1.5 }}>
                A simple letter has five parts. Your child does not have to follow them strictly, but
                the structure keeps them from getting lost:
              </Typography>
              <Box component="ol" sx={{ pl: 3, mt: 0, mb: 2 }}>
                <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                  A greeting and a few words about themselves: name and age.
                </Typography>
                <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                  Something good they did or learned this year.
                </Typography>
                <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                  Three to five wishes, one per line.
                </Typography>
                <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                  A wish for somebody else.
                </Typography>
                <Typography component="li" variant="body1">
                  A thank-you and a signature.
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ mb: 1.5 }}>
                Here is a template you can copy and rewrite together with your child:
              </Typography>
              <Paper component="blockquote" variant="outlined" sx={{ m: 0, mb: 2, p: { xs: 2, sm: 3 }, bgcolor: 'background.paper' }}>
                {SAMPLE_LETTER.map((line) => (
                  <Typography key={line} variant="body1" sx={{ mb: 1 }}>{line}</Typography>
                ))}
              </Paper>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Let your child write it themselves, spelling mistakes and all. Your job is to suggest
                the structure and ask questions when a wish is too vague. &quot;A toy&quot; can become
                which toy, what for, and who they would play with.
              </Typography>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                What should kids ask for? Ideas by age
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Categories age better than specific products, so here is what children of different
                ages tend to ask for and what to check before anyone buys:
              </Typography>
              <TableContainer component={Paper} variant="outlined" sx={{ bgcolor: 'background.paper' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Age</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Often on the list</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>What to check</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>3-5</TableCell>
                      <TableCell>Pretend-play toys, big jigsaw puzzles, board books, modeling clay</TableCell>
                      <TableCell>No small parts; check the age label on the box</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>6-9</TableCell>
                      <TableCell>Building sets, science kits, encyclopedias, board games, skates</TableCell>
                      <TableCell>Write down helmet, glove and skate sizes in advance</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>10-13</TableCell>
                      <TableCell>The next book in a series, craft kits, sports gear, headphones</TableCell>
                      <TableCell>They want a specific model by now - ask them to show you</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              <Typography variant="body1" sx={{ mt: 2 }}>
                To see what a finished list looks like, open the{' '}
                <RouterLink to={`/${routeLang}/wishlist/kids-christmas-list`}>
                  kids&apos; Christmas list example for ages 6-9
                </RouterLink>
                .
              </Typography>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                How do you turn the letter into a wishlist?
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                A child&apos;s letter is about wishes. Relatives need details: which kit, what size,
                where to buy it. So I would turn the letter into a separate list for the adults.
                &quot;Skates&quot; in the letter becomes &quot;Ice skates, adjustable, EU size 31&quot;
                with a link to the store.
              </Typography>
              <Box component="ol" sx={{ pl: 3, mt: 0 }}>
                <Typography component="li" variant="body1" sx={{ mb: 1.5 }}>
                  Read the letter together and pick the 3-5 wishes that matter most.
                </Typography>
                <Typography component="li" variant="body1" sx={{ mb: 1.5 }}>
                  Create a wishlist on your own Google account, for example &quot;Christmas 2026 -
                  Mia&quot;.
                </Typography>
                <Typography component="li" variant="body1" sx={{ mb: 1.5 }}>
                  Add each wish with a link, a rough price and a note: size, the age on the box, color,
                  the language of a book.
                </Typography>
                <Typography component="li" variant="body1" sx={{ mb: 1.5 }}>
                  Add 2-3 backup ideas at a lower price for relatives who want to give something small.
                </Typography>
                <Typography component="li" variant="body1">
                  Send the link to the adults who are buying. Not to your child.
                </Typography>
              </Box>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                How do you share the list with grandparents and godparents?
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                With one message in the family chat. Nobody needs an account: Grandma opens the link
                in her browser, picks a gift, taps it and confirms. From then on the gift shows as
                taken to everyone, so the godfather will not buy the same thing. The message can be as
                simple as this:
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, mb: 2, bgcolor: 'background.paper' }}>
                <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                  &quot;Mia wrote her letter to Santa - here is what she is hoping for: [link]. If you
                  pick something, tap it and claim it so we do not get two. And please do not show the
                  list to Mia.&quot;
                </Typography>
              </Paper>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Send it by mid-November. December delivery is slow, and if your family celebrates St.
                Nicholas Day on December 6, the deadline comes even sooner. If a grandparent does not
                use messaging apps, open the list on their phone together, or claim the gift for them
                - as the list owner, you can do that too.
              </Typography>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                How do you keep the magic?
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                The main rule: the list belongs to the parent, not the child. You create it on your
                account, and only adults get the link. If your child opens the list, they will see
                which gifts are already claimed, and the magic ends earlier than it should. Keep the
                link in grown-up chats.
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                As the owner, you will see which gifts are claimed, but not who claimed them. For
                parents that is actually handy: you can tell at a glance that everything is covered
                without chasing anyone.
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                One more tip: decide in advance which gift comes &quot;from Santa&quot; and which come
                from relatives. Add the note &quot;from Santa - we are buying this&quot; to that item
                and claim it yourself. Nobody else will buy it, and on Christmas morning your child
                finds exactly what they asked for in their letter.
              </Typography>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                What if your child asks for something too expensive?
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Do not argue with the letter - it is for Santa, not for the budget. Talk it through
                before the letter is finished instead. If the big wish can wait for a birthday, it can
                move to that list, and the letter keeps the things that will actually turn up on
                Christmas morning.
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                The other option is a shared gift. Add the item to the wishlist with a note such as
                &quot;several of us are chipping in&quot; and agree in the chat who buys it. That
                person claims it so it shows as taken for everyone else, and the others send them their
                share. Whatever you choose, do not promise something that is not coming.
              </Typography>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                Frequently asked questions
              </Typography>

              <Typography variant="h6" component="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                When should kids write their letter to Santa?
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Three to four weeks before the day gifts are opened - early November if your family
                celebrates St. Nicholas on December 6, mid-November for December 25. That leaves
                relatives time to order before the December rush.
              </Typography>

              <Typography variant="h6" component="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                How many wishes should go in the letter?
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Three to five. It helps your child choose what really matters and tells the adults
                where to focus. The wishlist can hold two or three extra backup ideas.
              </Typography>

              <Typography variant="h6" component="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                Should my child make the wishlist?
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                It is better if a parent creates it on their own Google account. That way you decide
                who gets the link, and your child never sees which gifts are claimed.
              </Typography>

              <Typography variant="h6" component="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                Will my child see that a gift is claimed?
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Only if they open the link. Claimed gifts show as taken to everyone who opens the list,
                so share the link with adults only.
              </Typography>

              <Typography variant="h6" component="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                What if two relatives want to buy the same gift?
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Whoever claims it first in the list buys it. The second person sees that the gift is
                taken and picks another one.
              </Typography>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                A ready-made list for ages 6-9
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                To skip the blank page, open the{' '}
                <RouterLink to={`/${routeLang}/wishlist/kids-christmas-list`}>
                  kids&apos; Christmas list example
                </RouterLink>
                : ten ideas with sizes, notes and prices. Tap &quot;Use this example&quot;, sign in with
                Google, and a copy appears in your account. Then add the wishes from the letter and
                send the link to the family.
              </Typography>
              <Button
                component={RouterLink}
                to={`/${routeLang}/wishlist/kids-christmas-list`}
                variant="contained"
                size="large"
              >
                Open the example list
              </Button>
              <Typography variant="body1" sx={{ mt: 2 }}>
                Or start an empty{' '}
                <RouterLink to={`/${routeLang}`} state={{ creationSource: 'blog' }}>wishlist</RouterLink>{' '}
                from the homepage. For your own grown-up list, see{' '}
                <RouterLink to={`/${routeLang}/blog/christmas-wishlist`}>
                  how to make a Christmas wish list
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
