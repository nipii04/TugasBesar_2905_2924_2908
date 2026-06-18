import { Suspense } from "react";
import Link from "next/link";
import { getRoutes, deleteRoute } from "./actions";
import { Pagination } from "@/components/Pagination";
import { MapPin, Plus, Loader2, Trash2, Pen } from "lucide-react";

export default async function RoutesPage(props: { searchParams: Promise<{ page?: string }> }) {
  const searchParams = await props.searchParams;
  const currentPage = Number(searchParams.page) || 1;

  return (
    <div className="w-full space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-wider mb-1">SHIPPING ROUTES</h1>
          <p className="text-gray-500 font-mono text-sm">Manage predefined origin and destination pairs</p>
        </div>
        <Link href="/routes/add" className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-sm font-bold tracking-widest border border-blue-500/30 transition-colors">
          <Plus size={16} />
          ADD ROUTE
        </Link>
      </div>

      <div className="bg-[#14151a] border border-white/5 rounded-xl overflow-hidden flex flex-col">
        <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#111115]">
          <h2 className="text-lg font-bold tracking-wider flex items-center gap-2">
            <MapPin size={18} className="text-blue-400" />
            ROUTE MASTER DATA
          </h2>
        </div>

        <Suspense key={currentPage} fallback={<RoutesTableSkeleton />}>
          <RoutesTable currentPage={currentPage} />
        </Suspense>
      </div>
    </div>
  );
}

async function RoutesTable({ currentPage }: { currentPage: number }) {
  const { routes, totalPages } = await getRoutes(currentPage, 15);

  return (
    <div className="flex-1 flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="text-[10px] text-gray-500 uppercase tracking-widest font-mono border-b border-white/5 bg-[#17181f]/40">
              <th className="font-semibold p-4">Route Name</th>
              <th className="font-semibold p-4">Origin</th>
              <th className="font-semibold p-4">Destination</th>
              <th className="font-semibold p-4 text-center">Distance (Km)</th>
              <th className="font-semibold p-4 text-center">Est. Days</th>
              <th className="font-semibold p-4 text-center">Rate / Kg</th>
              <th className="font-semibold p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-xs text-gray-300">
            {routes.map((route: any) => (
              <tr key={route.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                <td className="p-4 font-bold text-blue-300">{route.name}</td>
                <td className="p-4">{route.originCity} ({route.originCountry})</td>
                <td className="p-4">{route.destinationCity} ({route.destinationCountry})</td>
                <td className="p-4 text-center text-gray-400 font-mono">{route.distanceKm ? route.distanceKm.toLocaleString() : "-"}</td>
                <td className="p-4 text-center font-bold text-gray-200">{route.estimatedDays}</td>
                <td className="p-4 text-center text-green-400 font-mono">Rp {route.baseRatePerKg?.toLocaleString("id-ID") || "-"}</td>
                <td className="p-4 text-right">
                  <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link href={`/routes/${route.id}/edit`} className="p-2 hover:bg-blue-500/20 rounded text-gray-400 hover:text-blue-400 transition-colors">
                      <Pen size={14}/>
                    </Link>
                    <form action={deleteRoute.bind(null, route.id)}>
                      <button type="submit" className="p-2 hover:bg-red-500/20 rounded text-gray-400 hover:text-red-400 transition-colors">
                        <Trash2 size={14}/>
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}

            {routes.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500 font-mono text-sm">
                  No routes found.
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

function RoutesTableSkeleton() {
  return (
    <div className="w-full py-24 flex flex-col items-center justify-center space-y-5">
      <Loader2 size={48} className="text-blue-500 animate-spin" />
      <p className="text-blue-500 font-mono font-bold tracking-widest text-sm animate-pulse">LOADING ROUTES DATA...</p>
    </div>
  );
}
