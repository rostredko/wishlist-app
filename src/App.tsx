import { lazy, Suspense, useEffect, useLayoutEffect, useRef, type ReactNode } from 'react';
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
import { isProbablyBot, detectPreferredLang, SUPPORTED_LANGS, type SupportedLang } from './utils/locale';
import i18n from './i18n';
import { auth } from '@lib/auth-client';
import { useAuth } from '@hooks/useAuth';
import HomePage from '@components/HomePage';
import { trackPageView } from './utils/analytics';
import { clearPendingWishlistCreateAfterAuth, completePendingWishlistAuth, hasPendingWishlistRedirect, getPendingWishlistAuthAttempt, discardPendingWishlistCreateOnNavigation } from '@utils/pendingWishlistCreate';

function scrollWindowToTop() {
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
}

const NotFoundPage = lazy(() => import('@components/NotFoundPage'));
const WishListItemList = lazy(() =>
  import('@components/WishListItemList').then((m) => ({ default: m.WishListItemList }))
);
const PrivacyPage = lazy(() => import('@components/PrivacyPage'));
const BlogHubPage = lazy(() => import('@components/blog/BlogHubPage'));
const BlogArticlePage = lazy(() => import('@components/blog/BlogArticlePage'));
import Footer from '@components/Footer';

function ValidLocale({ children }: { children: ReactNode }) {
  const { lng } = useParams();
  return lng === 'ua' || lng === 'en' ? children : <NotFoundPage />;
}

function CanonicalWishlistRedirect() {
  const { lng, wishlistId } = useParams();
  return <Navigate to={`/${lng}/wishlist/${wishlistId}`} replace />;
}

function LegacyHowToHubRedirect() {
  const { lng } = useParams();
  const l = lng === 'en' || lng === 'ua' ? lng : 'ua';
  return <Navigate to={`/${l}/blog`} replace />;
}

function LegacyHowToArticleRedirect() {
  const { lng, slug = '' } = useParams<{ lng: string; slug: string }>();
  const l = lng === 'en' || lng === 'ua' ? lng : 'ua';
  const to = slug ? `/${l}/blog/${slug}` : `/${l}/blog`;
  return <Navigate to={to} replace />;
}

function getRouteLanguage(pathname: string): SupportedLang | undefined {
  const maybeLang = pathname.split('/').filter(Boolean)[0];
  if (maybeLang === 'ua' || maybeLang === 'en') return maybeLang;
  return undefined;
}

function RouteLanguageSync() {
  const location = useLocation();

  useLayoutEffect(() => {
    const routeLang = getRouteLanguage(location.pathname);
    if (!routeLang) return;
    if (i18n.language === routeLang) return;
    i18n.changeLanguage(routeLang).catch(() => {
    });
  }, [location.pathname]);

  return null;
}

function FirstVisitGate() {
  const nav = useNavigate();
  const loc = useLocation();

  useEffect(() => {
    if (isProbablyBot(navigator.userAgent)) return;

    const cookieLang = Cookies.get('lng');
    if (cookieLang && SUPPORTED_LANGS.includes(cookieLang as SupportedLang)) {
      if (loc.pathname === '/') nav(`/${cookieLang}`, { replace: true });
      return;
    }

    const preferred = detectPreferredLang(navigator.languages?.[0] || navigator.language);
    Cookies.set('lng', preferred, { expires: 365, sameSite: 'Lax' });
    if (loc.pathname === '/') nav(`/${preferred}`, { replace: true });
  }, [loc.pathname, nav]);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 }}>
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

let redirectResultPromise: ReturnType<typeof getRedirectResult> | undefined;

function AuthRedirectHandler() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let active = true;
    const wasPendingRedirect = hasPendingWishlistRedirect();
    const attemptId = getPendingWishlistAuthAttempt();
    redirectResultPromise ??= getRedirectResult(auth);
    void redirectResultPromise.then(result => {
      if (!active) return;
      if (!result) {
        if (wasPendingRedirect && attemptId) clearPendingWishlistCreateAfterAuth(attemptId);
        return;
      }
      let returnUrl: string | null = null;
      try {
        returnUrl = sessionStorage.getItem('auth_return_url');
        sessionStorage.removeItem('auth_return_url');
      } catch { /* Restricted storage: remain on the current route. */ }
      if (returnUrl && /^\/(ua|en)(?:\/|$)/.test(returnUrl) && returnUrl !== location.pathname) navigate(returnUrl, { replace: true });
      if (wasPendingRedirect && attemptId) completePendingWishlistAuth(attemptId);
    }).catch(() => {
      if (active && wasPendingRedirect && attemptId) clearPendingWishlistCreateAfterAuth(attemptId);
    });
    return () => { active = false; };
    // Firebase consumes redirect results once; route changes must not re-run the exchange.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- one exchange for this app load
  }, []);

  return null;
}

function CreationIntentRouteGuard() {
  const { pathname } = useLocation();
  const previousPath = useRef(pathname);
  useEffect(() => {
    if (previousPath.current !== pathname) discardPendingWishlistCreateOnNavigation(pathname);
    previousPath.current = pathname;
  }, [pathname]);
  return null;
}

function RouteTracker() {
  const location = useLocation();
  const prevPathRef = useRef<string>('');

  useEffect(() => {
    const path = location.pathname;
    if (prevPathRef.current === path || path === '/' || /^\/wishlist\//.test(path) || /\/(how-to|wishlists)(?:\/|$)/.test(path)) return;
    prevPathRef.current = path;
    void trackPageView(path);
  }, [location.pathname]);

  return null;
}

/** SPA: keep window scroll at top on navigation; also after sign-in so focus/footer does not leave the viewport at the bottom. */
function ScrollToTop() {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const hadUserRef = useRef<boolean | undefined>(undefined);

  useEffect(() => {
    scrollWindowToTop();
  }, [pathname]);

  useEffect(() => {
    const signedIn = user != null;
    if (hadUserRef.current === undefined) {
      hadUserRef.current = signedIn;
      return;
    }
    if (!hadUserRef.current && signedIn) {
      scrollWindowToTop();
    }
    hadUserRef.current = signedIn;
  }, [user]);

  return null;
}

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <BrowserRouter>
        <RouteLanguageSync />
        <ScrollToTop />
        <AuthRedirectHandler />
        <CreationIntentRouteGuard />
        <RouteTracker />
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ flexGrow: 1 }}>
            <Suspense
              fallback={
                // Reserve the viewport so the footer does not jump when a lazy route loads.
                <Box sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 }}>
                  <CircularProgress />
                </Box>
              }
            >
              <Routes>
                <Route path="/" element={<FirstVisitGate />} />

                <Route path="/ua" element={<LocalizedHome lng="ua" />} />
                <Route path="/en" element={<LocalizedHome lng="en" />} />

                <Route path="/:lng/privacy" element={<ValidLocale><PrivacyPage /></ValidLocale>} />

                <Route path="/:lng/blog" element={<ValidLocale><BlogHubPage /></ValidLocale>} />
                <Route path="/:lng/blog/:slug" element={<ValidLocale><BlogArticlePage /></ValidLocale>} />

                <Route path="/:lng/how-to" element={<ValidLocale><LegacyHowToHubRedirect /></ValidLocale>} />
                <Route path="/:lng/how-to/:slug" element={<ValidLocale><LegacyHowToArticleRedirect /></ValidLocale>} />

                <Route path="/:lng/wishlist/:wishlistId" element={<ValidLocale><WishListItemList /></ValidLocale>} />

                <Route path="/:lng/wishlists/:wishlistId" element={<ValidLocale><CanonicalWishlistRedirect /></ValidLocale>} />

                <Route path="/wishlist/:wishlistId" element={<LegacyWishlistRedirect />} />

                <Route path="*" element={<NotFoundPage />} />
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
