"use client";

import { addVessel } from "../actions";
import Link from "next/link";
import { ArrowLeft, Ship, CheckCircle2 } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { getRoutes } from "@/app/(dashboard)/routes/actions";

type VesselErrors = { name?: string; capacity?: string; buildYear?: string; routeId?: string; general?: string };

export default function AddVesselPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<VesselErrors>({});
  const [autoKey, setAutoKey] = useState("");
  const [routes, setRoutes] = useState<any[]>([]);

  // Generate random VSL-XXXX code and fetch routes on mount
  useEffect(() => {
    setAutoKey(`VSL-${Math.random().toString(36).substring(2, 6).toUpperCase()}`);
    getRoutes(1, 100).then(data => setRoutes(data.routes)).catch(console.error);
  }, []);

  const clearErr = (field: keyof VesselErrors) =>
    setErrors((p) => ({ ...p, [field]: undefined }));

  async function handleSubmit(formData: FormData) {
    const name = formData.get("name")?.toString().trim();
    const capacity = formData.get("capacity")?.toString().trim();
    const routeId = formData.get("routeId")?.toString().trim();

    const buildYearRaw = formData.get("buildYear")?.toString().trim();
    const currentYear = new Date().getFullYear();

    const newErrors: VesselErrors = {};
    if (!name) newErrors.name = "Vessel name is required.";
    if (!routeId) newErrors.routeId = "Shipping route must be selected.";
    const cap = parseFloat(capacity || "");
    if (!capacity) newErrors.capacity = "Capacity is required.";
    else if (isNaN(cap) || cap <= 0) newErrors.capacity = "Capacity must be a positive number.";
    if (buildYearRaw) {
      const yr = parseInt(buildYearRaw, 10);
      if (isNaN(yr) || yr < 1900 || yr > currentYear)
        newErrors.buildYear = `Build year must be between 1900 and ${currentYear}.`;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setIsSuccess(false);
    setErrors({});
    try {
      await addVessel(formData);
      setIsSuccess(true);
      formRef.current?.reset();
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error: any) {
      setErrors({ general: error.message || "Failed to add vessel." });
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputClass = (field: keyof VesselErrors) =>
    `w-full bg-[#17181f] border rounded-lg px-4 py-2.5 text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none transition-colors ${
      errors[field] ? "border-red-500/60 focus:border-red-500" : "border-white/5 focus:border-purple-500/50"
    }`;

  const clearBuildYearErr = () => setErrors((p) => ({ ...p, buildYear: undefined }));

  const FieldError = ({ field }: { field: keyof VesselErrors }) =>
    errors[field] ? (
      <p className="text-red-400 text-[11px] font-mono mt-1 flex items-center gap-1">
        <span className="text-red-500">✕</span> {errors[field]}
      </p>
    ) : null;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/fleet" className="p-2 bg-[#17181f] text-gray-400 hover:text-white rounded-lg transition-colors border border-transparent hover:border-white/10">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-wider mb-0.5">ADD VESSEL</h1>
          <p className="text-gray-500 font-mono text-xs">Register a new vessel to the fleet</p>
        </div>
      </div>

      <div className="bg-[#14151a] border border-white/5 rounded-xl p-6 shadow-xl">
        {isSuccess && (
          <div className="mb-6 flex items-center gap-2 p-4 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg text-sm font-bold font-mono tracking-wide">
            <CheckCircle2 size={18} className="shrink-0" />
            <p>Vessel added successfully!</p>
          </div>
        )}
        {errors.general && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs font-mono">
            {errors.general}
          </div>
        )}

        <form ref={formRef} action={handleSubmit} className="space-y-5" noValidate>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 tracking-wider">
              VESSEL NAME <span className="text-red-500">*</span>
            </label>
            <input type="text" name="name" placeholder="e.g. MV Ocean Explorer"
              onChange={() => clearErr("name")} className={inputClass("name")} />
            <FieldError field="name" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 tracking-wider">VESSEL TYPE</label>
              <select name="type" className="w-full bg-[#17181f] border border-white/5 focus:border-purple-500/50 rounded-lg px-4 py-2.5 text-sm text-gray-200 focus:outline-none transition-colors appearance-none">
                <option value="Container Ship">Container Ship</option>
                <option value="Bulk Carrier">Bulk Carrier</option>
                <option value="Tanker">Tanker</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 tracking-wider">STATUS</label>
              <select name="status" className="w-full bg-[#17181f] border border-white/5 focus:border-purple-500/50 rounded-lg px-4 py-2.5 text-sm text-gray-200 focus:outline-none transition-colors appearance-none">
                <option value="ACTIVE">ACTIVE</option>
                <option value="MAINTENANCE">MAINTENANCE</option>
                <option value="DOCKED">DOCKED</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 tracking-wider">
                CAPACITY (KG) <span className="text-red-500">*</span>
              </label>
              <input type="number" name="capacity" min="1" placeholder="e.g. 5000"
                onChange={() => clearErr("capacity")} className={inputClass("capacity")} />
              <FieldError field="capacity" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 tracking-wider">BUILD YEAR</label>
              <input type="number" name="buildYear" min="1900" max={new Date().getFullYear()} placeholder="e.g. 2018"
                onChange={clearBuildYearErr}
                className={inputClass("buildYear")} />
              <FieldError field="buildYear" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 tracking-wider">
                ASSIGNED ROUTE <span className="text-red-500">*</span>
              </label>
              <select name="routeId" onChange={() => clearErr("routeId")} className="w-full bg-[#17181f] border border-white/5 focus:border-purple-500/50 rounded-lg px-4 py-2.5 text-sm text-gray-200 focus:outline-none transition-colors appearance-none">
                <option value="">-- Select Route --</option>
                {routes.map(r => (
                  <option key={r.id} value={r.id}>{r.originCity} → {r.destinationCity}</option>
                ))}
              </select>
              <FieldError field="routeId" />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 tracking-wider">ASSIGNED KEY</label>
              <input type="text" name="assignedKey" value={autoKey} readOnly
                className="w-full bg-[#111115] border border-white/5 rounded-lg px-4 py-2.5 text-sm text-gray-500 cursor-not-allowed uppercase" />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Link href="/fleet" className="px-5 py-2.5 rounded-lg text-sm font-bold tracking-widest text-gray-400 hover:text-white bg-[#17181f] hover:bg-[#1f2029] transition-colors">
              BACK TO LIST
            </Link>
            <button type="submit" disabled={isSubmitting}
              className="flex items-center gap-2 bg-[#a155f7] disabled:opacity-50 hover:bg-purple-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold tracking-widest transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)]">
              <Ship size={16} />
              {isSubmitting ? "SAVING..." : "SAVE VESSEL"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
