import {
  BarChart3,
  BriefcaseBusiness,
  CalendarClock,
  CheckSquare,
  Home,
  Inbox,
  Palette,
  PhoneCall,
  PieChart,
  Settings,
} from 'lucide-react';

import { staffWorkspacePath } from '@/lib/portal-routes';
import type { StaffRole } from '@/lib/auth';

export const opsModules = [
  { title: 'Site Customization', href: `${staffWorkspacePath}/site-customization`, icon: Palette, superAdminOnly: true },
  { title: 'Website Feedback', href: `${staffWorkspacePath}/feedback`, icon: Inbox, superAdminOnly: true },
] as const;

export const employeeOpsModules = [
  { title: 'My Dashboard', href: staffWorkspacePath, icon: Home },
  { title: 'My Leads', href: `${staffWorkspacePath}/leads`, icon: BarChart3 },
  { title: 'My Tasks', href: `${staffWorkspacePath}/tasks`, icon: CheckSquare },
  { title: 'My Projects', href: `${staffWorkspacePath}/projects`, icon: BriefcaseBusiness },
  { title: 'My Meetings', href: `${staffWorkspacePath}/meetings`, icon: CalendarClock },
  { title: 'My Calls', href: `${staffWorkspacePath}/calls`, icon: PhoneCall },
  { title: 'Reports', href: `${staffWorkspacePath}/reports`, icon: PieChart },
  { title: 'Account Settings', href: `${staffWorkspacePath}/settings`, icon: Settings },
] as const;

export function getOpsModulesForRole(role: StaffRole) {
  if (role === 'employee') {
    return employeeOpsModules;
  }

  return opsModules;
}

export type OpsModuleTitle = (typeof opsModules)[number]['title'];
