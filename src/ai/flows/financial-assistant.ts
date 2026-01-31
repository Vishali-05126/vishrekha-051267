'use server';
/**
 * @fileOverview A conversational AI financial assistant.
 *
 * - financialAssistant - A function that handles the conversation.
 * - FinancialAssistantInputSchema - The input type for the financialAssistant function.
 * - FinancialAssistantOutputSchema - The return type for the financialAssistant function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const MessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});

export const FinancialAssistantInputSchema = z.object({
  history: z.array(MessageSchema),
});
export type FinancialAssistantInput = z.infer<typeof FinancialAssistantInputSchema>;

export const FinancialAssistantOutputSchema = z.object({
  response: z.string(),
});
export type FinancialAssistantOutput = z.infer<typeof FinancialAssistantOutputSchema>;

export async function financialAssistant(
  input: FinancialAssistantInput
): Promise<FinancialAssistantOutput> {
  return financialAssistantFlow(input);
}

const systemPrompt = `You are a friendly and helpful financial assistant for the Octo-Pay app. Your name is Octo-Assistant. Your goal is to provide helpful advice on personal finance, budgeting, and explain the features of the Octo-Pay app. Keep your responses concise and easy to understand.

Octo-Pay has the following features:
- Payment Simulation: Predicts payment failures and detects fraud before a transaction happens.
- Smart Budget Guardian: Provides proactive alerts and suggests safer spending windows.
- Carbon Footprint Calculator: Estimates the environmental impact of user's purchases.
- MSME Dashboard: Offers financial intelligence for small and medium-sized enterprises.
- AI Assistant: That's you! You are here to help users with their financial questions.
`;

const financialAssistantFlow = ai.defineFlow(
  {
    name: 'financialAssistantFlow',
    inputSchema: FinancialAssistantInputSchema,
    outputSchema: FinancialAssistantOutputSchema,
  },
  async ({ history }) => {
    const llmResponse = await ai.generate({
      history: [{ role: 'system', content: systemPrompt }, ...history],
      config: {
        temperature: 0.5,
      },
    });

    return {
      response: llmResponse.text,
    };
  }
);
