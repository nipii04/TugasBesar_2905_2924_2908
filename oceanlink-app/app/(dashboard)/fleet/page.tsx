import { Ship, Filter, PlusCircle, Pencil, Trash2, LayoutGrid, List as ListIcon, Table as TableIcon, BarChart2, Loader2 } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { getVessels, deleteVessel } from "./actions";
import { SearchInput } from "@/components/SearchInput";
import { Pagination } from "@/components/Pagination";

export default async function FleetManagement(props: { searchParams: Promise<{ query?: string; page?: string; view?: string }> }) {
  const searchParams = await props.searchParams;
  const query = searchParams.query || "";
  const currentPage = Number(searchParams.page) || 1;
  const view = searchParams.view || "cards";

  return (
    <div className="w-full space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-wider mb-1">FLEET MANAGEMENT</h1>
          <p className="text-gray-500 font-mono text-sm">Complete vessel inventory and details</p>
        </div>
        <Link 
          href="/fleet/add" 
          className="flex items-center gap-2 bg-[#a155f7] hover:bg-purple-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold tracking-widest uppercase transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)]"
        >
          <PlusCircle size={18} />
          Add Vessel
        </Link>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-[#111115] p-3 rounded-xl border border-white/5">
        <SearchInput placeholder="Search by vessel name, type, or key..." />

        <div className="flex items-center gap-4 w-full md:w-auto">
          <button className="p-2.5 text-gray-400 hover:text-white bg-[#17181f] rounded-lg transition-colors border border-transparent hover:border-white/10">
            <Filter size={18} />
          </button>
          <div className="flex items-center bg-[#17181f] rounded-lg p-1">
            <Link 
              href={`/fleet?query=${query}&page=1&view=cards`}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold tracking-wider transition-colors ${view === 'cards' ? 'bg-[#a155f7] text-white' : 'text-gray-500 hover:text-white'}`}
            >
               <LayoutGrid size={14} /> CARDS
            </Link>
            <Link 
              href={`/fleet?query=${query}&page=1&view=list`}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold tracking-wider transition-colors ${view === 'list' ? 'bg-[#a155f7] text-white' : 'text-gray-500 hover:text-white'}`}
            >
               <ListIcon size={14} /> LIST
            </Link>
            <Link 
              href={`/fleet?query=${query}&page=1&view=table`}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold tracking-wider transition-colors ${view === 'table' ? 'bg-[#a155f7] text-white' : 'text-gray-500 hover:text-white'}`}
            >
               <TableIcon size={14} /> TABLE
            </Link>
            <Link 
              href={`/fleet?query=${query}&page=1&view=chart`}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold tracking-wider transition-colors ${view === 'chart' ? 'bg-[#a155f7] text-white' : 'text-gray-500 hover:text-white'}`}
            >
               <BarChart2 size={14} /> CHART
            </Link>
          </div>
        </div>
      </div>

      <Suspense key={query + currentPage + view} fallback={<FleetListSkeleton />}>
        {view === 'cards' && <FleetCards query={query} currentPage={currentPage} />}
        {view === 'list' && <FleetList query={query} currentPage={currentPage} />}
        {view === 'table' && <FleetTable query={query} currentPage={currentPage} />}
        {view === 'chart' && <FleetChart query={query} />}
      </Suspense>

    </div>
  );
}

// --------------------- FORMAT 1: CARDS ---------------------
async function FleetCards({ query, currentPage }: { query: string, currentPage: number }) {
  const { vessels, total, totalPages } = await getVessels(query, currentPage, 12);

  return (
    <>
      <div className="text-[11px] font-mono text-gray-500">
        Showing <span className="text-white font-bold">{vessels.length}</span> of <span className="text-white font-bold">{total}</span> vessels (Cards View)
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {vessels.map((v) => {
          let statusColorStr = "gray";
          if (v.status === "ACTIVE") statusColorStr = "green";
          else if (v.status === "MAINTENANCE") statusColorStr = "red";
          else if (v.status === "DOCKED") statusColorStr = "blue";

          return (
            <div key={v.id} className="bg-[#14151a] border border-white/5 rounded-xl hover:border-purple-500/30 transition-all group overflow-hidden flex flex-col relative">
              
              {/* Delete Form (Absolute Top Right on Hover) */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex gap-1">
                <Link href={`/fleet/${v.id}/edit`} className="p-1.5 bg-gray-800/80 hover:bg-purple-500/80 text-gray-300 hover:text-white rounded-md backdrop-blur-sm transition-colors">
                  <Pencil size={14} />
                </Link>
                <form action={deleteVessel.bind(null, v.id)}>
                  <button type="submit" className="p-1.5 bg-gray-800/80 hover:bg-red-500/80 text-gray-300 hover:text-white rounded-md backdrop-blur-sm transition-colors">
                    <Trash2 size={14} />
                  </button>
                </form>
              </div>

              {/* Card Header */}
              <div className="p-5 border-b border-white/5 flex justify-between items-start">
                <div className="flex gap-3">
                  <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg h-fit">
                    <Ship size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-200 leading-tight mb-0.5 truncate max-w-[120px]" title={v.name}>{v.name}</h3>
                    <p className="text-[10px] text-gray-500 font-mono tracking-widest">{v.assignedKey || "NO-KEY"}</p>
                  </div>
                </div>
                
                <div className={`px-2.5 py-1 text-[9px] font-bold border rounded-full tracking-wider uppercase
                  ${statusColorStr === 'green' ? 'text-green-400 bg-green-500/10 border-green-500/20' : ''}
                  ${statusColorStr === 'blue' ? 'text-blue-400 bg-blue-500/10 border-blue-500/20' : ''}
                  ${statusColorStr === 'red' ? 'text-red-500 bg-red-500/10 border-red-500/20' : ''}
                  ${statusColorStr === 'gray' ? 'text-gray-400 bg-gray-500/10 border-gray-500/20' : ''}`}>
                  {v.status}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-3 flex-1 text-xs text-gray-400 font-mono">
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span> 
                  <span className="text-gray-300 truncate max-w-[120px] text-right">{v.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Capacity:</span> 
                  <span className="text-gray-300">{v.capacity} units</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Built:</span> 
                  <span className="text-gray-300">{v.buildYear || "-"}</span>
                </div>
              </div>

            </div>
          );
        })}

        {vessels.length === 0 && (
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-gray-500 space-y-4">
            <Ship size={48} className="opacity-20" />
            <p className="font-mono text-sm">No vessels found.</p>
          </div>
        )}
      </div>

      <Pagination totalPages={totalPages} currentPage={currentPage} />
    </>
  );
}

// --------------------- FORMAT 2: LIST ---------------------
async function FleetList({ query, currentPage }: { query: string, currentPage: number }) {
  const { vessels, total, totalPages } = await getVessels(query, currentPage, 12);

  return (
    <>
      <div className="text-[11px] font-mono text-gray-500">
        Showing <span className="text-white font-bold">{vessels.length}</span> of <span className="text-white font-bold">{total}</span> vessels (List View)
      </div>

      <div className="flex flex-col gap-3">
        {vessels.map((v) => {
          let statusColorStr = "text-gray-400 bg-gray-500/10 border-gray-500/20";
          if (v.status === "ACTIVE") statusColorStr = "text-green-400 bg-green-500/10 border-green-500/20";
          else if (v.status === "MAINTENANCE") statusColorStr = "text-red-500 bg-red-500/10 border-red-500/20";
          else if (v.status === "DOCKED") statusColorStr = "text-blue-400 bg-blue-500/10 border-blue-500/20";

          return (
            <div key={v.id} className="bg-[#14151a] border border-white/5 rounded-xl p-4 flex flex-col md:flex-row justify-between items-center gap-4 hover:bg-white/5 transition-colors group">
              
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="p-3 bg-purple-500/10 text-purple-400 rounded-lg shrink-0">
                  <Ship size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-200 text-sm md:text-base">{v.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500 font-mono mt-1">
                    <span>{v.assignedKey || "NO-KEY"}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-6 w-full md:w-auto text-sm font-mono">
                <div className="flex flex-col md:items-end text-gray-400 text-xs">
                  <span>Type: <span className="text-gray-200">{v.type}</span></span>
                  <span>Capacity: <span className="text-gray-200">{v.capacity} units</span></span>
                </div>
                <div className={`px-3 py-1 text-[10px] font-bold border rounded-full tracking-wider uppercase ${statusColorStr} shrink-0`}>
                  {v.status}
                </div>
                <div className="flex gap-2">
                  <Link href={`/fleet/${v.id}/edit`} className="p-2 bg-gray-800 hover:bg-purple-500 text-gray-300 hover:text-white rounded-md transition-colors">
                    <Pencil size={14} />
                  </Link>
                  <form action={deleteVessel.bind(null, v.id)}>
                    <button type="submit" className="p-2 bg-gray-800 hover:bg-red-500 text-gray-300 hover:text-white rounded-md transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </form>
                </div>
              </div>

            </div>
          )
        })}

        {vessels.length === 0 && (
          <div className="py-12 flex flex-col items-center justify-center text-gray-500 space-y-4">
            <Ship size={48} className="opacity-20" />
            <p className="font-mono text-sm">No vessels found.</p>
          </div>
        )}
      </div>

      <Pagination totalPages={totalPages} currentPage={currentPage} />
    </>
  );
}

// --------------------- FORMAT 3: TABLE ---------------------
async function FleetTable({ query, currentPage }: { query: string, currentPage: number }) {
  const { vessels, total, totalPages } = await getVessels(query, currentPage, 10);

  return (
    <div className="space-y-4">
      <div className="text-[11px] font-mono text-gray-500">
        Showing <span className="text-white font-bold">{vessels.length}</span> of <span className="text-white font-bold">{total}</span> vessels (Table View)
      </div>

      <div className="w-full overflow-x-auto bg-[#14151a] border border-white/5 rounded-xl">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-[#17181f] border-b border-white/5 text-xs text-gray-400 uppercase tracking-widest font-bold">
              <th className="p-4">Name</th>
              <th className="p-4">Code / Key</th>
              <th className="p-4">Type</th>
              <th className="p-4">Capacity</th>
              <th className="p-4">Built</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-300 font-mono">
            {vessels.map((v: any) => {
               let statusColorStr = "text-gray-400";
               if (v.status === "ACTIVE") statusColorStr = "text-green-400";
               else if (v.status === "MAINTENANCE") statusColorStr = "text-red-500";
               else if (v.status === "DOCKED") statusColorStr = "text-blue-400";

               return (
                <tr key={v.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4 text-purple-400 font-bold">{v.name}</td>
                  <td className="p-4">{v.assignedKey || "-"}</td>
                  <td className="p-4">{v.type}</td>
                  <td className="p-4">{v.capacity}</td>
                  <td className="p-4">{v.buildYear || "-"}</td>
                  <td className={`p-4 ${statusColorStr} font-bold text-xs uppercase`}>{v.status}</td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <Link href={`/fleet/${v.id}/edit`} className="p-2 bg-gray-800 hover:bg-purple-500 text-gray-300 hover:text-white rounded-md transition-colors">
                        <Pencil size={14} />
                      </Link>
                      <form action={deleteVessel.bind(null, v.id)}>
                        <button type="submit" className="p-2 bg-gray-800 hover:bg-red-500 text-gray-300 hover:text-white rounded-md transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
               )
            })}
            {vessels.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gray-500">No vessels found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination totalPages={totalPages} currentPage={currentPage} />
    </div>
  );
}

// --------------------- FORMAT 4: CHART ---------------------
async function FleetChart({ query }: { query: string }) {
  const { vessels } = await getVessels(query, 1, 1000); 

  const statusCounts: Record<string, number> = {};
  vessels.forEach((v: any) => {
    statusCounts[v.status] = (statusCounts[v.status] || 0) + 1;
  });

  const statuses = ["ACTIVE", "MAINTENANCE", "DOCKED"];
  const maxCount = Math.max(...statuses.map(s => statusCounts[s] || 0), 1); 

  return (
    <div className="w-full bg-[#14151a] border border-white/5 rounded-xl p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-4">
        <BarChart2 className="text-purple-400" size={24} />
        <h2 className="text-xl font-bold tracking-wider">FLEET STATUS OVERVIEW</h2>
      </div>

      {vessels.length === 0 ? (
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
            if (status === "ACTIVE") color = "bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]";
            else if (status === "MAINTENANCE") color = "bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]";
            else if (status === "DOCKED") color = "bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]";

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

function FleetListSkeleton() {
  return (
    <div className="w-full py-24 flex flex-col items-center justify-center space-y-5">
      <Loader2 size={48} className="text-[#a155f7] animate-spin" />
      <p className="text-[#a155f7] font-mono font-bold tracking-widest text-sm animate-pulse">LOADING FLEET DATA...</p>
    </div>
  );
}
