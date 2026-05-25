"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Edit2, Trash2, X, Ship } from "lucide-react";
import { createCargo, updateCargo, deleteCargo, CargoFormData } from "./actions";

export default function CargoClient({ 
  initialCargos, 
  vessels,
  searchQuery
}: { 
  initialCargos: any[]; 
  vessels: any[];
  searchQuery: string;
}) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(searchQuery);

  const [formData, setFormData] = useState<CargoFormData>({
    sendDate: new Date().toISOString().split("T")[0],
    senderName: "",
    receiverName: "",
    phone: "",
    originCity: "",
    destinationCity: "",
    price: 0,
    deliveryType: "Biasa",
    status: "Diproses",
    notes: "",
    itemName: "",
    itemWeight: 0,
    vesselId: vessels[0]?.id || ""
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/dashboard/ugd-cargo?search=${encodeURIComponent(search)}`);
  };

  const openCreateModal = () => {
    setFormData({
      sendDate: new Date().toISOString().split("T")[0],
      senderName: "",
      receiverName: "",
      phone: "",
      originCity: "",
      destinationCity: "",
      price: 0,
      deliveryType: "Biasa",
      status: "Diproses",
      notes: "",
      itemName: "",
      itemWeight: 0,
      vesselId: vessels[0]?.id || ""
    });
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const openEditModal = (cargo: any) => {
    // Fill with existing data
    setFormData({
      sendDate: new Date(cargo.sendDate || cargo.createdAt).toISOString().split("T")[0],
      senderName: cargo.customer?.name || "",
      receiverName: cargo.receiverName || "",
      phone: cargo.phone || "",
      originCity: cargo.originPort?.city || "",
      destinationCity: cargo.destinationPort?.city || "",
      price: cargo.price || 0,
      deliveryType: cargo.deliveryType || "Biasa",
      status: cargo.status,
      notes: cargo.notes || "",
      itemName: cargo.transactionGoods?.[0]?.good?.name || "",
      itemWeight: cargo.transactionGoods?.[0]?.weight || 0,
      vesselId: cargo.vesselId || ""
    });
    setEditingId(cargo.id);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditMode && editingId) {
        await updateCargo(editingId, formData);
      } else {
        await createCargo(formData);
      }
      setIsModalOpen(false);
      router.refresh();
    } catch (error) {
      alert("Error saving cargo");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Yakin ingin menghapus data ini?")) {
      await deleteCargo(id);
      router.refresh();
    }
  };

  return (
    <div className="bg-[#111115] border border-white/5 rounded-xl p-6 shadow-2xl">
      {/* TOOLBAR: SEARCH & CREATE */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari No Resi, Pengirim, Penerima, Barang..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#1a1b23] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-colors"
          />
        </form>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-semibold transition-colors shadow-[0_0_15px_rgba(147,51,234,0.3)]"
        >
          <Plus className="w-4 h-4" /> Tambah Data
        </button>
      </div>

      {/* DATA TABLE */}
      <div className="overflow-x-auto rounded-lg border border-white/5">
        <table className="w-full text-left text-sm text-gray-300">
          <thead className="text-xs uppercase bg-[#1a1b23] text-gray-400">
            <tr>
              <th className="px-4 py-3">No Resi</th>
              <th className="px-4 py-3">Pengirim & Penerima</th>
              <th className="px-4 py-3">Rute</th>
              <th className="px-4 py-3">Barang</th>
              <th className="px-4 py-3">Kapal (Kendaraan)</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {initialCargos.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-500">
                  Tidak ada data cargo ditemukan.
                </td>
              </tr>
            ) : (
              initialCargos.map((cargo) => (
                <tr key={cargo.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-purple-400">{cargo.trackingNumber}</td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-white">{cargo.customer?.name || "N/A"}</p>
                    <p className="text-xs text-gray-500">To: {cargo.receiverName || "N/A"}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p>{cargo.originPort?.city || "N/A"} → {cargo.destinationPort?.city || "N/A"}</p>
                    <p className="text-xs text-gray-500">{cargo.deliveryType}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-white">{cargo.transactionGoods?.[0]?.good?.name || "N/A"}</p>
                    <p className="text-xs text-gray-500">{cargo.transactionGoods?.[0]?.weight || 0} kg</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Ship className="w-4 h-4 text-blue-400" />
                      <div>
                        <p className="text-white">{cargo.vessel?.name || "Belum Ditentukan"}</p>
                        <p className="text-[10px] text-gray-500">{cargo.vessel?.assignedKey || "-"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded text-xs font-semibold bg-gray-800 border border-gray-700">
                      {cargo.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEditModal(cargo)} className="p-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(cargo.id)} className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-[#111115] border border-white/10 rounded-2xl w-full max-w-3xl shadow-2xl relative my-8">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="p-6 border-b border-white/5">
              <h2 className="text-xl font-bold text-white">
                {isEditMode ? "Update Data Cargo" : "Tambah Data Cargo (CRUDS UGD)"}
              </h2>
              <p className="text-sm text-gray-400">Silakan isi formulir di bawah ini dengan lengkap.</p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* PENGIRIMAN & PENERIMA */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-purple-400 uppercase tracking-widest border-b border-white/5 pb-2">Informasi Pengiriman</h3>
                  
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Tanggal Kirim</label>
                    <input type="date" required disabled={isEditMode} value={formData.sendDate} onChange={e => setFormData({...formData, sendDate: e.target.value})} className="w-full bg-[#1a1b23] border border-white/10 rounded p-2 text-sm text-white focus:outline-none focus:border-purple-500 disabled:opacity-50" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Nama Pengirim</label>
                    <input type="text" required disabled={isEditMode} value={formData.senderName} onChange={e => setFormData({...formData, senderName: e.target.value})} className="w-full bg-[#1a1b23] border border-white/10 rounded p-2 text-sm text-white focus:outline-none focus:border-purple-500 disabled:opacity-50" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Nama Penerima</label>
                    <input type="text" required disabled={isEditMode} value={formData.receiverName} onChange={e => setFormData({...formData, receiverName: e.target.value})} className="w-full bg-[#1a1b23] border border-white/10 rounded p-2 text-sm text-white focus:outline-none focus:border-purple-500 disabled:opacity-50" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">No Telepon</label>
                    <input type="text" required disabled={isEditMode} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-[#1a1b23] border border-white/10 rounded p-2 text-sm text-white focus:outline-none focus:border-purple-500 disabled:opacity-50" />
                  </div>
                </div>

                {/* RUTE & BIAYA */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-blue-400 uppercase tracking-widest border-b border-white/5 pb-2">Rute & Layanan</h3>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Kota Asal</label>
                      <input type="text" required disabled={isEditMode} value={formData.originCity} onChange={e => setFormData({...formData, originCity: e.target.value})} className="w-full bg-[#1a1b23] border border-white/10 rounded p-2 text-sm text-white focus:outline-none focus:border-purple-500 disabled:opacity-50" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Kota Tujuan</label>
                      <input type="text" required disabled={isEditMode} value={formData.destinationCity} onChange={e => setFormData({...formData, destinationCity: e.target.value})} className="w-full bg-[#1a1b23] border border-white/10 rounded p-2 text-sm text-white focus:outline-none focus:border-purple-500 disabled:opacity-50" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Jenis Pengiriman</label>
                    <select required disabled={isEditMode} value={formData.deliveryType} onChange={e => setFormData({...formData, deliveryType: e.target.value})} className="w-full bg-[#1a1b23] border border-white/10 rounded p-2 text-sm text-white focus:outline-none focus:border-purple-500 disabled:opacity-50">
                      <option value="Biasa">Biasa</option>
                      <option value="Cepat">Cepat</option>
                      <option value="VVIP">VVIP</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Harga/Tarif Pengiriman (Rp)</label>
                    <input type="number" required value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="w-full bg-[#1a1b23] border border-white/10 rounded p-2 text-sm text-white focus:outline-none focus:border-purple-500" />
                  </div>
                </div>

                {/* BARANG */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-orange-400 uppercase tracking-widest border-b border-white/5 pb-2">Informasi Barang</h3>
                  
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Jenis/Nama Barang</label>
                    <input type="text" required disabled={isEditMode} value={formData.itemName} onChange={e => setFormData({...formData, itemName: e.target.value})} className="w-full bg-[#1a1b23] border border-white/10 rounded p-2 text-sm text-white focus:outline-none focus:border-purple-500 disabled:opacity-50" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Berat Barang (Kg)</label>
                    <input type="number" step="0.1" required disabled={isEditMode} value={formData.itemWeight} onChange={e => setFormData({...formData, itemWeight: Number(e.target.value)})} className="w-full bg-[#1a1b23] border border-white/10 rounded p-2 text-sm text-white focus:outline-none focus:border-purple-500 disabled:opacity-50" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Deskripsi/Catatan Barang</label>
                    <textarea disabled={isEditMode} value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full bg-[#1a1b23] border border-white/10 rounded p-2 text-sm text-white focus:outline-none focus:border-purple-500 h-20 resize-none disabled:opacity-50"></textarea>
                  </div>
                </div>

                {/* KENDARAAN (KAPAL) & STATUS */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-green-400 uppercase tracking-widest border-b border-white/5 pb-2">Kendaraan & Status</h3>
                  
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Kapal (Kendaraan)</label>
                    <select required value={formData.vesselId} onChange={e => setFormData({...formData, vesselId: e.target.value})} className="w-full bg-[#1a1b23] border border-white/10 rounded p-2 text-sm text-white focus:outline-none focus:border-purple-500">
                      {vessels.map(v => (
                        <option key={v.id} value={v.id}>
                          {v.name} ({v.type}) - {v.assignedKey}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Status Pengiriman</label>
                    <select required value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full bg-[#1a1b23] border border-white/10 rounded p-2 text-sm text-white focus:outline-none focus:border-purple-500">
                      <option value="Diproses">Diproses</option>
                      <option value="Dalam Pengiriman">Dalam Pengiriman</option>
                      <option value="Sampai Tujuan">Sampai Tujuan</option>
                      <option value="Pending">Pending</option>
                      <option value="Selesai">Selesai</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">
                  Batal
                </button>
                <button type="submit" disabled={loading} className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-semibold transition-colors shadow-[0_0_15px_rgba(147,51,234,0.3)] disabled:opacity-50">
                  {loading ? "Menyimpan..." : (isEditMode ? "Update Data" : "Simpan Data")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
