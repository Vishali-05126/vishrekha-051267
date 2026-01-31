import Link from 'next/link';
import {
  ArrowRight,
  Bot,
  Briefcase,
  CreditCard,
  DollarSign,
  Ghost,
  Leaf,
  ShieldCheck,
  Settings,
  TrendingUp,
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
        icon: <ShieldCheck className="size-8 text-primary" />,
      },
      {
        title: 'Carbon Footprint',
        description: 'Calculate the environmental impact of transactions.',
        href: '/carbon-footprint',
        icon: <Leaf className="size-8 text-primary" />,
      },
      {
        title: 'AI Assistant',
        description: 'Chat with our AI for financial advice.',
        href: '/assistant',
        icon: <Bot className="size-8 text-primary" />,
      },
      {
        title: 'MSME Dashboard',
        description: 'Access financial intelligence for your business.',
        href: '/msme-dashboard',
        icon: <Briefcase className="size-8 text-primary" />,
      },
      {
        title: 'Ghost Commerce',
        description: 'An invisible payment layer for the unbanked.',
        href: '/ghost-commerce',
        icon: <Ghost className="size-8 text-primary" />,
      },
      {
        title: 'Settings',
        description: 'Manage your linked accounts and security.',
        href: '/settings',
        icon: <Settings className="size-8 text-primary" />,
      },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <header className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tighter">
          Hello, <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary">Demo User</span>
        </h1>
        <p className="text-lg text-muted-foreground">
          Welcome back to your financial command center.
        </p>
      </header>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="col-span-1">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                <DollarSign className="size-4 text-muted-foreground"/>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">$45,231.89</div>
                <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Recent Spending</CardTitle>
                <CreditCard className="size-4 text-muted-foreground"/>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">$4,231.89</div>
                <p className="text-xs text-muted-foreground">+12.1% from last week</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                <TrendingUp className="size-4 text-muted-foreground"/>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">99.2%</div>
                <p className="text-xs text-muted-foreground">over 1,200 transactions</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Fraud Alerts</CardTitle>
                <ShieldCheck className="size-4 text-muted-foreground"/>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">Your account is secure</p>
            </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Main Feature Card */}
        <Card className="md:col-span-3 flex flex-col justify-between p-6 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent relative overflow-hidden group border-primary/30 hover:border-primary/60 transition-all">
          <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-slow group-hover:scale-125 transition-transform duration-1000"/>
          <div className="flex-1 z-10">
            <div className="p-3 bg-primary/20 rounded-lg inline-block border border-primary/30 mb-4">
              <Zap className="size-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">
              Payment Simulation & Security
            </h2>
            <p className="text-muted-foreground mb-6 max-w-lg">
              Test our proactive AI tentacles. Simulate a payment to predict
              failure and detect fraud in real-time before any money moves.
            </p>
          </div>
          <div className="z-10">
            <Button asChild size="lg" className="bg-primary/90 hover:bg-primary">
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
            className="group flex flex-col transition-all bg-card/50 backdrop-blur-sm hover:bg-secondary/40 hover:border-accent/30 border-2 border-transparent"
          >
            <CardHeader className="pb-4">
              {feature.icon}
            </CardHeader>
            <CardContent className="flex-1">
                <h3 className="text-lg font-semibold mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                    {feature.description}
                </p>
            </CardContent>
            <div className="p-6 pt-0">
                <Button asChild className="w-full" variant="outline">
                    <Link href={feature.href}>
                        Launch <ArrowRight className="ml-2 size-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
