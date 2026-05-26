"use server";

import { prisma } from "@/lib/prisma";

export async function getDashboardStats() {
  const [totalVessels, activeShipments, recentVessels] = await Promise.all([
    prisma.vessel.count(),
    prisma.transaction.count({
      where: {
        status: { notIn: ["Selesai", "Sampai Tujuan"] }
      }
    }),
    prisma.vessel.findMany({
      take: 5,
      orderBy: { createdAt: "desc" }
    })
  ]);

  return { totalVessels, activeShipments, recentVessels };
}
