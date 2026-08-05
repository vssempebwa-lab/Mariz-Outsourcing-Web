'use client';

import { useMemo, useState, type FormEvent } from 'react';
import { CalendarDays, Check, FileBarChart, Send } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { GeneratedReport, ReportModule, ReportPeriod } from '@/lib/ops-reports';

const moduleOptions: Array<{ value: ReportModule; label: string }> = [
  { value: 'calls', label: 'Calls' },
  { value: 'tasks', label: 'Tasks' },
  { value: 'projects', label: 'Projects' },
  { value: 'meetings', label: 'Meetings' },
  { value: 'leads', label: 'Leads' },
];

export function EmployeeReportsClient() {
  const [period, setPeriod] = useState<ReportPeriod>('daily');
  const [selectedModules, setSelectedModules] = useState<ReportModule[]>([
    'calls',
    'tasks',
    'projects',
    'meetings',
    'leads',
  ]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [report, setReport] = useState<GeneratedReport | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const moduleParams = useMemo(() => {
    const params = new URLSearchParams({ period });

    selectedModules.forEach((module) => params.append('module', module));

    if (startDate) {
      params.set('startDate', startDate);
    }

    if (endDate) {
      params.set('endDate', endDate);
    }

    return params;
  }, [endDate, period, selectedModules, startDate]);

  function toggleModule(module: ReportModule) {
    setSelectedModules((current) =>
      current.includes(module)
        ? current.filter((item) => item !== module)
        : [...current, module]
    );
  }

  async function generateReport(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setMessage('');
    setIsGenerating(true);

    const response = await fetch(`/api/staff/reports?${moduleParams.toString()}`);
    const payload = (await response.json()) as { report?: GeneratedReport; error?: string };

    setIsGenerating(false);

    if (!response.ok || !payload.report) {
      setError(payload.error || 'Report could not be generated.');
      return;
    }

    setReport(payload.report);
  }

  async function shareReport() {
    setError('');
    setMessage('');
    setIsSharing(true);

    const response = await fetch('/api/staff/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        period,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        modules: selectedModules,
      }),
    });
    const payload = (await response.json()) as { error?: string; sharedReport?: { id: string } };

    setIsSharing(false);

    if (!response.ok || !payload.sharedReport) {
      setError(payload.error || 'Report could not be shared.');
      return;
    }

    setMessage('Report shared with Super Admin.');
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-muted-foreground">Employee Workspace</p>
        <h1 className="mt-1 font-display text-3xl font-semibold">Reports</h1>
      </div>

      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <form className="rounded-lg border bg-card p-6 shadow-sm" onSubmit={generateReport}>
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
              <FileBarChart className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold">Build Report</h2>
              <p className="text-sm text-muted-foreground">Filter assigned work only.</p>
            </div>
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <Label>Period</Label>
              <Select value={period} onValueChange={(value) => setPeriod(value as ReportPeriod)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <div className="space-y-2">
                <Label htmlFor="report-start">Start Date</Label>
                <Input
                  id="report-start"
                  type="date"
                  value={startDate}
                  onChange={(event) => setStartDate(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="report-end">End Date</Label>
                <Input
                  id="report-end"
                  type="date"
                  value={endDate}
                  onChange={(event) => setEndDate(event.target.value)}
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label>Modules</Label>
              <div className="grid gap-3">
                {moduleOptions.map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center gap-3 rounded-md border px-3 py-2 text-sm"
                  >
                    <Checkbox
                      checked={selectedModules.includes(option.value)}
                      onCheckedChange={() => toggleModule(option.value)}
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </div>

            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            {message ? <p className="text-sm text-accent">{message}</p> : null}

            <Button type="submit" className="w-full" disabled={isGenerating || !selectedModules.length}>
              <CalendarDays className="mr-2 h-4 w-4" />
              {isGenerating ? 'Generating...' : 'Generate Report'}
            </Button>
          </div>
        </form>

        <section className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="flex flex-col gap-3 border-b pb-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="font-display text-xl font-semibold">
                {report ? report.title : 'Report Preview'}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {report
                  ? `${report.startDate} to ${report.endDate}`
                  : 'Generate a report to preview assigned activity.'}
              </p>
            </div>
            <Button type="button" variant="outline" disabled={!report || isSharing} onClick={shareReport}>
              <Send className="mr-2 h-4 w-4" />
              {isSharing ? 'Sharing...' : 'Share'}
            </Button>
          </div>

          {report ? (
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {report.modules.map((item) => (
                <article key={item.module} className="rounded-md border p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">{item.label}</p>
                      <p className="mt-1 font-display text-3xl font-semibold">{item.count}</p>
                    </div>
                    <Check className="h-5 w-5 text-accent" />
                  </div>
                  <div className="mt-4 space-y-2">
                    {Object.entries(item.statusBreakdown).length ? (
                      Object.entries(item.statusBreakdown).map(([status, count]) => (
                        <div key={status} className="flex items-center justify-between text-sm">
                          <span className="capitalize text-muted-foreground">
                            {status.replaceAll('_', ' ')}
                          </span>
                          <span className="font-medium">{count}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No activity in this range.</p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-md border border-dashed p-8 text-sm text-muted-foreground">
              Choose a period, date range, and modules to generate an employee report.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
