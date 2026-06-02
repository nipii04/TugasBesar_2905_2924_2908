"use client";

import { addGood } from "../actions";
import Link from "next/link";
import { ArrowLeft, Box, CheckCircle2 } from "lucide-react";
import { useRef, useState } from "react";

export default function AddGoodPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    setIsSuccess(false);
    setError("");

    const name = formData.get("name")?.toString().trim();
    if (!name) {
      setError("Form tidak lengkap: Nama barang harus diisi.");
      setIsSubmitting(false);
      return;
    }

    try {
      await addGood(formData);
      setIsSuccess(true);
      formRef.current?.reset();
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error: any) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/goods" className="p-2 bg-[#17181f] text-gray-400 hover:text-white rounded-lg transition-colors border border-transparent hover:border-white/10">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-wider mb-0.5">ADD GOOD</h1>
          <p className="text-gray-500 font-mono text-xs">Register a new good/cargo type</p>
        </div>
      </div>

      <div className="bg-[#14151a] border border-white/5 rounded-xl p-6 shadow-xl">
        
        {isSuccess && (
          <div className="mb-6 flex items-center gap-2 p-4 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg text-sm font-bold font-mono tracking-wide">
            <CheckCircle2 size={18} className="shrink-0" />
            <p>Data barang berhasil ditambahkan!</p>
          </div>
        )}
        
        {error && (
          <div className="mb-6 flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm font-bold font-mono tracking-wide">
            <p>{error}</p>
          </div>
        )}

        <form ref={formRef} action={handleSubmit} className="space-y-5">
          
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 tracking-wider">GOOD NAME</label>
            <input 
              type="text" 
              name="name" 
              required
              placeholder="e.g. Electronic Parts"
              className="w-full bg-[#17181f] border border-white/5 focus:border-purple-500/50 rounded-lg px-4 py-2.5 text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 tracking-wider">TYPE / CATEGORY</label>
            <select 
              name="type" 
              required
              className="w-full bg-[#17181f] border border-white/5 focus:border-purple-500/50 rounded-lg px-4 py-2.5 text-sm text-gray-200 focus:outline-none transition-colors appearance-none"
            >
              <option value="General">General</option>
              <option value="Perishable">Perishable</option>
              <option value="Hazardous">Hazardous</option>
              <option value="Fragile">Fragile</option>
              <option value="Heavy Machinery">Heavy Machinery</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 tracking-wider">DESCRIPTION (OPTIONAL)</label>
            <textarea 
              name="description" 
              rows={4}
              placeholder="Provide more details about this good..."
              className="w-full bg-[#17181f] border border-white/5 focus:border-purple-500/50 rounded-lg px-4 py-2.5 text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none transition-colors resize-none"
            ></textarea>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Link 
              href="/goods"
              className="px-5 py-2.5 rounded-lg text-sm font-bold tracking-widest text-gray-400 hover:text-white bg-[#17181f] hover:bg-[#1f2029] transition-colors"
            >
              BACK TO LIST
            </Link>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-[#a155f7] disabled:opacity-50 hover:bg-purple-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold tracking-widest transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)]"
            >
              <Box size={16} />
              {isSubmitting ? "SAVING..." : "SAVE GOOD"}
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}
