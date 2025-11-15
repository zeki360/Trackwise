
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
import { Home, PlusCircle, UserCircle, List, BarChart2, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function AppSidebar() {
  const pathname = usePathname();

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
            <SidebarMenuButton asChild isActive={pathname === '/analytics'} tooltip="Analytics">
              <Link href="/analytics">
                <BarChart2 />
                <span>Analytics</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
           <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === '/purchase-requisition'} tooltip="Purchase Request">
              <Link href="/purchase-requisition">
                <ShoppingCart />
                <span>Purchase Request</span>
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
      </SidebarContent>
      <SidebarFooter className="p-4 mt-auto">
        <div className="flex items-center gap-3">
          <UserCircle className="h-10 w-10 text-primary" />
          <div className="flex flex-col">
            <span className="font-semibold text-primary-foreground">
              Admin User
            </span>
            <span className="text-xs text-muted-foreground">Online</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
