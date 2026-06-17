"use server";

import { prisma } from "@/lib/prisma";

export async function getShipmentLogs(page = 1, pageSize = 20) {
  try {
    const skip = (page - 1) * pageSize;
    
    const [logs, total] = await Promise.all([
      prisma.shipmentLog.findMany({
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
        include: {
          transaction: {
            select: {
              trackingNumber: true,
              originCity: true,
              destinationCity: true,
            }
          },
          user: {
            select: {
              name: true,
              role: true
            }
          }
        }
      }),
      prisma.shipmentLog.count()
    ]);

    return {
      logs,
      total,
      totalPages: Math.ceil(total / pageSize)
    };
  } catch (error) {
    console.error("Error fetching shipment logs:", error);
    return { logs: [], total: 0, totalPages: 0 };
  }
}
