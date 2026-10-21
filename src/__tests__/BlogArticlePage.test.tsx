import { describe, it, expect, afterEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import '../../src/i18n';
import BlogArticlePage from '@components/blog/BlogArticlePage';

describe('BlogArticlePage', () => {
  afterEach(() => {
    document.head.innerHTML = '';
    document.documentElement.lang = 'en';
  });

  it('renders the how-to-create-a-wishlist article for both languages', async () => {
    const { unmount } = render(
      <MemoryRouter initialEntries={['/en/blog/how-to-create-a-wishlist']}>
        <Routes>
          <Route path="/:lng/blog/:slug" element={<BlogArticlePage />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(
      await screen.findByRole('heading', { name: /How to create a wishlist/i, level: 1 }),
    ).toBeInTheDocument();
    unmount();

    render(
      <MemoryRouter initialEntries={['/ua/blog/yak-zrobyty-vishlist']}>
        <Routes>
          <Route path="/:lng/blog/:slug" element={<BlogArticlePage />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(
      await screen.findByRole('heading', { name: /Як зробити вішліст/i, level: 1 }),
    ).toBeInTheDocument();
  });

  it('renders not found and noindex for an unknown slug', async () => {
    render(
      <MemoryRouter initialEntries={['/en/blog/unknown-slug']}>
        <Routes>
          <Route path="/:lng/blog/:slug" element={<BlogArticlePage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByRole('heading', { name: /Post not found/i })).toBeInTheDocument();

    await waitFor(() => {
      expect(document.head.querySelector('meta[name="robots"]')?.getAttribute('content')).toContain('noindex');
    });
  });
});

describe('article language equivalence', () => {
  it('keeps related topics accessible without advertising them as translations', async () => {
    render(
      <MemoryRouter initialEntries={['/ua/blog/najkrashchi-servisy-spysku-bazhan-v-ukraini']}>
        <Routes><Route path="/:lng/blog/:slug" element={<BlogArticlePage />} /></Routes>
      </MemoryRouter>,
    );
    expect(await screen.findByRole('heading', { name: /Сервіси для списку бажань в Україні/i, level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Wishpicks' })).toHaveAttribute('href', 'https://wishpicks.com/uk');
    expect(screen.getByRole('link', { name: 'Bazhannya' })).toHaveAttribute('href', 'https://bazhannya.com/');
    expect(screen.getAllByText(/2026-10-09/).length).toBeGreaterThan(0);
    await waitFor(() => expect(document.head.querySelector('link[hreflang]')).toBeNull());
  });
});
