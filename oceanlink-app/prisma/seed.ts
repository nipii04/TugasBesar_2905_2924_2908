import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log('Clearing database...')
  await prisma.deliveryDetail.deleteMany()
  await prisma.transactionGood.deleteMany()
  await prisma.transaction.deleteMany()
  await prisma.good.deleteMany()
  await prisma.port.deleteMany()
  await prisma.vessel.deleteMany()
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
        trackingNumber: `OL202604130${i}`, // Follow format OL...
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
        price: 1500.0 + (i * 100),
        
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
