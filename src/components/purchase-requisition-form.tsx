
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { PlusCircle, Trash2 } from 'lucide-react';
import { useEffect } from 'react';

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
  description: z.string().min(1, 'Description is required.'),
  unitOfMeasure: z.string().min(1, 'Unit of Measure is required.'),
  quantity: z.coerce.number().min(1, 'Quantity must be at least 1.'),
  remark: z.string().optional(),
});

const formSchema = z.object({
  requisitionId: z.string().min(1, 'Requisition ID is required.'),
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

const generateRequisitionId = () => `REQ-${Date.now()}`;

export function PurchaseRequisitionForm() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      requisitionId: '',
      costCenter: '',
      urgency: 'Routine',
      requestedBy: '',
      storeRequisitionNo: '',
      items: [{ description: '', unitOfMeasure: '', quantity: 1, remark: '' }],
      preparedBy: '',
      checkedBy: '',
      approvedBy: '',
    },
  });

  useEffect(() => {
    form.setValue('requisitionId', generateRequisitionId());
  }, [form]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  });

  function onSubmit(values: FormValues) {
    console.log(values);
    toast({
      title: 'Purchase Requisition Submitted!',
      description: `Requisition ${values.requisitionId} has been created.`,
    });
    router.push('/');
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FormField
            control={form.control}
            name="requisitionId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Requisition ID</FormLabel>
                <FormControl>
                  <Input readOnly {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
          <div className="space-y-6">
            {fields.map((item, index) => (
              <div key={item.id} className="border rounded-md p-4 space-y-4 relative">
                 <FormField
                    control={form.control}
                    name={`items.${index}.description`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Item Description</FormLabel>
                            <FormControl>
                                <Textarea {...field} placeholder="Full description of the item..." className="min-h-[40px]"/>
                            </FormControl>
                            <FormMessage>{form.formState.errors.items?.[index]?.description?.message}</FormMessage>
                        </FormItem>
                    )}
                    />
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[150px]">Unit of Measure</TableHead>
                        <TableHead className="w-[100px]">Quantity</TableHead>
                        <TableHead>Remark</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
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
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                 {fields.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                      className="absolute top-2 right-2"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
              </div>
            ))}
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
              append({ description: '', unitOfMeasure: '', quantity: 1, remark: '' })
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

    