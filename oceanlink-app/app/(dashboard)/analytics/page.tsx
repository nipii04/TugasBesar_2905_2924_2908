"use client";

import { DollarSign, Package, AlertTriangle, PieChart, BarChart2, TrendingUp, Ship, Anchor } from "lucide-react";
import { useState, useEffect } from "react";
import { getAnalyticsData } from "./actions";

export default function Analytics() {
  const [userRole, setUserRole] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("userRole") || "Admin";
    }
    return "Admin";
  });

  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getAnalyticsData()
      .then(setData)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const formatRupiah = (n: number) =>
    "Rp " + n.toLocaleString("id-ID", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  // Hitung vessel stats
  const activeVessels = data?.vesselStats?.find((v: any) => v.status === "ACTIVE")?._count?.id || 0;
  const maintenanceVessels = data?.maintenanceVessels || 0;

  // Weekly chart: max value untuk normalisasi bar height
  const weeklyMax = Math.max(...(data?.weeklyData?.map((d: any) => d.count) || [1]), 1);

  const statusColors: Record<string, string> = {
    "ON SCHEDULE":    "bg-green-500",
    "IN TRANSIT":     "bg-blue-500",
    "PORT CLEARANCE": "bg-yellow-500",
    "Diproses":       "bg-orange-500",
    "Pending":        "bg-gray-500",
    "Selesai":        "bg-purple-500",
    "Sampai Tujuan":  "bg-teal-500",
    "Dalam Pengiriman": "bg-cyan-500",
  };

  return (
    <div className="w-full space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-wider mb-1">ANALYTICS DASHBOARD</h1>
          <p className="text-gray-500 font-mono text-sm">Live performance metrics dari database</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-purple-500/30 text-purple-400 text-xs font-mono font-bold tracking-widest bg-purple-500/5">
          <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)] animate-pulse"></div>
          LIVE DATA
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64 text-gray-500 font-mono text-sm animate-pulse">
          Loading analytics from database...
        </div>
      ) : (
        <>
          {/* 4 Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            
            {/* Revenue / Active Alerts — Role based */}
            {userRole === "Admin" ? (
              <div className="bg-[#14151a] border border-transparent border-t-green-500/30 p-6 rounded-xl hover:bg-[#181920] transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2.5 bg-green-500/10 text-green-400 rounded-lg">
                    <DollarSign size={18} />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-1 font-mono">{formatRupiah(data?.totalRevenue || 0)}</h3>
                <p className="text-[10px] text-gray-500 tracking-widest uppercase font-mono">Total Revenue</p>
              </div>
            ) : (
              <div className="bg-[#14151a] border border-transparent border-t-yellow-500/30 p-6 rounded-xl hover:bg-[#181920] transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2.5 bg-yellow-500/10 text-yellow-400 rounded-lg">
                    <AlertTriangle size={18} />
                  </div>
                  <div className="text-yellow-400 text-[10px] font-bold font-mono">LIVE</div>
                </div>
                <h3 className="text-3xl font-bold mb-1">{maintenanceVessels}</h3>
                <p className="text-[10px] text-gray-500 tracking-widest uppercase font-mono">Vessels in Maintenance</p>
              </div>
            )}

            {/* Active Shipments */}
            <div className="bg-[#14151a] border border-transparent border-t-purple-500/30 p-6 rounded-xl hover:bg-[#181920] transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 bg-purple-500/10 text-purple-400 rounded-lg">
                  <Package size={18} />
                </div>
                <div className="text-green-400 text-[10px] font-bold font-mono">LIVE</div>
              </div>
              <h3 className="text-3xl font-bold mb-1">{data?.activeShipments || 0}</h3>
              <p className="text-[10px] text-gray-500 tracking-widest uppercase font-mono">Active Shipments</p>
            </div>

            {/* Active Vessels */}
            <div className="bg-[#14151a] border border-transparent border-t-blue-500/30 p-6 rounded-xl hover:bg-[#181920] transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-lg">
                  <Ship size={18} />
                </div>
                <div className="text-green-400 text-[10px] font-bold font-mono">LIVE</div>
              </div>
              <h3 className="text-3xl font-bold mb-1">{activeVessels}</h3>
              <p className="text-[10px] text-gray-500 tracking-widest uppercase font-mono">Active Vessels</p>
            </div>

            {/* Maintenance Vessels */}
            <div className="bg-[#14151a] border border-transparent border-t-yellow-500/30 p-6 rounded-xl hover:bg-[#181920] transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 bg-yellow-500/10 text-yellow-400 rounded-lg">
                  <Anchor size={18} />
                </div>
              </div>
              <h3 className="text-3xl font-bold mb-1">{maintenanceVessels}</h3>
              <p className="text-[10px] text-gray-500 tracking-widest uppercase font-mono">Maintenance Vessels</p>
            </div>
          </div>

          {/* Main Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Shipment Status Distribution */}
            <div className="bg-[#14151a] border border-white/5 p-6 rounded-xl flex flex-col min-h-72">
              <div className="flex items-center gap-2 text-xs font-bold font-mono tracking-widest text-gray-300 uppercase mb-6">
                <BarChart2 size={14} className="text-purple-400" />
                Shipment Status Distribution
              </div>
              <div className="flex-1 space-y-3">
                {(data?.statusCounts || []).map((s: any, i: number) => {
                  const total = (data?.statusCounts || []).reduce((sum: number, x: any) => sum + x._count.id, 0);
                  const pct = total > 0 ? Math.round((s._count.id / total) * 100) : 0;
                  const color = statusColors[s.status] || "bg-gray-500";
                  return (
                    <div key={i}>
                      <div className="flex justify-between text-[10px] font-mono text-gray-400 mb-1">
                        <span>{s.status}</span>
                        <span className="text-white font-bold">{s._count.id} ({pct}%)</span>
                      </div>
                      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${color} rounded-full transition-all duration-700`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
                {(!data?.statusCounts || data.statusCounts.length === 0) && (
                  <p className="text-gray-500 text-xs font-mono text-center mt-8">Belum ada data shipment</p>
                )}
              </div>
            </div>

            {/* Weekly Shipments Bar Chart */}
            <div className="bg-[#14151a] border border-white/5 p-6 rounded-xl relative flex flex-col min-h-72">
              <div className="flex items-center gap-2 text-xs font-bold font-mono tracking-widest text-gray-300 uppercase mb-6">
                <Package size={14} className="text-purple-400" />
                Shipments — 7 Hari Terakhir
              </div>
              <div className="flex-1 flex items-end justify-between px-2 pb-6 border-b border-l border-white/10 relative">
                <div className="absolute -bottom-6 left-0 right-0 flex justify-between px-2 text-[9px] text-gray-500 font-mono">
                  {(data?.weeklyData || []).map((d: any) => (
                    <span key={d.day}>{d.day}</span>
                  ))}
                </div>
                {(data?.weeklyData || []).map((d: any, i: number) => (
                  <div
                    key={i}
                    title={`${d.day}: ${d.count} shipments`}
                    className="w-[10%] bg-purple-500/70 hover:bg-purple-400 transition-colors rounded-t-sm cursor-pointer group relative"
                    style={{ height: `${Math.max(4, (d.count / weeklyMax) * 100)}%` }}
                  >
                    <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-mono text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {d.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Routes + Vessel Status Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Top Routes */}
            <div className="lg:col-span-2 bg-[#14151a] border border-white/5 p-6 rounded-xl flex flex-col">
              <div className="flex items-center gap-2 text-xs font-bold font-mono tracking-widest text-gray-300 uppercase mb-4">
                <TrendingUp size={14} className="text-purple-400" />
                Top Routes (berdasarkan transaksi)
              </div>
              <div className="space-y-3 flex-1">
                {(data?.topRoutes || []).map((r: any, i: number) => (
                  <div key={i}>
                    <div className="flex justify-between text-[10px] font-mono text-gray-400 mb-1">
                      <span className="text-gray-200">{i + 1}. {r.label}</span>
                      <span className="text-purple-400 font-bold">{r.count} tx ({r.percent}%)</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500 rounded-full"
                        style={{ width: `${r.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
                {(!data?.topRoutes || data.topRoutes.length === 0) && (
                  <p className="text-gray-500 text-xs font-mono text-center mt-8">Belum ada data rute</p>
                )}
              </div>
            </div>

            {/* Vessel Status Breakdown */}
            <div className="bg-[#14151a] border border-white/5 p-6 rounded-xl flex flex-col items-center">
              <div className="w-full flex items-center gap-2 text-xs font-bold font-mono tracking-widest text-gray-300 uppercase mb-4">
                <PieChart size={14} className="text-purple-400" />
                Fleet Status
              </div>
              <div className="w-28 h-28 rounded-full border-[12px] border-purple-500 border-r-green-500 border-l-yellow-500 border-t-blue-500 shadow-[0_0_15px_rgba(168,85,247,0.2)] mb-4 shrink-0" />
              <div className="w-full space-y-2 text-[9px] font-mono tracking-wider">
                {(data?.vesselStats || []).map((vs: any) => {
                  const colors: Record<string, string> = { ACTIVE: "bg-green-400", MAINTENANCE: "bg-yellow-500", DOCKED: "bg-blue-400" };
                  return (
                    <div key={vs.status} className="flex justify-between text-gray-400">
                      <span className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${colors[vs.status] || "bg-gray-500"}`} />
                        {vs.status}
                      </span>
                      <span className="text-white font-bold">{vs._count.id}</span>
                    </div>
                  );
                })}
                {(!data?.vesselStats || data.vesselStats.length === 0) && (
                  <p className="text-gray-600 text-center">Tidak ada data</p>
                )}
              </div>
            </div>
          </div>

          {/* System Alerts */}
          <div className="mt-2">
            <div className="flex items-center gap-2 text-sm font-bold tracking-widest font-mono text-yellow-500 uppercase mb-4">
              <AlertTriangle size={18} />
              System Alerts & Notifications
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#1a1811] p-5 rounded-lg border border-yellow-500/20">
                <h3 className="text-2xl font-bold text-yellow-500 mb-1">{maintenanceVessels}</h3>
                <p className="text-xs text-yellow-300/80 uppercase tracking-widest font-bold mb-2">Maintenance Vessels</p>
                <p className="text-[10px] text-yellow-500/70 font-mono tracking-wider">Kapal dalam jadwal perawatan</p>
              </div>
              <div className="bg-[#1a1112] p-5 rounded-lg border border-red-500/20">
                <h3 className="text-2xl font-bold text-red-500 mb-1">{data?.activeShipments || 0}</h3>
                <p className="text-xs text-red-300/80 uppercase tracking-widest font-bold mb-2">Active Shipments</p>
                <p className="text-[10px] text-red-500/70 font-mono tracking-wider">Pengiriman yang sedang berjalan</p>
              </div>
              <div className="bg-[#11151a] p-5 rounded-lg border border-blue-500/20">
                <h3 className="text-2xl font-bold text-blue-500 mb-1">{activeVessels}</h3>
                <p className="text-xs text-blue-300/80 uppercase tracking-widest font-bold mb-2">Active Vessels</p>
                <p className="text-[10px] text-blue-500/70 font-mono tracking-wider">Kapal dalam kondisi aktif beroperasi</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
