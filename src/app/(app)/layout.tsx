'use client';

import { AppShell } from '@/components/app-shell';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Icons } from '@/components/icons';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
        <div className="flex h-screen w-screen flex-col items-center justify-center bg-background text-foreground">
            <Icons.logo className="h-12 w-12 text-primary animate-pulse" />
            <p className="mt-4 text-lg">Loading your experience...</p>
        </div>
    )
  }
  
  return <AppShell>{children}</AppShell>;
}
