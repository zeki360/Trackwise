
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { IssuesTable } from '@/components/issues-table';
import { issues } from '@/lib/data';
import type { Issue, Category } from '@/lib/types';
import { SidebarTrigger } from '@/components/ui/sidebar';

function IssuesPageContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') as Category | null;
  
  const [allIssues, setAllIssues] = useState<Issue[]>([]);
  const [filteredIssues, setFilteredIssues] = useState<Issue[]>([]);
  const [activeTab, setActiveTab] = useState('All');

  useEffect(() => {
    let issuesToDisplay = issues;
    if (initialCategory) {
        issuesToDisplay = issues.filter(issue => issue.category === initialCategory);
    }
    setAllIssues(issuesToDisplay);
    setFilteredIssues(issuesToDisplay);
    setActiveTab('All'); // Reset tab to 'All' when category changes
  }, [initialCategory]);

  const handleTabChange = (status: string) => {
    setActiveTab(status);
    if (status === 'All') {
      setFilteredIssues(allIssues);
    } else {
      setFilteredIssues(
        allIssues.filter((issue) => issue.status === status)
      );
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 flex items-center h-16 px-4 border-b bg-background/80 backdrop-blur-sm md:px-6">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <h1 className="text-2xl font-semibold">Issues</h1>
        </div>
      </header>
      <main className="flex-1 p-4 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle>{initialCategory ? `${initialCategory} Issues` : 'All Issues'}</CardTitle>
            <CardDescription>
              Here is a list of all {initialCategory?.toLowerCase() || ''} issues. You can filter them by status.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <TabsList>
                <TabsTrigger value="All">All</TabsTrigger>
                <TabsTrigger value="Pending">Pending</TabsTrigger>
                <TabsTrigger value="Accepted">Accepted</TabsTrigger>
                <TabsTrigger value="Ongoing">Ongoing</TabsTrigger>
                <TabsTrigger value="Finished">Finished</TabsTrigger>
              </TabsList>
              <TabsContent value={activeTab}>
                <IssuesTable issues={filteredIssues} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}


export default function IssuesPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <IssuesPageContent />
        </Suspense>
    )
}
