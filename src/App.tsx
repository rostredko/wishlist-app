import {lazy, Suspense, useEffect} from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';
import {Box, CssBaseline, ThemeProvider, CircularProgress} from '@mui/material';
import {darkTheme} from './theme';
import Cookies from 'js-cookie';
import {isProbablyBot, detectPreferredLang, SUPPORTED_LANGS} from './utils/locale';

const HomePage = lazy(() => import('@components/HomePage'));
const WishListItemList = lazy(() =>
  import('@components/WishListItemList').then((m) => ({ default: m.WishListItemList }))
);
import Footer from '@components/Footer';

function FirstVisitGate() {
  const nav = useNavigate();
  const loc = useLocation();

  useEffect(() => {
    if (isProbablyBot(navigator.userAgent)) return;

    const cookieLang = Cookies.get('lng');
    if (cookieLang && SUPPORTED_LANGS.includes(cookieLang as any)) {
      if (loc.pathname === '/') nav(`/${cookieLang}`, { replace: true });
      return;
    }

    const preferred = detectPreferredLang(navigator.languages?.[0] || navigator.language);
    Cookies.set('lng', preferred, { expires: 365, sameSite: 'Lax' });
    if (loc.pathname === '/') nav(`/${preferred}`, { replace: true });
  }, [loc.pathname, nav]);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 }}>
      <a href="/ua" style={{ marginRight: 16 }}>Українською</a>
      <a href="/en">English</a>
    </Box>
  );
}

function LocalizedHome({ lng }: { lng: 'ua' | 'en' }) {
  return <HomePage lang={lng} />;
}

function LegacyWishlistRedirect() {
  const nav = useNavigate();
  const { wishlistId } = useParams();
  useEffect(() => {
    const cookieLang = Cookies.get('lng');
    const lng = (cookieLang === 'ua' || cookieLang === 'en')
      ? cookieLang
      : detectPreferredLang(navigator.languages?.[0] || navigator.language);
    nav(`/${lng}/wishlist/${wishlistId}`, { replace: true });
  }, [nav, wishlistId]);
  return null;
}

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <BrowserRouter>
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Box component="main" sx={{ flexGrow: 1 }}>
            <Suspense
              fallback={
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 }}>
                  <CircularProgress />
                </Box>
              }
            >
              <Routes>
                <Route path="/" element={<FirstVisitGate />} />

                <Route path="/ua" element={<LocalizedHome lng="ua" />} />
                <Route path="/en" element={<LocalizedHome lng="en" />} />

                <Route path="/:lng/wishlist/:wishlistId" element={<WishListItemList />} />

                <Route path="/:lng/wishlists/:wishlistId" element={<WishListItemList />} />

                <Route path="/wishlist/:wishlistId" element={<LegacyWishlistRedirect />} />

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </Box>

          <Footer />
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;