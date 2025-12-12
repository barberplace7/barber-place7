import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Protected routes
  const protectedRoutes = ['/admin', '/kasir'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  
  if (!isProtectedRoute) {
    return NextResponse.next();
  }
  
  // Get session cookie
  const sessionCookie = request.cookies.get('session');
  
  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  try {
    // Verify JWT token with jose
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(sessionCookie.value, secret);
    
    // Check route permissions
    if (pathname.startsWith('/admin') && payload.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    if (pathname.startsWith('/kasir') && payload.role !== 'KASIR') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    return NextResponse.next();
  } catch (error) {
    // Invalid token - redirect to login
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('session');
    return response;
  }
}

export const config = {
  matcher: ['/admin/:path*', '/kasir/:path*']
};