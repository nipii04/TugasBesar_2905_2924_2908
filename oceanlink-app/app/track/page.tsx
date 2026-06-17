"use client";

import React, { useState, useEffect } from 'react';
import { Waves, Search, Package, Home, Calculator, UserPlus, LogIn, Ship, MapPin, CheckCircle2, FileText, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function TrackPage() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [trackingData, setTrackingData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("userRole") || "";
    }
    return "";
  });

  const handleTrack = async () => {
    if (!trackingNumber.trim()) {
      setError("Form tidak lengkap: Silakan masukkan nomor tracking");
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
        setError(data.error || "Terjadi kesalahan saat mengambil data");
      } else {
        setTrackingData(data.data);
        setIsTracking(true);
      }
    } catch (err) {
      setError("Terjadi kesalahan jaringan");
    } finally {
      setIsLoading(false);
    }
  };

  const getMapPosition = (lat: number, lng: number) => {
    const y = ((90 - lat) / 180) * 100;
    const x = ((180 + lng) / 360) * 100;
    return { top: `${Math.max(10, Math.min(90, y))}%`, left: `${Math.max(10, Math.min(90, x))}%` };
  };

  const shipPos = trackingData?.deliveryDetail?.currentLat ? getMapPosition(trackingData.deliveryDetail.currentLat, trackingData.deliveryDetail.currentLng) : { top: '46%', left: '45%' };

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
               <div className="flex items-center gap-2 sm:gap-4">
                 {userRole !== "Pelanggan" && (
                   <Link href="/dashboard" className="hidden sm:flex items-center gap-2 px-4 py-2 border border-purple-500/30 text-purple-400 hover:bg-purple-500/10 transition-all text-xs font-semibold rounded-md">
                     <FileText className="w-3 h-3" />
                     DASHBOARD
                   </Link>
                 )}
                 <span className="text-[10px] font-bold text-purple-300 tracking-wider uppercase border border-purple-500/20 px-3 py-1 rounded bg-purple-500/10 hidden sm:block">
                   {userRole}
                 </span>
                 <button onClick={() => { sessionStorage.removeItem('userRole'); sessionStorage.removeItem('userName'); setUserRole(''); window.location.reload(); }} className="flex items-center gap-2 px-4 py-2 border border-white/10 hover:border-red-500/30 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-all text-xs font-semibold rounded-md">
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
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 space-y-1.5">
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => { setTrackingNumber(e.target.value); if (error) setError(''); }}
                placeholder="Enter tracking number (e.g., TRK-123456-ABCD)"
                className={`w-full bg-[#1a1a1f] border rounded-md px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all ${
                  error ? 'border-red-500/60' : 'border-zinc-800'
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
              className="flex items-center justify-center gap-2 px-8 py-3 sm:py-0 bg-[#b77bff] hover:bg-purple-400 disabled:opacity-50 text-white font-bold text-sm rounded-md transition-colors shadow-[0_0_15px_rgba(168,85,247,0.3)] self-start">
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              TRACK
            </button>
          </div>


        </div>

        {!isTracking || !trackingData ? (
          userRole === "Pelanggan" ? (
            /* My Shipments Section for Customers */
            <div className="space-y-4 animate-in fade-in duration-500">
              <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
                <Package className="w-5 h-5 text-purple-400" />
                Track Your Shipment
              </h3>
              <div className="p-8 bg-[#111114] border border-zinc-800/50 rounded-xl flex flex-col items-center justify-center text-center shadow-lg">
                <div className="p-4 bg-purple-500/10 rounded-full mb-4">
                  <Package className="w-10 h-10 text-purple-400" />
                </div>
                <h4 className="text-base font-bold mb-2 text-white">Masukkan Nomor Tracking Anda</h4>
                <p className="text-sm text-zinc-500 max-w-md mb-3">
                  Masukkan nomor tracking yang Anda terima dari OceanLink di kolom pencarian di atas.
                </p>
                <p className="text-xs text-zinc-600 font-mono">Format: TRK-XXXXXX-XXXX</p>
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

              {/* Origin Marker */}
              <div className="absolute top-[40%] left-[25%] flex flex-col items-center -translate-x-1/2 -translate-y-1/2">
                <MapPin className="w-5 h-5 text-zinc-500 mb-1" />
                <span className="text-[9px] font-bold bg-black/60 border border-zinc-800 px-2 py-0.5 rounded text-zinc-400 tracking-widest uppercase">{trackingData.originPort?.name || 'ORIGIN'}</span>
              </div>

              {/* Destination Marker */}
              <div className="absolute top-[56%] left-[70%] flex flex-col items-center -translate-x-1/2 -translate-y-1/2">
                <MapPin className="w-6 h-6 text-purple-400 mb-1 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                <span className="text-[9px] font-bold bg-purple-500/10 border border-purple-500/30 px-2 py-0.5 rounded text-purple-300 tracking-widest uppercase shadow-[0_0_10px_rgba(168,85,247,0.2)]">{trackingData.destinationPort?.name || 'DESTINATION'}</span>
              </div>
              
              {/* Moving Ship Pin / Radar */}
              <div className="absolute flex flex-col items-center -translate-x-1/2 -translate-y-1/2 z-10 group cursor-pointer transition-all duration-1000" style={shipPos}>
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
                    {trackingData.status || 'IN TRANSIT'}
                  </div>
                  <div className="text-zinc-400 font-sans mt-0.5 font-normal tracking-normal">Lat: {trackingData.deliveryDetail?.currentLat || 0}° N, Lng: {trackingData.deliveryDetail?.currentLng || 0}° E</div>
                </div>
              </div>

              {/* Map UI Overlays */}
              <div className="absolute top-4 left-4 flex gap-2">
                 <div className="px-3 py-1 bg-black/60 backdrop-blur-md rounded border border-white/10 text-[10px] tracking-widest text-zinc-300 shadow-lg">LIVE CARGO SATELLITE (DB)</div>
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
                    <p className="font-bold text-white text-base bg-zinc-900/50 py-1.5 px-3 rounded border border-white/5">{trackingData.trackingNumber}</p>
                  </div>
                  <div>
                    <p className="text-zinc-500 text-[10px] uppercase tracking-wider mb-1">Vessel Assigned</p>
                    <p className="font-bold text-purple-400 flex items-center gap-2"><Ship className="w-3 h-3" /> {trackingData.vessel?.name || 'Unassigned'}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-zinc-500 text-[10px] uppercase tracking-wider mb-1">Status</p>
                      <p className="font-bold text-green-400 text-xs">{trackingData.status}</p>
                    </div>
                    <div>
                      <p className="text-zinc-500 text-[10px] uppercase tracking-wider mb-1">Est. Arrival</p>
                      <p className="font-bold text-white text-xs">{new Date(trackingData.estArrival).toLocaleDateString("id-ID", { timeZone: "Asia/Jakarta", dateStyle: "long" })}</p>
                    </div>
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
                        <h5 className="font-bold text-sm text-green-400">Transaction Created</h5>
                        <span className="text-[10px] text-zinc-600 font-mono">{new Date(trackingData.createdAt).toLocaleString("id-ID", { timeZone: "Asia/Jakarta", dateStyle: "medium", timeStyle: "short" })} WIB</span>
                      </div>
                      <p className="text-xs text-zinc-500">Transaction details recorded in OceanLink database.</p>
                    </div>
                  </div>

                  {/* Step 2: Active */}
                  <div className="relative pl-8 group">
                     <div className="absolute -left-[11px] top-1 p-1 bg-green-500 rounded-full shadow-[0_0_15px_rgba(34,197,94,0.6)] animate-pulse">
                      <Ship className="w-3.5 h-3.5 text-black" />
                    </div>
                    <div className="bg-[#161a18] p-4 rounded-lg border border-green-500/30">
                      <div className="flex justify-between items-start mb-1">
                        <h5 className="font-bold text-sm text-green-400">Current Status</h5>
                        <span className="text-[10px] text-green-500/70 font-mono">Live</span>
                      </div>
                      <p className="text-[10px] text-green-400/80 mb-2 tracking-wide font-bold">Status: {trackingData.status}</p>
                      <p className="text-xs text-zinc-300">{trackingData.deliveryDetail?.notes || "In transit to destination."}</p>
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
