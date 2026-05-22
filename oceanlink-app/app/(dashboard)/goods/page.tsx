import { Box, Edit2, Trash2, Plus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { getGoods, deleteGood } from "./actions";
import { SearchInput } from "@/components/SearchInput";
import { Pagination } from "@/components/Pagination";

export default async function GoodsManagement(props: { searchParams: Promise<{ query?: string; page?: string }> }) {
  const searchParams = await props.searchParams;
  const query = searchParams.query || "";
  const currentPage = Number(searchParams.page) || 1;

  return (
    <div className="w-full space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-wider mb-1">GOODS MASTER DATA</h1>
          <p className="text-gray-500 font-mono text-sm">Manage types of cargo and goods</p>
        </div>
        <Link 
          href="/goods/add" 
          className="flex items-center gap-2 bg-[#a155f7] hover:bg-purple-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold tracking-widest uppercase transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)]"
        >
          <Plus size={18} />
          Add Good
        </Link>
      </div>

      <div className="bg-[#14151a] border border-white/5 rounded-xl overflow-hidden flex flex-col">
        
        <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#111115]">
          <h2 className="text-lg font-bold tracking-wider">REGISTERED GOODS</h2>
          <SearchInput placeholder="Search goods by name, type..." />
        </div>

        <Suspense key={query + currentPage} fallback={<GoodsTableSkeleton />}>
          <GoodsTable query={query} currentPage={currentPage} />
        </Suspense>

      </div>

    </div>
  );
}

async function GoodsTable({ query, currentPage }: { query: string, currentPage: number }) {
  const { goods, total, totalPages } = await getGoods(query, currentPage, 10);

  return (
    <div className="flex-1 flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="text-[10px] text-gray-500 uppercase tracking-widest font-mono border-b border-white/5 bg-[#17181f]/40">
              <th className="font-semibold p-4">Name</th>
              <th className="font-semibold p-4">Type</th>
              <th className="font-semibold p-4">Description</th>
              <th className="font-semibold p-4">Created</th>
              <th className="font-semibold p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-xs text-gray-300">
            {goods.map((good) => (
              <tr key={good.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                
                <td className="p-4 flex items-center gap-3">
                  <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg">
                    <Box size={16} />
                  </div>
                  <span className="font-bold text-gray-200">{good.name}</span>
                </td>
                
                <td className="p-4">
                  <span className="px-2 py-1 bg-white/5 text-gray-300 text-[10px] font-bold rounded border border-white/10 tracking-wider uppercase font-mono">
                    {good.type}
                  </span>
                </td>
                
                <td className="p-4 text-gray-400 max-w-xs truncate">
                  {good.description || "-"}
                </td>
                
                <td className="p-4 text-gray-500 font-mono text-[10px]">
                  {good.createdAt.toLocaleDateString()}
                </td>

                <td className="p-4 text-right">
                  <div className="flex flex-row justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link href={`/goods/${good.id}/edit`} className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors">
                      <Edit2 size={14}/>
                    </Link>
                    <form action={async () => {
                      "use server";
                      await deleteGood(good.id);
                    }}>
                      <button type="submit" className="p-1.5 hover:bg-red-500/20 rounded text-gray-400 hover:text-red-400 transition-colors">
                        <Trash2 size={14}/>
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}

            {goods.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500 font-mono text-sm">
                  No goods found.
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

function GoodsTableSkeleton() {
  return (
    <div className="p-8 space-y-4 animate-pulse">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="w-full h-12 bg-white/5 rounded-lg"></div>
      ))}
    </div>
  );
}
