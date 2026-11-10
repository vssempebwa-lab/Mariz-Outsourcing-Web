'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  AlertCircle,
  CheckCircle2,
  Inbox,
  Mail,
  Phone,
  RefreshCw,
  Search,
  Trash2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

export type WebsiteFeedback = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  company_name: string | null;
  service_requested: string | null;
  message: string | null;
  status: string;
  source: string | null;
  created_at: string;
};

const STATUS_OPTIONS = ['NEW', 'CONTACTED', 'QUALIFIED', 'CLOSED'] as const;
type FeedbackStatus = (typeof STATUS_OPTIONS)[number];

const statusStyles: Record<FeedbackStatus, string> = {
  NEW: 'border-amber-200 bg-amber-100 text-amber-800',
  CONTACTED: 'border-sky-200 bg-sky-100 text-sky-800',
  QUALIFIED: 'border-emerald-200 bg-emerald-100 text-emerald-800',
  CLOSED: 'border-border bg-muted text-muted-foreground',
};

function normalizeStatus(status: string): FeedbackStatus {
  const upper = status.trim().toUpperCase();
  return STATUS_OPTIONS.includes(upper as FeedbackStatus) ? (upper as FeedbackStatus) : 'NEW';
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Africa/Kampala',
  }).format(new Date(value));
}

export function FeedbackInbox({ initialFeedback }: { initialFeedback: WebsiteFeedback[] }) {
  const router = useRouter();
  const [feedback, setFeedback] = useState(initialFeedback);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | FeedbackStatus>('ALL');
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setFeedback(initialFeedback);
  }, [initialFeedback]);

  const counts = useMemo(() => {
    return feedback.reduce(
      (acc, item) => {
        acc.total += 1;
        acc[normalizeStatus(item.status)] += 1;
        return acc;
      },
      { total: 0, NEW: 0, CONTACTED: 0, QUALIFIED: 0, CLOSED: 0 }
    );
  }, [feedback]);

  const visibleFeedback = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return feedback.filter((item) => {
      if (statusFilter !== 'ALL' && normalizeStatus(item.status) !== statusFilter) {
        return false;
      }

      if (!needle) {
        return true;
      }

      return [item.full_name, item.email, item.company_name, item.service_requested, item.message]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(needle));
    });
  }, [feedback, query, statusFilter]);

  async function updateStatus(id: string, status: FeedbackStatus) {
    setPendingId(id);
    setError('');

    const response = await fetch('/api/staff/feedback', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      setError(payload?.error || 'Could not update this feedback. Please try again.');
      setPendingId(null);
      return;
    }

    setFeedback((current) =>
      current.map((item) => (item.id === id ? { ...item, status } : item))
    );
    setPendingId(null);
  }

  async function deleteFeedback(id: string) {
    if (!window.confirm('Delete this feedback permanently?')) {
      return;
    }

    setPendingId(id);
    setError('');

    const response = await fetch(`/api/staff/feedback?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      setError(payload?.error || 'Could not delete this feedback. Please try again.');
      setPendingId(null);
      return;
    }

    setFeedback((current) => current.filter((item) => item.id !== id));
    setPendingId(null);
  }

  function refresh() {
    setRefreshing(true);
    router.refresh();
    window.setTimeout(() => setRefreshing(false), 800);
  }

  const filterOptions: Array<{ value: 'ALL' | FeedbackStatus; label: string; count: number }> = [
    { value: 'ALL', label: 'All', count: counts.total },
    ...STATUS_OPTIONS.map((status) => ({
      value: status,
      label: status.charAt(0) + status.slice(1).toLowerCase(),
      count: counts[status],
    })),
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Website</p>
          <h1 className="mt-1 font-display text-3xl font-semibold">Feedback Inbox</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Every enquiry and message submitted through the website contact and
            consultation forms.
          </p>
        </div>
        <Button variant="outline" onClick={refresh} disabled={refreshing}>
          <RefreshCw className={cn('mr-2 h-4 w-4', refreshing && 'animate-spin')} />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'New', value: counts.NEW },
          { label: 'Contacted', value: counts.CONTACTED },
          { label: 'Qualified', value: counts.QUALIFIED },
          { label: 'Closed', value: counts.CLOSED },
        ].map((stat) => (
          <div key={stat.label} className="rounded-lg border bg-card p-5 shadow-sm">
            <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
            <p className="mt-2 font-display text-3xl font-semibold">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-md">
          <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name, email, company, or message..."
            className="pl-9"
            aria-label="Search feedback"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setStatusFilter(option.value)}
              className={cn(
                'inline-flex h-9 items-center gap-1.5 rounded-md border px-3 text-sm font-medium transition-colors',
                statusFilter === option.value
                  ? 'border-primary/30 bg-primary/10 text-navy'
                  : 'border-border text-muted-foreground hover:bg-muted'
              )}
            >
              {option.label}
              <span className="text-xs text-muted-foreground">{option.count}</span>
            </button>
          ))}
        </div>
      </div>

      {error ? (
        <div className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      ) : null}

      {visibleFeedback.length ? (
        <div className="space-y-3">
          {visibleFeedback.map((item) => {
            const status = normalizeStatus(item.status);
            const isPending = pendingId === item.id;

            return (
              <Card key={item.id} className="border-border">
                <CardContent className="p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-display text-lg font-semibold text-foreground">
                          {item.full_name}
                        </h2>
                        <span
                          className={cn(
                            'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold',
                            statusStyles[status]
                          )}
                        >
                          {status.charAt(0) + status.slice(1).toLowerCase()}
                        </span>
                        {item.company_name ? (
                          <span className="text-sm text-muted-foreground">
                            {item.company_name}
                          </span>
                        ) : null}
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        <a
                          href={`mailto:${item.email}`}
                          className="inline-flex items-center gap-1.5 hover:text-primary"
                        >
                          <Mail className="h-3.5 w-3.5" />
                          {item.email}
                        </a>
                        {item.phone ? (
                          <a
                            href={`tel:${item.phone.replace(/\s+/g, '')}`}
                            className="inline-flex items-center gap-1.5 hover:text-primary"
                          >
                            <Phone className="h-3.5 w-3.5" />
                            {item.phone}
                          </a>
                        ) : null}
                        {item.service_requested ? (
                          <span className="inline-flex items-center rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-navy">
                            {item.service_requested}
                          </span>
                        ) : null}
                        <span className="text-xs">{formatDate(item.created_at)}</span>
                      </div>

                      {item.message ? (
                        <p className="mt-3 rounded-md border bg-muted/40 px-3 py-2.5 text-sm leading-relaxed text-foreground/80">
                          {item.message}
                        </p>
                      ) : (
                        <p className="mt-3 text-sm italic text-muted-foreground">
                          No message provided.
                        </p>
                      )}
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <Select
                        value={status}
                        onValueChange={(value) => updateStatus(item.id, value as FeedbackStatus)}
                        disabled={isPending}
                      >
                        <SelectTrigger className="h-9 w-[140px]" aria-label="Feedback status">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUS_OPTIONS.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option.charAt(0) + option.slice(1).toLowerCase()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => deleteFeedback(item.id)}
                        disabled={isPending}
                        aria-label={`Delete feedback from ${item.full_name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed bg-card p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            {feedback.length ? (
              <Search className="h-6 w-6" />
            ) : (
              <Inbox className="h-6 w-6" />
            )}
          </div>
          <h2 className="mt-4 font-display text-lg font-semibold">
            {feedback.length ? 'No matching feedback' : 'No feedback yet'}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            {feedback.length
              ? 'Try a different search term or status filter.'
              : 'Messages submitted through the website contact and consultation forms will appear here.'}
          </p>
          {!feedback.length ? (
            <p className="mt-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
              The inbox refreshes automatically when the page is reloaded.
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}
