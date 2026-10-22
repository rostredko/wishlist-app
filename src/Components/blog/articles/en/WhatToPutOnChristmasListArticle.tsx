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

const SLUG = 'what-to-put-on-christmas-list';
const PUBLISHED = '2026-10-22';

const IDEA_SECTIONS: Array<{ heading: string; intro: string[]; ideas: Array<[name: string, note: string]> }> = [
  {
    heading: 'What should you ask for under 25 EUR/USD?',
    intro: [
      'Small gifts that colleagues, nieces, nephews and friends can pick without a second thought. A few of these make the list friendly to every budget, so nobody feels awkward opening it.',
    ],
    ideas: [
      ['Wool socks', 'The most honest winter gift there is. Put your shoe size in the note, and how loud a pattern you can handle.'],
      ['Loose-leaf tea or whole-bean coffee', 'Say what you actually drink: green or black, beans or ground, and how you brew it.'],
      ['A tree ornament', 'One nice ornament a year slowly turns into a whole tree of memories.'],
      ['A paperback', 'Link the exact edition, so nobody buys a translation you dislike or a book already on your shelf.'],
      ['A scented candle', 'List the scents you love and the ones that give you a headache.'],
      ['A notebook or planner for the new year', 'January is the natural moment for a fresh notebook. Say dotted, lined or dated.'],
      ['A hot chocolate or cocoa kit', 'A cozy gift for winter evenings that is easy to find and hard to get wrong.'],
      ['Touchscreen gloves', 'Handy if you walk a lot in winter and use your phone outdoors. Add your size.'],
      ['Hand cream or lip balm', 'Winter uses them up faster than usual. Mention any ingredients you react to.'],
      ['A jigsaw puzzle', 'For the slow days between Christmas and New Year. A 500-piece and a 1,500-piece puzzle are very different evenings, so say which.'],
      ['A big mug', 'Note the size you like and whether it has to survive the dishwasher.'],
      ['A wall calendar', 'Photos of cities or animals, or the work of an illustrator you love.'],
      ['Seeds or flower bulbs for spring', 'For anyone already waiting for the gardening season, even on a balcony.'],
      ['Sweets from a small local maker', 'Gingerbread, honey or handmade chocolate. Note anything you do not eat.'],
      ['House slippers', 'The size is a must, plus whether you want a hard sole for the stairs.'],
    ],
  },
  {
    heading: 'What should you ask for at 25-50 EUR/USD?',
    intro: [
      'The heart of a Christmas list. Most of the family will choose from this range, so give it the most options - enough that whoever opens the link last still finds something free.',
    ],
    ideas: [
      ['A board game for groups', 'Say how many people usually play and whether you prefer long games or quick 15-minute ones.'],
      ['A throw blanket', 'Size and material: some people love wool, others will only touch soft fleece.'],
      ['A travel mug', 'A tried-and-true commute gift. Check whether it needs to fit a car cup holder.'],
      ['A bookshop gift card', 'If you cannot pick one book, let the card decide later. Name the shop you use most.'],
      ['A hat, scarf or snood', 'Color and material in the note, and for a hat, pompom or no pompom.'],
      ['A craft kit', 'Paint-by-numbers, embroidery or air-dry clay, for anyone who wants to try a new hobby over the holidays.'],
      ['Spices or hot sauces', 'For people who love to cook. Say which cuisine you make most often.'],
      ['A reading light', 'Warm light for winter evenings. Say whether you want a clip-on for books or a desk lamp.'],
      ['A few months of a streaming or audiobook subscription', 'Only if you know you will use it. Put the service name in the note.'],
      ['Bedding', 'Always add the duvet and pillow size - it is the thing relatives know least.'],
      ['A potted plant', 'Add a note about your light. Not every plant survives a north-facing window.'],
      ['A photo book or prints of the year', 'For the person who promises every year to print their photos and never does.'],
      ['Home workout gear', 'A yoga mat, resistance bands or a jump rope. Say what you already have.'],
      ['A moka pot or French press', 'Good coffee at home without a big machine. Say how many cups.'],
      ['A travel organizer or toiletry bag', 'Useful if you travel often. Size and color in the note.'],
    ],
  },
  {
    heading: 'What should you ask for at 50-100 EUR/USD?',
    intro: [
      'Bigger things for parents, a partner, or a few people chipping in together. If something costs more than your family usually spends, add a note saying "happy for people to share this" - nobody feels awkward, and the bigger wish can still come true.',
    ],
    ideas: [
      ['Headphones', 'Always say the type: over-ear, earbuds or noise-cancelling. A link to the exact model is better still.'],
      ['An e-reader', 'For heavy readers. Say whether a backlight matters and whether you read in the bath.'],
      ['A warm sweater or cardigan', 'Size, color and fabric: pure wool is itchy for some people.'],
      ['A portable speaker', 'For music in the kitchen or on trips. Say whether it needs to be waterproof.'],
      ['A small kitchen appliance', 'A blender, toaster or waffle maker. Say what your kitchen is actually missing.'],
      ['An everyday backpack', 'Say whether it has to fit a laptop and whether water-resistant fabric matters.'],
      ['A cookware or knife set', 'For anyone who has just moved or wants to upgrade the kitchen. Mention your stove: induction needs the right pans.'],
      ['A fitness tracker', 'If you are setting yourself fitness goals for the year. Say which phone it has to work with.'],
      ['Computer accessories', 'A keyboard, mouse or laptop stand. Say whether it is for work or for gaming.'],
      ['A humidifier', 'Winter heating dries the air, and a humidifier makes a room more comfortable.'],
      ['Gear for a hobby', 'A camera tripod, woodworking tools or a drawing tablet. Say what you already own.'],
      ['An electric blanket', 'Especially for cold flats and old houses. Add the size.'],
      ['A perfume or cologne', 'Only if you know the exact scent. Link it on your list and there is zero risk.'],
      ['A video game', 'Name the platform: versions for different consoles and PC are not interchangeable.'],
      ['A wallet or bag', 'Here a link to the exact model beats any description in words.'],
    ],
  },
  {
    heading: 'Which experiences can go on a Christmas list?',
    intro: [
      'The holiday break is long, and an evening together is often remembered longer than an object. On a wishlist, an experience works just like a product: a name, a link to the ticket or voucher page, and a note about the dates that suit you.',
    ],
    ideas: [
      ['Concert tickets', 'Link the exact show and note the dates that work for you.'],
      ['A play or a comedy night', 'Say who you would like to go with - relatives might give you two tickets at once.'],
      ['A workshop', 'Pottery, cooking, candle-making or painting: an evening of something new instead of one more thing.'],
      ['A massage or spa voucher', 'The gift everybody keeps postponing for themselves.'],
      ['Ice skating or a day on the slopes', 'Rink tickets or ski rental - the most wintry idea on this list.'],
      ['An escape room', 'Great if you celebrate with friends: one gift for the whole group.'],
      ['A course or online class', 'A language, photography, coding. Link a specific course, not "something about photos".'],
      ['Dinner out', 'A voucher for a place you have wanted to try for ages. Link it on the list.'],
      ['A gym or pool membership', 'Only if you really plan to go. Name the place near home or work.'],
      ['A weekend away', 'A night in another city or a cabin outside town - a big wish several relatives can chip in on.'],
    ],
  },
  {
    heading: 'Which boring but useful things are worth asking for?',
    intro: [
      'Things that feel like a waste to buy for yourself but are lovely to receive. The practical relatives in every family tend to head straight for this part of the list.',
    ],
    ideas: [
      ['A power bank', 'Useful on trips and during power cuts. Say the capacity and the connector type.'],
      ['A head torch or rechargeable lamp', 'Keeps your hands free when the lights go out. USB charging is easiest.'],
      ['A surge-protected power strip', 'Dull, but useful every day. Even better with a few USB ports.'],
      ['Thermal base layers', 'For winter walks and cold flats. Add your size, and whether you want a set or just a top.'],
      ['A frying pan that does not stick', 'Say the diameter and your stove type.'],
      ['Storage boxes or a closet organizer', 'For anyone planning a big clear-out in January.'],
      ['A spare charging cable and plug', 'You can never have too many. Say your phone connector.'],
      ['A set of towels', 'Soft, large, and in the color of your bathroom - put the color in the note.'],
      ['A first-aid kit for the car or hiking', 'The thing everyone remembers only when they need it.'],
      ['A small appliance', 'A kitchen scale, a new kettle or an iron: things you would never buy yourself but are happy to get.'],
    ],
  },
  {
    heading: 'How do you add a donation or fundraiser to a wishlist?',
    intro: [
      'Some people would rather ask for support for a cause than for more things. On a wishlist it is simply its own item: the cause in the name, the fundraiser page in the link field, and the goal - plus an amount, if you like - in the description.',
      'Nobody needs to claim it. If someone does, everyone else will see it as taken, so write "everyone is welcome to chip in, no need to claim" in the description. And only add fundraisers you trust yourself and can explain to your family.',
    ],
    ideas: [
      ['A donation to a fundraiser you trust', 'Link the fundraiser page and say in the note what it is for.'],
      ['A contribution to a friend\'s fundraiser', 'If someone close to you is raising money for treatment or home repairs.'],
      ['Support for an animal shelter', 'Money, food, or items from the wish list of a shelter in your town.'],
      ['Support for a creator or newsroom you read', 'A one-off donation or a month of membership on their support page.'],
      ['A local school or community project', 'A library, a school, a neighborhood initiative: local projects often need small amounts.'],
    ],
  },
];

const IDEA_OFFSETS = IDEA_SECTIONS.map((_, index) =>
  IDEA_SECTIONS.slice(0, index).reduce((count, section) => count + section.ideas.length, 0),
);

export default function WhatToPutOnChristmasListArticle({ origin, routeLang }: BlogArticleProps) {
  const { t: tb } = useTranslation('blog', { lng: routeLang });
  const canonicalUrl = `${origin}/en/blog/${SLUG}`;
  const alternates = resolveBlogAlternates(origin, 'en', SLUG);

  return (
    <>
      <SEOHead
        lang="en"
        title="What to Put on Your Christmas List: 70 Ideas by Budget"
        description="Stuck on your Christmas list? 70 ideas by budget - under 25, 50 and 100 EUR/USD - plus experiences and practical gifts, ready to add to a shareable wishlist."
        canonical={canonicalUrl}
        alternates={alternates}
        keywords="what to put on my christmas list, christmas list ideas, christmas list ideas for adults, christmas list ideas for teens, christmas wish list ideas, what to ask for christmas"
        structured={{
          article: {
            headline: 'What to put on your Christmas list: 70 ideas by budget',
            datePublished: PUBLISHED,
            dateModified: PUBLISHED,
          },
          guideItemList: {
            name: '70 Christmas list ideas',
            items: IDEA_SECTIONS.flatMap((section) => section.ideas).map(([name], index) => ({
              name,
              url: `${canonicalUrl}#idea-${index + 1}`,
            })),
          },
          faq: [
            {
              q: 'How many things should I put on my Christmas list?',
              a: 'For the holidays I suggest 8-15 items across budgets. Fewer, and whoever opens the list last finds nothing left. More, and the list turns into a catalog that is hard to choose from.',
            },
            {
              q: 'Should I add prices to my list?',
              a: 'Yes, at least roughly. WishList App has an optional price field with a currency: UAH, USD, EUR or GBP. A price helps relatives pick a gift that fits their budget instead of guessing.',
            },
            {
              q: 'Can I ask for money or a donation?',
              a: 'Yes. Add the fundraiser as its own item with a link to its page, and say in the note what it is for. Mention that nobody needs to claim it, so several people can chip in.',
            },
            {
              q: 'What if I genuinely do not want anything?',
              a: 'Start with experiences and practical things: tickets, a workshop, a power bank, warm socks. They are easy to give and do not clutter the house. Or add a donation to a cause you care about.',
            },
            {
              q: 'Will people see what others have already picked?',
              a: 'Yes. A claimed gift shows as taken to everyone who opens the list, including you. Nobody sees who claimed it.',
            },
          ],
          breadcrumbs: [
            { name: tb('breadcrumbHome'), url: `${origin}/en` },
            { name: tb('breadcrumbBlog'), url: `${origin}/en/blog` },
            { name: 'What to Put on Your Christmas List', url: canonicalUrl },
          ],
        }}
      />

      <Box component="article" sx={{ pt: { xs: 6, md: 10 }, pb: 4 }}>
        <Container maxWidth="md">
          <Typography variant="h1" sx={{ fontWeight: 800, fontSize: { xs: 26, md: 34 }, mb: 2 }}>
            What to put on your Christmas list: 70 ideas by budget
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, color: 'text.secondary' }}>
            What should you put on your Christmas list? A list of 8-15 things across budgets works
            best: a few small items under 25 EUR/USD, a core of 25-50, one or two bigger things people
            can chip in on, plus an experience and something practical. Below are 70 ideas you can add
            to a wishlist straight away, each with a link and a note.
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            One Christmas I unwrapped the same book three times. Since then I know that &quot;surprise
            me&quot; does not work for the giver or for you. But writing a list is hard too, especially
            when someone asks what you want and your mind goes blank. So I put together ideas that work
            well on a wishlist: not specific products with prices that go stale in a week, but
            categories you turn into your own items with links.
          </Typography>

          <Stack spacing={4}>
            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                How do you use this list?
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Treat it as a menu, not a shopping list. Pick the 8-15 ideas that genuinely appeal to
                you and turn each one into a concrete item: a name, a link to the product in any store,
                and a description with the size, color or model. The price field is optional, but I
                suggest filling it in at least roughly - it helps relatives pick something that fits
                their budget.
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Here is how an idea becomes a list item. Idea 1 is wool socks. On your wishlist that
                becomes the name &quot;Wool socks, 2 pairs&quot;, a link to the product in the shop where
                you saw them, and the description &quot;Size 9-11, gray or navy, no loud patterns&quot;.
                Relatives can buy a gift like that in five minutes without asking a single question.
                And put your list together by the end of November: some relatives buy gifts in the
                Black Friday sales, and December shipping is slower.
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Mix the budgets on purpose. This is the split I suggest starting from:
              </Typography>
              <TableContainer component={Paper} variant="outlined" sx={{ bgcolor: 'background.paper', '& .MuiTableCell-root': { px: { xs: 1, sm: 2 } } }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Section</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>How many to pick</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Who it is for</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Under 25 EUR/USD</TableCell>
                      <TableCell>3-4 ideas</TableCell>
                      <TableCell>Colleagues, nieces and nephews, friends</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>25-50 EUR/USD</TableCell>
                      <TableCell>3-5 ideas</TableCell>
                      <TableCell>Most of the family</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>50-100 EUR/USD</TableCell>
                      <TableCell>1-3 ideas</TableCell>
                      <TableCell>Parents, or a few people chipping in</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Experiences</TableCell>
                      <TableCell>1-2 ideas</TableCell>
                      <TableCell>Anyone who would rather give time together</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Practical things</TableCell>
                      <TableCell>1-2 ideas</TableCell>
                      <TableCell>The practical relatives</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              <Typography variant="body1" sx={{ mt: 2 }}>
                The ideas suit adults and older teens. For the step-by-step on building the list and
                sharing it with one link, read{' '}
                <RouterLink to={`/${routeLang}/blog/christmas-wishlist`}>
                  how to make a Christmas wish list
                </RouterLink>
                . For younger children, the{' '}
                <RouterLink to={`/${routeLang}/blog/kids-christmas-list`}>kids&apos; Christmas list</RouterLink>{' '}
                guide has ideas by age, and for an office gift exchange there is the{' '}
                <RouterLink to={`/${routeLang}/blog/secret-santa-questionnaire`}>
                  Secret Santa questionnaire
                </RouterLink>
                .
              </Typography>
            </section>

            {IDEA_SECTIONS.map((section, sectionIndex) => (
              <section key={section.heading}>
                <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                  {section.heading}
                </Typography>
                {section.intro.map((paragraph) => (
                  <Typography key={paragraph} variant="body1" sx={{ mb: 2 }}>
                    {paragraph}
                  </Typography>
                ))}
                <Box component="ol" start={IDEA_OFFSETS[sectionIndex] + 1} sx={{ pl: 3, my: 0 }}>
                  {section.ideas.map(([name, note], ideaIndex) => (
                    <Typography
                      key={name}
                      id={`idea-${IDEA_OFFSETS[sectionIndex] + ideaIndex + 1}`}
                      component="li"
                      variant="body1"
                      sx={{ mb: 1 }}
                    >
                      <strong>{name}.</strong> {note}
                    </Typography>
                  ))}
                </Box>
              </section>
            ))}

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                What should you not put on a Christmas list?
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                A few items spoil even a good list: they make relatives uncomfortable, or the gift
                arrives too late or in the wrong version. This is what I suggest swapping:
              </Typography>
              <TableContainer component={Paper} variant="outlined" sx={{ bgcolor: 'background.paper', '& .MuiTableCell-root': { px: { xs: 1, sm: 2 } } }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Skip</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Why</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Ask for this instead</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>&quot;Just send money&quot;</TableCell>
                      <TableCell>Many relatives feel awkward giving cash with no purpose</TableCell>
                      <TableCell>A specific goal, or a fundraiser with a link</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Something you need tomorrow</TableCell>
                      <TableCell>It arrives after the holidays, and you buy it yourself anyway</TableCell>
                      <TableCell>Buy it now; list what can wait</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Clothes without a size</TableCell>
                      <TableCell>Relatives guess and get it wrong</TableCell>
                      <TableCell>Size and color in the description</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Only expensive things</TableCell>
                      <TableCell>Relatives feel awkward and buy something else</TableCell>
                      <TableCell>A few ideas under 25 EUR/USD</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>&quot;Skincare for my skin type&quot;</TableCell>
                      <TableCell>Without an exact product it is easy to miss</TableCell>
                      <TableCell>A link to the exact product</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>A pet as a surprise</TableCell>
                      <TableCell>It is years of responsibility, not a gift from a list</TableCell>
                      <TableCell>Talk it over separately, after the holidays</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                Frequently asked questions
              </Typography>

              <Typography variant="h6" component="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                How many things should I put on my Christmas list?
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                For the holidays I suggest 8-15 items across budgets. Fewer, and whoever opens the list
                last finds nothing left. More, and the list turns into a catalog that is hard to choose
                from.
              </Typography>

              <Typography variant="h6" component="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                Should I add prices to my list?
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Yes, at least roughly. WishList App has an optional price field with a currency: UAH,
                USD, EUR or GBP. A price helps relatives pick a gift that fits their budget instead of
                guessing.
              </Typography>

              <Typography variant="h6" component="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                Can I ask for money or a donation?
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Yes. Add the fundraiser as its own item with a link to its page, and say in the note
                what it is for. Mention that nobody needs to claim it, so several people can chip in.
              </Typography>

              <Typography variant="h6" component="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                What if I genuinely do not want anything?
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Start with experiences and practical things: tickets, a workshop, a power bank, warm
                socks. They are easy to give and do not clutter the house. Or add a donation to a cause
                you care about.
              </Typography>

              <Typography variant="h6" component="h3" sx={{ fontWeight: 600, fontSize: 18, mb: 1, mt: 2 }}>
                Will people see what others have already picked?
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Yes. A claimed gift shows as taken to everyone who opens the list, including you.
                Nobody sees who claimed it.
              </Typography>
            </section>

            <section>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: 22, mb: 1.5 }}>
                Start from a finished example
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                The easiest start is not a blank page. Open the{' '}
                <RouterLink to={`/${routeLang}/wishlist/christmas-list`}>
                  Christmas wish list example
                </RouterLink>
                : eleven gifts across budgets, with notes and prices. Tap &quot;Use this example&quot;,
                sign in with Google and check the name - a copy appears in your account. Then swap in
                ideas from this post and send the link to your family. They can open the list and claim
                a gift without signing up.
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
