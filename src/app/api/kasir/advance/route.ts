import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prismaClient';
import { requireAuth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth('KASIR');
    const { staffId, staffRole, staffName, amount, note } = await request.json();

    if (!staffId || !staffRole || !staffName || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const advance = await prisma.staffAdvance.create({
      data: {
        staffId,
        staffRole,
        staffName,
        amount: parseInt(amount),
        remainingAmount: parseInt(amount),
        note: note || null,
        cabangId: session.cabangId!,
        givenBy: session.userId,
        givenByName: session.username
      }
    });

    return NextResponse.json(advance);
  } catch (error) {
    console.error('Advance creation error:', error);
    return NextResponse.json({ error: 'Failed to create advance' }, { status: 500 });
  }
}
