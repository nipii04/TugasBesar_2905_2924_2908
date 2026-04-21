import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Sedikit delay atau log untuk mensimulasikan proses kerja
    console.log("Seeding database via Prisma in OceanLink App...");

    // 1. Seed Users (Upsert mencegah data double kalau diklik berkali-kali)
    await prisma.user.upsert({
      where: { username: 'admin_master' },
      update: {},
      create: {
        username: 'admin_master',
        name: 'Master Admin',
        password: 'hashed123',
        role: 'Admin',
      },
    });

    await prisma.user.upsert({
      where: { username: 'fleet_manager' },
      update: {},
      create: {
        username: 'fleet_manager',
        name: 'Captain Jack',
        password: 'hashed123',
        role: 'Fleet Superintendent',
      },
    });

    // 2. Seed Vessels
    await prisma.vessel.upsert({
      where: { name: 'Ocean Navigator' },
      update: {},
      create: {
        name: 'Ocean Navigator',
        type: 'Container Ship',
        status: 'ACTIVE',
        capacity: 12000,
        buildYear: 2020,
        assignedKey: 'MV-OCEAN-NAVIGATOR',
      },
    });

    await prisma.vessel.upsert({
      where: { name: 'Sea Voyager' },
      update: {},
      create: {
        name: 'Sea Voyager',
        type: 'Bulk Carrier',
        status: 'DOCKED',
        capacity: 50000,
        buildYear: 2015,
        assignedKey: 'MV-SEA-VOYAGER',
      },
    });

    // Karena guide meminta pesan "Database seeded successfully"
    return Response.json({ message: "Database seeded successfully" }, { status: 200 });
  } catch (error) {
    console.error('Error seeding database:', error);
    return Response.json({ error: "Failed to seed database" }, { status: 500 });
  }
}
