"use server";

import { prisma } from "@/lib/prisma";

export async function getDashboardStats() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [totalVessels, activeShipments, recentVessels, revenueAgg, totalCustomers, completedShipments, maintenanceVessels] = await Promise.all([
    prisma.vessel.count(),
    prisma.transaction.count({
      where: {
        status: { notIn: ["Delivered", "Arrived"] }
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
    // Hitung jumlah user dengan role Pelanggan (bukan dari senderName)
    prisma.user.count({
      where: { role: "Customer" }
    }),
    // Hitung shipment yang selesai bulan ini
    prisma.transaction.count({
      where: {
        status: { in: ["Delivered", "Arrived"] },
        updatedAt: { gte: startOfMonth }
      }
    }),
    // Hitung fleet yang sedang maintenance
    prisma.vessel.count({
      where: { status: "MAINTENANCE" }
    })
  ]);

  const totalRevenue = revenueAgg._sum.price || 0;

  return { totalVessels, activeShipments, recentVessels, totalRevenue, totalCustomers, completedShipments, maintenanceVessels };
}
