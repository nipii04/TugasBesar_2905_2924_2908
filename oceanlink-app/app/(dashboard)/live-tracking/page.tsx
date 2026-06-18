"use client";

import React, { useState } from 'react';
import { Search, MapPin, Ship, AlertCircle, Loader2 } from 'lucide-react';


export default function LiveTrackingDashboard() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [trackingData, setTrackingData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async () => {
    if (!trackingNumber.trim()) {
      setError("Form tidak lengkap: Masukkan nomor tracking terlebih dahulu");
      return;
    }

    setIsLoading(true);
    setError('');
    setIsTracking(false);
    setTrackingData(null);

    try {
      const res = await fetch(`/api/tracking/${trackingNumber}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error occurred while fetching data");
      } else {
        setTrackingData(data.data);
        setIsTracking(true);
      }
    } catch (err) {
      setError("Network error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Convert coords to percentage for simple visual map simulation
  // 90 N to 90 S -> 0% to 100% Y
  // 180 W to 180 E -> 0% to 100% X
  const getMapPosition = (lat: number, lng: number) => {
    // Normalizing logic for visual simulation
    const y = ((90 - lat) / 180) * 100;
    const x = ((180 + lng) / 360) * 100;
    return { top: `${Math.max(10, Math.min(90, y))}%`, left: `${Math.max(10, Math.min(90, x))}%` };
  };

  const shipPos = trackingData?.deliveryDetail?.currentLat ? getMapPosition(trackingData.deliveryDetail.currentLat, trackingData.deliveryDetail.currentLng) : { top: '46%', left: '45%' };

  return (
    <div className="w-full space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-2 tracking-wide">Live Global Tracking</h2>
        <p className="text-sm text-gray-500 font-mono">Monitor fleet vessels and cargo coordinates in real-time.</p>
      </div>

      {/* Input Card */}
      <div className="p-6 bg-[#111115] border border-white/5 rounded-2xl shadow-lg">
        <div className="flex flex-col sm:flex-row gap-4 items-start">
          <div className="flex-1 w-full space-y-1.5">
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => { setTrackingNumber(e.target.value); if (error) setError(''); }}
              placeholder="Enter Vessel ID or Cargo Tracking (e.g., TRK-123456-ABCD)"
              className={`w-full bg-[#1a1c23] border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all font-mono ${
                error ? 'border-red-500/60' : 'border-white/5'
              }`}
            />
            {error && (
              <p className="text-red-400 text-[11px] font-mono flex items-center gap-1">
                <span className="text-red-500">✕</span> {error}
              </p>
            )}
          </div>
          <button
            onClick={handleTrack}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 px-8 py-3 bg-purple-500 hover:bg-purple-400 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition-colors shadow-[0_0_15px_rgba(168,85,247,0.3)] shrink-0 w-full sm:w-auto">
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            LOCATE
          </button>
        </div>


      </div>

      {/* Map Simulation */}
      {isTracking && trackingData ? (
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

          {/* Origin Marker */}
          <div className="absolute top-[40%] left-[25%] flex flex-col items-center -translate-x-1/2 -translate-y-1/2">
            <MapPin className="w-5 h-5 text-zinc-500 mb-1" />
            <span className="text-[9px] font-bold bg-black/60 border border-zinc-800 px-2 py-0.5 rounded text-zinc-400 tracking-widest uppercase font-mono">{trackingData.originPort?.name || "ORIGIN"}</span>
          </div>

          {/* Destination Marker */}
          <div className="absolute top-[56%] left-[70%] flex flex-col items-center -translate-x-1/2 -translate-y-1/2">
            <MapPin className="w-6 h-6 text-purple-400 mb-1 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
            <span className="text-[9px] font-bold bg-purple-500/10 border border-purple-500/30 px-2 py-0.5 rounded text-purple-300 tracking-widest uppercase shadow-[0_0_10px_rgba(168,85,247,0.2)] font-mono">{trackingData.destinationPort?.name || "DESTINATION"}</span>
          </div>
          
          {/* Moving Ship Pin / Radar */}
          <div className="absolute flex flex-col items-center -translate-x-1/2 -translate-y-1/2 z-10 group cursor-pointer transition-all duration-1000" style={shipPos}>
            <div className="relative">
              {/* Radar pulse effect */}
              <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-60 w-10 h-10 -left-1 -top-1"></div>
              <div className="p-2 bg-green-500 text-black rounded-full relative shadow-[0_0_20px_rgba(34,197,94,0.8)]">
                <Ship className="w-4 h-4" />
              </div>
            </div>
            
            {/* Tooltip that pops on hover */}
            <div className="mt-3 text-[10px] bg-[#111115]/90 border border-green-500/50 text-green-400 px-4 py-3 rounded-xl font-bold tracking-widest backdrop-blur-md shadow-2xl shadow-green-500/10 w-max pointer-events-none transition-opacity flex flex-col gap-1.5">
              <div className="flex items-center gap-2 border-b border-green-500/20 pb-1.5 mb-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-white text-xs">{trackingData.vessel?.name || trackingNumber}</span>
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-zinc-400 font-mono font-normal tracking-normal text-[10px]">
                <div className="flex flex-col">
                  <span className="text-zinc-600 text-[8px] uppercase">Sender</span>
                  <span className="text-zinc-300">{trackingData.senderName}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-zinc-600 text-[8px] uppercase">Receiver</span>
                  <span className="text-zinc-300">{trackingData.receiverName}</span>
                </div>
                <div className="flex flex-col mt-1">
                  <span className="text-zinc-600 text-[8px] uppercase">Cargo / Shipping</span>
                  <span className="text-purple-300">{trackingData.shippingType}</span>
                </div>
                <div className="flex flex-col mt-1">
                  <span className="text-zinc-600 text-[8px] uppercase">Status</span>
                  <span className="text-green-300">{trackingData.status}</span>
                </div>
              </div>
              <div className="text-zinc-500 font-mono mt-2 pt-1.5 border-t border-green-500/20 font-normal tracking-normal text-[9px] flex justify-between">
                <span>Lat: {trackingData.deliveryDetail?.currentLat || 0}° N</span>
                <span>Lng: {trackingData.deliveryDetail?.currentLng || 0}° E</span>
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
              GPS SYNCED (DB)
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full h-[500px] bg-[#111115]/50 border border-white/5 border-dashed rounded-2xl flex flex-col items-center justify-center text-center">
            <div className="p-4 bg-white/5 rounded-full mb-4">
              <MapPin className="w-12 h-12 text-zinc-600" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-white">Standby Mode</h3>
            <p className="text-sm text-zinc-500 max-w-md font-mono">Enter a Tracking Number above to initialize global satellite tracking sequence.</p>
        </div>
      )}
    </div>
  );
}
