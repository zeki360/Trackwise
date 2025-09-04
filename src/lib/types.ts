export type Status = 'Pending' | 'Accepted' | 'Ongoing' | 'Finished';
export type Category = 'Facility' | 'IT' | 'Purchase';

export type SubCategory =
  | 'External'
  | 'Internal'
  | 'Hardware'
  | 'Software'
  | 'Office Machines'
  | 'Internet'
  | 'Repair';

export type Role = 'Operations Manager' | 'IT Manager' | 'Purchaser' | 'Admin Director';

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: Category;
  subCategory?: SubCategory;
  status: Status;
  assignedTo: Role;
  createdAt: Date;
}
