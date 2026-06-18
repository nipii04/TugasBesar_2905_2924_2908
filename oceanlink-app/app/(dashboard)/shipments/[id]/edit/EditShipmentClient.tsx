"use client";

import { Package, ArrowLeft, CheckCircle, Ship, CreditCard, Activity } from "lucide-react";
import Link from "next/link";
import { updateShipment } from "../../actions";
import { useState } from "react";

type EditErrors = { senderName?: string; receiverName?: string; phone?: string; general?: string };

interface Props {
  transaction: {
    id: string;
    trackingNumber: string;
    status: string;
    price: number | null;
    senderName: string | null;
    receiverName: string | null;
    phone: string | null;
    originCity: string | null;
    destinationCity: string | null;
    estArrival: Date | null;
    vessel?: {
      name: string;
      type: string;
      assignedKey: string | null;
      capacity: number;
      status: string;
    } | null;
  };
}

export default function EditShipmentClient({ transaction }: Props) {
  const [errors, setErrors] = useState<EditErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const clearErr = (field: keyof EditErrors) =>
    setErrors((p) => ({ ...p, [field]: undefined }));

  async function handleSubmit(formData: FormData) {
    const get = (k: string) => formData.get(k)?.toString().trim() ?? "";

    const newErrors: EditErrors = {};
    if (!get("senderName"))     newErrors.senderName     = "Sender name is required.";
    if (!get("receiverName"))   newErrors.receiverName   = "Receiver name is required.";
    if (!get("phone"))          newErrors.phone          = "No telepon wajib diisi.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});
    try {
      await updateShipment(transaction.id, formData);
    } catch (err: any) {
      setErrors({ general: err.message || "Gagal mengupdate data pengiriman." });
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputClass = (field: keyof EditErrors) =>
    `w-full bg-[#14151a] border rounded-lg px-4 py-3 text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none transition-colors ${
      errors[field] ? "border-red-500/60 focus:border-red-500" : "border-white/5 focus:border-purple-500/50"
    }`;

  const FieldError = ({ field }: { field: keyof EditErrors }) =>
    errors[field] ? (
      <p className="text-red-400 text-[11px] font-mono mt-1 flex items-center gap-1">
        <span className="text-red-500">✕</span> {errors[field]}
      </p>
    ) : null;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4 border-b border-white/5 pb-4">
        <Link href="/shipments" className="p-2 bg-[#17181f] text-gray-400 hover:text-white rounded-lg transition-colors border border-transparent hover:border-white/10">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-wider mb-1">EDIT CARGO</h1>
          <p className="text-gray-500 font-mono text-sm">Update shipment and cargo data: {transaction.trackingNumber}</p>
        </div>
      </div>

      <div className="bg-[#111115] border border-white/5 rounded-xl p-6 sm:p-8">
        {errors.general && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs font-mono">
            {errors.general}
          </div>
        )}

        <form action={handleSubmit} className="space-y-8" noValidate>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Kolom Kiri: Produk / Pengiriman */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-purple-400 border-b border-white/10 pb-2">
                <Activity size={18} />
                <h3 className="font-bold tracking-widest text-sm">PRODUK / PENGIRIMAN</h3>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="status" className="text-xs font-bold text-gray-400 tracking-wider">SHIPMENT / CARGO STATUS</label>
                <select id="status" name="status" defaultValue={transaction.status}
                  className="w-full bg-[#14151a] border border-white/5 focus:border-purple-500/50 rounded-lg px-4 py-3 text-sm text-gray-200 focus:outline-none transition-colors appearance-none">
                  <option value="Processing">Processing</option>
                  <option value="Port Clearance">Port Clearance</option>
                  <option value="In Transit">In Transit</option>
                  <option value="Arrived">Arrived</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="price" className="text-xs font-bold text-gray-400 tracking-wider flex items-center gap-2">
                  <CreditCard size={14} /> HARGA PENGIRIMAN
                </label>
                <input id="price" name="price" type="number" defaultValue={transaction.price || ""} placeholder="0.00"
                  className="w-full bg-[#14151a] border border-white/5 focus:border-purple-500/50 rounded-lg px-4 py-3 text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none transition-colors" />
              </div>

              <div className="space-y-1.5 pt-4 border-t border-white/5">
                <label htmlFor="senderName" className="text-xs font-bold text-gray-400 tracking-wider">
                  SENDER NAME <span className="text-red-500">*</span>
                </label>
                <input id="senderName" name="senderName" type="text"
                  defaultValue={transaction.senderName || ""} placeholder="Sender Name"
                  onChange={() => clearErr("senderName")} className={inputClass("senderName")} />
                <FieldError field="senderName" />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="receiverName" className="text-xs font-bold text-gray-400 tracking-wider">
                  RECEIVER NAME <span className="text-red-500">*</span>
                </label>
                <input id="receiverName" name="receiverName" type="text"
                  defaultValue={transaction.receiverName || ""} placeholder="Receiver Name"
                  onChange={() => clearErr("receiverName")} className={inputClass("receiverName")} />
                <FieldError field="receiverName" />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="phone" className="text-xs font-bold text-gray-400 tracking-wider">
                  PHONE NUMBER <span className="text-red-500">*</span>
                </label>
                <input id="phone" name="phone" type="tel"
                  defaultValue={transaction.phone || ""} placeholder="08xxxxxxxxxx" maxLength={15}
                  onChange={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9+\-() ]/g, "");
                    clearErr("phone");
                  }} 
                  className={inputClass("phone")} />
                <FieldError field="phone" />
              </div>
            </div>

            {/* Kolom Kanan: Kendaraan */}
            <div className="space-y-5">
              <div className="flex items-center gap-2 text-blue-400 border-b border-white/10 pb-2">
                <Ship size={18} />
                <h3 className="font-bold tracking-widest text-sm">INFORMASI PENGIRIMAN (READ-ONLY)</h3>
              </div>

              <div className="bg-[#14151a] border border-white/5 rounded-lg p-5 space-y-4">
                <div>
                  <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">Vessel / Kendaraan</p>
                  <p className="text-sm font-bold text-blue-400">{transaction.vessel ? `${transaction.vessel.name} (${transaction.vessel.type})` : "Belum ditentukan"}</p>
                  {transaction.vessel && (
                    <p className="text-xs text-gray-400 mt-1">Status: {transaction.vessel.status} | Kapasitas: {transaction.vessel.capacity}</p>
                  )}
                </div>
                
                <div className="border-t border-white/5 pt-4">
                  <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">Rute</p>
                  <div className="flex items-center gap-2 text-sm text-gray-300 font-bold">
                    <span>{transaction.originCity}</span>
                    <span className="text-purple-400">→</span>
                    <span>{transaction.destinationCity}</span>
                  </div>
                </div>

                <div className="border-t border-white/5 pt-4">
                  <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">Estimasi Tiba / Kirim</p>
                  <p className="text-sm text-gray-300 font-bold">
                    {transaction.estArrival ? new Date(transaction.estArrival).toLocaleDateString('id-ID', { timeZone: 'Asia/Jakarta', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : "-"}
                  </p>
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mt-4">
                <p className="text-xs text-blue-400 leading-relaxed font-mono">
                  <b>Catatan:</b> Data kapal dan rute terikat dengan jadwal pelayaran yang sedang berjalan dan tidak dapat diubah dari form ini. Jika terjadi kesalahan rute, silakan batalkan pesanan dan buat pesanan baru.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6 flex justify-end gap-3 border-t border-white/10">
            <Link href="/shipments" className="px-5 py-2.5 rounded-lg text-sm font-bold tracking-widest text-gray-400 hover:text-white bg-[#17181f] hover:bg-[#1f2029] transition-colors">
              CANCEL
            </Link>
            <button type="submit" disabled={isSubmitting}
              className="flex justify-center items-center gap-2 bg-[#a155f7] disabled:opacity-50 hover:bg-purple-600 text-white px-8 py-3 rounded-lg text-sm font-bold tracking-widest uppercase transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)]">
              <CheckCircle size={18} />
              {isSubmitting ? "SAVING..." : "UPDATE DATA"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
