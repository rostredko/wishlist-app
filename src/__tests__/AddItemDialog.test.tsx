import {describe, it, expect, vi} from 'vitest';
import {customRender as render, screen, act, fireEvent} from '../test/render';
import userEvent from '@testing-library/user-event';
import '../../src/i18n';
import AddItemDialog from '@components/AddItemDialog';

const getInputs = () => ({
  name: screen.getByRole('textbox', {name: /what is it\?/i}),
  description: screen.getByRole('textbox', {name: /description/i}),
  link: screen.getByRole('textbox', {name: /link/i}),
});

describe('AddItemDialog (skeleton logic)', () => {
  it('Add mode: disabled when name empty; submits trimmed values; resets fields; calls onClose', async () => {
    const onClose = vi.fn();
    const onSubmit = vi.fn();

    render(<AddItemDialog open onClose={onClose} onSubmit={onSubmit}/>);

    expect(screen.getByText(/add your desired gift/i)).toBeInTheDocument();

    const confirmBtn = screen.getByRole('button', {name: /^add$/i});
    expect(confirmBtn).toBeDisabled();

    const {name, description, link} = getInputs();

    await userEvent.type(name, '  Phone  ');
    await userEvent.type(description, '  cool one  ');
    await userEvent.type(link, '   ');

    expect(confirmBtn).toBeEnabled();

    await userEvent.click(confirmBtn);

    await vi.waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        name: 'Phone',
        description: 'cool one',
        link: undefined,
      })
    );

    expect((name as HTMLInputElement).value).toBe('');
    expect((description as HTMLInputElement).value).toBe('');
    expect((link as HTMLInputElement).value).toBe('');

    expect(onClose).toHaveBeenCalled();
  });

  it('Edit mode: prefills fields, saves trimmed values, does NOT reset, calls onClose', async () => {
    const onClose = vi.fn();
    const onSubmit = vi.fn();

    render(
      <AddItemDialog
        open
        onClose={onClose}
        onSubmit={onSubmit}
        initialValues={{name: '  Old name  ', description: '  desc  ', link: 'https://x'}}
      />
    );

    expect(screen.getByText(/edit gift/i)).toBeInTheDocument();

    const confirmBtn = screen.getByRole('button', {name: /^save$/i});
    expect(confirmBtn).toBeEnabled();

    const {name, description, link} = getInputs();

    expect((name as HTMLInputElement).value).toBe('  Old name  ');
    expect((description as HTMLInputElement).value).toBe('  desc  ');
    expect((link as HTMLInputElement).value).toBe('https://x');

    await userEvent.clear(name);
    await userEvent.type(name, '  New   ');
    await userEvent.clear(description);
    await userEvent.type(description, '  d  ');
    await userEvent.clear(link);
    await userEvent.type(link, '  https://y  ');

    await userEvent.click(confirmBtn);

    await vi.waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        name: 'New',
        description: 'd',
        link: 'https://y',
      })
    );

    expect((name as HTMLInputElement).value).toBe('  New   ');
    expect(onClose).toHaveBeenCalled();
  });

  it('Enter in name triggers submit (Add mode)', async () => {
    const onClose = vi.fn();
    const onSubmit = vi.fn();

    render(<AddItemDialog open onClose={onClose} onSubmit={onSubmit}/>);

    const {name} = getInputs();
    await userEvent.type(name, '   Gift   ');
    await userEvent.type(name, '{enter}');

    await vi.waitFor(() => expect(onSubmit).toHaveBeenCalledWith({name: 'Gift'}));
    expect(onClose).toHaveBeenCalled();
  });

  it('Cancel: in Add mode resets, in Edit mode does not reset', async () => {
    const onCloseAdd = vi.fn();
    const onSubmitAdd = vi.fn();

    const {rerender} = render(<AddItemDialog open onClose={onCloseAdd} onSubmit={onSubmitAdd}/>);

    const addInputs = getInputs();
    await userEvent.type(addInputs.name, 'Something');
    await userEvent.click(screen.getByRole('button', {name: /cancel/i}));

    expect(onCloseAdd).toHaveBeenCalled();
    expect((addInputs.name as HTMLInputElement).value).toBe('');

    const onCloseEdit = vi.fn();
    const onSubmitEdit = vi.fn();

    rerender(
      <AddItemDialog
        open
        onClose={onCloseEdit}
        onSubmit={onSubmitEdit}
        initialValues={{name: 'Prefilled'}}
      />
    );

    const editInputs = getInputs();
    await userEvent.click(screen.getByRole('button', {name: /cancel/i}));

    expect(onCloseEdit).toHaveBeenCalled();
    expect((editInputs.name as HTMLInputElement).value).toBe('Prefilled');
  });

  it('syncs with initialValues when props change while open', async () => {
    const onClose = vi.fn();
    const onSubmit = vi.fn();

    const {rerender} = render(
      <AddItemDialog
        open
        onClose={onClose}
        onSubmit={onSubmit}
        initialValues={{name: 'Old', description: 'A', link: 'https://a'}}
      />
    );

    const inputs1 = getInputs();
    expect((inputs1.name as HTMLInputElement).value).toBe('Old');

    rerender(
      <AddItemDialog
        open
        onClose={onClose}
        onSubmit={onSubmit}
        initialValues={{name: 'New', description: 'B', link: 'https://b'}}
      />
    );

    const inputs2 = getInputs();
    expect((inputs2.name as HTMLInputElement).value).toBe('New');
    expect((inputs2.description as HTMLInputElement).value).toBe('B');
    expect((inputs2.link as HTMLInputElement).value).toBe('https://b');
  });

  it('Confirm button stays disabled when name is whitespace only', async () => {
    const onClose = vi.fn();
    const onSubmit = vi.fn();

    render(<AddItemDialog open onClose={onClose} onSubmit={onSubmit}/>);

    const {name} = getInputs();
    const confirmBtn = screen.getByRole('button', {name: /^add$/i});

    await userEvent.type(name, '   ');
    expect(confirmBtn).toBeDisabled();
  });
});

describe('AddItemDialog (URL validation)', () => {
  it('Shows error and disables submit for invalid URL', async () => {
    const onClose = vi.fn();
    const onSubmit = vi.fn();

    render(<AddItemDialog open onClose={onClose} onSubmit={onSubmit}/>);

    const {name, link} = getInputs();
    const confirmBtn = screen.getByRole('button', {name: /^add$/i});

    await userEvent.type(name, 'Gift');
    await userEvent.type(link, 'htp:/bad url');

    expect(
      await screen.findByText('Enter a valid URL (e.g. https://example.com/item)')
    ).toBeInTheDocument();
    expect(confirmBtn).toBeDisabled();

    await userEvent.type(name, '{enter}');
    expect(onSubmit).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });

  it('Accepts domain without protocol and normalizes to https on submit (Add mode)', async () => {
    const onClose = vi.fn();
    const onSubmit = vi.fn();

    render(<AddItemDialog open onClose={onClose} onSubmit={onSubmit}/>);

    const {name, link} = getInputs();
    const confirmBtn = screen.getByRole('button', {name: /^add$/i});

    await userEvent.type(name, 'Phone');
    await userEvent.type(link, 'example.com/item');

    expect(confirmBtn).toBeEnabled();
    await userEvent.click(confirmBtn);

    await vi.waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        name: 'Phone',
        link: 'https://example.com/item',
      })
    );
    expect(onClose).toHaveBeenCalled();
  });

  it('Allows empty link in Add mode (no error, submit enabled)', async () => {
    const onClose = vi.fn();
    const onSubmit = vi.fn();

    render(<AddItemDialog open onClose={onClose} onSubmit={onSubmit}/>);

    const {name, link} = getInputs();
    const confirmBtn = screen.getByRole('button', {name: /^add$/i});

    await userEvent.type(name, 'Book');
    await userEvent.type(link, '   ');

    expect(confirmBtn).toBeEnabled();
    await userEvent.click(confirmBtn);

    await vi.waitFor(() => expect(onSubmit).toHaveBeenCalledWith({name: 'Book', link: undefined}));
  });

  it('Edit mode: can clear link and save empty string', async () => {
    const onClose = vi.fn();
    const onSubmit = vi.fn();

    render(
      <AddItemDialog
        open
        onClose={onClose}
        onSubmit={onSubmit}
        initialValues={{name: 'Item', description: 'D', link: 'https://old'}}
      />
    );

    const confirmBtn = screen.getByRole('button', {name: /^save$/i});
    const {link} = getInputs();

    await userEvent.clear(link);
    expect(confirmBtn).toBeEnabled();

    await userEvent.click(confirmBtn);

    await vi.waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        name: 'Item',
        description: 'D',
        link: '',
      })
    );
  });

  it('Accepts http and https schemes', async () => {
    const onClose = vi.fn();
    const onSubmit = vi.fn();

    render(<AddItemDialog open onClose={onClose} onSubmit={onSubmit}/>);

    const {name, link} = getInputs();
    const confirmBtn = screen.getByRole('button', {name: /^add$/i});

    await userEvent.type(name, 'Cam');
    await userEvent.type(link, 'http://shop.test/item?id=1');

    expect(confirmBtn).toBeEnabled();
    await userEvent.click(confirmBtn);

    await vi.waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        name: 'Cam',
        link: 'http://shop.test/item?id=1',
      })
    );
  });

  it('Clears error when user fixes invalid URL', async () => {
    const onClose = vi.fn();
    const onSubmit = vi.fn();

    render(<AddItemDialog open onClose={onClose} onSubmit={onSubmit}/>);

    const {name, link} = getInputs();
    const confirmBtn = screen.getByRole('button', {name: /^add$/i});

    await userEvent.type(name, 'Gift');
    await userEvent.type(link, 'bad');

    expect(
      await screen.findByText('Enter a valid URL (e.g. https://example.com/item)')
    ).toBeInTheDocument();
    expect(confirmBtn).toBeDisabled();

    await userEvent.clear(link);
    await userEvent.type(link, 'store.com/gift');

    expect(
      screen.queryByText('Enter a valid URL (e.g. https://example.com/item)')
    ).not.toBeInTheDocument();
    expect(confirmBtn).toBeEnabled();

    await userEvent.click(confirmBtn);

    await vi.waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        name: 'Gift',
        link: 'https://store.com/gift',
      })
    );
  });
});

describe('AddItemDialog save lifecycle and optional price', () => {
  it('waits for save, disables editing and dismissal, and prevents repeated submissions', async () => {
    let resolve!: () => void;
    const onSubmit = vi.fn(() => new Promise<void>((done) => { resolve = done; }));
    const onClose = vi.fn();
    render(<AddItemDialog open onClose={onClose} onSubmit={onSubmit}/>);
    const {name, description, link} = getInputs();
    await userEvent.type(name, 'Camera');
    const add = screen.getByRole('button', {name: /^add$/i});
    fireEvent.click(add);
    fireEvent.keyDown(name, {key: 'Enter'});
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onClose).not.toHaveBeenCalled();
    expect(name).toBeDisabled();
    expect(description).toBeDisabled();
    expect(link).toBeDisabled();
    expect(screen.getByRole('button', {name: /cancel/i})).toBeDisabled();
    await userEvent.keyboard('{Escape}');
    expect(onClose).not.toHaveBeenCalled();
    await act(async () => resolve());
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(name).toHaveValue('');
  });

  it('retains entered values after failure and allows a successful retry', async () => {
    const onSubmit = vi.fn().mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce(undefined);
    const onClose = vi.fn();
    render(<AddItemDialog open onClose={onClose} onSubmit={onSubmit}/>);
    const {name, link} = getInputs();
    await userEvent.type(name, 'Camera');
    await userEvent.type(link, 'shop.test/camera');
    const price = screen.getByRole('textbox', {name: /price/i});
    await userEvent.type(price, '12,50');
    await userEvent.click(screen.getByRole('button', {name: /^add$/i}));
    expect(await screen.findByRole('alert')).toHaveTextContent(/try again/i);
    expect(name).toHaveValue('Camera');
    expect(link).toHaveValue('shop.test/camera');
    expect(price).toHaveValue('12,50');
    expect(onClose).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole('button', {name: /^add$/i}));
    expect(onSubmit).toHaveBeenLastCalledWith({name: 'Camera', link: 'https://shop.test/camera', priceMinor: 1250, currency: 'UAH'});
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it.each(['0', '12.50', '12,50'])('saves valid price %s as integer minor units', async (value) => {
    const onSubmit = vi.fn();
    render(<AddItemDialog open onClose={vi.fn()} onSubmit={onSubmit}/>);
    await userEvent.type(getInputs().name, 'Gift');
    await userEvent.type(screen.getByRole('textbox', {name: /price/i}), value);
    await userEvent.click(screen.getByRole('button', {name: /^add$/i}));
    expect(onSubmit).toHaveBeenCalledWith({name: 'Gift', priceMinor: value === '0' ? 0 : 1250, currency: 'UAH'});
  });

  it.each(['-1', 'abc', '1.234', '1000001'])('rejects invalid price %s even with Enter', async (value) => {
    const onSubmit = vi.fn();
    render(<AddItemDialog open onClose={vi.fn()} onSubmit={onSubmit}/>);
    await userEvent.type(getInputs().name, 'Gift');
    await userEvent.type(screen.getByRole('textbox', {name: /price/i}), value);
    expect(screen.getByRole('button', {name: /^add$/i})).toBeDisabled();
    fireEvent.keyDown(getInputs().name, {key: 'Enter'});
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('prefills price and currency and explicitly clears previously priced items', async () => {
    const onSubmit = vi.fn();
    render(<AddItemDialog open onClose={vi.fn()} onSubmit={onSubmit} initialValues={{name: 'Gift', priceMinor: 1234, currency: 'EUR'}}/>);
    const price = screen.getByRole('textbox', {name: /price/i});
    expect(price).toHaveValue('12.34');
    expect(screen.getByRole('combobox', {name: /currency/i})).toHaveTextContent('EUR');
    await userEvent.clear(price);
    await userEvent.click(screen.getByRole('button', {name: /^save$/i}));
    expect(onSubmit).toHaveBeenCalledWith({name: 'Gift', description: '', link: '', priceMinor: null, currency: null});
  });

  it('does not close a new dialog after an obsolete save finishes', async () => {
    let resolve!: () => void;
    const onSubmit = vi.fn(() => new Promise<void>((done) => { resolve = done; }));
    const onClose = vi.fn();
    const {rerender} = render(<AddItemDialog open onClose={onClose} onSubmit={onSubmit}/>);
    await userEvent.type(getInputs().name, 'Old gift');
    await userEvent.click(screen.getByRole('button', {name: /^add$/i}));
    rerender(<AddItemDialog open={false} onClose={onClose} onSubmit={onSubmit}/>);
    rerender(<AddItemDialog open onClose={onClose} onSubmit={onSubmit} initialValues={{name: 'New gift'}}/>);
    await act(async () => resolve());
    expect(onClose).not.toHaveBeenCalled();
    expect(getInputs().name).toHaveValue('New gift');
  });
});


describe('AddItemDialog price compatibility', () => {
  it('lets the user choose an explicit currency', async () => {
    const onSubmit = vi.fn();
    render(<AddItemDialog open onClose={vi.fn()} onSubmit={onSubmit}/>);
    await userEvent.type(getInputs().name, 'Gift');
    await userEvent.type(screen.getByRole('textbox', {name: /price/i}), '5');
    await userEvent.click(screen.getByRole('combobox', {name: /currency/i}));
    await userEvent.click(screen.getByRole('option', {name: 'GBP'}));
    await userEvent.click(screen.getByRole('button', {name: /^add$/i}));
    expect(onSubmit).toHaveBeenCalledWith({name: 'Gift', priceMinor: 500, currency: 'GBP'});
  });

  it('preserves the selected currency when editing an existing price', async () => {
    const onSubmit = vi.fn();
    render(<AddItemDialog open onClose={vi.fn()} onSubmit={onSubmit} initialValues={{name: 'Gift', priceMinor: 1234, currency: 'USD'}}/>);
    const price = screen.getByRole('textbox', {name: /price/i});
    await userEvent.clear(price);
    await userEvent.type(price, '15.99');
    await userEvent.click(screen.getByRole('button', {name: /^save$/i}));
    expect(onSubmit).toHaveBeenCalledWith({name: 'Gift', description: '', link: '', priceMinor: 1599, currency: 'USD'});
  });

  it('keeps legacy unpriced edits free of money fields', async () => {
    const onSubmit = vi.fn();
    render(<AddItemDialog open onClose={vi.fn()} onSubmit={onSubmit} initialValues={{name: 'Gift'}}/>);
    expect(screen.getByRole('textbox', {name: /price/i})).toHaveValue('');
    await userEvent.click(screen.getByRole('button', {name: /^save$/i}));
    expect(onSubmit).toHaveBeenCalledWith({name: 'Gift', description: '', link: ''});
  });

  it('does not call the close callback after unmounting during save', async () => {
    let resolve!: () => void;
    const onSubmit = vi.fn(() => new Promise<void>((done) => { resolve = done; }));
    const onClose = vi.fn();
    const {unmount} = render(<AddItemDialog open onClose={onClose} onSubmit={onSubmit}/>);
    await userEvent.type(getInputs().name, 'Gift');
    await userEvent.click(screen.getByRole('button', {name: /^add$/i}));
    unmount();
    await act(async () => resolve());
    expect(onClose).not.toHaveBeenCalled();
  });
});


it('ignores save completion after a route change', async () => {
  let resolve!: () => void;
  const onSubmit = vi.fn(() => new Promise<void>((done) => { resolve = done; }));
  const onClose = vi.fn();
  render(<AddItemDialog open onClose={onClose} onSubmit={onSubmit}/>);
  await userEvent.type(getInputs().name, 'Gift');
  await userEvent.click(screen.getByRole('button', {name: /^add$/i}));
  await act(async () => {
    window.history.pushState({}, '', '/en/another-list');
    window.dispatchEvent(new PopStateEvent('popstate'));
  });
  await act(async () => resolve());
  expect(onClose).not.toHaveBeenCalled();
  window.history.replaceState({}, '', '/');
});
