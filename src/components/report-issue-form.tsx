'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState, useTransition } from 'react';
import { useSearchParams } from 'next/navigation';
import { Sparkles, Loader2 } from 'lucide-react';

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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { getCategorySuggestion } from '@/lib/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

const formSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters long.'),
  description: z.string().min(10, 'Description must be at least 10 characters long.'),
  category: z.enum(['Facility', 'IT', 'Purchase', 'Vehicle'], {required_error: "Please select a category."}),
  subCategory: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const subCategories = {
  Facility: ['Internal', 'External'],
  IT: ['Hardware', 'Software', 'Office Machines', 'Internet', 'Repair'],
  Purchase: [],
  Vehicle: ['Maintenance', 'Repair', 'Accident'],
};

export function ReportIssueForm() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isSuggesting, startSuggestionTransition] = useTransition();
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const defaultCategory = searchParams.get('category');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      category: defaultCategory && ['Facility', 'IT', 'Purchase', 'Vehicle'].includes(defaultCategory) ? (defaultCategory as 'Facility' | 'IT' | 'Purchase' | 'Vehicle') : undefined,
    },
  });

  const selectedCategory = form.watch('category');

  async function handleSuggestCategory() {
    const description = form.getValues('description');
    if (!description || description.length < 20) {
      toast({
        title: 'Description too short',
        description: 'Please provide more details (at least 20 characters) for an accurate suggestion.',
        variant: 'destructive',
      });
      return;
    }

    startSuggestionTransition(async () => {
      const result = await getCategorySuggestion(description);
      if (result.error) {
        toast({
          title: 'Suggestion Failed',
          description: result.error,
          variant: 'destructive',
        });
        setSuggestions([]);
      } else if (result.suggestedCategories && result.suggestedCategories.length > 0) {
        toast({
          title: 'Suggestions Ready!',
          description: 'We have some category suggestions for you.',
        });
        setSuggestions(result.suggestedCategories);
      } else {
        toast({
          title: 'No Suggestions Found',
          description: "We couldn't determine a category. Please select one manually.",
        });
        setSuggestions([]);
      }
    });
  }
  
  function onSubmit(values: FormValues) {
    console.log(values);
    toast({
      title: 'Issue Reported!',
      description: `Your issue "${values.title}" has been submitted.`,
    });
    form.reset();
    setSuggestions([]);
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Leaky faucet in kitchen" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe the issue in detail..."
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  The more detail you provide, the faster we can help.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex items-center gap-4">
              <Button type="button" variant="outline" onClick={handleSuggestCategory} disabled={isSuggesting}>
                {isSuggesting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Suggest Category with AI
              </Button>
          </div>

          {suggestions.length > 0 && (
            <Card className="bg-muted/50">
              <CardHeader>
                  <CardTitle className="text-md flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary"/> AI Suggestions
                  </CardTitle>
                  <CardDescription>Click a suggestion to apply it.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {suggestions.map((suggestion) => (
                  <Button
                    key={suggestion}
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      if (['Facility', 'IT', 'Purchase', 'Vehicle'].includes(suggestion)){
                        form.setValue('category', suggestion as FormValues['category'], { shouldValidate: true });
                        form.setValue('subCategory', undefined);
                      } else {
                        for (const cat in subCategories) {
                          if ((subCategories as any)[cat].includes(suggestion)) {
                             form.setValue('category', cat as FormValues['category'], { shouldValidate: true });
                             form.setValue('subCategory', suggestion, { shouldValidate: true });
                             break;
                          }
                        }
                      }
                      setSuggestions([]);
                    }}
                  >
                    {suggestion}
                  </Button>
                ))}
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={(value) => { field.onChange(value); form.setValue('subCategory', undefined); }} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Facility">Facility</SelectItem>
                      <SelectItem value="IT">IT</SelectItem>
                      <SelectItem value="Purchase">Purchase</SelectItem>
                      <SelectItem value="Vehicle">Vehicle</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedCategory && subCategories[selectedCategory].length > 0 && (
              <FormField
                control={form.control}
                name="subCategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sub-Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={`Select a ${selectedCategory} sub-category`} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {subCategories[selectedCategory].map((sub) => (
                          <SelectItem key={sub} value={sub}>
                            {sub}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Issue
          </Button>
        </form>
      </Form>
    </>
  );
}
