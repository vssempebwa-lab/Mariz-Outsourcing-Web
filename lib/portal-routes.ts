export const staffBasePath =
  process.env.NEXT_PUBLIC_STAFF_ACCESS_PATH || '/ops-slate-7f3c';

export const staffAccessPath = '/admin-login';
export const employeeLoginPath = '/employee-login';
export const staffWorkspacePath = `${staffBasePath}/workspace`;
export const staffOAuthCallbackPath = `${staffBasePath}/oauth-callback`;
export const staffPasswordSetupPath = `${staffBasePath}/setup-password`;

export function isStaffPath(pathname: string) {
  return pathname === staffAccessPath || pathname === employeeLoginPath ||
    pathname === staffBasePath || pathname.startsWith(`${staffBasePath}/`);
}
