import {render, screen, waitFor} from '@testing-library/react';
import {StrictMode} from 'react';
import userEvent from '@testing-library/user-event';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import App from '../App';
import enHome from '../locales/en/home.json';
import enBlog from '../locales/en/blog.json';
import uaHome from '../locales/ua/home.json';
import {
  clearPendingWishlistCreateAfterAuth,
  consumePendingWishlistCreateAfterAuth,
  markPendingWishlistRedirect,
  setPendingWishlistCreateAfterAuth,
} from '@utils/pendingWishlistCreate';

const mocks = vi.hoisted(() => ({redirectResult: vi.fn(), gtag: vi.fn()}));
vi.mock('firebase/auth', () => ({getRedirectResult: mocks.redirectResult}));
vi.mock('@lib/auth-client', () => ({auth: {}}));
vi.mock('@hooks/useAuth', () => ({useAuth: () => ({user: null, isAdmin: false, loading: false})}));
vi.mock('@components/HomePage', () => ({default: ({lang}: {lang: string}) => <h1>Home {lang}</h1>}));
vi.mock('@components/blog/BlogHubPage', () => ({default: () => <h1>Blog</h1>}));
vi.mock('@components/blog/BlogArticlePage', () => ({default: () => <h1>Article</h1>}));
vi.mock('@components/PrivacyPage', () => ({default: () => <h1>Privacy</h1>}));
vi.mock('@components/NotFoundPage', () => ({default: () => <h1>Not found</h1>}));
vi.mock('@components/WishListItemList', () => ({WishListItemList: () => <h1>Wishlist</h1>}));
vi.mock('@components/Footer', async () => {
  const {Link, useNavigate} = await import('react-router-dom');
  return {default: function TestFooter() {
    const navigate = useNavigate();
    return <nav>
      <Link to="/en/blog">Blog link</Link>
      <Link to="/ua">Ukrainian link</Link>
      <Link to="/en/blog?tracking=changed">Query link</Link>
      <Link to="/en/how-to">Legacy link</Link>
      <button onClick={() => navigate(-1)}>Back</button>
      <button onClick={() => navigate(1)}>Forward</button>
    </nav>;
  }};
});

const pageViews = () => mocks.gtag.mock.calls.filter(call => call[0] === 'event' && call[1] === 'page_view');
const pagePaths = () => pageViews().map(call => call[2].page_path);

beforeEach(() => {
  vi.clearAllMocks();
  clearPendingWishlistCreateAfterAuth();
  sessionStorage.clear();
  window.history.replaceState({}, '', '/en');
  window.gtag = mocks.gtag;
  window.dataLayer = [];
  vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined);
  mocks.redirectResult.mockResolvedValue({user: {uid: 'signed-in'}});
});

describe('App redirect recovery and route analytics', () => {
  it('recovers a redirect result once and restores the scoped return route', async () => {
    const intent = {action: 'create', language: 'en', path: '/en', source: 'home'} as const;
    setPendingWishlistCreateAfterAuth(intent);
    markPendingWishlistRedirect();
    sessionStorage.setItem('auth_return_url', '/en');
    window.history.replaceState({}, '', '/ua');
    render(<App/>);
    expect(await screen.findByRole('heading', {name: 'Home en'})).toBeInTheDocument();
    expect(mocks.redirectResult).toHaveBeenCalledTimes(1);
    expect(sessionStorage.getItem('auth_return_url')).toBeNull();
    expect(consumePendingWishlistCreateAfterAuth('/ua')).toBeNull();
    expect(consumePendingWishlistCreateAfterAuth('/en')).toEqual(expect.objectContaining(intent));
    await userEvent.click(screen.getByRole('link', {name: 'Blog link'}));
    expect(await screen.findByRole('heading', {name: 'Blog'})).toBeInTheDocument();
    expect(mocks.redirectResult).toHaveBeenCalledTimes(1);
  });

  it('sends one cold English pageview with stable route metadata', async () => {
    document.title = 'Stale title from a previous page';
    render(<StrictMode><App/></StrictMode>);
    await screen.findByRole('heading', {name: 'Home en'});
    await waitFor(() => expect(pageViews()).toHaveLength(1));
    expect(pageViews()[0][2]).toEqual(expect.objectContaining({
      page_path: '/en', language: 'en', page_type: 'home', page_title: enHome.title,
    }));
  });

  it('tracks blog, browser back/forward and language changes exactly once while ignoring query changes', async () => {
    render(<App/>);
    await screen.findByRole('heading', {name: 'Home en'});
    await userEvent.click(screen.getByRole('link', {name: 'Blog link'}));
    await screen.findByRole('heading', {name: 'Blog'});
    await userEvent.click(screen.getByRole('button', {name: 'Back'}));
    await screen.findByRole('heading', {name: 'Home en'});
    await userEvent.click(screen.getByRole('button', {name: 'Forward'}));
    await screen.findByRole('heading', {name: 'Blog'});
    await userEvent.click(screen.getByRole('link', {name: 'Query link'}));
    await userEvent.click(screen.getByRole('link', {name: 'Ukrainian link'}));
    await screen.findByRole('heading', {name: 'Home ua'});
    expect(pagePaths()).toEqual(['/en', '/en/blog', '/en', '/en/blog', '/ua']);
    expect(pageViews()[1][2]).toEqual(expect.objectContaining({page_title: enBlog.hub.title, language: 'en', page_type: 'blog'}));
    expect(pageViews()[4][2]).toEqual(expect.objectContaining({page_title: uaHome.title, language: 'ua', page_type: 'home'}));
  });

  it('tracks only the canonical destination for a legacy blog redirect', async () => {
    window.history.replaceState({}, '', '/en/how-to');
    render(<App/>);
    await screen.findByRole('heading', {name: 'Blog'});
    expect(pagePaths()).toEqual(['/en/blog']);
  });

  it('tracks only the canonical destination for a legacy wishlist redirect', async () => {
    window.history.replaceState({}, '', '/en/wishlists/private-id');
    render(<App/>);
    await screen.findByRole('heading', {name: 'Wishlist'});
    expect(pagePaths()).toEqual(['/en/wishlist/personal']);
  });

  it('does not leak query values into analytics when the initial route contains them', async () => {
    window.history.replaceState({}, '', '/en?private=secret');
    render(<App/>);
    await screen.findByRole('heading', {name: 'Home en'});
    expect(pagePaths()).toEqual(['/en']);
    expect(JSON.stringify(pageViews())).not.toContain('secret');
  });
});
