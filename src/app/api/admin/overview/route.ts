import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prismaClient';

const getChartDays = (period: string): number => {
  if (period === 'today') return 1;
  if (period === '30days') return 30;
  return 7;
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '7days';
    const chartPeriod = searchParams.get('chartPeriod') || '7days';
    const branchPeriod = searchParams.get('branchPeriod') || '7days';
    
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);
    
    const chartDays = getChartDays(chartPeriod);
    const branchDays = getChartDays(branchPeriod);
    const chartPeriodAgo = new Date(today.getTime() - chartDays * 24 * 60 * 60 * 1000);
    const branchPeriodAgo = new Date(today.getTime() - branchDays * 24 * 60 * 60 * 1000);

    // Today's revenue and expenses
    const [todayVisits, todayProductSales, todayExpenses] = await Promise.all([
      prisma.customerVisit.findMany({
        where: {
          jamSelesai: { gte: startOfDay, lt: endOfDay },
          status: 'DONE'
        },
        include: {
          serviceTransactions: true,
          productTransactions: { include: { product: true } }
        }
      }),
      prisma.productTransaction.findMany({
        where: {
          createdAt: { gte: startOfDay, lt: endOfDay },
          visit: null
        }
      }),
      prisma.branchExpense.findMany({
        where: {
          createdAt: { gte: startOfDay, lt: endOfDay }
        }
      })
    ]);

    // Calculate today's metrics
    const todayRevenue = todayVisits.reduce((sum, visit) => {
      const serviceRevenue = visit.serviceTransactions.reduce((s, st) => s + st.priceFinal, 0);
      const productRevenue = visit.productTransactions.reduce((s, pt) => s + pt.totalPrice, 0);
      return sum + serviceRevenue + productRevenue;
    }, 0) + todayProductSales.reduce((sum, ps) => sum + ps.totalPrice, 0);

    const todayExpensesTotal = todayExpenses.reduce((sum, exp) => sum + exp.nominal, 0);
    const todayTransactions = todayVisits.length + todayProductSales.length;

    // Optimize: Fetch all visits at once instead of N queries
    const allVisitsInPeriod = await prisma.customerVisit.findMany({
      where: {
        jamSelesai: { gte: chartPeriodAgo, lte: today },
        status: 'DONE'
      },
      include: {
        serviceTransactions: true,
        productTransactions: true
      }
    });

    const allProductSalesInPeriod = await prisma.productTransaction.findMany({
      where: {
        createdAt: { gte: chartPeriodAgo, lte: today },
        visit: null
      }
    });

    // Group by day
    const revenueData = [];
    const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    
    for (let i = chartDays - 1; i >= 0; i--) {
      const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
      
      const dayVisits = allVisitsInPeriod.filter(v => {
        const visitDate = new Date(v.jamSelesai!);
        return visitDate >= dayStart && visitDate < dayEnd;
      });

      const dayProductSales = allProductSalesInPeriod.filter(ps => {
        const saleDate = new Date(ps.createdAt);
        return saleDate >= dayStart && saleDate < dayEnd;
      });

      const dayRevenue = dayVisits.reduce((sum, visit) => {
        const serviceRevenue = visit.serviceTransactions.reduce((s, st) => s + st.priceFinal, 0);
        const productRevenue = visit.productTransactions.reduce((s, pt) => s + pt.totalPrice, 0);
        return sum + serviceRevenue + productRevenue;
      }, 0) + dayProductSales.reduce((sum, ps) => sum + ps.totalPrice, 0);

      revenueData.push({
        day: chartPeriod === 'today' ? 'Today' : 
             chartPeriod === '30days' ? `${date.getDate()}/${date.getMonth() + 1}` : 
             dayNames[date.getDay()],
        revenue: dayRevenue
      });
    }

    // Top services for chart period
    const periodVisits = await prisma.customerVisit.findMany({
      where: {
        jamSelesai: { gte: chartPeriodAgo },
        status: 'DONE'
      },
      include: {
        serviceTransactions: true,
        visitServices: { include: { service: true } }
      }
    });

    const serviceStats = {};
    periodVisits.forEach(visit => {
      if (visit.serviceTransactions.length > 0) {
        const serviceName = visit.serviceTransactions[0].paketName;
        const revenue = visit.serviceTransactions.reduce((sum, st) => sum + st.priceFinal, 0);
        if (!serviceStats[serviceName]) {
          serviceStats[serviceName] = { count: 0, revenue: 0 };
        }
        serviceStats[serviceName].count++;
        serviceStats[serviceName].revenue += revenue;
      }
    });

    const topServices = Object.entries(serviceStats)
      .map(([name, stats]) => ({ name, ...stats }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Branch performance today
    const branches = await prisma.barberBranch.findMany({});

    const branchPerformance = await Promise.all(
      branches.map(async (branch) => {
        const branchVisits = await prisma.customerVisit.findMany({
          where: {
            jamSelesai: { gte: branchPeriodAgo },
            status: 'DONE',
            cabangId: branch.id
          },
          include: {
            serviceTransactions: true,
            productTransactions: true
          }
        });

        const branchProductSales = await prisma.productTransaction.findMany({
          where: {
            createdAt: { gte: branchPeriodAgo },
            visit: null,
            cabangId: branch.id
          }
        });

        const revenue = branchVisits.reduce((sum, visit) => {
          const serviceRevenue = visit.serviceTransactions.reduce((s, st) => s + st.priceFinal, 0);
          const productRevenue = visit.productTransactions.reduce((s, pt) => s + pt.totalPrice, 0);
          return sum + serviceRevenue + productRevenue;
        }, 0) + branchProductSales.reduce((sum, ps) => sum + ps.totalPrice, 0);

        const transactions = branchVisits.length + branchProductSales.length;
        
        // Count active staff (simplified)
        const staff = await prisma.capsterMaster.count() +
                     await prisma.cashierMaster.count();

        return {
          name: branch.name,
          revenue,
          transactions,
          staff
        };
      })
    );

    // Sort by revenue
    branchPerformance.sort((a, b) => b.revenue - a.revenue);

    return NextResponse.json({
      todayRevenue: todayRevenue || 0,
      todayExpenses: todayExpensesTotal || 0,
      todayTransactions: todayTransactions || 0,
      weeklyRevenue: revenueData.length > 0 ? revenueData : [
        ...Array.from({ length: chartDays }, (_, i) => ({
          day: chartPeriod === 'today' ? 'Hari Ini' :
               chartPeriod === '30days' ? `${i + 1}` : 
               dayNames[i % 7],
          revenue: 0
        }))
      ],
      topServices: topServices.length > 0 ? topServices : [
        { name: 'No services yet', count: 0, revenue: 0 }
      ],
      branchPerformance: branchPerformance.length > 0 ? branchPerformance.slice(0, 5) : [
        { name: 'No branches yet', revenue: 0, transactions: 0, staff: 0 }
      ]
    });

  } catch (error: any) {
    console.error('[API /admin/overview] Error:', {
      error: error?.message || error,
      stack: error?.stack,
      timestamp: new Date().toISOString()
    });
    return NextResponse.json(
      { error: 'Failed to fetch overview data' },
      { status: 500 }
    );
  }
}