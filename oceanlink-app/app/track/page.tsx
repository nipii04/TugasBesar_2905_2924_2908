"use client";

import React, { useState, useEffect } from 'react';
import { Waves, Search, Package, Home, Calculator, UserPlus, LogIn, Ship, MapPin, CheckCircle2, FileText, AlertCircle, Loader2, LogOut } from 'lucide-react';
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

  const [userName, setUserName] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("userName") || "User";
    }
    return "User";
  });
  
  const [myShipments, setMyShipments] = useState<any[]>([]);
  const [isLoadingShipments, setIsLoadingShipments] = useState(false);

  useEffect(() => {
    if (userRole === "Customer") {
      const userName = sessionStorage.getItem("userName");
      if (userName) {
        setIsLoadingShipments(true);
        fetch(`/api/tracking/my-shipments?username=${userName}`)
          .then(res => res.json())
          .then(data => {
            if (data.data) setMyShipments(data.data);
          })
          .catch(err => console.error(err))
          .finally(() => setIsLoadingShipments(false));
      }
    }
  }, [userRole]);

  const handleTrack = async () => {
    if (!trackingNumber.trim()) {
      setError("Incomplete form: Please enter tracking number");
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

  const getMapPosition = (lat: number, lng: number) => {
    const y = ((90 - lat) / 180) * 100;
    const x = ((180 + lng) / 360) * 100;
    return { top: `${Math.max(10, Math.min(90, y))}%`, left: `${Math.max(10, Math.min(90, x))}%` };
  };

  const getStatusTheme = (status: string) => {
    switch(status?.toLowerCase()) {
      case 'delivered':
      case 'arrived':
        return {
          badge: 'bg-green-500/10 text-green-400 border-green-500/20',
          text: 'text-green-400',
          bg: 'bg-green-500',
          border: 'border-green-500/30',
          shadow: 'shadow-[0_0_20px_rgba(34,197,94,0.8)]',
          pulse: 'shadow-[0_0_15px_rgba(34,197,94,0.6)]',
          bgSoft: 'bg-[#161a18]'
        };
      case 'processing':
      case 'port clearance':
        return {
          badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
          text: 'text-blue-400',
          bg: 'bg-blue-500',
          border: 'border-blue-500/30',
          shadow: 'shadow-[0_0_20px_rgba(59,130,246,0.8)]',
          pulse: 'shadow-[0_0_15px_rgba(59,130,246,0.6)]',
          bgSoft: 'bg-[#16181a]'
        };
      case 'on departure':
      case 'in transit':
      case 'on schedule':
        return {
          badge: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
          text: 'text-yellow-400',
          bg: 'bg-yellow-500',
          border: 'border-yellow-500/30',
          shadow: 'shadow-[0_0_20px_rgba(234,179,8,0.8)]',
          pulse: 'shadow-[0_0_15px_rgba(234,179,8,0.6)]',
          bgSoft: 'bg-[#1a1916]'
        };
      case 'delayed':
      case 'issue':
        return {
          badge: 'bg-red-500/10 text-red-400 border-red-500/20',
          text: 'text-red-400',
          bg: 'bg-red-500',
          border: 'border-red-500/30',
          shadow: 'shadow-[0_0_20px_rgba(239,68,68,0.8)]',
          pulse: 'shadow-[0_0_15px_rgba(239,68,68,0.6)]',
          bgSoft: 'bg-[#1a1616]'
        };
      default:
        return {
          badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
          text: 'text-purple-400',
          bg: 'bg-purple-500',
          border: 'border-purple-500/30',
          shadow: 'shadow-[0_0_20px_rgba(168,85,247,0.8)]',
          pulse: 'shadow-[0_0_15px_rgba(168,85,247,0.6)]',
          bgSoft: 'bg-[#18161a]'
        };
    }
  };

  let shipPos = { top: '46%', left: '45%' };
  if (trackingData) {
    const status = trackingData.status?.toLowerCase();
    if (status === 'delivered' || status === 'arrived') {
      shipPos = { top: '56%', left: '70%' }; // Destination marker position
    } else if (status === 'processing' || status === 'delayed' || status === 'port clearance') {
      shipPos = { top: '40%', left: '25%' }; // Origin marker position
    } else if (trackingData.deliveryDetail?.currentLat) {
      shipPos = getMapPosition(trackingData.deliveryDetail.currentLat, trackingData.deliveryDetail.currentLng);
    } else {
      shipPos = { top: '48%', left: '47.5%' }; // Middle of the route
    }
  }

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
                 <div className="hidden sm:block text-right">
                   <p className="text-sm font-bold text-white">{userName}</p>
                   <p className="text-[10px] text-zinc-500 uppercase tracking-widest">{userRole}</p>
                 </div>
                 <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-purple-500/20 border border-purple-500/50 flex items-center justify-center text-purple-400 font-bold shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                   {userName.charAt(0).toUpperCase()}
                 </div>
                 <button 
                   onClick={() => { sessionStorage.removeItem('userRole'); sessionStorage.removeItem('userName'); setUserRole(''); window.location.reload(); }}
                   className="p-2 hover:bg-red-500/10 text-zinc-500 hover:text-red-400 rounded-lg transition-colors border border-transparent hover:border-red-500/30"
                   title="Logout"
                 >
                   <LogOut size={18} />
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
              id="track-btn"
              onClick={handleTrack}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 px-8 py-3 sm:py-0 bg-[#b77bff] hover:bg-purple-400 disabled:opacity-50 text-white font-bold text-sm rounded-md transition-colors shadow-[0_0_15px_rgba(168,85,247,0.3)] self-start h-full min-h-[46px]">
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              TRACK
            </button>
          </div>


        </div>

        {!isTracking || !trackingData ? (
          userRole === "Customer" ? (
            /* My Shipments Section for Customers */
            <div className="space-y-4 animate-in fade-in duration-500">
              <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
                <Package className="w-5 h-5 text-purple-400" />
                Your Shipment History
              </h3>
              
              {isLoadingShipments ? (
                <div className="p-8 bg-[#111114] border border-zinc-800/50 rounded-xl flex items-center justify-center text-center shadow-lg">
                  <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
                </div>
              ) : myShipments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {myShipments.map((shipment) => (
                    <button
                      key={shipment.id}
                      onClick={() => {
                        setTrackingNumber(shipment.trackingNumber);
                        // Using setTimeout to allow state to update before fetch
                        setTimeout(() => document.getElementById("track-btn")?.click(), 100);
                      }}
                      className="text-left p-5 bg-[#111114] border border-zinc-800/50 hover:border-purple-500/50 rounded-xl shadow-lg transition-all group relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="flex justify-between items-start mb-3 relative z-10">
                        <div>
                          <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-1">Tracking No</p>
                          <p className="font-bold text-white tracking-wider">{shipment.trackingNumber}</p>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider border ${getStatusTheme(shipment.status).badge}`}>
                          {shipment.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-zinc-400 font-bold relative z-10 mb-4">
                        <span className="truncate max-w-[100px]">{shipment.originCity}</span>
                        <div className="flex-1 border-t border-dashed border-zinc-700 relative mx-1">
                           <Ship className="w-4 h-4 text-purple-500/50 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#111114] px-0.5" />
                        </div>
                        <span className="truncate max-w-[100px] text-right">{shipment.destinationCity}</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 relative z-10 border-t border-zinc-800/50 pt-3">
                        <div>
                          <p className="text-[9px] text-zinc-500 uppercase tracking-widest mb-0.5">EST. ARRIVAL</p>
                          <p className="text-xs text-white font-semibold">
                            {new Date(shipment.estArrival).toLocaleDateString("id-ID", { month: "short", day: "numeric", year: "numeric" })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] text-zinc-500 uppercase tracking-widest mb-0.5">TYPE</p>
                          <p className="text-xs text-zinc-300 font-semibold">{shipment.shippingType}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-8 bg-[#111114] border border-zinc-800/50 rounded-xl flex flex-col items-center justify-center text-center shadow-lg">
                  <div className="p-4 bg-purple-500/10 rounded-full mb-4">
                    <Package className="w-10 h-10 text-purple-400" />
                  </div>
                  <h4 className="text-base font-bold mb-2 text-white">No Shipments Yet</h4>
                  <p className="text-sm text-zinc-500 max-w-md mb-3">
                    You have no shipment history. If you have a tracking number from an offline transaction, please track it in the search bar.
                  </p>
                </div>
              )}
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
            
            {/* Back Button for Pelanggan */}
            {userRole === "Customer" && (
              <button 
                onClick={() => {
                  setIsTracking(false);
                  setTrackingNumber('');
                  setTrackingData(null);
                }}
                className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
              >
                ← Back to History
              </button>
            )}

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
                  <div className={`absolute inset-0 rounded-full ${getStatusTheme(trackingData.status).bg} animate-ping opacity-60 w-8 h-8 -left-1.5 -top-1.5`}></div>
                  <div className={`p-1.5 ${getStatusTheme(trackingData.status).bg} text-black rounded-full relative ${getStatusTheme(trackingData.status).shadow}`}>
                    <Ship className="w-4 h-4" />
                  </div>
                </div>
                
                {/* Tooltip that pops on hover */}
                <div className={`mt-3 text-[9px] bg-black/90 border ${getStatusTheme(trackingData.status).border} ${getStatusTheme(trackingData.status).text} px-3 py-1.5 rounded-lg font-bold tracking-widest backdrop-blur-md shadow-lg shadow-black/50`}>
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 ${getStatusTheme(trackingData.status).bg} rounded-full animate-pulse`}></div>
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
                      <p className={`font-bold ${getStatusTheme(trackingData.status).text} text-xs`}>{trackingData.status}</p>
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
                  
                  {trackingData.shipmentLogs && trackingData.shipmentLogs.length > 0 ? (
                    trackingData.shipmentLogs.map((log: any, index: number) => {
                      const isLast = index === trackingData.shipmentLogs.length - 1;
                      const theme = getStatusTheme(log.newStatus || "Unknown");
                      
                      return (
                        <div key={log.id} className="relative pl-8 group">
                          {isLast ? (
                            <div className={`absolute -left-[11px] top-1 p-1 ${theme.bg} rounded-full ${theme.pulse} animate-pulse`}>
                              <Ship className="w-3.5 h-3.5 text-black" />
                            </div>
                          ) : (
                            <div className={`absolute -left-[9px] top-1 p-0.5 ${theme.bg} rounded-full opacity-60 shadow-[0_0_8px_rgba(255,255,255,0.1)]`}>
                              <CheckCircle2 className="w-3 h-3 text-black" />
                            </div>
                          )}
                          
                          <div className={`${isLast ? theme.bgSoft : 'bg-[#1a1a1f]'} p-4 rounded-lg border ${isLast ? theme.border : 'border-white/5 group-hover:border-white/10'}`}>
                            <div className="flex justify-between items-start mb-1">
                              <h5 className={`font-bold text-sm ${isLast ? theme.text : 'text-zinc-400'}`}>{log.newStatus || "Transaction Created"}</h5>
                              <span className={`text-[10px] ${isLast ? theme.text + ' opacity-70' : 'text-zinc-600'} font-mono`}>
                                {new Date(log.createdAt).toLocaleString("id-ID", { timeZone: "Asia/Jakarta", dateStyle: "medium", timeStyle: "short" })} WIB
                              </span>
                            </div>
                            <p className={`text-[10px] ${isLast ? theme.text + ' opacity-80' : 'text-zinc-500'} mb-2 tracking-wide font-bold`}>{log.action.replace(/_/g, ' ')}</p>
                            <p className={`text-xs ${isLast ? 'text-zinc-300' : 'text-zinc-500'}`}>{log.description}</p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    /* Fallback if no logs exist (legacy) */
                    <>
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
                         <div className={`absolute -left-[11px] top-1 p-1 ${getStatusTheme(trackingData.status).bg} rounded-full ${getStatusTheme(trackingData.status).pulse} animate-pulse`}>
                          <Ship className="w-3.5 h-3.5 text-black" />
                        </div>
                        <div className={`${getStatusTheme(trackingData.status).bgSoft} p-4 rounded-lg border ${getStatusTheme(trackingData.status).border}`}>
                          <div className="flex justify-between items-start mb-1">
                            <h5 className={`font-bold text-sm ${getStatusTheme(trackingData.status).text}`}>Current Status</h5>
                            <span className={`text-[10px] ${getStatusTheme(trackingData.status).text} opacity-70 font-mono`}>Live</span>
                          </div>
                          <p className={`text-[10px] ${getStatusTheme(trackingData.status).text} opacity-80 mb-2 tracking-wide font-bold`}>Status: {trackingData.status}</p>
                          <p className="text-xs text-zinc-300">{trackingData.deliveryDetail?.notes || "In transit to destination."}</p>
                        </div>
                      </div>
                    </>
                  )}

                </div>
              </div>

            </div>
          </div>
        )}
      </main>
    </div>
  );
}
