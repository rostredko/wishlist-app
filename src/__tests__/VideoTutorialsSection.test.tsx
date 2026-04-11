import { describe, expect, it } from 'vitest';
import '../../src/i18n';
import { customRender as render, screen } from '../test/render';
import VideoTutorialsSection from '@components/VideoTutorialsSection';

describe('VideoTutorialsSection', () => {
  it('renders tutorial iframes with localized titles and lazy loading', () => {
    render(<VideoTutorialsSection />);

    const firstVideo = screen.getByTitle('How to create a wishlist');
    const secondVideo = screen.getByTitle('How to pick a gift');

    expect(firstVideo).toHaveAttribute('loading', 'lazy');
    expect(secondVideo).toHaveAttribute('loading', 'lazy');
  });
});
