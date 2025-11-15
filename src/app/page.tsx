
'use client';

import Link from 'next/link';
import {
  PlusCircle,
  Building2,
  Laptop,
  ShoppingCart,
  Car,
  List,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SidebarTrigger } from '@/components/ui/sidebar';

export default function Home() {
  const categories = [
    {
      name: 'Facility',
      icon: <Building2 className="h-8 w-8 text-primary" />,
      description: 'View all facility and equipment issues.',
      href: '/issues?category=Facility',
    },
    {
      name: 'IT',
      icon: <Laptop className="h-8 w-8 text-primary" />,
      description: 'View all IT support and tech problems.',
      href: '/issues?category=IT',
    },
    {
      name: 'Purchase',
      icon: <ShoppingCart className="h-8 w-8 text-primary" />,
      description: 'View all purchase requests.',
      href: '/issues?category=Purchase',
    },
    {
      name: 'Vehicle',
      icon: <Car className="h-8 w-8 text-primary" />,
      description: 'View all issues with company vehicles.',
      href: '/issues?category=Vehicle',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 flex items-center h-16 px-4 border-b bg-background/80 backdrop-blur-sm md:px-6">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <h1 className="text-2xl font-semibold">Dashboard</h1>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button asChild variant="outline">
            <Link href="/purchase-requisition">
              <ShoppingCart className="mr-2 h-4 w-4" /> Purchase Request
            </Link>
          </Button>
          <Button asChild>
            <Link href="/report">
              <PlusCircle className="mr-2 h-4 w-4" /> New Issue
            </Link>
          </Button>
        </div>
      </header>
      <main className="flex-1 p-4 md:p-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {categories.map((category) => (
            <Link href={category.href} key={category.name}>
              <Card className="hover:bg-accent/20 transition-colors h-full flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-medium">
                    {category.name}
                  </CardTitle>
                  {category.icon}
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {category.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Issues</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center text-center gap-4 p-8">
              <h3 className="text-lg font-semibold">View All Your Issues</h3>
              <p className="text-muted-foreground max-w-md">
                Click the button below to see a detailed list of all reported issues, where you can filter them by status and category.
              </p>
              <Button asChild>
                <Link href="/issues">
                  <List className="mr-2 h-4 w-4" /> View All Issues
                </Link>
              </Button>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
