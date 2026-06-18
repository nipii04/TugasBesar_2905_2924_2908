"use client";

import Link from "next/link";
import { ArrowLeft, MapPin } from "lucide-react";
import { useRef, useState } from "react";
import { updateRoute } from "../../actions";

interface Props {
  route: any;
}

export default function EditRouteClient({ route }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ general?: string }>({});

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    setErrors({});
    
    try {
      await updateRoute(route.id, formData);
    } catch (error: any) {
      if (error.message === "NEXT_REDIRECT") throw error;
      setErrors({ general: error.message || "Failed to update route." });
      setIsSubmitting(false);
    }
  }

  const inputClass = "w-full bg-[#17181f] border border-white/5 focus:border-blue-500/50 rounded-lg px-4 py-2.5 text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none transition-colors";

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/routes" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-wider mb-1">EDIT ROUTE</h1>
          <p className="text-gray-500 font-mono text-xs">Modify predefined shipping route</p>
        </div>
      </div>

      <div className="bg-[#14151a] border border-white/5 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-white/5 flex items-center gap-3 bg-[#111115]">
          <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
            <MapPin size={18} />
          </div>
          <h2 className="text-sm font-bold tracking-widest text-gray-300">ROUTE DETAILS</h2>
        </div>

        <form ref={formRef} action={handleSubmit} className="p-6 space-y-6">
          {errors.general && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs font-mono text-center">
              {errors.general}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 tracking-wider">ROUTE NAME <span className="text-red-500">*</span></label>
              <input type="text" name="name" required defaultValue={route.name} placeholder="e.g. Jakarta - Singapore" className={inputClass} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 tracking-wider">ORIGIN CITY <span className="text-red-500">*</span></label>
                <input type="text" name="originCity" required defaultValue={route.originCity} placeholder="e.g. Jakarta" className={inputClass} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 tracking-wider">DESTINATION CITY <span className="text-red-500">*</span></label>
                <input type="text" name="destinationCity" required defaultValue={route.destinationCity} placeholder="e.g. Singapore" className={inputClass} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 tracking-wider">EST. DISTANCE (KM)</label>
                <input type="number" name="distanceKm" step="0.1" min="0" defaultValue={route.distanceKm || ''} placeholder="e.g. 900" className={inputClass} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 tracking-wider">EST. TRAVEL DAYS <span className="text-red-500">*</span></label>
                <input type="number" name="estimatedDays" required min="1" defaultValue={route.estimatedDays} placeholder="e.g. 3" className={inputClass} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 tracking-wider">BASE RATE / KG <span className="text-red-500">*</span></label>
                <input type="number" name="baseRatePerKg" required min="0" defaultValue={route.baseRatePerKg || ''} placeholder="e.g. 5000" className={inputClass} />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 flex justify-end gap-3">
            <Link href="/routes" className="px-6 py-2.5 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 text-sm font-bold tracking-widest transition-colors">
              CANCEL
            </Link>
            <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold tracking-widest transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {isSubmitting ? "SAVING..." : "UPDATE ROUTE"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
