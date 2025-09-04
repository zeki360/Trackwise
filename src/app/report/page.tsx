import { ReportIssueForm } from '@/components/report-issue-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SidebarTrigger } from '@/components/ui/sidebar';

export default function ReportPage() {
  return (
    <div className="flex flex-col min-h-screen">
       <header className="sticky top-0 z-10 flex items-center h-16 px-4 border-b bg-background/80 backdrop-blur-sm md:px-6">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <h1 className="text-2xl font-semibold">Report an Issue</h1>
        </div>
      </header>
      <main className="flex-1 p-4 md:p-8 flex justify-center items-start">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Submit a New Issue</CardTitle>
            <CardDescription>
              Please provide as much detail as possible so we can resolve your issue quickly.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ReportIssueForm />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
