import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  console.log('Vessels:', await prisma.vessel.count());
  console.log('Transactions:', await prisma.transaction.count());
}
main();
