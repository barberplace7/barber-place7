import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { visitId, products, paymentMethod, completedBy } = await request.json();

    // Get customer visit data with services
    const visit = await prisma.customerVisit.findUnique({
      where: { id: visitId },
      include: { 
        cabang: true,
        visitServices: {
          include: {
            service: true
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

    // Create service transaction for all services
    const services = visit.visitServices.map(vs => vs.service);
    const totalServicePrice = services.reduce((sum, service) => sum + service.basePrice, 0);
    const serviceNames = services.map(s => s.name).join(' + ');
    const avgCommissionRate = services.reduce((sum, service) => sum + service.commissionRate, 0) / services.length;

    await prisma.serviceTransaction.create({
      data: {
        visitId,
        cabangId: visit.cabangId,
        capsterId: visit.capsterId,
        paketName: serviceNames,
        priceFinal: totalServicePrice,
        commissionRate: avgCommissionRate,
        commissionAmount: Math.round(totalServicePrice * avgCommissionRate),
        closingById: completedBy,
        closingByRole: 'KASIR',
        closingByNameSnapshot: 'Kasir',
        paymentMethod
      }
    });

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
            productNameSnapshot: productData.name,
            quantity: product.quantity,
            pricePerUnitSnapshot: productData.basePrice,
            totalPrice: productData.basePrice * product.quantity,
            recommenderId: completedBy,
            recommenderRole: 'KASIR',
            commissionPerUnitSnapshot: productData.commissionPerUnit,
            commissionAmount: productData.commissionPerUnit * product.quantity,
            closingById: completedBy,
            closingByRole: 'KASIR',
            closingByNameSnapshot: 'Kasir',
            paymentMethod
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