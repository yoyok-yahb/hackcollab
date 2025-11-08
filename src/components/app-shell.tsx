'use client';

import * as React from 'react';
import Link, { type LinkProps } from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Briefcase,
  Home,
  LogOut,
  Menu,
  MessageCircle,
  Settings,
  Sparkles,
  User as UserIcon,
  Users,
} from 'lucide-react';

import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Icons } from './icons';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { getCurrentUser } from '@/lib/data';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { useAuth } from '@/hooks/use-auth';

const navItems = [
  { href: '/discover', icon: Sparkles, label: 'Discover' },
  { href: '/matches', icon: Users, label: 'Matches' },
  { href: '/messages', icon: MessageCircle, label: 'Messages' },
  { href: '/openings', icon: Briefcase, label: 'Openings' },
  { href: '/profile', icon: UserIcon, label: 'Profile' },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const { logout } = useAuth();
  const router = useRouter();
  const currentUser = getCurrentUser();

  const handleLogout = () => {
    logout();
    router.push('/login');
  }

  if (isMobile) {
    return (
      <div className="flex h-full flex-col">
        <header className="flex h-14 items-center justify-between border-b bg-background px-4">
          <Link href="/discover" className="flex items-center gap-2 font-bold">
            <Icons.logo className="h-6 w-6 text-primary" />
            <span className="sr-only">Hackathon TeamUp</span>
          </Link>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-60 p-4">
              <nav className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground',
                      pathname === item.href && 'bg-accent text-accent-foreground'
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </header>
        <main className="flex-1 overflow-y-auto">{children}</main>
        <footer className="sticky bottom-0 z-10 border-t bg-background">
          <nav className="grid grid-cols-5 items-center justify-items-center px-2 py-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center gap-1 rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent',
                  pathname === item.href ? 'text-primary' : 'hover:text-accent-foreground'
                )}
              >
                <item.icon className="h-6 w-6" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>
        </footer>
      </div>
    );
  }

  return (
    <div className="grid min-h-screen w-full grid-cols-[auto_1fr]">
      <aside className="flex h-full flex-col border-r bg-background">
        <div className="flex h-14 items-center justify-center border-b px-4">
          <Link href="/discover" className="flex items-center gap-2 font-bold">
            <Icons.logo className="h-6 w-6 text-primary" />
            <span className="sr-only">Hackathon TeamUp</span>
          </Link>
        </div>
        <TooltipProvider delayDuration={0}>
          <nav className="flex flex-col items-center gap-4 px-2 py-4">
            {navItems.map((item) => (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-9 md:w-9',
                      pathname === item.href ? 'bg-accent text-accent-foreground' : ''
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="sr-only">{item.label}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            ))}
          </nav>
        </TooltipProvider>
      </aside>
      <div className="flex flex-col">
        <header className="flex h-14 items-center justify-between gap-4 border-b bg-background px-4 lg:px-6">
            <h1 className="text-xl font-semibold capitalize">{pathname.substring(1) || 'Discover'}</h1>
            <AlertDialog>
              <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-full">
                          <Avatar className="h-8 w-8">
                              <AvatarImage src={currentUser.image.imageUrl} alt={currentUser.name} />
                              <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                      </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/profile">Profile</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/settings">Settings</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <AlertDialogTrigger asChild>
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                              <LogOut className="mr-2 h-4 w-4" />
                              Logout
                          </DropdownMenuItem>
                      </AlertDialogTrigger>
                  </DropdownMenuContent>
              </DropdownMenu>
              <AlertDialogContent>
                  <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
                      <AlertDialogDescription>
                          You will be returned to the login screen.
                      </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleLogout}>Log Out</AlertDialogAction>
                  </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
        </header>
        <main className="flex-1 overflow-auto bg-muted/40">{children}</main>
      </div>
    </div>
  );
}
