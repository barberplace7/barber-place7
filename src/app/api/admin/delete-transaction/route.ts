import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prismaClient';

export async function DELETE(request: NextRequest) {
  try {
    const { type, transactionId, visitId } = await request.json();
    
    console.log('Delete request:', { type, transactionId, visitId });
    
    if (!type) {
      return NextResponse.json({ error: 'Transaction type is required' }, { status: 400 });
    }

    if (type === 'SERVICE') {
      // Delete service transaction and related visit
      await prisma.$transaction(async (tx) => {
        // Delete service transactions
        await tx.serviceTransaction.deleteMany({
          where: { visitId: visitId }
        });
        
        // Delete product transactions related to this visit
        await tx.productTransaction.deleteMany({
          where: { visitId: visitId }
        });
        
        // Delete visit services
        await tx.visitService.deleteMany({
          where: { visitId: visitId }
        });
        
        // Delete the visit
        await tx.customerVisit.delete({
          where: { id: visitId }
        });
      });
    } else if (type === 'PRODUCT') {
      // Delete standalone product transaction
      if (!transactionId) {
        return NextResponse.json({ error: 'Transaction ID is required for product deletion' }, { status: 400 });
      }
      await prisma.productTransaction.delete({
        where: { id: transactionId }
      });
    } else if (type === 'EXPENSE') {
      // Delete expense
      await prisma.branchExpense.delete({
        where: { id: transactionId }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete transaction error:', error);
    return NextResponse.json({ error: 'Failed to delete transaction' }, { status: 500 });
  }
}