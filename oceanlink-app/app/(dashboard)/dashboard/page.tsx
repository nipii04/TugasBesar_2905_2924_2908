"use client";

import { Ship, Package, DollarSign, Users, Anchor, AlertTriangle, TrendingUp, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
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
              <span>+2 new</span>
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-bold mb-1 group-hover:text-purple-300 transition-colors">12</h3>
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
            <h3 className="text-3xl font-bold mb-1 group-hover:text-green-300 transition-colors">250</h3>
            <p className="text-[10px] text-gray-500 tracking-widest uppercase font-mono">Active Shipments</p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-[#14151a] border border-white/5 p-6 rounded-xl relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-yellow-500/10 text-yellow-400 rounded-lg">
              <DollarSign size={20} />
            </div>
            <div className="flex items-center gap-1 text-green-400/90 text-[10px] font-bold font-mono">
              <ArrowUpRight size={14} />
              <span>+12.5%</span>
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-bold mb-1 group-hover:text-yellow-300 transition-colors">$351K</h3>
            <p className="text-[10px] text-gray-500 tracking-widest uppercase font-mono">Total Revenue</p>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-[#14151a] border border-white/5 p-6 rounded-xl relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg">
              <Users size={20} />
            </div>
            <div className="flex items-center gap-1 text-green-400/90 text-[10px] font-bold font-mono">
              <ArrowUpRight size={14} />
              <span>+8.3%</span>
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-bold mb-1 group-hover:text-blue-300 transition-colors">1,843</h3>
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
                 <th className="font-semibold p-4 w-24">Vessel ID</th>
                 <th className="font-semibold p-4">Vessel Name</th>
                 <th className="font-semibold p-4">Route</th>
                 <th className="font-semibold p-4">Captain</th>
                 <th className="font-semibold p-4">Status</th>
                 <th className="font-semibold p-4">ETA</th>
                 <th className="font-semibold p-4 text-right">Progress</th>
               </tr>
             </thead>
             <tbody className="text-xs font-mono text-gray-300">
               {/* VS001 */}
               <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                 <td className="p-4 font-bold text-purple-400">VS001</td>
                 <td className="p-4 flex items-center gap-3">
                   <div className="p-1.5 bg-purple-500/10 text-purple-400 rounded">
                     <Ship size={14} />
                   </div>
                   <span className="font-sans font-bold text-sm text-gray-200">MV Ocean Navigator</span>
                 </td>
                 <td className="p-4 text-gray-400">Jakarta &rarr; Tokyo</td>
                 <td className="p-4">Capt. Ahmad Yusuf</td>
                 <td className="p-4">
                   <div className="inline-flex flex-row items-center gap-1.5 px-3 py-1 rounded-full border border-green-500/30 text-[9px] font-bold text-green-400 tracking-wider">
                     <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                     ACTIVE
                   </div>
                 </td>
                 <td className="p-4 text-gray-400">2026-04-15<br/>14:30</td>
                 <td className="p-4">
                   <div className="flex items-center justify-end gap-3 text-[10px]">
                     <div className="w-12 h-1 bg-white/10 rounded-full overflow-hidden">
                       <div className="h-full bg-purple-500" style={{ width: '65%' }}></div>
                     </div>
                     <span className="w-6 text-right">65%</span>
                   </div>
                 </td>
               </tr>

               {/* VS002 */}
               <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                 <td className="p-4 font-bold text-purple-400">VS002</td>
                 <td className="p-4 flex items-center gap-3">
                   <div className="p-1.5 bg-purple-500/10 text-purple-400 rounded">
                     <Ship size={14} />
                   </div>
                   <span className="font-sans font-bold text-sm text-gray-200">MV Maritime Explorer</span>
                 </td>
                 <td className="p-4 text-gray-400">Singapore &rarr; Mumbai</td>
                 <td className="p-4">Capt. Sarah Lee</td>
                 <td className="p-4">
                   <div className="inline-flex flex-row items-center gap-1.5 px-3 py-1 rounded-full border border-blue-500/30 text-[9px] font-bold text-blue-400 tracking-wider bg-blue-500/10">
                     <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                     IN PORT
                   </div>
                 </td>
                 <td className="p-4 text-gray-400">2026-04-13<br/>09:00</td>
                 <td className="p-4">
                   <div className="flex items-center justify-end gap-3 text-[10px]">
                     <div className="w-12 h-1 bg-white/10 rounded-full overflow-hidden">
                       <div className="h-full bg-blue-500" style={{ width: '100%' }}></div>
                     </div>
                     <span className="w-6 text-right text-blue-400">100%</span>
                   </div>
                 </td>
               </tr>

               {/* VS003 */}
               <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                 <td className="p-4 font-bold text-purple-400">VS003</td>
                 <td className="p-4 flex items-center gap-3">
                   <div className="p-1.5 bg-purple-500/10 text-purple-400 rounded">
                     <Ship size={14} />
                   </div>
                   <span className="font-sans font-bold text-sm text-gray-200">MV Pacific Voyager</span>
                 </td>
                 <td className="p-4 text-gray-400">Jakarta &rarr; Singapore</td>
                 <td className="p-4">Capt. Michael Chen</td>
                 <td className="p-4">
                   <div className="inline-flex flex-row items-center gap-1.5 px-3 py-1 rounded-full border border-yellow-500/30 text-[9px] font-bold text-yellow-400 tracking-wider">
                     <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                     DELAYED
                   </div>
                 </td>
                 <td className="p-4 text-gray-400">2026-04-18<br/>16:45</td>
                 <td className="p-4">
                   <div className="flex items-center justify-end gap-3 text-[10px]">
                     <div className="w-12 h-1 bg-white/10 rounded-full overflow-hidden">
                       <div className="h-full bg-yellow-500" style={{ width: '42%' }}></div>
                     </div>
                     <span className="w-6 text-right">42%</span>
                   </div>
                 </td>
               </tr>

               {/* VS004 */}
               <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                 <td className="p-4 font-bold text-purple-400">VS004</td>
                 <td className="p-4 flex items-center gap-3">
                   <div className="p-1.5 bg-purple-500/10 text-purple-400 rounded">
                     <Ship size={14} />
                   </div>
                   <span className="font-sans font-bold text-sm text-gray-200">MV Stellar Carrier</span>
                 </td>
                 <td className="p-4 text-gray-400">Jakarta &rarr; Shanghai</td>
                 <td className="p-4">Capt. David Wong</td>
                 <td className="p-4">
                   <div className="inline-flex flex-row items-center gap-1.5 px-3 py-1 rounded-full border border-red-500/30 text-[9px] font-bold text-red-400 tracking-wider bg-red-500/10">
                     <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                     MAINTENANCE
                   </div>
                 </td>
                 <td className="p-4 text-gray-400">2026-04-20<br/>08:00</td>
                 <td className="p-4">
                   <div className="flex items-center justify-end gap-3 text-[10px]">
                     <div className="w-12 h-1 bg-white/10 rounded-full overflow-hidden">
                       <div className="h-full bg-red-500" style={{ width: '0%' }}></div>
                     </div>
                     <span className="w-6 text-right text-gray-500">0%</span>
                   </div>
                 </td>
               </tr>

               {/* VS005 */}
               <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                 <td className="p-4 font-bold text-purple-400">VS005</td>
                 <td className="p-4 flex items-center gap-3">
                   <div className="p-1.5 bg-purple-500/10 text-purple-400 rounded">
                     <Ship size={14} />
                   </div>
                   <span className="font-sans font-bold text-sm text-gray-200">MV Global Pioneer</span>
                 </td>
                 <td className="p-4 text-gray-400">Surabaya &rarr; Hong Kong</td>
                 <td className="p-4">Capt. Robert Kim</td>
                 <td className="p-4">
                   <div className="inline-flex flex-row items-center gap-1.5 px-3 py-1 rounded-full border border-green-500/30 text-[9px] font-bold text-green-400 tracking-wider">
                     <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                     ACTIVE
                   </div>
                 </td>
                 <td className="p-4 text-gray-400">2026-04-14<br/>11:20</td>
                 <td className="p-4">
                   <div className="flex items-center justify-end gap-3 text-[10px]">
                     <div className="w-12 h-1 bg-white/10 rounded-full overflow-hidden">
                       <div className="h-full bg-purple-500" style={{ width: '78%' }}></div>
                     </div>
                     <span className="w-6 text-right">78%</span>
                   </div>
                 </td>
               </tr>
             </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="p-4 border-t border-white/5 bg-[#111115] flex justify-between items-center text-xs font-mono text-gray-500">
          <p>Showing <span className="text-white font-bold">5</span> of <span className="text-white font-bold">12</span> vessels</p>
          <Link href="/fleet" className="px-5 py-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 font-bold tracking-widest rounded transition-colors uppercase">
            View All Vessels
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
          <h4 className="text-3xl font-bold font-mono text-green-400 mb-2">92.5%</h4>
          <p className="text-xs text-gray-500 font-mono">Fleet operational efficiency</p>
        </div>

        {/* Bottom Card 2 */}
        <div className="bg-[#14151a] border border-transparent border-b-yellow-500/30 p-6 rounded-xl hover:bg-[#181920] transition-colors">
          <div className="flex items-center gap-2 text-[10px] text-gray-400 uppercase tracking-widest font-mono font-bold mb-4">
             <AlertTriangle size={14} className="text-yellow-400" />
             Alerts
          </div>
          <h4 className="text-3xl font-bold font-mono text-yellow-500 mb-2">3</h4>
          <p className="text-xs text-gray-500 font-mono">Active maintenance & delays</p>
        </div>

        {/* Bottom Card 3 */}
        <div className="bg-[#14151a] border border-transparent border-b-purple-500/30 p-6 rounded-xl hover:bg-[#181920] transition-colors">
          <div className="flex items-center gap-2 text-[10px] text-gray-400 uppercase tracking-widest font-mono font-bold mb-4">
             <TrendingUp size={14} className="text-purple-400" />
             This Month
          </div>
          <h4 className="text-3xl font-bold font-mono text-purple-300 mb-2">1,247</h4>
          <p className="text-xs text-gray-500 font-mono">Completed shipments</p>
        </div>

      </div>

    </div>
  );
}
