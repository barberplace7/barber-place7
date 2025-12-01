import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prismaClient';

export async function GET() {
  try {
    const products = await prisma.barberProduct.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, basePrice, commissionPerUnit } = await request.json();

    if (!name || !basePrice || commissionPerUnit === undefined) {
      return NextResponse.json({ error: 'Name, basePrice, and commissionPerUnit required' }, { status: 400 });
    }

    const product = await prisma.barberProduct.create({
      data: {
        name,
        basePrice: parseInt(basePrice),
        commissionPerUnit: parseInt(commissionPerUnit)
      }
    });

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, name, basePrice, commissionPerUnit } = await request.json();

    if (!id || !name || !basePrice || commissionPerUnit === undefined) {
      return NextResponse.json({ error: 'ID, name, basePrice, and commissionPerUnit required' }, { status: 400 });
    }

    const product = await prisma.barberProduct.update({
      where: { id },
      data: {
        name,
        basePrice: parseInt(basePrice),
        commissionPerUnit: parseInt(commissionPerUnit)
      }
    });

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    await prisma.barberProduct.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}