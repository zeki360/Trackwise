
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
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, Query, DocumentData } from 'firebase/firestore';
import type { Issue, Category } from '@/lib/types';
import { Loader2 } from 'lucide-react';

function IssuesPageContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') as Category | null;
  
  const { user } = useUser();
  const firestore = useFirestore();

  const issuesQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;

    const baseCollection = collection(firestore, 'users', user.uid, 'issues');

    if (initialCategory) {
      return query(baseCollection, where('category', '==', initialCategory));
    }
    return baseCollection;
  }, [user, firestore, initialCategory]);

  const { data: allIssues, isLoading } = useCollection<Issue>(issuesQuery);
  
  const [filteredIssues, setFilteredIssues] = useState<Issue[]>([]);
  const [activeTab, setActiveTab] = useState('All');

  const handleTabChange = (status: string, issuesToFilter: Issue[] | null = allIssues) => {
    setActiveTab(status);
    if (!issuesToFilter) {
      setFilteredIssues([]);
      return;
    }
    if (status === 'All') {
      setFilteredIssues(issuesToFilter);
    } else {
      setFilteredIssues(
        issuesToFilter.filter((issue) => issue.status === status)
      );
    }
  };

  useEffect(() => {
    // This effect now correctly handles changes in allIssues and activeTab.
    // It will re-filter the issues whenever the source data or the selected tab changes.
    handleTabChange(activeTab, allIssues);
  }, [allIssues, activeTab]);

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
            {isLoading ? (
               <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <Tabs value={activeTab} onValueChange={(value) => handleTabChange(value)}>
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
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

export default function IssuesPage() {
    return (
        <Suspense fallback={
          <div className="flex h-screen w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        }>
            <IssuesPageContent />
        </Suspense>
    )
}
