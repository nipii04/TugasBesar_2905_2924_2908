"use client";

import { Search } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTransition, useState, useEffect } from "react";

export function SearchInput({ placeholder }: { placeholder: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState(searchParams.get("query") || "");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      startTransition(() => {
        const params = new URLSearchParams(searchParams);
        if (query) {
          params.set("query", query);
          params.set("page", "1"); // reset to page 1 on search
        } else {
          params.delete("query");
        }
        router.replace(`${pathname}?${params.toString()}`);
      });
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query, pathname, router, searchParams]);

  return (
    <div className="relative w-full md:w-[480px]">
      <Search size={16} className={`absolute left-4 top-1/2 -translate-y-1/2 ${isPending ? "text-purple-400 animate-pulse" : "text-gray-500"}`} />
      <input 
        type="text" 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#17181f] border border-transparent focus:border-purple-500/50 rounded-lg pl-10 pr-4 py-2.5 text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none transition-colors"
      />
    </div>
  );
}
