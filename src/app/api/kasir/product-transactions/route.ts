import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth('KASIR');

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const productTransactions = await prisma.productTransaction.findMany({
      where: {
        cabangId: session.cabangId,
        createdAt: {
          gte: today,
          lt: tomorrow
        }
      },
      include: {
        product: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(productTransactions);
  } catch (error) {
    console.error('Product transactions error:', error);
    return NextResponse.json({ error: 'Failed to fetch product transactions' }, { status: 500 });
  }
}