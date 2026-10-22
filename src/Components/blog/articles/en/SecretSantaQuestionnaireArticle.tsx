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

const SLUG = 'secret-santa-questionnaire';
const PUBLISHED = '2026-10-22';

const QUESTION_GROUPS = [
  {
    heading: 'About you',
    questions: [
      'What name should your Secret Santa write on the card?',
      'How do you like to spend a free evening?',
      'What are you into right now - a hobby, a series, a sport?',
      'Coffee, tea, or neither?',
      'Sweet or salty snacks?',
    ],
  },
  {
    heading: 'Things you like',
    questions: [
      'Your favorite color - and a color you never wear?',
      'A shop you always enjoy browsing?',
      'A book, game or film you would love to own?',
      'Something you use every day that is wearing out?',
      'A small treat you never buy for yourself?',
      'Useful, fun, or an experience - which do you prefer?',
    ],
  },
  {
    heading: 'Sizes and practical details',
    questions: [
      'T-shirt or sweater size?',
      'Sock or glove size?',
      'Do you have room at home or on your desk for more things?',
      'Will the gift be handed over in person, or does it need to be posted?',
    ],
  },
  {
    heading: 'No-gos',
    questions: [
      'Any allergies, or food you avoid?',
      'What do you already have too much of - mugs, candles, socks?',
      'Anything you do not want at all - joke gifts, alcohol, strong scents?',
    ],
  },
  {
    heading: 'Your wishlist',
    questions: [
      'Three things you would be happy to get within the budget?',
      'The link to your wishlist?',
    ],
  },
];

const QUESTION_OFFSETS = QUESTION_GROUPS.map((_, index) =>
  QUESTION_GROUPS.slice(0, index).reduce((count, group) => count + group.questions.length, 0),
);

export default function SecretSantaQuestionnaireArticle({ origin, routeLang }: BlogArticleProps) {
  const { t: tb } = useTranslation('blog', { lng: routeLang });
  const canonicalUrl = `${origin}/en/blog/${SLUG}`;
  const alternates = resolveBlogAlternates(origin, 'en', SLUG);

  return (
    <>
      <SEOHead
        lang="en"
        title="Secret Santa Questionnaire: 20 Questions and a Wishlist Template"
        description="Copy a 20-question Secret Santa questionnaire, turn the answers into a short wishlist, and share it with your giver. Works for office and family exchanges."
        canonical={canonicalUrl}
        alternates={alternates}
        keywords="secret santa questionnaire, secret santa questions, secret santa wishlist, secret santa gift list, office secret santa rules"
        structured={{
          article: {
            headline: 'Secret Santa questionnaire: 20 questions and a wishlist template',
            datePublished: PUBLISHED,
            dateModified: PUBLISHED,
          },
          faq: [
            {
              q: 'What questions should be on a Secret Santa questionnaire?',
              a: 'A mix of what the person likes, their sizes, the things they do not want, and a link to their wishlist. The 20 questions in this post cover all four in about five minutes.',
            },
            {
              q: 'How much should you spend on Secret Santa?',
              a: 'Whatever every participant is comfortable with. Agree on one fixed number before the draw, include delivery in it, and stick to it so nobody feels awkward on the day.',
            },
            {
              q: 'What if my person did not fill in the questionnaire?',
              a: 'Ask the organizer to nudge them or pass on a few of the questions. If there is still no answer, pick something neutral and useful within the budget, such as tea, warm socks or a notebook.',
            },
            {
              q: 'Does WishList App do the Secret Santa draw?',
              a: 'No. WishList App does not assign names. It helps with the next step: every participant makes a short wishlist, so their Secret Santa knows what to buy.',
            },
            {
              q: 'Do participants need an account?',
              a: 'Only to create their own list, which takes a Google sign-in. Viewing someone else\'s list and claiming a gift works without an account.',
            },
          ],
          breadcrumbs: [
            { name: tb('breadcrumbHome'), url: `${origin}/en` },
            { name: tb('breadcrumbBlog'), url: `${origin}/en/blog` },
            { name: 'Secret Santa Questionnaire', url: canonicalUrl },
          ],
        }}
      />

      <Box component="article" sx={{ pt: { xs: 6, md: 10 }, pb: 4 }}>
        <Container maxWidth="md">
          <Typography variant="h1" sx={{ fontWeight: 800, fontSize: { xs: 26, md: 34 }, mb: 2 }}>
            Secret Santa questionnaire: 20 questions and a wishlist template
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, color: 'text.secondary' }}>
            A Secret Santa questionnaire is a short list of questions each participant answers before
            the exchange: what they like, their sizes, allergies and what they do not want. Copy the 20
            questions below, answer them in five minutes, turn the answers into a 3-5 item wishlist
            within your group&apos;s budget, and share it with the organizer.
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            I built WishList App for the second half of Secret Santa - the part after the draw, when
            someone stares at a name and has no idea what to buy. The questionnaire is the bridge. It
            gets useful facts out of people who would otherwise say &quot;anything is fine&quot;, and
            the wishlist turns those facts into gifts with links.
          </Typography>

          <Stack spacing={4}>
            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                Why use a Secret Santa questionnaire?
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Your Secret Santa may barely know you. A colleague from another team cannot guess that
                you gave up coffee, and a friend of a friend has no idea you already own five candles.
                &quot;Anything is fine&quot; is the least helpful answer anyone can give, because it
                leaves the giver guessing on a fixed budget.
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Specific questions get specific answers. They also surface the no-gos - allergies,
                strong scents, things people already have too much of - which matter more than any
                single gift idea.
              </Typography>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                The 20 Secret Santa questions (copy and paste)
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Paste these into the group chat or a shared note. Short answers are fine - a word or a
                line each.
              </Typography>
              <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 }, bgcolor: 'background.paper' }}>
                {QUESTION_GROUPS.map((group, groupIndex) => (
                  <Box key={group.heading} sx={{ mb: groupIndex === QUESTION_GROUPS.length - 1 ? 0 : 2 }}>
                    <Typography variant="h6" component="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1 }}>
                      {group.heading}
                    </Typography>
                    <Box component="ol" start={QUESTION_OFFSETS[groupIndex] + 1} sx={{ pl: 4, my: 0 }}>
                      {group.questions.map((question) => (
                        <Typography key={question} component="li" variant="body1" sx={{ mb: 0.75 }}>
                          {question}
                        </Typography>
                      ))}
                    </Box>
                  </Box>
                ))}
              </Paper>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                How do you turn the answers into a wishlist?
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Twenty answers are a lot to read. Your giver needs three to five concrete options with
                links. This is how I would boil them down:
              </Typography>
              <Box component="ol" sx={{ pl: 3, mt: 0, mb: 2 }}>
                <Typography component="li" variant="body1" sx={{ mb: 1.5 }}>
                  Start from answers 8-11 and 19. Those are your gift candidates.
                </Typography>
                <Typography component="li" variant="body1" sx={{ mb: 1.5 }}>
                  Keep the 3-5 that fit the group budget, including delivery.
                </Typography>
                <Typography component="li" variant="body1" sx={{ mb: 1.5 }}>
                  Find a link for each one, from any store.
                </Typography>
                <Typography component="li" variant="body1" sx={{ mb: 1.5 }}>
                  Copy sizes (12-13) and no-gos (16-18) into the notes of the matching items.
                </Typography>
                <Typography component="li" variant="body1">
                  Name the list clearly, for example &quot;Secret Santa 2026 - Anna, Marketing&quot;.
                </Typography>
              </Box>
              <TableContainer component={Paper} variant="outlined" sx={{ bgcolor: 'background.paper' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Answer</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Wishlist item</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Note on the item</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>&quot;Tea, but no caffeine after lunch&quot;</TableCell>
                      <TableCell>Loose-leaf tea sampler</TableCell>
                      <TableCell>Herbal or green</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>&quot;Into jigsaw puzzles lately&quot;</TableCell>
                      <TableCell>500-piece jigsaw puzzle</TableCell>
                      <TableCell>A landscape or a map</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>&quot;My notebook is falling apart&quot;</TableCell>
                      <TableCell>Pocket notebook, dotted pages</TableCell>
                      <TableCell>A5 or smaller</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>&quot;Allergic to nuts&quot;</TableCell>
                      <TableCell>Chocolate assortment</TableCell>
                      <TableCell>Dark chocolate, no nuts</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              <Typography variant="body1" sx={{ mt: 2 }}>
                That is exactly how the{' '}
                <RouterLink to={`/${routeLang}/wishlist/secret-santa-list`}>
                  Secret Santa wishlist example
                </RouterLink>{' '}
                is built: ten small gifts, each with the note a giver would otherwise have to ask for.
              </Typography>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                How do you share your wishlist with the organizer?
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                You do not know who drew your name, so send the link to the organizer or post it in the
                group chat - whoever has you will find it. They open it in a browser without an
                account and can claim the gift they pick.
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                With only one giver, claiming is optional in Secret Santa. It earns its keep when you
                share the same list with family as well: a claimed gift shows as taken to everyone who
                opens the list, so your aunt will not buy the same thing. That includes you - you will
                see which gifts are claimed, though never by whom. If you want a full surprise, stop
                opening your list after the draw.
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                One thing WishList App does not do is the draw itself. For that you need a separate
                tool or slips of paper in a hat; I compared the options in{' '}
                <RouterLink to={`/${routeLang}/blog/best-secret-santa-apps`}>
                  best Secret Santa apps
                </RouterLink>
                .
              </Typography>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                When should you send out the questionnaire?
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Right after the draw, so the answers arrive while people still have time to shop.
                Counting back from the exchange, I would give the questionnaire one week, buying one
                to two weeks, and keep the final week for posting and wrapping. If the exchange is in
                mid-December, run the draw in November - then people can shop on Black Friday, which
                falls on November 27 in 2026.
              </Typography>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                What are good office Secret Santa rules?
              </Typography>
              <Typography variant="body1" sx={{ mb: 1.5 }}>
                Office exchanges need a few more rules than a group of close friends, because working
                together continues after the party:
              </Typography>
              <Box component="ul" sx={{ pl: 3, mt: 0 }}>
                <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                  Taking part is voluntary, and nobody has to explain why they are sitting it out.
                </Typography>
                <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                  One budget for everyone, delivery included, and nobody goes over it to impress.
                </Typography>
                <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                  No overly personal gifts and no jokes about age, weight or looks.
                </Typography>
                <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                  Alcohol only if the person put it on their own wishlist.
                </Typography>
                <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                  Remote colleagues: agree on a posting date early so gifts arrive in time.
                </Typography>
                <Typography component="li" variant="body1">
                  Hand everything over on the same day so nobody feels forgotten.
                </Typography>
              </Box>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                Frequently asked questions
              </Typography>

              <Typography variant="h6" component="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                What questions should be on a Secret Santa questionnaire?
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                A mix of what the person likes, their sizes, the things they do not want, and a link to
                their wishlist. The 20 questions in this post cover all four in about five minutes.
              </Typography>

              <Typography variant="h6" component="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                How much should you spend on Secret Santa?
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Whatever every participant is comfortable with. Agree on one fixed number before the
                draw, include delivery in it, and stick to it so nobody feels awkward on the day.
              </Typography>

              <Typography variant="h6" component="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                What if my person did not fill in the questionnaire?
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Ask the organizer to nudge them or pass on a few of the questions. If there is still no
                answer, pick something neutral and useful within the budget, such as tea, warm socks
                or a notebook.
              </Typography>

              <Typography variant="h6" component="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                Does WishList App do the Secret Santa draw?
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                No. WishList App does not assign names. It helps with the next step: every participant
                makes a short wishlist, so their Secret Santa knows what to buy.
              </Typography>

              <Typography variant="h6" component="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                Do participants need an account?
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Only to create their own list, which takes a Google sign-in. Viewing someone
                else&apos;s list and claiming a gift works without an account.
              </Typography>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                Copy a ready-made Secret Santa list
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Open the{' '}
                <RouterLink to={`/${routeLang}/wishlist/secret-santa-list`}>
                  Secret Santa wishlist example
                </RouterLink>
                , tap &quot;Use this example&quot; and sign in with Google. Keep the 3-5 items that fit
                your group&apos;s budget, swap in your own links, and send the list to the organizer.
              </Typography>
              <Button
                component={RouterLink}
                to={`/${routeLang}/wishlist/secret-santa-list`}
                variant="contained"
                size="large"
              >
                Open the example list
              </Button>
              <Typography variant="body1" sx={{ mt: 2 }}>
                Or start an empty{' '}
                <RouterLink to={`/${routeLang}`} state={{ creationSource: 'blog' }}>wishlist</RouterLink>{' '}
                from the homepage. If your family is buying for you as well, my guide on{' '}
                <RouterLink to={`/${routeLang}/blog/christmas-wishlist`}>
                  how to make a Christmas wish list
                </RouterLink>{' '}
                covers the bigger list.
              </Typography>
            </section>
          </Stack>

          <BlogArticleFooter routeLang={routeLang} date={PUBLISHED} />
        </Container>
      </Box>
    </>
  );
}
