import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Lock, ArrowLeft, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Admin Login',
  description: 'Internal portal login for Mariz Outsourcing Agency staff.',
};

export default function AdminPage() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-b from-primary/5 to-background py-20">
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="container relative mx-auto max-w-md px-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Website
        </Link>

        <Card className="border-border shadow-xl">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground mb-4">
              <Lock className="h-7 w-7" />
            </div>
            <CardTitle className="font-display text-2xl">MOA Portal Login</CardTitle>
            <CardDescription>
              Sign in to access the internal management dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@moa.co.ug" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="••••••••" />
              </div>
              <Button type="submit" className="w-full" size="lg">
                Sign In
              </Button>
            </form>
            <div className="mt-6 pt-6 border-t border-border flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-accent" />
              Protected by role-based access control
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
