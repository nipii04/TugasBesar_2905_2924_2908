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
    await prisma.cargo.create({
      data: {
        trackingNumber,
        origin,
        destination,
        status,
        cargoType,
        weight,
        estArrival,
      },
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
    const shipments = await prisma.cargo.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return shipments;
  } catch (error) {
    console.error("Error fetching shipments:", error);
    return [];
  }
}
