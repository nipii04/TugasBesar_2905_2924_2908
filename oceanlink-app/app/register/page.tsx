"use client";

import Link from "next/link";
import { ArrowLeft, Waves, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { registerUser } from "@/app/auth/actions";

const COUNTRY_CODES = [
  { code: "+62", country: "ID" },
  { code: "+1", country: "US/CA" },
  { code: "+44", country: "UK" },
  { code: "+61", country: "AU" },
  { code: "+81", country: "JP" },
  { code: "+86", country: "CN" },
  { code: "+65", country: "SG" },
  { code: "+60", country: "MY" },
  { code: "+49", country: "DE" },
  { code: "+33", country: "FR" },
];

type FieldErrors = {
  name?: string;
  email?: string;
  username?: string;
  password?: string;
  confirmPassword?: string;
  phone?: string;
  general?: string;
};

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    phoneCode: "+62",
    phoneNumber: "",
    company: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const getPasswordStrength = (pass: string) => {
    if (!pass) return null;
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Za-z]/.test(pass) && /[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score === 0) return { label: "Very Weak", color: "bg-red-500", text: "text-red-500", width: "w-1/4" };
    if (score === 1) return { label: "Weak", color: "bg-orange-500", text: "text-orange-500", width: "w-1/3" };
    if (score === 2) return { label: "Medium", color: "bg-yellow-500", text: "text-yellow-500", width: "w-2/3" };
    return { label: "Strong", color: "bg-green-500", text: "text-green-500", width: "w-full" };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const clearError = (field: keyof FieldErrors) =>
    setErrors((prev) => ({ ...prev, [field]: undefined }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: FieldErrors = {};

    if (!formData.name.trim()) newErrors.name = "Full name is required.";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!formData.email.includes("@")) {
      newErrors.email = "Invalid email format.";
    }
    if (!formData.username.trim()) newErrors.username = "Username is required.";
    if (!formData.password.trim()) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    } else if (!/[A-Za-z]/.test(formData.password) || !/[0-9]/.test(formData.password)) {
      newErrors.password = "Password must contain both letters and numbers.";
    }
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Confirm password is required.";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    const fullPhone = formData.phoneNumber.trim() ? `${formData.phoneCode}${formData.phoneNumber.trim()}` : "";

    if (fullPhone) {
      const phoneRegex = /^\+?[0-9]{8,15}$/;
      if (!phoneRegex.test(fullPhone.replace(/[\s-]/g, ''))) {
        newErrors.phone = "Invalid format. Please enter a valid number.";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("username", formData.username);
    payload.append("email", formData.email);
    if (fullPhone) payload.append("phone", fullPhone);
    payload.append("password", formData.password);

    const res = await registerUser(payload);

    if (!res.success) {
      setErrors({ general: res.error || "Failed to create account." });
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
                  <p>Account created successfully! Redirecting to login...</p>
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
                  <div className="flex gap-2">
                    <div className={`relative flex items-center bg-[#1b1c23] border rounded-lg transition-colors ${errors["phone" as keyof FieldErrors] ? "border-red-500/60" : "border-transparent focus-within:border-[#a155f7]/50"}`}>
                      <select
                        value={formData.phoneCode}
                        onChange={(e) => setFormData({ ...formData, phoneCode: e.target.value })}
                        className="appearance-none bg-transparent pl-3 pr-6 py-3 text-sm text-gray-300 focus:outline-none cursor-pointer"
                      >
                        {COUNTRY_CODES.map((c) => (
                          <option key={c.code} value={c.code} className="bg-[#1b1c23] text-white">
                            {c.country} ({c.code})
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-2 pointer-events-none text-gray-500 text-[10px]">▼</div>
                    </div>
                    <input
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => { setFormData({ ...formData, phoneNumber: e.target.value }); clearError("phone" as keyof FieldErrors); }}
                      placeholder="Phone number"
                      className={`flex-1 w-full bg-[#1b1c23] border rounded-lg px-4 py-3 text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none transition-colors ${
                        errors["phone" as keyof FieldErrors]
                          ? "border-red-500/60 focus:border-red-500"
                          : "border-transparent focus:border-[#a155f7]/50"
                      }`}
                    />
                  </div>
                  <FieldError field={"phone" as keyof FieldErrors} />
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
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => { setFormData({ ...formData, password: e.target.value }); clearError("password"); }}
                      placeholder="Min. 8 chars, letters & numbers"
                      className={`w-full bg-[#1b1c23] border rounded-lg pl-4 pr-12 py-3 text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none transition-colors ${
                        errors.password
                          ? "border-red-500/60 focus:border-red-500"
                          : "border-transparent focus:border-[#a155f7]/50"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {passwordStrength && !errors.password && (
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between items-center text-[10px] font-bold tracking-wider uppercase">
                        <span className="text-gray-400">Strength:</span>
                        <span className={passwordStrength.text}>{passwordStrength.label}</span>
                      </div>
                      <div className="h-1 w-full bg-[#1b1c23] rounded-full overflow-hidden">
                        <div className={`h-full ${passwordStrength.color} ${passwordStrength.width} transition-all duration-300`}></div>
                      </div>
                    </div>
                  )}
                  <FieldError field="password" />
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold tracking-wider text-gray-300 uppercase">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => { setFormData({ ...formData, confirmPassword: e.target.value }); clearError("confirmPassword"); }}
                      placeholder="Repeat password"
                      className={`w-full bg-[#1b1c23] border rounded-lg pl-4 pr-12 py-3 text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none transition-colors ${
                        errors.confirmPassword
                          ? "border-red-500/60 focus:border-red-500"
                          : "border-transparent focus:border-[#a155f7]/50"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
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
