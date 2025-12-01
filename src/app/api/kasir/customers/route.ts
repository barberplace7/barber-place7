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
            service: { select: { id: true, name: true, basePrice: true, category: true } }
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
    const { name, phone, services, capsterId } = await request.json();

    if (!name || !services || services.length === 0 || !capsterId) {
      return NextResponse.json({ error: 'Name, at least one service, and capster required' }, { status: 400 });
    }

    // Create customer visit with selected services
    const result = await prisma.$transaction(async (tx) => {
      // Create the main visit
      const visit = await tx.customerVisit.create({
        data: {
          cabangId: session.cabangId!,
          customerName: name,
          customerPhone: phone || null,
          capsterId: capsterId,
          status: 'ONGOING'
        },
        include: {
          capster: { select: { name: true } }
        }
      });

      // Add all selected services to visit
      for (const serviceId of services) {
        await tx.visitService.create({
          data: {
            visitId: visit.id,
            serviceId: serviceId
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
              service: { select: { id: true, name: true, basePrice: true, category: true } }
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