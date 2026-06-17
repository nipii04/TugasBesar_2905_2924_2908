"use client";

import { Package, ArrowLeft, PlusCircle, CheckCircle2, Ship, Box, User, MapPin } from "lucide-react";
import Link from "next/link";
import { addShipment, getAllVessels, getCustomers } from "../actions";
import { useEffect, useRef, useState } from "react";

type ShipErrors = {
  senderName?: string;
  receiverName?: string;
  phone?: string;
  originCity?: string;
  destinationCity?: string;
  estArrival?: string;
  cargoName?: string;
  cargoType?: string;
  weight?: string;
  vesselId?: string;
  general?: string;
};

export default function AddShipmentPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [vessels, setVessels] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [errors, setErrors] = useState<ShipErrors>({});

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
    { dest: "Mumbai", country: "India", rate: "Rp 380.000", time: "5 - 6 days" },
  ];

  useEffect(() => {
    getAllVessels().then((data) => setVessels(data)).catch(console.error);
    getCustomers().then((data) => setCustomers(data)).catch(console.error);
  }, []);

  useEffect(() => {
    if (origin && destination && weight) {
      if (origin === destination) { setPrice(""); return; }
      const weightNum = parseFloat(weight);
      if (isNaN(weightNum) || weightNum <= 0) { setPrice(""); return; }
      const originObj = rates.find((r) => r.dest === origin);
      const destObj = rates.find((r) => r.dest === destination);
      if (originObj && destObj) {
        const originBaseRate = parseFloat(originObj.rate.replace(/\D/g, ""));
        const destBaseRate = parseFloat(destObj.rate.replace(/\D/g, ""));
        const ratePerKg = (originBaseRate + destBaseRate) / 2 + 50000;
        const baseCost = ratePerKg * weightNum;
        setPrice((baseCost + baseCost * 0.02 + 150000).toString());
      }
    } else {
      setPrice("");
    }
  }, [origin, destination, weight]);

  const clearErr = (field: keyof ShipErrors) =>
    setErrors((p) => ({ ...p, [field]: undefined }));

  async function handleSubmit(formData: FormData) {
    const get = (k: string) => formData.get(k)?.toString().trim() ?? "";

    const newErrors: ShipErrors = {};
    if (!get("senderName"))    newErrors.senderName    = "Nama pengirim wajib diisi.";
    if (!get("receiverName"))  newErrors.receiverName  = "Nama penerima wajib diisi.";
    if (!get("phone"))         newErrors.phone         = "No. telepon wajib diisi.";
    else if (get("phone").replace(/\D/g, "").length > 13) newErrors.phone = "No. telepon maks. 13 digit.";
    else if (!/^[0-9+\-() ]+$/.test(get("phone"))) newErrors.phone = "Format no. telepon tidak valid.";
    if (!get("originCity"))    newErrors.originCity    = "Pilih kota asal.";
    if (!get("destinationCity")) newErrors.destinationCity = "Pilih kota tujuan.";
    else if (get("originCity") === get("destinationCity"))
      newErrors.destinationCity = "Kota asal dan tujuan tidak boleh sama.";
    if (!get("estArrival"))    newErrors.estArrival    = "Tanggal estimasi wajib diisi.";
    if (!get("cargoName"))     newErrors.cargoName     = "Nama barang wajib diisi.";
    if (!get("cargoType"))     newErrors.cargoType     = "Jenis barang wajib diisi.";
    const w = parseFloat(get("weight"));
    if (!get("weight"))        newErrors.weight        = "Berat barang wajib diisi.";
    else if (isNaN(w) || w <= 0) newErrors.weight     = "Berat harus berupa angka positif.";
    if (!get("vesselId"))      newErrors.vesselId      = "Pilih kapal terlebih dahulu.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setIsSuccess(false);
    setErrors({});

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
      setErrors({ general: error.message || "Terjadi kesalahan. Coba lagi." });
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
              <p className="text-sm font-bold text-gray-200">Automatic Tracking Number (Id Pengiriman)</p>
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
                <label htmlFor="customerId" className="text-xs font-bold text-gray-400 tracking-wider">PILIH PELANGGAN</label>
                <select id="customerId" name="customerId" className={selectClass("customerId" as any)}>
                  <option value="">-- Pilih Pelanggan (Opsional) --</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>{c.name} (@{c.username})</option>
                  ))}
                </select>
                {customers.length === 0 && (
                  <p className="text-[10px] text-yellow-500 italic">Belum ada pelanggan terdaftar. Akan otomatis ditetapkan ke pelanggan pertama.</p>
                )}
              </div>

              {/* Nama Pengirim */}
              <div className="space-y-1.5">
                <label htmlFor="senderName" className="text-xs font-bold text-gray-400 tracking-wider">
                  NAMA PENGIRIM <span className="text-red-500">*</span>
                </label>
                <input
                  id="senderName" name="senderName" type="text"
                  placeholder="Nama Pengirim"
                  onChange={() => clearErr("senderName")}
                  className={inputClass("senderName")}
                />
                <FieldError field="senderName" />
              </div>

              {/* Nama Penerima */}
              <div className="space-y-1.5">
                <label htmlFor="receiverName" className="text-xs font-bold text-gray-400 tracking-wider">
                  NAMA PENERIMA <span className="text-red-500">*</span>
                </label>
                <input
                  id="receiverName" name="receiverName" type="text"
                  placeholder="Nama Penerima"
                  onChange={() => clearErr("receiverName")}
                  className={inputClass("receiverName")}
                />
                <FieldError field="receiverName" />
              </div>

              {/* No Telepon */}
              <div className="space-y-1.5">
                <label htmlFor="phone" className="text-xs font-bold text-gray-400 tracking-wider">
                  NO TELEPON <span className="text-red-500">*</span>
                </label>
                <input
                  id="phone" name="phone" type="tel"
                  placeholder="08xxxxxxxxxx"
                  maxLength={15}
                  onChange={(e) => {
                    // Only allow digits, +, -, (, ), spaces
                    const val = e.target.value.replace(/[^0-9+\-() ]/g, "");
                    e.target.value = val;
                    clearErr("phone");
                  }}
                  className={inputClass("phone")}
                />
                <FieldError field="phone" />
              </div>
            </div>

            {/* 2. DATA PENGIRIMAN & RUTE */}
            <div className="space-y-5">
              <div className="flex items-center gap-2 text-purple-400 border-b border-white/10 pb-2">
                <MapPin size={18} />
                <h3 className="font-bold tracking-widest text-sm">DATA PENGIRIMAN</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Kota Asal */}
                <div className="space-y-1.5">
                  <label htmlFor="originCity" className="text-xs font-bold text-gray-400 tracking-wider">
                    KOTA ASAL <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="originCity" name="originCity"
                    value={origin}
                    onChange={(e) => { setOrigin(e.target.value); clearErr("originCity"); }}
                    className={selectClass("originCity")}
                  >
                    <option value="">-- Pilih Kota Asal --</option>
                    {rates.map((r, i) => <option key={`orig-${i}`} value={r.dest}>{r.dest}, {r.country}</option>)}
                  </select>
                  <FieldError field="originCity" />
                </div>

                {/* Kota Tujuan */}
                <div className="space-y-1.5">
                  <label htmlFor="destinationCity" className="text-xs font-bold text-gray-400 tracking-wider">
                    KOTA TUJUAN <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="destinationCity" name="destinationCity"
                    value={destination}
                    onChange={(e) => { setDestination(e.target.value); clearErr("destinationCity"); }}
                    className={selectClass("destinationCity")}
                  >
                    <option value="">-- Pilih Kota Tujuan --</option>
                    {rates.map((r, i) => <option key={`dest-${i}`} value={r.dest}>{r.dest}, {r.country}</option>)}
                  </select>
                  <FieldError field="destinationCity" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Jenis Pengiriman */}
                <div className="space-y-1.5">
                  <label htmlFor="shippingType" className="text-xs font-bold text-gray-400 tracking-wider">JENIS PENGIRIMAN</label>
                  <select id="shippingType" name="shippingType" className={selectClass("shippingType" as any)}>
                    <option value="Biasa">Biasa</option>
                    <option value="Cepat">Cepat</option>
                    <option value="Vvip">VVIP</option>
                  </select>
                </div>

                {/* Harga (auto) */}
                <div className="space-y-1.5">
                  <label htmlFor="price" className="text-xs font-bold text-gray-400 tracking-wider">HARGA (TARIF)</label>
                  <input
                    id="price" name="price" type="number"
                    readOnly value={price} placeholder="0.00"
                    className="w-full bg-[#14151a] border border-white/5 rounded-lg px-4 py-3 text-sm text-purple-400 font-bold placeholder:text-gray-600 focus:outline-none cursor-not-allowed"
                  />
                  <p className="text-[10px] text-gray-500 font-mono">* Dihitung otomatis sesuai kalkulator harga</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Status */}
                <div className="space-y-1.5">
                  <label htmlFor="status" className="text-xs font-bold text-gray-400 tracking-wider">STATUS PENGIRIMAN</label>
                  <select id="status" name="status" className={selectClass("status" as any)}>
                    <option value="Pending">Pending</option>
                    <option value="Diproses">Diproses</option>
                    <option value="PORT CLEARANCE">Port Clearance</option>
                    <option value="ON SCHEDULE">On Schedule</option>
                    <option value="Dalam Pengiriman">Dalam Pengiriman</option>
                    <option value="Sampai Tujuan">Sampai Tujuan</option>
                    <option value="Selesai">Selesai</option>
                  </select>
                </div>

                {/* Tanggal Estimasi */}
                <div className="space-y-1.5">
                  <label htmlFor="estArrival" className="text-xs font-bold text-gray-400 tracking-wider">
                    TGL ESTIMASI / KIRIM <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="estArrival" name="estArrival" type="date"
                    onChange={() => clearErr("estArrival")}
                    className={inputClass("estArrival")}
                  />
                  <FieldError field="estArrival" />
                </div>
              </div>
            </div>

            {/* 3. DATA BARANG */}
            <div className="space-y-5">
              <div className="flex items-center gap-2 text-purple-400 border-b border-white/10 pb-2">
                <Box size={18} />
                <h3 className="font-bold tracking-widest text-sm">DATA BARANG</h3>
              </div>

              {/* Nama Barang */}
              <div className="space-y-1.5">
                <label htmlFor="cargoName" className="text-xs font-bold text-gray-400 tracking-wider">
                  NAMA BARANG <span className="text-red-500">*</span>
                </label>
                <input
                  id="cargoName" name="cargoName" type="text"
                  placeholder="Contoh: Paket Elektronik 1"
                  onChange={() => clearErr("cargoName")}
                  className={inputClass("cargoName")}
                />
                <FieldError field="cargoName" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Jenis Barang */}
                <div className="space-y-1.5">
                  <label htmlFor="cargoType" className="text-xs font-bold text-gray-400 tracking-wider">
                    JENIS BARANG <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="cargoType" name="cargoType" type="text"
                    placeholder="Contoh: Elektronik"
                    onChange={() => clearErr("cargoType")}
                    className={inputClass("cargoType")}
                  />
                  <FieldError field="cargoType" />
                </div>

                {/* Berat */}
                <div className="space-y-1.5">
                  <label htmlFor="weight" className="text-xs font-bold text-gray-400 tracking-wider">
                    BERAT BARANG (KG) <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="weight" name="weight" type="number" step="0.01"
                    value={weight} placeholder="0.00"
                    onChange={(e) => { setWeight(e.target.value); clearErr("weight"); }}
                    className={inputClass("weight")}
                  />
                  <FieldError field="weight" />
                </div>
              </div>

              {/* Deskripsi */}
              <div className="space-y-1.5">
                <label htmlFor="cargoDescription" className="text-xs font-bold text-gray-400 tracking-wider">DESKRIPSI / CATATAN BARANG</label>
                <textarea
                  id="cargoDescription" name="cargoDescription" rows={3}
                  placeholder="Catatan barang..."
                  className="w-full bg-[#14151a] border border-white/5 focus:border-purple-500/50 rounded-lg px-4 py-3 text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none transition-colors"
                ></textarea>
              </div>
            </div>

            {/* 4. DATA KENDARAAN (KAPAL) */}
            <div className="space-y-5">
              <div className="flex items-center gap-2 text-purple-400 border-b border-white/10 pb-2">
                <Ship size={18} />
                <h3 className="font-bold tracking-widest text-sm">DATA KENDARAAN (KAPAL)</h3>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="vesselId" className="text-xs font-bold text-gray-400 tracking-wider">
                  PILIH KENDARAAN (KAPAL) <span className="text-red-500">*</span>
                </label>
                <select
                  id="vesselId" name="vesselId"
                  onChange={() => clearErr("vesselId")}
                  className={selectClass("vesselId")}
                >
                  <option value="">-- Pilih Kendaraan / Kapal --</option>
                  {vessels.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.type}) - Kapasitas: {v.capacity} unit
                    </option>
                  ))}
                </select>
                <FieldError field="vesselId" />
                {vessels.length === 0 && (
                  <p className="text-xs text-yellow-500 italic mt-1">
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
