import { describe, it, expect, vi } from 'vitest';
import { customRender as render, screen } from '../test/render';
import userEvent from '@testing-library/user-event';
import CustomCheckbox from '@components/CustomCheckbox';

describe('CustomCheckbox (skeleton)', () => {
  it('renders as an unchecked checkbox by default', () => {
    render(<CustomCheckbox />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('toggles checked state on click (uncontrolled)', async () => {
    render(<CustomCheckbox />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();

    await userEvent.click(checkbox);
    expect(checkbox).toBeChecked();

    await userEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it('respects controlled checked prop', () => {
    const { rerender } = render(<CustomCheckbox checked={false} />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();

    rerender(<CustomCheckbox checked={true} />);
    expect(checkbox).toBeChecked();
  });

  it('fires onChange when clicked', async () => {
    const onChange = vi.fn();
    render(<CustomCheckbox onChange={onChange} />);
    const checkbox = screen.getByRole('checkbox');

    await userEvent.click(checkbox);
    expect(onChange).toHaveBeenCalled();
  });
});