import {useEffect, useState} from 'react';
import {onAuthStateChanged, type User} from 'firebase/auth';

import {auth} from '@lib/firebase';

const ADMIN_UID = import.meta.env.VITE_ADMIN_UID;

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAdmin(currentUser?.uid === ADMIN_UID);
    });
    return unsub;
  }, []);

  return {user, isAdmin};
};