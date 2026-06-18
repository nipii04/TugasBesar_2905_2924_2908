"use client";

import { RefreshCw, Anchor, Truck, CheckCircle2, Clock, AlertCircle, FileCheck, Ship, MapPin } from "lucide-react";

import Link from "next/link";

const STATUS_STYLE: Record<string, { color: string; icon: React.ElementType }> = {
  "Processing":       { color: "text-orange-400 border-orange-500/30 bg-orange-500/10", icon: RefreshCw },
  "Port Clearance":   { color: "text-yellow-400 border-yellow-500/30 bg-yellow-500/10", icon: FileCheck },
  "In Transit":       { color: "text-blue-400 border-blue-500/30 bg-blue-500/10", icon: Ship },
  "Arrived":          { color: "text-teal-400 border-teal-500/30 bg-teal-500/10", icon: MapPin },
  "Delivered":        { color: "text-green-400 border-green-500/30 bg-green-500/10", icon: CheckCircle2 },
};

type Props = {
  shipments: any[];
  updateStatusAction: (id: string, status: string) => Promise<void>;
  deleteAction: (id: string) => Promise<void>;
};

export function ShipmentsTableClient({ shipments }: Props) {
  return (
    <div className="w-full space-y-3">
      <div className="w-full overflow-x-auto bg-[#14151a] border border-white/5 rounded-xl">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-[#17181f] border-b border-white/5 text-xs text-gray-400 uppercase tracking-widest font-bold">
              <th className="p-4">Tracking</th>
              <th className="p-4">Sender</th>
              <th className="p-4">Receiver</th>
              <th className="p-4 text-xs font-mono text-gray-500 uppercase tracking-widest text-left">
                Type / Price
              </th>
              <th className="p-4">Vessel</th>
              <th className="p-4">Status</th>
              <th className="p-4">ETA Date</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-300 font-mono">
            {shipments.map((cargo) => {
              const currentStatus = cargo.status;
              const style = STATUS_STYLE[currentStatus] ?? {
                color: "text-gray-400 border-gray-500/30 bg-gray-500/10",
                icon: Clock,
              };
              const StatusIcon = style.icon;

              return (
                <tr
                  key={cargo.id}
                  className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                >
                  <td className="p-4">
                    <div className="font-bold text-purple-300">
                      {cargo.trackingNumber}
                    </div>
                    <div className="text-[10px] text-gray-500 mt-0.5">
                      {new Date(cargo.createdAt).toLocaleDateString("id-ID", { timeZone: "Asia/Jakarta", dateStyle: "medium" })}
                    </div>
                  </td>
                  <td className="p-4">
                    {cargo.senderName || "-"}
                    <br />
                    <span className="text-[10px] text-gray-500">
                      {cargo.originCity || ""}
                    </span>
                  </td>
                  <td className="p-4">
                    {cargo.receiverName || "-"}
                    <br />
                    <span className="text-[10px] text-gray-500">
                      {cargo.destinationCity || ""}
                    </span>
                  </td>
                  <td className="p-4">
                    {cargo.shippingType || "General"}
                    <br />
                    <span className="text-[10px] text-gray-500">
                      Rp {cargo.price ? cargo.price.toLocaleString("id-ID") : "0"}
                    </span>
                  </td>
                  <td className="p-4 text-blue-400">
                    {cargo.vessel?.name || "-"}
                  </td>
                  <td className="p-4">
                    {/* Static read-only status badge */}
                    <span
                      className={`inline-flex items-center gap-1.5 text-[10px] font-bold tracking-wider border rounded-full px-3 py-1 ${style.color}`}
                    >
                      <StatusIcon size={11} />
                      {currentStatus}
                    </span>
                  </td>
                  <td className="p-4 text-[10px] text-gray-500">
                    {new Date(cargo.estArrival).toLocaleDateString("id-ID", { timeZone: "Asia/Jakarta", dateStyle: "medium" })}
                  </td>
                  <td className="p-4 text-right">
                    <Link href={`/shipments/${cargo.id}/edit`} className="text-purple-400 hover:text-purple-300 font-bold text-xs uppercase tracking-wider group-hover:translate-x-1 inline-block transition-transform">Edit &rarr;</Link>
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
    </div>
  );
}
