import { PrismaClient, ServiceCategory } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding services...');

  // Check existing services
  const existing = await prisma.servicePackage.findMany();
  if (existing.length > 0) {
    console.log(`⚠️  Found ${existing.length} existing services. Skipping seed.`);
    console.log('💡 To re-seed, manually delete services from admin panel first.');
    return;
  }

  // Hair Cut Services
  const haircuts = [
    { name: 'Reguler (Hair cut only)', basePrice: 30000, commissionAmount: 12000, category: ServiceCategory.HAIRCUT },
    { name: 'Premium (Cut and Hair wash)', basePrice: 40000, commissionAmount: 16000, category: ServiceCategory.HAIRCUT },
    { name: 'Platinum (Cut and Hair wash 2x)', basePrice: 50000, commissionAmount: 20000, category: ServiceCategory.HAIRCUT },
    { name: 'Diamond (Cut, Hair wash and Black mask)', basePrice: 90000, commissionAmount: 35000, category: ServiceCategory.HAIRCUT },
  ];

  // Treatment Services
  const treatments = [
    { name: 'Black Mask', basePrice: 50000, commissionAmount: 15000, category: ServiceCategory.TREATMENT },
    { name: 'Gold Mask', basePrice: 60000, commissionAmount: 20000, category: ServiceCategory.TREATMENT },
    { name: 'Shaving', basePrice: 10000, commissionAmount: 4000, category: ServiceCategory.TREATMENT },
    { name: 'Hair Wash', basePrice: 15000, commissionAmount: 5000, category: ServiceCategory.TREATMENT },
    { name: 'Creambath', basePrice: 50000, commissionAmount: 20000, category: ServiceCategory.TREATMENT },
    { name: 'Black Colouring', basePrice: 80000, commissionAmount: 26000, category: ServiceCategory.TREATMENT },
    { name: 'Highlight Colouring', basePrice: 250000, commissionAmount: 83000, category: ServiceCategory.TREATMENT },
    { name: 'Full Colouring', basePrice: 350000, commissionAmount: 116000, category: ServiceCategory.TREATMENT },
    { name: 'Perming Hair', basePrice: 250000, commissionAmount: 83000, category: ServiceCategory.TREATMENT },
    { name: 'Down Perm', basePrice: 200000, commissionAmount: 66000, category: ServiceCategory.TREATMENT },
  ];

  // Insert all services
  for (const service of [...haircuts, ...treatments]) {
    await prisma.servicePackage.create({
      data: service
    });
    console.log(`✅ Created: ${service.name}`);
  }

  console.log('✨ Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
