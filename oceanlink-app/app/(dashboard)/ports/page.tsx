import { MapPin, Edit2, Trash2, Plus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { getPorts, deletePort } from "./actions";
import { SearchInput } from "@/components/SearchInput";
import { Pagination } from "@/components/Pagination";

export default async function PortsManagement(props: { searchParams: Promise<{ query?: string; page?: string }> }) {
  const searchParams = await props.searchParams;
  const query = searchParams.query || "";
  const currentPage = Number(searchParams.page) || 1;

  return (
    <div className="w-full space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-wider mb-1">PORT TERMINALS</h1>
          <p className="text-gray-500 font-mono text-sm">Manage origins and destinations</p>
        </div>
        <Link 
          href="/ports/add" 
          className="flex items-center gap-2 bg-[#a155f7] hover:bg-purple-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold tracking-widest uppercase transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)]"
        >
          <Plus size={18} />
          Add Port
        </Link>
      </div>

      <div className="bg-[#14151a] border border-white/5 rounded-xl overflow-hidden flex flex-col">
        
        <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#111115]">
          <h2 className="text-lg font-bold tracking-wider">REGISTERED PORTS</h2>
          <SearchInput placeholder="Search ports by name, code, city..." />
        </div>

        <Suspense key={query + currentPage} fallback={<PortsTableSkeleton />}>
          <PortsTable query={query} currentPage={currentPage} />
        </Suspense>

      </div>

    </div>
  );
}

async function PortsTable({ query, currentPage }: { query: string, currentPage: number }) {
  // Tambahan delay buatan agar animasi Suspense terlihat saat demo
  await new Promise((resolve) => setTimeout(resolve, 500));

  const { ports, total, totalPages } = await getPorts(query, currentPage, 10);

  return (
    <div className="flex-1 flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="text-[10px] text-gray-500 uppercase tracking-widest font-mono border-b border-white/5 bg-[#17181f]/40">
              <th className="font-semibold p-4">Port Name</th>
              <th className="font-semibold p-4">Code</th>
              <th className="font-semibold p-4">Location</th>
              <th className="font-semibold p-4">Registered</th>
              <th className="font-semibold p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-xs text-gray-300">
            {ports.map((port) => (
              <tr key={port.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                
                <td className="p-4 flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
                    <MapPin size={16} />
                  </div>
                  <span className="font-bold text-gray-200">{port.name}</span>
                </td>
                
                <td className="p-4">
                  <span className="px-2 py-1 bg-white/5 text-gray-300 text-[10px] font-bold rounded border border-white/10 tracking-widest uppercase font-mono">
                    {port.code}
                  </span>
                </td>
                
                <td className="p-4">
                  <span className="text-gray-300">{port.city}</span>
                  <span className="text-gray-500 mx-1">,</span>
                  <span className="text-gray-400">{port.country}</span>
                </td>
                
                <td className="p-4 text-gray-500 font-mono text-[10px]">
                  {port.createdAt.toLocaleDateString()}
                </td>

                <td className="p-4 text-right">
                  <div className="flex flex-row justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link href={`/ports/${port.id}/edit`} className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors">
                      <Edit2 size={14}/>
                    </Link>
                    <form action={async () => {
                      "use server";
                      await deletePort(port.id);
                    }}>
                      <button type="submit" className="p-1.5 hover:bg-red-500/20 rounded text-gray-400 hover:text-red-400 transition-colors">
                        <Trash2 size={14}/>
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}

            {ports.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500 font-mono text-sm">
                  No ports found.
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

function PortsTableSkeleton() {
  return (
    <div className="w-full py-16 flex flex-col items-center justify-center space-y-4">
      <div className="w-12 h-12 border-4 border-[#a155f7]/30 border-t-[#a155f7] rounded-full animate-spin"></div>
      <p className="text-[#a155f7] font-mono font-bold tracking-widest text-sm animate-pulse">MEMUAT DATA PELABUHAN...</p>
    </div>
  );
}
