import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedServices() {
  const services = [
    // Hair Cut Services (40% commission)
    { name: 'Reguler (Just a Hair Cut)', category: 'HAIRCUT', basePrice: 30000, commissionRate: 0.40 },
    { name: 'Premium (Cut & Hair Wash)', category: 'HAIRCUT', basePrice: 40000, commissionRate: 0.40 },
    { name: 'Platinum (Cut & Hair Wash 2x)', category: 'HAIRCUT', basePrice: 50000, commissionRate: 0.40 },
    { name: 'Diamond (Cut, Hair Wash & Treatment Face)', category: 'HAIRCUT', basePrice: 70000, commissionRate: 0.40 },
    
    // Treatment Services (various commissions)
    { name: 'Black Mask', category: 'TREATMENT', basePrice: 40000, commissionRate: 0.30 },
    { name: 'Gold Mask', category: 'TREATMENT', basePrice: 50000, commissionRate: 0.30 },
    { name: 'Shaving (Mustache & Beard)', category: 'TREATMENT', basePrice: 10000, commissionRate: 0.40 },
    { name: 'Hair Wash & Styling', category: 'TREATMENT', basePrice: 15000, commissionRate: 0.40 },
    { name: 'Creambath', category: 'TREATMENT', basePrice: 50000, commissionRate: 0.40 },
    { name: 'Black Colouring', category: 'TREATMENT', basePrice: 80000, commissionRate: 0.33 },
    { name: 'Highlight Colouring', category: 'TREATMENT', basePrice: 250000, commissionRate: 0.33 },
    { name: 'Full Colouring', category: 'TREATMENT', basePrice: 350000, commissionRate: 0.33 },
    { name: 'Perm Hair & Cut', category: 'TREATMENT', basePrice: 250000, commissionRate: 0.33 },
    { name: 'Down Perm & Cut', category: 'TREATMENT', basePrice: 200000, commissionRate: 0.33 }
  ];

  // Clear existing services first
  await prisma.servicePackage.deleteMany({});
  
  // Create all services
  for (const service of services) {
    await prisma.servicePackage.create({
      data: service
    });
  }

  console.log('Services seeded successfully');
}

seedServices()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });