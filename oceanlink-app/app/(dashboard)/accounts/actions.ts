"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getUsers(query: string = "", page: number = 1, pageSize: number = 10) {
  const skip = (page - 1) * pageSize;
  const where = query ? {
    OR: [
      { name: { contains: query, mode: 'insensitive' as const } },
      { username: { contains: query, mode: 'insensitive' as const } },
      { role: { contains: query, mode: 'insensitive' as const } }
    ]
  } : {};

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" }
    }),
    prisma.user.count({ where })
  ]);

  return { users, total, totalPages: Math.ceil(total / pageSize) };
}

export async function addUser(formData: FormData) {
  const name = formData.get("name") as string;
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string;

  try {
    await prisma.user.create({
      data: {
        name,
        username,
        password, // In a real app, hash this!
        role,
      }
    });
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Failed to create user. Username must be unique.");
  }

  revalidatePath("/accounts");
  redirect("/accounts");
}

export async function updateUser(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const username = formData.get("username") as string;
  const role = formData.get("role") as string;
  const password = formData.get("password") as string;

  const updateData: any = { name, username, role };
  if (password) {
    updateData.password = password; // Again, hash in real app
  }

  try {
    await prisma.user.update({
      where: { id },
      data: updateData
    });
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error("Failed to update user.");
  }

  revalidatePath("/accounts");
  redirect("/accounts");
}

export async function deleteUser(id: string) {
  try {
    await prisma.user.delete({
      where: { id }
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new Error("Failed to delete user.");
  }

  revalidatePath("/accounts");
}
