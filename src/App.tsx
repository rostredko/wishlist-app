import { lazy, Suspense, useEffect, useRef } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';
import { Box, CssBaseline, ThemeProvider, CircularProgress } from '@mui/material';
import { getRedirectResult } from 'firebase/auth';
import { darkTheme } from './theme';
import Cookies from 'js-cookie';
import { isProbablyBot, detectPreferredLang, SUPPORTED_LANGS } from './utils/locale';
import { auth } from '@lib/auth-client';
import { trackPageView } from './utils/analytics';

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

function AuthRedirectHandler() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Handle redirect result after Google OAuth redirect
    // This must be called only once per app load, as Firebase clears the result after first call
    getRedirectResult(auth)
      .then((result) => {
        if (result) {
          // User successfully signed in via redirect
          // Auth state will update automatically via onAuthStateChanged
          // Try to navigate back to the saved URL
          try {
            const returnUrl = sessionStorage.getItem('auth_return_url');
            if (returnUrl && returnUrl !== location.pathname) {
              navigate(returnUrl);
            }
            sessionStorage.removeItem('auth_return_url');
          } catch {
            // sessionStorage not available, stay on current page
          }
        }
      })
      .catch((error) => {
        // Ignore expected errors (user cancelled, etc.)
        if (
          error.code !== 'auth/operation-not-allowed' &&
          error.code !== 'auth/popup-closed-by-user' &&
          !error.message?.includes('initial state')
        ) {
          console.error('Auth redirect error:', error);
        }
      });
  }, []); // Empty deps - only run once on mount

  return null;
}

function RouteTracker() {
  const location = useLocation();
  const prevPathRef = useRef<string>('');

  useEffect(() => {
    // Skip tracking if this is the first page load and path hasn't changed
    // (to avoid duplicate page_view events)
    const currentPath = location.pathname + location.search;

    if (prevPathRef.current === currentPath) {
      return;
    }

    // Track page view
    const pageTitle = typeof document !== 'undefined' ? document.title : '';
    trackPageView(currentPath, pageTitle).catch((error) => {
      console.error('Failed to track page view:', error);
    });

    prevPathRef.current = currentPath;
  }, [location.pathname, location.search]);

  return null;
}

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthRedirectHandler />
        <RouteTracker />
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