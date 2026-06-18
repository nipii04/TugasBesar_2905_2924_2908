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
  const baseRatePerKg = parseFloat(formData.get("baseRatePerKg") as string);
  
  if (!name || !originCity || !destinationCity || isNaN(estimatedDays) || isNaN(baseRatePerKg)) {
    throw new Error("Missing required fields.");
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
        baseRatePerKg,
      }
    });
  } catch (error: any) {
    console.error("Error creating route:", error);
    if (error.code === 'P2002') {
      throw new Error("A route between this origin and destination already exists.");
    }
    throw new Error("Failed to save route.");
  }

  revalidatePath("/routes");
  redirect("/routes");
}

export async function updateRoute(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const originCity = formData.get("originCity") as string;
  const destinationCity = formData.get("destinationCity") as string;
  const estimatedDays = parseInt(formData.get("estimatedDays") as string, 10);
  const distanceKmStr = formData.get("distanceKm") as string;
  const distanceKm = distanceKmStr ? parseFloat(distanceKmStr) : null;
  const baseRatePerKg = parseFloat(formData.get("baseRatePerKg") as string);
  
  if (!name || !originCity || !destinationCity || isNaN(estimatedDays) || isNaN(baseRatePerKg)) {
    throw new Error("Missing required fields.");
  }

  try {
    await prisma.route.update({
      where: { id },
      data: {
        name,
        originCity,
        destinationCity,
        originCountry: "Indonesia",
        destinationCountry: "Indonesia",
        estimatedDays,
        distanceKm,
        baseRatePerKg,
      }
    });
  } catch (error: any) {
    console.error("Error updating route:", error);
    if (error.code === 'P2002') {
      throw new Error("A route between this origin and destination already exists.");
    }
    throw new Error("Failed to update route.");
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
    throw new Error("Failed to delete route.");
  }
  revalidatePath("/routes");
}
