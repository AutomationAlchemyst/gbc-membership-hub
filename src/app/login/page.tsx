
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
        toast({
            variant: "destructive",
            title: "Login Failed",
            description: "Please enter both email and password.",
        });
        return;
    }
    
    setLoading(true);

    try {
      // 1. Sign in with Firebase on the client
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();

      // 2. Send the ID token to our secure API route to create the session
      const response = await fetch('/api/auth/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });

      // 3. Handle the API response
      if (response.ok) {
        // 4. On success, redirect to the dashboard
        window.location.href = '/admin/dashboard';
      } else {
         const errorData = await response.json();
         toast({
            variant: "destructive",
            title: "Login Failed",
            description: errorData.error || "You are not authorized to access this page.",
        });
        setLoading(false);
      }
    } catch (err: any) {
      console.error("Login Error:", err);
      const errorMessage = err.code === 'auth/invalid-credential' 
        ? "Invalid email or password. Please try again."
        : "An unexpected error occurred. Please try again.";
      
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: errorMessage,
      });
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
       <Card className="w-full max-w-sm shadow-2xl bg-card/80 backdrop-blur-sm">
        <form onSubmit={handleLogin}>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-headline">Admin Login</CardTitle>
            <CardDescription>Enter your credentials to access the dashboard.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="admin@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Login
            </Button>
            <Link href="/" passHref>
              <Button variant="link" className="mt-4 text-xs text-muted-foreground">
                &larr; Back to registration form
              </Button>
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
