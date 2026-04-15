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
