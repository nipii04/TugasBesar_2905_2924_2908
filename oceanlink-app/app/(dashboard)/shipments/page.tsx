import { Package, Filter, PlusCircle, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { getShipments, deleteShipment } from "./actions";
import { SearchInput } from "@/components/SearchInput";
import { Pagination } from "@/components/Pagination";

export default async function ShipmentsManagement(props: { searchParams: Promise<{ query?: string; page?: string }> }) {
  const searchParams = await props.searchParams;
  const query = searchParams.query || "";
  const currentPage = Number(searchParams.page) || 1;

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-wider mb-1">ALL SHIPMENTS</h1>
          <p className="text-gray-500 font-mono text-sm">Manage and track your cargo inventory</p>
        </div>
        <Link 
          href="/shipments/add" 
          className="flex items-center gap-2 bg-[#a155f7] hover:bg-purple-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold tracking-widest uppercase transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)]"
        >
          <PlusCircle size={18} />
          Add Shipment
        </Link>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-[#111115] p-3 rounded-xl border border-white/5">
        <SearchInput placeholder="Search by tracking number, origin, or destination..." />

        <div className="flex items-center gap-4 w-full md:w-auto">
          <button className="p-2.5 text-gray-400 hover:text-white bg-[#17181f] rounded-lg transition-colors border border-transparent hover:border-white/10">
            <Filter size={18} />
          </button>
          <div className="flex items-center bg-[#17181f] rounded-lg p-1">
            <button className="flex items-center gap-2 px-4 py-1.5 bg-[#a155f7] text-white rounded-md text-xs font-bold tracking-wider">
               CARDS
            </button>
            <button className="flex items-center gap-2 px-4 py-1.5 text-gray-500 hover:text-white rounded-md text-xs font-bold tracking-wider transition-colors">
               TABLE
            </button>
          </div>
        </div>
      </div>

      <Suspense key={query + currentPage} fallback={<ShipmentsListSkeleton />}>
        <ShipmentsList query={query} currentPage={currentPage} />
      </Suspense>

    </div>
  );
}

async function ShipmentsList({ query, currentPage }: { query: string, currentPage: number }) {
  // Tambahan delay buatan agar animasi Suspense terlihat saat demo
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const { shipments, total, totalPages } = await getShipments(query, currentPage, 12);

  return (
    <>
      <div className="text-[11px] font-mono text-gray-500">
        Showing <span className="text-white font-bold">{shipments.length}</span> of <span className="text-white font-bold">{total}</span> shipments
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {shipments.map((cargo) => {
          let statusColorStr = "gray";
          if (cargo.status === "ON SCHEDULE" || cargo.status === "DELIVERED") statusColorStr = "green";
          else if (cargo.status === "IN TRANSIT") statusColorStr = "blue";
          else if (cargo.status === "DELAYED") statusColorStr = "red";
          else if (cargo.status === "PORT CLEARANCE") statusColorStr = "yellow";

          return (
            <div key={cargo.id} className="bg-[#14151a] border border-white/5 rounded-xl hover:border-purple-500/30 transition-all group overflow-hidden flex flex-col relative">
              
              {/* Delete Form (Absolute Top Right on Hover) */}
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

              {/* Card Header */}
              <div className="p-5 border-b border-white/5 flex justify-between items-start">
                <div className="flex gap-3">
                  <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg h-fit">
                    <Package size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-200 leading-tight mb-0.5">{cargo.trackingNumber}</h3>
                    <p className="text-[10px] text-gray-500 font-mono tracking-widest">{cargo.cargoType}</p>
                  </div>
                </div>
                
                <div className={`px-2.5 py-1 text-[9px] font-bold border rounded-full tracking-wider uppercase
                  ${statusColorStr === 'green' ? 'text-green-400 bg-green-500/10 border-green-500/20' : ''}
                  ${statusColorStr === 'blue' ? 'text-blue-400 bg-blue-500/10 border-blue-500/20' : ''}
                  ${statusColorStr === 'yellow' ? 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' : ''}
                  ${statusColorStr === 'red' ? 'text-red-500 bg-red-500/10 border-red-500/20' : ''}
                  ${statusColorStr === 'gray' ? 'text-gray-400 bg-gray-500/10 border-gray-500/20' : ''}`}>
                  {cargo.status}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-3 flex-1 text-xs text-gray-400 font-mono">
                <div className="flex justify-between">
                  <span className="text-gray-600">Origin:</span> 
                  <span className="text-gray-300 truncate max-w-[150px] text-right">{cargo.origin}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Destination:</span> 
                  <span className="text-gray-300 truncate max-w-[150px] text-right">{cargo.destination}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Weight:</span> 
                  <span className="text-gray-300">{cargo.weight ? `${cargo.weight} kg` : '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">ETA:</span> 
                  <span className="text-gray-300">{cargo.estArrival.toLocaleDateString()}</span>
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

function ShipmentsListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-[#14151a] border border-white/5 rounded-xl h-[200px]"></div>
      ))}
    </div>
  );
}
