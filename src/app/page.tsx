import Link from 'next/link';
import { PlusCircle, Building2, Laptop, ShoppingCart, Car } from 'lucide-react';
import { PieChart, Pie, Cell } from 'recharts';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
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

  const statusCounts = issues.reduce(
    (acc, issue) => {
      if (issue.status === 'Pending') acc.pending += 1;
      if (issue.status === 'Accepted') acc.accepted += 1;
      if (issue.status === 'Finished') acc.finished += 1;
      return acc;
    },
    { pending: 0, accepted: 0, finished: 0 }
  );

  const chartData = [
    { name: 'Pending', value: statusCounts.pending, fill: 'hsl(var(--chart-1))' },
    { name: 'Accepted', value: statusCounts.accepted, fill: 'hsl(var(--chart-2))' },
    { name: 'Finished', value: statusCounts.finished, fill: 'hsl(var(--chart-3))' },
  ];

  const chartConfig = {
    value: {
      label: 'Issues',
    },
    Pending: {
      label: 'Pending',
      color: 'hsl(var(--chart-1))',
    },
    Accepted: {
      label: 'Accepted',
      color: 'hsl(var(--chart-2))',
    },
    Finished: {
      label: 'Finished',
      color: 'hsl(var(--chart-3))',
    },
  };

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
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Issue Status Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square max-h-[250px]"
              >
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={50}
                    strokeWidth={5}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
          <div className="lg:col-span-3 hidden lg:block">
            {/* Placeholder for future content */}
          </div>
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
