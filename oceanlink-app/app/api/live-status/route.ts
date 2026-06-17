import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic"; // Ensure it's not cached

export async function GET() {
  try {
    const [vesselStats, recentLogs, totalRevenue, activeShipments] = await Promise.all([
      // 1. Vessel stats
      prisma.vessel.groupBy({
        by: ["status"],
        _count: { id: true },
      }),
      // 2. Recent logs for ticker
      prisma.shipmentLog.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          transaction: { select: { trackingNumber: true } }
        }
      }),
      // 3. Revenue
      prisma.transaction.aggregate({
        _sum: { price: true },
      }),
      // 4. Active shipments
      prisma.transaction.count({
        where: { status: { notIn: ["Selesai", "Sampai Tujuan"] } }
      })
    ]);

    return NextResponse.json({
      vesselStats,
      recentLogs: recentLogs.map(l => ({
        id: l.id,
        action: l.action,
        description: l.description,
        trackingNumber: l.transaction?.trackingNumber,
        time: l.createdAt.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      })),
      totalRevenue: totalRevenue._sum.price || 0,
      activeShipments
    });
  } catch (error) {
    console.error("Live status API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
