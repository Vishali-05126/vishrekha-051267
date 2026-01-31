// src/ai/flows/detect-fraud-early-warning.ts
'use server';
/**
 * @fileOverview Implements real-time fraud detection for payment transactions.
 *
 * - detectFraud - Detects potential fraud in a transaction and alerts the user.
 * - DetectFraudInput - The input type for the detectFraud function.
 * - DetectFraudOutput - The return type for the detectFraud function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectFraudInputSchema = z.object({
  transactionDetails: z.string().describe('Details of the transaction, including amount, merchant, and location.'),
  userHistory: z.string().describe('Historical transaction data for the user.'),
  deviceInfo: z.string().describe('Information about the device used for the transaction.'),
  locationInfo: z.string().describe('Location information of the user during the transaction.'),
});
export type DetectFraudInput = z.infer<typeof DetectFraudInputSchema>;

const DetectFraudOutputSchema = z.object({
  isFraudulent: z.boolean().describe('Whether the transaction is likely fraudulent.'),
  fraudExplanation: z.string().describe('Explanation of why the transaction is flagged as potentially fraudulent.'),
});
export type DetectFraudOutput = z.infer<typeof DetectFraudOutputSchema>;

export async function detectFraud(input: DetectFraudInput): Promise<DetectFraudOutput> {
  return detectFraudFlow(input);
}

const detectFraudPrompt = ai.definePrompt({
  name: 'detectFraudPrompt',
  input: {schema: DetectFraudInputSchema},
  output: {schema: DetectFraudOutputSchema},
  prompt: `You are an expert in fraud detection. Analyze the following transaction details, user history, device info and location info to determine if the transaction is fraudulent.

Transaction Details: {{{transactionDetails}}}
User History: {{{userHistory}}}
Device Info: {{{deviceInfo}}}
Location Info: {{{locationInfo}}}

Based on your analysis, determine if the transaction is likely fraudulent and provide an explanation.

Respond in a JSON format:
{
  "isFraudulent": true or false,
  "fraudExplanation": "explanation"
}`,
});

const detectFraudFlow = ai.defineFlow(
  {
    name: 'detectFraudFlow',
    inputSchema: DetectFraudInputSchema,
    outputSchema: DetectFraudOutputSchema,
  },
  async input => {
    const {output} = await detectFraudPrompt(input);
    return output!;
  }
);
