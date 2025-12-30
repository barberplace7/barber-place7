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

    // Get service transactions with service details
    const serviceTransactions = await prisma.serviceTransaction.findMany({
      where: {
        ...(dateFilter && { 
          visit: {
            jamSelesai: dateFilter
          }
        }),
        ...(branchId && { cabangId: branchId })
      },
      include: {
        visit: {
          include: {
            visitServices: {
              include: {
                service: true
              }
            }
          }
        }
      }
    });

    // Get product transactions
    const productTransactions = await prisma.productTransaction.findMany({
      where: {
        ...(dateFilter && { createdAt: dateFilter }),
        ...(branchId && { cabangId: branchId })
      }
    });

    const itemStats = new Map();
    
    // Process service transactions
    serviceTransactions.forEach(st => {
      // Use visitServices for accurate per-service data
      if (st.visit?.visitServices) {
        st.visit.visitServices.forEach(vs => {
          const serviceName = vs.service.name;
          if (!itemStats.has(serviceName)) {
            itemStats.set(serviceName, {
              serviceName: serviceName,
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
      } else {
        // Fallback to paket name splitting if visitServices not available
        const serviceNames = st.paketName.split(' + ');
        
        serviceNames.forEach(serviceName => {
          const trimmedName = serviceName.trim();
          if (!itemStats.has(trimmedName)) {
            itemStats.set(trimmedName, {
              serviceName: trimmedName,
              count: 0,
              revenue: 0,
              commission: 0,
              type: 'SERVICE'
            });
          }
          
          const stat = itemStats.get(trimmedName);
          stat.count += 1;
          stat.revenue += st.priceFinal / serviceNames.length;
          stat.commission += st.commissionAmount / serviceNames.length;
        });
      }
    });

    // Process product transactions
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