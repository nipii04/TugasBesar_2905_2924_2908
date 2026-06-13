"use server";

import { prisma } from "@/lib/prisma";

export async function getAnalyticsData() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const last7Days = new Date(now);
  last7Days.setDate(now.getDate() - 6);

  const [
    totalRevenue,
    activeShipments,
    vesselStats,
    statusCounts,
    weeklyShipments,
    topRoutes,
    maintenanceVessels,
  ] = await Promise.all([
    // Total revenue dari semua transaksi
    prisma.transaction.aggregate({ _sum: { price: true } }),

    // Shipment aktif (belum selesai)
    prisma.transaction.count({
      where: { status: { notIn: ["Selesai", "Sampai Tujuan"] } }
    }),

    // Statistik vessel berdasarkan status
    prisma.vessel.groupBy({
      by: ["status"],
      _count: { id: true }
    }),

    // Jumlah transaksi per status
    prisma.transaction.groupBy({
      by: ["status"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 7
    }),

    // Shipment 7 hari terakhir (per hari)
    prisma.transaction.findMany({
      where: { createdAt: { gte: last7Days } },
      select: { createdAt: true },
      orderBy: { createdAt: "asc" }
    }),

    // Rute paling populer (originCity -> destinationCity)
    prisma.transaction.groupBy({
      by: ["originCity", "destinationCity"],
      _count: { id: true },
      where: {
        originCity: { not: null },
        destinationCity: { not: null }
      },
      orderBy: { _count: { id: "desc" } },
      take: 5
    }),

    // Jumlah kapal dalam maintenance
    prisma.vessel.count({ where: { status: "MAINTENANCE" } }),
  ]);

  // Proses weekly shipments per hari
  const weeklyMap: Record<string, number> = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const key = d.toLocaleDateString('id-ID', { weekday: 'short' });
    weeklyMap[key] = 0;
  }
  weeklyShipments.forEach(tx => {
    const key = new Date(tx.createdAt).toLocaleDateString('id-ID', { weekday: 'short' });
    if (key in weeklyMap) weeklyMap[key]++;
  });

  // Hitung total shipment untuk persentase rute
  const totalForRoutes = topRoutes.reduce((sum, r) => sum + r._count.id, 0);
  const routesWithPercent = topRoutes.map(r => ({
    label: `${r.originCity} → ${r.destinationCity}`,
    count: r._count.id,
    percent: totalForRoutes > 0 ? Math.round((r._count.id / totalForRoutes) * 100) : 0
  }));

  return {
    totalRevenue: totalRevenue._sum.price || 0,
    activeShipments,
    vesselStats,
    statusCounts,
    weeklyData: Object.entries(weeklyMap).map(([day, count]) => ({ day, count })),
    topRoutes: routesWithPercent,
    maintenanceVessels,
  };
}
