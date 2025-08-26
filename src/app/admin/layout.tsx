'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    async function checkAdminStatus() {
      try {
        const response = await fetch('/api/check-admin');
        const data = await response.json();
        if (data.isAdmin) {
          setIsAuthorized(true);
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('Failed to check admin status', error);
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    }
    checkAdminStatus();
  }, [router]);
  
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      await fetch('/api/auth/session', { method: 'DELETE' });
      window.location.href = '/login';
    } catch (error) {
      console.error("Error signing out: ", error);
      window.location.href = '/login';
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isAuthorized) {
    return (
      <div className="flex h-screen flex-col bg-secondary/50">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-6">
            <h1 className="text-lg font-semibold font-headline text-primary">GBC Admin</h1>
            <nav className="flex items-center gap-2">
              <Link href="/admin/dashboard" passHref>
                <Button variant={pathname === '/admin/dashboard' ? 'secondary' : 'ghost'} size="sm">
                  Dashboard
                </Button>
              </Link>
              <Link href="/admin/manage-users" passHref>
                <Button variant={pathname === '/admin/manage-users' ? 'secondary' : 'ghost'} size="sm">
                  Manage Users
                </Button>
              </Link>
            </nav>
          </div>
          <Button variant="ghost" size="icon" onClick={handleSignOut} aria-label="Sign Out">
            <LogOut className="h-5 w-5" />
          </Button>
        </header>
        
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    );
  }

  return null;
}