"use client";

import { Package, ArrowLeft, PlusCircle, CheckCircle2, Ship, Box, User, MapPin } from "lucide-react";
import Link from "next/link";
import { addShipment, getAvailableVesselsForShipment, getCustomers } from "../actions";
import { getRoutes } from "@/app/(dashboard)/routes/actions";
import { getPorts } from "@/app/(dashboard)/ports/actions";
import { useEffect, useRef, useState } from "react";

type ShipErrors = {
  senderName?: string;
  receiverName?: string;
  phone?: string;
  cargoType?: string;
  weight?: string;
  vesselId?: string;
  routeId?: string;
  estArrival?: string;
  cargoName?: string;
  general?: string;
};

export default function AddShipmentPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [vessels, setVessels] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [routes, setRoutes] = useState<any[]>([]);
  const [ports, setPorts] = useState<any[]>([]);
  
  const [errors, setErrors] = useState<ShipErrors>({});

  const [routeId, setRouteId] = useState("");
  const [weight, setWeight] = useState("");
  const [shippingType, setShippingType] = useState("Standard");
  const [price, setPrice] = useState("");

  const [estArrival, setEstArrival] = useState("");
  const [isRouteLocked, setIsRouteLocked] = useState(false);
  const [cargoType, setCargoType] = useState("");

  useEffect(() => {
    getAvailableVesselsForShipment().then(setVessels).catch(console.error);
    getCustomers().then(setCustomers).catch(console.error);
    getRoutes(1, 100).then(data => setRoutes(data.routes)).catch(console.error);
    getPorts("", 1, 100).then(data => setPorts(data.ports)).catch(console.error);
  }, []);

  useEffect(() => {
    if (routeId && weight) {
      const weightNum = parseFloat(weight);
      if (isNaN(weightNum) || weightNum <= 0) { setPrice(""); return; }
      
      const route = routes.find(r => r.id === routeId);
      if (!route) { setPrice(""); return; }
      
      const baseRatePerKg = route.baseRatePerKg || 150000; 

      let multiplier = 1.0;
      if (shippingType === "Express") multiplier = 1.5;
      if (shippingType === "VVIP") multiplier = 2.5;

      const baseCost = baseRatePerKg * weightNum * multiplier;
      const totalCost = baseCost + (baseCost * 0.02) + 150000;
      
      setPrice(totalCost.toString());
    } else {
      setPrice("");
    }
  }, [routeId, weight, shippingType, routes]);

  const clearErr = (field: keyof ShipErrors) =>
    setErrors((p) => ({ ...p, [field]: undefined }));

  const handleVesselChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    clearErr("vesselId");
    const vId = e.target.value;
    if (!vId) {
      setIsRouteLocked(false);
      return;
    }
    const vessel = vessels.find(v => v.id === vId);
    if (vessel && vessel.routeId) {
      setRouteId(vessel.routeId);
      
      const matchedRoute = routes.find(r => r.id === vessel.routeId);
      if (matchedRoute) {
        const est = new Date();
        est.setDate(est.getDate() + (matchedRoute.estimatedDays || 0));
        setEstArrival(est.toISOString().split('T')[0]);
      }
      setIsRouteLocked(true);
    } else {
      setIsRouteLocked(false);
    }
  };

  const handleCargoTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    clearErr("cargoType");
    setCargoType(e.target.value);
    // Reset vessel if type changes
    const selectEl = formRef.current?.elements.namedItem("vesselId") as HTMLSelectElement;
    if (selectEl) {
      selectEl.value = "";
      setRouteId("");
      setIsRouteLocked(false);
    }
  };

  // Filter vessels based on compatibility
  const filteredVessels = vessels.filter(v => {
    if (!cargoType) return true; // Show all if no cargo type selected
    if (cargoType === "Liquid") return v.type === "Tanker";
    if (cargoType === "Container") return v.type === "Container Ship";
    if (cargoType === "Heavy") return v.type === "Bulk Carrier" || v.type === "Container Ship";
    if (cargoType === "General") return v.type === "Container Ship" || v.type === "Bulk Carrier";
    return true;
  });

  async function handleSubmit(formData: FormData) {
    const get = (k: string) => formData.get(k)?.toString().trim() ?? "";

    const newErrors: ShipErrors = {};
    if (!get("senderName"))    newErrors.senderName    = "Sender name is required.";
    if (!get("receiverName"))  newErrors.receiverName  = "Receiver name is required.";
    if (!get("phone"))         newErrors.phone         = "Phone number is required.";
    else if (get("phone").replace(/\D/g, "").length > 13) newErrors.phone = "Phone number max 13 digits.";
    else if (!/^[0-9+\-() ]+$/.test(get("phone"))) newErrors.phone = "Invalid phone number format.";
    if (!routeId)              newErrors.routeId       = "Select shipping route.";
    if (!get("estArrival"))    newErrors.estArrival    = "Estimated date is required.";
    if (!get("cargoName"))     newErrors.cargoName     = "Cargo name is required.";
    if (!get("cargoType"))     newErrors.cargoType     = "Cargo type is required.";
    const w = parseFloat(get("weight"));
    if (!get("weight"))        newErrors.weight        = "Cargo weight is required.";
    else if (isNaN(w) || w <= 0) newErrors.weight     = "Berat harus berupa angka positif.";
    if (!get("vesselId"))      newErrors.vesselId      = "Select a vessel first.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setIsSuccess(false);
    setErrors({});

    // Append calculated price
    formData.set("price", price);
    
    // Auto-fill origin and destination based on route
    const selectedRoute = routes.find(r => r.id === routeId);
    if (selectedRoute) {
      formData.set("originCity", selectedRoute.originCity);
      formData.set("destinationCity", selectedRoute.destinationCity);
    }

    try {
      await addShipment(formData);
      setIsSuccess(true);
      formRef.current?.reset();
      setRouteId("");
      setWeight("");
      setShippingType("Standard");
      setPrice("");
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error: any) {
      if (error.message === "NEXT_REDIRECT") throw error;
      setErrors({ general: error.message || "An error occurred. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  }

  // Reusable helpers
  const inputClass = (field: keyof ShipErrors) =>
    `w-full bg-[#14151a] border rounded-lg px-4 py-3 text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none transition-colors ${
      errors[field] ? "border-red-500/60 focus:border-red-500" : "border-white/5 focus:border-purple-500/50"
    }`;

  const selectClass = (field: keyof ShipErrors) =>
    `w-full bg-[#14151a] border rounded-lg px-4 py-3 text-sm text-gray-200 focus:outline-none transition-colors appearance-none ${
      errors[field] ? "border-red-500/60 focus:border-red-500" : "border-white/5 focus:border-purple-500/50"
    }`;

  const FieldError = ({ field }: { field: keyof ShipErrors }) =>
    errors[field] ? (
      <p className="text-red-400 text-[11px] font-mono mt-1 flex items-center gap-1">
        <span className="text-red-500">✕</span> {errors[field]}
      </p>
    ) : null;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-center gap-4 border-b border-white/5 pb-4">
        <Link href="/shipments" className="p-2 bg-[#17181f] text-gray-400 hover:text-white rounded-lg transition-colors border border-transparent hover:border-white/10">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-wider mb-1">ADD NEW SHIPMENT</h1>
          <p className="text-gray-500 font-mono text-sm">Register a new cargo package, vessel, and sender details</p>
        </div>
      </div>

      {/* Form Container */}
      <div className="bg-[#111115] border border-white/5 rounded-xl p-6 sm:p-8">

        {isSuccess && (
          <div className="mb-6 flex items-center gap-2 p-4 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg text-sm font-bold font-mono tracking-wide">
            <CheckCircle2 size={18} className="shrink-0" />
            <p>Data added successfully!</p>
          </div>
        )}

        {errors.general && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs font-mono">
            {errors.general}
          </div>
        )}

        <form ref={formRef} action={handleSubmit} className="space-y-8" noValidate>

          {/* Tracking Number Note */}
          <div className="bg-[#17181f] p-4 rounded-lg border border-purple-500/20 flex gap-3 items-start">
            <Package className="text-purple-400 mt-0.5" size={18} />
            <div>
              <p className="text-sm font-bold text-gray-200">Automatic Tracking Number (Shipment ID)</p>
              <p className="text-xs text-gray-500 font-mono mt-1">A unique TRK-XXXXXX number will be generated automatically upon submission.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* 1. DATA CUSTOMER */}
            <div className="space-y-5">
              <div className="flex items-center gap-2 text-purple-400 border-b border-white/10 pb-2">
                <User size={18} />
                <h3 className="font-bold tracking-widest text-sm">DATA CUSTOMER</h3>
              </div>

              {/* Pelanggan (opsional) */}
              <div className="space-y-1.5">
                <label htmlFor="customerId" className="text-xs font-bold text-gray-400 tracking-wider">SELECT CUSTOMER</label>
                <select id="customerId" name="customerId" className={selectClass("customerId" as any)}>
                  <option value="">-- Select Customer (Optional) --</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>{c.name} (@{c.username})</option>
                  ))}
                </select>
                {customers.length === 0 && (
                  <p className="text-[10px] text-yellow-500 italic">No customer registered yet. Will automatically assign to the first customer.</p>
                )}
              </div>

              {/* Sender Name */}
              <div className="space-y-1.5">
                <label htmlFor="senderName" className="text-xs font-bold text-gray-400 tracking-wider">
                  SENDER NAME <span className="text-red-500">*</span>
                </label>
                <input
                  id="senderName" name="senderName" type="text"
                  placeholder="Sender Name"
                  onChange={() => clearErr("senderName")}
                  className={inputClass("senderName")}
                />
                <FieldError field="senderName" />
              </div>

              {/* Receiver Name */}
              <div className="space-y-1.5">
                <label htmlFor="receiverName" className="text-xs font-bold text-gray-400 tracking-wider">
                  RECEIVER NAME <span className="text-red-500">*</span>
                </label>
                <input
                  id="receiverName" name="receiverName" type="text"
                  placeholder="Receiver Name"
                  onChange={() => clearErr("receiverName")}
                  className={inputClass("receiverName")}
                />
                <FieldError field="receiverName" />
              </div>

              {/* No Telepon */}
              <div className="space-y-1.5">
                <label htmlFor="phone" className="text-xs font-bold text-gray-400 tracking-wider">
                  PHONE NUMBER <span className="text-red-500">*</span>
                </label>
                <input
                  id="phone" name="phone" type="tel"
                  placeholder="08xxxxxxxxxx"
                  maxLength={15}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9+\-() ]/g, "");
                    e.target.value = val;
                    clearErr("phone");
                  }}
                  className={inputClass("phone")}
                />
                <FieldError field="phone" />
              </div>
            </div>

            {/* 2. SHIPMENT & ROUTE DATA */}
            <div className="space-y-5">
              <div className="flex items-center gap-2 text-purple-400 border-b border-white/10 pb-2">
                <MapPin size={18} />
                <h3 className="font-bold tracking-widest text-sm">SHIPMENT DATA</h3>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {/* Rute */}
                <div className="space-y-1.5">
                  <label htmlFor="routeId" className="text-xs font-bold text-gray-400 tracking-wider">
                    SHIPPING ROUTE <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="routeId" name="routeId"
                    value={routeId}
                    onChange={(e) => { setRouteId(e.target.value); clearErr("routeId"); }}
                    className={`${selectClass("routeId")} ${isRouteLocked ? "pointer-events-none opacity-50 bg-[#17181f]" : ""}`}
                  >
                    <option value="">-- Select Route --</option>
                    {routes.map(r => <option key={r.id} value={r.id}>{r.originCity} → {r.destinationCity} (Est: {r.estimatedDays} days)</option>)}
                  </select>
                  <FieldError field="routeId" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Jenis Pengiriman */}
                <div className="space-y-1.5">
                  <label htmlFor="shippingType" className="text-xs font-bold text-gray-400 tracking-wider">SHIPPING TYPE</label>
                  <select 
                    id="shippingType" name="shippingType" 
                    value={shippingType}
                    onChange={(e) => setShippingType(e.target.value)}
                    className={selectClass("shippingType" as any)}
                  >
                    <option value="Standard">Standard (1x)</option>
                    <option value="Express">Express (1.5x)</option>
                    <option value="VVIP">VVIP (2.5x)</option>
                  </select>
                </div>

                {/* Harga (auto) */}
                <div className="space-y-1.5">
                  <label htmlFor="priceDisplay" className="text-xs font-bold text-gray-400 tracking-wider">PRICE (TARIFF)</label>
                  <input
                    id="priceDisplay" type="text"
                    readOnly value={price ? `Rp ${parseFloat(price).toLocaleString('id-ID')}` : ""} placeholder="Rp 0"
                    className="w-full bg-[#14151a] border border-white/5 rounded-lg px-4 py-3 text-sm text-purple-400 font-bold placeholder:text-gray-600 focus:outline-none cursor-not-allowed"
                  />
                  <p className="text-[10px] text-gray-500 font-mono">* Auto-calculated based on price calculator</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Status */}
                <div className="space-y-1.5">
                  <label htmlFor="status" className="text-xs font-bold text-gray-400 tracking-wider">SHIPMENT STATUS</label>
                  <select id="status" name="status" className={selectClass("status" as any)}>
                    <option value="Processing">Diproses</option>
                    <option value="PORT CLEARANCE">Port Clearance</option>
                    <option value="In Transit">Dalam Pengiriman</option>
                    <option value="Arrived">Sampai Tujuan</option>
                    <option value="Delivered">Selesai</option>
                  </select>
                </div>

                {/* Tanggal Estimasi */}
                <div className="space-y-1.5">
                  <label htmlFor="estArrival" className="text-xs font-bold text-gray-400 tracking-wider">
                    ESTIMATED / DELIVERY DATE <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="estArrival" name="estArrival" type="date"
                    value={estArrival}
                    onChange={(e) => { setEstArrival(e.target.value); clearErr("estArrival"); }}
                    className={`${inputClass("estArrival")} ${isRouteLocked ? "pointer-events-none opacity-50 bg-[#17181f]" : ""}`}
                    readOnly={isRouteLocked}
                  />
                  <FieldError field="estArrival" />
                </div>
              </div>
            </div>

            {/* 3. CARGO & FLEET DATA */}
            <div className="space-y-5 lg:col-span-2">
              <div className="flex items-center gap-2 text-purple-400 border-b border-white/10 pb-2">
                <Box size={18} />
                <h3 className="font-bold tracking-widest text-sm">CARGO & FLEET DATA</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Nama Barang */}
                <div className="space-y-1.5">
                  <label htmlFor="cargoName" className="text-xs font-bold text-gray-400 tracking-wider">CARGO NAME <span className="text-red-500">*</span></label>
                  <input
                    id="cargoName" name="cargoName" type="text"
                    placeholder="e.g., Textiles"
                    onChange={() => clearErr("cargoName")}
                    className={inputClass("cargoName")}
                  />
                  <FieldError field="cargoName" />
                </div>

                {/* Jenis Barang */}
                <div className="space-y-1.5">
                  <label htmlFor="cargoType" className="text-xs font-bold text-gray-400 tracking-wider">CARGO TYPE <span className="text-red-500">*</span></label>
                  <select id="cargoType" name="cargoType" value={cargoType} onChange={handleCargoTypeChange} className={selectClass("cargoType")}>
                    <option value="">-- Select Type --</option>
                    <option value="General">General Cargo</option>
                    <option value="Liquid">Liquid Cargo</option>
                    <option value="Container">Container</option>
                    <option value="Heavy">Heavy Machinery</option>
                  </select>
                  <FieldError field="cargoType" />
                </div>

                {/* Berat Barang */}
                <div className="space-y-1.5">
                  <label htmlFor="weight" className="text-xs font-bold text-gray-400 tracking-wider">WEIGHT (KG) <span className="text-red-500">*</span></label>
                  <input
                    id="weight" name="weight" type="number" step="0.1"
                    placeholder="0.0"
                    value={weight}
                    onChange={(e) => { setWeight(e.target.value); clearErr("weight"); }}
                    className={inputClass("weight")}
                  />
                  <FieldError field="weight" />
                </div>

                {/* Kapal Pengangkut */}
                <div className="space-y-1.5">
                  <label htmlFor="vesselId" className="text-xs font-bold text-gray-400 tracking-wider">ASSIGNED VESSEL <span className="text-red-500">*</span></label>
                  <select id="vesselId" name="vesselId" onChange={handleVesselChange} className={selectClass("vesselId")}>
                    <option value="">-- Select Fleet Vessel --</option>
                    {filteredVessels.map(v => {
                      const currentLoad = v.transactions?.reduce((sum: number, tx: any) => sum + (tx.weight || 0), 0) || 0;
                      const isFull = v.status === "MAINTENANCE" || currentLoad >= v.capacity;
                      return (
                        <option key={v.id} value={v.id} disabled={isFull}>
                          {v.name} {isFull ? "(FULL)" : currentLoad > 0 ? `(${currentLoad}/${v.capacity}kg - Loaded)` : `(Empty, Capacity: ${v.capacity}kg)`}
                        </option>
                      )
                    })}
                  </select>
                  <FieldError field="vesselId" />
                </div>
              </div>

              {/* Deskripsi Barang */}
              <div className="space-y-1.5 pt-2">
                <label htmlFor="cargoDescription" className="text-xs font-bold text-gray-400 tracking-wider">CARGO DESCRIPTION / NOTES</label>
                <textarea
                  id="cargoDescription" name="cargoDescription" rows={3}
                  placeholder="Additional notes..."
                  className="w-full bg-[#14151a] border border-white/5 rounded-lg px-4 py-3 text-sm text-gray-200 focus:outline-none focus:border-purple-500/50 transition-colors"
                ></textarea>
              </div>
            </div>

          </div>

          <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-end gap-3">
            <Link href="/shipments" className="w-full sm:w-auto px-6 py-3 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 text-sm font-bold tracking-widest transition-colors text-center">
              BATAL
            </Link>
            <button
              type="submit" disabled={isSubmitting}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-400 hover:to-blue-400 text-white text-sm font-bold tracking-widest transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] disabled:opacity-50"
            >
              <PlusCircle size={18} />
              {isSubmitting ? "SAVING..." : "SAVE SHIPMENT"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
