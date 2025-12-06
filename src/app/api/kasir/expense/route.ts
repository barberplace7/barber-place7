import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prismaClient';
import { requireAuth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth('KASIR');
    const { nominal, category, note, kasirId } = await request.json();

    await prisma.branchExpense.create({
      data: {
        cabangId: session.cabangId,
        kasirId,
        nominal,
        category,
        note: note || null
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Add expense error:', error);
    return NextResponse.json({ error: 'Failed to add expense' }, { status: 500 });
  }
}