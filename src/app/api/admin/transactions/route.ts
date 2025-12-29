import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prismaClient';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const branchId = searchParams.get('branchId');
    const type = searchParams.get('type');

    const transactions: any[] = [];

    // Build date filter
    const dateFilter = dateFrom && dateTo ? {
      gte: new Date(dateFrom + 'T00:00:00.000Z'),
      lte: new Date(dateTo + 'T23:59:59.999Z')
    } : undefined;

    // Build where conditions
    const whereConditions: any = {};
    if (dateFilter) whereConditions.jamSelesai = dateFilter;
    if (branchId) whereConditions.cabangId = branchId;

    // Get all staff for lookup
    const allCapsters = await prisma.capsterMaster.findMany();
    const allKasirs = await prisma.cashierMaster.findMany();
    const allStaff = [...allCapsters, ...allKasirs];

    // Get service transactions
    if (type === 'ALL' || type === 'SERVICE') {
      const visits = await prisma.customerVisit.findMany({
        where: {
          ...whereConditions,
          status: 'DONE',
          serviceTransactions: {
            some: {}
          }
        },
        include: {
          capster: true,
          cabang: true,
          serviceTransactions: true
        }
      });

      visits.forEach(visit => {
        const serviceDetails = visit.serviceTransactions.map(st => {
          const capster = allCapsters.find(c => c.id === st.capsterId) || visit.capster;
          return {
            serviceName: st.paketName,
            capsterName: capster.name,
            amount: st.priceFinal,
            commission: st.commissionAmount
          };
        });
        
        const totalAmount = visit.serviceTransactions.reduce((sum, st) => sum + st.priceFinal, 0);
        const paymentMethod = visit.serviceTransactions[0]?.paymentMethod || 'CASH';
        const qrisExcessAmount = visit.serviceTransactions.reduce((sum, st) => sum + (st.qrisExcessAmount || 0), 0);
        const qrisExcessType = visit.serviceTransactions[0]?.qrisExcessType;
        
        const responsibleStaff = allStaff.find(s => s.id === visit.serviceTransactions[0]?.closingById);
        
        transactions.push({
          id: visit.id,
          visitId: visit.id,
          date: visit.jamSelesai,
          type: 'SERVICE',
          customerName: visit.customerName,
          customerPhone: visit.customerPhone,
          itemName: serviceDetails.map(s => s.serviceName).join(' + '),
          serviceDetails: serviceDetails,
          staffName: responsibleStaff?.name || 'Unknown',
          branchName: visit.cabang.name,
          amount: totalAmount,
          paymentMethod: paymentMethod,
          qrisExcessAmount: qrisExcessAmount,
          qrisExcessType: qrisExcessType,
          serviceCount: visit.serviceTransactions.length
        });
      });
    }

    // Get product transactions
    if (type === 'ALL' || type === 'PRODUCT') {
      const productTransactions = await prisma.productTransaction.findMany({
        where: {
          ...(dateFilter && { createdAt: dateFilter }),
          ...(branchId && { cabangId: branchId })
        },
        include: {
          cabang: true
        }
      });

      productTransactions.forEach(pt => {
        const responsibleStaff = allStaff.find(s => s.id === pt.closingById);
        transactions.push({
          id: pt.id,
          visitId: null,
          date: pt.createdAt,
          type: 'PRODUCT',
          customerName: pt.customerName,
          customerPhone: pt.customerPhone,
          itemName: `${pt.productNameSnapshot} (x${pt.quantity})`,
          staffName: responsibleStaff?.name || 'Unknown',
          branchName: pt.cabang.name,
          amount: pt.totalPrice,
          paymentMethod: pt.paymentMethod,
          qrisExcessAmount: pt.qrisExcessAmount || 0,
          qrisExcessType: pt.qrisExcessType
        });
      });
    }

    // Get kasbon/advances
    if (type === 'ALL' || type === 'KASBON') {
      const advances = await prisma.staffAdvance.findMany({
        where: {
          ...(dateFilter && { createdAt: dateFilter }),
          ...(branchId && { cabangId: branchId })
        },
        include: {
          cabang: true
        }
      });

      advances.forEach(advance => {
        transactions.push({
          id: advance.id,
          visitId: null,
          date: advance.createdAt,
          type: 'KASBON',
          customerName: advance.staffName,
          customerPhone: advance.staffRole,
          itemName: `Kasbon Staff - ${advance.note || 'Tidak ada catatan'}`,
          staffName: advance.givenByName,
          branchName: advance.cabang.name,
          amount: advance.amount,
          paymentMethod: 'CASH'
        });
      });
    }

    // Get expenses
    if (type === 'ALL' || type === 'EXPENSE') {
      const expenses = await prisma.branchExpense.findMany({
        where: {
          ...(dateFilter && { createdAt: dateFilter }),
          ...(branchId && { cabangId: branchId })
        },
        include: {
          cabang: true,
          kasir: true
        }
      });

      expenses.forEach(expense => {
        transactions.push({
          id: expense.id,
          visitId: null,
          date: expense.createdAt,
          type: 'EXPENSE',
          customerName: 'Business Expense',
          customerPhone: '',
          itemName: `${expense.category}${expense.note ? ` - ${expense.note}` : ''}`,
          staffName: expense.kasir?.name || 'Unknown',
          branchName: expense.cabang.name,
          amount: expense.nominal,
          paymentMethod: 'CASH'
        });
      });
    }

    // Sort by date (newest first)
    transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Calculate commissions
    const serviceCommissions = await prisma.serviceTransaction.findMany({
      where: {
        ...(dateFilter && { createdAt: dateFilter }),
        ...(branchId && { cabangId: branchId })
      },
      select: { commissionAmount: true }
    });

    const productCommissions = await prisma.productTransaction.findMany({
      where: {
        ...(dateFilter && { createdAt: dateFilter }),
        ...(branchId && { cabangId: branchId })
      },
      select: { commissionAmount: true }
    });

    const totalServiceCommission = serviceCommissions.reduce((sum, sc) => sum + sc.commissionAmount, 0);
    const totalProductCommission = productCommissions.reduce((sum, pc) => sum + pc.commissionAmount, 0);
    const totalCommissions = totalServiceCommission + totalProductCommission;

    // Calculate summary
    const totalRevenue = transactions
      .filter(t => t.type !== 'EXPENSE' && t.type !== 'KASBON')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = transactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalKasbon = transactions
      .filter(t => t.type === 'KASBON')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const cashRevenue = transactions
      .filter(t => t.type !== 'EXPENSE' && t.type !== 'KASBON' && t.paymentMethod === 'CASH')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const qrisRevenue = transactions
      .filter(t => t.type !== 'EXPENSE' && t.type !== 'KASBON' && t.paymentMethod === 'QRIS')
      .reduce((sum, t) => sum + t.amount, 0);

    const netIncome = totalRevenue; // Don't subtract expenses from total revenue
    const netCashRevenue = cashRevenue - totalExpenses - totalKasbon; // Expenses and kasbon reduce cash

    // Calculate QRIS totals - use jamSelesai filter to match visits
    const qrisServiceTransactions = await prisma.serviceTransaction.findMany({
      where: {
        ...(dateFilter && { 
          visit: {
            jamSelesai: dateFilter
          }
        }),
        ...(branchId && { cabangId: branchId }),
        paymentMethod: 'QRIS'
      },
      select: { qrisAmountReceived: true, qrisExcessAmount: true }
    });
    
    const qrisProductTransactions = await prisma.productTransaction.findMany({
      where: {
        ...(dateFilter && { createdAt: dateFilter }),
        ...(branchId && { cabangId: branchId }),
        paymentMethod: 'QRIS'
      },
      select: { qrisAmountReceived: true, qrisExcessAmount: true }
    });
    
    const qrisReceived = [
      ...qrisServiceTransactions.map(st => st.qrisAmountReceived || 0),
      ...qrisProductTransactions.map(pt => pt.qrisAmountReceived || 0)
    ].reduce((sum, amount) => sum + amount, 0);
    
    const qrisExcess = [
      ...qrisServiceTransactions.map(st => st.qrisExcessAmount || 0),
      ...qrisProductTransactions.map(pt => pt.qrisExcessAmount || 0)
    ].reduce((sum, amount) => sum + amount, 0);

    const finalNetIncome = totalRevenue - totalCommissions - totalExpenses;

    return NextResponse.json({
      transactions,
      summary: {
        totalRevenue: netIncome, // Use net income as main revenue display
        totalExpenses,
        totalKasbon,
        totalCommissions,
        cashRevenue: netCashRevenue,
        qrisRevenue,
        qrisReceived,
        qrisExcess,
        netIncome: finalNetIncome
      }
    });
  } catch (error) {
    console.error('Transactions API error:', error);
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}