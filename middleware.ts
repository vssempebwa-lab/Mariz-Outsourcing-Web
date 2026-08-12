import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { staffAuthEnabled } from '@/lib/staff-auth-mode';

const appStaffAccessPath = '/ops-slate-7f3c';
const appStaffWorkspacePath = `${appStaffAccessPath}/workspace`;
const staffAccessPath =
  process.env.NEXT_PUBLIC_STAFF_ACCESS_PATH || appStaffAccessPath;
const staffWorkspacePath = `${staffAccessPath}/workspace`;
const employeeRestrictedPaths = [
  'accounts',
  'documents',
  'employees',
  'pipeline',
  'site-customization',
];

function isStaticAsset(pathname: string) {
  return (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const previewRole = request.nextUrl.searchParams.get('preview');

  if (isStaticAsset(pathname)) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const employeeEnteredAdminModule =
    token?.role === 'employee' &&
    employeeRestrictedPaths.some((segment) =>
      pathname.startsWith(`${staffWorkspacePath}/${segment}`)
    );

  if (employeeEnteredAdminModule) {
    return NextResponse.redirect(new URL(staffWorkspacePath, request.url));
  }

  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    return NextResponse.rewrite(new URL('/404', request.url));
  }

  if (pathname === staffAccessPath && (!staffAuthEnabled || token)) {
    return NextResponse.redirect(new URL(staffWorkspacePath, request.url));
  }

  if (
    !staffAuthEnabled &&
    pathname.startsWith(staffWorkspacePath) &&
    (previewRole === 'employee' || previewRole === 'super_admin')
  ) {
    const target = request.nextUrl.clone();
    target.searchParams.delete('preview');
    const response = NextResponse.redirect(target);
    response.cookies.set('moa_staff_preview_role', previewRole, {
      httpOnly: true,
      sameSite: 'lax',
      path: staffWorkspacePath,
    });
    return response;
  }

  if (staffAuthEnabled && pathname.startsWith(staffWorkspacePath) && !token) {
    return NextResponse.redirect(new URL(staffAccessPath, request.url));
  }

  if (staffAccessPath !== appStaffAccessPath) {
    if (pathname === appStaffAccessPath || pathname.startsWith(appStaffWorkspacePath)) {
      return NextResponse.rewrite(new URL('/404', request.url));
    }

    if (pathname === staffAccessPath || pathname.startsWith(staffWorkspacePath)) {
      const target = request.nextUrl.clone();
      target.pathname = pathname.replace(staffAccessPath, appStaffAccessPath);
      return NextResponse.rewrite(target);
    }
  }

  if (staffAuthEnabled && pathname.startsWith('/api/staff') && !token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/:path*'],
};
