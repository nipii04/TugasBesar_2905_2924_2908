"use client";

import { addUser } from "../actions";
import Link from "next/link";
import { ArrowLeft, User, CheckCircle2 } from "lucide-react";
import { useRef, useState } from "react";

type AccountErrors = { name?: string; username?: string; password?: string; general?: string };

export default function AddUserPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<AccountErrors>({});

  const clearErr = (field: keyof AccountErrors) =>
    setErrors((p) => ({ ...p, [field]: undefined }));

  async function handleSubmit(formData: FormData) {
    const name     = formData.get("name")?.toString().trim();
    const username = formData.get("username")?.toString().trim();
    const password = formData.get("password")?.toString().trim();

    const newErrors: AccountErrors = {};
    if (!name)     newErrors.name     = "Nama lengkap wajib diisi.";
    if (!username) newErrors.username = "Username wajib diisi.";
    if (!password) newErrors.password = "Password wajib diisi.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setIsSuccess(false);
    setErrors({});
    try {
      await addUser(formData);
      setIsSuccess(true);
      formRef.current?.reset();
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error: any) {
      setErrors({ general: error.message || "Gagal menambahkan akun." });
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputClass = (field: keyof AccountErrors) =>
    `w-full bg-[#17181f] border rounded-lg px-4 py-2.5 text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none transition-colors ${
      errors[field] ? "border-red-500/60 focus:border-red-500" : "border-white/5 focus:border-purple-500/50"
    }`;

  const FieldError = ({ field }: { field: keyof AccountErrors }) =>
    errors[field] ? (
      <p className="text-red-400 text-[11px] font-mono mt-1 flex items-center gap-1">
        <span className="text-red-500">✕</span> {errors[field]}
      </p>
    ) : null;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/accounts" className="p-2 bg-[#17181f] text-gray-400 hover:text-white rounded-lg transition-colors border border-transparent hover:border-white/10">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-wider mb-0.5">ADD USER</h1>
          <p className="text-gray-500 font-mono text-xs">Register a new system account</p>
        </div>
      </div>

      <div className="bg-[#14151a] border border-white/5 rounded-xl p-6 shadow-xl">
        {isSuccess && (
          <div className="mb-6 flex items-center gap-2 p-4 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg text-sm font-bold font-mono tracking-wide">
            <CheckCircle2 size={18} className="shrink-0" />
            <p>Data akun berhasil ditambahkan!</p>
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
              FULL NAME <span className="text-red-500">*</span>
            </label>
            <input type="text" name="name" placeholder="e.g. John Doe"
              onChange={() => clearErr("name")} className={inputClass("name")} />
            <FieldError field="name" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 tracking-wider">
                USERNAME <span className="text-red-500">*</span>
              </label>
              <input type="text" name="username" placeholder="e.g. johndoe"
                onChange={() => clearErr("username")} className={inputClass("username")} />
              <FieldError field="username" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 tracking-wider">
                PASSWORD <span className="text-red-500">*</span>
              </label>
              <input type="password" name="password" placeholder="Min. 6 karakter"
                onChange={() => clearErr("password")} className={inputClass("password")} />
              <FieldError field="password" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 tracking-wider">ROLE</label>
            <select name="role" className="w-full bg-[#17181f] border border-white/5 focus:border-purple-500/50 rounded-lg px-4 py-2.5 text-sm text-gray-200 focus:outline-none transition-colors appearance-none">
              <option value="Admin">Admin</option>
              <option value="Fleet Superintendent">Fleet Superintendent</option>
              <option value="Pelanggan">Pelanggan</option>
            </select>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Link href="/accounts" className="px-5 py-2.5 rounded-lg text-sm font-bold tracking-widest text-gray-400 hover:text-white bg-[#17181f] hover:bg-[#1f2029] transition-colors">
              BACK TO LIST
            </Link>
            <button type="submit" disabled={isSubmitting}
              className="flex items-center gap-2 bg-[#a155f7] disabled:opacity-50 hover:bg-purple-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold tracking-widest transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)]">
              <User size={16} />
              {isSubmitting ? "SAVING..." : "SAVE USER"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
