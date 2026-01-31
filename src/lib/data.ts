export const paymentSuccessData = [
  { name: 'Jan', success: 85, failed: 15 },
  { name: 'Feb', success: 92, failed: 8 },
  { name: 'Mar', success: 90, failed: 10 },
  { name: 'Apr', success: 88, failed: 12 },
  { name: 'May', success: 95, failed: 5 },
  { name: 'Jun', success: 91, failed: 9 },
];

export const cashFlowData = [
  { date: '2023-01-01', income: 4000, expenses: 2400 },
  { date: '2023-02-01', income: 3000, expenses: 1398 },
  { date: '2023-03-01', income: 5000, expenses: 3800 },
  { date: '2023-04-01', income: 4780, expenses: 2908 },
  { date: '2023-05-01', income: 6890, expenses: 4800 },
  { date: '2023-06-01', income: 5390, expenses: 3800 },
];

export type FraudRiskData = {
  id: string;
  location: string;
  transactions: number;
  riskScore: number;
  status: 'High' | 'Medium' | 'Low';
};

export const fraudRiskData: FraudRiskData[] = [
  { id: '1', location: 'New York, USA', transactions: 1024, riskScore: 85, status: 'High' },
  { id: '2', location: 'London, UK', transactions: 850, riskScore: 72, status: 'High' },
  { id: '3', location: 'Tokyo, Japan', transactions: 2400, riskScore: 35, status: 'Low' },
  { id: '4', location: 'Sydney, Australia', transactions: 1500, riskScore: 45, status: 'Medium' },
  { id: '5', location: 'Lagos, Nigeria', transactions: 450, riskScore: 91, status: 'High' },
  { id: '6', location: 'Singapore', transactions: 3200, riskScore: 22, status: 'Low' },
  { id: '7', location: 'São Paulo, Brazil', transactions: 670, riskScore: 68, status: 'Medium' },
];
