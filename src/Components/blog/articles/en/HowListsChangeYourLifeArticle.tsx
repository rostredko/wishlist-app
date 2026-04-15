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

const SLUG = 'how-lists-change-your-life';

export default function HowListsChangeYourLifeArticle({ origin, routeLang }: BlogArticleProps) {
  const { t: th } = useTranslation('home', { lng: routeLang });
  const { t: tb } = useTranslation('blog', { lng: routeLang });
  const canonicalUrl = `${origin}/en/blog/${SLUG}`;
  const alternates = resolveBlogAlternates(origin, 'en', SLUG)!;

  return (
    <>
      <SEOHead
        lang="en"
        title="Why I've Been Making Lists My Whole Life - How They Really Work | WishList App"
        description="I've been writing lists since I was a kid - wishlists for Christmas, Easter, birthdays, and to-dos for everything in between. Here's what I learned about how lists shape your thinking and productivity."
        canonical={canonicalUrl}
        alternates={alternates}
        keywords="power of lists, how lists improve productivity, wishlist for holidays, christmas wishlist ideas, birthday wishlist, how to use lists in life"
        structured={{
          article: {
            headline: "Why I've Been Making Lists My Whole Life - and How They Actually Work",
            datePublished: BLOG_LAST_UPDATED,
            dateModified: BLOG_LAST_UPDATED,
          },
          breadcrumbs: [
            { name: tb('breadcrumbHome'), url: `${origin}/en` },
            { name: tb('breadcrumbBlog'), url: `${origin}/en/blog` },
            { name: "Why I've Been Making Lists My Whole Life", url: canonicalUrl },
          ],
        }}
      />

      <Box component="article" sx={{ pt: { xs: 6, md: 10 }, pb: 4 }}>
        <Container maxWidth="md">
          <Typography variant="h1" sx={{ fontWeight: 800, fontSize: { xs: 26, md: 34 }, mb: 2 }}>
            Why I&apos;ve been making lists my whole life - and how they actually work
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
            I wrote my first wishlist at age six. It was for Saint Nicholas Day - a small slip of paper
            tucked near the window the night before December 6th. Three items, all in my best handwriting.
            I do not remember what I asked for, but I remember how it felt to write it down: clear,
            focused, almost relieved. That feeling never left me.
          </Typography>

          <Stack spacing={4}>
            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                How it started - lists from the beginning
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Growing up, I made lists for everything. Back-to-school supplies in September. A Christmas
                wishlist in December. A New Year list that was half wishes, half intentions. A birthday
                list I updated carefully each year - always in priority order, always with at least a
                rough idea of where to buy each item.
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                My parents thought it was funny. My friends thought it was a little unusual. But here is
                what I noticed early on: I never got a duplicate present. I never forgot what I actually
                wanted. And the act of writing something down made it feel more real - more likely to
                actually happen.
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                This was not just for wishlists. I kept grocery lists, reading lists, travel packing
                lists, lists of films to watch and books to read. By high school I had a notebook just
                for lists. No journal entries, no essays - just lists. Neat, specific, and regularly
                reviewed.
              </Typography>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                What I learned from years of keeping lists
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Over time I started paying attention to what made a list useful versus what made it
                a waste of paper. I noticed patterns. I started reading about psychology and productivity.
                And I found that what I had been doing by instinct lines up pretty well with how our
                brains actually work.
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                The core insight is simple: your working memory is small. The human brain can hold
                roughly four to seven items in active attention at once. When you try to keep track of
                more than that - your grocery run, a work deadline, the birthday present you still need
                to buy - everything competes for space. You miss things. You feel anxious without knowing
                exactly why.
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                A list offloads that pressure. You move the items from your head onto paper (or a screen),
                and your brain stops cycling through them. Psychologists call this the Zeigarnik effect -
                unfinished tasks create mental noise. A list closes the loop. You wrote it down. You can
                stop worrying about forgetting it.
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                That is why I always sleep better the night after I write a thorough to-do list. The
                list is doing the remembering for me.
              </Typography>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                Lists and productivity - what actually works
              </Typography>
              <TableContainer component={Paper} variant="outlined" sx={{ bgcolor: 'background.paper' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>List type</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>When to use it</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>The benefit</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Daily to-do</TableCell>
                      <TableCell>Every morning, max 5-7 items</TableCell>
                      <TableCell>Turns vague intention into an actual plan</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Someday / maybe list</TableCell>
                      <TableCell>Capture ideas you cannot act on yet</TableCell>
                      <TableCell>Stops ideas from cluttering today&apos;s thinking</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Project checklist</TableCell>
                      <TableCell>Any multi-step task</TableCell>
                      <TableCell>Prevents skipped steps when you are under pressure</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Wishlist</TableCell>
                      <TableCell>Ahead of any holiday or birthday</TableCell>
                      <TableCell>Coordinates gifts without awkward guesswork</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Not-to-do list</TableCell>
                      <TableCell>When you keep falling into the same traps</TableCell>
                      <TableCell>Makes unhelpful defaults explicit and easier to break</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Reading / watch list</TableCell>
                      <TableCell>Ongoing, updated whenever someone recommends something</TableCell>
                      <TableCell>Captures recommendations before you forget who mentioned them</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              <Typography variant="body1" sx={{ mt: 2, mb: 2 }}>
                The key difference between a list that helps and a list that becomes a guilt archive is
                specificity. &quot;Clean the apartment&quot; is not a useful list item - it is an entire project
                in disguise. &quot;Wipe down the kitchen counter&quot; is a list item. One action, one entry.
                Be concrete.
              </Typography>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                Wishlists by holiday - what works across Europe and the US
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                I make wishlists the way some people make playlists - with care, updated seasonally,
                and always shared early enough to be useful. Here is what I have found works for the
                major occasions.
              </Typography>

              <Typography variant="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                Christmas and the holiday season (December)
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                The longest gifting season of the year. In the US, people start building Christmas
                wishlists in early November, right after Halloween ends. In Europe the window is similar
                but more compressed. The rule I follow: share your list by the first week of December at
                the latest. Mix small items - books, candles, coffee accessories - with one or two bigger
                things in case family members want to pool together. A good Christmas list has something
                in every price range.
              </Typography>

              <Typography variant="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                Birthday
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                The only year-round occasion. Birthdays do not have a season - they are always coming up
                for someone. I keep a running birthday wishlist that I update whenever I spot something I
                want. Before my birthday I share it; after, I archive what was received and carry the rest
                forward. It is a living document, not a one-time list.
              </Typography>

              <Typography variant="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                Valentine&apos;s Day (February 14)
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                A wishlist for Valentine&apos;s Day sounds unromantic. I think it is the opposite - it takes
                the pressure off your partner. Instead of guessing whether you would rather have flowers,
                a gadget, or a night out, they can pick something they know you actually want. I keep a
                short list for this one: no more than five items, skewing personal and a bit indulgent.
              </Typography>

              <Typography variant="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                Easter (March-April)
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                More of a children&apos;s occasion in most of Western Europe, but in many families it is also
                a second gifting moment for adults. Short lists work here - think small experiences,
                luxury foods, or things you would not buy yourself but genuinely enjoy receiving.
              </Typography>

              <Typography variant="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                Mother&apos;s Day and Father&apos;s Day
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                These two occasions have a recurring problem: the recipient rarely says what they want
                and the giver has no idea what to get. A wishlist from a parent is honestly a gift in
                itself. If your parents are not the type to make lists, ask them - even a short one with
                three items completely changes the conversation.
              </Typography>

              <Typography variant="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                Back to school (August-September)
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                September was always one of my favorite times of year as a child - new notebooks, new
                pens, the year stretching ahead of you. A back-to-school list is practical by nature:
                supplies, electronics, bags. It also serves as a coordination tool - share it with
                grandparents who want to help but do not know what a seventh-grader needs this year.
              </Typography>

              <Typography variant="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                New Year&apos;s
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                I write two lists for New Year&apos;s every year. One is a short wishlist - still relevant
                between Christmas and January. The other is what I think of as a &quot;want to do&quot; list
                rather than a resolutions list. Not &quot;I will go to the gym&quot; but &quot;I want to read 12
                books, visit one new place, and learn to make sourdough.&quot; That phrasing shifts it from
                obligation to genuine intention - and I follow through on it far more often.
              </Typography>

              <Typography variant="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                Graduation and housewarming
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Two occasions where wishlists have become fully socially normal in the US and increasingly
                common in Europe. For a graduation, a list that mixes practical items (the person is
                starting a new chapter) with a few celebratory ones works best. For housewarming,
                a registry-style wishlist for the home makes sense - specific, linkable, and ranged
                across budgets.
              </Typography>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                How to start - the list habit in practice
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body1">
                  - Start with one list, not five. Pick the area that causes the most friction in your
                  life right now: birthday gifting, daily planning, or packing for a trip.
                </Typography>
                <Typography variant="body1">
                  - Write it down immediately. The item you are about to forget right now is the one
                  to capture first.
                </Typography>
                <Typography variant="body1">
                  - Review and trim. A list with 40 items is a wishlist for anxiety. Keep daily to-dos
                  short. Keep wishlists realistic.
                </Typography>
                <Typography variant="body1">
                  - Share wishlists early. Two to three weeks before a holiday is the minimum for
                  anything that needs shipping.
                </Typography>
                <Typography variant="body1">
                  - Do not apologize for having a wishlist. It makes gifting better for everyone -
                  you and the people who care about you.
                </Typography>
              </Stack>
            </section>

            <section>
              <Typography variant="body1" sx={{ mb: 2 }}>
                I built{' '}
                <RouterLink to={`/${routeLang}`}>WishList App</RouterLink>{' '}
                because I wanted a simple, shareable place to keep exactly this kind of list - with the
                anonymous claiming feature that stops duplicate gifts. If you want to see what a working
                wishlist looks like,{' '}
                <RouterLink to={`/${routeLang}/wishlist/birthday-list`}>
                  the birthday demo
                </RouterLink>{' '}
                is a good starting point.
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Button component={RouterLink} to={`/${routeLang}`} variant="contained" size="large">
                  {th('createBtn')}
                </Button>
              </Box>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                Related posts
              </Typography>
              <Typography variant="body1">
                For the step-by-step mechanics of a birthday list,{' '}
                <RouterLink to={`/${routeLang}/blog/how-to-create-a-birthday-wishlist`}>
                  how to create a birthday wishlist
                </RouterLink>{' '}
                covers my 4-step method in detail. For app comparisons,{' '}
                <RouterLink to={`/${routeLang}/blog/best-wishlist-apps-2026`}>
                  best wishlist apps in 2026
                </RouterLink>{' '}
                has everything I have tested.
              </Typography>
            </section>
          </Stack>

          <BlogArticleFooter routeLang={routeLang} />
        </Container>
      </Box>
    </>
  );
}
