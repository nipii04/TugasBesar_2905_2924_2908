"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function registerUser(formData: FormData) {
  const name = (formData.get("name") as string).trim();
  const username = (formData.get("username") as string).trim();
  const password = (formData.get("password") as string).trim();
  const email = formData.get("email") ? (formData.get("email") as string).trim() : null;
  const phone = formData.get("phone") ? (formData.get("phone") as string).trim() : null;
  const role = "Customer"; // Default for public registration

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
        email,
        phone,
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
  const username = (formData.get("username") as string).trim();
  const password = (formData.get("password") as string).trim();

  try {
    const user = await prisma.user.findUnique({
      where: { username }
    });

    if (!user) {
      return { success: false, error: "Incorrect username or password." };
    }

    // Cek apakah password sudah di-hash bcrypt (dimulai dengan $2)
    const isBcryptHash = user.password.startsWith("$2");

    if (isBcryptHash) {
      // Password is hashed — verify with bcrypt
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return { success: false, error: "Incorrect username or password." };
      }
    } else {
      // Password is still plaintext (old seed data) — check directly
      if (user.password !== password) {
        return { success: false, error: "Incorrect username or password." };
      }
      // Auto-upgrade to bcrypt hash for next login
      const upgraded = await bcrypt.hash(password, 10);
      await prisma.user.update({
        where: { id: user.id },
        data: { password: upgraded }
      });
    }

    return { success: true, role: user.role, username: user.username };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "An unexpected error occurred during login." };
  }
}
