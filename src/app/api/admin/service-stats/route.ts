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

    const serviceTransactions = await prisma.serviceTransaction.findMany({
      where: {
        ...(dateFilter && { createdAt: dateFilter }),
        ...(branchId && { cabangId: branchId })
      }
    });

    const serviceStats = new Map();
    
    serviceTransactions.forEach(st => {
      const serviceNames = st.paketName.split(' + ');
      
      serviceNames.forEach(serviceName => {
        const trimmedName = serviceName.trim();
        if (!serviceStats.has(trimmedName)) {
          serviceStats.set(trimmedName, {
            serviceName: trimmedName,
            count: 0,
            revenue: 0,
            commission: 0
          });
        }
        
        const stat = serviceStats.get(trimmedName);
        stat.count += 1;
        stat.revenue += st.priceFinal / serviceNames.length;
        stat.commission += st.commissionAmount / serviceNames.length;
      });
    });

    const result = Array.from(serviceStats.values())
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