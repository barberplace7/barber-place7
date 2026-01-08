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

    const transactions: any[] = [];

    // Build date filter
    const dateFilter = dateFrom && dateTo ? {
      gte: new Date(dateFrom + 'T00:00:00.000Z'),
      lte: new Date(dateTo + 'T23:59:59.999Z')
    } : undefined;

    // Get service transactions with visit services for individual service breakdown
    const serviceTransactions = await prisma.serviceTransaction.findMany({
      where: {
        capsterId: staffId,
        ...(dateFilter && { createdAt: dateFilter }),
        visit: {
          status: 'DONE'
        }
      },
      include: {
        visit: {
          include: {
            cabang: true,
            visitServices: {
              where: {
                capsterId: staffId
              },
              include: {
                service: true
              }
            }
          }
        }
      }
    });

    // Process individual services from visitServices
    serviceTransactions.forEach(st => {
      if (st.visit?.visitServices && st.visit.visitServices.length > 0) {
        // Add individual services
        st.visit.visitServices.forEach(vs => {
          transactions.push({
            date: st.createdAt,
            type: 'SERVICE',
            description: `${vs.service.name} - ${st.visit?.customerName || 'Unknown'}`,
            amount: vs.service.basePrice,
            commission: vs.service.commissionAmount
          });
        });
      } else {
        // Fallback to paket name if visitServices not available
        transactions.push({
          date: st.createdAt,
          type: 'SERVICE',
          description: `${st.paketName} - ${st.visit?.customerName || 'Unknown'}`,
          amount: st.priceFinal,
          commission: st.commissionAmount
        });
      }
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