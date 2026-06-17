"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getRoutes(page = 1, pageSize = 15) {
  try {
    const skip = (page - 1) * pageSize;
    
    const [routes, total] = await Promise.all([
      prisma.route.findMany({
        orderBy: { name: "asc" },
        skip,
        take: pageSize,
      }),
      prisma.route.count()
    ]);

    return {
      routes,
      total,
      totalPages: Math.ceil(total / pageSize)
    };
  } catch (error) {
    console.error("Error fetching routes:", error);
    return { routes: [], total: 0, totalPages: 0 };
  }
}

export async function addRoute(formData: FormData) {
  const name = formData.get("name") as string;
  const originCity = formData.get("originCity") as string;
  const destinationCity = formData.get("destinationCity") as string;
  const estimatedDays = parseInt(formData.get("estimatedDays") as string, 10);
  const distanceKmStr = formData.get("distanceKm") as string;
  const distanceKm = distanceKmStr ? parseFloat(distanceKmStr) : null;
  
  if (!name || !originCity || !destinationCity || isNaN(estimatedDays)) {
    throw new Error("Terdapat field wajib yang belum diisi dengan benar.");
  }

  try {
    await prisma.route.create({
      data: {
        name,
        originCity,
        destinationCity,
        originCountry: "Indonesia",
        destinationCountry: "Indonesia",
        estimatedDays,
        distanceKm,
      }
    });
  } catch (error: any) {
    console.error("Error creating route:", error);
    if (error.code === 'P2002') {
      throw new Error("Rute antara kota asal dan tujuan ini sudah ada.");
    }
    throw new Error("Gagal menyimpan rute.");
  }

  revalidatePath("/routes");
  redirect("/routes");
}

export async function deleteRoute(id: string) {
  try {
    await prisma.route.delete({
      where: { id }
    });
  } catch (error) {
    console.error("Error deleting route:", error);
    throw new Error("Gagal menghapus rute.");
  }
  revalidatePath("/routes");
}
