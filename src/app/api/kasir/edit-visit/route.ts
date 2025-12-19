import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prismaClient';
import { requireAuth } from '@/lib/auth';

export async function PUT(request: NextRequest) {
  try {
    const session = await requireAuth('KASIR');
    const { visitId, serviceCapsterPairs } = await request.json();

    if (!visitId || !serviceCapsterPairs || serviceCapsterPairs.length === 0) {
      return NextResponse.json({ error: 'Visit ID and service-capster pairs required' }, { status: 400 });
    }

    // Update visit services with capster assignments
    const result = await prisma.$transaction(async (tx) => {
      // Remove existing services
      await tx.visitService.deleteMany({
        where: { visitId }
      });

      // Add new service-capster pairs
      for (const pair of serviceCapsterPairs) {
        if (pair.serviceId && pair.capsterId) {
          await tx.visitService.create({
            data: {
              visitId,
              serviceId: pair.serviceId,
              capsterId: pair.capsterId
            }
          });
        }
      }

      // Get updated visit
      const updatedVisit = await tx.customerVisit.findUnique({
        where: { id: visitId },
        include: {
          capster: { select: { name: true } },
          visitServices: {
            include: {
              service: { select: { name: true, basePrice: true, category: true } },
              capster: { select: { name: true } }
            }
          }
        }
      });

      return updatedVisit;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Edit visit error:', error);
    return NextResponse.json({ error: 'Failed to update visit' }, { status: 500 });
  }
}