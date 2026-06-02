"use server";

import { prisma } from "@/lib/prisma";

export async function getDashboardStats() {
  const [totalVessels, activeShipments, recentVessels, revenueAgg, distinctSenders] = await Promise.all([
    prisma.vessel.count(),
    prisma.transaction.count({
      where: {
        status: { notIn: ["Selesai", "Sampai Tujuan"] }
      }
    }),
    prisma.vessel.findMany({
      take: 5,
      orderBy: { createdAt: "desc" }
    }),
    prisma.transaction.aggregate({
      _sum: {
        price: true
      }
    }),
    prisma.transaction.findMany({
      distinct: ['senderName'],
      select: { senderName: true },
      where: { senderName: { not: null } }
    })
  ]);

  const totalRevenue = revenueAgg._sum.price || 0;
  const totalCustomers = distinctSenders.length;

  return { totalVessels, activeShipments, recentVessels, totalRevenue, totalCustomers };
}
