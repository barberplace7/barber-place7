import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { prisma } from '@/lib/prismaClient';

export async function POST(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('session');
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { payload } = await jwtVerify(
      sessionCookie.value,
      new TextEncoder().encode(process.env.JWT_SECRET!)
    );

    const { visitId } = await request.json();

    await prisma.$transaction(async (tx) => {
      // Delete service transaction first if it exists
      await tx.serviceTransaction.deleteMany({
        where: { visitId }
      });
      
      // Then delete the customer visit
      await tx.customerVisit.delete({
        where: { id: visitId }
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Cancel error:', error);
    return NextResponse.json({ error: 'Failed to cancel' }, { status: 500 });
  }
}