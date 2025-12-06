import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

    if (capsterId) {
      visitWhere.capsterId = capsterId;
    }

    if (branchId) {
      visitWhere.cabangId = branchId;
    }

    // Get completed visits with service transactions
    const visits = await prisma.customerVisit.findMany({
      where: visitWhere,
      include: {
        capster: true,
        cabang: true,
        serviceTransactions: true,
        productTransactions: true
      }
    }).catch(() => []);

    // Get all capsters and kasirs for recommender lookup
    const allCapsters = await prisma.capsterMaster.findMany().catch(() => []);
    const allKasirs = await prisma.cashierMaster.findMany().catch(() => []);
    const allStaff = [...allCapsters.map(c => ({...c, role: 'CAPSTER'})), ...allKasirs.map(k => ({...k, role: 'KASIR'}))];

    // Group by person and calculate commissions
    const commissionMap = new Map();

    // Process visits for capster commissions
    visits.forEach(visit => {
      if (!visit.capster || !visit.cabang) return;
      
      const key = `${visit.capsterId}-capster`;
      if (!commissionMap.has(key)) {
        commissionMap.set(key, {
          staffId: visit.capsterId,
          capsterName: visit.capster.name,
          branchName: visit.cabang.name,
          role: 'CAPSTER',
          serviceCommission: 0,
          productCommission: 0,
          serviceCount: 0,
          productCount: 0
        });
      }
      
      const commission = commissionMap.get(key);
      
      // Add service commissions
      visit.serviceTransactions?.forEach(st => {
        commission.serviceCommission += st.commissionAmount || 0;
        commission.serviceCount += 1;
      });
      
      // Add product commissions from visit
      visit.productTransactions?.forEach(pt => {
        commission.productCommission += pt.commissionAmount || 0;
        commission.productCount += 1;
      });
    });

    // Process product transactions for kasir/capster recommender commissions
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
        const key = `${pt.recommenderId}-${recommender.role.toLowerCase()}`;
        if (!commissionMap.has(key)) {
          commissionMap.set(key, {
            staffId: pt.recommenderId,
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