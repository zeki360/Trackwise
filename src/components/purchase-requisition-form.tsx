
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { PlusCircle, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from './ui/textarea';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const itemSchema = z.object({
  itemCode: z.string().optional(),
  description: z.string().min(1, 'Description is required.'),
  unitOfMeasure: z.string().min(1, 'Unit of Measure is required.'),
  quantity: z.coerce.number().min(1, 'Quantity must be at least 1.'),
  remark: z.string().optional(),
});

const formSchema = z.object({
  costCenter: z.string().min(1, 'Cost Center is required.'),
  urgency: z.enum(['Routine', 'Urgent', 'Critical'], {
    required_error: 'You need to select an urgency level.',
  }),
  requestedBy: z.string().min(1, 'Requested By is required.'),
  storeRequisitionNo: z.string().optional(),
  items: z.array(itemSchema).min(1, 'Please add at least one item.'),
  preparedBy: z.string().min(1, 'Preparer name is required.'),
  checkedBy: z.string().min(1, 'Checker name is required.'),
  approvedBy: z.string().min(1, 'Approver name is required.'),
});

type FormValues = z.infer<typeof formSchema>;

export function PurchaseRequisitionForm() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      costCenter: '',
      urgency: 'Routine',
      requestedBy: '',
      storeRequisitionNo: '',
      items: [{ description: '', unitOfMeasure: '', quantity: 1 }],
      preparedBy: '',
      checkedBy: '',
      approvedBy: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  });

  function onSubmit(values: FormValues) {
    console.log(values);
    toast({
      title: 'Purchase Requisition Submitted!',
      description: `Requisition for ${values.items.length} item(s) has been created.`,
    });
    router.push('/');
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FormField
            control={form.control}
            name="costCenter"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cost Center</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Marketing Department" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="requestedBy"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Requested By</FormLabel>
                <FormControl>
                  <Input placeholder="Your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="storeRequisitionNo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Store Requisition No.</FormLabel>
                <FormControl>
                  <Input placeholder="Optional" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="urgency"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Urgency</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Routine" />
                    </FormControl>
                    <FormLabel className="font-normal">Routine</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Urgent" />
                    </FormControl>
                    <FormLabel className="font-normal">Urgent</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Critical" />
                    </FormControl>
                    <FormLabel className="font-normal">Critical</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <FormLabel>Items</FormLabel>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Item Code</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-[150px]">Unit of Measure</TableHead>
                  <TableHead className="w-[100px]">Quantity</TableHead>
                  <TableHead>Remark</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fields.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name={`items.${index}.itemCode`}
                        render={({ field }) => <Input {...field} placeholder="Optional" />}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name={`items.${index}.description`}
                        render={({ field }) => (
                          <Textarea {...field} placeholder="Item description..."/>
                        )}
                      />
                      <FormMessage>{form.formState.errors.items?.[index]?.description?.message}</FormMessage>
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name={`items.${index}.unitOfMeasure`}
                        render={({ field }) => <Input {...field} placeholder="e.g., pcs, kg" />}
                      />
                       <FormMessage>{form.formState.errors.items?.[index]?.unitOfMeasure?.message}</FormMessage>
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name={`items.${index}.quantity`}
                        render={({ field }) => (
                          <Input type="number" {...field} />
                        )}
                      />
                      <FormMessage>{form.formState.errors.items?.[index]?.quantity?.message}</FormMessage>
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name={`items.${index}.remark`}
                        render={({ field }) => <Input {...field} placeholder="Optional" />}
                      />
                    </TableCell>
                    <TableCell>
                      {fields.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => remove(index)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
           {form.formState.errors.items?.root && (
              <p className="text-sm font-medium text-destructive">
                {form.formState.errors.items.root.message}
              </p>
            )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              append({ description: '', unitOfMeasure: '', quantity: 1 })
            }
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
           <FormField
            control={form.control}
            name="preparedBy"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prepared By</FormLabel>
                <FormControl>
                  <Input placeholder="Preparer's name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="checkedBy"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Checked By</FormLabel>
                <FormControl>
                  <Input placeholder="Checker's name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="approvedBy"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Approved By</FormLabel>
                <FormControl>
                  <Input placeholder="Approver's name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" size="lg" className="w-full">
          Submit Requisition
        </Button>
      </form>
    </Form>
  );
}
