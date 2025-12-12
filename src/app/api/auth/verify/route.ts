import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('session');
    
    if (!sessionCookie) {
      return NextResponse.json({ error: 'No session found' }, { status: 401 });
    }
    
    // Verify JWT token with jose
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(sessionCookie.value, secret);
    
    // Return user data (without sensitive info)
    return NextResponse.json({
      id: payload.userId,
      role: payload.role,
      username: payload.username,
      cabangId: payload.cabangId,
      cabangName: payload.cabangName,
      kasirId: payload.selectedKasirId,
      kasirName: payload.kasirName
    });
    
  } catch (error) {
    return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
  }
}