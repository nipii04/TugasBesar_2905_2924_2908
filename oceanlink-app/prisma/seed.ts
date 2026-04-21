import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Clearing old data...')
  await prisma.cargo.deleteMany()
  await prisma.vessel.deleteMany()
  await prisma.user.deleteMany()

  console.log('Seeding Users...')
  const admin = await prisma.user.create({
    data: {
      username: 'admin',
      name: 'System Administrator',
      password: 'admin', // in real app, hash this
      role: 'Admin',
    },
  })

  const fleet = await prisma.user.create({
    data: {
      username: 'fleet',
      name: 'Operations Manager',
      password: 'fleet', // in real app, hash this
      role: 'Fleet Superintendent',
    },
  })

  const pelanggan = await prisma.user.create({
    data: {
      username: 'pelanggan',
      name: 'Global Logistics Corp',
      password: 'pelanggan', // in real app, hash this
      role: 'Pelanggan',
    },
  })

  console.log('Seeding Vessels...')
  const vessel1 = await prisma.vessel.create({
    data: {
      name: 'Ocean Navigator',
      type: 'Container Ship',
      status: 'ACTIVE',
      capacity: 18000,
      buildYear: 2018,
      assignedKey: 'MV-OCEAN-NAVIGATOR',
    },
  })

  const vessel2 = await prisma.vessel.create({
    data: {
      name: 'Pacific Star',
      type: 'Bulk Carrier',
      status: 'DOCKED',
      capacity: 15000,
      buildYear: 2021,
      assignedKey: 'MV-PACIFIC-STAR',
    },
  })

  console.log('Seeding Cargos...')
  await prisma.cargo.create({
    data: {
      trackingNumber: 'OL2026041301',
      origin: 'Jakarta, ID',
      destination: 'Tokyo, JP',
      status: 'ON SCHEDULE',
      cargoType: 'Standard Container (20ft)',
      weight: 12000, // 12 tons
      estArrival: new Date('2026-04-24T00:00:00.000Z'),
      currentLat: 14.59,
      currentLng: 119.98,
      customerId: pelanggan.id,
      vesselId: vessel1.id,
    },
  })

  await prisma.cargo.create({
    data: {
      trackingNumber: 'OL2026041302',
      origin: 'Singapore, SG',
      destination: 'Sydney, AU',
      status: 'PORT CLEARANCE',
      cargoType: 'Refrigerated Container (40ft)',
      weight: 18500, // 18.5 tons
      estArrival: new Date('2026-05-02T00:00:00.000Z'),
      currentLat: 1.29,
      currentLng: 103.85,
      customerId: pelanggan.id,
      vesselId: vessel2.id,
    },
  })

  await prisma.cargo.create({
    data: {
      trackingNumber: 'OL2026041303',
      origin: 'Rotterdam, NL',
      destination: 'New York, US',
      status: 'IN TRANSIT',
      cargoType: 'Liquid Bulk',
      weight: 25000, // 25 tons
      estArrival: new Date('2026-04-28T00:00:00.000Z'),
      currentLat: 45.12,
      currentLng: -30.45,
      customerId: pelanggan.id,
      vesselId: vessel1.id, // Assume multiple cargos on one vessel
    },
  })

  console.log('Seeding Complete! Database is populated with dummy data.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
