import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prismaClient'

// GET - List all kasir
export async function GET() {
  try {
    const kasir = await prisma.cashierMaster.findMany({
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json(kasir)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch kasir' }, { status: 500 })
  }
}

// POST - Create new kasir
export async function POST(request: NextRequest) {
  try {
    const { name, phone } = await request.json()
    
    const kasir = await prisma.cashierMaster.create({
      data: { name, phone }
    })
    
    return NextResponse.json(kasir)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create kasir' }, { status: 500 })
  }
}

// DELETE - Delete kasir
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 })
    }
    
    await prisma.cashierMaster.delete({
      where: { id }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete kasir' }, { status: 500 })
  }
}