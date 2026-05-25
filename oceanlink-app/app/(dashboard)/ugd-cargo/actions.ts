"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

// TYPE DEFINITIONS
export type CargoFormData = {
  id?: string;
  trackingNumber?: string;
  sendDate: string;
  senderName: string;
  receiverName: string;
  phone: string;
  originCity: string;
  destinationCity: string;
  price: number;
  deliveryType: string;
  status: string;
  notes: string;
  
  // Barang (TransactionGood & Good)
  itemName: string;
  itemWeight: number;
  
  // Kapal (Vessel)
  vesselId: string;
};

// CREATE
export async function createCargo(data: CargoFormData) {
  try {
    // Generate tracking number
    const trackingNumber = `RSI-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;
    
    // We need to create a dummy user since customerId is required
    let dummyUser = await prisma.user.findFirst({ where: { role: "Admin" } });
    if (!dummyUser) {
        dummyUser = await prisma.user.create({
            data: {
                username: `admin_${Date.now()}`,
                name: "Admin System",
                password: "hashed_password",
                role: "Admin"
            }
        });
    }

    // Since we don't have port selector in UGD, we just create/find dummy ports for origin and destination based on string
    let originPort = await prisma.port.findFirst({ where: { city: data.originCity } });
    if (!originPort) {
        originPort = await prisma.port.create({
            data: {
                code: `PRT-${data.originCity.substring(0, 3).toUpperCase()}`,
                name: `Pelabuhan ${data.originCity}`,
                city: data.originCity,
                country: "Indonesia"
            }
        });
    }

    let destPort = await prisma.port.findFirst({ where: { city: data.destinationCity } });
    if (!destPort) {
        destPort = await prisma.port.create({
            data: {
                code: `PRT-${data.destinationCity.substring(0, 3).toUpperCase()}`,
                name: `Pelabuhan ${data.destinationCity}`,
                city: data.destinationCity,
                country: "Indonesia"
            }
        });
    }

    // 1. Create Transaction
    const transaction = await prisma.transaction.create({
      data: {
        trackingNumber: trackingNumber,
        status: data.status,
        estArrival: new Date(new Date(data.sendDate).getTime() + 7 * 24 * 60 * 60 * 1000), // dummy est arrival
        
        // UGD Fields
        sendDate: new Date(data.sendDate),
        receiverName: data.receiverName,
        phone: data.phone,
        price: data.price,
        deliveryType: data.deliveryType,
        notes: data.notes,

        // Relations
        customerId: dummyUser.id,
        vesselId: data.vesselId,
        originId: originPort.id,
        destinationId: destPort.id,
      },
    });

    // 2. Create Good and TransactionGood
    const good = await prisma.good.create({
        data: {
            name: data.itemName,
            type: "General Cargo",
            description: data.notes
        }
    });

    await prisma.transactionGood.create({
        data: {
            transactionId: transaction.id,
            goodId: good.id,
            quantity: 1,
            weight: data.itemWeight
        }
    });

    revalidatePath("/dashboard/ugd-cargo");
    return { success: true, trackingNumber: transaction.trackingNumber };
  } catch (error: any) {
    console.error("Error creating cargo:", error);
    return { success: false, error: error.message };
  }
}

// READ
export async function getCargos(searchQuery?: string) {
  try {
    let whereClause: any = {};
    
    if (searchQuery) {
      whereClause = {
        OR: [
          { trackingNumber: { contains: searchQuery, mode: "insensitive" } },
          { customer: { name: { contains: searchQuery, mode: "insensitive" } } },
          { receiverName: { contains: searchQuery, mode: "insensitive" } },
          { 
            transactionGoods: {
              some: {
                good: { name: { contains: searchQuery, mode: "insensitive" } }
              }
            }
          }
        ],
      };
    }

    const cargos = await prisma.transaction.findMany({
      where: whereClause,
      include: {
        customer: true,
        vessel: true,
        originPort: true,
        destinationPort: true,
        transactionGoods: {
          include: {
            good: true
          }
        }
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: cargos };
  } catch (error: any) {
    console.error("Error fetching cargos:", error);
    return { success: false, error: error.message };
  }
}

// UPDATE
export async function updateCargo(id: string, data: Partial<CargoFormData>) {
  try {
    const updateData: any = {};
    if (data.status) updateData.status = data.status;
    if (data.price) updateData.price = data.price;
    if (data.vesselId) updateData.vesselId = data.vesselId;

    await prisma.transaction.update({
      where: { id },
      data: updateData,
    });
    
    revalidatePath("/dashboard/ugd-cargo");
    return { success: true };
  } catch (error: any) {
    console.error("Error updating cargo:", error);
    return { success: false, error: error.message };
  }
}

// DELETE
export async function deleteCargo(id: string) {
  try {
    // Need to delete related transactionGoods first
    await prisma.transactionGood.deleteMany({
        where: { transactionId: id }
    });
    
    await prisma.deliveryDetail.deleteMany({
        where: { transactionId: id }
    });

    await prisma.transaction.delete({
      where: { id },
    });

    revalidatePath("/dashboard/ugd-cargo");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting cargo:", error);
    return { success: false, error: error.message };
  }
}

// Helper for fetching vessels
export async function getVessels() {
    try {
        const vessels = await prisma.vessel.findMany({
            orderBy: { name: "asc" }
        });
        return { success: true, data: vessels };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
