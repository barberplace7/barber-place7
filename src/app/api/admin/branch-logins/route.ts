import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prismaClient';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      where: { role: 'KASIR' },
      include: {
        cabang: {
          select: { name: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const loginAccounts = users.map(user => ({
      id: user.id,
      username: user.username,
      branchName: user.cabang?.name || 'No branch',
      cabangId: user.cabangId,
      createdAt: user.createdAt
    }));

    return NextResponse.json(loginAccounts);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch login accounts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { cabangId, username, password } = await request.json();

    if (!cabangId || !username || !password) {
      return NextResponse.json({ error: 'All fields required' }, { status: 400 });
    }

    // Check if username already exists
    const existingUser = await prisma.user.findUnique({
      where: { username }
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Username already exists' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create kasir user for selected branch
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role: 'KASIR',
        cabangId
      },
      include: {
        cabang: {
          select: { name: true }
        }
      }
    });

    return NextResponse.json({
      id: user.id,
      username: user.username,
      branchName: user.cabang?.name,
      cabangId: user.cabangId,
      createdAt: user.createdAt
    });
  } catch (error) {
    console.error('Login account creation error:', error);
    return NextResponse.json({ error: 'Failed to create login account' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    await prisma.user.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Login account deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete login account' }, { status: 500 });
  }
}