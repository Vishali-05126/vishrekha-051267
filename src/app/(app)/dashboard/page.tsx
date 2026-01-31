import Link from 'next/link';
import {
  ArrowRight,
  Bot,
  Briefcase,
  CreditCard,
  Ghost,
  Leaf,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';

const features = [
  {
    title: 'Smart Budget Guardian',
    description: 'Get proactive alerts and spending advice.',
    href: '/budget-guardian',
    icon: <ShieldCheck className="size-6 text-primary" />,
  },
  {
    title: 'Carbon Footprint',
    description: 'Calculate the environmental impact of transactions.',
    href: '/carbon-footprint',
    icon: <Leaf className="size-6 text-primary" />,
  },
  {
    title: 'AI Assistant',
    description: 'Chat with our AI for financial advice.',
    href: '/assistant',
    icon: <Bot className="size-6 text-primary" />,
  },
  {
    title: 'MSME Dashboard',
    description: 'Access financial intelligence for your business.',
    href: '/msme-dashboard',
    icon: <Briefcase className="size-6 text-primary" />,
  },
  {
    title: 'Ghost Commerce',
    description: 'Scan QR codes for an invisible payment layer.',
    href: '/ghost-commerce',
    icon: <Ghost className="size-6 text-primary" />,
  },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <header className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary">
          Welcome to Octo-Pay
        </h1>
        <p className="text-lg text-muted-foreground">
          Your proactive financial intelligence assistant. Here's what you can do.
        </p>
      </header>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Main Feature Card */}
        <Card className="md:col-span-3 flex flex-col md:flex-row items-center gap-6 p-8 bg-gradient-to-br from-card to-secondary/50 hover:border-primary/50 transition-all border-2 border-transparent">
          <div className="p-4 bg-primary/10 rounded-full border-4 border-primary/20">
            <Zap className="size-12 text-primary" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold mb-2">
              Payment Simulation & Security
            </h2>
            <p className="text-muted-foreground mb-4">
              Test our proactive AI tentacles. Simulate a payment to predict
              failure and detect fraud in real-time before any money moves.
            </p>
            <Button asChild size="lg">
              <Link href="/payment-simulation">
                Run Simulation <ArrowRight className="ml-2 size-5" />
              </Link>
            </Button>
          </div>
        </Card>

        {/* Other Features */}
        {features.map((feature) => (
          <Card
            key={feature.title}
            className="flex flex-col transition-all hover:shadow-lg hover:border-primary/50 border-2 border-transparent"
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
              <Button asChild className="w-full" variant="outline">
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
