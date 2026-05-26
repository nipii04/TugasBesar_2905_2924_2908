"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getAllVessels() {
  return await prisma.vessel.findMany({
    orderBy: { name: 'asc' }
  });
}

export async function addShipment(formData: FormData) {
  const prefix = "TRK";
  const timestamp = Date.now().toString().slice(-6);
  const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
  const trackingNumber = `${prefix}-${timestamp}-${randomStr}`;

  // Transaction fields
  const senderName = formData.get("senderName") as string;
  const receiverName = formData.get("receiverName") as string;
  const phone = formData.get("phone") as string;
  const originCity = formData.get("originCity") as string;
  const destinationCity = formData.get("destinationCity") as string;
  const shippingType = formData.get("shippingType") as string;
  const rawPrice = formData.get("price") as string;
  const price = rawPrice ? parseFloat(rawPrice) : null;
  const status = formData.get("status") as string;
  const estArrivalStr = formData.get("estArrival") as string;
  const estArrival = estArrivalStr ? new Date(estArrivalStr) : new Date();

  // Good fields
  const cargoName = formData.get("cargoName") as string || `Cargo ${trackingNumber}`;
  const cargoType = formData.get("cargoType") as string || "General";
  const cargoDescription = formData.get("cargoDescription") as string;
  const rawWeight = formData.get("weight") as string;
  const weight = rawWeight ? parseFloat(rawWeight) : null;

  // Vessel fields
  const vesselId = formData.get("vesselId") as string;

  try {
    // 1. Get or Create User (Customer) for relation - bypassing with first user for now
    let firstCustomer = await prisma.user.findFirst();
    if (!firstCustomer) {
       firstCustomer = await prisma.user.create({
         data: { username: `dummy_${Date.now()}`, name: 'Dummy', password: '123', role: 'Pelanggan' }
       });
    }

    if (!vesselId) {
       throw new Error("Vessel must be selected");
    }

    // 3. Create Good
    const good = await prisma.good.create({
      data: {
        name: cargoName,
        type: cargoType,
        description: cargoDescription,
      }
    });

    // 4. Create Transaction
    const newTransaction = await prisma.transaction.create({
      data: {
        trackingNumber,
        status: status || "ON SCHEDULE",
        estArrival,
        senderName,
        receiverName,
        phone,
        originCity,
        destinationCity,
        shippingType,
        price,
        customerId: firstCustomer.id,
        vesselId: vesselId,
      },
    });

    // 5. Create TransactionGood
    await prisma.transactionGood.create({
      data: {
        transactionId: newTransaction.id,
        goodId: good.id,
        quantity: 1,
        weight,
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
      { senderName: { contains: query, mode: 'insensitive' as const } },
      { receiverName: { contains: query, mode: 'insensitive' as const } },
      { transactionGoods: { some: { good: { name: { contains: query, mode: 'insensitive' as const } } } } }
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
          vessel: true,
          transactionGoods: {
            include: { good: true }
          }
        }
      }),
      prisma.transaction.count({ where })
    ]);
    
    return { shipments: transactions, total, totalPages: Math.ceil(total / pageSize) };
  } catch (error) {
    console.error("Error fetching shipments:", error);
    return { shipments: [], total: 0, totalPages: 0 };
  }
}

export async function updateShipment(id: string, formData: FormData) {
  const status = formData.get("status") as string;
  const rawPrice = formData.get("price") as string;
  const price = rawPrice ? parseFloat(rawPrice) : undefined;
  
  const vesselName = formData.get("vesselName") as string;
  const vesselType = formData.get("vesselType") as string;
  const vesselCode = formData.get("vesselCode") as string;
  const rawCapacity = formData.get("vesselCapacity") as string;
  const vesselCapacity = rawCapacity ? parseInt(rawCapacity) : undefined;
  const vesselStatus = formData.get("vesselStatus") as string;

  try {
    const tx = await prisma.transaction.update({
      where: { id },
      data: {
        status,
        price,
      },
      include: { vessel: true }
    });

    if (tx.vesselId) {
      await prisma.vessel.update({
        where: { id: tx.vesselId },
        data: {
          name: vesselName,
          type: vesselType,
          assignedKey: vesselCode,
          capacity: vesselCapacity,
          status: vesselStatus,
        }
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
    const txGoods = await prisma.transactionGood.findMany({
      where: { transactionId: id }
    });
    const goodIds = txGoods.map(tg => tg.goodId);

    await prisma.transactionGood.deleteMany({
      where: { transactionId: id }
    });
    
    await prisma.deliveryDetail.deleteMany({
      where: { transactionId: id }
    });

    await prisma.transaction.delete({
      where: { id }
    });

    // Clean up orphaned goods
    for (const gid of goodIds) {
      await prisma.good.delete({ where: { id: gid } });
    }
  } catch (error) {
    console.error("Error deleting shipment:", error);
    throw new Error("Failed to delete shipment.");
  }

  revalidatePath("/shipments");
}
