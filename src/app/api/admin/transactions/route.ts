import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const branchId = searchParams.get('branchId');
    const type = searchParams.get('type');

    const transactions = [];

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
        visit.serviceTransactions.forEach(st => {
          const responsibleStaff = allStaff.find(s => s.id === st.closingById);
          transactions.push({
            id: st.id,
            visitId: visit.id,
            date: visit.jamSelesai,
            type: 'SERVICE',
            customerName: visit.customerName,
            customerPhone: visit.customerPhone,
            itemName: st.paketName,
            staffName: responsibleStaff?.name || 'Unknown',
            branchName: visit.cabang.name,
            amount: st.priceFinal,
            paymentMethod: st.paymentMethod
          });
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
          paymentMethod: pt.paymentMethod
        });
      });
    }

    // Get expenses
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

    // Sort by date (newest first)
    transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Calculate summary
    const totalRevenue = transactions
      .filter(t => t.type !== 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = transactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const cashRevenue = transactions
      .filter(t => t.type !== 'EXPENSE' && t.paymentMethod === 'CASH')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const qrisRevenue = transactions
      .filter(t => t.type !== 'EXPENSE' && t.paymentMethod === 'QRIS')
      .reduce((sum, t) => sum + t.amount, 0);

    return NextResponse.json({
      transactions,
      summary: {
        totalRevenue,
        totalExpenses,
        cashRevenue,
        qrisRevenue
      }
    });
  } catch (error) {
    console.error('Transactions API error:', error);
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}