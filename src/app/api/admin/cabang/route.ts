import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prismaClient';

export async function GET() {
  try {
    const cabang = await prisma.barberBranch.findMany({
      select: {
        id: true,
        name: true,
        address: true
      },
      orderBy: { name: 'asc' }
    });

    return NextResponse.json(cabang);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch cabang' }, { status: 500 });
  }
}