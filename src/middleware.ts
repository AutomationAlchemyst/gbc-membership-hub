
import { NextResponse, type NextRequest } from 'next/server';

export const config = {
  matcher: ['/admin/:path*', '/login'],
  runtime: 'edge',
};

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('session');
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/login')) {
    if (sessionCookie) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith('/admin')) {
    if (!sessionCookie) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}
