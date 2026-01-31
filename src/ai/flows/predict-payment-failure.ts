'use server';

/**
 * @fileOverview A payment failure prediction AI agent.
 *
 * - predictPaymentFailure - A function that predicts potential payment failures.
 * - PredictPaymentFailureInput - The input type for the predictPaymentFailure function.
 * - PredictPaymentFailureOutput - The return type for the predictPaymentFailure function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictPaymentFailureInputSchema = z.object({
  paymentMethod: z.string().describe('The payment method used for the transaction.'),
  amount: z.number().describe('The amount of the transaction.'),
  userBalance: z.number().describe('The current balance of the user.'),
  networkConditions: z.string().describe('The current network conditions.'),
  merchantReliability: z.number().describe('A score indicating the reliability of the merchant (0-1).'),
});
export type PredictPaymentFailureInput = z.infer<typeof PredictPaymentFailureInputSchema>;

const PredictPaymentFailureOutputSchema = z.object({
  isLikelyToFail: z.boolean().describe('Whether the payment is likely to fail.'),
  failureReason: z.string().describe('The predicted reason for the payment failure.'),
  suggestedAlternative: z.string().describe('A suggested alternative payment method or action.'),
});
export type PredictPaymentFailureOutput = z.infer<typeof PredictPaymentFailureOutputSchema>;

export async function predictPaymentFailure(input: PredictPaymentFailureInput): Promise<PredictPaymentFailureOutput> {
  return predictPaymentFailureFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictPaymentFailurePrompt',
  input: {schema: PredictPaymentFailureInputSchema},
  output: {schema: PredictPaymentFailureOutputSchema},
  prompt: `You are a payment failure prediction expert. Given the following information, predict whether the payment is likely to fail and suggest an alternative if it is.

Payment Method: {{{paymentMethod}}}
Amount: {{{amount}}}
User Balance: {{{userBalance}}}
Network Conditions: {{{networkConditions}}}
Merchant Reliability: {{{merchantReliability}}}

Consider the user's balance, network conditions, and merchant reliability when determining if the payment will fail. If the user balance is insufficient, or the network conditions are poor, or the merchant reliability is low, the payment is more likely to fail. Provide a reason for the failure and suggest an alternative.

Is Likely To Fail: {{isLikelyToFail}}
Failure Reason: {{failureReason}}
Suggested Alternative: {{suggestedAlternative}}`,
});

const predictPaymentFailureFlow = ai.defineFlow(
  {
    name: 'predictPaymentFailureFlow',
    inputSchema: PredictPaymentFailureInputSchema,
    outputSchema: PredictPaymentFailureOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
