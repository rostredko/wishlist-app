import { afterEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import '../i18n';
import NotFoundPage from '@components/NotFoundPage';

afterEach(() => { document.head.innerHTML = ''; });

describe('not-found route', () => {
  it.each([
    ['/en/missing-page', 'Page not found', '/en'],
    ['/ua/missing-page', 'Сторінку не знайдено', '/ua'],
  ])('shows a localized unlisted page for %s', (url, heading, home) => {
    render(<MemoryRouter initialEntries={[url]}><Routes><Route path="*" element={<NotFoundPage />} /></Routes></MemoryRouter>);
    expect(screen.getByRole('heading', { level: 1, name: heading })).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', home);
    expect(document.head.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe('noindex,follow');
    expect(document.head.querySelector('link[hreflang]')).toBeNull();
  });
});
