import { beforeEach, describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import '../../src/i18n';
import { customRender as render, screen } from '../test/render';
import { HomePageInfoCard } from '@components/HomePageInfoCard';
import { trackEvent } from '@utils/analytics';

vi.mock('@utils/analytics', () => ({ trackEvent: vi.fn().mockResolvedValue(undefined) }));

const season = vi.hoisted(() => ({ active: true }));
vi.mock('@constants/season', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@constants/season')>()),
  get HOLIDAY_SEASON_ACTIVE() { return season.active; },
}));

const guidesLine = (label: RegExp) => screen.queryByText(label, { selector: 'p' });

beforeEach(() => {
  season.active = true;
  vi.mocked(trackEvent).mockClear();
});

describe('HomePageInfoCard holiday guides line', () => {
  it('links the three Ukrainian holiday guides', () => {
    render(<HomePageInfoCard lang="ua" />);
    expect(guidesLine(/^Гайди до свят:/)).not.toBeNull();
    expect(screen.getByRole('link', { name: 'Вішліст на Новий рік' })).toHaveAttribute('href', '/ua/blog/vishlist-na-novyj-rik-i-rizdvo');
    expect(screen.getByRole('link', { name: 'Лист Святому Миколаю' })).toHaveAttribute('href', '/ua/blog/lyst-svyatomu-mykolayu');
    expect(screen.getByRole('link', { name: 'Таємний Санта' })).toHaveAttribute('href', '/ua/blog/tayemnyj-santa-pravyla');
  });

  it('links the three English holiday guides', () => {
    render(<HomePageInfoCard lang="en" />);
    expect(guidesLine(/^Holiday guides:/)).not.toBeNull();
    expect(screen.getByRole('link', { name: 'Christmas wish list' })).toHaveAttribute('href', '/en/blog/christmas-wishlist');
    expect(screen.getByRole('link', { name: "Kids' Christmas list" })).toHaveAttribute('href', '/en/blog/kids-christmas-list');
    expect(screen.getByRole('link', { name: 'Secret Santa questionnaire' })).toHaveAttribute('href', '/en/blog/secret-santa-questionnaire');
  });

  it('reports which guide was opened with a bounded key', async () => {
    render(<HomePageInfoCard lang="en" />);
    await userEvent.click(screen.getByRole('link', { name: "Kids' Christmas list" }));
    expect(trackEvent).toHaveBeenCalledWith('holiday_guide_click', { guide: 'st_nicholas' });
  });

  it('renders nothing when the season flag is off', () => {
    season.active = false;
    render(<HomePageInfoCard lang="en" />);
    expect(guidesLine(/^Holiday guides:/)).toBeNull();
    expect(screen.queryByRole('link', { name: 'Christmas wish list' })).toBeNull();
  });
});
