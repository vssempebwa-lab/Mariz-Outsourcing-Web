import {
  BarChart3,
  BriefcaseBusiness,
  Building2,
  CalendarClock,
  FileText,
  Flag,
  FolderKanban,
  Home,
  PhoneCall,
  Users,
} from 'lucide-react';

import { staffWorkspacePath } from '@/lib/portal-routes';

export const opsModules = [
  { title: 'Home', href: staffWorkspacePath, icon: Home },
  { title: 'Leads', href: `${staffWorkspacePath}/leads`, icon: BarChart3 },
  { title: 'Accounts', href: `${staffWorkspacePath}/accounts`, icon: Building2 },
  { title: 'Meetings', href: `${staffWorkspacePath}/meetings`, icon: CalendarClock },
  { title: 'Calls', href: `${staffWorkspacePath}/calls`, icon: PhoneCall },
  { title: 'Documents', href: `${staffWorkspacePath}/documents`, icon: FileText },
  { title: 'Visits', href: `${staffWorkspacePath}/visits`, icon: Flag },
  { title: 'Projects', href: `${staffWorkspacePath}/projects`, icon: BriefcaseBusiness },
  { title: 'Employees', href: `${staffWorkspacePath}/employees`, icon: Users, superAdminOnly: true },
  { title: 'Pipeline', href: `${staffWorkspacePath}/pipeline`, icon: FolderKanban },
] as const;

export type OpsModuleTitle = (typeof opsModules)[number]['title'];
