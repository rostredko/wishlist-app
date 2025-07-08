import { useEffect, useState } from "react";
import { auth } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";

const ADMIN_UID = import.meta.env.VITE_ADMIN_UID;

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAdmin(currentUser?.uid === ADMIN_UID);
    });

    return () => unsub();
  }, []);

  return { user, isAdmin };
};