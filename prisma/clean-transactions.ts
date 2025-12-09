import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Cleaning all transactions...');

  // Delete in correct order (child tables first)
  
  // 1. Delete advance deductions
  const deductions = await prisma.advanceDeduction.deleteMany({});
  console.log(`✅ Deleted ${deductions.count} advance deductions`);

  // 2. Delete staff advances
  const advances = await prisma.staffAdvance.deleteMany({});
  console.log(`✅ Deleted ${advances.count} staff advances`);

  // 3. Delete service transactions
  const serviceTransactions = await prisma.serviceTransaction.deleteMany({});
  console.log(`✅ Deleted ${serviceTransactions.count} service transactions`);

  // 4. Delete product transactions
  const productTransactions = await prisma.productTransaction.deleteMany({});
  console.log(`✅ Deleted ${productTransactions.count} product transactions`);

  // 5. Delete visit services (junction table)
  const visitServices = await prisma.visitService.deleteMany({});
  console.log(`✅ Deleted ${visitServices.count} visit services`);

  // 6. Delete customer visits
  const visits = await prisma.customerVisit.deleteMany({});
  console.log(`✅ Deleted ${visits.count} customer visits`);

  // 7. Delete expenses
  const expenses = await prisma.branchExpense.deleteMany({});
  console.log(`✅ Deleted ${expenses.count} expenses`);

  console.log('✨ All transactions cleaned! Database is fresh.');
}

main()
  .catch((e) => {
    console.error('❌ Cleaning failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
