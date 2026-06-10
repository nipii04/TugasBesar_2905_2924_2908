"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

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

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        username,
        password: hashedPassword,
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

    if (!user) {
      return { success: false, error: "Invalid username or password." };
    }

    // Check if the password matches using bcrypt
    const passwordMatch = await bcrypt.compare(password, user.password);
    
    // For local dev, also allow plain text fallback if hash comparison fails
    if (!passwordMatch && user.password !== password) {
      return { success: false, error: "Invalid username or password." };
    }

    // If it was a plain text match, you might want to upgrade the hash here, 
    // but for this assignment, we just allow them to login.

    return { success: true, role: user.role, username: user.username };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "An unexpected error occurred during login." };
  }
}
