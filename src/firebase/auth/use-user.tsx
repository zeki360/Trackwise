'use client';
import { useUser as useFirebaseUser } from '@/firebase/provider';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Hook for managing user authentication state.
 *
 * This hook extends the basic user state from Firebase with route protection.
 * It ensures that unauthenticated users are redirected to the login page
 * for protected routes.
 *
 * @returns An object containing the user, loading state, and any authentication error.
 */
export const useUser = () => {
  const { user, isUserLoading, userError } = useFirebaseUser();
  const router = useRouter();
  const pathname = usePathname();

  // List of public routes that don't require authentication.
  const publicRoutes = ['/login', '/signup'];

  useEffect(() => {
    // If auth state is still loading, do nothing.
    if (isUserLoading) {
      return;
    }
    // If there is no user and the current route is not public, redirect to login.
    if (!user && !publicRoutes.includes(pathname)) {
      router.push('/login');
    }
    // If the user is logged in and tries to access a public route, redirect to home.
    if (user && publicRoutes.includes(pathname)) {
      router.push('/');
    }
  }, [user, isUserLoading, router, pathname]);

  return { user, isUserLoading, userError };
};
