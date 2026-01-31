'use client';
import React, { useState, useTransition, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Send } from 'lucide-react';
import { financialAssistant } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/icons';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty'),
});

type FormValues = z.infer<typeof formSchema>;

type Message = {
  role: 'user' | 'model';
  content: string;
};

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      content:
        "Hello! I'm Octo-Assistant. How can I help you with your finances today?",
    },
  ]);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages, isPending]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: '',
    },
  });

  const onSubmit = (values: FormValues) => {
    const userMessage: Message = { role: 'user', content: values.message };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    form.reset();

    startTransition(async () => {
      const result = await financialAssistant({ history: newMessages });
      if ('error' in result) {
        toast({
          variant: 'destructive',
          title: 'Assistant Error',
          description: result.error,
        });
        setMessages((prev) => [
          ...prev,
          {
            role: 'model',
            content: "Sorry, I'm having trouble connecting. Please try again later.",
          },
        ]);
      } else {
        const modelMessage: Message = {
          role: 'model',
          content: result.response,
        };
        setMessages((prev) => [...prev, modelMessage]);
      }
    });
  };

  return (
    <div className="flex flex-col h-full">
      <header className="space-y-2 mb-4">
        <h1 className="text-3xl font-bold tracking-tight">AI Assistant</h1>
        <p className="text-muted-foreground">
          Your personal financial guide, powered by Octo-Pay.
        </p>
      </header>

      <Card className="flex-1 flex flex-col min-h-0">
        <CardContent className="flex-1 flex flex-col p-6 min-h-0">
          <ScrollArea className="flex-1 mb-4 pr-4">
            <div className="space-y-6">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    'flex items-start gap-4',
                    message.role === 'user' ? 'justify-end' : ''
                  )}
                >
                  {message.role === 'model' && (
                    <Avatar className="h-9 w-9">
                      <div className="bg-primary rounded-full flex items-center justify-center h-full w-full">
                        <Icons.octopus className="size-6 text-primary-foreground" />
                      </div>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      'max-w-md rounded-lg p-3 text-sm',
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    )}
                  >
                    {message.content}
                  </div>
                  {message.role === 'user' && (
                    <Avatar className="h-9 w-9">
                      <AvatarImage src="https://picsum.photos/seed/avatar/100/100" />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {isPending && (
                <div className="flex items-start gap-4">
                  <Avatar className="h-9 w-9">
                    <div className="bg-primary rounded-full flex items-center justify-center h-full w-full">
                      <Icons.octopus className="size-6 text-primary-foreground" />
                    </div>
                  </Avatar>
                  <div className="max-w-md rounded-lg p-3 text-sm bg-muted flex items-center">
                    <Loader2 className="h-5 w-5 animate-spin" />
                  </div>
                </div>
              )}
               <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          <div className="mt-auto">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex items-center gap-2"
              >
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          placeholder="Ask about your finances..."
                          {...field}
                          autoComplete="off"
                          disabled={isPending}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button type="submit" size="icon" disabled={isPending}>
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Send</span>
                </Button>
              </form>
            </Form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
