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
            select: {
              customerName: true,
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

    // Group by item
    const itemMap = new Map();

    serviceTransactions.forEach((st) => {
      const key = `SERVICE-${st.paketName}`;
      if (!itemMap.has(key)) {
        itemMap.set(key, {
          type: 'SERVICE',
          itemName: st.paketName,
          count: 0,
          totalCommission: 0,
        });
      }
      const item = itemMap.get(key);
      item.count += 1;
      item.totalCommission += st.commissionAmount;
    });

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

    const groupedItems = Array.from(itemMap.values()).sort(
      (a, b) => b.totalCommission - a.totalCommission
    );

    return NextResponse.json(groupedItems);
  } catch (error) {
    console.error('Error fetching staff transactions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
