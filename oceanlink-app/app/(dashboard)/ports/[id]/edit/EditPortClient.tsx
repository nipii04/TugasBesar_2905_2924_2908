"use client";

import { updatePort } from "../../actions";
import Link from "next/link";
import { ArrowLeft, MapPin } from "lucide-react";
import { useState } from "react";

type PortErrors = { name?: string; code?: string; city?: string; country?: string; general?: string };

interface Props {
  port: { id: string; name: string; code: string; city: string; country: string };
}

export default function EditPortClient({ port }: Props) {
  const [errors, setErrors] = useState<PortErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const clearErr = (field: keyof PortErrors) =>
    setErrors((p) => ({ ...p, [field]: undefined }));

  async function handleSubmit(formData: FormData) {
    const get = (k: string) => formData.get(k)?.toString().trim() ?? "";
    const newErrors: PortErrors = {};
    if (!get("name"))    newErrors.name    = "Nama pelabuhan wajib diisi.";
    if (!get("code"))    newErrors.code    = "Kode pelabuhan wajib diisi.";
    if (!get("city"))    newErrors.city    = "Kota wajib diisi.";
    if (!get("country")) newErrors.country = "Negara wajib diisi.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});
    try {
      await updatePort(port.id, formData);
    } catch (err: any) {
      setErrors({ general: err.message || "Gagal mengupdate pelabuhan." });
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputClass = (field: keyof PortErrors) =>
    `w-full bg-[#17181f] border rounded-lg px-4 py-2.5 text-sm text-gray-200 focus:outline-none transition-colors ${
      errors[field] ? "border-red-500/60 focus:border-red-500" : "border-white/5 focus:border-purple-500/50"
    }`;

  const FieldError = ({ field }: { field: keyof PortErrors }) =>
    errors[field] ? (
      <p className="text-red-400 text-[11px] font-mono mt-1 flex items-center gap-1">
        <span className="text-red-500">✕</span> {errors[field]}
      </p>
    ) : null;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/ports" className="p-2 bg-[#17181f] text-gray-400 hover:text-white rounded-lg transition-colors border border-transparent hover:border-white/10">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-wider mb-0.5">EDIT PORT</h1>
          <p className="text-gray-500 font-mono text-xs">Update details for: {port.name}</p>
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
              PORT NAME <span className="text-red-500">*</span>
            </label>
            <input type="text" name="name" defaultValue={port.name}
              onChange={() => clearErr("name")} className={inputClass("name")} />
            <FieldError field="name" />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 tracking-wider">
              PORT CODE <span className="text-red-500">*</span>
            </label>
            <input type="text" name="code" defaultValue={port.code} maxLength={5}
              onChange={() => clearErr("code")} className={`${inputClass("code")} uppercase`} />
            <FieldError field="code" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 tracking-wider">
                CITY <span className="text-red-500">*</span>
              </label>
              <input type="text" name="city" defaultValue={port.city}
                onChange={() => clearErr("city")} className={inputClass("city")} />
              <FieldError field="city" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 tracking-wider">
                COUNTRY <span className="text-red-500">*</span>
              </label>
              <input type="text" name="country" defaultValue={port.country}
                onChange={() => clearErr("country")} className={inputClass("country")} />
              <FieldError field="country" />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Link href="/ports" className="px-5 py-2.5 rounded-lg text-sm font-bold tracking-widest text-gray-400 hover:text-white bg-[#17181f] hover:bg-[#1f2029] transition-colors">
              CANCEL
            </Link>
            <button type="submit" disabled={isSubmitting}
              className="flex items-center gap-2 bg-[#a155f7] disabled:opacity-50 hover:bg-purple-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold tracking-widest transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)]">
              <MapPin size={16} />
              {isSubmitting ? "SAVING..." : "UPDATE PORT"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
