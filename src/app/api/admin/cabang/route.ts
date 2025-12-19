import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prismaClient';
import { requireAuth } from '@/lib/auth';

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

export async function PUT(request: NextRequest) {
  try {
    await requireAuth('ADMIN');
    const { id, name, address } = await request.json();
    
    if (!id || !name) {
      return NextResponse.json({ error: 'ID and name required' }, { status: 400 });
    }
    
    const updatedBranch = await prisma.barberBranch.update({
      where: { id },
      data: { name, address },
      select: {
        id: true,
        name: true,
        address: true
      }
    });
    
    return NextResponse.json(updatedBranch);
  } catch (error) {
    console.error('Update branch error:', error);
    return NextResponse.json({ error: 'Failed to update branch' }, { status: 500 });
  }
}