import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const statusStyles: Record<string, string> = {
  new: 'border-sky-200 bg-sky-50 text-sky-700',
  contacted: 'border-indigo-200 bg-indigo-50 text-indigo-700',
  qualified: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  negotiation: 'border-amber-200 bg-amber-50 text-amber-700',
  won: 'border-green-200 bg-green-50 text-green-700',
  lost: 'border-rose-200 bg-rose-50 text-rose-700',
  pending: 'border-amber-200 bg-amber-50 text-amber-700',
  completed: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  active: 'border-emerald-200 bg-emerald-50 text-emerald-700',
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge
      variant="outline"
      className={cn('rounded-md capitalize', statusStyles[status] || 'bg-muted text-muted-foreground')}
    >
      {status.replace('_', ' ')}
    </Badge>
  );
}
