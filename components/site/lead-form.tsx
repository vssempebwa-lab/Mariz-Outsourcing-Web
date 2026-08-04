'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { SERVICE_OPTIONS } from '@/lib/data';
import { supabase } from '@/lib/supabase';

type Status = 'idle' | 'loading' | 'success' | 'error';

export function LeadForm({ compact = false }: { compact?: boolean }) {
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    const formData = new FormData(e.currentTarget);
    const payload = {
      full_name: (formData.get('full_name') as string)?.trim(),
      email: (formData.get('email') as string)?.trim(),
      phone: (formData.get('phone') as string)?.trim() || null,
      company_name: (formData.get('company_name') as string)?.trim() || null,
      service_requested: (formData.get('service_requested') as string) || null,
      message: (formData.get('message') as string)?.trim() || null,
    };

    if (!payload.full_name || !payload.email) {
      setStatus('error');
      setErrorMsg('Please provide your name and email.');
      return;
    }

    const { error } = await supabase.from('leads').insert(payload);

    if (error) {
      setStatus('error');
      setErrorMsg('Something went wrong. Please try again or call us directly.');
      return;
    }

    setStatus('success');
    e.currentTarget.reset();
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12 px-6 rounded-2xl bg-accent/5 border border-accent/20">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 mb-4">
          <CheckCircle2 className="h-7 w-7 text-accent" />
        </div>
        <h3 className="font-display font-bold text-xl text-foreground mb-2">
          Request Received
        </h3>
        <p className="text-sm text-muted-foreground max-w-sm mb-6">
          Thank you for reaching out. Our team will review your request and
          respond within one business day.
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setStatus('idle')}
        >
          Submit Another Request
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="full_name">Full Name *</Label>
          <Input
            id="full_name"
            name="full_name"
            placeholder="Jane Doe"
            required
            disabled={status === 'loading'}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Corporate Email *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="jane@company.com"
            required
            disabled={status === 'loading'}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+256 700 000 000"
            disabled={status === 'loading'}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="company_name">Company Name</Label>
          <Input
            id="company_name"
            name="company_name"
            placeholder="Your company"
            disabled={status === 'loading'}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="service_requested">Service Needed</Label>
        <Select name="service_requested" disabled={status === 'loading'}>
          <SelectTrigger id="service_requested">
            <SelectValue placeholder="Select a service" />
          </SelectTrigger>
          <SelectContent>
            {SERVICE_OPTIONS.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Tell us about your project or operational needs..."
          rows={compact ? 3 : 4}
          disabled={status === 'loading'}
        />
      </div>

      {status === 'error' && (
        <div className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {errorMsg}
        </div>
      )}

      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={status === 'loading'}
      >
        {status === 'loading' ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Submitting...
          </>
        ) : (
          'Submit Request'
        )}
      </Button>
    </form>
  );
}
