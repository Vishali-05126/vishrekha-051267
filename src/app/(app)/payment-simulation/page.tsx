'use client';

import { useState, useTransition, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Mic,
  ShieldAlert,
  ShieldCheck,
  Voicemail,
  Zap,
} from 'lucide-react';

import {
  predictPaymentFailure,
  detectFraud,
} from '@/app/actions';
import type {
  PredictPaymentFailureOutput,
} from '@/ai/flows/predict-payment-failure';
import type { DetectFraudOutput } from '@/ai/flows/detect-fraud-early-warning';

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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  paymentMethod: z.string().min(1, 'Payment method is required'),
  amount: z.coerce.number().positive('Amount must be positive'),
  merchant: z.string().min(1, 'Merchant is required'),
});

type FormValues = z.infer<typeof formSchema>;

export default function PaymentSimulationPage() {
  const [isPending, startTransition] = useTransition();
  const [prediction, setPrediction] =
    useState<PredictPaymentFailureOutput | null>(null);
  const [fraudResult, setFraudResult] = useState<DetectFraudOutput | null>(
    null
  );
  const [isListening, setIsListening] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      paymentMethod: '',
      amount: 100,
      merchant: 'Online Store',
    },
  });

  const onSubmit = (values: FormValues) => {
    setPrediction(null);
    setFraudResult(null);

    startTransition(async () => {
      // Fake data for AI flows
      const paymentInput = {
        ...values,
        userBalance: 50,
        networkConditions: 'poor',
        merchantReliability: 0.7,
      };

      const fraudInput = {
        transactionDetails: `Amount: ${values.amount}, Merchant: ${values.merchant}`,
        userHistory: 'Normal spending pattern',
        deviceInfo: 'New device',
        locationInfo: 'Unusual location',
      };

      const [predictionRes, fraudRes] = await Promise.all([
        predictPaymentFailure(paymentInput),
        detectFraud(fraudInput),
      ]);

      if ('error' in predictionRes) {
        toast({
          variant: 'destructive',
          title: 'Prediction Error',
          description: predictionRes.error,
        });
      } else {
        setPrediction(predictionRes);
      }

      if ('error' in fraudRes) {
        toast({
          variant: 'destructive',
          title: 'Fraud Detection Error',
          description: fraudRes.error,
        });
      } else {
        setFraudResult(fraudRes);
      }
    });
  };

  useEffect(() => {
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      // Silently fail if not supported
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      const command = event.results[0][0].transcript.toLowerCase();
      handleVoiceCommand(command);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    if (isListening) {
      recognition.start();
    }

    return () => {
      recognition.stop();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isListening]);

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  }

  const handleVoiceCommand = (command: string) => {
    toast({ title: "Voice Command", description: `Heard: "${command}"`});
    if (command.includes('amount')) {
      const match = command.match(/(\d+)/);
      if (match) {
        form.setValue('amount', parseInt(match[0], 10));
        speak(`Set amount to ${match[0]}`);
      }
    } else if (command.includes('merchant')) {
        const merchant = command.split('merchant ')[1];
        if (merchant) {
            form.setValue('merchant', merchant);
            speak(`Set merchant to ${merchant}`);
        }
    } else if (command.includes('payment method')) {
        const method = command.split('payment method ')[1]?.replace(' ', '-');
        if (['credit-card', 'debit-card', 'bank-transfer'].includes(method)) {
            form.setValue('paymentMethod', method);
            speak(`Set payment method to ${method.replace('-', ' ')}`);
        }
    } else if (command.includes('submit') || command.includes('pay')) {
      speak("Submitting payment for analysis.");
      form.handleSubmit(onSubmit)();
    } else {
      speak("Sorry, I didn't understand that command.");
    }
  };


  return (
    <div className="container mx-auto max-w-4xl space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Payment Simulation & Security
        </h1>
        <p className="text-muted-foreground">
          Test our proactive AI tentacles. Simulate a payment to predict failure
          and detect fraud in real-time.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Simulate a Transaction</CardTitle>
          <CardDescription>
            Enter payment details below and our AI will analyze it. You can also use voice commands.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="100.00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="merchant"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Merchant</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Online Store" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Method</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a payment method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="credit-card">Credit Card</SelectItem>
                        <SelectItem value="debit-card">Debit Card</SelectItem>
                        <SelectItem value="bank-transfer">
                          Bank Transfer
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col sm:flex-row gap-4">
                <Button type="submit" disabled={isPending} className="flex-1">
                  {isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : <Zap className="mr-2 h-4 w-4" />}
                  Analyze Payment
                </Button>
                <Button
                  type="button"
                  variant={isListening ? 'destructive' : 'outline'}
                  onClick={() => setIsListening(prev => !prev)}
                  className="flex-1"
                >
                  {isListening ? (
                     <Voicemail className="mr-2 h-4 w-4 animate-pulse" />
                  ) : <Mic className="mr-2 h-4 w-4" />}
                 {isListening ? 'Listening...' : 'Use Voice Command'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {isPending && <div className="text-center"><Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" /> <p className="mt-2 text-muted-foreground">AI is analyzing...</p></div>}
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {prediction && (
          <Alert variant={prediction.isLikelyToFail ? 'warning' : 'success'}>
            {prediction.isLikelyToFail ? (
              <AlertCircle className="h-4 w-4" />
            ) : (
              <CheckCircle2 className="h-4 w-4" />
            )}
            <AlertTitle>Payment Failure Prediction</AlertTitle>
            <AlertDescription>
              {prediction.isLikelyToFail ? (
                <>
                  <p className="font-semibold">
                    This payment is likely to fail.
                  </p>
                  <p>
                    <strong>Reason:</strong> {prediction.failureReason}
                  </p>
                  <p>
                    <strong>Suggestion:</strong>{' '}
                    {prediction.suggestedAlternative}
                  </p>
                </>
              ) : (
                <p className="font-semibold">
                  Payment is likely to succeed.
                </p>
              )}
            </AlertDescription>
          </Alert>
        )}

        {fraudResult && (
          <Alert variant={fraudResult.isFraudulent ? 'destructive' : 'success'}>
            {fraudResult.isFraudulent ? (
              <ShieldAlert className="h-4 w-4" />
            ) : (
              <ShieldCheck className="h-4 w-4" />
            )}
            <AlertTitle>Real-Time Fraud Detection</AlertTitle>
            <AlertDescription>
              {fraudResult.isFraudulent ? (
                <>
                  <p className="font-semibold">Potential fraud detected!</p>
                  <p>
                    <strong>Explanation:</strong> {fraudResult.fraudExplanation}
                  </p>
                </>
              ) : (
                <p className="font-semibold">
                  Transaction appears secure. No fraud detected.
                </p>
              )}
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
