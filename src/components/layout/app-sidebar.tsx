
'use client';

import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Home, PlusCircle, UserCircle, List, LogIn, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const renderAuthSection = () => {
    if (isUserLoading) {
      return (
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex flex-col gap-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      );
    }

    if (user) {
      return (
        <div className="flex items-center justify-between w-full">
            <div className='flex items-center gap-3'>
                <UserCircle className="h-10 w-10 text-primary" />
                <div className="flex flex-col">
                    <span className="font-semibold text-primary-foreground max-w-[120px] truncate">
                    {user.email}
                    </span>
                    <span className="text-xs text-muted-foreground">Online</span>
                </div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout} className="text-primary-foreground hover:bg-sidebar-accent/20 hover:text-primary-foreground">
                <LogOut className="h-5 w-5" />
            </Button>
        </div>
      );
    }

    return (
      <SidebarMenuButton asChild isActive={pathname === '/login'}>
        <Link href="/login">
          <LogIn />
          <span>Login</span>
        </Link>
      </SidebarMenuButton>
    );
  };


  if (!user && !isUserLoading && pathname !== '/login' && pathname !== '/signup') {
    if (typeof window !== 'undefined') {
      router.push('/login');
    }
    return (
      <Sidebar>
        <div className='flex-1 flex items-center justify-center'>
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Sidebar>
    );
  }

  if ((pathname === '/login' || pathname === '/signup') && !isUserLoading) {
      return null;
  }

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center gap-2">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24"
                className="h-8 w-8 text-primary"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M21.73 18a2.73 2.73 0 0 1-3.72 3.72 2.73 2.73 0 0 1-3.72-3.72V1.27a2.73 2.73 0 0 1 3.72-3.72 2.73 2.73 0 0 1 3.72 3.72Z" />
                <path d="M14.28 21.72V14a2.73 2.73 0 0 0-2.73-2.73 2.73 2.73 0 0 0-2.73 2.73v7.72" />
                <path d="M8.82 21.72V1.27a2.73 2.73 0 0 0-2.73-2.73 2.73 2.73 0 0 0-2.73 2.73v20.45" />
            </svg>
            <h1 className="text-2xl font-bold text-primary-foreground">TrackWise</h1>
        </Link>
      </SidebarHeader>
      <SidebarContent className="p-2">
        {user && (
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === '/'} tooltip="Dashboard">
                <Link href="/">
                  <Home />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname.startsWith('/issues')} tooltip="Issues">
                <Link href="/issues">
                  <List />
                  <span>Issues</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === '/report'} tooltip="Report Issue">
                <Link href="/report">
                  <PlusCircle />
                  <span>Report an Issue</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
      </SidebarContent>
      <SidebarFooter className="p-4 mt-auto">
        {renderAuthSection()}
      </SidebarFooter>
    </Sidebar>
  );
}
