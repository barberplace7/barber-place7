import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prismaClient';

export async function POST(request: NextRequest) {
  try {
    const { staffId, staffRole, staffName, amount, note, cabangId } = await request.json();

    if (!staffId || !staffRole || !staffName || !amount || !cabangId) {
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
        cabangId,
        givenBy: 'admin',
        givenByName: 'Admin'
      }
    });

    return NextResponse.json(advance);
  } catch (error) {
    console.error('Admin advance creation error:', error);
    return NextResponse.json({ error: 'Failed to create advance' }, { status: 500 });
  }
}
