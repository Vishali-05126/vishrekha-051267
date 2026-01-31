import Link from 'next/link';
import {
  ArrowRight,
  Briefcase,
  CreditCard,
  Leaf,
  ShieldCheck,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const features = [
  {
    title: 'Payment Simulation',
    description: 'Predict failures and detect fraud before you pay.',
    href: '/payment-simulation',
    icon: <CreditCard className="size-8 text-primary" />,
  },
  {
    title: 'Smart Budget Guardian',
    description: 'Get proactive alerts and spending advice.',
    href: '/budget-guardian',
    icon: <ShieldCheck className="size-8 text-primary" />,
  },
  {
    title: 'Carbon Footprint',
    description: 'Calculate the environmental impact of transactions.',
    href: '/carbon-footprint',
    icon: <Leaf className="size-8 text-primary" />,
  },
  {
    title: 'MSME Dashboard',
    description: 'Access financial intelligence for your business.',
    href: '/msme-dashboard',
    icon: <Briefcase className="size-8 text-primary" />,
  },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome to Octo-Pay
        </h1>
        <p className="text-muted-foreground">
          Your proactive financial intelligence assistant.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => (
          <Card
            key={feature.title}
            className="flex flex-col transition-all hover:shadow-lg"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">
                {feature.title}
              </CardTitle>
              {feature.icon}
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </CardContent>
            <div className="p-6 pt-0">
              <Button asChild className="w-full">
                <Link href={feature.href}>
                  Launch <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
