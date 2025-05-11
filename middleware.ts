import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/jwt';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get('admin-token')?.value;
  const adminCodeVerified = request.cookies.get('admin-code-verified')?.value;

  // Allow access to admin code verification page
  if (path === '/admin') {
    if (token) {
      const isValid = await verifyToken(token);
      if (isValid) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
    }
    return NextResponse.next();
  }

  // Protect login page - only accessible after code verification
  if (path === '/admin/login') {
    if (!adminCodeVerified) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    if (token) {
      const isValid = await verifyToken(token);
      if (isValid) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
    }
    return NextResponse.next();
  }

  // Protect all other admin routes
  if (path.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }

    const isValid = await verifyToken(token);
    if (!isValid) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*'
  ]
}; 