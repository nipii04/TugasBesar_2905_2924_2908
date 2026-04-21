"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export function RoleGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(() => {
    if (typeof window !== "undefined") {
      const role = localStorage.getItem("userRole");
      if (!role) return false;
      if (role === "Pelanggan") return false;
      if (role === "Fleet Superintendent" && pathname.includes("/accounts")) return false;
      return true;
    }
    // Assume authorized during SSR to prevent flash, effect will correct if wrong
    return true; 
  });

  useEffect(() => {
    const role = localStorage.getItem("userRole");

    if (!role) {
      router.push("/login");
      return;
    }

    if (role === "Pelanggan") {
      router.push("/track");
      return;
    }

    if (role === "Fleet Superintendent") {
      if (pathname.includes("/accounts")) {
        router.push("/dashboard");
        return;
      }
    }

    setIsAuthorized(true);
  }, [pathname, router]);

  if (!isAuthorized) {
    return null; // Don't show grey flash
  }

  return <>{children}</>;
}
