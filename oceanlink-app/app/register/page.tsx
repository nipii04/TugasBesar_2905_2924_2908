"use client";

import Link from "next/link";
import { ArrowLeft, Waves, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { registerUser } from "@/app/auth/actions";

type FieldErrors = {
  name?: string;
  email?: string;
  username?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
};

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    phone: "",
    company: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSuccess, setIsSuccess] = useState(false);

  const clearError = (field: keyof FieldErrors) =>
    setErrors((prev) => ({ ...prev, [field]: undefined }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: FieldErrors = {};

    if (!formData.name.trim()) newErrors.name = "Nama lengkap wajib diisi.";
    if (!formData.email.trim()) {
      newErrors.email = "Email wajib diisi.";
    } else if (!formData.email.includes("@")) {
      newErrors.email = "Format email tidak valid.";
    }
    if (!formData.username.trim()) newErrors.username = "Username wajib diisi.";
    if (!formData.password.trim()) {
      newErrors.password = "Password wajib diisi.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password minimal 6 karakter.";
    }
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Konfirmasi password wajib diisi.";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Konfirmasi password tidak cocok.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("username", formData.username);
    payload.append("password", formData.password);

    const res = await registerUser(payload);

    if (!res.success) {
      setErrors({ general: res.error || "Gagal membuat akun." });
      return;
    }

    setIsSuccess(true);
    setTimeout(() => router.push("/login"), 2000);
  };

  const inputClass = (field: keyof FieldErrors) =>
    `w-full bg-[#1b1c23] border rounded-lg px-4 py-3 text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none transition-colors ${
      errors[field]
        ? "border-red-500/60 focus:border-red-500"
        : "border-transparent focus:border-[#a155f7]/50"
    }`;

  const FieldError = ({ field }: { field: keyof FieldErrors }) =>
    errors[field] ? (
      <p className="text-red-400 text-[11px] font-mono mt-1 flex items-center gap-1">
        <span className="text-red-500">✕</span> {errors[field]}
      </p>
    ) : null;

  return (
    <div className="min-h-screen bg-[#09090c] text-white flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden font-mono sm:font-sans">

      {/* Back Button */}
      <div className="absolute top-6 left-6 z-10">
        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all text-sm font-semibold tracking-wider"
        >
          <ArrowLeft size={16} />
          <span>BACK</span>
        </Link>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-[600px] z-10 flex flex-col items-center mt-12 mb-12">

        {/* Logo & Header */}
        <div className="flex flex-col items-center mb-8 relative">
          <div className="absolute inset-0 bg-[#a155f7] rounded-full blur-[60px] opacity-20 w-32 h-32 mx-auto"></div>
          <div className="relative w-16 h-16 rounded-2xl bg-[#14121a] border border-[#a155f7]/30 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(161,85,247,0.3)]">
            <Waves className="text-[#b16ff9]" size={32} />
          </div>
          <h1 className="text-3xl font-bold tracking-widest text-[#f0f0f0] mb-2 font-mono">
            CREATE ACCOUNT
          </h1>
          <p className="text-[#6c6d75] tracking-[0.2em] text-xs font-semibold">
            JOIN OCEANLINK LOGISTICS
          </p>
        </div>

        {/* Form Container */}
        <div className="relative w-full">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[120%] bg-[#a155f7]/10 blur-[100px] rounded-full pointer-events-none"></div>

          <div className="relative bg-[#111115]/80 backdrop-blur-xl border border-white/5 p-8 rounded-2xl shadow-2xl z-10 w-full">

            <form className="space-y-5" onSubmit={handleSubmit} noValidate>

              {/* General error */}
              {errors.general && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs font-mono text-center">
                  {errors.general}
                </div>
              )}

              {/* Success */}
              {isSuccess && (
                <div className="flex items-center gap-2 p-4 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg text-sm font-bold font-mono tracking-wide">
                  <CheckCircle2 size={18} className="shrink-0" />
                  <p>Akun berhasil dibuat! Mengalihkan ke login...</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold tracking-wider text-gray-300 uppercase">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => { setFormData({ ...formData, name: e.target.value }); clearError("name"); }}
                    placeholder="John Doe"
                    className={inputClass("name")}
                  />
                  <FieldError field="name" />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold tracking-wider text-gray-300 uppercase">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => { setFormData({ ...formData, email: e.target.value }); clearError("email"); }}
                    placeholder="john@example.com"
                    className={inputClass("email")}
                  />
                  <FieldError field="email" />
                </div>

                {/* Username */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold tracking-wider text-gray-300 uppercase">
                    Username <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => { setFormData({ ...formData, username: e.target.value }); clearError("username"); }}
                    placeholder="johndoe"
                    className={inputClass("username")}
                  />
                  <FieldError field="username" />
                </div>

                {/* Phone Number (optional) */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold tracking-wider text-gray-300 uppercase">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+62 812 3456 7890"
                    className="w-full bg-[#1b1c23] border border-transparent focus:border-[#a155f7]/50 rounded-lg px-4 py-3 text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Company Name (optional) */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold tracking-wider text-gray-300 uppercase">
                  Company Name
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Your Company Ltd."
                  className="w-full bg-[#1b1c23] border border-transparent focus:border-[#a155f7]/50 rounded-lg px-4 py-3 text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Password */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold tracking-wider text-gray-300 uppercase">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => { setFormData({ ...formData, password: e.target.value }); clearError("password"); }}
                    placeholder="Min. 6 karakter"
                    className={inputClass("password")}
                  />
                  <FieldError field="password" />
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold tracking-wider text-gray-300 uppercase">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => { setFormData({ ...formData, confirmPassword: e.target.value }); clearError("confirmPassword"); }}
                    placeholder="Ulangi password"
                    className={inputClass("confirmPassword")}
                  />
                  <FieldError field="confirmPassword" />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSuccess}
                  className="w-full disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-[#ab5ff7] to-[#923af0] hover:from-[#b975fb] hover:to-[#a14df7] text-white font-bold tracking-widest text-sm py-4 rounded-lg transition-all shadow-[0_0_20px_rgba(161,85,247,0.4)] hover:shadow-[0_0_30px_rgba(161,85,247,0.6)]"
                >
                  CREATE ACCOUNT
                </button>
              </div>

              <div className="text-center pt-4 border-t border-white/5 mt-2 pb-2">
                <p className="text-xs text-gray-500 font-medium">
                  Already have an account?{" "}
                  <Link href="/login" className="text-[#b16ff9] hover:text-white transition-colors ml-1 font-semibold">
                    Sign In
                  </Link>
                </p>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
