"use client";

import { Ship, Package, DollarSign, Users, Anchor, AlertTriangle, TrendingUp, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getDashboardStats } from "./actions";

export default function Dashboard() {
  const [userRole, setUserRole] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("userRole") || "Admin";
    }
    return "Admin";
  });

  const [stats, setStats] = useState({
    totalVessels: 0,
    activeShipments: 0,
    recentVessels: [] as any[]
  });

  useEffect(() => {
    getDashboardStats().then(setStats).catch(console.error);
  }, []);

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-wider mb-1">DASHBOARD</h1>
        <p className="text-gray-500 font-mono text-sm">Real-time fleet overview and statistics</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Card 1 */}
        <div className="bg-[#14151a] border border-white/5 p-6 rounded-xl relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-purple-500/10 text-purple-400 rounded-lg">
              <Ship size={20} />
            </div>
            <div className="flex items-center gap-1 text-green-400/90 text-[10px] font-bold font-mono">
              <ArrowUpRight size={14} />
              <span>LIVE</span>
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-bold mb-1 group-hover:text-purple-300 transition-colors">{stats.totalVessels}</h3>
            <p className="text-[10px] text-gray-500 tracking-widest uppercase font-mono">Total Vessels</p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-[#14151a] border border-white/5 p-6 rounded-xl relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-green-500/10 text-green-400 rounded-lg">
              <Package size={20} />
            </div>
            <div className="flex items-center gap-1 text-green-400/90 text-[10px] font-bold font-mono">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_5px_rgba(74,222,128,0.8)]"></div>
              <span>LIVE</span>
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-bold mb-1 group-hover:text-green-300 transition-colors">{stats.activeShipments}</h3>
            <p className="text-[10px] text-gray-500 tracking-widest uppercase font-mono">Active Shipments</p>
          </div>
        </div>

        {/* Card 3 (Role Based) */}
        {userRole === "Admin" ? (
          <div className="bg-[#14151a] border border-white/5 p-6 rounded-xl relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-yellow-500/10 text-yellow-400 rounded-lg">
                <DollarSign size={20} />
              </div>
              <div className="flex items-center gap-1 text-green-400/90 text-[10px] font-bold font-mono">
                <ArrowUpRight size={14} />
                <span>LIVE</span>
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-bold mb-1 group-hover:text-yellow-300 transition-colors">$0</h3>
              <p className="text-[10px] text-gray-500 tracking-widest uppercase font-mono">Total Revenue</p>
            </div>
          </div>
        ) : (
          <div className="bg-[#14151a] border border-white/5 p-6 rounded-xl relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-orange-500/10 text-orange-400 rounded-lg">
                <AlertTriangle size={20} />
              </div>
              <div className="flex items-center gap-1 text-orange-400/90 text-[10px] font-bold font-mono">
                <span>!</span>
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-bold mb-1 group-hover:text-orange-300 transition-colors">0</h3>
              <p className="text-[10px] text-gray-500 tracking-widest uppercase font-mono">Pending Repairs</p>
            </div>
          </div>
        )}

        {/* Card 4 */}
        <div className="bg-[#14151a] border border-white/5 p-6 rounded-xl relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg">
              <Users size={20} />
            </div>
            <div className="flex items-center gap-1 text-green-400/90 text-[10px] font-bold font-mono">
              <ArrowUpRight size={14} />
              <span>LIVE</span>
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-bold mb-1 group-hover:text-blue-300 transition-colors">0</h3>
            <p className="text-[10px] text-gray-500 tracking-widest uppercase font-mono">Total Customers</p>
          </div>
        </div>

      </div>

      {/* Fleet Status Table */}
      <div className="bg-[#14151a] border border-white/5 rounded-xl overflow-hidden">
        
        {/* Table Header Wrapper */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#111115]">
          <div>
            <h2 className="text-lg font-bold tracking-wider mb-1">FLEET STATUS & ROUTES</h2>
            <p className="text-gray-500 font-mono text-[11px]">Real-time vessel tracking and status</p>
          </div>
          <div className="flex items-center gap-2 text-purple-400 text-xs font-mono font-bold tracking-widest">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)] animate-pulse"></div>
            LIVE FEED
          </div>
        </div>

        {/* Table container for overflow scroll */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
             <thead>
               <tr className="text-[10px] text-gray-500 uppercase tracking-widest font-mono border-b border-white/5 bg-[#17181f]/40">
                 <th className="font-semibold p-4 w-24">Code</th>
                 <th className="font-semibold p-4">Vessel Name</th>
                 <th className="font-semibold p-4">Type</th>
                 <th className="font-semibold p-4">Capacity</th>
                 <th className="font-semibold p-4">Status</th>
                 <th className="font-semibold p-4 text-right">Action</th>
               </tr>
             </thead>
             <tbody className="text-xs font-mono text-gray-300">
               {stats.recentVessels.map(vessel => {
                 let statusColorStr = "text-gray-400 border-gray-500/30";
                 let bgDot = "bg-gray-500";
                 if (vessel.status === "ACTIVE") {
                   statusColorStr = "text-green-400 border-green-500/30";
                   bgDot = "bg-green-500";
                 } else if (vessel.status === "MAINTENANCE") {
                   statusColorStr = "text-red-400 border-red-500/30 bg-red-500/10";
                   bgDot = "bg-red-500";
                 } else if (vessel.status === "DOCKED") {
                   statusColorStr = "text-blue-400 border-blue-500/30 bg-blue-500/10";
                   bgDot = "bg-blue-500";
                 }

                 return (
                   <tr key={vessel.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                     <td className="p-4 font-bold text-purple-400">{vessel.assignedKey || "-"}</td>
                     <td className="p-4 flex items-center gap-3">
                       <div className="p-1.5 bg-purple-500/10 text-purple-400 rounded">
                         <Ship size={14} />
                       </div>
                       <span className="font-sans font-bold text-sm text-gray-200">{vessel.name}</span>
                     </td>
                     <td className="p-4 text-gray-400">{vessel.type}</td>
                     <td className="p-4">{vessel.capacity} units</td>
                     <td className="p-4">
                       <div className={`inline-flex flex-row items-center gap-1.5 px-3 py-1 rounded-full border ${statusColorStr} text-[9px] font-bold tracking-wider`}>
                         <div className={`w-1.5 h-1.5 ${bgDot} rounded-full`}></div>
                         {vessel.status}
                       </div>
                     </td>
                     <td className="p-4 text-right">
                       <Link href={`/fleet/${vessel.id}/edit`} className="text-purple-400 hover:text-purple-300 font-bold text-xs uppercase tracking-wider">View &rarr;</Link>
                     </td>
                   </tr>
                 );
               })}
               
               {stats.recentVessels.length === 0 && (
                 <tr>
                   <td colSpan={6} className="p-8 text-center text-gray-500">No vessels found.</td>
                 </tr>
               )}
             </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="p-4 border-t border-white/5 bg-[#111115] flex justify-between items-center text-xs font-mono text-gray-500">
          <p>Showing <span className="text-white font-bold">{stats.recentVessels.length}</span> latest vessels</p>
          <Link href="/fleet" className="px-5 py-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 font-bold tracking-widest rounded transition-colors uppercase">
            View All Fleet
          </Link>
        </div>
      </div>

      {/* 3 Bottom Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        
        {/* Bottom Card 1 */}
        <div className="bg-[#14151a] border border-transparent border-b-green-500/30 p-6 rounded-xl hover:bg-[#181920] transition-colors">
          <div className="flex items-center gap-2 text-[10px] text-gray-400 uppercase tracking-widest font-mono font-bold mb-4">
             <Anchor size={14} className="text-green-400" />
             Operational Status
          </div>
          <h4 className="text-3xl font-bold font-mono text-green-400 mb-2">100%</h4>
          <p className="text-xs text-gray-500 font-mono">Fleet operational efficiency</p>
        </div>

        {/* Bottom Card 2 */}
        <div className="bg-[#14151a] border border-transparent border-b-yellow-500/30 p-6 rounded-xl hover:bg-[#181920] transition-colors">
          <div className="flex items-center gap-2 text-[10px] text-gray-400 uppercase tracking-widest font-mono font-bold mb-4">
             <AlertTriangle size={14} className="text-yellow-400" />
             Alerts
          </div>
          <h4 className="text-3xl font-bold font-mono text-yellow-500 mb-2">0</h4>
          <p className="text-xs text-gray-500 font-mono">Active maintenance & delays</p>
        </div>

        {/* Bottom Card 3 */}
        <div className="bg-[#14151a] border border-transparent border-b-purple-500/30 p-6 rounded-xl hover:bg-[#181920] transition-colors">
          <div className="flex items-center gap-2 text-[10px] text-gray-400 uppercase tracking-widest font-mono font-bold mb-4">
             <TrendingUp size={14} className="text-purple-400" />
             This Month
          </div>
          <h4 className="text-3xl font-bold font-mono text-purple-300 mb-2">0</h4>
          <p className="text-xs text-gray-500 font-mono">Completed shipments</p>
        </div>

      </div>

    </div>
  );
}
