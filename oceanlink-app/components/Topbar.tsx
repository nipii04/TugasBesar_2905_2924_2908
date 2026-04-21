"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Waves, LayoutDashboard, Anchor, BarChart3, ChevronDown, User, LogOut, Ship, Map, AlertTriangle, Users } from "lucide-react";
import { useState, useEffect } from "react";

export function Topbar() {
  const pathname = usePathname();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string>("Admin");

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role) {
      setUserRole(role);
    }
  }, []);

  const isActive = (path: string) => pathname?.startsWith(path);

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#0d0e12]/80 backdrop-blur-xl border-b border-white/5 h-16">
      <div className="flex items-center justify-between px-6 h-full max-w-[1600px] mx-auto">
        
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-[#14121a] border border-[#a155f7]/30 shadow-[0_0_15px_rgba(161,85,247,0.2)]">
            <Waves className="text-[#b16ff9] w-5 h-5" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-sm font-bold tracking-widest text-[#f0f0f0] font-mono leading-none">OCEANLINK</h1>
            <p className="text-[#6c6d75] tracking-[0.2em] text-[8px] font-semibold uppercase mt-0.5">Primelog Fleet</p>
          </div>
        </Link>

        {/* Megamenu Navigation */}
        <div className="hidden md:flex items-center gap-1 h-full">
          
          {/* Dashboard Menu */}
          <div 
            className="relative h-full flex items-center"
            onMouseEnter={() => setActiveDropdown("dashboard")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <Link 
              href="/dashboard"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold tracking-widest uppercase transition-all ${
                isActive("/dashboard") && pathname === "/dashboard"
                  ? "text-white bg-white/5" 
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <LayoutDashboard size={14} className={isActive("/dashboard") && pathname === "/dashboard" ? "text-purple-400" : ""} />
              Dashboard
              <ChevronDown size={14} className="opacity-50" />
            </Link>

            {/* Megamenu Dropdown */}
            {activeDropdown === "dashboard" && (
              <div className="absolute top-full left-0 w-64 bg-[#111115] border border-white/5 rounded-xl p-2 shadow-2xl mt-1 z-50">
                <Link href="/dashboard" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 text-gray-300 hover:text-white transition-colors">
                  <LayoutDashboard size={16} className="text-purple-400" />
                  <div>
                    <p className="text-xs font-bold">Overview</p>
                    <p className="text-[10px] text-gray-500">Main fleet statistics</p>
                  </div>
                </Link>
                <Link href="/track" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 text-gray-300 hover:text-white transition-colors">
                  <Map size={16} className="text-blue-400" />
                  <div>
                    <p className="text-xs font-bold">Live Tracking</p>
                    <p className="text-[10px] text-gray-500">Real-time GPS map</p>
                  </div>
                </Link>
              </div>
            )}
          </div>

          {/* Fleet Menu */}
          <div 
            className="relative h-full flex items-center"
            onMouseEnter={() => setActiveDropdown("fleet")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <Link 
              href="/fleet"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold tracking-widest uppercase transition-all ${
                isActive("/fleet")
                  ? "text-purple-300 bg-purple-500/10 shadow-[0_0_15px_rgba(168,85,247,0.15)]" 
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Anchor size={14} className={isActive("/fleet") ? "text-purple-400" : ""} />
              Fleet
              <ChevronDown size={14} className="opacity-50" />
            </Link>

            {/* Megamenu Dropdown */}
            {activeDropdown === "fleet" && (
              <div className="absolute top-full left-0 w-64 bg-[#111115] border border-white/5 rounded-xl p-2 shadow-2xl mt-1 z-50">
                <Link href="/fleet" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 text-gray-300 hover:text-white transition-colors">
                  <Ship size={16} className="text-purple-400" />
                  <div>
                    <p className="text-xs font-bold">Fleet Management</p>
                    <p className="text-[10px] text-gray-500">Vessel inventory & details</p>
                  </div>
                </Link>
                {userRole === "Admin" && (
                  <Link href="/accounts" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 text-gray-300 hover:text-white transition-colors">
                    <Users size={16} className="text-green-400" />
                    <div>
                      <p className="text-xs font-bold">Manage Accounts</p>
                      <p className="text-[10px] text-gray-500">Crew & Operator access</p>
                    </div>
                  </Link>
                )}
                <Link href="#" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 text-gray-300 hover:text-white transition-colors">
                  <AlertTriangle size={16} className="text-yellow-400" />
                  <div>
                    <p className="text-xs font-bold">Maintenance Logs</p>
                    <p className="text-[10px] text-gray-500">Service & repair history</p>
                  </div>
                </Link>
              </div>
            )}
          </div>

          {/* Analytics Menu */}
          <div 
            className="relative h-full flex items-center"
            onMouseEnter={() => setActiveDropdown("analytics")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <Link 
              href="/analytics"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold tracking-widest uppercase transition-all ${
                isActive("/analytics")
                  ? "text-white bg-white/5" 
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <BarChart3 size={14} className={isActive("/analytics") ? "text-purple-400" : ""} />
              Analytics
              <ChevronDown size={14} className="opacity-50" />
            </Link>

            {/* Megamenu Dropdown */}
            {activeDropdown === "analytics" && (
              <div className="absolute top-full left-0 w-64 bg-[#111115] border border-white/5 rounded-xl p-2 shadow-2xl mt-1 z-50">
                <Link href="/analytics" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 text-gray-300 hover:text-white transition-colors">
                  <BarChart3 size={16} className="text-purple-400" />
                  <div>
                    <p className="text-xs font-bold">Performance</p>
                    <p className="text-[10px] text-gray-500">Revenue & efficiency stats</p>
                  </div>
                </Link>
              </div>
            )}
          </div>

        </div>

        {/* User Profile Right Side */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:block text-right">
            <p className="text-xs font-bold text-white tracking-wider">{userRole}</p>
            <p className="text-[9px] text-gray-500 font-mono uppercase tracking-widest">
              {userRole === "Admin" ? "Full Access" : userRole === "Fleet Superintendent" ? "Fleet Operations" : "Customer Access"}
            </p>
          </div>
          <button className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 hover:bg-purple-500/30 transition-colors">
            <User size={14} />
          </button>
          <Link href="/" className="text-gray-500 hover:text-red-400 transition-colors ml-2">
            <LogOut size={16} />
          </Link>
        </div>

      </div>
    </nav>
  );
}
