
'use client';

import {
  type User,
} from 'firebase/auth';
import {
  createContext,
  useContext,
  type ReactNode,
} from 'react';
import type { Role } from '@/lib/types';
import { useFirebaseAuth, useUserProfile } from './provider';


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
export const useAuth = () => {
    const { user, loading: authLoading } = useFirebaseAuth();
    const { userProfile, loading: profileLoading } = useUserProfile(user);

    return {
        user,
        userProfile,
        loading: authLoading || profileLoading
    };
};

// Custom hook to access just the user profile
export const useUser = () => {
    const { user, loading: authLoading } = useFirebaseAuth();
    const { userProfile, loading: profileLoading } = useUserProfile(user);
    return userProfile;
};


// This is a wrapper to maintain compatibility with the old FirebaseClientProvider
export function FirebaseClientProvider({ children }: { children: ReactNode }) {
    const { user, loading: authLoading } = useFirebaseAuth();
    const { userProfile, loading: profileLoading } = useUserProfile(user);

  return (
    <AuthContext.Provider value={{ user, userProfile, loading: authLoading || profileLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
