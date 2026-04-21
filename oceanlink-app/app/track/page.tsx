"use client";

import React, { useState, useEffect } from 'react';
import { Waves, Search, Package, Home, Calculator, UserPlus, LogIn, Ship, MapPin, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function TrackPage() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [userRole, setUserRole] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("userRole") || "";
    }
    return "";
  });

  const handleTrack = () => {
    if (trackingNumber.trim()) {
      setIsTracking(true);
    }
  };

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
          
          <div className="flex items-center gap-3 min-w-[160px] justify-end" suppressHydrationWarning>
            {userRole ? (
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
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 mt-12">
        <h2 className="text-3xl font-bold mb-2">Track Your Shipment</h2>
        <p className="text-zinc-400 text-sm mb-8">Enter your tracking number to view real-time location and status</p>

        {/* Input Card */}
        <div className="p-6 bg-[#111114] border border-zinc-800/50 rounded-xl mb-8 shadow-lg">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <input 
              type="text" 
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="Enter tracking number (e.g., OL2026041301)" 
              className="flex-1 bg-[#1a1a1f] border border-zinc-800 rounded-md px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
            />
            <button 
              onClick={handleTrack}
              className="flex items-center justify-center gap-2 px-8 py-3 sm:py-0 bg-[#b77bff] hover:bg-purple-400 text-white font-bold text-sm rounded-md transition-colors shadow-[0_0_15px_rgba(168,85,247,0.3)]">
              <Search className="w-4 h-4" />
              TRACK
            </button>
          </div>
          <p className="text-xs text-zinc-500 mb-2">Try these sample tracking numbers:</p>
          <div className="flex gap-4 text-xs font-semibold text-[#b77bff]">
            <button onClick={() => { setTrackingNumber("OL2026041301"); setIsTracking(true); }} className="hover:text-white transition-colors">OL2026041301</button>
            <button onClick={() => { setTrackingNumber("OL2026041302"); setIsTracking(true); }} className="hover:text-white transition-colors">OL2026041302</button>
            <button onClick={() => { setTrackingNumber("OL2026041303"); setIsTracking(true); }} className="hover:text-white transition-colors">OL2026041303</button>
          </div>
        </div>

        {!isTracking ? (
          userRole === "Pelanggan" ? (
            /* My Shipments Section for Customers */
            <div className="space-y-4 animate-in fade-in duration-500">
              <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
                <Package className="w-5 h-5 text-purple-400" />
                My Active Shipments
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Shipment 1 */}
                <div className="bg-[#111114] border border-zinc-800/50 hover:border-purple-500/50 transition-all rounded-xl p-5 cursor-pointer shadow-lg group" onClick={() => { setTrackingNumber("OL2026041301"); setIsTracking(true); window.scrollTo(0,400); }}>
                  <div className="flex justify-between items-start mb-3">
                    <div className="px-2.5 py-1 text-[9px] font-bold text-green-400 bg-green-500/10 border border-green-500/20 rounded-full tracking-wider">ON SCHEDULE</div>
                    <span className="text-[10px] text-zinc-500 font-mono group-hover:text-purple-400 transition-colors">Track &rarr;</span>
                  </div>
                  <h4 className="font-bold text-white text-lg mb-1 group-hover:text-purple-300 transition-colors">OL2026041301</h4>
                  <p className="text-xs text-zinc-400 mb-4">Jakarta, ID &rang; Tokyo, JP</p>
                  <p className="text-[10px] text-zinc-500 tracking-widest uppercase">Est Arrival: 24 Apr 2026</p>
                </div>
                {/* Shipment 2 */}
                <div className="bg-[#111114] border border-zinc-800/50 hover:border-purple-500/50 transition-all rounded-xl p-5 cursor-pointer shadow-lg group" onClick={() => { setTrackingNumber("OL2026041302"); setIsTracking(true); window.scrollTo(0,400); }}>
                  <div className="flex justify-between items-start mb-3">
                    <div className="px-2.5 py-1 text-[9px] font-bold text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 rounded-full tracking-wider">PORT CLEARANCE</div>
                    <span className="text-[10px] text-zinc-500 font-mono group-hover:text-purple-400 transition-colors">Track &rarr;</span>
                  </div>
                  <h4 className="font-bold text-white text-lg mb-1 group-hover:text-purple-300 transition-colors">OL2026041302</h4>
                  <p className="text-xs text-zinc-400 mb-4">Singapore, SG &rang; Sydney, AU</p>
                  <p className="text-[10px] text-zinc-500 tracking-widest uppercase">Est Arrival: 02 May 2026</p>
                </div>
              </div>
            </div>
          ) : (
            /* Empty State Card (Non-logged in or other roles) */
            <div className="p-16 bg-[#111114] border border-zinc-800/50 rounded-xl flex flex-col items-center justify-center text-center shadow-lg">
              <div className="p-4 bg-zinc-900 rounded-full mb-4 opacity-50">
                <Package className="w-12 h-12 text-zinc-600" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-white">No Shipment Tracked Yet</h3>
              <p className="text-sm text-zinc-500 max-w-md">Enter a legitimate OceanLink tracking number above to view vessel coordinates and complete shipment history.</p>
            </div>
          )
        ) : (
          /* Active Tracking Result */
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Map Simulation */}
            <div className="w-full h-80 bg-[#0d0e12] border border-zinc-800/50 rounded-xl relative overflow-hidden flex items-center justify-center isolate shadow-[0_0_30px_rgba(0,0,0,0.5)]">
              {/* Fake Map Grid lines */}
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#a155f7 1px, transparent 1px), linear-gradient(90deg, #a155f7 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
              
              {/* Continents Abstract Shapes */}
              <svg className="absolute inset-0 w-full h-full opacity-[0.03]" preserveAspectRatio="none" viewBox="0 0 1000 500">
                <path d="M100,100 Q150,50 200,150 T300,120 T400,200 T350,300 T250,250 Z" fill="#fff" />
                <path d="M600,150 Q750,100 800,250 T900,300 T700,450 T650,300 Z" fill="#fff" />
                <path d="M30,300 Q100,200 150,350 T200,450 T50,450 Z" fill="#fff" />
                <path d="M850,50 Q900,0 950,100 T1000,200 T850,150 Z" fill="#fff" />
              </svg>

              {/* Path / Route line */}
              <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 500">
                <path d="M250,200 Q450,100 700,280" fill="none" stroke="#a155f7" strokeWidth="2" strokeDasharray="8 6" className="opacity-60" />
              </svg>

              {/* Origin Marker */}
              <div className="absolute top-[40%] left-[25%] flex flex-col items-center -translate-x-1/2 -translate-y-1/2">
                <MapPin className="w-5 h-5 text-zinc-500 mb-1" />
                <span className="text-[9px] font-bold bg-black/60 border border-zinc-800 px-2 py-0.5 rounded text-zinc-400 tracking-widest uppercase">JAKARTA</span>
              </div>

              {/* Destination Marker */}
              <div className="absolute top-[56%] left-[70%] flex flex-col items-center -translate-x-1/2 -translate-y-1/2">
                <MapPin className="w-6 h-6 text-purple-400 mb-1 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                <span className="text-[9px] font-bold bg-purple-500/10 border border-purple-500/30 px-2 py-0.5 rounded text-purple-300 tracking-widest uppercase shadow-[0_0_10px_rgba(168,85,247,0.2)]">TOKYO</span>
              </div>
              
              {/* Moving Ship Pin / Radar */}
              <div className="absolute top-[46%] left-[45%] flex flex-col items-center -translate-x-1/2 -translate-y-1/2 z-10 group cursor-pointer">
                <div className="relative">
                  {/* Radar pulse effect */}
                  <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-60 w-8 h-8 -left-1.5 -top-1.5"></div>
                  <div className="p-1.5 bg-green-500 text-black rounded-full relative shadow-[0_0_20px_rgba(34,197,94,0.8)]">
                    <Ship className="w-4 h-4" />
                  </div>
                </div>
                
                {/* Tooltip that pops on hover */}
                <div className="mt-3 text-[9px] bg-black/90 border border-green-500/50 text-green-400 px-3 py-1.5 rounded-lg font-bold tracking-widest backdrop-blur-md shadow-lg shadow-green-500/10">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                    IN TRANSIT
                  </div>
                  <div className="text-zinc-400 font-sans mt-0.5 font-normal tracking-normal">Lat: 14.59° N, Lng: 119.98° E</div>
                </div>
              </div>

              {/* Map UI Overlays */}
              <div className="absolute top-4 left-4 flex gap-2">
                 <div className="px-3 py-1 bg-black/60 backdrop-blur-md rounded border border-white/10 text-[10px] tracking-widest text-zinc-300 shadow-lg">LIVE CARGO SATELLITE</div>
              </div>
              <div className="absolute bottom-4 right-4 flex gap-2">
                 <div className="px-3 py-1 bg-purple-500/10 backdrop-blur-md rounded border border-purple-500/30 text-[10px] font-bold tracking-widest text-purple-400 shadow-lg flex items-center gap-2">
                   <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                   GPS SYNCED
                 </div>
              </div>
            </div>

            {/* Shipment Details & Timeline */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              <div className="lg:col-span-1 bg-[#111114] border border-zinc-800/50 rounded-xl p-6 shadow-lg">
                <h4 className="text-xs font-bold text-zinc-500 tracking-widest uppercase mb-6 flex items-center gap-2">
                  <Package className="w-4 h-4 text-purple-400" />
                  Shipment Details
                </h4>
                <div className="space-y-5 text-sm">
                  <div>
                    <p className="text-zinc-500 text-[10px] uppercase tracking-wider mb-1">Tracking Number</p>
                    <p className="font-bold text-white text-base bg-zinc-900/50 py-1.5 px-3 rounded border border-white/5">{trackingNumber}</p>
                  </div>
                  <div>
                    <p className="text-zinc-500 text-[10px] uppercase tracking-wider mb-1">Vessel Assigned</p>
                    <p className="font-bold text-purple-400 flex items-center gap-2"><Ship className="w-3 h-3" /> MV Ocean Navigator</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-zinc-500 text-[10px] uppercase tracking-wider mb-1">Status</p>
                      <p className="font-bold text-green-400 text-xs">ON SCHEDULE</p>
                    </div>
                    <div>
                      <p className="text-zinc-500 text-[10px] uppercase tracking-wider mb-1">Est. Arrival</p>
                      <p className="font-bold text-white text-xs">24 Apr 2026</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-zinc-500 text-[10px] uppercase tracking-wider mb-1">Cargo Type</p>
                    <p className="font-medium text-zinc-300 text-xs">Standard Container (20ft)</p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 bg-[#111114] border border-zinc-800/50 rounded-xl p-6 shadow-lg">
                <h4 className="text-xs font-bold text-zinc-500 tracking-widest uppercase mb-8 flex items-center gap-2">
                  <Waves className="w-4 h-4 text-purple-400" />
                  Transit Timeline
                </h4>
                
                <div className="relative border-l-2 border-zinc-800/80 ml-3 space-y-8">
                  
                  {/* Step 1: Complete */}
                  <div className="relative pl-8 group">
                    <div className="absolute -left-[9px] top-1 p-0.5 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.4)]">
                      <CheckCircle2 className="w-3 h-3 text-black" />
                    </div>
                    <div className="bg-[#1a1a1f] p-4 rounded-lg border border-white/5 transition-colors group-hover:border-white/10">
                      <div className="flex justify-between items-start mb-1">
                        <h5 className="font-bold text-sm text-green-400">Cargo Checked-In & Loaded</h5>
                        <span className="text-[10px] text-zinc-600 font-mono">11 Apr 2026, 08:30</span>
                      </div>
                      <p className="text-[10px] text-zinc-400 mb-2 tracking-wide">Jakarta Port Terminal, ID</p>
                      <p className="text-xs text-zinc-500">All customs documents cleared and cargo securely loaded onto MV Ocean Navigator.</p>
                    </div>
                  </div>

                  {/* Step 2: Active */}
                  <div className="relative pl-8 group">
                     <div className="absolute -left-[11px] top-1 p-1 bg-green-500 rounded-full shadow-[0_0_15px_rgba(34,197,94,0.6)] animate-pulse">
                      <Ship className="w-3.5 h-3.5 text-black" />
                    </div>
                    <div className="bg-[#161a18] p-4 rounded-lg border border-green-500/30">
                      <div className="flex justify-between items-start mb-1">
                        <h5 className="font-bold text-sm text-green-400">Departed Origin Port</h5>
                        <span className="text-[10px] text-green-500/70 font-mono">13 Apr 2026, 14:00</span>
                      </div>
                      <p className="text-[10px] text-green-400/80 mb-2 tracking-wide font-bold">In Transit - Pacific Ocean</p>
                      <p className="text-xs text-zinc-300">Vessel is currently en route to destination. Weather conditions optimal. Speed 18 knots.</p>
                    </div>
                  </div>

                  {/* Step 3: Pending */}
                  <div className="relative pl-8 opacity-40">
                    <div className="absolute -left-[5.5px] top-2 w-2 h-2 bg-zinc-600 rounded-full"></div>
                    <div className="bg-[#1a1a1f] p-4 rounded-lg border border-white/5">
                      <div className="flex justify-between items-start mb-1">
                        <h5 className="font-bold text-sm text-zinc-300">Customs Clearance</h5>
                        <span className="text-[10px] text-zinc-600 font-mono">Pending</span>
                      </div>
                      <p className="text-[10px] text-zinc-500 mb-2 tracking-wide">Tokyo Customs Checkpoint, JP</p>
                      <p className="text-xs text-zinc-500">Pending arrival at destination port for inspection.</p>
                    </div>
                  </div>

                  {/* Step 4: Pending */}
                  <div className="relative pl-8 opacity-40">
                    <div className="absolute -left-[5.5px] top-2 w-2 h-2 bg-zinc-600 rounded-full"></div>
                    <div className="bg-[#1a1a1f] p-4 rounded-lg border border-white/5">
                       <div className="flex justify-between items-start mb-1">
                        <h5 className="font-bold text-sm text-zinc-300">Final Delivery</h5>
                        <span className="text-[10px] text-zinc-600 font-mono">Pending</span>
                      </div>
                      <p className="text-[10px] text-zinc-500 mb-2 tracking-wide">Customer Address, Tokyo</p>
                      <p className="text-xs text-zinc-500">Awaiting discharge from vessel.</p>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        )}
      </main>
    </div>
  );
}