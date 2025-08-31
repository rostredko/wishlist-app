import ConfirmDialog from '@components/ConfirmDialog';
import { customRender as render, screen } from '../test/render';
import userEvent from '@testing-library/user-event';
import { fireEvent } from '@testing-library/react';
import { vi } from 'vitest';

describe('ConfirmDialog (skeleton logic)', () => {
  it('binds title to dialog accessible name (aria-labelledby)', () => {
    render(
      <ConfirmDialog
        open
        title="Delete?"
        onClose={() => {}}
        onConfirm={() => {}}
      />
    );
    expect(screen.getByRole('dialog', { name: /delete\?/i })).toBeInTheDocument();
  });

  it('loading=true: buttons disabled and callbacks NOT called', async () => {
    const onClose = vi.fn();
    const onConfirm = vi.fn();

    render(
      <ConfirmDialog
        open
        title="Delete?"
        onClose={onClose}
        onConfirm={onConfirm}
        loading
        disableBackdropClose
      />
    );

    const loadingBtn = screen.getByRole('button', { name: /please wait/i });
    const cancelBtn  = screen.getByRole('button', { name: /cancel/i });

    expect(loadingBtn).toBeDisabled();
    expect(cancelBtn).toBeDisabled();

    expect(onConfirm).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });

  it('calls callbacks when not loading', async () => {
    const onClose = vi.fn();
    const onConfirm = vi.fn();

    render(
      <ConfirmDialog
        open
        title="Delete?"
        onClose={onClose}
        onConfirm={onConfirm}
        confirmText="Delete"
      />
    );

    await userEvent.click(screen.getByRole('button', { name: /delete/i }));
    expect(onConfirm).toHaveBeenCalled();

    await userEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(onClose).toHaveBeenCalled();
  });

  it('disableBackdropClose prevents closing on Escape; enabled allows it', async () => {
    const onClose = vi.fn();

    const { rerender } = render(
      <ConfirmDialog
        open
        title="Sure?"
        onClose={onClose}
        onConfirm={() => {}}
        disableBackdropClose
      />
    );

    const dialog = screen.getByRole('dialog', { name: /sure\?/i });
    fireEvent.keyDown(dialog, { key: 'Escape', code: 'Escape' });
    expect(onClose).not.toHaveBeenCalled();

    rerender(
      <ConfirmDialog
        open
        title="Sure?"
        onClose={onClose}
        onConfirm={() => {}}
      />
    );
    const dialog2 = screen.getByRole('dialog', { name: /sure\?/i });
    fireEvent.keyDown(dialog2, { key: 'Escape', code: 'Escape' });

    expect(onClose).toHaveBeenCalled();
  });

  it('does not render when open=false', () => {
    render(
      <ConfirmDialog
        open={false}
        title="Hidden"
        onClose={() => {}}
        onConfirm={() => {}}
      />
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});