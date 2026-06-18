"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getAllVessels() {
  return await prisma.vessel.findMany({
    orderBy: { name: 'asc' }
  });
}

export async function getAvailableVesselsForShipment() {
  return await prisma.vessel.findMany({
    where: { status: 'DOCKED' },
    include: {
      route: true,
      transactions: {
        where: { status: { notIn: ['Delivered', 'Arrived'] } },
        select: {
          weight: true
        }
      }
    },
    orderBy: { name: 'asc' }
  });
}

// Ambil semua user Pelanggan untuk dropdown pada form tambah shipment
export async function getCustomers() {
  return await prisma.user.findMany({
    where: { role: "Customer" },
    orderBy: { name: 'asc' },
    select: { id: true, name: true, username: true }
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

  // Customer fields
  const customerId = formData.get("customerId") as string;

  try {
    // Jika customerId tidak diberikan (backward compat), fallback ke user Pelanggan pertama
    let resolvedCustomerId = customerId;
    if (!resolvedCustomerId) {
      const fallbackCustomer = await prisma.user.findFirst({
        where: { role: "Customer" }
      });
      if (!fallbackCustomer) {
        throw new Error("No customer data. Tambahkan pelanggan terlebih dahulu.");
      }
      resolvedCustomerId = fallbackCustomer.id;
    }

    if (!vesselId) {
       throw new Error("Vessel must be selected");
    }

    // *** VALIDASI KAPASITAS KAPAL ***
    const vessel = await prisma.vessel.findUnique({ where: { id: vesselId } });
    if (!vessel) throw new Error("Vessel not found.");

    // Hitung total beban muatan aktif di kapal ini (status bukan Selesai)
    const activeShipments = await prisma.transaction.findMany({
      where: {
        vesselId,
        status: { notIn: ["Delivered", "Arrived"] },
      },
      select: { weight: true }
    });

    const currentLoad = activeShipments.reduce((sum, tx) => sum + (tx.weight || 0), 0);
    const newWeight = weight || 0;

    if (currentLoad + newWeight > vessel.capacity) {
      throw new Error(
        `Kapal "${vessel.name}" does not have enough capacity. ` +
        `Remaining capacity: ${vessel.capacity - currentLoad}kg. New cargo weight: ${newWeight}kg.`
      );
    }
    // *** AKHIR VALIDASI KAPASITAS ***

    // 4. Create Transaction
    const newTransaction = await prisma.transaction.create({
      data: {
        trackingNumber,
        status: status || "Processing",
        estArrival,
        senderName,
        receiverName,
        phone,
        originCity,
        destinationCity,
        shippingType,
        price,
        cargoName,
        cargoType,
        weight,
        customerId: resolvedCustomerId,
        vesselId: vesselId,
      },
    });

    // 6. Create ShipmentLog
    await prisma.shipmentLog.create({
      data: {
        action: "CREATED",
        description: `Shipment ${trackingNumber} registered.`,
        newStatus: status || "Processing",
        transactionId: newTransaction.id,
        trackingSnapshot: trackingNumber,
      }
    });
  } catch (error: any) {
    console.error("Error creating shipment:", error);
    // Re-throw custom validation errors directly
    if (error.message && !error.message.includes("Failed to create")) {
      throw error;
    }
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
      { receiverName: { contains: query, mode: 'insensitive' as const } }
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
          vessel: true
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
  
  const senderName = formData.get("senderName") as string;
  const receiverName = formData.get("receiverName") as string;
  const phone = formData.get("phone") as string;

  try {
    const oldTx = await prisma.transaction.findUnique({ where: { id } });

    const tx = await prisma.transaction.update({
      where: { id },
      data: {
        status,
        price,
        ...(senderName && { senderName }),
        ...(receiverName && { receiverName }),
        ...(phone && { phone }),
      },
      include: { vessel: true }
    });

    if (oldTx && oldTx.status !== status) {
      await prisma.shipmentLog.create({
        data: {
          action: "STATUS_CHANGED",
          description: `Shipment status updated from ${oldTx.status} to ${status}.`,
          oldStatus: oldTx.status,
          newStatus: status,
          transactionId: id,
          trackingSnapshot: oldTx.trackingNumber,
        }
      });
    } else {
      await prisma.shipmentLog.create({
        data: {
          action: "UPDATED",
          description: `Shipment details updated.`,
          oldStatus: status,
          newStatus: status,
          transactionId: id,
          trackingSnapshot: oldTx?.trackingNumber,
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

export async function updateShipmentStatus(id: string, status: string) {
  try {
    const oldTx = await prisma.transaction.findUnique({ where: { id } });

    await prisma.transaction.update({
      where: { id },
      data: { status },
    });

    if (oldTx && oldTx.status !== status) {
      await prisma.shipmentLog.create({
        data: {
          action: "STATUS_CHANGED",
          description: `Status changed to ${status}.`,
          oldStatus: oldTx.status,
          newStatus: status,
          transactionId: id,
          trackingSnapshot: oldTx.trackingNumber,
        }
      });
    }
  } catch (error) {
    console.error("Error updating shipment status:", error);
    throw new Error("Failed to update shipment status.");
  }
  revalidatePath("/shipments");
}

export async function deleteShipment(id: string) {
  try {
    await prisma.deliveryDetail.deleteMany({
      where: { transactionId: id }
    });

    const oldTx = await prisma.transaction.findUnique({ where: { id } });
    if (oldTx) {
      await prisma.shipmentLog.create({
        data: {
          action: "DELETED",
          description: `Shipment ${oldTx.trackingNumber} deleted.`,
          oldStatus: oldTx.status,
          transactionId: null, // Keep null since transaction is about to be deleted
          trackingSnapshot: oldTx.trackingNumber,
        }
      });
    }

    await prisma.transaction.delete({
      where: { id }
    });

  } catch (error: any) {
    console.error("Error deleting shipment:", error);
    throw new Error("Failed to delete shipment data.");
  }

  revalidatePath("/shipments");
}
