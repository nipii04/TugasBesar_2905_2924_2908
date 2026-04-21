"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export function RoleGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

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

    // Role == Fleet Superintendent
    if (role === "Fleet Superintendent") {
      if (pathname.includes("/accounts")) {
        router.push("/dashboard");
        return;
      }
    }

    setIsAuthorized(true);
  }, [pathname, router]);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#0d0e12] flex items-center justify-center">
        <div className="text-gray-500 font-mono text-sm animate-pulse">Checking authorization...</div>
      </div>
    );
  }

  return <>{children}</>;
}
