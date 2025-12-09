import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prismaClient';
import { jwtVerify } from 'jose';

export async function POST(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('session');
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');
    const { payload } = await jwtVerify(sessionCookie.value, secret);
    
    const { customerName, customerPhone, products, paymentMethod, completedBy, recommendedBy } = await request.json();

    for (const product of products) {
      const productData = await prisma.barberProduct.findUnique({
        where: { id: product.id }
      });
      
      await prisma.productTransaction.create({
        data: {
          cabangId: payload.cabangId,
          customerName: customerName,
          customerPhone: customerPhone || null,
          productId: product.id,
          productNameSnapshot: productData.name,
          quantity: product.quantity,
          pricePerUnitSnapshot: productData.basePrice,
          totalPrice: productData.basePrice * product.quantity,
          recommenderId: recommendedBy || null,
          recommenderRole: recommendedBy ? 'KASIR' : null,
          commissionPerUnitSnapshot: productData.commissionPerUnit,
          commissionAmount: recommendedBy ? productData.commissionPerUnit * product.quantity : 0,
          closingById: completedBy,
          closingByRole: 'KASIR',
          closingByNameSnapshot: 'Kasir',
          paymentMethod: paymentMethod
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Product sale error:', error);
    return NextResponse.json({ error: 'Failed to process product sale' }, { status: 500 });
  }
}