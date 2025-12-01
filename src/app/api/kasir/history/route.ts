import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { jwtVerify } from 'jose';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Get session from cookie
    const sessionCookie = request.cookies.get('session');
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');
    const { payload } = await jwtVerify(sessionCookie.value, secret);
    const branchId = payload.cabangId as string;

    // Get date filters from query params
    const { searchParams } = new URL(request.url);
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    
    const startDate = dateFrom ? new Date(dateFrom) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const endDate = dateTo ? new Date(dateTo) : new Date();
    
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    // Get completed visits with service transactions
    const visits = await prisma.customerVisit.findMany({
      where: { 
        status: 'DONE',
        cabangId: branchId,
        jamSelesai: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        capster: true,
        serviceTransactions: true,
        visitServices: {
          include: {
            service: true
          }
        },
        productTransactions: {
          include: { product: true }
        }
      },
      orderBy: { jamSelesai: 'desc' }
    });

    // Get product-only transactions (last 7 days)
    const productSales = await prisma.productTransaction.findMany({
      where: { 
        visitId: null,
        cabangId: branchId,
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
      include: { product: true },
      orderBy: { createdAt: 'desc' }
    });

    // Get expenses (last 7 days)
    const expenses = await prisma.branchExpense.findMany({
      where: {
        cabangId: branchId,
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        kasir: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ visits, productSales, expenses });
  } catch (error) {
    console.error('History fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
  }
}