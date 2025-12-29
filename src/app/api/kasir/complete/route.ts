import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prismaClient';

export async function POST(request: NextRequest) {
  try {
    const { 
      visitId, 
      products, 
      paymentMethod, 
      completedBy,
      qrisAmountReceived,
      qrisExcessAmount,
      qrisExcessType,
      qrisExcessNote
    } = await request.json();

    // Get customer visit data with services
    const visit = await prisma.customerVisit.findUnique({
      where: { id: visitId },
      include: { 
        cabang: true,
        capster: true,
        visitServices: {
          include: {
            service: true,
            capster: true
          }
        }
      }
    });

    if (!visit) {
      return NextResponse.json({ error: 'Visit not found' }, { status: 404 });
    }

    // Update customer visit status to DONE
    await prisma.customerVisit.update({
      where: { id: visitId },
      data: { 
        status: 'DONE',
        jamSelesai: new Date()
      }
    });

    // Group services by capster and create separate transactions
    const servicesByCapster = new Map();
    
    for (const vs of visit.visitServices) {
      const capsterId = vs.capsterId || visit.capsterId; // Fallback to visit capster if not set
      if (!servicesByCapster.has(capsterId)) {
        servicesByCapster.set(capsterId, []);
      }
      servicesByCapster.get(capsterId).push(vs);
    }

    // Get the person who completed the transaction
    const completedByPerson = await prisma.$queryRaw`
      SELECT name FROM capster_masters WHERE id = ${completedBy}
      UNION
      SELECT name FROM cashier_masters WHERE id = ${completedBy}
    ` as Array<{name: string}>;
    
    const completedByName = completedByPerson.length > 0 ? completedByPerson[0].name : 'Tidak Diketahui';

    // Create service transaction for each capster
    for (const [capsterId, visitServices] of servicesByCapster) {
      const services = visitServices.map(vs => vs.service);
      const serviceNames = services.map(s => s.name).join(' + ');
      const totalPrice = services.reduce((sum, service) => sum + service.basePrice, 0);
      const totalCommission = services.reduce((sum, service) => sum + service.commissionAmount, 0);

      await prisma.serviceTransaction.create({
        data: {
          visitId,
          cabangId: visit.cabangId,
          capsterId: capsterId,
          paketName: serviceNames,
          priceFinal: totalPrice,
          commissionAmount: totalCommission,
          closingById: completedBy,
          closingByRole: 'KASIR',
          closingByNameSnapshot: completedByName,
          paymentMethod,
          // QRIS fields (auto-set to service price, no excess)
          ...(paymentMethod === 'QRIS' && capsterId === Array.from(servicesByCapster.keys())[0] && {
            qrisAmountReceived: totalPrice,
            qrisExcessAmount: 0,
            qrisExcessType: null,
            qrisExcessNote: null
          })
        }
      });
    }

    // Create product transactions if any
    if (products && products.length > 0) {
      for (const product of products) {
        const productData = await prisma.barberProduct.findUnique({
          where: { id: product.id }
        });
        
        await prisma.productTransaction.create({
          data: {
            visitId,
            cabangId: visit.cabangId,
            customerName: visit.customerName,
            customerPhone: visit.customerPhone,
            productId: product.id,
            productNameSnapshot: productData!.name,
            quantity: product.quantity,
            pricePerUnitSnapshot: productData!.basePrice,
            totalPrice: productData!.basePrice * product.quantity,
            recommenderId: completedBy,
            recommenderRole: 'KASIR',
            commissionPerUnitSnapshot: productData!.commissionPerUnit,
            commissionAmount: productData!.commissionPerUnit * product.quantity,
            closingById: completedBy,
            closingByRole: 'KASIR',
            closingByNameSnapshot: completedByName,
            paymentMethod,
            // QRIS fields (auto-set to product price, no excess)
            ...(paymentMethod === 'QRIS' && {
              qrisAmountReceived: productData!.basePrice * product.quantity,
              qrisExcessAmount: 0,
              qrisExcessType: null,
              qrisExcessNote: null
            })
          }
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Complete transaction error:', error);
    return NextResponse.json({ error: 'Failed to complete transaction' }, { status: 500 });
  }
}