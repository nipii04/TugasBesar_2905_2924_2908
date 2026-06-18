import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  context: { params: Promise<{ trackingNumber: string }> }
) {
  try {
    // Correctly handle dynamic params in Next.js App Router (must await params if async context)
    const { trackingNumber } = await context.params;

    if (!trackingNumber) {
      return NextResponse.json({ error: 'Form tidak lengkap: Tracking number is required' }, { status: 400 });
    }

    const transaction = await prisma.transaction.findUnique({
      where: { trackingNumber },
      include: {
        vessel: true,
        originPort: true,
        destinationPort: true,
        deliveryDetail: true,
        shipmentLogs: {
          orderBy: {
            createdAt: 'asc'
          }
        }
      },
    });

    if (!transaction) {
      return NextResponse.json({ error: 'Data not found: Tracking number tidak ditemukan di database' }, { status: 404 });
    }

    return NextResponse.json({ data: transaction });
  } catch (error) {
    console.error('Error fetching tracking data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
