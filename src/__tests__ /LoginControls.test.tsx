import {describe, it, expect, vi, beforeEach} from 'vitest';
import {customRender as render, screen} from '../test/render';
import userEventLib from '@testing-library/user-event';
import '../../src/i18n';

const hoisted = vi.hoisted(() => ({
  authState: {user: null as null | { displayName?: string }, isAdmin: false},
}));

vi.mock('@hooks/useAuth', () => ({
  useAuth: () => hoisted.authState,
}));

vi.mock('@lib/firebase', () => ({
  auth: {__tag: 'auth'},
  googleProvider: {__tag: 'google'},
}));

const signInWithPopup = vi.fn();
const signInWithRedirect = vi.fn();
const getRedirectResult = vi.fn();
const signOut = vi.fn();

vi.mock('firebase/auth', () => ({
  signInWithPopup: (...args: any[]) => signInWithPopup(...args),
  signInWithRedirect: (...args: any[]) => signInWithRedirect(...args),
  getRedirectResult: (...args: any[]) => getRedirectResult(...args),
  signOut: (...args: any[]) => signOut(...args),
}));

vi.mock('@utils/auth', () => ({
  shouldUseRedirect: vi.fn(() => false), // Default to popup for tests
  canUseRedirectFlow: vi.fn(() => true),
}));

import LoginControls from '@components/LoginControls';

describe('LoginControls (skeleton behavior)', () => {
  beforeEach(() => {
    hoisted.authState.user = null;
    hoisted.authState.isAdmin = false;

    signInWithPopup.mockReset();
    signInWithRedirect.mockReset();
    getRedirectResult.mockReset();
    signOut.mockReset();
    
    getRedirectResult.mockResolvedValue(null); // No pending redirect by default

    vi.spyOn(window, 'alert').mockImplementation(() => {
    });
  });

  it('shows Sign In for guests; clicking triggers signInWithPopup with loader', async () => {
    const user = userEventLib.setup({pointerEventsCheck: 0});

    let resolve!: () => void;
    signInWithPopup.mockImplementationOnce(
      () => new Promise<void>((r) => (resolve = r))
    );

    const {rerender} = render(<LoginControls/>);
    expect(screen.getByRole('button', {name: /sign in/i})).toBeEnabled();

    await user.click(screen.getByRole('button', {name: /sign in/i}));

    const waitBtn = await screen.findByRole('button', {name: /please wait/i});
    expect(waitBtn).toBeDisabled();
    expect(signInWithPopup).toHaveBeenCalledTimes(1);

    await user.click(waitBtn);
    expect(signInWithPopup).toHaveBeenCalledTimes(1);

    resolve();
    hoisted.authState.user = {displayName: 'Alice'};
    rerender(<LoginControls/>);

    expect(await screen.findByRole('button', {name: /sign out/i})).toBeInTheDocument();
  });

  it('sign-in error: alerts and exits loading', async () => {
    const user = userEventLib.setup();

    signInWithPopup.mockRejectedValueOnce(new Error('boom'));
    render(<LoginControls/>);

    await user.click(screen.getByRole('button', {name: /sign in/i}));

    expect(await screen.findByRole('button', {name: /sign in/i})).toBeEnabled();
    expect(window.alert).toHaveBeenCalled();
  });

  it('shows user name and admin badge when isAdmin=true; has Sign Out', async () => {
    hoisted.authState.user = {displayName: 'Bob'};
    hoisted.authState.isAdmin = true;

    render(<LoginControls/>);

    const greeting = screen.getByText(/bob/i, {selector: 'p'});
    expect(greeting).toBeInTheDocument();
    expect(greeting).toHaveTextContent(/\(admin\)/i);

    expect(screen.getByRole('button', {name: /sign out/i})).toBeInTheDocument();
  });

  it('clicking Sign Out triggers signOut(auth) with loader and guards double click', async () => {
    const user = userEventLib.setup({pointerEventsCheck: 0});

    hoisted.authState.user = {displayName: 'Bob'};

    let resolve!: () => void;
    signOut.mockImplementationOnce(() => new Promise<void>((r) => (resolve = r)));

    render(<LoginControls/>);

    await user.click(screen.getByRole('button', {name: /sign out/i}));

    const waitBtn = await screen.findByRole('button', {name: /please wait/i});
    expect(waitBtn).toBeDisabled();
    expect(signOut).toHaveBeenCalledTimes(1);

    await user.click(waitBtn);
    expect(signOut).toHaveBeenCalledTimes(1);

    resolve();
  });

  it('sign-out error: alerts and exits loading', async () => {
    const user = userEventLib.setup();

    hoisted.authState.user = {displayName: 'Bob'};
    signOut.mockRejectedValueOnce(new Error('nope'));

    render(<LoginControls/>);

    await user.click(screen.getByRole('button', {name: /sign out/i}));

    expect(await screen.findByRole('button', {name: /sign out/i})).toBeEnabled();
    expect(window.alert).toHaveBeenCalled();
  });
});