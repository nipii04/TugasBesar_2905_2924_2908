"use client";

import { DollarSign, Package, Clock, Fuel, PieChart, BarChart2, TrendingUp, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";

export default function Analytics() {
  const [userRole, setUserRole] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("userRole") || "Admin";
    }
    return "Admin";
  });

  return (
    <div className="w-full space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-wider mb-1">ANALYTICS DASHBOARD</h1>
          <p className="text-gray-500 font-mono text-sm">Real-time performance metrics and insights</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-purple-500/30 text-purple-400 text-xs font-mono font-bold tracking-widest bg-purple-500/5">
          <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)] animate-pulse"></div>
          LIVE DATA
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Role-based Stat Card */}
        {userRole === "Admin" ? (
          <div className="bg-[#14151a] border border-transparent border-t-green-500/30 p-6 rounded-xl hover:bg-[#181920] transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2.5 bg-green-500/10 text-green-400 rounded-lg">
                <DollarSign size={18} />
              </div>
              <div className="text-green-400 text-[10px] font-bold font-mono">
                +12.5%
              </div>
            </div>
            <h3 className="text-3xl font-bold mb-1">$352.0K</h3>
            <p className="text-[10px] text-gray-500 tracking-widest uppercase font-mono">Total Revenue</p>
          </div>
        ) : (
          <div className="bg-[#14151a] border border-transparent border-t-yellow-500/30 p-6 rounded-xl hover:bg-[#181920] transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2.5 bg-yellow-500/10 text-yellow-400 rounded-lg">
                <AlertTriangle size={18} />
              </div>
              <div className="text-yellow-400 text-[10px] font-bold font-mono">
                +2 today
              </div>
            </div>
            <h3 className="text-3xl font-bold mb-1">14</h3>
            <p className="text-[10px] text-gray-500 tracking-widest uppercase font-mono">Active Alerts</p>
          </div>
        )}

        {/* Active Shipments */}
        <div className="bg-[#14151a] border border-transparent border-t-purple-500/30 p-6 rounded-xl hover:bg-[#181920] transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 bg-purple-500/10 text-purple-400 rounded-lg">
              <Package size={18} />
            </div>
            <div className="text-green-400 text-[10px] font-bold font-mono">
              +8 today
            </div>
          </div>
          <h3 className="text-3xl font-bold mb-1">247</h3>
          <p className="text-[10px] text-gray-500 tracking-widest uppercase font-mono">Active Shipments</p>
        </div>

        {/* Delivery Time */}
        <div className="bg-[#14151a] border border-transparent border-t-blue-500/30 p-6 rounded-xl hover:bg-[#181920] transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-lg">
              <Clock size={18} />
            </div>
            <div className="text-blue-400 text-[10px] font-bold font-mono">
              -0.5 days
            </div>
          </div>
          <h3 className="text-3xl font-bold mb-1">14.2 <span className="text-xl text-gray-400">days</span></h3>
          <p className="text-[10px] text-gray-500 tracking-widest uppercase font-mono">Avg Delivery Time</p>
        </div>

        {/* Fuel Efficiency */}
        <div className="bg-[#14151a] border border-transparent border-t-yellow-500/30 p-6 rounded-xl hover:bg-[#181920] transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 bg-yellow-500/10 text-yellow-400 rounded-lg">
              <Fuel size={18} />
            </div>
            <div className="text-green-400 text-[10px] font-bold font-mono">
              +3.2%
            </div>
          </div>
          <h3 className="text-3xl font-bold mb-1">87.5%</h3>
          <p className="text-[10px] text-gray-500 tracking-widest uppercase font-mono">Fuel Efficiency</p>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Role Based */}
        <div className="bg-[#14151a] border border-white/5 p-6 rounded-xl relative h-80 flex flex-col">
          <div className="flex items-center gap-2 text-xs font-bold font-mono tracking-widest text-gray-300 uppercase mb-6">
            {userRole === "Admin" ? (
              <>
                <DollarSign size={14} className="text-purple-400" />
                Revenue Vs Cost (Monthly)
              </>
            ) : (
              <>
                <TrendingUp size={14} className="text-purple-400" />
                Operational Efficiency
              </>
            )}
          </div>
          {/* Chart Placeholder Area (Mocked with CSS) */}
          <div className="flex-1 w-full bg-gradient-to-t from-[#ab5ff7]/10 to-transparent border-b border-l border-white/10 relative rounded-sm">
            <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-[8px] text-gray-500 font-mono">
              <span>Oct</span><span>Nov</span><span>Dec</span><span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span>
            </div>
            <div className="absolute -left-10 top-0 bottom-0 flex flex-col justify-between text-[8px] text-gray-500 font-mono items-end">
              <span>360000</span>
              <span>270000</span>
              <span>180000</span>
              <span>90000</span>
              <span>0</span>
            </div>
            {/* Fake SVG Curve */}
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
               <path d="M0,40 Q20,35 40,20 T70,30 T100,10 L100,100 L0,100 Z" fill="#b975fb" fillOpacity="0.4" />
               <path d="M0,40 Q20,35 40,20 T70,30 T100,10" fill="none" stroke="#b975fb" strokeWidth="1" />
            </svg>
          </div>
        </div>

        {/* Chart 2: Shipment Status (Weekly) */}
        <div className="bg-[#14151a] border border-white/5 p-6 rounded-xl relative h-80 flex flex-col">
          <div className="flex items-center gap-2 text-xs font-bold font-mono tracking-widest text-gray-300 uppercase mb-6">
            <Package size={14} className="text-purple-400" />
            Shipment Status (Weekly)
          </div>
          {/* Bar Chart Placeholder */}
          <div className="flex-1 w-full flex items-end justify-between px-4 pb-0 pt-8 border-b border-l border-white/10 relative">
             <div className="absolute -bottom-6 left-0 right-0 flex justify-between px-6 text-[8px] text-gray-500 font-mono">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
            <div className="absolute -left-8 top-0 bottom-0 flex flex-col justify-between text-[8px] text-gray-500 font-mono items-end pt-4">
              <span>160</span><span>120</span><span>80</span><span>40</span><span>0</span>
            </div>
            {/* Fake Bars */}
            {[120, 135, 145, 130, 155, 95, 80].map((val, i) => (
              <div key={i} className="w-[8%] bg-red-500 hover:bg-red-400 transition-colors rounded-t-sm" style={{ height: `${(val/160)*100}%` }}></div>
            ))}
          </div>
        </div>

      </div>

      {/* Secondary Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* On-Time Performance */}
        <div className="lg:col-span-2 bg-[#14151a] border border-white/5 p-6 rounded-xl relative h-64 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2 text-xs font-bold font-mono tracking-widest text-gray-300 uppercase">
              <TrendingUp size={14} className="text-purple-400" />
              On-Time Performance (%)
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
              <span className="text-[9px] font-mono text-gray-500 tracking-widest">REAL-TIME</span>
            </div>
          </div>
          {/* Chart Wrapper */}
          <div className="flex-1 w-full border-b border-l border-white/10 relative flex items-center pt-4">
            <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-[8px] text-gray-500 font-mono">
              <span>00:00</span><span>04:00</span><span>08:00</span><span>12:00</span><span>16:00</span><span>20:00</span><span>24:00</span>
            </div>
            <div className="absolute -left-8 top-0 bottom-0 flex flex-col justify-between text-[8px] text-gray-500 font-mono items-end pt-2 pb-0">
              <span>100</span><span>75</span><span>50</span><span>25</span><span>0</span>
            </div>
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
               <path d="M0,10 L20,15 L40,5 L60,11 L80,5 L100,7" fill="none" stroke="#f43f5e" strokeWidth="1.5" />
               <circle cx="0" cy="10" r="1.5" fill="#f43f5e" />
               <circle cx="20" cy="15" r="1.5" fill="#f43f5e" />
               <circle cx="40" cy="5" r="1.5" fill="#f43f5e" />
               <circle cx="60" cy="11" r="1.5" fill="#f43f5e" />
               <circle cx="80" cy="5" r="1.5" fill="#f43f5e" />
               <circle cx="100" cy="7" r="1.5" fill="#f43f5e" />
            </svg>
          </div>
        </div>

        {/* Popular Routes */}
        <div className="bg-[#14151a] border border-white/5 p-6 rounded-xl relative h-64 flex flex-col items-center">
          <div className="w-full flex items-center gap-2 text-xs font-bold font-mono tracking-widest text-gray-300 uppercase mb-4">
            <PieChart size={14} className="text-purple-400" />
            Popular Routes
          </div>
          <div className="w-24 h-24 rounded-full border-[10px] border-purple-500 border-r-purple-400 border-l-purple-600 border-t-purple-300 relative shadow-[0_0_15px_rgba(168,85,247,0.2)] mb-4 shrink-0"></div>
          
          <div className="w-full space-y-2 mt-auto text-[9px] font-mono tracking-wider">
            <div className="flex justify-between text-gray-400"><span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-purple-300"></span> Jakarta-Singapore</span><span>28%</span></div>
            <div className="flex justify-between text-gray-400"><span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-purple-400"></span> Jakarta-Shanghai</span><span>22%</span></div>
            <div className="flex justify-between text-gray-400"><span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-purple-500"></span> Jakarta-Tokyo</span><span>18%</span></div>
          </div>
        </div>

      </div>

      {/* System Alerts */}
      <div className="mt-8">
        <div className="flex items-center gap-2 text-sm font-bold tracking-widest font-mono text-yellow-500 uppercase mb-4">
          <AlertTriangle size={18} />
          System Alerts & Notifications
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Alert 1 */}
          <div className="bg-[#1a1811] p-5 rounded-lg border border-yellow-500/20">
            <h3 className="text-2xl font-bold text-yellow-500 mb-1">3</h3>
            <p className="text-xs text-yellow-300/80 uppercase tracking-widest font-bold mb-2">Fuel Alerts</p>
            <p className="text-[10px] text-yellow-500/70 font-mono tracking-wider">Vessels below 30% fuel</p>
          </div>
          
          {/* Alert 2 */}
          <div className="bg-[#1a1112] p-5 rounded-lg border border-red-500/20">
            <h3 className="text-2xl font-bold text-red-500 mb-1">1</h3>
            <p className="text-xs text-red-300/80 uppercase tracking-widest font-bold mb-2">Maintenance Due</p>
            <p className="text-[10px] text-red-500/70 font-mono tracking-wider">VS004 scheduled maintenance</p>
          </div>
          
          {/* Alert 3 */}
          <div className="bg-[#11151a] p-5 rounded-lg border border-blue-500/20">
            <h3 className="text-2xl font-bold text-blue-500 mb-1">7</h3>
            <p className="text-xs text-blue-300/80 uppercase tracking-widest font-bold mb-2">Route Delays</p>
            <p className="text-[10px] text-blue-500/70 font-mono tracking-wider">Weather-related delays</p>
          </div>
        </div>
      </div>

    </div>
  );
}
