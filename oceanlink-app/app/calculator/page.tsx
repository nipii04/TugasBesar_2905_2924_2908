"use client";

import React, { useState, useEffect } from 'react';
import { Waves, Home, Package, Calculator, UserPlus, LogIn, MapPin, Info, DollarSign } from 'lucide-react';
import Link from 'next/link';

export default function CalculatorPage() {
  const [userRole, setUserRole] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    if (role) {
      setUserRole(role);
    }
    setIsMounted(true);
  }, []);

  const rates = [
    { dest: "Singapore", country: "Singapore", rate: "$15", time: "2 - 3 days" },
    { dest: "Manila", country: "Philippines", rate: "$25", time: "4 - 5 days" },
    { dest: "Bangkok", country: "Thailand", rate: "$22", time: "3 - 4 days" },
    { dest: "Ho Chi Minh", country: "Vietnam", rate: "$20", time: "3 - 4 days" },
    { dest: "Kuala Lumpur", country: "Malaysia", rate: "$18", time: "2 - 3 days" },
    { dest: "Hong Kong", country: "Hong Kong", rate: "$30", time: "4 - 5 days" },
    { dest: "Shanghai", country: "China", rate: "$35", time: "5 - 6 days" },
    { dest: "Tokyo", country: "Japan", rate: "$45", time: "6 - 7 days" },
    { dest: "Sydney", country: "Australia", rate: "$50", time: "8 - 9 days" },
    { dest: "Mumbai", country: "India", rate: "$28", time: "5 - 6 days" }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white font-mono selection:bg-purple-500/30 overflow-x-hidden pt-24 pb-12">
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0c]/80 backdrop-blur-md border-b border-zinc-800/50">
        <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
              <Waves className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-wider text-white">OCEANLINK</h1>
              <p className="text-[10px] text-zinc-500 tracking-widest uppercase font-semibold">Primelog Fleet</p>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-[10px] font-semibold tracking-widest text-zinc-400">
            <Link href="/" className="flex items-center gap-2 px-4 py-2 hover:text-white transition-colors">
              <Home className="w-3 h-3" />
              HOME
            </Link>
            <Link href="/track" className="flex items-center gap-2 px-4 py-2 hover:text-white transition-colors">
              <Package className="w-3 h-3" />
              TRACK SHIPMENT
            </Link>
            <button className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 text-purple-400 rounded-md border border-purple-500/20">
              <Calculator className="w-3 h-3" />
              PRICE CALCULATOR
            </button>
          </div>
          
          <div className="flex items-center gap-3 min-w-[160px] justify-end">
            {isMounted && (
              userRole ? (
                 <div className="flex items-center gap-4">
                   <span className="text-[10px] font-bold text-purple-300 tracking-wider uppercase border border-purple-500/20 px-3 py-1 rounded bg-purple-500/10">
                     {userRole}
                   </span>
                   <button onClick={() => { localStorage.removeItem('userRole'); setUserRole(''); window.location.reload(); }} className="flex items-center gap-2 px-4 py-2 border border-white/10 hover:border-red-500/30 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-all text-xs font-semibold rounded-md">
                     SIGN OUT
                   </button>
                 </div>
              ) : (
                <>
                  <Link href="/register" className="flex items-center gap-2 px-4 py-2 border border-purple-500/30 hover:bg-purple-500/10 transition-all text-white text-sm font-semibold rounded-md">
                    <UserPlus className="w-4 h-4" />
                    SIGN UP
                  </Link>
                  <Link href="/login" className="flex items-center gap-2 px-6 py-2 bg-purple-500 hover:bg-purple-400 transition-all text-white text-sm font-semibold rounded-md shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                    <LogIn className="w-4 h-4" />
                    SIGN IN
                  </Link>
                </>
              )
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 mt-12">
        <h2 className="text-3xl font-bold mb-2">Shipping Price Calculator</h2>
        <p className="text-zinc-400 text-sm mb-10">Calculate your shipping costs based on destination and weight</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Form Card */}
          <div className="p-8 bg-[#111114] border border-zinc-800/50 rounded-xl">
            <div className="flex items-center gap-2 mb-6">
              <Calculator className="w-5 h-5 text-purple-400" />
              <h3 className="font-bold">Calculate Shipping Cost</h3>
            </div>

            <div className="space-y-6">
              <div>
                <label className="flex items-center gap-2 text-xs font-semibold text-zinc-400 mb-2">
                  <MapPin className="w-3 h-3" /> DESTINATION PORT
                </label>
                <select className="w-full bg-[#1a1a1f] border border-zinc-800 rounded-md px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50 appearance-none">
                  <option value="">Select destination</option>
                  {rates.map((r, i) => <option key={i} value={r.dest}>{r.dest}, {r.country}</option>)}
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-semibold text-zinc-400 mb-2">
                  <Package className="w-3 h-3" /> PACKAGE WEIGHT (KG)
                </label>
                <input 
                  type="number" 
                  placeholder="Enter weight in kilograms" 
                  className="w-full bg-[#1a1a1f] border border-zinc-800 rounded-md px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50"
                />
              </div>

              <button className="w-full py-3 bg-[#b77bff] hover:bg-purple-400 text-white font-bold text-sm rounded-md transition-colors flex justify-center items-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                <Calculator className="w-4 h-4" />
                CALCULATE PRICE
              </button>

              <div className="p-4 bg-purple-500/5 border border-purple-500/10 rounded-md flex gap-3 text-xs text-zinc-400 leading-relaxed">
                <Info className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <p className="mb-1 text-zinc-300">Prices include:</p>
                  <ul className="space-y-1">
                    <li>Base shipping rate per kg</li>
                    <li>2% insurance fee</li>
                    <li>$5 handling fee</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Result Card */}
          <div className="p-8 bg-[#111114] border border-zinc-800/50 rounded-xl flex flex-col items-center justify-center text-center min-h-[400px]">
            <DollarSign className="w-16 h-16 text-zinc-700 mb-4" />
            <h3 className="text-xl font-bold mb-2">Calculate Your Price</h3>
            <p className="text-sm text-zinc-500 max-w-xs">Select destination and enter weight to see estimated shipping cost</p>
          </div>
        </div>

        {/* Table Section */}
        <div className="p-8 bg-[#111114] border border-zinc-800/50 rounded-xl">
          <div className="flex items-center gap-2 mb-6">
            <MapPin className="w-5 h-5 text-purple-400" />
            <h3 className="font-bold">Available Destinations & Rates</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-400">
              <thead>
                <tr className="text-[10px] tracking-widest border-b border-zinc-800">
                  <th className="pb-4 font-semibold">DESTINATION</th>
                  <th className="pb-4 font-semibold">COUNTRY</th>
                  <th className="pb-4 font-semibold">RATE PER KG</th>
                  <th className="pb-4 font-semibold">EST. DELIVERY</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {rates.map((row, idx) => (
                  <tr key={idx} className="hover:bg-zinc-900/30 transition-colors">
                    <td className="py-4 font-semibold text-white">{row.dest}</td>
                    <td className="py-4">{row.country}</td>
                    <td className="py-4 text-[#b77bff] font-bold">{row.rate}</td>
                    <td className="py-4">{row.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}