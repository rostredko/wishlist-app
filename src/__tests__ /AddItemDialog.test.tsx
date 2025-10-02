import {describe, it, expect, vi} from 'vitest';
import {customRender as render, screen} from '../test/render';
import userEvent from '@testing-library/user-event';
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

    expect(onSubmit).toHaveBeenCalledWith({
      name: 'Phone',
      description: 'cool one',
      link: undefined,
    });

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

    expect(onSubmit).toHaveBeenCalledWith({
      name: 'New',
      description: 'd',
      link: 'https://y',
    });

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

    expect(onSubmit).toHaveBeenCalledWith({name: 'Gift'});
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

    expect(onSubmit).toHaveBeenCalledWith({
      name: 'Phone',
      link: 'https://example.com/item',
    });
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

    expect(onSubmit).toHaveBeenCalledWith({name: 'Book', link: undefined});
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

    await userEvent.clear(link); // очищаем
    expect(confirmBtn).toBeEnabled();

    await userEvent.click(confirmBtn);

    expect(onSubmit).toHaveBeenCalledWith({
      name: 'Item',
      description: 'D',
      link: '',
    });
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

    expect(onSubmit).toHaveBeenCalledWith({
      name: 'Cam',
      link: 'http://shop.test/item?id=1',
    });
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
    await userEvent.type(link, 'store.com/gift'); // теперь валидно (нормализуется)
    expect(
      screen.queryByText('Enter a valid URL (e.g. https://example.com/item)')
    ).not.toBeInTheDocument();
    expect(confirmBtn).toBeEnabled();

    await userEvent.click(confirmBtn);
    expect(onSubmit).toHaveBeenCalledWith({
      name: 'Gift',
      link: 'https://store.com/gift',
    });
  });
});