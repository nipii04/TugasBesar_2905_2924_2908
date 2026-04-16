import React from 'react';
import { Waves, Search, Package, Home, Calculator, UserPlus, LogIn } from 'lucide-react';
import Link from 'next/link';

export default function TrackPage() {
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
            <button className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 text-purple-400 rounded-md border border-purple-500/20">
              <Package className="w-3 h-3" />
              TRACK SHIPMENT
            </button>
            <Link href="/calculator" className="flex items-center gap-2 px-4 py-2 hover:text-white transition-colors">
              <Calculator className="w-3 h-3" />
              PRICE CALCULATOR
            </Link>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-purple-500/30 hover:bg-purple-500/10 transition-all text-white text-sm font-semibold rounded-md">
              <UserPlus className="w-4 h-4" />
              SIGN UP
            </button>
            <button className="flex items-center gap-2 px-6 py-2 bg-purple-500 hover:bg-purple-400 transition-all text-white text-sm font-semibold rounded-md shadow-[0_0_15px_rgba(168,85,247,0.4)]">
              <LogIn className="w-4 h-4" />
              SIGN IN
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 mt-12">
        <h2 className="text-3xl font-bold mb-2">Track Your Shipment</h2>
        <p className="text-zinc-400 text-sm mb-8">Enter your tracking number to view shipment status</p>

        {/* Input Card */}
        <div className="p-6 bg-[#111114] border border-zinc-800/50 rounded-xl mb-8 shadow-lg">
          <div className="flex gap-4 mb-4">
            <input 
              type="text" 
              placeholder="Enter tracking number (e.g., OL2026041301)" 
              className="flex-1 bg-[#1a1a1f] border border-zinc-800 rounded-md px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
            />
            <button className="flex items-center justify-center gap-2 px-8 bg-[#b77bff] hover:bg-purple-400 text-white font-bold text-sm rounded-md transition-colors">
              <Search className="w-4 h-4" />
              TRACK
            </button>
          </div>
          <p className="text-xs text-zinc-500 mb-2">Try these sample tracking numbers:</p>
          <div className="flex gap-4 text-xs font-semibold text-[#b77bff]">
            <button className="hover:text-white transition-colors">OL2026041301</button>
            <button className="hover:text-white transition-colors">OL2026041302</button>
            <button className="hover:text-white transition-colors">OL2026041303</button>
          </div>
        </div>

        {/* Empty State Card */}
        <div className="p-16 bg-[#111114] border border-zinc-800/50 rounded-xl flex flex-col items-center justify-center text-center">
          <Package className="w-12 h-12 text-zinc-600 mb-4" />
          <h3 className="text-lg font-bold mb-2 text-white">No Shipment Tracked Yet</h3>
          <p className="text-sm text-zinc-500">Enter a tracking number above to view shipment details</p>
        </div>
      </main>
    </div>
  );
}