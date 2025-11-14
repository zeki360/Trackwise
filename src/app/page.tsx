import Link from 'next/link';
import { PlusCircle, Building2, Laptop, ShoppingCart, Car } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IssuesTable } from '@/components/issues-table';
import { issues } from '@/lib/data';
import { SidebarTrigger } from '@/components/ui/sidebar';

export default function Home() {
  const categories = [
    {
      name: 'Facility',
      icon: <Building2 className="h-8 w-8 text-primary" />,
      description: 'Report building and equipment issues.',
      href: '/report?category=Facility',
    },
    {
      name: 'IT',
      icon: <Laptop className="h-8 w-8 text-primary" />,
      description: 'Request IT support or report tech problems.',
      href: '/report?category=IT',
    },
    {
      name: 'Purchase',
      icon: <ShoppingCart className="h-8 w-8 text-primary" />,
      description: 'Submit a new purchase request.',
      href: '/report?category=Purchase',
    },
    {
      name: 'Vehicle',
      icon: <Car className="h-8 w-8 text-primary" />,
      description: 'Report issues with company vehicles.',
      href: '/report?category=Vehicle',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 flex items-center h-16 px-4 border-b bg-background/80 backdrop-blur-sm md:px-6">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <h1 className="text-2xl font-semibold">Dashboard</h1>
        </div>
        <div className="ml-auto">
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
                  <CardTitle className="text-lg font-medium">{category.name}</CardTitle>
                  {category.icon}
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <IssuesTable issues={issues} />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
