import {
  BarChart3,
  BriefcaseBusiness,
  Building2,
  CalendarClock,
  CheckSquare,
  FileText,
  FolderKanban,
  Home,
  Palette,
  PhoneCall,
  PieChart,
  Users,
} from 'lucide-react';

import { staffWorkspacePath } from '@/lib/portal-routes';
import type { StaffRole } from '@/lib/auth';

export const opsModules = [
  { title: 'Home', href: staffWorkspacePath, icon: Home },
  { title: 'Leads', href: `${staffWorkspacePath}/leads`, icon: BarChart3 },
  { title: 'Accounts', href: `${staffWorkspacePath}/accounts`, icon: Building2 },
  { title: 'Meetings', href: `${staffWorkspacePath}/meetings`, icon: CalendarClock },
  { title: 'Tasks', href: `${staffWorkspacePath}/tasks`, icon: CheckSquare },
  { title: 'Calls', href: `${staffWorkspacePath}/calls`, icon: PhoneCall },
  { title: 'Documents', href: `${staffWorkspacePath}/documents`, icon: FileText },
  { title: 'Projects', href: `${staffWorkspacePath}/projects`, icon: BriefcaseBusiness },
  { title: 'Site Customization', href: `${staffWorkspacePath}/site-customization`, icon: Palette, superAdminOnly: true },
  { title: 'Employees', href: `${staffWorkspacePath}/employees`, icon: Users, superAdminOnly: true },
  { title: 'Pipeline', href: `${staffWorkspacePath}/pipeline`, icon: FolderKanban },
] as const;

export const employeeOpsModules = [
  { title: 'My Dashboard', href: staffWorkspacePath, icon: Home },
  { title: 'My Leads', href: `${staffWorkspacePath}/leads`, icon: BarChart3 },
  { title: 'My Tasks', href: `${staffWorkspacePath}/tasks`, icon: CheckSquare },
  { title: 'My Projects', href: `${staffWorkspacePath}/projects`, icon: BriefcaseBusiness },
  { title: 'My Meetings', href: `${staffWorkspacePath}/meetings`, icon: CalendarClock },
  { title: 'My Calls', href: `${staffWorkspacePath}/calls`, icon: PhoneCall },
  { title: 'Reports', href: `${staffWorkspacePath}/reports`, icon: PieChart },
] as const;

export function getOpsModulesForRole(role: StaffRole) {
  if (role === 'employee') {
    return employeeOpsModules;
  }

  return opsModules;
}

export type OpsModuleTitle = (typeof opsModules)[number]['title'];
