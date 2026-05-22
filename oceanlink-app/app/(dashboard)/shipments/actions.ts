"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function addShipment(formData: FormData) {
  // Generate tracking number automatically
  const prefix = "TRK";
  const timestamp = Date.now().toString().slice(-6);
  const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
  const trackingNumber = `${prefix}-${timestamp}-${randomStr}`;

  const origin = formData.get("origin") as string;
  const destination = formData.get("destination") as string;
  const status = formData.get("status") as string;
  const cargoType = formData.get("cargoType") as string;
  const rawWeight = formData.get("weight") as string;
  const weight = rawWeight ? parseFloat(rawWeight) : null;
  const estArrival = new Date(formData.get("estArrival") as string);

  try {
    // Find first available masters to link
    const firstCustomer = await prisma.user.findFirst();
    const firstVessel = await prisma.vessel.findFirst();
    let originPort = await prisma.port.findFirst({ where: { name: { contains: origin, mode: 'insensitive' } } });
    if (!originPort) originPort = await prisma.port.findFirst();
    
    let destPort = await prisma.port.findFirst({ where: { name: { contains: destination, mode: 'insensitive' } } });
    if (!destPort) destPort = await prisma.port.findFirst();

    const newTransaction = await prisma.transaction.create({
      data: {
        trackingNumber,
        status: status || "ON SCHEDULE",
        estArrival: estArrival,
        customerId: firstCustomer?.id || '',
        vesselId: firstVessel?.id || '',
        originId: originPort?.id || '',
        destinationId: destPort?.id || '',
      },
    });
    
    // Create a Good based on cargoType
    const good = await prisma.good.create({
      data: {
        name: `Cargo ${trackingNumber}`,
        type: cargoType || "General",
      }
    });
    
    // Link Good to Transaction via TransactionGood
    await prisma.transactionGood.create({
      data: {
        transactionId: newTransaction.id,
        goodId: good.id,
        quantity: 1,
        weight: weight,
      }
    });
  } catch (error) {
    console.error("Error creating shipment:", error);
    throw new Error("Failed to create shipment");
  }

  revalidatePath("/shipments");
}

export async function getShipments(query: string = "", page: number = 1, pageSize: number = 12) {
  const skip = (page - 1) * pageSize;
  const where = query ? {
    OR: [
      { trackingNumber: { contains: query, mode: 'insensitive' as const } },
      { status: { contains: query, mode: 'insensitive' as const } },
      { originPort: { name: { contains: query, mode: 'insensitive' as const } } },
      { destinationPort: { name: { contains: query, mode: 'insensitive' as const } } }
    ]
  } : {};

  try {
    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        include: {
          originPort: true,
          destinationPort: true,
          transactionGoods: {
            include: { good: true }
          }
        }
      }),
      prisma.transaction.count({ where })
    ]);
    
    const mappedTransactions = transactions.map((t) => {
      const cargoType = t.transactionGoods?.[0]?.good?.type || "General Cargo";
      const totalWeight = t.transactionGoods?.reduce((sum, tg) => sum + (tg.weight || 0), 0) || null;
      
      return {
        id: t.id,
        trackingNumber: t.trackingNumber,
        status: t.status,
        estArrival: t.estArrival,
        createdAt: t.createdAt,
        cargoType: cargoType,
        weight: totalWeight,
        origin: t.originPort?.name || "Unknown Port",
        destination: t.destinationPort?.name || "Unknown Port"
      };
    });

    return { shipments: mappedTransactions, total, totalPages: Math.ceil(total / pageSize) };
  } catch (error) {
    console.error("Error fetching shipments:", error);
    return { shipments: [], total: 0, totalPages: 0 };
  }
}

export async function updateShipment(id: string, formData: FormData) {
  const status = formData.get("status") as string;
  const rawWeight = formData.get("weight") as string;
  const weight = rawWeight ? parseFloat(rawWeight) : null;
  const estArrival = new Date(formData.get("estArrival") as string);

  try {
    await prisma.transaction.update({
      where: { id },
      data: {
        status,
        estArrival
      }
    });

    // Option to update weight if there's a linked good
    const transactionGood = await prisma.transactionGood.findFirst({
      where: { transactionId: id }
    });
    if (transactionGood && weight !== null) {
      await prisma.transactionGood.update({
        where: {
          transactionId_goodId: {
            transactionId: id,
            goodId: transactionGood.goodId
          }
        },
        data: { weight }
      });
    }

  } catch (error) {
    console.error("Error updating shipment:", error);
    throw new Error("Failed to update shipment");
  }

  revalidatePath("/shipments");
  redirect("/shipments");
}

export async function deleteShipment(id: string) {
  try {
    // Need to delete related transactionGoods first due to FK constraints
    await prisma.transactionGood.deleteMany({
      where: { transactionId: id }
    });
    
    // Delete related delivery detail if exists
    await prisma.deliveryDetail.deleteMany({
      where: { transactionId: id }
    });

    await prisma.transaction.delete({
      where: { id }
    });
  } catch (error) {
    console.error("Error deleting shipment:", error);
    throw new Error("Failed to delete shipment.");
  }

  revalidatePath("/shipments");
}
