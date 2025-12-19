import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Get session from cookie for branch filtering
    const sessionCookie = request.cookies.get('session');
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { jwtVerify } = await import('jose');
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');
    const { payload } = await jwtVerify(sessionCookie.value, secret);
    const branchId = payload.cabangId as string;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const visits = await prisma.customerVisit.findMany({
      where: {
        status: 'DONE',
        cabangId: branchId,
        jamSelesai: {
          gte: today,
          lt: tomorrow
        }
      },
      include: {
        capster: true,
        productTransactions: true,
        serviceTransactions: true,
        visitServices: {
          include: {
            service: true
          }
        }
      },
      orderBy: { jamSelesai: 'desc' }
    });

    const productSales = await prisma.productTransaction.findMany({
      where: {
        visitId: null,
        cabangId: branchId,
        createdAt: {
          gte: today,
          lt: tomorrow
        }
      }
    });

    let totalRevenue = 0;
    let cashTotal = 0;
    let qrisTotal = 0;
    let qrisReceived = 0;
    let qrisExcess = 0;

    for (const visit of visits) {
      // Calculate service price from service transactions or visitServices
      let servicePrice = 0;
      let servicePaymentMethod = 'CASH';
      
      if (visit.serviceTransactions.length > 0) {
        servicePrice = visit.serviceTransactions.reduce((sum, st) => sum + st.priceFinal, 0);
        servicePaymentMethod = visit.serviceTransactions[0].paymentMethod;
        
        // Add QRIS calculations for services
        if (servicePaymentMethod === 'QRIS') {
          const qrisAmountReceived = visit.serviceTransactions.reduce((sum, st) => sum + (st.qrisAmountReceived || 0), 0);
          const qrisExcessAmount = visit.serviceTransactions.reduce((sum, st) => sum + (st.qrisExcessAmount || 0), 0);
          qrisReceived += qrisAmountReceived;
          qrisExcess += qrisExcessAmount;
        }
      } else {
        servicePrice = visit.visitServices.reduce((sum, vs) => sum + vs.service.basePrice, 0);
      }
      
      totalRevenue += servicePrice;
      
      if (servicePaymentMethod === 'CASH') {
        cashTotal += servicePrice;
      } else {
        qrisTotal += servicePrice;
      }
      
      // Add product revenue from this visit
      for (const productTx of visit.productTransactions) {
        totalRevenue += productTx.totalPrice;
        if (productTx.paymentMethod === 'CASH') {
          cashTotal += productTx.totalPrice;
        } else {
          qrisTotal += productTx.totalPrice;
          // Add QRIS calculations for products
          qrisReceived += productTx.qrisAmountReceived || 0;
          qrisExcess += productTx.qrisExcessAmount || 0;
        }
      }
    }

    for (const sale of productSales) {
      totalRevenue += sale.totalPrice;
      if (sale.paymentMethod === 'CASH') {
        cashTotal += sale.totalPrice;
      } else {
        qrisTotal += sale.totalPrice;
        // Add QRIS calculations for standalone product sales
        qrisReceived += sale.qrisAmountReceived || 0;
        qrisExcess += sale.qrisExcessAmount || 0;
      }
    }

    // Calculate expenses for today
    const expenses = await prisma.branchExpense.findMany({
      where: {
        cabangId: branchId,
        createdAt: {
          gte: today,
          lt: tomorrow
        }
      }
    });

    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.nominal, 0);
    const netRevenue = totalRevenue - totalExpenses;

    const visitsWithPayment = visits.map(visit => ({
      ...visit,
      paymentMethod: visit.serviceTransactions.length > 0 ? visit.serviceTransactions[0].paymentMethod : 'CASH'
    }));

    return NextResponse.json({
      visits: visitsWithPayment,
      productTransactions: productSales,
      summary: {
        total: netRevenue,
        cash: cashTotal,
        qris: qrisTotal,
        qrisReceived: qrisReceived,
        qrisExcess: qrisExcess,
        expenses: totalExpenses
      }
    });
  } catch (error) {
    console.error('Completed today fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch completed today' }, { status: 500 });
  }
}