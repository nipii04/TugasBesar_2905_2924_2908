import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { username }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const shipments = await prisma.transaction.findMany({
      where: {
        customerId: user.id
      },
      include: {
        vessel: true,
        transactionGoods: {
          include: {
            good: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ data: shipments });

  } catch (error: any) {
    console.error("Error fetching my shipments:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
