'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { KeyRound, Landmark, Loader2, ShieldCheck } from 'lucide-react';

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
import { Icons } from '@/components/icons';

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
    <div className="container mx-auto max-w-4xl space-y-8 animate-fade-in">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground">
          Manage your linked bank account and security settings.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        <div className="md:col-span-2">
          <Card className="bg-card/50 backdrop-blur-sm">
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
                            <Input placeholder="123456789" {...field} className="pl-10 h-12" />
                          </div>
                        </FormControl>
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
                            <Input type="password" placeholder="••••••••" {...field} className="pl-10 h-12" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" disabled={isPending} className="w-full h-12 text-base">
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save & Secure Account
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
            <Card className="bg-secondary/50 border-dashed border-accent">
                <CardHeader className="flex flex-row items-center gap-4">
                    <ShieldCheck className="size-8 text-accent" />
                    <div>
                        <CardTitle>Your Security is Our Priority</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                    <p>Your data is protected with end-to-end encryption.</p>
                    <p>We will never share your financial information without your consent.</p>
                    <p>Use a strong, unique password to protect your account.</p>
                </CardContent>
            </Card>
             <Card className="bg-card/50">
                <CardHeader>
                    <CardTitle>Need Help?</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">Contact our support team if you have any questions about linking your account.</p>
                    <Button variant="outline" className="w-full">Contact Support</Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
