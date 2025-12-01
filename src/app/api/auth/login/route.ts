import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prismaClient'
import bcrypt from 'bcryptjs'
import { SignJWT } from 'jose'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    // Find user
    const user = await prisma.user.findUnique({
      where: { username },
      include: { cabang: true }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Check password
    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Create session data
    const sessionData = {
      id: user.id,
      username: user.username,
      role: user.role,
      cabangId: user.cabangId,
      cabangName: user.cabang?.name || null
    }

    // Create JWT token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key')
    const token = await new SignJWT({
      userId: user.id,
      username: user.username,
      role: user.role,
      cabangId: user.cabangId
    })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(secret)

    const response = NextResponse.json({ 
      success: true, 
      user: sessionData,
      redirectTo: user.role === 'ADMIN' ? '/admin' : '/kasir'
    })

    response.cookies.set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 // 24 hours
    })

    return response

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}