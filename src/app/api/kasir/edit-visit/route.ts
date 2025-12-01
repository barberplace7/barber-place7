import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prismaClient';
import { requireAuth } from '@/lib/auth';

export async function PUT(request: NextRequest) {
  try {
    const session = await requireAuth('KASIR');
    const { visitId, services } = await request.json();

    if (!visitId || !services || services.length === 0) {
      return NextResponse.json({ error: 'Visit ID and services required' }, { status: 400 });
    }

    // Update visit services
    const result = await prisma.$transaction(async (tx) => {
      // Remove existing services
      await tx.visitService.deleteMany({
        where: { visitId }
      });

      // Add new services (filter out null/invalid IDs)
      for (const serviceId of services) {
        if (serviceId && typeof serviceId === 'string') {
          await tx.visitService.create({
            data: {
              visitId,
              serviceId
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
              service: { select: { name: true, basePrice: true, category: true } }
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