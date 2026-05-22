"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getVessels(query: string = "", page: number = 1, pageSize: number = 10) {
  const skip = (page - 1) * pageSize;
  const where = query ? {
    OR: [
      { name: { contains: query, mode: 'insensitive' as const } },
      { type: { contains: query, mode: 'insensitive' as const } },
      { assignedKey: { contains: query, mode: 'insensitive' as const } }
    ]
  } : {};

  const [vessels, total] = await Promise.all([
    prisma.vessel.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" }
    }),
    prisma.vessel.count({ where })
  ]);

  return { vessels, total, totalPages: Math.ceil(total / pageSize) };
}

export async function addVessel(formData: FormData) {
  const name = formData.get("name") as string;
  const type = formData.get("type") as string;
  const status = formData.get("status") as string;
  const capacityRaw = formData.get("capacity") as string;
  const buildYearRaw = formData.get("buildYear") as string;
  const assignedKeyRaw = formData.get("assignedKey") as string;

  const capacity = parseInt(capacityRaw, 10);
  const buildYear = buildYearRaw ? parseInt(buildYearRaw, 10) : null;
  const assignedKey = assignedKeyRaw || null;

  try {
    await prisma.vessel.create({
      data: {
        name,
        type,
        status,
        capacity,
        buildYear,
        assignedKey,
      }
    });
  } catch (error) {
    console.error("Error creating vessel:", error);
    throw new Error("Failed to create vessel. Note that names and assigned keys must be unique.");
  }

  revalidatePath("/fleet");
}

export async function updateVessel(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const type = formData.get("type") as string;
  const status = formData.get("status") as string;
  const capacityRaw = formData.get("capacity") as string;
  const buildYearRaw = formData.get("buildYear") as string;
  const assignedKeyRaw = formData.get("assignedKey") as string;

  const capacity = parseInt(capacityRaw, 10);
  const buildYear = buildYearRaw ? parseInt(buildYearRaw, 10) : null;
  const assignedKey = assignedKeyRaw || null;

  try {
    await prisma.vessel.update({
      where: { id },
      data: {
        name,
        type,
        status,
        capacity,
        buildYear,
        assignedKey,
      }
    });
  } catch (error) {
    console.error("Error updating vessel:", error);
    throw new Error("Failed to update vessel.");
  }

  revalidatePath("/fleet");
  redirect("/fleet");
}

export async function deleteVessel(id: string) {
  try {
    await prisma.vessel.delete({
      where: { id }
    });
  } catch (error) {
    console.error("Error deleting vessel:", error);
    throw new Error("Failed to delete vessel.");
  }

  revalidatePath("/fleet");
}
