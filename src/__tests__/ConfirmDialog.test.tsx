import ConfirmDialog from '@components/ConfirmDialog';
import {customRender as render, screen} from '../test/render';
import userEvent from '@testing-library/user-event';
import {vi, describe, it, expect} from 'vitest';
import '../../src/i18n';

describe('ConfirmDialog (skeleton logic)', () => {
  it('binds title to dialog accessible name (aria-labelledby)', () => {
    render(
      <ConfirmDialog
        open
        title="Delete?"
        onClose={() => {
        }}
        onConfirm={() => {
        }}
      />
    );
    expect(screen.getByRole('dialog', {name: /delete\?/i})).toBeInTheDocument();
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

    const loadingBtn = screen.getByRole('button', {name: /please wait/i});
    const cancelBtn = screen.getByRole('button', {name: /cancel/i});

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

    await userEvent.click(screen.getByRole('button', {name: /delete/i}));
    expect(onConfirm).toHaveBeenCalled();

    await userEvent.click(screen.getByRole('button', {name: /cancel/i}));
    expect(onClose).toHaveBeenCalled();
  });

  it('disableBackdropClose prevents closing on backdrop; enabled allows it', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();

    const {rerender} = render(
      <ConfirmDialog
        open
        title="Sure?"
        onClose={onClose}
        onConfirm={() => {
        }}
        disableBackdropClose
      />
    );

    const container1 = document.querySelector('.MuiDialog-container') as HTMLElement | null;
    expect(container1).toBeTruthy();
    if (container1) {
      await user.click(container1);
    }
    expect(onClose).not.toHaveBeenCalled();

    rerender(
      <ConfirmDialog
        open
        title="Sure?"
        onClose={onClose}
        onConfirm={() => {
        }}
      />
    );

    const container2 = document.querySelector('.MuiDialog-container') as HTMLElement | null;
    expect(container2).toBeTruthy();
    if (container2) {
      await user.click(container2);
    }

    await vi.waitFor(() => expect(onClose).toHaveBeenCalled());
  });

  it('does not render when open=false', () => {
    render(
      <ConfirmDialog
        open={false}
        title="Hidden"
        onClose={() => {
        }}
        onConfirm={() => {
        }}
      />
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});