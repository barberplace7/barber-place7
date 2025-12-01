import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prismaClient';

export async function GET() {
  try {
    const services = await prisma.servicePackage.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(services);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, category, basePrice, commissionRate } = await request.json();

    console.log('Received data:', { name, category, basePrice, commissionRate });

    if (!name || !basePrice || commissionRate === undefined) {
      return NextResponse.json({ error: 'Name, basePrice, and commissionRate required' }, { status: 400 });
    }

    const service = await prisma.servicePackage.create({
      data: {
        name,
        category: category || 'HAIRCUT',
        basePrice: parseInt(basePrice),
        commissionRate: parseFloat(commissionRate)
      }
    });

    return NextResponse.json(service);
  } catch (error) {
    console.error('Service creation error:', error);
    return NextResponse.json({ error: 'Failed to create service', details: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, name, category, basePrice, commissionRate } = await request.json();

    if (!id || !name || !basePrice || commissionRate === undefined) {
      return NextResponse.json({ error: 'ID, name, basePrice, and commissionRate required' }, { status: 400 });
    }

    const service = await prisma.servicePackage.update({
      where: { id },
      data: {
        name,
        category: category || 'HAIRCUT',
        basePrice: parseInt(basePrice),
        commissionRate: parseFloat(commissionRate)
      }
    });

    return NextResponse.json(service);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update service' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    await prisma.servicePackage.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Service deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
  }
}