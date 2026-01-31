'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { KeyRound, Landmark, Loader2 } from 'lucide-react';

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
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import React from 'react';

const formSchema = z.object({
  accountNumber: z.string().regex(/^\d{9,18}$/, 'Please enter a valid bank account number (9-18 digits).'),
  password: z.string().min(8, 'Password must be at least 8 characters long.'),
});

type FormValues = z.infer<typeof formSchema>;

export default function SettingsPage() {
  const [isPending, startTransition] = React.useTransition();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accountNumber: '',
      password: '',
    },
  });

  const onSubmit = (values: FormValues) => {
    startTransition(() => {
        // Simulate saving the data
        console.log('Saving settings:', values);
        toast({
            title: 'Settings Saved',
            description: 'Your bank account has been securely linked.',
        });
        form.reset();
    });
  };

  return (
    <div className="container mx-auto max-w-2xl space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground">
          Manage your linked bank account and security settings.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Link Bank Account</CardTitle>
          <CardDescription>
            Enter your bank account details below for seamless payments. This information is encrypted and stored securely.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="accountNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bank Account Number</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Landmark className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input placeholder="123456789" {...field} className="pl-10" />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Your account number will not be shared with anyone.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Security Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input type="password" placeholder="••••••••" {...field} className="pl-10" />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Use this password to authorize high-value transactions.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isPending} className="w-full">
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save & Secure Account
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
