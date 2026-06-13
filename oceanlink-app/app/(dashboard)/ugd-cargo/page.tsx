"use client";

import { useState, useEffect, useTransition } from "react";
import { Search, Package, RefreshCw, Truck, CheckCircle2, Clock, AlertCircle, Ship } from "lucide-react";
import { getUgdCargo, updateUgdCargoStatus } from "./actions";

const STATUS_OPTIONS = [
  "Pending",
  "Diproses",
  "PORT CLEARANCE",
  "ON SCHEDULE",
  "Dalam Pengiriman",
  "Sampai Tujuan",
  "Selesai",
];

const STATUS_STYLE: Record<string, { color: string; icon: React.ElementType }> = {
  "Pending":          { color: "text-gray-400 border-gray-500/30 bg-gray-500/10", icon: Clock },
  "Diproses":         { color: "text-orange-400 border-orange-500/30 bg-orange-500/10", icon: RefreshCw },
  "PORT CLEARANCE":   { color: "text-yellow-400 border-yellow-500/30 bg-yellow-500/10", icon: AlertCircle },
  "ON SCHEDULE":      { color: "text-blue-400 border-blue-500/30 bg-blue-500/10", icon: Truck },
  "Dalam Pengiriman": { color: "text-purple-400 border-purple-500/30 bg-purple-500/10", icon: Ship },
  "Sampai Tujuan":    { color: "text-green-400 border-green-500/30 bg-green-500/10", icon: CheckCircle2 },
  "Selesai":          { color: "text-teal-400 border-teal-500/30 bg-teal-500/10", icon: CheckCircle2 },
  "IN TRANSIT":       { color: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10", icon: Truck },
};

export default function UgdCargoPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [inputQuery, setInputQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const load = (q: string, p: number) => {
    setIsLoading(true);
    getUgdCargo(q, p, 10)
      .then(res => {
        setTransactions(res.transactions);
        setTotal(res.total);
        setTotalPages(res.totalPages);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    load(query, page);
  }, [query, page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setQuery(inputQuery);
  };

  const handleStatusChange = async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      await updateUgdCargoStatus(id, status);
      // Update local state
      setTransactions(prev =>
        prev.map(tx => tx.id === id ? { ...tx, status } : tx)
      );
    } catch (error) {
      console.error(error);
    } finally {
      setUpdatingId(null);
    }
  };

  const formatRupiah = (n: number | null) =>
    n != null ? "Rp " + n.toLocaleString("id-ID") : "-";

  return (
    <div className="w-full space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-wider mb-1">UGD CARGO</h1>
          <p className="text-gray-500 font-mono text-sm">
            Manajemen pengiriman kargo — total <span className="text-white font-bold">{total}</span> transaksi
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-purple-500/30 text-purple-400 text-xs font-mono font-bold tracking-widest bg-purple-500/5">
          <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse shadow-[0_0_6px_rgba(168,85,247,0.8)]" />
          LIVE DATABASE
        </div>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={inputQuery}
            onChange={e => setInputQuery(e.target.value)}
            placeholder="Cari tracking number, pengirim, penerima, kota..."
            className="w-full pl-9 pr-4 py-2.5 bg-[#111115] border border-white/5 focus:border-purple-500/40 rounded-xl text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none transition-colors font-mono"
          />
        </div>
        <button type="submit" className="px-5 py-2.5 bg-purple-500 hover:bg-purple-400 text-white text-xs font-bold rounded-xl transition-colors tracking-widest">
          CARI
        </button>
        {query && (
          <button
            type="button"
            onClick={() => { setInputQuery(""); setQuery(""); setPage(1); }}
            className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-xs font-bold rounded-xl transition-colors"
          >
            RESET
          </button>
        )}
      </form>

      {/* Table */}
      <div className="bg-[#14151a] border border-white/5 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="text-[10px] text-gray-500 uppercase tracking-widest font-mono border-b border-white/5 bg-[#111115]">
                <th className="p-4 font-semibold">Tracking</th>
                <th className="p-4 font-semibold">Pengirim → Penerima</th>
                <th className="p-4 font-semibold">Rute</th>
                <th className="p-4 font-semibold">Kapal</th>
                <th className="p-4 font-semibold">Harga</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Est. Tiba</th>
              </tr>
            </thead>
            <tbody className="text-xs font-mono text-gray-300">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-gray-500 animate-pulse">
                    Memuat data dari database...
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <Package size={32} className="text-gray-600" />
                      <span>Tidak ada data ditemukan{query ? ` untuk "${query}"` : ""}</span>
                    </div>
                  </td>
                </tr>
              ) : (
                transactions.map(tx => {
                  const style = STATUS_STYLE[tx.status] || { color: "text-gray-400 border-gray-500/30 bg-gray-500/10", icon: Clock };
                  const StatusIcon = style.icon;
                  return (
                    <tr key={tx.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      {/* Tracking */}
                      <td className="p-4">
                        <div className="font-bold text-purple-300">{tx.trackingNumber}</div>
                        <div className="text-[10px] text-gray-500 mt-0.5">
                          {new Date(tx.createdAt).toLocaleDateString("id-ID")}
                        </div>
                      </td>

                      {/* Pengirim → Penerima */}
                      <td className="p-4">
                        <div className="text-gray-200 font-sans">{tx.senderName || "-"}</div>
                        <div className="text-gray-500 text-[10px] mt-0.5">→ {tx.receiverName || "-"}</div>
                        {tx.phone && <div className="text-gray-600 text-[9px]">{tx.phone}</div>}
                      </td>

                      {/* Rute */}
                      <td className="p-4">
                        <div className="text-gray-200">{tx.originCity || "-"}</div>
                        <div className="text-gray-500 text-[10px] mt-0.5">→ {tx.destinationCity || "-"}</div>
                        {tx.shippingType && (
                          <div className="text-purple-400/70 text-[9px] mt-0.5">{tx.shippingType}</div>
                        )}
                      </td>

                      {/* Kapal */}
                      <td className="p-4 text-gray-400">
                        {tx.vessel?.name || <span className="text-gray-600 italic">—</span>}
                      </td>

                      {/* Harga */}
                      <td className="p-4 font-bold text-green-400">
                        {formatRupiah(tx.price)}
                      </td>

                      {/* Status — Dropdown untuk update langsung */}
                      <td className="p-4">
                        {updatingId === tx.id ? (
                          <span className="text-yellow-400 animate-pulse font-mono text-[10px]">Updating...</span>
                        ) : (
                          <select
                            value={tx.status}
                            onChange={e => handleStatusChange(tx.id, e.target.value)}
                            className={`text-[10px] font-bold tracking-wider border rounded-full px-3 py-1 bg-transparent cursor-pointer focus:outline-none transition-colors ${style.color}`}
                          >
                            {STATUS_OPTIONS.map(s => (
                              <option key={s} value={s} className="bg-[#14151a] text-gray-200 text-xs">
                                {s}
                              </option>
                            ))}
                          </select>
                        )}
                      </td>

                      {/* Est. Tiba */}
                      <td className="p-4 text-gray-400">
                        {new Date(tx.estArrival).toLocaleDateString("id-ID", {
                          day: "numeric", month: "short", year: "numeric"
                        })}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-white/5 bg-[#111115] flex justify-between items-center text-xs font-mono text-gray-500">
            <span>
              Halaman <span className="text-white font-bold">{page}</span> dari <span className="text-white font-bold">{totalPages}</span>
              {" "}(<span className="text-white font-bold">{total}</span> total)
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg text-gray-300 transition-colors"
              >
                ← Prev
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg text-gray-300 transition-colors"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
