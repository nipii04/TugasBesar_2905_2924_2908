"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function registerUser(formData: FormData) {
  const name = (formData.get("name") as string).trim();
  const username = (formData.get("username") as string).trim();
  const password = (formData.get("password") as string).trim();
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
  const username = (formData.get("username") as string).trim();
  const password = (formData.get("password") as string).trim();

  try {
    const user = await prisma.user.findUnique({
      where: { username }
    });

    if (!user) {
      return { success: false, error: "Username atau password salah." };
    }

    // Cek apakah password sudah di-hash bcrypt (dimulai dengan $2)
    const isBcryptHash = user.password.startsWith("$2");

    if (isBcryptHash) {
      // Password sudah di-hash — verifikasi dengan bcrypt
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return { success: false, error: "Username atau password salah." };
      }
    } else {
      // Password masih plaintext (seed data lama) — cek langsung
      if (user.password !== password) {
        return { success: false, error: "Username atau password salah." };
      }
      // Auto-upgrade ke bcrypt hash untuk login berikutnya
      const upgraded = await bcrypt.hash(password, 10);
      await prisma.user.update({
        where: { id: user.id },
        data: { password: upgraded }
      });
    }

    return { success: true, role: user.role, username: user.username };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "Terjadi kesalahan. Silakan coba lagi." };
  }
}
