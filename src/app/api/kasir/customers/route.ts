import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prismaClient';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    const session = await requireAuth('KASIR');
    
    // Filter by branch for kasir, admin can see all
    const whereClause = session.role === 'ADMIN' 
      ? {} 
      : { cabangId: session.cabangId };

    const customers = await prisma.customerVisit.findMany({
      where: {
        ...whereClause,
        status: 'ONGOING'
      },
      include: {
        capster: { select: { name: true } },
        cabang: { select: { name: true } },
        visitServices: {
          include: {
            service: { select: { id: true, name: true, basePrice: true, category: true } },
            capster: { select: { name: true } }
          }
        },
        serviceTransactions: { select: { paketName: true, priceFinal: true } }
      },
      orderBy: { jamMasuk: 'desc' }
    });

    return NextResponse.json(customers);
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth('KASIR');
    const { name, phone, serviceCapsterPairs } = await request.json();

    if (!name || !serviceCapsterPairs || serviceCapsterPairs.length === 0) {
      return NextResponse.json({ error: 'Name and at least one service-capster pair required' }, { status: 400 });
    }

    // Create customer visit with service-capster pairs
    const result = await prisma.$transaction(async (tx) => {
      // Use first capster as main capster for backward compatibility
      const mainCapsterId = serviceCapsterPairs[0].capsterId;
      
      // Create the main visit
      const visit = await tx.customerVisit.create({
        data: {
          cabangId: session.cabangId!,
          customerName: name,
          customerPhone: phone || null,
          capsterId: mainCapsterId,
          status: 'ONGOING'
        },
        include: {
          capster: { select: { name: true } }
        }
      });

      // Add all service-capster pairs to visit
      for (const pair of serviceCapsterPairs) {
        await tx.visitService.create({
          data: {
            visitId: visit.id,
            serviceId: pair.serviceId,
            capsterId: pair.capsterId
          }
        });
      }

      // Get services for response
      const visitWithServices = await tx.customerVisit.findUnique({
        where: { id: visit.id },
        include: {
          capster: { select: { name: true } },
          visitServices: {
            include: {
              service: { select: { id: true, name: true, basePrice: true, category: true } },
              capster: { select: { name: true } }
            }
          }
        }
      });

      return visitWithServices;
    });
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Customer creation error:', error);
    return NextResponse.json({ error: 'Failed to create customer visit' }, { status: 500 });
  }
}