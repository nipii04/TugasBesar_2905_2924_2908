"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getGoods(query: string = "", page: number = 1, pageSize: number = 10) {
  const skip = (page - 1) * pageSize;
  const where = query ? {
    OR: [
      { name: { contains: query, mode: 'insensitive' as const } },
      { type: { contains: query, mode: 'insensitive' as const } },
      { description: { contains: query, mode: 'insensitive' as const } }
    ]
  } : {};

  const [goods, total] = await Promise.all([
    prisma.good.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" }
    }),
    prisma.good.count({ where })
  ]);

  return { goods, total, totalPages: Math.ceil(total / pageSize) };
}

export async function addGood(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const type = formData.get("type") as string;

  try {
    await prisma.good.create({
      data: {
        name,
        description: description || null,
        type,
      }
    });
  } catch (error) {
    console.error("Error creating good:", error);
    throw new Error("Failed to create good.");
  }

  revalidatePath("/goods");
  redirect("/goods");
}

export async function updateGood(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const type = formData.get("type") as string;

  try {
    await prisma.good.update({
      where: { id },
      data: {
        name,
        description: description || null,
        type,
      }
    });
  } catch (error) {
    console.error("Error updating good:", error);
    throw new Error("Failed to update good.");
  }

  revalidatePath("/goods");
  redirect("/goods");
}

export async function deleteGood(id: string) {
  try {
    await prisma.good.delete({
      where: { id }
    });
  } catch (error) {
    console.error("Error deleting good:", error);
    throw new Error("Failed to delete good.");
  }

  revalidatePath("/goods");
}
