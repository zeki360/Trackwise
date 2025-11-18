
export type Status = 'Pending' | 'Accepted' | 'Ongoing' | 'Finished';
export type Category = 'Facility' | 'IT' | 'Purchase' | 'Vehicle';

export type SubCategory =
  | 'External'
  | 'Internal'
  | 'Hardware'
  | 'Software'
  | 'Office Machines'
  | 'Internet'
  | 'Repair'
  | 'Maintenance'
  | 'Accident';

export type Role =
  | 'Director'
  | 'Admin Director'
  | 'Admin Assistant'
  | 'HR'
  | 'Project Funding'
  | 'Finance Head'
  | 'IT Director'
  | 'Operations Manager'
  | 'IT officer'
  | 'Staff';

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: Category;
  subCategory?: SubCategory;
  status: Status;
  assignedTo: Role;
  reportedBy: string;
  createdAt: Date;
}
