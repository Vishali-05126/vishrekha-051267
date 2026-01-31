'use server';
/**
 * @fileOverview This file defines a Genkit flow for calculating the carbon footprint of a transaction.
 *
 * The flow takes a transaction description as input and returns an estimate of the carbon footprint in kilograms of CO2 equivalent.
 *
 * @remarks
 * - calculateCarbonFootprint - A function that calculates the carbon footprint of a transaction.
 * - CalculateCarbonFootprintInput - The input type for the calculateCarbonFootprint function.
 * - CalculateCarbonFootprintOutput - The return type for the calculateCarbonFootprint function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CalculateCarbonFootprintInputSchema = z.object({
  transactionDescription: z
    .string()
    .describe(
      'A detailed description of the transaction, including the type of product or service purchased, the amount spent, and any other relevant information.'
    ),
});
export type CalculateCarbonFootprintInput = z.infer<typeof CalculateCarbonFootprintInputSchema>;

const CalculateCarbonFootprintOutputSchema = z.object({
  carbonFootprintKgCO2e: z
    .number()
    .describe(
      'An estimate of the carbon footprint of the transaction, in kilograms of CO2 equivalent (kgCO2e).'
    ),
  explanation: z
    .string()
    .describe(
      'A brief explanation of how the carbon footprint was calculated, including the assumptions and data sources used.'
    ),
});
export type CalculateCarbonFootprintOutput = z.infer<typeof CalculateCarbonFootprintOutputSchema>;

export async function calculateCarbonFootprint(
  input: CalculateCarbonFootprintInput
): Promise<CalculateCarbonFootprintOutput> {
  return calculateCarbonFootprintFlow(input);
}

const calculateCarbonFootprintPrompt = ai.definePrompt({
  name: 'calculateCarbonFootprintPrompt',
  input: {schema: CalculateCarbonFootprintInputSchema},
  output: {schema: CalculateCarbonFootprintOutputSchema},
  prompt: `You are an AI assistant that estimates the carbon footprint of transactions.

  Given the following transaction description, estimate the carbon footprint in kilograms of CO2 equivalent (kgCO2e).
  Also, provide a brief explanation of how you arrived at your estimate, including any assumptions you made.

  Transaction Description: {{{transactionDescription}}}

  Your response should be formatted as a JSON object with the following keys:
  - carbonFootprintKgCO2e: A number representing the estimated carbon footprint in kgCO2e.
  - explanation: A string explaining how the carbon footprint was calculated.
  `,
});

const calculateCarbonFootprintFlow = ai.defineFlow(
  {
    name: 'calculateCarbonFootprintFlow',
    inputSchema: CalculateCarbonFootprintInputSchema,
    outputSchema: CalculateCarbonFootprintOutputSchema,
  },
  async input => {
    const {output} = await calculateCarbonFootprintPrompt(input);
    return output!;
  }
);
