
'use client'

import { PurchaseRequisitionForm } from '@/components/purchase-requisition-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useAuth } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function PurchaseRequisitionPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
       <header className="sticky top-0 z-10 flex items-center h-16 px-4 border-b bg-background/80 backdrop-blur-sm md:px-6">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <h1 className="text-2xl font-semibold">Purchase Requisition</h1>
        </div>
      </header>
      <main className="flex-1 p-4 md:p-8 flex justify-center items-start">
        <Card className="w-full max-w-4xl">
          <CardHeader>
            <CardTitle>Create a Purchase Requisition</CardTitle>
            <CardDescription>
              Please fill out the form below to request a new purchase.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PurchaseRequisitionForm />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
