'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bot,
  Briefcase,
  CreditCard,
  Ghost,
  LayoutDashboard,
  Leaf,
  LogOut,
  PanelLeft,
  Settings,
  ShieldCheck,
  Zap,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const menuItems = [
  {
    href: '/dashboard',
    icon: LayoutDashboard,
    label: 'Dashboard',
  },
  {
    href: '/payment-simulation',
    icon: Zap,
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
    href: '/assistant',
    icon: Bot,
    label: 'AI Assistant',
  },
  {
    href: '/msme-dashboard',
    icon: Briefcase,
    label: 'MSME Dashboard',
  },
  {
    href: '/ghost-commerce',
    icon: Ghost,
    label: 'Ghost Commerce',
  },
  {
    href: '/settings',
    icon: Settings,
    label: 'Settings',
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border/50">
      <SidebarHeader className="h-16 items-center justify-center p-2 group-data-[collapsible=icon]:justify-center">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-bold text-primary-foreground text-lg"
        >
          <Icons.octopus className="size-9 text-accent" />
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
                  'w-full justify-start gap-3 rounded-full',
                  pathname === item.href &&
                    'bg-sidebar-accent text-sidebar-accent-foreground',
                  'group-data-[collapsible=icon]:rounded-full group-data-[collapsible=icon]:justify-center'
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
        <Separator className="my-2 bg-sidebar-border/50" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-3 p-2 rounded-full transition-colors hover:bg-sidebar-accent cursor-pointer">
              <Avatar className="h-9 w-9">
                <AvatarImage
                  src="https://picsum.photos/seed/avatar/100/100"
                  alt="User Avatar"
                />
                <AvatarFallback>DU</AvatarFallback>
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
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="start">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem disabled>Billing</DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/login" className='w-full'>
                <div className='flex items-center gap-2'>
                <LogOut className="size-4" />
                <span>Sign Out</span>
                </div>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export function AppSidebarTrigger() {
  return <SidebarTrigger className="text-foreground" />;
}
