"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getUgdCargo(query: string = "", page: number = 1, pageSize: number = 10) {
  const skip = (page - 1) * pageSize;
  const where: any = {
    // UGD Cargo = transaksi yang memiliki senderName dan receiverName (bukan via Port)
  };

  if (query) {
    where.OR = [
      { trackingNumber: { contains: query, mode: 'insensitive' as const } },
      { senderName: { contains: query, mode: 'insensitive' as const } },
      { receiverName: { contains: query, mode: 'insensitive' as const } },
      { originCity: { contains: query, mode: 'insensitive' as const } },
      { destinationCity: { contains: query, mode: 'insensitive' as const } },
    ];
  }

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      include: {
        vessel: { select: { name: true } },
        customer: { select: { name: true, username: true } },
        transactionGoods: { include: { good: true } },
      }
    }),
    prisma.transaction.count({ where })
  ]);

  return { transactions, total, totalPages: Math.ceil(total / pageSize) };
}

export async function updateUgdCargoStatus(id: string, status: string) {
  try {
    await prisma.transaction.update({
      where: { id },
      data: { status }
    });
  } catch (error) {
    console.error("Error updating UGD cargo status:", error);
    throw new Error("Gagal memperbarui status pengiriman.");
  }
  revalidatePath("/ugd-cargo");
}
