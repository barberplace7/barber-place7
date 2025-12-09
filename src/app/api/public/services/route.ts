import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prismaClient';

export async function GET() {
  try {
    const services = await prisma.servicePackage.findMany({
      select: {
        id: true,
        name: true,
        category: true,
        basePrice: true,
        commissionAmount: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(services);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}