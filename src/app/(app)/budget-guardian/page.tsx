'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Lightbulb } from 'lucide-react';

import { suggestSpendingWindows } from '@/app/actions';
import type { SuggestSpendingWindowsOutput } from '@/ai/flows/suggest-spending-windows';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
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
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  spendingHistory: z.string().min(1, 'Spending history is required'),
  currentBalance: z.coerce.number().min(0, 'Balance must be non-negative'),
  income: z.coerce.number().positive('Income must be positive'),
  bills: z.string().min(1, 'Bills information is required'),
});

type FormValues = z.infer<typeof formSchema>;

const defaultSpendingHistory = `January: Groceries $400, Rent $1200, Dining out $300, Shopping $250
February: Groceries $380, Rent $1200, Utilities $150, Entertainment $200`;

const defaultBills = `Rent: $1200 due on the 1st, Electricity: $80 due on the 15th, Internet: $60 due on the 20th`;

export default function BudgetGuardianPage() {
  const [isPending, startTransition] = useTransition();
  const [suggestion, setSuggestion] =
    useState<SuggestSpendingWindowsOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      spendingHistory: defaultSpendingHistory,
      currentBalance: 3500,
      income: 5000,
      bills: defaultBills,
    },
  });

  const onSubmit = (values: FormValues) => {
    setSuggestion(null);
    startTransition(async () => {
      const result = await suggestSpendingWindows(values);
      if ('error' in result) {
        toast({
          variant: 'destructive',
          title: 'Analysis Error',
          description: result.error,
        });
      } else {
        setSuggestion(result);
      }
    });
  };

  return (
    <div className="container mx-auto max-w-4xl space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Smart Budget Guardian</h1>
        <p className="text-muted-foreground">
          Let our AI analyze your finances and suggest safer spending windows.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <Card>
          <CardHeader>
            <CardTitle>Your Financial Snapshot</CardTitle>
            <CardDescription>
              Provide your financial details for analysis. You can use the default example data.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="currentBalance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Balance ($)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="income"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Monthly Income ($)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="spendingHistory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Spending History</FormLabel>
                      <FormControl>
                        <Textarea rows={5} {...field} />
                      </FormControl>
                      <FormDescription>
                        A brief description of your recent spending.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bills"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Upcoming Bills</FormLabel>
                      <FormControl>
                        <Textarea rows={3} {...field} />
                      </FormControl>
                      <FormDescription>
                        List your regular bills and their due dates.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={isPending} className="w-full">
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Analyze My Budget
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="sticky top-24">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="text-accent" />
              AI-Powered Suggestions
            </CardTitle>
            <CardDescription>
              Our AI's recommendations will appear here after analysis.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isPending && (
              <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-48">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                <p>Guardian AI is thinking...</p>
              </div>
            )}
            {!isPending && !suggestion && (
              <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-48">
                <p>Your financial advice awaits.</p>
              </div>
            )}
            {suggestion && (
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-semibold mb-2">Suggested Spending Windows</h4>
                  <p className="bg-primary/10 p-3 rounded-md border border-primary/20">
                    {suggestion.suggestedSpendingWindows}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Explanation</h4>
                  <p className="text-muted-foreground">
                    {suggestion.explanation}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
