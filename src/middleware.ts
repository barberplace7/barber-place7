import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for public routes
  if (pathname === '/' || pathname === '/login' || pathname.startsWith('/api/auth/login') || pathname.startsWith('/api/gallery') || pathname.startsWith('/api/public')) {
    return NextResponse.next();
  }

  // Check for session cookie
  const sessionCookie = request.cookies.get('session');
  
  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    // Verify JWT token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');
    const { payload } = await jwtVerify(sessionCookie.value, secret);
    
    // Check admin routes
    if (pathname.startsWith('/admin')) {
      if (payload.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    }

    // Check kasir routes - branch based access
    if (pathname.startsWith('/kasir')) {
      if (payload.role !== 'KASIR' && payload.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/login', request.url));
      }
      
      // Kasir must have cabangId and selectedKasirId
      if (payload.role === 'KASIR' && (!payload.cabangId || !payload.selectedKasirId)) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    }

    // Check admin API routes
    if (pathname.startsWith('/api/admin')) {
      if (payload.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    // Check kasir API routes - branch restricted
    if (pathname.startsWith('/api/kasir')) {
      if (payload.role !== 'KASIR' && payload.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      
      // Kasir must have completed full login (cabang + kasir selection)
      // Temporarily disabled for debugging
      // if (payload.role === 'KASIR' && (!payload.cabangId || !payload.selectedKasirId)) {
      //   return NextResponse.json({ error: 'Complete login required' }, { status: 401 });
      // }
    }

    return NextResponse.next();
  } catch (error) {
    // Invalid token, redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/admin/:path*', '/kasir/:path*', '/api/admin/:path*', '/api/kasir/:path*']
};