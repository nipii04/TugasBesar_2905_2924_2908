"use client";

import { Ship, Search, Filter, LayoutGrid, List } from "lucide-react";

export default function FleetManagement() {
  
  const vessels = [
    { id: "VS001", name: "MV Ocean Navigator", status: "ACTIVE", type: "Container Ship", captain: "Capt. Ahmad Yusuf", capacity: "8,000 TEU", built: "2018", fuel: 78, location: "Pacific Ocean", color: "green" },
    { id: "VS002", name: "MV Maritime Explorer", status: "IN PORT", type: "Bulk Carrier", captain: "Capt. Sarah Lee", capacity: "75,000 DWT", built: "2020", fuel: 92, location: "Port of Singapore", color: "blue" },
    { id: "VS003", name: "MV Pacific Voyager", status: "DELAYED", type: "Container Ship", captain: "Capt. Michael Chen", capacity: "6,500 TEU", built: "2017", fuel: 45, location: "Indian Ocean", color: "yellow" },
    { id: "VS004", name: "MV Stellar Carrier", status: "MAINTENANCE", type: "Oil Tanker", captain: "Capt. David Wong", capacity: "150,000 DWT", built: "2015", fuel: 100, location: "Port of Jakarta", color: "red" },
    { id: "VS005", name: "MV Global Pioneer", status: "ACTIVE", type: "Container Ship", captain: "Capt. Robert Kim", capacity: "9,200 TEU", built: "2021", fuel: 67, location: "South China Sea", color: "green" },
    { id: "VS006", name: "MV Horizon Trader", status: "ACTIVE", type: "Bulk Carrier", captain: "Capt. James Park", capacity: "82,000 DWT", built: "2019", fuel: 81, location: "Arabian Sea", color: "green" },
    { id: "VS007", name: "MV Sea Dragon", status: "IN PORT", type: "Container Ship", captain: "Capt. Lisa Wang", capacity: "7,800 TEU", built: "2020", fuel: 95, location: "Port of Tokyo", color: "blue" },
    { id: "VS008", name: "MV Atlantic Wave", status: "ACTIVE", type: "Oil Tanker", captain: "Capt. Mohammed Ali", capacity: "120,000 DWT", built: "2016", fuel: 58, location: "Bay of Bengal", color: "green" },
    { id: "VS009", name: "MV Neptune Star", status: "ACTIVE", type: "Container Ship", captain: "Capt. Emma Brown", capacity: "10,500 TEU", built: "2022", fuel: 88, location: "East China Sea", color: "green" },
    { id: "VS010", name: "MV Cargo Master", status: "IN PORT", type: "General Cargo", captain: "Capt. John Smith", capacity: "25,000 DWT", built: "2014", fuel: 72, location: "Port of Shanghai", color: "blue" },
    { id: "VS011", name: "MV Blue Horizon", status: "ACTIVE", type: "Bulk Carrier", captain: "Capt. Abdul Rahman", capacity: "90,000 DWT", built: "2021", fuel: 76, location: "Malacca Strait", color: "green" },
    { id: "VS012", name: "MV Thunder Bay", status: "DELAYED", type: "Container Ship", captain: "Capt. Kevin Tan", capacity: "8,500 TEU", built: "2018", fuel: 34, location: "Java Sea", color: "yellow" },
  ];

  return (
    <div className="w-full space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-wider mb-1">FLEET MANAGEMENT</h1>
        <p className="text-gray-500 font-mono text-sm">Complete vessel inventory and details</p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-[#111115] p-3 rounded-xl border border-white/5">
        <div className="relative w-full md:w-[480px]">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search by vessel name, captain, or ID..." 
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
        Showing <span className="text-white font-bold">12</span> of <span className="text-white font-bold">12</span> vessels
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        
        {vessels.map((v) => (
          <div key={v.id} className="bg-[#14151a] border border-white/5 rounded-xl hover:border-purple-500/30 transition-all group overflow-hidden flex flex-col">
            
            {/* Card Header */}
            <div className="p-5 border-b border-white/5 flex justify-between items-start">
              <div className="flex gap-3">
                <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg h-fit">
                  <Ship size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-200 leading-tight mb-0.5">{v.name}</h3>
                  <p className="text-[10px] text-gray-500 font-mono tracking-widest">{v.id}</p>
                </div>
              </div>
              
              {v.color === 'green' && (
                <div className="px-2.5 py-1 text-[9px] font-bold text-green-400 bg-green-500/10 border border-green-500/20 rounded-full tracking-wider">{v.status}</div>
              )}
              {v.color === 'blue' && (
                <div className="px-2.5 py-1 text-[9px] font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-full tracking-wider">{v.status}</div>
              )}
              {v.color === 'yellow' && (
                <div className="px-2.5 py-1 text-[9px] font-bold text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 rounded-full tracking-wider">{v.status}</div>
              )}
              {v.color === 'red' && (
                <div className="px-2.5 py-1 text-[9px] font-bold text-red-500 bg-red-500/10 border border-red-500/20 rounded-full tracking-wider">{v.status}</div>
              )}
            </div>

            {/* Card Body */}
            <div className="p-5 space-y-3 flex-1 text-xs text-gray-400 font-mono">
              <div className="flex justify-between">
                <span className="text-gray-600">Type:</span> 
                <span className="text-gray-300">{v.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Captain:</span> 
                <span className="text-gray-300">{v.captain}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Capacity:</span> 
                <span className="text-gray-300">{v.capacity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Built:</span> 
                <span className="text-gray-300">{v.built}</span>
              </div>
            </div>

            {/* Fuel Bar */}
            <div className="px-5 pb-5">
              <div className="flex justify-between text-[10px] text-gray-500 font-mono mb-2">
                <span>Fuel Level</span>
                <span className="text-gray-300">{v.fuel}%</span>
              </div>
              <div className="w-full h-1.5 bg-[#1f2029] rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all ${
                    v.color === 'yellow' ? 'bg-yellow-500' : 'bg-[#ab5ff7]'
                  }`} 
                  style={{ width: `${v.fuel}%` }}
                ></div>
              </div>
            </div>

            {/* Card Footer Location */}
            <div className="p-4 border-t border-white/5 bg-[#111115] text-[10px] font-mono text-gray-500">
               Current Location: <span className="text-gray-400">{v.location}</span>
            </div>

          </div>
        ))}

      </div>

    </div>
  );
}
