"use client";

import { Package, ArrowLeft, PlusCircle, CheckCircle2, Ship, Box, User, MapPin } from "lucide-react";
import Link from "next/link";
import { addShipment, getAllVessels } from "../actions";
import { useEffect, useRef, useState } from "react";

export default function AddShipmentPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [vessels, setVessels] = useState<any[]>([]);

  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [weight, setWeight] = useState("");
  const [price, setPrice] = useState("");

  const rates = [
    { dest: "Singapore", country: "Singapore", rate: "Rp 250.000", time: "2 - 3 days" },
    { dest: "Manila", country: "Philippines", rate: "Rp 350.000", time: "4 - 5 days" },
    { dest: "Bangkok", country: "Thailand", rate: "Rp 320.000", time: "3 - 4 days" },
    { dest: "Ho Chi Minh", country: "Vietnam", rate: "Rp 300.000", time: "3 - 4 days" },
    { dest: "Kuala Lumpur", country: "Malaysia", rate: "Rp 280.000", time: "2 - 3 days" },
    { dest: "Hong Kong", country: "Hong Kong", rate: "Rp 400.000", time: "4 - 5 days" },
    { dest: "Shanghai", country: "China", rate: "Rp 450.000", time: "5 - 6 days" },
    { dest: "Tokyo", country: "Japan", rate: "Rp 550.000", time: "6 - 7 days" },
    { dest: "Sydney", country: "Australia", rate: "Rp 650.000", time: "8 - 9 days" },
    { dest: "Mumbai", country: "India", rate: "Rp 380.000", time: "5 - 6 days" }
  ];

  useEffect(() => {
    getAllVessels().then(data => setVessels(data)).catch(console.error);
  }, []);

  useEffect(() => {
    if (origin && destination && weight) {
      if (origin === destination) {
        setPrice("");
        return;
      }
      const weightNum = parseFloat(weight);
      if (isNaN(weightNum) || weightNum <= 0) {
        setPrice("");
        return;
      }
      const originObj = rates.find(r => r.dest === origin);
      const destObj = rates.find(r => r.dest === destination);
      if (originObj && destObj) {
        const originBaseRate = parseFloat(originObj.rate.replace(/\D/g, ""));
        const destBaseRate = parseFloat(destObj.rate.replace(/\D/g, ""));
        const ratePerKg = ((originBaseRate + destBaseRate) / 2) + 50000;
        const baseCost = ratePerKg * weightNum;
        const totalCost = baseCost + (baseCost * 0.02) + 150000;
        setPrice(totalCost.toString());
      }
    } else {
      setPrice("");
    }
  }, [origin, destination, weight]);

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    setIsSuccess(false);
    try {
      await addShipment(formData);
      setIsSuccess(true);
      formRef.current?.reset();
      setOrigin("");
      setDestination("");
      setWeight("");
      setPrice("");
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error: any) {
      if (error.message === "NEXT_REDIRECT") throw error;
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-white/5 pb-4">
        <Link href="/shipments" className="p-2 bg-[#17181f] text-gray-400 hover:text-white rounded-lg transition-colors border border-transparent hover:border-white/10">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-wider mb-1">ADD NEW CARGO SHIPMENT</h1>
          <p className="text-gray-500 font-mono text-sm">Register a new cargo package, vessel, and sender details</p>
        </div>
      </div>

      {/* Form Container */}
      <div className="bg-[#111115] border border-white/5 rounded-xl p-6 sm:p-8">
        
        {isSuccess && (
          <div className="mb-6 flex items-center gap-2 p-4 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg text-sm font-bold font-mono tracking-wide">
            <CheckCircle2 size={18} className="shrink-0" />
            <p>Data berhasil ditambahkan!</p>
          </div>
        )}

        <form ref={formRef} action={handleSubmit} className="space-y-8">
          
          {/* Tracking Number Note */}
          <div className="bg-[#17181f] p-4 rounded-lg border border-purple-500/20 flex gap-3 items-start">
            <Package className="text-purple-400 mt-0.5" size={18} />
            <div>
              <p className="text-sm font-bold text-gray-200">Automatic Tracking Number (Id Pengiriman)</p>
              <p className="text-xs text-gray-500 font-mono mt-1">A unique TRK-XXXXXX number will be generated automatically upon submission.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* 1. DATA PENGIRIM & PENERIMA */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-purple-400 border-b border-white/10 pb-2">
                <User size={18} />
                <h3 className="font-bold tracking-widest text-sm">DATA CUSTOMER</h3>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="senderName" className="text-xs font-bold text-gray-400 tracking-wider">NAMA PENGIRIM</label>
                <input id="senderName" name="senderName" type="text" required placeholder="Nama Pengirim" className="w-full bg-[#14151a] border border-white/5 focus:border-purple-500/50 rounded-lg px-4 py-3 text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none transition-colors" />
              </div>
              <div className="space-y-2">
                <label htmlFor="receiverName" className="text-xs font-bold text-gray-400 tracking-wider">NAMA PENERIMA</label>
                <input id="receiverName" name="receiverName" type="text" required placeholder="Nama Penerima" className="w-full bg-[#14151a] border border-white/5 focus:border-purple-500/50 rounded-lg px-4 py-3 text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none transition-colors" />
              </div>
              <div className="space-y-2">
                <label htmlFor="phone" className="text-xs font-bold text-gray-400 tracking-wider">NO TELEPON</label>
                <input id="phone" name="phone" type="tel" required placeholder="08xxxxxxxx" className="w-full bg-[#14151a] border border-white/5 focus:border-purple-500/50 rounded-lg px-4 py-3 text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none transition-colors" />
              </div>
            </div>

            {/* 2. DATA PENGIRIMAN & RUTE */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-purple-400 border-b border-white/10 pb-2">
                <MapPin size={18} />
                <h3 className="font-bold tracking-widest text-sm">DATA PENGIRIMAN</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="originCity" className="text-xs font-bold text-gray-400 tracking-wider">KOTA ASAL</label>
                  <select 
                    id="originCity" 
                    name="originCity" 
                    required 
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="w-full bg-[#14151a] border border-white/5 focus:border-purple-500/50 rounded-lg px-4 py-3 text-sm text-gray-200 focus:outline-none transition-colors appearance-none"
                  >
                    <option value="">-- Pilih Kota Asal --</option>
                    {rates.map((r, i) => <option key={`orig-${i}`} value={r.dest}>{r.dest}, {r.country}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="destinationCity" className="text-xs font-bold text-gray-400 tracking-wider">KOTA TUJUAN</label>
                  <select 
                    id="destinationCity" 
                    name="destinationCity" 
                    required 
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full bg-[#14151a] border border-white/5 focus:border-purple-500/50 rounded-lg px-4 py-3 text-sm text-gray-200 focus:outline-none transition-colors appearance-none"
                  >
                    <option value="">-- Pilih Kota Tujuan --</option>
                    {rates.map((r, i) => <option key={`dest-${i}`} value={r.dest}>{r.dest}, {r.country}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="shippingType" className="text-xs font-bold text-gray-400 tracking-wider">JENIS PENGIRIMAN</label>
                  <select id="shippingType" name="shippingType" required className="w-full bg-[#14151a] border border-white/5 focus:border-purple-500/50 rounded-lg px-4 py-3 text-sm text-gray-200 focus:outline-none transition-colors appearance-none">
                    <option value="Biasa">Biasa</option>
                    <option value="Cepat">Cepat</option>
                    <option value="Vvip">VVIP</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="price" className="text-xs font-bold text-gray-400 tracking-wider">HARGA (TARIF)</label>
                  <input 
                    id="price" 
                    name="price" 
                    type="number" 
                    required 
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00" 
                    className="w-full bg-[#14151a] border border-white/5 focus:border-purple-500/50 rounded-lg px-4 py-3 text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none transition-colors" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="status" className="text-xs font-bold text-gray-400 tracking-wider">STATUS PENGIRIMAN</label>
                  <select id="status" name="status" required className="w-full bg-[#14151a] border border-white/5 focus:border-purple-500/50 rounded-lg px-4 py-3 text-sm text-gray-200 focus:outline-none transition-colors appearance-none">
                    <option value="Pending">Pending</option>
                    <option value="Diproses">Diproses</option>
                    <option value="PORT CLEARANCE">Port Clearance</option>
                    <option value="ON SCHEDULE">On Schedule</option>
                    <option value="Dalam Pengiriman">Dalam Pengiriman</option>
                    <option value="Sampai Tujuan">Sampai Tujuan</option>
                    <option value="Selesai">Selesai</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="estArrival" className="text-xs font-bold text-gray-400 tracking-wider">TGL ESTIMASI / KIRIM</label>
                  <input id="estArrival" name="estArrival" type="date" required className="w-full bg-[#14151a] border border-white/5 focus:border-purple-500/50 rounded-lg px-4 py-3 text-sm text-gray-200 focus:outline-none transition-colors style-date-picker" />
                </div>
              </div>
            </div>

            {/* 3. DATA BARANG */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-purple-400 border-b border-white/10 pb-2">
                <Box size={18} />
                <h3 className="font-bold tracking-widest text-sm">DATA BARANG</h3>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="cargoName" className="text-xs font-bold text-gray-400 tracking-wider">NAMA BARANG</label>
                <input id="cargoName" name="cargoName" type="text" required placeholder="Contoh: Paket Elektronik 1" className="w-full bg-[#14151a] border border-white/5 focus:border-purple-500/50 rounded-lg px-4 py-3 text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none transition-colors" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="cargoType" className="text-xs font-bold text-gray-400 tracking-wider">JENIS BARANG</label>
                  <input id="cargoType" name="cargoType" type="text" required placeholder="Contoh: Elektronik" className="w-full bg-[#14151a] border border-white/5 focus:border-purple-500/50 rounded-lg px-4 py-3 text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none transition-colors" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="weight" className="text-xs font-bold text-gray-400 tracking-wider">BERAT BARANG (KG)</label>
                  <input 
                    id="weight" 
                    name="weight" 
                    type="number" 
                    step="0.01" 
                    required 
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="0.00" 
                    className="w-full bg-[#14151a] border border-white/5 focus:border-purple-500/50 rounded-lg px-4 py-3 text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none transition-colors" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="cargoDescription" className="text-xs font-bold text-gray-400 tracking-wider">DESKRIPSI / CATATAN BARANG</label>
                <textarea id="cargoDescription" name="cargoDescription" rows={3} placeholder="Catatan barang..." className="w-full bg-[#14151a] border border-white/5 focus:border-purple-500/50 rounded-lg px-4 py-3 text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none transition-colors"></textarea>
              </div>
            </div>

            {/* 4. DATA KENDARAAN (KAPAL) */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-purple-400 border-b border-white/10 pb-2">
                <Ship size={18} />
                <h3 className="font-bold tracking-widest text-sm">DATA KENDARAAN (KAPAL)</h3>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="vesselId" className="text-xs font-bold text-gray-400 tracking-wider">PILIH KENDARAAN (KAPAL)</label>
                  <select 
                    id="vesselId" 
                    name="vesselId" 
                    required 
                    className="w-full bg-[#14151a] border border-white/5 focus:border-purple-500/50 rounded-lg px-4 py-3 text-sm text-gray-200 focus:outline-none transition-colors appearance-none"
                  >
                    <option value="">-- Pilih Kendaraan / Kapal --</option>
                    {vessels.map(v => (
                      <option key={v.id} value={v.id}>
                        {v.name} ({v.type}) - Kapasitas: {v.capacity}
                      </option>
                    ))}
                  </select>
                </div>
                
                {vessels.length === 0 && (
                  <p className="text-xs text-yellow-500 italic mt-2">
                    Belum ada data kapal. Silakan tambah data kapal di menu Fleet terlebih dahulu.
                  </p>
                )}
              </div>
            </div>

          </div>

          <div className="pt-4 flex justify-end border-t border-white/10">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="flex justify-center items-center gap-2 bg-[#a155f7] hover:bg-purple-600 disabled:opacity-50 disabled:hover:bg-[#a155f7] text-white px-10 py-3 rounded-lg text-sm font-bold tracking-widest uppercase transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)] mt-4"
            >
              <PlusCircle size={18} />
              {isSubmitting ? "Processing..." : "Save Cargo Data"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
