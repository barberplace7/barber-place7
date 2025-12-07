import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prismaClient';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const staffId = searchParams.get('staffId');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');

    if (!staffId) {
      return NextResponse.json({ error: 'Staff ID required' }, { status: 400 });
    }

    const startDate = dateFrom ? new Date(dateFrom + 'T00:00:00.000Z') : undefined;
    const endDate = dateTo ? new Date(dateTo + 'T23:59:59.999Z') : undefined;

    const deductions = await prisma.advanceDeduction.findMany({
      where: {
        advance: {
          staffId
        },
        ...(startDate && endDate && {
          createdAt: {
            gte: startDate,
            lte: endDate
          }
        })
      },
      include: {
        advance: {
          select: {
            staffName: true,
            amount: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(deductions);
  } catch (error) {
    console.error('Deductions fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch deductions' }, { status: 500 });
  }
}
