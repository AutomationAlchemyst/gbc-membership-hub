import { RegistrationForm } from '@/components/RegistrationForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { LogIn } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex min-h-dvh w-full items-center justify-center bg-background p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-4xl">
        <Card className="bg-card/80 backdrop-blur-sm border-2 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-headline md:text-4xl text-primary">The Growing Business Circle</CardTitle>
            <CardDescription className="text-lg pt-2">Membership Registration</CardDescription>
          </CardHeader>
          <CardContent>
            <RegistrationForm />
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button asChild variant="ghost">
                <Link href="/login">
                    Admin Login
                    <LogIn className="ml-2 h-4 w-4" />
                </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
