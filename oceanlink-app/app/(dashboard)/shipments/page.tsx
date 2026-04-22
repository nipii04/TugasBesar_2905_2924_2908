import { Package, Search, Filter, PlusCircle } from "lucide-react";
import Link from "next/link";
import { getShipments } from "./actions";

export default async function ShipmentsManagement() {
  const shipments = await getShipments();

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
        <div className="relative w-full md:w-[480px]">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search by tracking number, origin, or destination..." 
            className="w-full bg-[#17181f] border border-transparent focus:border-purple-500/50 rounded-lg pl-10 pr-4 py-2.5 text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none transition-colors"
          />
        </div>

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

      <div className="text-[11px] font-mono text-gray-500">
        Showing <span className="text-white font-bold">{shipments.length}</span> of <span className="text-white font-bold">{shipments.length}</span> shipments
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
            <div key={cargo.id} className="bg-[#14151a] border border-white/5 rounded-xl hover:border-purple-500/30 transition-all group overflow-hidden flex flex-col">
              
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
            <p className="font-mono text-sm">No shipments found. Click 'Add Shipment' to create one.</p>
          </div>
        )}
      </div>

    </div>
  );
}
