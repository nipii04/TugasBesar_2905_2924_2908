import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Clearing old data...')
  await prisma.transactionGood.deleteMany()
  await prisma.deliveryDetail.deleteMany()
  await prisma.transaction.deleteMany()
  await prisma.good.deleteMany()
  await prisma.port.deleteMany()
  await prisma.vessel.deleteMany()
  await prisma.user.deleteMany()

  console.log('Seeding Users (Data Master)...')
  const users = []
  const roles = ['Admin', 'Fleet Superintendent', 'Pelanggan']
  for (let i = 1; i <= 10; i++) {
    users.push(
      await prisma.user.create({
        data: {
          username: `user${i}`,
          name: `Customer Name ${i}`,
          password: `pass${i}`,
          role: roles[i % 3], // Campuran role
        },
      })
    )
  }

  console.log('Seeding Vessels (Data Master)...')
  const vessels = []
  const vesselTypes = ['Container Ship', 'Bulk Carrier', 'Tanker']
  for (let i = 1; i <= 10; i++) {
    vessels.push(
      await prisma.vessel.create({
        data: {
          name: `Ocean Vessel ${i}`,
          type: vesselTypes[i % 3],
          status: i % 2 === 0 ? 'ACTIVE' : 'DOCKED',
          capacity: 10000 + i * 1000,
          buildYear: 2010 + i,
          assignedKey: `MV-OCEAN-${i}`,
        },
      })
    )
  }

  console.log('Seeding Ports (Data Master)...')
  const ports = []
  const cities = ['Jakarta', 'Surabaya', 'Tokyo', 'Singapore', 'Rotterdam', 'New York', 'Shanghai', 'Busan', 'Dubai', 'Sydney']
  const countries = ['ID', 'ID', 'JP', 'SG', 'NL', 'US', 'CN', 'KR', 'AE', 'AU']
  for (let i = 0; i < 10; i++) {
    ports.push(
      await prisma.port.create({
        data: {
          code: `PRT-${i+1}`,
          name: `Port of ${cities[i]}`,
          city: cities[i],
          country: countries[i],
        },
      })
    )
  }

  console.log('Seeding Goods (Data Master)...')
  const goods = []
  const goodTypes = ['Electronics', 'Furniture', 'Machinery', 'Food', 'Textiles']
  for (let i = 1; i <= 10; i++) {
    goods.push(
      await prisma.good.create({
        data: {
          name: `Good Item ${i}`,
          description: `Description for good item ${i}`,
          type: goodTypes[i % 5],
        },
      })
    )
  }

  console.log('Seeding Transactions...')
  const transactions = []
  // Menggunakan pelanggan user (role 'Pelanggan') - misal user[2], user[5], user[8]
  const pelangganUsers = users.filter(u => u.role === 'Pelanggan')
  const fallbackPelanggan = pelangganUsers.length > 0 ? pelangganUsers[0] : users[0]

  const statusList = ['ON SCHEDULE', 'PORT CLEARANCE', 'IN TRANSIT', 'ARRIVED']
  
  for (let i = 1; i <= 10; i++) {
    const originPort = ports[i % 10]
    const destinationPort = ports[(i + 3) % 10]
    
    transactions.push(
      await prisma.transaction.create({
        data: {
          trackingNumber: `TRX-2026-${1000 + i}`,
          status: statusList[i % 4],
          estArrival: new Date(`2026-06-${String((i % 28) + 1).padStart(2, '0')}T00:00:00.000Z`),
          customerId: fallbackPelanggan.id,
          vesselId: vessels[i % 10].id,
          originId: originPort.id,
          destinationId: destinationPort.id,
        },
      })
    )
  }

  console.log('Seeding DeliveryDetails (One to One)...')
  for (let i = 0; i < 10; i++) {
    await prisma.deliveryDetail.create({
      data: {
        transactionId: transactions[i].id,
        currentLat: -6.2088 + (i * 0.1),
        currentLng: 106.8456 + (i * 0.1),
        notes: `Delivery notes for transaction ${i+1}`,
        receivedBy: i % 2 === 0 ? null : `Receiver ${i+1}`,
        receivedAt: i % 2 === 0 ? null : new Date(),
      },
    })
  }

  console.log('Seeding TransactionGoods (Many to Many)...')
  // Tiap transaksi memiliki 2 barang
  for (let i = 0; i < 10; i++) {
    await prisma.transactionGood.create({
      data: {
        transactionId: transactions[i].id,
        goodId: goods[i % 10].id,
        quantity: (i + 1) * 5,
        weight: (i + 1) * 10.5,
      },
    })
    await prisma.transactionGood.create({
      data: {
        transactionId: transactions[i].id,
        goodId: goods[(i + 1) % 10].id,
        quantity: (i + 2) * 2,
        weight: (i + 2) * 5.0,
      },
    })
  }

  console.log('Seeding Complete! Database is populated with 10+ dummy data for each table.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
