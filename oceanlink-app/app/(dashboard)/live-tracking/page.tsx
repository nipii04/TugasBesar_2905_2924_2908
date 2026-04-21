"use client";

import React, { useState } from 'react';
import { Search, MapPin, Ship } from 'lucide-react';

export default function LiveTrackingDashboard() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [isTracking, setIsTracking] = useState(false);

  const handleTrack = () => {
    if (trackingNumber.trim()) {
      setIsTracking(true);
    }
  };

  return (
    <div className="w-full space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-2 tracking-wide">Live Global Tracking</h2>
        <p className="text-sm text-gray-500 font-mono">Monitor fleet vessels and cargo coordinates in real-time.</p>
      </div>

      {/* Input Card */}
      <div className="p-6 bg-[#111115] border border-white/5 rounded-2xl shadow-lg">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <input 
            type="text" 
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            placeholder="Enter Vessel ID or Cargo Tracking (e.g., OL2026041301)" 
            className="flex-1 bg-[#1a1c23] border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all font-mono"
          />
          <button 
            onClick={handleTrack}
            className="flex items-center justify-center gap-2 px-8 py-3 sm:py-0 bg-purple-500 hover:bg-purple-400 text-white font-bold text-sm rounded-xl transition-colors shadow-[0_0_15px_rgba(168,85,247,0.3)]">
            <Search className="w-4 h-4" />
            LOCATE
          </button>
        </div>
        <p className="text-xs text-zinc-500 mb-2 font-mono">Active Vessels:</p>
        <div className="flex gap-4 text-xs font-semibold text-purple-400 font-mono">
          <button onClick={() => { setTrackingNumber("MV-OCEAN-NAVIGATOR"); setIsTracking(true); }} className="hover:text-white transition-colors">MV-OCEAN-NAVIGATOR</button>
          <button onClick={() => { setTrackingNumber("MV-PACIFIC-STAR"); setIsTracking(true); }} className="hover:text-white transition-colors">MV-PACIFIC-STAR</button>
        </div>
      </div>

      {/* Map Simulation */}
      {isTracking ? (
        <div className="w-full h-[500px] bg-[#0d0e12] border border-white/5 rounded-2xl relative overflow-hidden flex items-center justify-center isolate shadow-[0_0_30px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in-95 duration-500">
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
            <span className="text-[9px] font-bold bg-black/60 border border-zinc-800 px-2 py-0.5 rounded text-zinc-400 tracking-widest uppercase font-mono">JAKARTA (ID)</span>
          </div>

          {/* Destination Marker */}
          <div className="absolute top-[56%] left-[70%] flex flex-col items-center -translate-x-1/2 -translate-y-1/2">
            <MapPin className="w-6 h-6 text-purple-400 mb-1 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
            <span className="text-[9px] font-bold bg-purple-500/10 border border-purple-500/30 px-2 py-0.5 rounded text-purple-300 tracking-widest uppercase shadow-[0_0_10px_rgba(168,85,247,0.2)] font-mono">TOKYO (JP)</span>
          </div>
          
          {/* Moving Ship Pin / Radar */}
          <div className="absolute top-[46%] left-[45%] flex flex-col items-center -translate-x-1/2 -translate-y-1/2 z-10 group cursor-pointer">
            <div className="relative">
              {/* Radar pulse effect */}
              <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-60 w-10 h-10 -left-1 -top-1"></div>
              <div className="p-2 bg-green-500 text-black rounded-full relative shadow-[0_0_20px_rgba(34,197,94,0.8)]">
                <Ship className="w-4 h-4" />
              </div>
            </div>
            
            {/* Tooltip that pops on hover */}
            <div className="mt-3 text-[10px] bg-[#111115]/90 border border-green-500/50 text-green-400 px-4 py-2 rounded-xl font-bold tracking-widest backdrop-blur-md shadow-2xl shadow-green-500/10 w-max pointer-events-none transition-opacity">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                {trackingNumber || "MV-OCEAN-NAVIGATOR"}
              </div>
              <div className="text-zinc-400 font-mono mt-0.5 font-normal tracking-normal text-[9px] flex gap-3">
                <span>SPEED: 18 KTS</span>
                <span>HDG: 045°</span>
              </div>
              <div className="text-zinc-500 font-mono mt-1 font-normal tracking-normal text-[9px]">
                Lat: 14.59° N, Lng: 119.98° E
              </div>
            </div>
          </div>

          {/* Map UI Overlays */}
          <div className="absolute top-6 left-6 flex gap-2">
            <div className="px-4 py-2 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 text-[10px] tracking-widest text-zinc-300 shadow-lg font-mono flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
              LIVE SATELLITE FEED
            </div>
          </div>
          <div className="absolute bottom-6 right-6 flex gap-2">
            <div className="px-4 py-2 bg-purple-500/10 backdrop-blur-md rounded-lg border border-purple-500/30 text-[10px] font-bold tracking-widest text-purple-400 shadow-lg flex items-center gap-2 font-mono">
              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
              GPS SYNCED (AES-256)
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full h-[500px] bg-[#111115]/50 border border-white/5 border-dashed rounded-2xl flex flex-col items-center justify-center text-center">
            <div className="p-4 bg-white/5 rounded-full mb-4">
              <MapPin className="w-12 h-12 text-zinc-600" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-white">Standby Mode</h3>
            <p className="text-sm text-zinc-500 max-w-md font-mono">Enter a Vessel ID or select an active vessel above to initialize global satellite tracking sequence.</p>
        </div>
      )}
    </div>
  );
}
