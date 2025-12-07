import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prismaClient';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const capsterId = searchParams.get('capsterId');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');

    if (!capsterId || capsterId === 'undefined' || !dateFrom || !dateTo) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const startDate = new Date(dateFrom);
    const endDate = new Date(dateTo);
    endDate.setHours(23, 59, 59, 999);

    const [serviceTransactions, productTransactions] = await Promise.all([
      prisma.serviceTransaction.findMany({
        where: {
          capsterId,
          createdAt: { gte: startDate, lte: endDate },
        },
        include: {
          visit: {
            include: {
              visitServices: {
                include: {
                  service: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.productTransaction.findMany({
        where: {
          recommenderId: capsterId,
          createdAt: { gte: startDate, lte: endDate },
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    // Group by individual service
    const itemMap = new Map();

    for (const st of serviceTransactions) {
      // Ambil visitServices dari visit
      let services = st.visit?.visitServices || [];
      
      // Jika visitServices kosong, coba query ulang
      if (services.length === 0 && st.visitId) {
        const visitData = await prisma.customerVisit.findUnique({
          where: { id: st.visitId },
          include: {
            visitServices: {
              include: { service: true }
            }
          }
        });
        services = visitData?.visitServices || [];
      }
      
      if (services.length === 0) {
        // Fallback: parse dari paketName jika masih kosong
        const serviceNames = st.paketName.split(' + ');
        const commissionPerService = st.commissionAmount / serviceNames.length;
        
        serviceNames.forEach((serviceName) => {
          const key = `SERVICE-${serviceName.trim()}`;
          if (!itemMap.has(key)) {
            itemMap.set(key, {
              type: 'SERVICE',
              itemName: serviceName.trim(),
              count: 0,
              totalCommission: 0,
            });
          }
          const item = itemMap.get(key);
          item.count += 1;
          item.totalCommission += commissionPerService;
        });
      } else {
        // Hitung komisi per service dari visitServices
        const totalServices = services.length;
        const commissionPerService = st.commissionAmount / totalServices;
        
        services.forEach((vs) => {
          const serviceName = vs.service?.name || 'Unknown Service';
          const key = `SERVICE-${serviceName}`;
          
          if (!itemMap.has(key)) {
            itemMap.set(key, {
              type: 'SERVICE',
              itemName: serviceName,
              count: 0,
              totalCommission: 0,
            });
          }
          
          const item = itemMap.get(key);
          item.count += 1;
          item.totalCommission += commissionPerService;
        });
      }
    }

    productTransactions.forEach((pt) => {
      const key = `PRODUCT-${pt.productNameSnapshot}`;
      if (!itemMap.has(key)) {
        itemMap.set(key, {
          type: 'PRODUCT',
          itemName: pt.productNameSnapshot,
          count: 0,
          totalCommission: 0,
        });
      }
      const item = itemMap.get(key);
      item.count += 1;
      item.totalCommission += pt.commissionAmount;
    });

    const groupedItems = Array.from(itemMap.values())
      .map(item => ({
        ...item,
        totalCommission: Math.round(item.totalCommission),
      }))
      .sort((a, b) => b.totalCommission - a.totalCommission);

    return NextResponse.json(groupedItems);
  } catch (error) {
    console.error('Error fetching staff transactions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
