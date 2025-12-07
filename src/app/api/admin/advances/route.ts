import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prismaClient';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const staffId = searchParams.get('staffId');

    const where: any = {};
    if (staffId) {
      where.staffId = staffId;
      where.remainingAmount = { gt: 0 };
    }

    const advances = await prisma.staffAdvance.findMany({
      where,
      include: {
        cabang: { select: { name: true } },
        deductions: { orderBy: { createdAt: 'desc' } }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(advances);
  } catch (error) {
    console.error('Advances fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch advances' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    await prisma.staffAdvance.delete({ where: { id } });

    return NextResponse.json({ message: 'Advance deleted successfully' });
  } catch (error) {
    console.error('Advance deletion error:', error);
    return NextResponse.json({ error: 'Failed to delete advance' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { advanceId, amount, deductedBy, deductedByName } = await request.json();

    if (!advanceId || !amount || !deductedBy || !deductedByName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const advance = await prisma.staffAdvance.findUnique({ where: { id: advanceId } });
    if (!advance) {
      return NextResponse.json({ error: 'Advance not found' }, { status: 404 });
    }

    const deductAmount = parseInt(amount);
    if (deductAmount > advance.remainingAmount) {
      return NextResponse.json({ error: 'Amount exceeds remaining balance' }, { status: 400 });
    }

    await prisma.$transaction([
      prisma.advanceDeduction.create({
        data: { advanceId, amount: deductAmount, deductedBy, deductedByName }
      }),
      prisma.staffAdvance.update({
        where: { id: advanceId },
        data: { remainingAmount: advance.remainingAmount - deductAmount }
      })
    ]);

    return NextResponse.json({ message: 'Deduction successful' });
  } catch (error) {
    console.error('Deduction error:', error);
    return NextResponse.json({ error: 'Failed to deduct advance' }, { status: 500 });
  }
}
