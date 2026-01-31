'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Briefcase,
  CreditCard,
  LayoutDashboard,
  Leaf,
  ShieldCheck,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarContent,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Icons } from '@/components/icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const menuItems = [
  {
    href: '/dashboard',
    icon: LayoutDashboard,
    label: 'Dashboard',
  },
  {
    href: '/payment-simulation',
    icon: CreditCard,
    label: 'Payment Simulation',
  },
  {
    href: '/budget-guardian',
    icon: ShieldCheck,
    label: 'Budget Guardian',
  },
  {
    href: '/carbon-footprint',
    icon: Leaf,
    label: 'Carbon Footprint',
  },
  {
    href: '/msme-dashboard',
    icon: Briefcase,
    label: 'MSME Dashboard',
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="h-16 items-center justify-center p-2 group-data-[collapsible=icon]:justify-center">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-bold text-primary-foreground text-lg"
        >
          <Icons.octopus className="size-8 text-accent" />
          <span className="group-data-[collapsible=icon]:hidden">Octo-Pay</span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  'w-full justify-start gap-2',
                  pathname === item.href &&
                    'bg-sidebar-accent text-sidebar-accent-foreground'
                )}
                asChild
              >
                <Link href={item.href}>
                  <item.icon className="size-5" />
                  <span className="group-data-[collapsible=icon]:hidden">
                    {item.label}
                  </span>
                </Link>
              </Button>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-2">
        <Separator className="my-2 bg-sidebar-border" />
        <div className="flex items-center gap-2 p-2 rounded-md transition-colors">
          <Avatar className="h-9 w-9">
            <AvatarImage
              src="https://picsum.photos/seed/avatar/100/100"
              alt="User Avatar"
            />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-medium text-primary-foreground">
              Demo User
            </span>
            <span className="text-xs text-muted-foreground">
              user@octopay.com
            </span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

export function AppSidebarTrigger() {
  return <SidebarTrigger className="text-foreground" />;
}
