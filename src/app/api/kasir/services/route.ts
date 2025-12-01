import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prismaClient';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    await requireAuth('KASIR');
    
    const services = await prisma.servicePackage.findMany({
      select: {
        id: true,
        name: true,
        category: true,
        basePrice: true,
        commissionRate: true
      },
      orderBy: { basePrice: 'asc' }
    });

    return NextResponse.json(services);
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}