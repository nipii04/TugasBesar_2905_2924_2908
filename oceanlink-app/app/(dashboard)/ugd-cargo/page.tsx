import { getCargos, getVessels } from "./actions";
import CargoClient from "./CargoClient";
import { Package } from "lucide-react";

export default async function UgdCargoPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams;
  const search = typeof resolvedParams.search === "string" ? resolvedParams.search : undefined;

  const [cargosResponse, vesselsResponse] = await Promise.all([
    getCargos(search),
    getVessels()
  ]);

  const cargos = cargosResponse.success ? cargosResponse.data : [];
  const vessels = vesselsResponse.success ? vesselsResponse.data : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Package className="text-purple-400" /> UGD Cargo Administration
          </h1>
          <p className="text-sm text-gray-400">
            CRUDS Management (Darat, Udara, Laut)
          </p>
        </div>
      </div>

      <CargoClient 
        initialCargos={cargos as any[]} 
        vessels={vessels as any[]} 
        searchQuery={search || ""} 
      />
    </div>
  );
}
