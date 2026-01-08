import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prismaClient';

interface ServiceStat {
  serviceName: string;
  count: number;
  commission: number;
  type: 'SERVICE' | 'PRODUCT';
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const staffId = searchParams.get('staffId');

    if (!staffId) {
      return NextResponse.json({ error: 'Staff ID required' }, { status: 400 });
    }

    // Validate dates
    if (dateFrom && dateTo) {
      const fromDate = new Date(dateFrom + 'T00:00:00.000Z');
      const toDate = new Date(dateTo + 'T23:59:59.999Z');
      if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
        return NextResponse.json({ error: 'Invalid date format' }, { status: 400 });
      }
    }

    const dateFilter = dateFrom && dateTo ? {
      gte: new Date(dateFrom + 'T00:00:00.000Z'),
      lte: new Date(dateTo + 'T23:59:59.999Z')
    } : undefined;

    // Get visits with individual services for this staff
    const visits = await prisma.customerVisit.findMany({
      where: {
        status: 'DONE',
        ...(dateFilter && { jamSelesai: dateFilter }),
        visitServices: {
          some: {
            capsterId: staffId
          }
        }
      },
      include: {
        visitServices: {
          where: {
            capsterId: staffId
          },
          include: {
            service: true
          }
        }
      }
    });

    // Get product transactions where this staff is recommender
    const productTransactions = await prisma.productTransaction.findMany({
      where: {
        recommenderId: staffId,
        ...(dateFilter && { createdAt: dateFilter })
      }
    });

    const serviceStats = new Map<string, ServiceStat>();
    
    // Process individual services
    visits.forEach(visit => {
      if (visit.visitServices) {
        visit.visitServices.forEach(vs => {
          const serviceName = vs.service.name;
          if (!serviceStats.has(serviceName)) {
            serviceStats.set(serviceName, {
              serviceName,
              count: 0,
              commission: 0,
              type: 'SERVICE'
            });
          }
          
          const stat = serviceStats.get(serviceName)!;
          stat.count += 1;
          stat.commission += vs.service.commissionAmount;
        });
      }
    });

    // Process product transactions
    const processProductTransaction = (pt: any) => {
      const productName = pt.productNameSnapshot;
      if (!serviceStats.has(productName)) {
        serviceStats.set(productName, {
          serviceName: productName,
          count: 0,
          commission: 0,
          type: 'PRODUCT'
        });
      }
      
      const stat = serviceStats.get(productName)!;
      stat.count += pt.quantity;
      stat.commission += pt.commissionAmount;
    };

    productTransactions.forEach(processProductTransaction);

    const result = Array.from(serviceStats.values())
      .sort((a, b) => b.count - a.count);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Staff service breakdown API error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json({ error: 'Failed to fetch staff service breakdown' }, { status: 500 });
  }
}