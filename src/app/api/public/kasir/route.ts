import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prismaClient';

export async function GET() {
  try {
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
    return NextResponse.json({ error: 'Failed to fetch kasir' }, { status: 500 });
  }
}