import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    console.log("Executing query for verification...");

    // Mengambil daftar vessel dan user untuk verifikasi
    const vessels = await prisma.vessel.findMany({
      select: {
        name: true,
        type: true,
        status: true,
        capacity: true
      }
    });

    const users = await prisma.user.findMany({
      select: {
        name: true,
        role: true
      }
    });

    // Response dalam format JSON seperti yang dicontohkan di guide
    return Response.json({
      message: "Query berhasil dieksekusi",
      data: {
        vessels,
        users
      }
    });
  } catch (error) {
    console.error('Error executing query:', error);
    return Response.json({ error: "Failed to execute query" }, { status: 500 });
  }
}
