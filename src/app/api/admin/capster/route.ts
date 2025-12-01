import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prismaClient'

// GET - List all capster
export async function GET() {
  try {
    const capster = await prisma.capsterMaster.findMany({
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json(capster)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch capster' }, { status: 500 })
  }
}

// POST - Create new capster
export async function POST(request: NextRequest) {
  try {
    const { name, phone } = await request.json()
    
    const capster = await prisma.capsterMaster.create({
      data: { name, phone }
    })
    
    return NextResponse.json(capster)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create capster' }, { status: 500 })
  }
}

// DELETE - Delete capster
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 })
    }
    
    await prisma.capsterMaster.delete({
      where: { id }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete capster' }, { status: 500 })
  }
}