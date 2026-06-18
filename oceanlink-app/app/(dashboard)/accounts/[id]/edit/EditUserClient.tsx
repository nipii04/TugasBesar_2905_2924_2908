"use client";

import { updateUser } from "../../actions";
import Link from "next/link";
import { ArrowLeft, UserCheck } from "lucide-react";
import { useState } from "react";

type UserErrors = { name?: string; username?: string; general?: string };

interface Props {
  user: { id: string; name: string; username: string; role: string };
}

export default function EditUserClient({ user }: Props) {
  const [errors, setErrors] = useState<UserErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const clearErr = (field: keyof UserErrors) =>
    setErrors((p) => ({ ...p, [field]: undefined }));

  async function handleSubmit(formData: FormData) {
    const name     = formData.get("name")?.toString().trim();
    const username = formData.get("username")?.toString().trim();

    const newErrors: UserErrors = {};
    if (!name)     newErrors.name     = "Nama lengkap wajib diisi.";
    if (!username) newErrors.username = "Username wajib diisi.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});
    try {
      await updateUser(user.id, formData);
    } catch (err: any) {
      setErrors({ general: err.message || "Gagal mengupdate akun." });
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputClass = (field: keyof UserErrors) =>
    `w-full bg-[#17181f] border rounded-lg px-4 py-2.5 text-sm text-gray-200 focus:outline-none transition-colors ${
      errors[field] ? "border-red-500/60 focus:border-red-500" : "border-white/5 focus:border-purple-500/50"
    }`;

  const FieldError = ({ field }: { field: keyof UserErrors }) =>
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
          <h1 className="text-2xl font-bold tracking-wider mb-0.5">EDIT USER</h1>
          <p className="text-gray-500 font-mono text-xs">Update details for: {user.name}</p>
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
              FULL NAME <span className="text-red-500">*</span>
            </label>
            <input type="text" name="name" defaultValue={user.name}
              onChange={() => clearErr("name")} className={inputClass("name")} />
            <FieldError field="name" />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 tracking-wider">
              USERNAME <span className="text-red-500">*</span>
            </label>
            <input type="text" name="username" defaultValue={user.username}
              onChange={() => clearErr("username")} className={inputClass("username")} />
            <FieldError field="username" />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 tracking-wider">ROLE</label>
            <select name="role" defaultValue={user.role}
              className="w-full bg-[#17181f] border border-white/5 focus:border-purple-500/50 rounded-lg px-4 py-2.5 text-sm text-gray-200 focus:outline-none transition-colors appearance-none">
              <option value="Admin">Admin</option>
              <option value="Fleet Superintendent">Fleet Superintendent</option>
              <option value="Customer">Pelanggan</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 tracking-wider">NEW PASSWORD (OPTIONAL)</label>
            <input type="password" name="password" placeholder="Leave blank to keep current password"
              className="w-full bg-[#17181f] border border-white/5 focus:border-purple-500/50 rounded-lg px-4 py-2.5 text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none transition-colors" />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Link href="/accounts" className="px-5 py-2.5 rounded-lg text-sm font-bold tracking-widest text-gray-400 hover:text-white bg-[#17181f] hover:bg-[#1f2029] transition-colors">
              CANCEL
            </Link>
            <button type="submit" disabled={isSubmitting}
              className="flex items-center gap-2 bg-[#a155f7] disabled:opacity-50 hover:bg-purple-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold tracking-widest transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)]">
              <UserCheck size={16} />
              {isSubmitting ? "SAVING..." : "UPDATE USER"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
