import { Suspense } from "react";
import { getShipmentLogs } from "./actions";
import { Pagination } from "@/components/Pagination";
import { Clock, Activity, Loader2, ArrowRight } from "lucide-react";

export default async function LogsPage(props: { searchParams: Promise<{ page?: string }> }) {
  const searchParams = await props.searchParams;
  const currentPage = Number(searchParams.page) || 1;

  return (
    <div className="w-full space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-wider mb-1">ACTIVITY LOGS</h1>
          <p className="text-gray-500 font-mono text-sm">System audit trail and shipment status history</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-purple-500/30 text-purple-400 text-xs font-mono font-bold tracking-widest bg-purple-500/5">
          <Activity size={14} className="text-purple-400" />
          SYSTEM LOGS
        </div>
      </div>

      <div className="bg-[#14151a] border border-white/5 rounded-xl overflow-hidden flex flex-col">
        <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#111115]">
          <h2 className="text-lg font-bold tracking-wider flex items-center gap-2">
            <Clock size={18} className="text-gray-400" />
            TRANSACTION LOGS
          </h2>
        </div>

        <Suspense key={currentPage} fallback={<LogsTableSkeleton />}>
          <LogsTable currentPage={currentPage} />
        </Suspense>
      </div>
    </div>
  );
}

async function LogsTable({ currentPage }: { currentPage: number }) {
  const { logs, totalPages } = await getShipmentLogs(currentPage, 15);

  return (
    <div className="flex-1 flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="text-[10px] text-gray-500 uppercase tracking-widest font-mono border-b border-white/5 bg-[#17181f]/40">
              <th className="font-semibold p-4 w-40">Timestamp</th>
              <th className="font-semibold p-4 w-48">Shipment</th>
              <th className="font-semibold p-4 w-32">Action</th>
              <th className="font-semibold p-4">Description</th>
              <th className="font-semibold p-4 w-40 text-right">User / Role</th>
            </tr>
          </thead>
          <tbody className="text-xs text-gray-300">
            {logs.map((log: any) => (
              <tr key={log.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="p-4 text-gray-500 font-mono text-[10px]">
                  {log.createdAt.toLocaleString("id-ID", { 
                    timeZone: "Asia/Jakarta",
                    day: "2-digit", month: "short", year: "numeric", 
                    hour: "2-digit", minute: "2-digit", second: "2-digit"
                  })} WIB
                </td>
                <td className="p-4">
                  {log.transaction ? (
                    <div>
                      <div className="font-bold text-purple-300 font-mono">{log.transaction.trackingNumber}</div>
                      <div className="text-[10px] text-gray-500 mt-0.5 flex items-center gap-1">
                        {log.transaction.originCity} <ArrowRight size={10} /> {log.transaction.destinationCity}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="font-bold text-gray-500 font-mono line-through">{log.trackingSnapshot || "-"}</div>
                      <div className="text-[10px] text-red-500/80 mt-0.5 font-mono">(Deleted)</div>
                    </div>
                  )}
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-[10px] font-bold rounded border tracking-wider uppercase font-mono ${
                    log.action === "CREATED" ? "bg-green-500/10 text-green-400 border-green-500/20" :
                    log.action === "UPDATED" || log.action === "STATUS_CHANGED" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                    log.action === "DELETED" ? "bg-red-500/10 text-red-400 border-red-500/20" :
                    "bg-gray-500/10 text-gray-400 border-gray-500/20"
                  }`}>
                    {log.action}
                  </span>
                </td>
                <td className="p-4">
                  <span className="text-gray-300">{log.description}</span>
                  {log.oldStatus && log.newStatus && log.oldStatus !== log.newStatus && (
                    <div className="text-[10px] font-mono text-gray-500 mt-1 flex items-center gap-2">
                      <span className="line-through">{log.oldStatus}</span> 
                      <ArrowRight size={10} /> 
                      <span className="text-white">{log.newStatus}</span>
                    </div>
                  )}
                </td>
                <td className="p-4 text-right">
                  {log.user ? (
                    <div>
                      <div className="font-bold text-gray-300">{log.user.name}</div>
                      <div className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">{log.user.role}</div>
                    </div>
                  ) : (
                    <span className="text-gray-500">-</span>
                  )}
                </td>
              </tr>
            ))}

            {logs.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500 font-mono text-sm">
                  No logs recorded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="p-4 border-t border-white/5">
        <Pagination totalPages={totalPages} currentPage={currentPage} />
      </div>
    </div>
  );
}

function LogsTableSkeleton() {
  return (
    <div className="w-full py-24 flex flex-col items-center justify-center space-y-5">
      <Loader2 size={48} className="text-[#a155f7] animate-spin" />
      <p className="text-[#a155f7] font-mono font-bold tracking-widest text-sm animate-pulse">LOADING LOGS DATA...</p>
    </div>
  );
}
