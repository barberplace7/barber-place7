import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prismaClient';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    await requireAuth('KASIR');
    
    const kasir = await prisma.cashierMaster.findMany({
      select: {
        id: true,
        name: true,
        phone: true
      },
      orderBy: { name: 'asc' }
    });

    return NextResponse.json(kasir);
  } catch (error) {
    return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
  }
}