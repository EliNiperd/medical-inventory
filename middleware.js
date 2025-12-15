import { auth } from './auth';
import { NextResponse } from 'next/server';

export default async function middleware(req) {
  const session = await auth();

  const isLoggedIn = !!session?.user;
  const isDashboard = req.nextUrl.pathname.startsWith('/dashboard');

  if (isDashboard && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api/auth|api|_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
};
