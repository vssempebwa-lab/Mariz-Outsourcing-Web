import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { staffAccessPath, employeeLoginPath, staffBasePath, staffWorkspacePath } from '@/lib/portal-routes';
import { staffAuthEnabled } from '@/lib/staff-auth-mode';

const appStaffAccessPath = '/ops-slate-7f3c';
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

  const isLegacyAdminLogin = pathname === appStaffAccessPath || pathname === staffBasePath;
  const isLegacyEmployeeLogin = pathname === `${appStaffAccessPath}/employee-login` ||
    pathname === `${staffBasePath}/employee-login`;
  if (isLegacyAdminLogin || isLegacyEmployeeLogin) {
    const target = request.nextUrl.clone();
    target.pathname = isLegacyEmployeeLogin ? employeeLoginPath : staffAccessPath;
    return NextResponse.redirect(target);
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

  if (pathname === staffAccessPath) {
    if (token?.role === 'super_admin') {
      return NextResponse.redirect(new URL(staffWorkspacePath, request.url));
    }
    if (!staffAuthEnabled && !token) {
      return NextResponse.redirect(new URL(`${staffWorkspacePath}?preview=super_admin`, request.url));
    }
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

  if (staffBasePath !== appStaffAccessPath) {
    if (pathname.startsWith(`${appStaffAccessPath}/`)) {
      return NextResponse.rewrite(new URL('/404', request.url));
    }

    if (pathname.startsWith(`${staffBasePath}/`)) {
      const target = request.nextUrl.clone();
      target.pathname = pathname.replace(staffBasePath, appStaffAccessPath);
      return NextResponse.rewrite(target);
    }
  }

  const isStaffOAuthVerify = pathname === '/api/staff/oauth-verify';

  if (staffAuthEnabled && pathname.startsWith('/api/staff') && !isStaffOAuthVerify && !token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/:path*'],
};
