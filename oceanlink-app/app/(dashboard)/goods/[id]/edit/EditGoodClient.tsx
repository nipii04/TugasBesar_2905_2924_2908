"use client";

import { updateGood } from "../../actions";
import Link from "next/link";
import { ArrowLeft, Box } from "lucide-react";
import { useState } from "react";

type GoodErrors = { name?: string; general?: string };

interface Props {
  good: { id: string; name: string; type: string; description: string | null };
}

export default function EditGoodClient({ good }: Props) {
  const [errors, setErrors] = useState<GoodErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(formData: FormData) {
    const name = formData.get("name")?.toString().trim();
    if (!name) {
      setErrors({ name: "Nama barang wajib diisi." });
      return;
    }
    setIsSubmitting(true);
    setErrors({});
    try {
      await updateGood(good.id, formData);
    } catch (err: any) {
      setErrors({ general: err.message || "Gagal mengupdate data barang." });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/goods" className="p-2 bg-[#17181f] text-gray-400 hover:text-white rounded-lg transition-colors border border-transparent hover:border-white/10">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-wider mb-0.5">EDIT GOOD</h1>
          <p className="text-gray-500 font-mono text-xs">Update details for: {good.name}</p>
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
              GOOD NAME <span className="text-red-500">*</span>
            </label>
            <input type="text" name="name" defaultValue={good.name}
              onChange={() => setErrors(p => ({ ...p, name: undefined }))}
              className={`w-full bg-[#17181f] border rounded-lg px-4 py-2.5 text-sm text-gray-200 focus:outline-none transition-colors ${
                errors.name ? "border-red-500/60 focus:border-red-500" : "border-white/5 focus:border-purple-500/50"
              }`}
            />
            {errors.name && (
              <p className="text-red-400 text-[11px] font-mono mt-1 flex items-center gap-1">
                <span className="text-red-500">✕</span> {errors.name}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 tracking-wider">TYPE / CATEGORY</label>
            <select name="type" defaultValue={good.type}
              className="w-full bg-[#17181f] border border-white/5 focus:border-purple-500/50 rounded-lg px-4 py-2.5 text-sm text-gray-200 focus:outline-none transition-colors appearance-none">
              <option value="General">General</option>
              <option value="Perishable">Perishable</option>
              <option value="Hazardous">Hazardous</option>
              <option value="Fragile">Fragile</option>
              <option value="Heavy Machinery">Heavy Machinery</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 tracking-wider">DESCRIPTION (OPTIONAL)</label>
            <textarea name="description" defaultValue={good.description || ""} rows={4}
              className="w-full bg-[#17181f] border border-white/5 focus:border-purple-500/50 rounded-lg px-4 py-2.5 text-sm text-gray-200 focus:outline-none transition-colors resize-none">
            </textarea>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Link href="/goods" className="px-5 py-2.5 rounded-lg text-sm font-bold tracking-widest text-gray-400 hover:text-white bg-[#17181f] hover:bg-[#1f2029] transition-colors">
              CANCEL
            </Link>
            <button type="submit" disabled={isSubmitting}
              className="flex items-center gap-2 bg-[#a155f7] disabled:opacity-50 hover:bg-purple-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold tracking-widest transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)]">
              <Box size={16} />
              {isSubmitting ? "SAVING..." : "UPDATE GOOD"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
