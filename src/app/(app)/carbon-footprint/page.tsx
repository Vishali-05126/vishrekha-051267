'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Leaf } from 'lucide-react';

import { calculateCarbonFootprint } from '@/app/actions';
import type { CalculateCarbonFootprintOutput } from '@/ai/flows/calculate-carbon-footprint';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  transactionDescription: z
    .string()
    .min(10, 'Please provide a more detailed description.'),
});

type FormValues = z.infer<typeof formSchema>;

export default function CarbonFootprintPage() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<CalculateCarbonFootprintOutput | null>(
    null
  );
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      transactionDescription:
        'Purchased a pair of leather shoes for $150 from a brand that sources materials globally.',
    },
  });

  const onSubmit = (values: FormValues) => {
    setResult(null);
    startTransition(async () => {
      const res = await calculateCarbonFootprint(values);
      if ('error' in res) {
        toast({
          variant: 'destructive',
          title: 'Calculation Error',
          description: res.error,
        });
      } else {
        setResult(res);
      }
    });
  };

  const getProgressColor = (value: number) => {
    if (value < 5) return 'bg-green-500';
    if (value < 20) return 'bg-yellow-500';
    return 'bg-red-500';
  }
  
  const normalizedProgress = result ? Math.min((result.carbonFootprintKgCO2e / 50) * 100, 100) : 0;


  return (
    <div className="container mx-auto max-w-4xl space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Carbon Footprint Calculator
        </h1>
        <p className="text-muted-foreground">
          Understand the environmental impact of your purchases.
        </p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <Card>
          <CardHeader>
            <CardTitle>Transaction Details</CardTitle>
            <CardDescription>
              Describe a transaction to calculate its estimated carbon
              footprint.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="transactionDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Transaction Description</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={5}
                          placeholder="e.g., Bought a flight ticket from New York to London"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Be as detailed as possible for a more accurate
                        estimation.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={isPending} className="w-full">
                  {isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Calculate Footprint
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        <Card className="sticky top-24">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="text-accent" />
              Environmental Impact
            </CardTitle>
            <CardDescription>
              The estimated CO2 equivalent for your transaction.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isPending && (
              <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-48">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                <p>AI is calculating...</p>
              </div>
            )}
            {!isPending && !result && (
              <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-48">
                <p>Your carbon footprint results will appear here.</p>
              </div>
            )}
            {result && (
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-muted-foreground">Estimated Footprint</p>
                  <p className="text-5xl font-bold text-primary">
                    {result.carbonFootprintKgCO2e.toFixed(2)}
                  </p>
                  <p className="text-muted-foreground">kg CO₂e</p>
                </div>
                
                <Progress value={normalizedProgress} className="h-3" indicatorClassName={getProgressColor(result.carbonFootprintKgCO2e)} />
                
                <div className="text-xs text-center text-muted-foreground flex justify-between">
                  <span>Low Impact</span>
                  <span>High Impact</span>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Explanation</h4>
                  <p className="text-sm text-muted-foreground bg-muted p-4 rounded-lg border">
                    {result.explanation}
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
