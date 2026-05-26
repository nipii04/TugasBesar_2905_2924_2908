import { Package, Filter, PlusCircle, Pencil, Trash2, Ship, MapPin, User, Box, BarChart2, List as ListIcon, Table as TableIcon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { getShipments, deleteShipment } from "./actions";
import { SearchInput } from "@/components/SearchInput";
import { Pagination } from "@/components/Pagination";

export default async function ShipmentsManagement(props: { searchParams: Promise<{ query?: string; page?: string; view?: string }> }) {
  const searchParams = await props.searchParams;
  const query = searchParams.query || "";
  const currentPage = Number(searchParams.page) || 1;
  const view = searchParams.view || "list"; // list, table, chart

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-wider mb-1">ALL SHIPMENTS (UGD)</h1>
          <p className="text-gray-500 font-mono text-sm">Manage comprehensive cargo, vessel, and sender data</p>
        </div>
        <Link 
          href="/shipments/add" 
          className="flex items-center gap-2 bg-[#a155f7] hover:bg-purple-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold tracking-widest uppercase transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)]"
        >
          <PlusCircle size={18} />
          Add Cargo
        </Link>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-[#111115] p-3 rounded-xl border border-white/5">
        <SearchInput placeholder="Search by tracking number, sender, receiver, or cargo name..." />

        <div className="flex items-center gap-4 w-full md:w-auto">
          <button className="p-2.5 text-gray-400 hover:text-white bg-[#17181f] rounded-lg transition-colors border border-transparent hover:border-white/10">
            <Filter size={18} />
          </button>
          
          {/* View Toggles (UGD Requirement: 3 Formats) */}
          <div className="flex items-center bg-[#17181f] rounded-lg p-1">
            <Link 
              href={`/shipments?query=${query}&page=1&view=list`}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-bold tracking-wider transition-colors ${view === 'list' ? 'bg-[#a155f7] text-white' : 'text-gray-500 hover:text-white'}`}
            >
               <ListIcon size={14} /> LIST
            </Link>
            <Link 
              href={`/shipments?query=${query}&page=1&view=table`}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-bold tracking-wider transition-colors ${view === 'table' ? 'bg-[#a155f7] text-white' : 'text-gray-500 hover:text-white'}`}
            >
               <TableIcon size={14} /> TABLE
            </Link>
            <Link 
              href={`/shipments?query=${query}&page=1&view=chart`}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-bold tracking-wider transition-colors ${view === 'chart' ? 'bg-[#a155f7] text-white' : 'text-gray-500 hover:text-white'}`}
            >
               <BarChart2 size={14} /> CHART
            </Link>
          </div>
        </div>
      </div>

      <Suspense key={query + currentPage + view} fallback={<ShipmentsListSkeleton />}>
        {view === 'list' && <ShipmentsList query={query} currentPage={currentPage} />}
        {view === 'table' && <ShipmentsTable query={query} currentPage={currentPage} />}
        {view === 'chart' && <ShipmentsChart query={query} />}
      </Suspense>

    </div>
  );
}

// --------------------- FORMAT 1: LIST / CARDS ---------------------
async function ShipmentsList({ query, currentPage }: { query: string, currentPage: number }) {
  const { shipments, total, totalPages } = await getShipments(query, currentPage, 12);

  return (
    <>
      <div className="text-[11px] font-mono text-gray-500">
        Showing <span className="text-white font-bold">{shipments.length}</span> of <span className="text-white font-bold">{total}</span> shipments
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {shipments.map((cargo: any) => {
          let statusColorStr = "gray";
          if (cargo.status === "ON SCHEDULE" || cargo.status === "Selesai" || cargo.status === "Sampai Tujuan") statusColorStr = "green";
          else if (cargo.status === "Dalam Pengiriman" || cargo.status === "Diproses") statusColorStr = "blue";
          else if (cargo.status === "Pending") statusColorStr = "yellow";
          
          const vessel = cargo.vessel;
          const goodInfo = cargo.transactionGoods?.[0]?.good;

          return (
            <div key={cargo.id} className="bg-[#14151a] border border-white/5 rounded-xl hover:border-purple-500/30 transition-all group overflow-hidden flex flex-col relative shadow-lg">
              
              {/* Delete & Edit (Absolute Top Right on Hover) */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex gap-1">
                <Link href={`/shipments/${cargo.id}/edit`} className="p-1.5 bg-gray-800/80 hover:bg-purple-500/80 text-gray-300 hover:text-white rounded-md backdrop-blur-sm transition-colors">
                  <Pencil size={14} />
                </Link>
                <form action={async () => {
                  "use server";
                  await deleteShipment(cargo.id);
                }}>
                  <button type="submit" className="p-1.5 bg-gray-800/80 hover:bg-red-500/80 text-gray-300 hover:text-white rounded-md backdrop-blur-sm transition-colors">
                    <Trash2 size={14} />
                  </button>
                </form>
              </div>

              {/* Card Header (Transaction Info) */}
              <div className="p-5 border-b border-white/5 flex justify-between items-start">
                <div className="flex gap-3">
                  <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg h-fit">
                    <Package size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-200 leading-tight mb-0.5">{cargo.trackingNumber}</h3>
                    <p className="text-[10px] text-gray-500 font-mono tracking-widest">{cargo.shippingType || "STANDAR"} • Rp {cargo.price?.toLocaleString() || "0"}</p>
                  </div>
                </div>
                
                <div className={`px-2.5 py-1 text-[9px] font-bold border rounded-full tracking-wider uppercase
                  ${statusColorStr === 'green' ? 'text-green-400 bg-green-500/10 border-green-500/20' : ''}
                  ${statusColorStr === 'blue' ? 'text-blue-400 bg-blue-500/10 border-blue-500/20' : ''}
                  ${statusColorStr === 'yellow' ? 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' : ''}
                  ${statusColorStr === 'gray' ? 'text-gray-400 bg-gray-500/10 border-gray-500/20' : ''}`}>
                  {cargo.status}
                </div>
              </div>

              {/* Card Body (Detailed Info) */}
              <div className="p-5 space-y-4 flex-1 text-xs text-gray-400 font-mono">
                
                {/* User / Route */}
                <div className="space-y-2 bg-[#17181f] p-3 rounded-lg border border-white/5">
                  <div className="flex items-center gap-2 text-purple-400 mb-2">
                    <User size={14} /> <span className="font-bold tracking-widest">SENDER & RECEIVER</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sender:</span> 
                    <span className="text-gray-300 truncate max-w-[150px]">{cargo.senderName || "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Receiver:</span> 
                    <span className="text-gray-300 truncate max-w-[150px]">{cargo.receiverName || "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Route:</span> 
                    <span className="text-gray-300 truncate max-w-[150px]">{cargo.originCity || "-"} → {cargo.destinationCity || "-"}</span>
                  </div>
                </div>

                {/* Vessel Info */}
                <div className="space-y-2 bg-[#17181f] p-3 rounded-lg border border-white/5">
                  <div className="flex items-center gap-2 text-blue-400 mb-2">
                    <Ship size={14} /> <span className="font-bold tracking-widest">VESSEL INFO</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span> 
                    <span className="text-gray-300 truncate">{vessel?.name || "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Code/Type:</span> 
                    <span className="text-gray-300 truncate">{vessel?.assignedKey || "-"} • {vessel?.type || "-"}</span>
                  </div>
                </div>

                {/* Cargo Info */}
                <div className="space-y-2 bg-[#17181f] p-3 rounded-lg border border-white/5">
                  <div className="flex items-center gap-2 text-orange-400 mb-2">
                    <Box size={14} /> <span className="font-bold tracking-widest">CARGO INFO</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Item:</span> 
                    <span className="text-gray-300 truncate">{goodInfo?.name || "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Weight:</span> 
                    <span className="text-gray-300">{cargo.transactionGoods?.[0]?.weight ? `${cargo.transactionGoods[0].weight} kg` : '-'}</span>
                  </div>
                </div>
                
                <div className="flex justify-between pt-2 border-t border-white/5">
                  <span className="text-gray-600">ETA / Date:</span> 
                  <span className="text-gray-300">{new Date(cargo.estArrival).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          );
        })}

        {shipments.length === 0 && (
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-gray-500 space-y-4">
            <Package size={48} className="opacity-20" />
            <p className="font-mono text-sm">No shipments found.</p>
          </div>
        )}
      </div>

      <Pagination totalPages={totalPages} currentPage={currentPage} />
    </>
  );
}

// --------------------- FORMAT 2: TABLE ---------------------
async function ShipmentsTable({ query, currentPage }: { query: string, currentPage: number }) {
  const { shipments, total, totalPages } = await getShipments(query, currentPage, 10);

  return (
    <div className="space-y-4">
      <div className="text-[11px] font-mono text-gray-500">
        Showing <span className="text-white font-bold">{shipments.length}</span> of <span className="text-white font-bold">{total}</span> shipments (Table View)
      </div>

      <div className="w-full overflow-x-auto bg-[#14151a] border border-white/5 rounded-xl">
        <table className="w-full text-left border-collapse min-w-[800px]">
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
            {shipments.map((cargo: any) => {
               let statusColorStr = "text-gray-400";
               if (cargo.status === "ON SCHEDULE" || cargo.status === "Selesai" || cargo.status === "Sampai Tujuan") statusColorStr = "text-green-400";
               else if (cargo.status === "Dalam Pengiriman" || cargo.status === "Diproses") statusColorStr = "text-blue-400";
               else if (cargo.status === "Pending") statusColorStr = "text-yellow-400";

               return (
                <tr key={cargo.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4 text-purple-400 font-bold">{cargo.trackingNumber}</td>
                  <td className="p-4">{cargo.senderName || "-"} <br/><span className="text-[10px] text-gray-500">{cargo.originCity || ""}</span></td>
                  <td className="p-4">{cargo.receiverName || "-"} <br/><span className="text-[10px] text-gray-500">{cargo.destinationCity || ""}</span></td>
                  <td className="p-4">{cargo.transactionGoods?.[0]?.good?.name || "-"} <br/><span className="text-[10px] text-gray-500">{cargo.transactionGoods?.[0]?.weight || "0"} kg</span></td>
                  <td className="p-4 text-blue-400">{cargo.vessel?.name || "-"}</td>
                  <td className={`p-4 ${statusColorStr} font-bold text-xs uppercase`}>{cargo.status}</td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <Link href={`/shipments/${cargo.id}/edit`} className="p-2 bg-gray-800 hover:bg-purple-500 text-gray-300 hover:text-white rounded-md transition-colors">
                        <Pencil size={14} />
                      </Link>
                      <form action={async () => {
                        "use server";
                        await deleteShipment(cargo.id);
                      }}>
                        <button type="submit" className="p-2 bg-gray-800 hover:bg-red-500 text-gray-300 hover:text-white rounded-md transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
               )
            })}
            {shipments.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gray-500">No shipments found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination totalPages={totalPages} currentPage={currentPage} />
    </div>
  );
}

// --------------------- FORMAT 3: CHART / GRAFIK ---------------------
async function ShipmentsChart({ query }: { query: string }) {
  // Untuk chart, kita ambil semua data tanpa pagination
  const { shipments } = await getShipments(query, 1, 1000); 

  // Hitung jumlah pengiriman berdasarkan Status
  const statusCounts: Record<string, number> = {};
  shipments.forEach((s: any) => {
    statusCounts[s.status] = (statusCounts[s.status] || 0) + 1;
  });

  const statuses = ["Pending", "Diproses", "PORT CLEARANCE", "ON SCHEDULE", "Dalam Pengiriman", "Sampai Tujuan", "Selesai"];
  
  const maxCount = Math.max(...statuses.map(s => statusCounts[s] || 0), 1); // min 1 to avoid division by 0

  return (
    <div className="w-full bg-[#14151a] border border-white/5 rounded-xl p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-4">
        <BarChart2 className="text-purple-400" size={24} />
        <h2 className="text-xl font-bold tracking-wider">STATISTIK STATUS PENGIRIMAN</h2>
      </div>

      {shipments.length === 0 ? (
        <div className="py-12 flex flex-col items-center justify-center text-gray-500 space-y-4">
          <BarChart2 size={48} className="opacity-20" />
          <p className="font-mono text-sm">Tidak ada data untuk ditampilkan di grafik.</p>
        </div>
      ) : (
        <div className="space-y-6 max-w-3xl mx-auto">
          {statuses.map(status => {
            const count = statusCounts[status] || 0;
            const percentage = (count / maxCount) * 100;
            
            let color = "bg-gray-500";
            if (status === "ON SCHEDULE" || status === "Selesai" || status === "Sampai Tujuan") color = "bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]";
            else if (status === "Dalam Pengiriman" || status === "Diproses" || status === "PORT CLEARANCE") color = "bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]";
            else if (status === "Pending") color = "bg-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.3)]";

            return (
              <div key={status} className="space-y-2">
                <div className="flex justify-between text-xs font-bold tracking-widest text-gray-400 uppercase">
                  <span>{status}</span>
                  <span className="text-white">{count} Data</span>
                </div>
                <div className="w-full h-4 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${color} rounded-full transition-all duration-1000 ease-out`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ShipmentsListSkeleton() {
  return (
    <div className="w-full py-16 flex flex-col items-center justify-center space-y-4">
      <div className="w-12 h-12 border-4 border-[#a155f7]/30 border-t-[#a155f7] rounded-full animate-spin"></div>
      <p className="text-[#a155f7] font-mono font-bold tracking-widest text-sm animate-pulse">MEMUAT DATA PENGIRIMAN UGD...</p>
    </div>
  );
}
