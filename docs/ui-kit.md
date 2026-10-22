# UI kit – WishList App

Reference for typography, actions, layout, and copy rules. Implementation lives in MUI v7 + `src/theme.ts`. Prefer reusing these patterns over one-off styles.

---

## Principles

- **Dark mode only** – `ThemeProvider` uses `darkTheme` from `src/theme.ts`.
- **MUI first** – use Material components; avoid custom CSS unless necessary (see `CLAUDE.md`).
- **Mobile-first** – default styles target the smallest breakpoint (`xs`); enhance with `sm`, `md` using `sx` or `theme.breakpoints.up(...)`.
- **i18n** – all user-visible strings in `src/locales/{en,ua}/`, never hardcoded in components.
- **Punctuation** – ASCII hyphen `-` only, not em dash (U+2014); same rule as `CLAUDE.md`.

---

## Color & surfaces

Defined in `theme.ts` (palette); a few legacy one-offs exist in layout components.

| Token / use | Value / note |
|---------------|----------------|
| `palette.mode` | `dark` |
| `palette.primary.main` | `#2196f3` (main CTA, links, focus) |
| `palette.background.default` | `#1c1c1c` (page chrome) |
| `palette.background.paper` | `#282828` (cards, panels) |
| Muted body text | Often `#aaa` via `sx` (e.g. footer greeting) |
| Footer strip | `#1e1e1e`, top border `#333` (`Footer.tsx`) |
| Secondary text (dialogs) | `color="text.secondary"` on `Typography` |

---

## Typography

**Font stack:** `Inter, Roboto, sans-serif` (`theme.ts`).

### Semantic landing / home card (`HomePage.tsx`)

| Role | MUI | Notes |
|------|-----|--------|
| Main page title | `variant="h3"` `component="h1"` | `fontWeight: 800`; theme scales h3 by breakpoint (~1.65rem → 2rem → 2.5rem) |
| Hero subtitle | `variant="h5"` `component="h2"` | Supporting SEO line; `fontWeight: 500`, `opacity: ~0.88`, responsive `fontSize` (~1.125–1.375rem), `maxWidth: 42rem` |
| Section “What” | `variant="subtitle1"` `component="h2"` | `fontWeight: 700`, `fontSize: { xs: 22, sm: 25 }` |
| Section “How” | Same as above | Slightly smaller: `fontSize: { xs: 20, sm: 22 }` |
| Feature bullets / list body | `variant="body1"` | `fontSize: 18`, `display: 'flex'`, `alignItems: 'flex-start'`, `gap: 1` when paired with emoji |
| Brand in app bar | `variant="h6"` `component="span"` | `fontWeight: 800`, `letterSpacing: 0.02` |

### Elsewhere

| Role | Pattern |
|------|---------|
| FAQ title (`Footer.tsx`) | `subtitle1`, `fontWeight: 700`, `fontSize: 24` |
| FAQ question | Default `Typography`, `fontWeight: 600` |
| FAQ answer | Default `Typography` |
| Dialog description | `variant="body2"` `color="text.secondary"` |
| Emphasis line | `body1` + `fontWeight: 600` |
| Muted small copy | `body2` + `color: '#aaa'` or `text.secondary` |

---

## Buttons

| Intent | `variant` | `color` | Typical `sx` / notes |
|--------|-----------|---------|----------------------|
| **Primary CTA** (create list, main submit, sign-in in Telegram flow) | `contained` | default (`primary`) | Often `fontWeight: 700`; on narrow screens `width: '100%'`, `sm+` `auto` |
| **Secondary** (alternate path, open example, create when empty) | `outlined` | default (outline uses primary) | Full-width on mobile when stacked |
| **Footer sign-in** | `outlined` | default (`primary`) border | `sx={{ color: 'text.primary' }}` keeps small text readable on the dark footer |
| **Sign out / low-emphasis destructive-adjacent** | `outlined` | `secondary` | `Footer.tsx` auth strip |
| **Dialog cancel** | default (text) | default | `ConfirmDialog` – no `variant` on cancel |
| **Dialog confirm** | `contained` | `primary` or `error` if `destructive` | Loading state shows wait label |

**Size:** `size="medium"` for main chrome CTAs where specified.

**Icon actions:** `IconButton` for compact tools (e.g. delete on list rows).

---

## Layout & spacing

- **Page:** Content wrapped in MUI `Container` / `Stack` / `Box` with responsive `padding` and `maxWidth` where needed.
- **Home `main` (`HomePage.tsx`):** `pt: { xs: 6, md: 10 }`, `pb: 2` – tighter bottom padding so spacing from the primary “Create wishlist” CTA to the footer border stays in sync with in-section rhythm.
- **Home primary CTA (guest + logged-in):** outer `Stack` `mt: 4`, `pb: 4`; inner row `mt: 6` above the large `contained` button (mirrors grid → CTA → footer gaps).
- **Cards:** `Card variant="outlined"` + `sx={{ bgcolor: 'background.paper' }}` for primary content blocks.
- **Stacks:** Common gaps – `spacing={2}` inside cards (sections, bullet groups), `spacing={3}` between major vertical blocks on the home page.
- **Responsive width:** Primary buttons often `width: { xs: '100%', sm: 'auto' }` so thumbs reach CTAs on phones.
- **Max width for readability:** Long hero copy `maxWidth: '42rem'`; FAQ card `maxWidth: theme.breakpoints.values.md`.
- **Scroll:** `ScrollToTop` in `App.tsx` – `window` scroll to top on `pathname` change and when auth goes from guest to signed-in (avoids stale scroll + footer focus jump).

---

## Breakpoints (MUI defaults)

Use `xs` (0), `sm` (600px), `md` (900px), `lg` (1200px), `xl` (1536px). Theme customizations for **h3** and **h4** use `foundation.breakpoints.up('sm' | 'md')` in `theme.ts`.

---

## Icons & emoji

- **MUI icons** – `@mui/icons-material` (e.g. `DeleteIcon`, `ExpandMoreIcon`).
- **Emoji** – used in locale strings for section headers and bullets (keep them in JSON, not inline in TSX).

---

## Accessibility

- Primary actions: `aria-label` where the visible label is insufficient (e.g. icon-only).
- Dialogs: `aria-labelledby` on `DialogTitle`.
- Prefer semantic headings (`h1` → `h2` → …) as on the home hero.

---

## Files to check when extending the kit

- `src/App.tsx` – router shell, `ScrollToTop`, lazy routes.
- `src/theme.ts` – global palette and headline scale.
- `src/Components/HomePage.tsx` – hero and marketing card patterns.
- `src/Components/Footer.tsx` – FAQ accordion, sign-in / sign-out strip.
- `src/Components/ConfirmDialog.tsx` – dialog actions.

When you introduce a new repeated pattern, update this document in the same PR.
