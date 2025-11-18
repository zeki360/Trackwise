
'use client';

import {
  type User,
  onAuthStateChanged,
  getAuth,
} from 'firebase/auth';
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { auth, firestore } from './client';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import type { Role } from '@/lib/types';


// Define the shape of the user profile data
export interface UserProfile {
  uid: string;
  email: string;
  role: Role;
  displayName?: string;
}

// Define the shape of the authentication context
interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
}

// Create the authentication context
const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
});

// Custom hook to access the authentication context
export const useAuth = () => useContext(AuthContext);

// Custom hook to access just the user profile
export const useUser = () => {
  const { userProfile } = useContext(AuthContext);
  return userProfile;
};


// Provider component to wrap the application and provide auth state
export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        // If user is logged in, fetch their profile
        const userDocRef = doc(firestore, 'users', user.uid);
        const unsubscribeSnapshot = onSnapshot(userDocRef, (doc) => {
          if (doc.exists()) {
            setUserProfile(doc.data() as UserProfile);
          } else {
            // Handle case where user is authenticated but has no profile
            setUserProfile(null);
          }
          setLoading(false);
        });
        return () => unsubscribeSnapshot();
      } else {
        // If user is logged out, clear profile and finish loading
        setUserProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, userProfile, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
