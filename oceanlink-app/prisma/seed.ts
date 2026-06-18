import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log('Clearing database...')
  await prisma.deliveryDetail.deleteMany()
  await prisma.transaction.deleteMany()
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



  console.log('Seeding Transactions...')
  const pelangganUsers = users.filter(u => u.role === 'Pelanggan')
  
  const voyagePlans = [
    { vessel: vessels[0], route: routes[0], status: 'Dalam Pengiriman', daysAgo: 3, shipStatus: 'ACTIVE' },
    { vessel: vessels[1], route: routes[1], status: 'PORT CLEARANCE', daysAgo: 1, shipStatus: 'ACTIVE' },
    { vessel: vessels[2], route: routes[2], status: 'Diproses', daysAgo: 0, shipStatus: 'DOCKED' },
    { vessel: vessels[3], route: routes[3], status: 'Diproses', daysAgo: 0, shipStatus: 'DOCKED' },
  ]
  
  for (const plan of voyagePlans) {
    await prisma.vessel.update({
      where: { id: plan.vessel.id },
      data: { status: plan.shipStatus }
    })
  }

  let txCounter = 0;
  for (const plan of voyagePlans) {
    const estArrival = new Date()
    estArrival.setDate(estArrival.getDate() + plan.route.estimatedDays - plan.daysAgo)
    
    for (let j = 0; j < 3; j++) {
      txCounter++;
      const customer = pelangganUsers[txCounter % pelangganUsers.length]
      const createdAt = new Date()
      createdAt.setDate(createdAt.getDate() - plan.daysAgo - (j * 0.5)) // spread creation times

      await prisma.transaction.create({
        data: {
          trackingNumber: `TRK-${(Date.now() + txCounter).toString().slice(-6)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
          status: plan.status,
          estArrival: estArrival,
          customerId: customer.id,
          vesselId: plan.vessel.id,
          originId: ports.find(p => p.city === plan.route.originCity)?.id || ports[0].id,
          destinationId: ports.find(p => p.city === plan.route.destinationCity)?.id || ports[1].id,
          senderName: `Sender ${txCounter}`,
          receiverName: `Receiver ${txCounter}`,
          phone: `+62812345678${txCounter}`,
          originCity: plan.route.originCity,
          destinationCity: plan.route.destinationCity,
          shippingType: j === 0 ? 'Vvip' : j === 1 ? 'Cepat' : 'Biasa',
          price: (plan.route.baseRatePerKg || 0) * 100 * (j === 0 ? 2.5 : j === 1 ? 1.5 : 1),
          createdAt: createdAt,
          
          deliveryDetail: {
            create: {
              currentLat: plan.route.originCity === 'Jakarta' ? -6.2 : 1.3 + (txCounter * 0.1),
              currentLng: plan.route.originCity === 'Jakarta' ? 106.8 : 103.8 + (txCounter * 0.1),
              notes: plan.status === 'Dalam Pengiriman' ? `Shipment in transit to ${plan.route.destinationCity}` : `Awaiting departure`,
            }
          },
          

        }
      })
    }
  }

  console.log('Seeding Shipment Logs...')
  const adminUser = users.find(u => u.role === 'Admin')
  const allTransactions = await prisma.transaction.findMany()
  
  for (const t of allTransactions) {
    await prisma.shipmentLog.create({
      data: {
        action: 'CREATED',
        description: `Shipment ${t.trackingNumber} has been registered into the system.`,
        oldStatus: null,
        newStatus: 'Diproses',
        transactionId: t.id,
        userId: adminUser?.id,
        createdAt: t.createdAt
      }
    })
    
    if (t.status === 'PORT CLEARANCE' || t.status === 'Dalam Pengiriman') {
      const pcDate = new Date(t.createdAt)
      pcDate.setHours(pcDate.getHours() + 12)
      
      await prisma.shipmentLog.create({
        data: {
          action: 'STATUS_CHANGED',
          description: `Shipment status updated to PORT CLEARANCE.`,
          oldStatus: 'Diproses',
          newStatus: 'PORT CLEARANCE',
          transactionId: t.id,
          userId: adminUser?.id,
          createdAt: pcDate
        }
      })
    }

    if (t.status === 'Dalam Pengiriman') {
      const transitDate = new Date(t.createdAt)
      transitDate.setHours(transitDate.getHours() + 24)
      
      await prisma.shipmentLog.create({
        data: {
          action: 'STATUS_CHANGED',
          description: `Shipment status updated to Dalam Pengiriman.`,
          oldStatus: 'PORT CLEARANCE',
          newStatus: 'Dalam Pengiriman',
          transactionId: t.id,
          userId: adminUser?.id,
          createdAt: transitDate
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
