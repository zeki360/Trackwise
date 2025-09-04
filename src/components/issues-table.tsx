'use client';

import type { Issue, Status } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  CircleHelp,
  CircleCheck,
  RefreshCw,
  CheckCircle,
  MoreHorizontal,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import { format } from 'date-fns';

export function IssuesTable({ issues }: { issues: Issue[] }) {
  const getStatusBadgeVariant = (status: Status): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (status) {
      case 'Pending':
        return 'secondary';
      case 'Accepted':
        return 'outline';
      case 'Ongoing':
        return 'default';
      case 'Finished':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: Status) => {
    switch (status) {
      case 'Pending':
        return <CircleHelp className="mr-2 h-4 w-4" />;
      case 'Accepted':
        return <CircleCheck className="mr-2 h-4 w-4" />;
      case 'Ongoing':
        return <RefreshCw className="mr-2 h-4 w-4 animate-spin" />;
      case 'Finished':
        return <CheckCircle className="mr-2 h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">ID</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Assigned To</TableHead>
          <TableHead className="w-[50px] text-right"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {issues.map((issue) => (
          <TableRow key={issue.id}>
            <TableCell className="font-medium">{issue.id}</TableCell>
            <TableCell>{issue.title}</TableCell>
            <TableCell>
              <Badge variant="outline">{issue.subCategory ? `${issue.category} / ${issue.subCategory}`: issue.category}</Badge>
            </TableCell>
            <TableCell>
              <Badge variant={getStatusBadgeVariant(issue.status)} className="items-center">
                {getStatusIcon(issue.status)}
                <span>{issue.status}</span>
              </Badge>
            </TableCell>
            <TableCell>{format(issue.createdAt, 'PP')}</TableCell>
            <TableCell>{issue.assignedTo}</TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Actions</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>View Details</DropdownMenuItem>
                  <DropdownMenuItem>Change Status</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
