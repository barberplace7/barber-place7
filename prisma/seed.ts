import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Clear existing data
  await prisma.cashierMaster.deleteMany()
  await prisma.user.deleteMany()
  await prisma.barberBranch.deleteMany()
  console.log('🗑️ Cleared existing data')

  // 1. Create Branches (sesuai landing page)
  const kapugeran = await prisma.barberBranch.create({
    data: {
      name: 'Barberplace One (Kapugeran)',
      address: 'Jl. Kapugeran No.12 L, RT.008/RW.002, Rangkasbitung Barat, Kec. Rangkasbitung, Kabupaten Lebak, Banten 42312'
    }
  })

  const balong = await prisma.barberBranch.create({
    data: {
      name: 'Barberplace Venus (Balong)', 
      address: 'Jl. Kapugeran No.12 L, RT.008/RW.002, Rangkasbitung Barat, Kec. Rangkasbitung, Kabupaten Lebak, Banten 42312'
    }
  })

  console.log('✅ Branches created')

  // 2. Create Users (Admin + Branch Credentials)
  const hashedPassword = await bcrypt.hash('password123', 10)

  const admin = await prisma.user.create({
    data: {
      username: 'admin',
      password: hashedPassword,
      role: 'ADMIN',
      cabangId: null // admin tidak terikat cabang
    }
  })

  const cabang1User = await prisma.user.create({
    data: {
      username: 'cabang1',
      password: hashedPassword,
      role: 'KASIR',
      cabangId: kapugeran.id
    }
  })

  const cabang2User = await prisma.user.create({
    data: {
      username: 'cabang2',
      password: hashedPassword,
      role: 'KASIR',
      cabangId: balong.id
    }
  })

  console.log('✅ Users created')
  console.log('👤 Admin: admin / password123')
  console.log('👤 Cabang 1: cabang1 / password123 (Kapugeran)')
  console.log('👤 Cabang 2: cabang2 / password123 (Balong)')

  // 3. Create Global Cashiers (bisa rolling antar cabang)
  await prisma.cashierMaster.createMany({
    data: [
      { name: 'Budi Santoso', phone: '081234567890' },
      { name: 'Sari Dewi', phone: '081234567891' },
      { name: 'Ahmad Rizki', phone: '081234567892' },
      { name: 'Maya Sari', phone: '081234567893' }
    ]
  })

  console.log('✅ Sample cashiers created')

  console.log('\n📋 Login Instructions:')
  console.log('1. Admin → admin/password123 (full access)')
  console.log('2. Cabang 1 → cabang1/password123 → pilih kasir')
  console.log('3. Cabang 2 → cabang2/password123 → pilih kasir')
  console.log('🎉 Seed completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })