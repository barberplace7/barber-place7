import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prismaClient';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const branchId = searchParams.get('branchId');

    const dateFilter = dateFrom && dateTo ? {
      gte: new Date(dateFrom + 'T00:00:00.000Z'),
      lte: new Date(dateTo + 'T23:59:59.999Z')
    } : undefined;

    const visits = await prisma.customerVisit.findMany({
      where: {
        status: 'DONE',
        ...(branchId && { cabangId: branchId }),
        ...(dateFilter && { jamSelesai: dateFilter })
      },
      include: {
        visitServices: { include: { service: true } },
        productTransactions: true
      }
    });

    const productTransactions = await prisma.productTransaction.findMany({
      where: {
        visitId: null,
        ...(branchId && { cabangId: branchId }),
        ...(dateFilter && { createdAt: dateFilter })
      }
    });

    const itemStats = new Map();
    
    visits.forEach(visit => {
      if (visit.visitServices?.length > 0) {
        visit.visitServices.forEach(vs => {
          const serviceName = vs.service.name;
          if (!itemStats.has(serviceName)) {
            itemStats.set(serviceName, {
              serviceName,
              count: 0,
              revenue: 0,
              commission: 0,
              type: 'SERVICE'
            });
          }
          
          const stat = itemStats.get(serviceName);
          stat.count += 1;
          stat.revenue += vs.service.basePrice;
          stat.commission += vs.service.commissionAmount;
        });
      }
      
      if (visit.productTransactions) {
        visit.productTransactions.forEach(pt => {
          const productName = pt.productNameSnapshot;
          if (!itemStats.has(productName)) {
            itemStats.set(productName, {
              serviceName: productName,
              count: 0,
              revenue: 0,
              commission: 0,
              type: 'PRODUCT'
            });
          }
          
          const stat = itemStats.get(productName);
          stat.count += pt.quantity;
          stat.revenue += pt.totalPrice;
          stat.commission += pt.commissionAmount;
        });
      }
    });

    productTransactions.forEach(pt => {
      const productName = pt.productNameSnapshot;
      if (!itemStats.has(productName)) {
        itemStats.set(productName, {
          serviceName: productName,
          count: 0,
          revenue: 0,
          commission: 0,
          type: 'PRODUCT'
        });
      }
      
      const stat = itemStats.get(productName);
      stat.count += pt.quantity;
      stat.revenue += pt.totalPrice;
      stat.commission += pt.commissionAmount;
    });

    const result = Array.from(itemStats.values())
      .map(stat => ({
        ...stat,
        revenue: Math.round(stat.revenue),
        commission: Math.round(stat.commission)
      }))
      .sort((a, b) => b.count - a.count);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Service stats API error:', error);
    return NextResponse.json([], { status: 200 });
  }
}