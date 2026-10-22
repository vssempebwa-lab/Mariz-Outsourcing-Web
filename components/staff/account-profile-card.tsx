import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { CurrentStaff } from '@/lib/staff-session';
import { staffWorkspacePath } from '@/lib/portal-routes';

export function AccountProfileCard({ staff }: { staff: CurrentStaff }) {
  const isAdmin = staff.role === 'super_admin';
  const details = isAdmin
    ? [
        ['Email', staff.email],
        ['Phone', staff.phone],
        ['Access role', 'Administrator'],
        ['Account status', staff.status],
      ]
    : [
        ['Email', staff.email],
        ['Phone', staff.phone],
        ['Employee ID', staff.employee_id],
        ['Department', staff.business_role],
        ['Employment date', staff.employment_date],
        ['Account status', staff.status],
      ];

  return (
    <section className="min-w-0 rounded-lg border bg-card p-4 sm:p-6 shadow-sm" aria-label={isAdmin ? 'My admin profile' : 'My employee profile'}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex min-w-0 max-w-full items-center gap-3 sm:gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={staff.profile_photo_url || undefined} alt="" className="object-cover" />
            <AvatarFallback>{staff.name.slice(0, 1).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-sm text-muted-foreground">My Profile</p>
            <h2 className="break-words font-display text-xl font-semibold">{staff.name}</h2>
          </div>
        </div>
        <Link href={`${staffWorkspacePath}/settings`} className="inline-flex min-h-11 w-full items-center justify-center rounded-md border px-4 py-2 sm:w-auto text-sm font-medium hover:bg-muted">
          Account Settings
        </Link>
      </div>
      <dl className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {details.map(([label, value]) => (
          <div key={label} className="min-w-0">
            <dt className="text-xs text-muted-foreground">{label}</dt>
            <dd className="mt-1 [overflow-wrap:anywhere] text-sm">{value || 'Not provided'}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
