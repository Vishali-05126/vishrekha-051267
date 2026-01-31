'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  cashFlowData,
  fraudRiskData,
  paymentSuccessData,
  type FraudRiskData,
} from '@/lib/data';

import type { ChartConfig } from '@/components/ui/chart';

const chartConfig: ChartConfig = {
  success: {
    label: 'Successful',
    color: 'hsl(var(--chart-1))',
  },
  failed: {
    label: 'Failed',
    color: 'hsl(var(--destructive))',
  },
  income: {
    label: 'Income',
    color: 'hsl(var(--chart-1))',
  },
  expenses: {
    label: 'Expenses',
    color: 'hsl(var(--chart-2))',
  },
};

export default function MsmeDashboardPage() {
  const getRiskBadgeVariant = (
    status: FraudRiskData['status']
  ): 'destructive' | 'secondary' | 'default' => {
    switch (status) {
      case 'High':
        return 'destructive';
      case 'Medium':
        return 'secondary';
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          MSME Financial Intelligence
        </h1>
        <p className="text-muted-foreground">
          Real-time insights for your business performance.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Transactions</CardTitle>
            <CardDescription>Last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">12,543</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Success Rate</CardTitle>
            <CardDescription>Last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">90.1%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Fraud Alerts</CardTitle>
            <CardDescription>Last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-destructive">12</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Payment Success Rate</CardTitle>
            <CardDescription>Monthly comparison</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={paymentSuccessData}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: 'hsl(var(--muted))' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                Successful
                              </span>
                              <span className="font-bold text-muted-foreground">
                                {payload[0].value}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                Failed
                              </span>
                              <span className="font-bold text-destructive">
                                {payload[1].value}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend />
                <Bar
                  dataKey="success"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="failed"
                  fill="hsl(var(--destructive))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cash Flow Prediction</CardTitle>
            <CardDescription>Income vs. Expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={cashFlowData}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="date" tickFormatter={(val) => new Date(val).toLocaleString('default', { month: 'short' })} />
                <YAxis />
                <Tooltip
                   content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                          <p className="font-bold mb-1">{new Date(label).toLocaleString('default', { month: 'long' })}</p>
                          <p style={{ color: chartConfig.income.color }}>Income: ${payload[0].value}</p>
                          <p style={{ color: chartConfig.expenses.color }}>Expenses: ${payload[1].value}</p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="expenses"
                  stroke="hsl(var(--accent))"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Fraud Risk Heatmap</CardTitle>
          <CardDescription>
            Transactions with high fraud risk by location.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Location</TableHead>
                <TableHead>Transactions</TableHead>
                <TableHead>Risk Score</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fraudRiskData.map((data) => (
                <TableRow key={data.id}>
                  <TableCell className="font-medium">{data.location}</TableCell>
                  <TableCell>{data.transactions}</TableCell>
                  <TableCell>{data.riskScore}</TableCell>
                  <TableCell>
                    <Badge variant={getRiskBadgeVariant(data.status)}>
                      {data.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
