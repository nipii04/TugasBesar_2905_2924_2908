"use server";

import { prisma } from "@/lib/prisma";

export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string;
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const role = "Pelanggan"; // Default for public registration

  try {
    // Check if username exists
    const existing = await prisma.user.findUnique({
      where: { username }
    });
    
    if (existing) {
      return { success: false, error: "Username already exists." };
    }

    await prisma.user.create({
      data: {
        name,
        username,
        password,
        role
      }
    });

    return { success: true };
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, error: "An unexpected error occurred during registration." };
  }
}

export async function loginUser(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  try {
    const user = await prisma.user.findUnique({
      where: { username }
    });

    if (!user || user.password !== password) {
      return { success: false, error: "Invalid username or password." };
    }

    return { success: true, role: user.role, username: user.username };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "An unexpected error occurred during login." };
  }
}
