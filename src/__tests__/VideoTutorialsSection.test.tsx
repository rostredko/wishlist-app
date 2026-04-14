import { describe, expect, it } from 'vitest';
import userEvent from '@testing-library/user-event';
import '../../src/i18n';
import { customRender as render, screen } from '../test/render';
import VideoTutorialsSection from '@components/VideoTutorialsSection';

describe('VideoTutorialsSection', () => {
  it('renders YouTube facade with accessible play buttons for both videos', () => {
    render(<VideoTutorialsSection lang="en" />);

    expect(screen.getByRole('button', { name: 'How to create a wishlist' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'How to pick a gift' })).toBeInTheDocument();
  });

  it('activates the iframe when the play button is clicked', async () => {
    render(<VideoTutorialsSection lang="en" />);

    const playBtn = screen.getByRole('button', { name: 'How to create a wishlist' });
    await userEvent.click(playBtn);

    const iframe = screen.getByTitle('How to create a wishlist');
    expect(iframe.tagName).toBe('IFRAME');
    expect(iframe).toHaveAttribute('src', expect.stringContaining('npDaaf1rS2k'));
    expect(iframe).toHaveAttribute('src', expect.stringContaining('autoplay=1'));
  });

  it('activates the iframe via keyboard (Enter key)', async () => {
    render(<VideoTutorialsSection lang="en" />);

    const playBtn = screen.getByRole('button', { name: 'How to pick a gift' });
    playBtn.focus();
    await userEvent.keyboard('{Enter}');

    const iframe = screen.getByTitle('How to pick a gift');
    expect(iframe.tagName).toBe('IFRAME');
    expect(iframe).toHaveAttribute('src', expect.stringContaining('iM0W6UvTm8c'));
  });
});
