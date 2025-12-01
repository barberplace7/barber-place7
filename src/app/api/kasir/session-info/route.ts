import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { prisma } from '@/lib/prismaClient';

export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('session');
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { payload } = await jwtVerify(
      sessionCookie.value,
      new TextEncoder().encode(process.env.JWT_SECRET!)
    );

    // Get branch info
    const branch = await prisma.barberBranch.findUnique({
      where: { id: payload.cabangId as string }
    });

    // Get kasir info
    const kasir = await prisma.cashierMaster.findUnique({
      where: { id: payload.selectedKasirId as string }
    });

    return NextResponse.json({
      branchName: branch?.name || 'Unknown Branch',
      kasirName: kasir?.name || 'Unknown Kasir'
    });
  } catch (error) {
    console.error('Session info error:', error);
    return NextResponse.json({ error: 'Failed to get session info' }, { status: 500 });
  }
}