import {act, renderHook, waitFor} from '@testing-library/react';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import type {User} from 'firebase/auth';
import {useAuth} from '@hooks/useAuth';

const mocks = vi.hoisted(() => ({
  subscribe: vi.fn(),
  unsubscribe: vi.fn(),
}));

vi.mock('firebase/auth', () => ({onIdTokenChanged: mocks.subscribe, onAuthStateChanged: mocks.subscribe}));
vi.mock('@lib/auth-client', () => ({auth: {}}));

let tokenChanged: (user: User | null) => Promise<void>;
let authError: (error: Error) => void;

function authUser(claims: Record<string, unknown>, uid = 'owner'): User {
  return {uid, getIdTokenResult: vi.fn().mockResolvedValue({claims})} as unknown as User;
}

beforeEach(() => {
  vi.clearAllMocks();
  mocks.subscribe.mockImplementation((_auth, next, error) => {
    tokenChanged = next;
    authError = error;
    return mocks.unsubscribe;
  });
});

describe('useAuth', () => {
  it('stays loading until initial auth and token claims have resolved', async () => {
    let resolve!: (value: {claims: Record<string, unknown>}) => void;
    const user = {uid: 'owner', getIdTokenResult: vi.fn(() => new Promise((done) => {resolve = done;}))} as unknown as User;
    const {result} = renderHook(() => useAuth());
    expect(result.current).toEqual({user: null, isAdmin: false, loading: true});
    let pending!: Promise<void>;
    act(() => { pending = tokenChanged(user); });
    expect(result.current.loading).toBe(true);
    await act(async () => {resolve({claims: {}}); await pending;});
    expect(result.current).toEqual({user, isAdmin: false, loading: false});
  });

  it('recognizes an ordinary authenticated owner without admin rights', async () => {
    const user = authUser({});
    const {result} = renderHook(() => useAuth());
    await act(async () => tokenChanged(user));
    expect(result.current).toEqual({user, isAdmin: false, loading: false});
  });

  it('grants admin access only for the server claim exactly equal to true', async () => {
    const {result} = renderHook(() => useAuth());
    for (const claim of [false, 'true', 1, undefined]) {
      await act(async () => tokenChanged(authUser({isAdmin: claim})));
      expect(result.current.isAdmin).toBe(false);
    }
    const admin = authUser({isAdmin: true}, 'server-admin');
    await act(async () => tokenChanged(admin));
    expect(result.current).toEqual({user: admin, isAdmin: true, loading: false});
  });

  it('ignores an admin token result that resolves after logout', async () => {
    let resolve!: (value: {claims: Record<string, unknown>}) => void;
    const user = {uid: 'admin', getIdTokenResult: vi.fn(() => new Promise((done) => {resolve = done;}))} as unknown as User;
    const {result} = renderHook(() => useAuth());
    let pending!: Promise<void>;
    act(() => {pending = tokenChanged(user);});
    await act(async () => tokenChanged(null));
    expect(result.current).toEqual({user: null, isAdmin: false, loading: false});
    await act(async () => {resolve({claims: {isAdmin: true}}); await pending;});
    expect(result.current).toEqual({user: null, isAdmin: false, loading: false});
  });

  it('ignores stale admin claims when another user signs in', async () => {
    let resolve!: (value: {claims: Record<string, unknown>}) => void;
    const admin = {uid: 'admin', getIdTokenResult: vi.fn(() => new Promise((done) => {resolve = done;}))} as unknown as User;
    const owner = authUser({}, 'next-owner');
    const {result} = renderHook(() => useAuth());
    let pending!: Promise<void>;
    act(() => {pending = tokenChanged(admin);});
    await act(async () => tokenChanged(owner));
    await act(async () => {resolve({claims: {isAdmin: true}}); await pending;});
    expect(result.current).toEqual({user: owner, isAdmin: false, loading: false});
  });

  it('updates admin rights when the same user token changes', async () => {
    const user = authUser({isAdmin: true});
    const {result} = renderHook(() => useAuth());
    await act(async () => tokenChanged(user));
    expect(result.current.isAdmin).toBe(true);
    vi.mocked(user.getIdTokenResult).mockResolvedValueOnce({claims: {}} as Awaited<ReturnType<User['getIdTokenResult']>>);
    await act(async () => tokenChanged(user));
    expect(result.current).toEqual({user, isAdmin: false, loading: false});
  });

  it('retains signed-in identity without admin rights if token lookup fails', async () => {
    const user = {uid: 'owner', getIdTokenResult: vi.fn().mockRejectedValue(new Error('offline'))} as unknown as User;
    const {result} = renderHook(() => useAuth());
    await act(async () => tokenChanged(user));
    expect(result.current).toEqual({user, isAdmin: false, loading: false});
  });

  it('ends loading conservatively when the auth listener errors', async () => {
    const {result} = renderHook(() => useAuth());
    act(() => authError(new Error('auth unavailable')));
    await waitFor(() => expect(result.current).toEqual({user: null, isAdmin: false, loading: false}));
  });

  it('unsubscribes and ignores a pending lookup after unmount', async () => {
    let resolve!: (value: {claims: Record<string, unknown>}) => void;
    const user = {uid: 'admin', getIdTokenResult: vi.fn(() => new Promise((done) => {resolve = done;}))} as unknown as User;
    const {unmount} = renderHook(() => useAuth());
    let pending!: Promise<void>;
    act(() => {pending = tokenChanged(user);});
    unmount();
    expect(mocks.unsubscribe).toHaveBeenCalledTimes(1);
    await act(async () => {resolve({claims: {isAdmin: true}}); await pending;});
  });
});
