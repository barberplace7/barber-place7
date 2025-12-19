import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prismaClient';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const capsterId = searchParams.get('capsterId');
    const branchId = searchParams.get('branchId');

    // Build where conditions
    const visitWhere: any = { status: 'DONE' };
    
    if (dateFrom && dateTo) {
      visitWhere.jamSelesai = {
        gte: new Date(dateFrom + 'T00:00:00.000Z'),
        lte: new Date(dateTo + 'T23:59:59.999Z')
      };
    }

    if (branchId) {
      visitWhere.cabangId = branchId;
    }

    // Get all capsters and kasirs for lookup
    const allCapsters = await prisma.capsterMaster.findMany().catch(() => []);
    const allKasirs = await prisma.cashierMaster.findMany().catch(() => []);
    const allStaff = [...allCapsters.map(c => ({...c, role: 'CAPSTER'})), ...allKasirs.map(k => ({...k, role: 'KASIR'}))];

    // Group by person and calculate commissions
    const commissionMap = new Map();

    // Get service transactions with proper date filtering
    const serviceTransactionWhere: any = {};
    if (dateFrom && dateTo) {
      serviceTransactionWhere.createdAt = {
        gte: new Date(dateFrom + 'T00:00:00.000Z'),
        lte: new Date(dateTo + 'T23:59:59.999Z')
      };
    }
    if (capsterId) {
      serviceTransactionWhere.capsterId = capsterId;
    }
    if (branchId) {
      serviceTransactionWhere.cabangId = branchId;
    }

    const serviceTransactions = await prisma.serviceTransaction.findMany({
      where: serviceTransactionWhere,
      include: {
        cabang: true
      }
    }).catch(() => []);

    // Process service transactions and group by capster
    const capsterCommissions = new Map();
    serviceTransactions.forEach(st => {
      if (!st.cabang) return;
      
      const capster = allCapsters.find(c => c.id === st.capsterId);
      if (!capster) return;
      
      const key = st.capsterId;
      if (!capsterCommissions.has(key)) {
        capsterCommissions.set(key, {
          staffId: st.capsterId,
          capsterId: st.capsterId,
          capsterName: capster.name,
          branchName: st.cabang.name,
          role: 'CAPSTER',
          serviceCommission: 0,
          productCommission: 0,
          serviceCount: 0,
          productCount: 0
        });
      }
      
      const commission = capsterCommissions.get(key);
      commission.serviceCommission += st.commissionAmount || 0;
      commission.serviceCount += 1;
    });

    // Add to main commission map
    capsterCommissions.forEach((value, key) => {
      commissionMap.set(key, value);
    });

    // Process all product transactions for recommender commissions
    const productSaleWhere: any = {};
    if (dateFrom && dateTo) {
      productSaleWhere.createdAt = {
        gte: new Date(dateFrom + 'T00:00:00.000Z'),
        lte: new Date(dateTo + 'T23:59:59.999Z')
      };
    }
    if (capsterId) {
      productSaleWhere.recommenderId = capsterId;
    }
    if (branchId) {
      productSaleWhere.cabangId = branchId;
    }

    const allProductTransactions = await prisma.productTransaction.findMany({
      where: productSaleWhere,
      include: {
        cabang: true
      }
    }).catch(() => []);

    allProductTransactions.forEach(pt => {
      if (!pt.recommenderId || !pt.cabang) return;
      
      const recommender = allStaff.find(s => s.id === pt.recommenderId);
      if (recommender) {
        const key = pt.recommenderId;
        if (!commissionMap.has(key)) {
          commissionMap.set(key, {
            staffId: pt.recommenderId,
            capsterId: pt.recommenderId,
            capsterName: recommender.name,
            branchName: pt.cabang.name,
            role: recommender.role,
            serviceCommission: 0,
            productCommission: 0,
            serviceCount: 0,
            productCount: 0
          });
        }
        
        const commission = commissionMap.get(key);
        commission.productCommission += pt.commissionAmount || 0;
        commission.productCount += 1;
      }
    });

    const result = Array.from(commissionMap.values());
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Commission API error:', error);
    return NextResponse.json([], { status: 200 });
  }
}