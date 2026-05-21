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
  redirect("/shipments");
}

export async function getShipments() {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        originPort: true,
        destinationPort: true,
        transactionGoods: {
          include: { good: true }
        }
      }
    });
    
    // Map transactions to the shape expected by the frontend
    return transactions.map((t) => {
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
  } catch (error) {
    console.error("Error fetching shipments:", error);
    return [];
  }
}
