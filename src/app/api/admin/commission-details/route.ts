import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const staffId = searchParams.get('staffId');

    if (!staffId) {
      return NextResponse.json({ error: 'Staff ID required' }, { status: 400 });
    }

    const transactions = [];

    // Build date filter
    const dateFilter = dateFrom && dateTo ? {
      gte: new Date(dateFrom + 'T00:00:00.000Z'),
      lte: new Date(dateTo + 'T23:59:59.999Z')
    } : undefined;

    // Get service transactions
    const serviceTransactions = await prisma.serviceTransaction.findMany({
      where: {
        capsterId: staffId,
        ...(dateFilter && { createdAt: dateFilter })
      },
      include: {
        visit: {
          include: {
            cabang: true
          }
        }
      }
    });

    serviceTransactions.forEach(st => {
      transactions.push({
        date: st.createdAt,
        type: 'SERVICE',
        description: `${st.paketName} - ${st.visit?.customerName || 'Unknown'}`,
        amount: st.priceFinal,
        commission: st.commissionAmount
      });
    });

    // Get product transactions where this person is the recommender
    const productTransactions = await prisma.productTransaction.findMany({
      where: {
        recommenderId: staffId,
        ...(dateFilter && { createdAt: dateFilter })
      }
    });

    productTransactions.forEach(pt => {
      transactions.push({
        date: pt.createdAt,
        type: 'PRODUCT',
        description: `${pt.productNameSnapshot} (x${pt.quantity}) - ${pt.customerName}`,
        amount: pt.totalPrice,
        commission: pt.commissionAmount
      });
    });

    // Sort by date (newest first)
    transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json(transactions);
  } catch (error) {
    console.error('Commission details API error:', error);
    return NextResponse.json({ error: 'Failed to fetch commission details' }, { status: 500 });
  }
}