import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prismaClient';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    await requireAuth('KASIR');
    
    const products = await prisma.barberProduct.findMany({
      select: {
        id: true,
        name: true,
        basePrice: true,
        commissionPerUnit: true
      },
      orderBy: { name: 'asc' }
    });

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
  }
}