import {useEffect, useState} from 'react';
import {onIdTokenChanged, type User} from 'firebase/auth';

import {auth} from '@lib/auth-client';

type AuthState = {user: User | null; isAdmin: boolean; loading: boolean};

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({user: null, isAdmin: false, loading: true});

  useEffect(() => {
    let active = true;
    let generation = 0;
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      const currentGeneration = ++generation;
      if (!active) return;
      if (!user) {
        setState({user: null, isAdmin: false, loading: false});
        return;
      }

      setState({user, isAdmin: false, loading: true});
      let isAdmin = false;
      try {
        const token = await user.getIdTokenResult();
        isAdmin = token.claims.isAdmin === true;
      } catch {
        // A token lookup failure must not discard a valid signed-in identity.
      }
      if (active && currentGeneration === generation) {
        setState({user, isAdmin, loading: false});
      }
    }, () => {
      generation += 1;
      if (active) setState({user: null, isAdmin: false, loading: false});
    });

    return () => {
      active = false;
      generation += 1;
      unsubscribe();
    };
  }, []);

  return state;
};
