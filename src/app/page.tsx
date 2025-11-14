'use client';

import Link from 'next/link';
import {
  PlusCircle,
  Building2,
  Laptop,
  ShoppingCart,
  Car,
  CircleHelp,
  CircleCheck,
  RefreshCw,
  CheckCircle,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

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
      acc[issue.status] = (acc[issue.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const statusCards = [
    {
      title: 'Total Received',
      count: statusCounts.Pending || 0,
      icon: <CircleHelp className="h-8 w-8 text-primary" />,
    },
    {
      title: 'Total Accepted',
      count: statusCounts.Accepted || 0,
      icon: <CircleCheck className="h-8 w-8 text-primary" />,
    },
    {
      title: 'Total Ongoing',
      count: statusCounts.Ongoing || 0,
      icon: <RefreshCw className="h-8 w-8 text-primary" />,
    },
    {
      title: 'Total Finished',
      count: statusCounts.Finished || 0,
      icon: <CheckCircle className="h-8 w-8 text-primary" />,
    },
  ];

  // Data for Category Bar Chart
  const categoryCounts = issues.reduce(
    (acc, issue) => {
      acc[issue.category] = (acc[issue.category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
  const categoryChartData = Object.keys(categoryCounts).map((category) => ({
    name: category,
    issues: categoryCounts[category],
  }));

  // Data for Category Bar Chart (Fixed Issues)
  const fixedIssues = issues.filter((issue) => issue.status === 'Finished');
  const categoryFixedCounts = fixedIssues.reduce(
    (acc, issue) => {
      acc[issue.category] = (acc[issue.category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
  const fixedByCategoryChartData = Object.keys(categoryFixedCounts).map(
    (category) => ({
      name: category,
      issues: categoryFixedCounts[category],
    })
  );

  const barChartConfig = {
    issues: {
      label: 'Issues',
      color: 'hsl(var(--chart-1))',
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

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {statusCards.map((card) => (
            <Card key={card.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium">{card.title}</CardTitle>
                {card.icon}
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{card.count}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Issues by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={barChartConfig} className="h-[250px] w-full">
                <BarChart accessibilityLayer data={categoryChartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                  />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  <Bar dataKey="issues" fill="var(--color-issues)" radius={4} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Fixed Issues by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={barChartConfig} className="h-[250px] w-full">
                <BarChart accessibilityLayer data={fixedByCategoryChartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                  />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  <Bar dataKey="issues" fill="var(--color-issues)" radius={4} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
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
