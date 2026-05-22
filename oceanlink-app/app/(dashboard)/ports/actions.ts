"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getPorts(query: string = "", page: number = 1, pageSize: number = 10) {
  const skip = (page - 1) * pageSize;
  const where = query ? {
    OR: [
      { name: { contains: query, mode: 'insensitive' as const } },
      { code: { contains: query, mode: 'insensitive' as const } },
      { city: { contains: query, mode: 'insensitive' as const } },
      { country: { contains: query, mode: 'insensitive' as const } }
    ]
  } : {};

  const [ports, total] = await Promise.all([
    prisma.port.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" }
    }),
    prisma.port.count({ where })
  ]);

  return { ports, total, totalPages: Math.ceil(total / pageSize) };
}

export async function addPort(formData: FormData) {
  const name = formData.get("name") as string;
  const code = formData.get("code") as string;
  const city = formData.get("city") as string;
  const country = formData.get("country") as string;

  try {
    await prisma.port.create({
      data: {
        name,
        code: code.toUpperCase(),
        city,
        country,
      }
    });
  } catch (error) {
    console.error("Error creating port:", error);
    throw new Error("Failed to create port. Code must be unique.");
  }

  revalidatePath("/ports");
  redirect("/ports");
}

export async function updatePort(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const code = formData.get("code") as string;
  const city = formData.get("city") as string;
  const country = formData.get("country") as string;

  try {
    await prisma.port.update({
      where: { id },
      data: {
        name,
        code: code.toUpperCase(),
        city,
        country,
      }
    });
  } catch (error) {
    console.error("Error updating port:", error);
    throw new Error("Failed to update port.");
  }

  revalidatePath("/ports");
  redirect("/ports");
}

export async function deletePort(id: string) {
  try {
    await prisma.port.delete({
      where: { id }
    });
  } catch (error) {
    console.error("Error deleting port:", error);
    throw new Error("Failed to delete port.");
  }

  revalidatePath("/ports");
}
