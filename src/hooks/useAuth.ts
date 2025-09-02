import {useEffect, useState} from 'react';
import {onAuthStateChanged, type User} from 'firebase/auth';

import {auth} from '@lib/firebase';

const ADMIN_UID = import.meta.env.VITE_ADMIN_UID;

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return unsubscribe;
  }, []);

  const isAdmin = user?.uid === ADMIN_UID;
  return {user, isAdmin};
};
