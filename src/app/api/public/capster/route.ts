import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prismaClient';

export async function GET() {
  try {
    const capsters = await prisma.capsterMaster.findMany({
      select: {
        id: true,
        name: true,
        phone: true
      },
      orderBy: { name: 'asc' }
    });

    return NextResponse.json(capsters);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch capsters' }, { status: 500 });
  }
}