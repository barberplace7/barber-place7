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

    // Get all product transactions first
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

    // Get visits with individual services for accurate commission calculation
    const visits = await prisma.customerVisit.findMany({
      where: {
        ...visitWhere,
        ...(capsterId && {
          visitServices: {
            some: {
              capsterId: capsterId
            }
          }
        })
      },
      include: {
        cabang: true,
        visitServices: {
          include: {
            service: true,
            capster: true
          }
        }
      }
    }).catch(() => []);

    // Process visits and group by capster
    const capsterCommissions = new Map();
    visits.forEach(visit => {
      if (!visit.cabang || !visit.visitServices) return;
      
      visit.visitServices.forEach(vs => {
        if (!vs.capster) return;
        
        const key = vs.capsterId;
        if (!capsterCommissions.has(key)) {
          capsterCommissions.set(key, {
            staffId: vs.capsterId,
            capsterId: vs.capsterId,
            capsterName: vs.capster.name,
            branchName: visit.cabang.name,
            role: 'CAPSTER',
            serviceCommission: 0,
            productCommission: 0,
            serviceCount: 0,
            productCount: 0
          });
        }
        
        const commission = capsterCommissions.get(key);
        commission.serviceCommission += vs.service.commissionAmount || 0;
        commission.serviceCount += 1;
      });
    });

    // Add to main commission map
    capsterCommissions.forEach((value, key) => {
      commissionMap.set(key, value);
    });

    // Process product transactions for recommender commissions
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
        commission.productCount += pt.quantity;
      }
    });

    const result = Array.from(commissionMap.values());
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Commission API error:', error);
    return NextResponse.json([], { status: 200 });
  }
}