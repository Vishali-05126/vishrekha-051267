'use server';

import {
  predictPaymentFailure as predictPaymentFailureFlow,
  type PredictPaymentFailureInput,
  type PredictPaymentFailureOutput,
} from '@/ai/flows/predict-payment-failure';
import {
  detectFraud as detectFraudFlow,
  type DetectFraudInput,
  type DetectFraudOutput,
} from '@/ai/flows/detect-fraud-early-warning';
import {
  suggestSpendingWindows as suggestSpendingWindowsFlow,
  type SuggestSpendingWindowsInput,
  type SuggestSpendingWindowsOutput,
} from '@/ai/flows/suggest-spending-windows';
import {
  calculateCarbonFootprint as calculateCarbonFootprintFlow,
  type CalculateCarbonFootprintInput,
  type CalculateCarbonFootprintOutput,
} from '@/ai/flows/calculate-carbon-footprint';
import {
  financialAssistant as financialAssistantFlow,
  type FinancialAssistantInput,
  type FinancialAssistantOutput,
} from '@/ai/flows/financial-assistant';

export async function predictPaymentFailure(
  input: PredictPaymentFailureInput
): Promise<PredictPaymentFailureOutput | { error: string }> {
  try {
    const result = await predictPaymentFailureFlow(input);
    return result;
  } catch (e) {
    console.error(e);
    return { error: 'Failed to predict payment failure.' };
  }
}

export async function detectFraud(
  input: DetectFraudInput
): Promise<DetectFraudOutput | { error: string }> {
  try {
    const result = await detectFraudFlow(input);
    return result;
  } catch (e) {
    console.error(e);
    return { error: 'Failed to detect fraud.' };
  }
}

export async function suggestSpendingWindows(
  input: SuggestSpendingWindowsInput
): Promise<SuggestSpendingWindowsOutput | { error: string }> {
  try {
    const result = await suggestSpendingWindowsFlow(input);
    return result;
  } catch (e) {
    console.error(e);
    return { error: 'Failed to suggest spending windows.' };
  }
}

export async function calculateCarbonFootprint(
  input: CalculateCarbonFootprintInput
): Promise<CalculateCarbonFootprintOutput | { error: string }> {
  try {
    const result = await calculateCarbonFootprintFlow(input);
    return result;
  } catch (e) {
    console.error(e);
    return { error: 'Failed to calculate carbon footprint.' };
  }
}

export async function financialAssistant(
  input: FinancialAssistantInput
): Promise<FinancialAssistantOutput | { error: string }> {
  try {
    const result = await financialAssistantFlow(input);
    return result;
  } catch (e) {
    console.error(e);
    return { error: 'Failed to get response from assistant.' };
  }
}
