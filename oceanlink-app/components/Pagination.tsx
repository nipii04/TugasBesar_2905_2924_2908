"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export function Pagination({ totalPages, currentPage }: { totalPages: number, currentPage: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className="flex items-center gap-2 justify-center mt-6">
      <button
        onClick={() => router.push(createPageURL(currentPage - 1))}
        disabled={currentPage <= 1}
        className="p-2 bg-[#17181f] border border-white/5 rounded-lg text-gray-400 hover:text-white disabled:opacity-50 disabled:hover:text-gray-400 transition-colors"
      >
        <ChevronLeft size={16} />
      </button>
      
      <div className="text-sm text-gray-500 font-mono flex items-center gap-2">
        <span>Page</span>
        <span className="text-white font-bold px-2 py-1 bg-[#14151a] rounded border border-white/10">{currentPage}</span>
        <span>of {totalPages}</span>
      </div>

      <button
        onClick={() => router.push(createPageURL(currentPage + 1))}
        disabled={currentPage >= totalPages}
        className="p-2 bg-[#17181f] border border-white/5 rounded-lg text-gray-400 hover:text-white disabled:opacity-50 disabled:hover:text-gray-400 transition-colors"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
