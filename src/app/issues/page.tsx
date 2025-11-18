
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
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
import { SidebarTrigger } from '@/components/ui/sidebar';
import type { Issue, Category } from '@/lib/types';
import { useAuth } from '@/firebase';

export default function IssuesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') as Category | null;

  // This will be replaced with real-time data from Firestore
  const [allIssues, setAllIssues] = useState<Issue[] | null>(null);
  const [filteredIssues, setFilteredIssues] = useState<Issue[]>([]);
  const [activeTab, setActiveTab] = useState('All');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);


  useEffect(() => {
    // In a real app, you'd fetch this data from Firestore based on the user
    // For now, we'll use static data for demonstration
    const staticIssues: Issue[] = []; // Intentionally empty for now, will be fetched
    
    let issuesToLoad = allIssues;
    if (initialCategory && allIssues) {
      issuesToLoad = allIssues.filter(
        (issue) => issue.category === initialCategory
      );
    }
    setFilteredIssues(issuesToLoad || []);
    setActiveTab('All');
  }, [initialCategory, allIssues]);

  const handleTabChange = (status: string) => {
    setActiveTab(status);
    if (!allIssues) return;

    if (status === 'All') {
      setFilteredIssues(allIssues);
    } else {
      setFilteredIssues(
        allIssues.filter((issue) => issue.status === status)
      );
    }
  };

  if (loading || !user) {
    return <div>Loading...</div>;
  }

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
