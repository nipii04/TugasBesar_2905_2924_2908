"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, Trash2, Clock, RefreshCw, AlertCircle, Truck, Ship, CheckCircle2 } from "lucide-react";

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
  "Pending":          { color: "text-gray-400 border-gray-500/30 bg-gray-500/10",   icon: Clock },
  "Diproses":         { color: "text-orange-400 border-orange-500/30 bg-orange-500/10", icon: RefreshCw },
  "PORT CLEARANCE":   { color: "text-yellow-400 border-yellow-500/30 bg-yellow-500/10", icon: AlertCircle },
  "ON SCHEDULE":      { color: "text-blue-400 border-blue-500/30 bg-blue-500/10",   icon: Truck },
  "Dalam Pengiriman": { color: "text-purple-400 border-purple-500/30 bg-purple-500/10", icon: Ship },
  "Sampai Tujuan":    { color: "text-green-400 border-green-500/30 bg-green-500/10", icon: CheckCircle2 },
  "Selesai":          { color: "text-teal-400 border-teal-500/30 bg-teal-500/10",   icon: CheckCircle2 },
};

type Props = {
  shipments: any[];
  updateStatusAction: (id: string, status: string) => Promise<void>;
  deleteAction: (id: string) => Promise<void>;
};

export function ShipmentsTableClient({ shipments, updateStatusAction, deleteAction }: Props) {
  const [statuses, setStatuses] = useState<Record<string, string>>(
    Object.fromEntries(shipments.map((s) => [s.id, s.status]))
  );
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      await updateStatusAction(id, newStatus);
      setStatuses((prev) => ({ ...prev, [id]: newStatus }));
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="w-full overflow-x-auto bg-[#14151a] border border-white/5 rounded-xl">
      <table className="w-full text-left border-collapse min-w-[900px]">
        <thead>
          <tr className="bg-[#17181f] border-b border-white/5 text-xs text-gray-400 uppercase tracking-widest font-bold">
            <th className="p-4">Resi</th>
            <th className="p-4">Pengirim</th>
            <th className="p-4">Penerima</th>
            <th className="p-4">Barang & Berat</th>
            <th className="p-4">Kapal</th>
            <th className="p-4">Status</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="text-sm text-gray-300 font-mono">
          {shipments.map((cargo) => {
            const currentStatus = statuses[cargo.id] || cargo.status;
            const style = STATUS_STYLE[currentStatus] ?? {
              color: "text-gray-400 border-gray-500/30 bg-gray-500/10",
              icon: Clock,
            };

            return (
              <tr key={cargo.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="p-4">
                  <div className="font-bold text-purple-300">{cargo.trackingNumber}</div>
                  <div className="text-[10px] text-gray-500 mt-0.5">
                    {new Date(cargo.createdAt).toLocaleDateString("id-ID")}
                  </div>
                </td>
                <td className="p-4">
                  {cargo.senderName || "-"}
                  <br />
                  <span className="text-[10px] text-gray-500">{cargo.originCity || ""}</span>
                </td>
                <td className="p-4">
                  {cargo.receiverName || "-"}
                  <br />
                  <span className="text-[10px] text-gray-500">{cargo.destinationCity || ""}</span>
                </td>
                <td className="p-4">
                  {cargo.transactionGoods?.[0]?.good?.name || "-"}
                  <br />
                  <span className="text-[10px] text-gray-500">
                    {cargo.transactionGoods?.[0]?.weight || "0"} kg
                  </span>
                </td>
                <td className="p-4 text-blue-400">{cargo.vessel?.name || "-"}</td>
                <td className="p-4">
                  {updatingId === cargo.id ? (
                    <span className="text-yellow-400 animate-pulse font-mono text-[10px]">Updating...</span>
                  ) : (
                    <select
                      value={currentStatus}
                      onChange={(e) => handleStatusChange(cargo.id, e.target.value)}
                      className={`text-[10px] font-bold tracking-wider border rounded-full px-3 py-1 bg-transparent cursor-pointer focus:outline-none transition-colors ${style.color}`}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s} className="bg-[#14151a] text-gray-200 text-xs">
                          {s}
                        </option>
                      ))}
                    </select>
                  )}
                </td>
                <td className="p-4">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/shipments/${cargo.id}/edit`}
                      className="p-2 bg-gray-800 hover:bg-purple-500 text-gray-300 hover:text-white rounded-md transition-colors"
                    >
                      <Pencil size={14} />
                    </Link>
                    <form action={deleteAction.bind(null, cargo.id)}>
                      <button
                        type="submit"
                        className="p-2 bg-gray-800 hover:bg-red-500 text-gray-300 hover:text-white rounded-md transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            );
          })}
          {shipments.length === 0 && (
            <tr>
              <td colSpan={7} className="p-8 text-center text-gray-500">
                No shipments found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
