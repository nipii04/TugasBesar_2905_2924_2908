"use client";

import { Package, ArrowLeft, PlusCircle } from "lucide-react";
import Link from "next/link";
import { addShipment } from "../actions";
import { useRef, useState } from "react";

export default function AddShipmentPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    try {
      await addShipment(formData);
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-white/5 pb-4">
        <Link href="/shipments" className="p-2 bg-[#17181f] text-gray-400 hover:text-white rounded-lg transition-colors border border-transparent hover:border-white/10">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-wider mb-1">ADD NEW SHIPMENT</h1>
          <p className="text-gray-500 font-mono text-sm">Register a new cargo package into the system</p>
        </div>
      </div>

      {/* Form Container */}
      <div className="bg-[#111115] border border-white/5 rounded-xl p-6 sm:p-8">
        
        <form ref={formRef} action={handleSubmit} className="space-y-6">
          
          {/* Tracking Number Note */}
          <div className="bg-[#17181f] p-4 rounded-lg border border-purple-500/20 flex gap-3 items-start">
            <Package className="text-purple-400 mt-0.5" size={18} />
            <div>
              <p className="text-sm font-bold text-gray-200">Automatic Tracking Number</p>
              <p className="text-xs text-gray-500 font-mono mt-1">A unique TRK-XXXXXX number will be generated automatically upon submission.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Origin */}
            <div className="space-y-2">
              <label htmlFor="origin" className="text-xs font-bold text-gray-400 tracking-wider">ORIGIN</label>
              <input 
                id="origin"
                name="origin" 
                type="text" 
                required
                placeholder="e.g. Jakarta, Indonesia" 
                className="w-full bg-[#14151a] border border-white/5 focus:border-purple-500/50 rounded-lg px-4 py-3 text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none transition-colors"
              />
            </div>

            {/* Destination */}
            <div className="space-y-2">
              <label htmlFor="destination" className="text-xs font-bold text-gray-400 tracking-wider">DESTINATION</label>
              <input 
                id="destination"
                name="destination" 
                type="text" 
                required
                placeholder="e.g. Singapore" 
                className="w-full bg-[#14151a] border border-white/5 focus:border-purple-500/50 rounded-lg px-4 py-3 text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none transition-colors"
              />
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label htmlFor="status" className="text-xs font-bold text-gray-400 tracking-wider">INITIAL STATUS</label>
              <select 
                id="status"
                name="status"
                required
                className="w-full bg-[#14151a] border border-white/5 focus:border-purple-500/50 rounded-lg px-4 py-3 text-sm text-gray-200 focus:outline-none transition-colors appearance-none"
              >
                <option value="PORT CLEARANCE">PORT CLEARANCE</option>
                <option value="ON SCHEDULE">ON SCHEDULE</option>
                <option value="IN TRANSIT">IN TRANSIT</option>
              </select>
            </div>

            {/* Cargo Type */}
            <div className="space-y-2">
              <label htmlFor="cargoType" className="text-xs font-bold text-gray-400 tracking-wider">CARGO TYPE</label>
              <input 
                id="cargoType"
                name="cargoType" 
                type="text" 
                required
                placeholder="e.g. Electronics, Textiles, General" 
                className="w-full bg-[#14151a] border border-white/5 focus:border-purple-500/50 rounded-lg px-4 py-3 text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none transition-colors"
              />
            </div>

            {/* Weight */}
            <div className="space-y-2">
              <label htmlFor="weight" className="text-xs font-bold text-gray-400 tracking-wider">WEIGHT (KG)</label>
              <input 
                id="weight"
                name="weight" 
                type="number"
                step="0.01" 
                placeholder="0.00" 
                className="w-full bg-[#14151a] border border-white/5 focus:border-purple-500/50 rounded-lg px-4 py-3 text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none transition-colors"
              />
            </div>

            {/* Estimated Arrival */}
            <div className="space-y-2">
              <label htmlFor="estArrival" className="text-xs font-bold text-gray-400 tracking-wider">ESTIMATED ARRIVAL (ETA)</label>
              <input 
                id="estArrival"
                name="estArrival" 
                type="date" 
                required
                className="w-full bg-[#14151a] border border-white/5 focus:border-purple-500/50 rounded-lg px-4 py-3 text-sm text-gray-200 focus:outline-none transition-colors style-date-picker"
              />
            </div>

          </div>

          <div className="pt-4 flex justify-end">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="flex justify-center items-center gap-2 bg-[#a155f7] hover:bg-purple-600 disabled:opacity-50 disabled:hover:bg-[#a155f7] text-white px-8 py-3 rounded-lg text-sm font-bold tracking-widest uppercase transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)]"
            >
              <PlusCircle size={18} />
              {isSubmitting ? "Saving..." : "Save Shipment"}
            </button>
          </div>

        </form>
      </div>

      <style jsx global>{`
        .style-date-picker::-webkit-calendar-picker-indicator {
          filter: invert(1);
          opacity: 0.5;
          cursor: pointer;
        }
        .style-date-picker::-webkit-calendar-picker-indicator:hover {
          opacity: 0.8;
        }
      `}</style>

    </div>
  );
}
