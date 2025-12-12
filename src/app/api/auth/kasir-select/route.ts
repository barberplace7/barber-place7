import { NextRequest, NextResponse } from 'next/server';
import { SignJWT } from 'jose';

export async function POST(request: NextRequest) {
  try {
    const { kasirId, branchData } = await request.json();

    if (!kasirId || !branchData) {
      return NextResponse.json({ error: 'Kasir ID and branch data required' }, { status: 400 });
    }

    // Create new JWT token with kasir info
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');
    const token = await new SignJWT({
      userId: branchData.user.id,
      username: branchData.user.username,
      role: branchData.user.role,
      cabangId: branchData.user.cabangId,
      selectedKasirId: kasirId
    })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('12h')
    .sign(secret);

    const response = NextResponse.json({ 
      success: true,
      message: 'Kasir selected successfully'
    });

    // Update session cookie with kasir info
    response.cookies.set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 12 // 12 hours
    });

    return response;
  } catch (error) {
    console.error('Kasir selection error:', error);
    return NextResponse.json({ error: 'Failed to select kasir' }, { status: 500 });
  }
}