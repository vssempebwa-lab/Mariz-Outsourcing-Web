import { Construction } from 'lucide-react';

export function ModulePlaceholder({ title }: { title: string }) {
  return (
    <div className="rounded-lg border bg-card p-8 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Construction className="h-5 w-5" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-semibold">{title}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            This module is wired into the dashboard navigation and database model. Build it using the
            same table, modal, API, and role-filtering pattern used by Leads.
          </p>
        </div>
      </div>
    </div>
  );
}
