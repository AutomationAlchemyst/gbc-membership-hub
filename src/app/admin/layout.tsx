'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Loader2, LogOut, Users } from 'lucide-react';
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
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

  // This useEffect hook correctly protects all admin routes
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
  
  // The new sign-out function, which signs out of both client and server
  const handleSignOut = async () => {
    try {
      await signOut(auth); // Sign out of client-side Firebase
      await fetch('/api/auth/session', { method: 'DELETE' }); // Destroy server session
      window.location.href = '/login'; // Redirect with a full page refresh
    } catch (error) {
      console.error("Error signing out: ", error);
      window.location.href = '/login'; // Redirect even if there's an error
    }
  };

  // Renders a loading spinner while checking authorization
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If authorized, render the full admin layout with sidebar and header
  if (isAuthorized) {
    return (
      <SidebarProvider>
        <div className="flex h-screen bg-secondary/50">
          <Sidebar>
            <SidebarHeader>{/* Sidebar Header */}</SidebarHeader>
            <SidebarContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <Link href="/admin/dashboard">
                    <SidebarMenuButton isActive={pathname === '/admin/dashboard'}>
                      <LayoutDashboard />
                      Dashboard
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <Link href="/admin/manage-users">
                    <SidebarMenuButton isActive={pathname === '/admin/manage-users'}>
                      <Users />
                      Manage Users
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
          </Sidebar>
          
          {/* This div contains the main content area, including the header */}
          <div className="flex flex-1 flex-col overflow-auto">
            <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur sm:px-6">
              <h1 className="text-xl font-semibold font-headline text-primary">GBC Admin Dashboard</h1>
              <Button variant="ghost" size="icon" onClick={handleSignOut} aria-label="Sign Out">
                <LogOut className="h-5 w-5" />
              </Button>
            </header>
            
            {/* The page content ({children}) is now rendered inside this main tag */}
            <main className="flex-1 p-4 sm:p-6 lg:p-8">
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  // Render nothing if not authorized, as the redirect is in progress
  return null;
}