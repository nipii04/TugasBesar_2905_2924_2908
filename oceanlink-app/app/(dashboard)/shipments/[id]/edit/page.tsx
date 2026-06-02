import { Package, ArrowLeft, CheckCircle, Ship, CreditCard, Activity } from "lucide-react";
import Link from "next/link";
import { updateShipment } from "../../actions";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function EditShipmentPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  
  const transaction = await prisma.transaction.findUnique({
    where: { id: params.id },
    include: {
      vessel: true,
    }
  });

  if (!transaction) {
    notFound();
  }

  const updateShipmentWithId = updateShipment.bind(null, transaction.id);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-white/5 pb-4">
        <Link href="/shipments" className="p-2 bg-[#17181f] text-gray-400 hover:text-white rounded-lg transition-colors border border-transparent hover:border-white/10">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-wider mb-1">EDIT CARGO</h1>
          <p className="text-gray-500 font-mono text-sm">Update data pengiriman dan kendaraan: {transaction.trackingNumber}</p>
        </div>
      </div>

      {/* Form Container */}
      <div className="bg-[#111115] border border-white/5 rounded-xl p-6 sm:p-8">
        
        <form action={updateShipmentWithId} className="space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Kolom Kiri: Produk / Pengiriman */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-purple-400 border-b border-white/10 pb-2">
                <Activity size={18} />
                <h3 className="font-bold tracking-widest text-sm">PRODUK / PENGIRIMAN</h3>
              </div>

              <div className="space-y-2">
                <label htmlFor="status" className="text-xs font-bold text-gray-400 tracking-wider">STATUS PENGIRIMAN / BARANG</label>
                <select 
                  id="status"
                  name="status"
                  defaultValue={transaction.status}
                  required
                  className="w-full bg-[#14151a] border border-white/5 focus:border-purple-500/50 rounded-lg px-4 py-3 text-sm text-gray-200 focus:outline-none transition-colors appearance-none"
                >
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
                <label htmlFor="price" className="text-xs font-bold text-gray-400 tracking-wider flex items-center gap-2">
                  <CreditCard size={14} /> HARGA PENGIRIMAN
                </label>
                <input 
                  id="price"
                  name="price" 
                  type="number"
                  defaultValue={transaction.price || ""}
                  placeholder="0.00" 
                  className="w-full bg-[#14151a] border border-white/5 focus:border-purple-500/50 rounded-lg px-4 py-3 text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Kolom Kanan: Kendaraan */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-blue-400 border-b border-white/10 pb-2">
                <Ship size={18} />
                <h3 className="font-bold tracking-widest text-sm">DATA KENDARAAN (KAPAL)</h3>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="vesselName" className="text-xs font-bold text-gray-400 tracking-wider">NAMA KENDARAAN</label>
                <input 
                  id="vesselName"
                  name="vesselName" 
                  type="text"
                  defaultValue={transaction.vessel?.name || ""}
                  required
                  placeholder="Nama Kapal" 
                  className="w-full bg-[#14151a] border border-white/5 focus:border-purple-500/50 rounded-lg px-4 py-3 text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="vesselType" className="text-xs font-bold text-gray-400 tracking-wider">JENIS KENDARAAN</label>
                  <input 
                    id="vesselType"
                    name="vesselType" 
                    type="text"
                    defaultValue={transaction.vessel?.type || ""}
                    required
                    placeholder="Contoh: Container Ship" 
                    className="w-full bg-[#14151a] border border-white/5 focus:border-purple-500/50 rounded-lg px-4 py-3 text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="vesselCode" className="text-xs font-bold text-gray-400 tracking-wider">KODE KENDARAAN</label>
                  <input 
                    id="vesselCode"
                    name="vesselCode" 
                    type="text"
                    defaultValue={transaction.vessel?.assignedKey || ""}
                    required
                    placeholder="Kode Unik" 
                    className="w-full bg-[#14151a] border border-white/5 focus:border-purple-500/50 rounded-lg px-4 py-3 text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="vesselCapacity" className="text-xs font-bold text-gray-400 tracking-wider">KAPASITAS MUATAN</label>
                  <input 
                    id="vesselCapacity"
                    name="vesselCapacity" 
                    type="number"
                    defaultValue={transaction.vessel?.capacity || ""}
                    required
                    placeholder="Kapasitas" 
                    className="w-full bg-[#14151a] border border-white/5 focus:border-purple-500/50 rounded-lg px-4 py-3 text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="vesselStatus" className="text-xs font-bold text-gray-400 tracking-wider">STATUS KENDARAAN</label>
                  <select 
                    id="vesselStatus"
                    name="vesselStatus"
                    defaultValue={transaction.vessel?.status || "ACTIVE"}
                    required
                    className="w-full bg-[#14151a] border border-white/5 focus:border-purple-500/50 rounded-lg px-4 py-3 text-sm text-gray-200 focus:outline-none transition-colors appearance-none"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="MAINTENANCE">MAINTENANCE</option>
                    <option value="DOCKED">DOCKED</option>
                  </select>
                </div>
              </div>

            </div>
          </div>

          <div className="pt-6 flex justify-end gap-3 border-t border-white/10">
            <Link 
              href="/shipments"
              className="px-5 py-2.5 rounded-lg text-sm font-bold tracking-widest text-gray-400 hover:text-white bg-[#17181f] hover:bg-[#1f2029] transition-colors"
            >
              CANCEL
            </Link>
            <button 
              type="submit" 
              className="flex justify-center items-center gap-2 bg-[#a155f7] hover:bg-purple-600 text-white px-8 py-3 rounded-lg text-sm font-bold tracking-widest uppercase transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)]"
            >
              <CheckCircle size={18} />
              UPDATE DATA
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
