"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export function RoleGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const role = sessionStorage.getItem("userRole");

    if (!role) {
      setIsAuthorized(false);
      return;
    }

    if (role === "Customer") {
      router.push("/track");
      return;
    }

    if (role === "Fleet Superintendent") {
      if (pathname.includes("/accounts")) {
        setIsAuthorized(false);
        return;
      }
    }

    setIsAuthorized(true);
  }, [pathname, router]);

  if (!isMounted) {
    return null; // Prevents SSR flash
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#09090c] text-white flex flex-col items-center justify-center p-6 text-center">
        <ShieldAlert size={64} className="text-red-500 mb-6" />
        <h1 className="text-4xl font-bold font-mono tracking-widest text-red-500 mb-2">ACCESS DENIED</h1>
        <p className="text-gray-400 font-mono text-sm max-w-md mb-8">
          You do not have the required permissions to view this dashboard. Please log in with an authorized account.
        </p>
        <Link href="/login" className="px-6 py-3 rounded-lg bg-red-500 hover:bg-red-600 text-white font-bold tracking-widest transition-colors font-mono text-sm">
          RETURN TO LOGIN
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
