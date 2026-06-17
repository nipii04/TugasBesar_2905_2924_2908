"use client";

import { updateVessel } from "../../actions";
import Link from "next/link";
import { ArrowLeft, Ship } from "lucide-react";
import { useState } from "react";

type VesselErrors = { name?: string; capacity?: string; buildYear?: string; general?: string };

interface Props {
  vessel: { id: string; name: string; type: string; status: string; capacity: number; buildYear?: number | null; assignedKey?: string | null };
}

export default function EditVesselClient({ vessel }: Props) {
  const [errors, setErrors] = useState<VesselErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const clearErr = (field: keyof VesselErrors) =>
    setErrors((p) => ({ ...p, [field]: undefined }));

  const clearBuildYearErr = () => setErrors((p) => ({ ...p, buildYear: undefined }));

  async function handleSubmit(formData: FormData) {
    const name     = formData.get("name")?.toString().trim();
    const capacity = formData.get("capacity")?.toString().trim();
    const buildYearRaw = formData.get("buildYear")?.toString().trim();
    const currentYear = new Date().getFullYear();

    const newErrors: VesselErrors = {};
    if (!name) newErrors.name = "Nama kapal wajib diisi.";
    const cap = parseFloat(capacity || "");
    if (!capacity) newErrors.capacity = "Kapasitas wajib diisi.";
    else if (isNaN(cap) || cap <= 0) newErrors.capacity = "Kapasitas harus berupa angka positif (lebih dari 0).";
    if (buildYearRaw) {
      const yr = parseInt(buildYearRaw, 10);
      if (isNaN(yr) || yr < 1900 || yr > currentYear)
        newErrors.buildYear = `Tahun pembuatan harus antara 1900 dan ${currentYear}.`;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});
    try {
      await updateVessel(vessel.id, formData);
    } catch (err: any) {
      setErrors({ general: err.message || "Gagal mengupdate data kapal." });
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputClass = (field: keyof VesselErrors) =>
    `w-full bg-[#17181f] border rounded-lg px-4 py-2.5 text-sm text-gray-200 focus:outline-none transition-colors ${
      errors[field] ? "border-red-500/60 focus:border-red-500" : "border-white/5 focus:border-purple-500/50"
    }`;

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
          <h1 className="text-2xl font-bold tracking-wider mb-0.5">EDIT VESSEL</h1>
          <p className="text-gray-500 font-mono text-xs">Update vessel details: {vessel.name}</p>
        </div>
      </div>

      <div className="bg-[#14151a] border border-white/5 rounded-xl p-6 shadow-xl">
        {errors.general && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs font-mono">
            {errors.general}
          </div>
        )}

        <form action={handleSubmit} className="space-y-5" noValidate>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 tracking-wider">
              VESSEL NAME <span className="text-red-500">*</span>
            </label>
            <input type="text" name="name" defaultValue={vessel.name}
              onChange={() => clearErr("name")} className={inputClass("name")} />
            <FieldError field="name" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 tracking-wider">VESSEL TYPE</label>
              <select name="type" defaultValue={vessel.type}
                className="w-full bg-[#17181f] border border-white/5 focus:border-purple-500/50 rounded-lg px-4 py-2.5 text-sm text-gray-200 focus:outline-none transition-colors appearance-none">
                <option value="Container Ship">Container Ship</option>
                <option value="Bulk Carrier">Bulk Carrier</option>
                <option value="Oil Tanker">Oil Tanker</option>
                <option value="General Cargo">General Cargo</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 tracking-wider">STATUS</label>
              <select name="status" defaultValue={vessel.status}
                className="w-full bg-[#17181f] border border-white/5 focus:border-purple-500/50 rounded-lg px-4 py-2.5 text-sm text-gray-200 focus:outline-none transition-colors appearance-none">
                <option value="ACTIVE">ACTIVE</option>
                <option value="MAINTENANCE">MAINTENANCE</option>
                <option value="DOCKED">DOCKED</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 tracking-wider">
                CAPACITY (UNITS/TEU) <span className="text-red-500">*</span>
              </label>
              <input type="number" name="capacity" defaultValue={vessel.capacity} min="1"
                onChange={() => clearErr("capacity")} className={inputClass("capacity")} />
              <FieldError field="capacity" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 tracking-wider">BUILD YEAR</label>
              <input type="number" name="buildYear" defaultValue={vessel.buildYear || ""} min="1900" max={new Date().getFullYear()}
                onChange={clearBuildYearErr}
                className={inputClass("buildYear")} />
              <FieldError field="buildYear" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 tracking-wider">ASSIGNED KEY (OPTIONAL)</label>
            <input type="text" name="assignedKey" defaultValue={vessel.assignedKey || ""}
              className="w-full bg-[#17181f] border border-white/5 focus:border-purple-500/50 rounded-lg px-4 py-2.5 text-sm text-gray-200 focus:outline-none transition-colors" />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Link href="/fleet" className="px-5 py-2.5 rounded-lg text-sm font-bold tracking-widest text-gray-400 hover:text-white bg-[#17181f] hover:bg-[#1f2029] transition-colors">
              CANCEL
            </Link>
            <button type="submit" disabled={isSubmitting}
              className="flex items-center gap-2 bg-[#a155f7] disabled:opacity-50 hover:bg-purple-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold tracking-widest transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)]">
              <Ship size={16} />
              {isSubmitting ? "SAVING..." : "UPDATE VESSEL"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
