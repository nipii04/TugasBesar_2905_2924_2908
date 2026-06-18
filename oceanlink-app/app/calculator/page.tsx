"use client";

import React, { useState, useEffect } from 'react';
import { Waves, Home, Package, Calculator, UserPlus, LogIn, MapPin, Info, DollarSign, FileText, LogOut } from 'lucide-react';
import Link from 'next/link';
import { getRoutes } from "@/app/(dashboard)/routes/actions";
import { getPorts } from "@/app/(dashboard)/ports/actions";

export default function CalculatorPage() {
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

  const [routeId, setRouteId] = useState("");
  const [weight, setWeight] = useState("");
  const [shippingType, setShippingType] = useState("Standard");
  const [result, setResult] = useState<number | null>(null);

  const [routes, setRoutes] = useState<any[]>([]);
  const [ports, setPorts] = useState<any[]>([]);

  useEffect(() => {
    getRoutes(1, 100).then(data => setRoutes(data.routes)).catch(console.error);
    getPorts("", 1, 100).then(data => setPorts(data.ports)).catch(console.error);
  }, []);

  type CalcErrors = { routeId?: string; weight?: string };
  const [errors, setErrors] = useState<CalcErrors>({});

  const handleCalculate = () => {
    const newErrors: CalcErrors = {};

    if (!routeId) newErrors.routeId = "Route is required.";

    const weightNum = parseFloat(weight);
    if (!weight) newErrors.weight = "Package weight is required.";
    else if (isNaN(weightNum) || weightNum <= 0) newErrors.weight = "Weight must be a positive number.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setResult(null);
      return;
    }

    setErrors({});

    const route = routes.find(r => r.id === routeId);
    const baseRatePerKg = route?.baseRatePerKg || 150000;

    let multiplier = 1.0;
    if (shippingType === "Express") multiplier = 1.5;
    if (shippingType === "VVIP") multiplier = 2.5;

    const baseCost = baseRatePerKg * weightNum * multiplier;
    const totalCost = baseCost + (baseCost * 0.02) + 150000;
    
    setResult(totalCost);
  };

  const FieldError = ({ field }: { field: keyof CalcErrors }) =>
    errors[field] ? (
      <p className="text-red-400 text-[11px] font-mono mt-1 flex items-center gap-1">
        <span className="text-red-500">✕</span> {errors[field]}
      </p>
    ) : null;

  const selectClass = (field: keyof CalcErrors) =>
    `w-full bg-[#1a1a1f] border rounded-md px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50 appearance-none transition-colors ${
      errors[field] ? "border-red-500/60" : "border-zinc-800"
    }`;

  const inputClass = (field: keyof CalcErrors) =>
    `w-full bg-[#1a1a1f] border rounded-md px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-colors ${
      errors[field] ? "border-red-500/60" : "border-zinc-800"
    }`;

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

            <div className="space-y-5">
              {/* Route */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-xs font-semibold text-zinc-400">
                  <MapPin className="w-3 h-3" /> ROUTE
                </label>
                <select
                  value={routeId}
                  onChange={(e) => { setRouteId(e.target.value); setErrors(p => ({ ...p, routeId: undefined })); }}
                  className={selectClass("routeId")}
                >
                  <option value="">Select a route</option>
                  {routes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.originCity} → {r.destinationCity}
                    </option>
                  ))}
                </select>
                <FieldError field="routeId" />
              </div>

              {/* Shipping Type */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-xs font-semibold text-zinc-400">
                  <Package className="w-3 h-3" /> SHIPPING TYPE
                </label>
                <select
                  value={shippingType}
                  onChange={(e) => setShippingType(e.target.value)}
                  className="w-full bg-[#1a1a1f] border border-zinc-800 rounded-md px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50 appearance-none transition-colors"
                >
                  <option value="Standard">Standard (1x)</option>
                  <option value="Express">Express (1.5x)</option>
                  <option value="VVIP">VVIP (2.5x)</option>
                </select>
              </div>

              {/* Weight */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-xs font-semibold text-zinc-400">
                  <Package className="w-3 h-3" /> PACKAGE WEIGHT (KG)
                </label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => { setWeight(e.target.value); setErrors(p => ({ ...p, weight: undefined })); }}
                  placeholder="Enter weight in kilograms"
                  className={inputClass("weight")}
                />
                <FieldError field="weight" />
              </div>

              <button
                onClick={handleCalculate}
                className="w-full py-3 bg-[#b77bff] hover:bg-purple-400 text-white font-bold text-sm rounded-md transition-colors flex justify-center items-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.3)]"
              >
                <Calculator className="w-4 h-4" />
                CALCULATE PRICE
              </button>

              <div className="p-4 bg-purple-500/5 border border-purple-500/10 rounded-md flex gap-3 text-xs text-zinc-400 leading-relaxed">
                <Info className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <p className="mb-1 text-zinc-300">Cost includes:</p>
                  <ul className="space-y-1">
                    <li>Calculation based on fleet route & shipping service type</li>
                    <li>Insurance fee of 2% from total base rate</li>
                    <li>Administration handling fee of Rp 150.000</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Result Card */}
          <div className="p-8 bg-[#111114] border border-zinc-800/50 rounded-xl flex flex-col items-center justify-center text-center min-h-[400px]">
            <DollarSign className="w-16 h-16 text-zinc-700 mb-4" />
            {result !== null ? (
              <>
                <h3 className="text-xl font-bold mb-2 text-purple-400">Estimated Total Cost</h3>
                <p className="text-4xl font-bold text-white mb-2">Rp {result.toLocaleString('id-ID')}</p>
                <p className="text-sm text-zinc-500 max-w-xs mt-4">Includes 2% insurance and Rp 150.000 admin fee</p>
              </>
            ) : (
              <>
                <h3 className="text-xl font-bold mb-2">Calculate Your Price</h3>
                <p className="text-sm text-zinc-500 max-w-xs">Select a route and enter weight to see estimated shipping cost</p>
              </>
            )}
          </div>
        </div>

        {/* Table Section */}
        <div className="p-8 bg-[#111114] border border-zinc-800/50 rounded-xl">
          <div className="flex items-center gap-2 mb-6">
            <MapPin className="w-5 h-5 text-purple-400" />
            <h3 className="font-bold">Available Routes & Base Rates</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-400">
              <thead>
                <tr className="text-[10px] tracking-widest border-b border-zinc-800">
                  <th className="pb-4 font-semibold">ORIGIN</th>
                  <th className="pb-4 font-semibold">DESTINATION</th>
                  <th className="pb-4 font-semibold">BASE RATE PER KG</th>
                  <th className="pb-4 font-semibold">EST. DAYS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {routes.map((row, idx) => (
                  <tr key={idx} className="hover:bg-zinc-900/30 transition-colors">
                    <td className="py-4 font-semibold text-white">{row.originCity}</td>
                    <td className="py-4">{row.destinationCity}</td>
                    <td className="py-4 text-[#b77bff] font-bold">Rp {row.baseRatePerKg.toLocaleString('id-ID')}</td>
                    <td className="py-4">{row.estimatedDays} days</td>
                  </tr>
                ))}
                {routes.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-zinc-500">No routes found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
