import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log('Clearing database...')
  await prisma.deliveryDetail.deleteMany()
  await prisma.transactionGood.deleteMany()
  await prisma.transaction.deleteMany()
  await prisma.good.deleteMany()
  await prisma.port.deleteMany()
  await prisma.route.deleteMany()
  await prisma.vessel.deleteMany()
  await prisma.shipmentLog.deleteMany()
  await prisma.user.deleteMany()

  console.log('Seeding Users...')
  const users = []
  for (let i = 1; i <= 10; i++) {
    const role = i <= 2 ? 'Admin' : i <= 4 ? 'Fleet Superintendent' : 'Pelanggan'
    const user = await prisma.user.create({
      data: {
        username: `user${i}`,
        name: `User ${role} ${i}`,
        password: `password${i}`,
        role: role,
      }
    })
    users.push(user)
  }

  console.log('Seeding Vessels...')
  const vessels = []
  const vesselTypes = ['Container Ship', 'Bulk Carrier', 'Tanker']
  const vesselStatuses = ['ACTIVE', 'MAINTENANCE', 'DOCKED']
  for (let i = 1; i <= 10; i++) {
    const vessel = await prisma.vessel.create({
      data: {
        name: `MV Ocean ${i}`,
        type: vesselTypes[i % 3],
        status: vesselStatuses[i % 3],
        capacity: 1000 + i * 500,
        buildYear: 2010 + (i % 10),
        assignedKey: `VESSEL-KEY-${i}`,
      }
    })
    vessels.push(vessel)
  }

  console.log('Seeding Ports...')
  const ports = []
  const portCities = ['Jakarta', 'Singapore', 'Tokyo', 'Shanghai', 'Sydney', 'Manila', 'Bangkok', 'Ho Chi Minh', 'Mumbai', 'Hong Kong']
  const portCountries = ['Indonesia', 'Singapore', 'Japan', 'China', 'Australia', 'Philippines', 'Thailand', 'Vietnam', 'India', 'Hong Kong']
  for (let i = 0; i < 10; i++) {
    const port = await prisma.port.create({
      data: {
        code: `PRT-${i+1}`,
        name: `${portCities[i]} International Port`,
        city: portCities[i],
        country: portCountries[i],
      }
    })
    ports.push(port)
  }

  console.log('Seeding Routes...')
  const routes = []
  const routePairs = [
    { origin: 0, dest: 1, dist: 1200, days: 3, rate: 250000 },
    { origin: 0, dest: 2, dist: 5300, days: 7, rate: 550000 },
    { origin: 1, dest: 3, dist: 3800, days: 5, rate: 450000 },
    { origin: 2, dest: 4, dist: 7800, days: 10, rate: 650000 },
    { origin: 3, dest: 5, dist: 1500, days: 4, rate: 350000 },
    { origin: 0, dest: 5, dist: 2500, days: 4, rate: 350000 },
    { origin: 1, dest: 6, dist: 1400, days: 3, rate: 320000 },
    { origin: 6, dest: 7, dist: 800, days: 2, rate: 300000 },
    { origin: 1, dest: 8, dist: 3900, days: 6, rate: 380000 },
    { origin: 3, dest: 9, dist: 1200, days: 3, rate: 400000 },
  ]
  
  for (const pair of routePairs) {
    const origin = ports[pair.origin]
    const dest = ports[pair.dest]
    const route = await prisma.route.create({
      data: {
        name: `${origin.city} to ${dest.city}`,
        originCity: origin.city,
        destinationCity: dest.city,
        originCountry: origin.country,
        destinationCountry: dest.country,
        distanceKm: pair.dist,
        estimatedDays: pair.days,
        baseRatePerKg: pair.rate,
        isActive: true,
      }
    })
    routes.push(route)
  }

  console.log('Seeding Goods...')
  const goods = []
  const goodTypes = ['General', 'Perishable', 'Hazardous', 'Fragile', 'Heavy Machinery']
  for (let i = 1; i <= 10; i++) {
    const good = await prisma.good.create({
      data: {
        name: `Commodity ${i}`,
        description: `Description for commodity ${i}`,
        type: goodTypes[i % 5],
      }
    })
    goods.push(good)
  }

  console.log('Seeding Transactions...')
  const pelangganUsers = users.filter(u => u.role === 'Pelanggan')
  const transactionStatuses = ['ON SCHEDULE', 'PORT CLEARANCE', 'IN TRANSIT']
  
  for (let i = 1; i <= 10; i++) {
    const customer = pelangganUsers[i % pelangganUsers.length]
    const vessel = vessels[i % vessels.length]
    const origin = ports[i % ports.length]
    const destination = ports[(i + 1) % ports.length]
    
    const estArrival = new Date()
    estArrival.setDate(estArrival.getDate() + 5 + i)

    const transaction = await prisma.transaction.create({
      data: {
        trackingNumber: `TRK-${(Date.now() + i).toString().slice(-6)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`, // Match CRUD format
        status: transactionStatuses[i % 3],
        estArrival: estArrival,
        customerId: customer.id,
        vesselId: vessel.id,
        originId: origin.id,
        destinationId: destination.id,
        senderName: `Sender ${i}`,
        receiverName: `Receiver ${i}`,
        phone: `+62812345678${i}`,
        originCity: origin.city,
        destinationCity: destination.city,
        shippingType: 'Standard Container (20ft)',
        price: 15000000.0 + (i * 2500000.0), // Puluhan juta Rupiah
        
        deliveryDetail: {
          create: {
            currentLat: origin.city === 'Jakarta' ? -6.2 : 1.3 + (i * 0.1),
            currentLng: origin.city === 'Jakarta' ? 106.8 : 103.8 + (i * 0.1),
            notes: `Shipment ${i} en route`,
          }
        },
        
        transactionGoods: {
          create: [
            {
              goodId: goods[i % goods.length].id,
              quantity: 10 + i,
              weight: 50.5 + i,
            }
          ]
        }
      }
    })
  }

  console.log('Seeding Shipment Logs...')
  const adminUser = users.find(u => u.role === 'Admin')
  const allTransactions = await prisma.transaction.findMany()
  for (let i = 0; i < allTransactions.length; i++) {
    const t = allTransactions[i]
    await prisma.shipmentLog.create({
      data: {
        action: 'CREATED',
        description: `Shipment ${t.trackingNumber} has been registered into the system.`,
        oldStatus: null,
        newStatus: 'Diproses',
        transactionId: t.id,
        userId: adminUser?.id,
        createdAt: new Date(Date.now() - 86400000 * 2) // 2 days ago
      }
    })
    
    if (t.status !== 'Diproses') {
      await prisma.shipmentLog.create({
        data: {
          action: 'STATUS_CHANGED',
          description: `Shipment status updated to ${t.status}.`,
          oldStatus: 'Diproses',
          newStatus: t.status,
          transactionId: t.id,
          userId: adminUser?.id,
          createdAt: new Date(Date.now() - 86400000 * 1) // 1 day ago
        }
      })
    }
  }

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
